import { EmployeeOnboardingService, PayrollComponentsSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';

const EmpPayrollForm = ({ record, onCloseModal }) => {
    const [form] = Form.useForm();
    const service = new PayrollRecordsSharedService();
    const payrollComponentsService = new PayrollComponentsSharedService()
    const addEmployeeService = new EmployeeOnboardingService();
    const [payrollRecords, setPayrollRecords] = useState<any>([]);
    const [payrollComponents, setPayrollComponents] = useState<any>([])
    const [changedGrossValue, setChangedGrossValue] = useState(null);
    const [isDerived, setIsDerived] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const { Option } = Select
    const [isDisabled, setIsDisabled] = useState(false);
    const [employeeData, setEmployeeData] = useState<any>([]);
    const { Text } = Typography;
    const [initialValues, setInitialValues] = useState({});
    // console.log(record, "recordrecordrecordo999")
    // console.log(record.id, "recordiitutyt")
    // console.log(record.employeeTypeId, "employeeTypeIdemployeeTypeId")

    useEffect(() => {
        if (record && payrollRecords) {
            const initialComponentRecords = payrollRecords[0]?.componentRecords || {};
            setInitialValues({
                ...form.getFieldsValue(),
                ...initialComponentRecords
            });
        }
    }, [record, payrollRecords]);
    useEffect(() => {
        if (payrollRecords) {
            const employeeType = payrollRecords[0]?.employeeTypeName;
            if (employeeType === "EMPLOYEE") {
                form.setFieldsValue({ incentive: "No" });
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
                form.setFieldsValue({ incentive: undefined });
            }
        }
    }, [payrollRecords, form]);

    useEffect(() => {
        if (employeeData) {
            form.setFieldsValue({ isEsicEligible: employeeData[0]?.isEsicEligible });
        }
    }, [employeeData, form]);

    useEffect(() => {
        getAllPayrollRecordsData();
        getAllPayrollComponentsEmployeeAganist();
        getRequestedEmpData();
    }, []);

    const getRequestedEmpData = async () => {
        const res = await addEmployeeService.getRequestedEmpData({ employeeId: record.id });
        const data = res?.data || [];
        setEmployeeData(data);
        calculateAndSetDerivedValues({ ...record, componentRecords: payrollRecords });
    };

    const getAllPayrollRecordsData = async () => {
        const res = await service.getAllPayrollRecordsData({ employeeId: record.id });
        const data = res?.data || [];
        setPayrollRecords(data);
        calculateAndSetDerivedValues({ ...record, componentRecords: data });
    };

    const getAllPayrollComponentsEmployeeAganist = async () => {
        try {
            const res = await payrollComponentsService.getAllPayrollComponentsEmployeeAganist({ employeeTypeId: record.employeeTypeId });
            if (res.status) {
                setPayrollComponents(res.data);
            } else {
                setPayrollComponents([]);
            }
            calculateAndSetDerivedValues({ ...record, componentRecords: payrollRecords });
        } catch (err) {
            console.log(err);
        }
    };

    const orderMap = payrollComponents?.reduce((acc, item) => {
        acc[item.columnName] = item.columnOrder;
        return acc;
    }, {});

    const handleUpdate = (values) => {
        const updatedComponentKeys = Object.entries(values)
            .filter(([key]) => key !== 'employeeId' && key !== 'employeeName' && key !== 'key' && key !== 'id' && key !== 'component_id' && key !== 'isEsicEligible' && key !== 'incentive')
            .map(([key, value]) => ({ [key]: value }));
        const payload = {
            id: record,
            componentKeys: updatedComponentKeys,
            isDerived: isDerived,
            isPending: isPending ? "PENDING" : "FINAL",
            incentive: values.incentive,
            isEsicEligible: values.isEsicEligible
        };
        addEmployeeService.updateSalaryForEmployee(payload)
            .then((res) => {
                if (res.status) {
                    service.updatePayrollRecordsFromEmployee(payload)
                    message.success(res.internalMessage);
                    getAllPayrollComponentsEmployeeAganist();
                    onCloseModal()
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((err) => {
                console.error(err.message);
            });
    };

    const handleIsPendingChange = (values) => {
        setIsPending(values);
    };

    const safeParse = (value) => parseFloat(value) || 0
    const calculateAndSetDerivedValues = (updatedRecord) => {
        const parsedComponentRecords = JSON.parse(updatedRecord.componentRecords[0].componentRecords);
        const grossValue = changedGrossValue || parsedComponentRecords.GROSS || 0
        let pfEarningComponents = []
        let getNumFromPF;
        let derivedValues = payrollComponents?.reduce((jj, {
            isDerived, derivedRule, employeeType,
            isPfEarning, isEsiEarning, componentName
        }) => {
            if (isPfEarning === 1 && employeeType === "EMPLOYEE") {
                pfEarningComponents.push(componentName)
            }
            if (derivedRule && componentName !== "GROSS") {
                try {
                    const match = derivedRule.match(/BASIC\s*\*\s*([\d+]+)/);
                    if (match) {
                        getNumFromPF = match[1].match(/\d+/g).map(Number)
                    }
                    const matchDerivedRule = derivedRule.match(/[A-Za-z]+\s*\*\s*(\d+)%/)
                    if (matchDerivedRule) {
                        const calculateByPercent = parseFloat(matchDerivedRule[1]) / 100
                        jj[componentName] = grossValue * calculateByPercent
                    }
                } catch (err) {
                    console.error(`Error calculating ${componentName}:`, err)
                }
            }
            return jj
        }, {})
        const basic = safeParse(derivedValues["BASIC"] || parsedComponentRecords.BASIC)
        const hra = safeParse(derivedValues["HRA"] || parsedComponentRecords.HRA)
        const convyAllo = safeParse(derivedValues["CONVY ALLO"] || parsedComponentRecords["CONVY ALLO"]) ||
            safeParse(derivedValues["CONVY ALLOWANCES"] || parsedComponentRecords["CONVY ALLOWANCES"])
        const childEdu = safeParse(derivedValues["CHILD EDU"] || parsedComponentRecords["CHILD EDU"]) ||
            safeParse(derivedValues["CHILD EDUCATION"] || parsedComponentRecords["CHILD EDUCATION"])
        derivedValues["SPL PAY"] = grossValue - basic - hra - convyAllo - childEdu;
        if (pfEarningComponents.length > 0 && getNumFromPF) {
            let pfBaseValue = pfEarningComponents.reduce((sum, component) => {
                return sum + safeParse(derivedValues[component] || parsedComponentRecords[component])
            }, 0)
            derivedValues["PF"] = (pfBaseValue * getNumFromPF) / 100
        }
        derivedValues["ESI"] = grossValue * (0.75 / 100)
        form.setFieldsValue(derivedValues)
    };

    const handleGrossChange = (value) => {
        setChangedGrossValue(value)
        const isEsicEligible = employeeData?.[0]?.isEsicEligible === "NO"
        if (isEsicEligible && value > 21000) {
            message.warning("Gross Was Above 21000")
        }
        if (isDerived) {
            calculateAndSetDerivedValues({ ...record, componentRecords: payrollRecords })
        } else {
            form.setFieldsValue({ ...form.getFieldsValue(), GROSS: value })
        }
    };

    const handleDerivedChange = (checked) => {
        setIsDerived(checked)
        if (checked) {
            calculateAndSetDerivedValues({ ...record, componentRecords: payrollRecords })
        } else {
            const existingValues = form.getFieldsValue()
            form.setFieldsValue(existingValues)
        }
    };


    const handleReset = () => {
        setIsDerived(false);
        form.setFieldsValue(initialValues); // Reset to the stored initial values
    };

    const recalculateSplPay = (updatedValues) => {
        const grossValue = updatedValues["GROSS"] || 0
        const basic = updatedValues["BASIC"] || 0
        const hra = updatedValues["HRA"] || 0
        const convyAllo = updatedValues["CONVY ALLOWANCES"] || 0
        const childEdu = updatedValues["CHILD EDU"] || 0
        const splPay = grossValue - basic - hra - convyAllo - childEdu
        form.setFieldsValue({ "SPL PAY": splPay })
    };
    return (
        <Card>
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                {/* <Row>
                    <Col span={24}>
                        <div style={{ textAlign: "left", marginBottom: "10px" }}>
                            <Text strong style={{ fontSize: "14px" }}>
                                Employee Name:
                            </Text>{" "}
                            <Text style={{ fontSize: "14px" }}>
                                {employeeData[0]?.firstName + " " + employeeData[0]?.lastName}
                            </Text>
                        </div>
                    </Col>
                </Row> */}
                <Row gutter={16}>
                    <Form.Item name="employeeId" hidden>
                        <Input />
                    </Form.Item>
                    {payrollRecords.map((item, index) => {
                        const componentRecords = JSON.parse(item.componentRecords)
                        const sortedEntries = Object.entries(componentRecords).sort((a, b) => {
                            const orderA = orderMap[a[0]] || Infinity
                            const orderB = orderMap[b[0]] || Infinity
                            return orderA - orderB
                        })

                        return sortedEntries.map(([key, value]) => (
                            <Col span={8} key={index}>
                                <Form.Item name={key} label={key} initialValue={value}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        disabled={isDerived || key.includes("CHILD EDU") || key.includes("SPL PAY")}
                                        onChange={(val) => {
                                            if (!isDerived) {
                                                const updatedValues = { ...form.getFieldsValue(), [key]: val };
                                                if (key === "GROSS") {
                                                    handleGrossChange(val);
                                                } else if (["BASIC", "HRA", "CONVY ALLOWANCES"].includes(key)) {
                                                    recalculateSplPay(updatedValues);
                                                }
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        ));
                    })}
                    <Col span={8}>
                        <Form.Item label="Is ESIC Eligible" name="isEsicEligible">
                            <Select placeholder="Select Is ESIC Eligible" allowClear>
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Incentive" name="incentive">
                            <Select placeholder="Select Incentive" allowClear disabled={isDisabled}>
                                <Option value="YES">YES</Option>
                                <Option value="NO">NO</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <br />
                <div style={{ float: 'right' }}>
                    <Button type="primary" onClick={handleReset}>
                        Reset
                    </Button>&nbsp;&nbsp;
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </div>
                <div style={{ float: 'left' }}>
                    <Form.Item>
                        <Checkbox
                            checked={isDerived}
                            onChange={(e) => handleDerivedChange(e.target.checked)}
                        >
                            Is Derived
                        </Checkbox>
                    </Form.Item>
                </div>
                <div style={{ float: 'left' }}>
                    <Form.Item>
                        <Checkbox
                            checked={isPending}
                            onChange={(e) => handleIsPendingChange(e.target.checked)}
                        >
                            Is Pending
                        </Checkbox>
                    </Form.Item>
                </div>
            </Form>
        </Card>
    );
};

export default EmpPayrollForm;
