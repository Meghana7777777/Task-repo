import { PayrollComponentsSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

const EmployeePayrollCompForm = ({ record, openModal }) => {
    const [form] = Form.useForm();
    const service = new PayrollRecordsSharedService();
    const payrollComponentService = new PayrollComponentsSharedService()
    const [payCompData, setPayCompData] = useState<any>([])
    const [isDerived, setIsDerived] = useState(false);
    const [changedGrossValue, setChangedGrossValue] = useState(null);
    const [payrollComponents, setPayrollComponents] = useState([])
    const payrollComponentsService = new PayrollComponentsSharedService()
    const [isPending, setIsPending] = useState(false);

    const { Option } = Select
    useEffect(() => {
        if (record) {
            setChangedGrossValue(null);
            setPayrollComponents([]);
            form.setFieldsValue({
                ...record,
                ...Object.fromEntries(record.componentKeys.map((item) => Object.entries(item)[0])),
            });
        } else {
            setChangedGrossValue(null);
            setPayrollComponents([]);
            form.resetFields();
        }
    }, [record, form]);

    console.log(record, "record")

    useEffect(() => {
        getAllPayrollComponents()
        getPayrollComponentsByOrder()
    }, [form])

    const getAllPayrollComponents = () => {
        try {
            payrollComponentService.getAllPayrollComponents().then((res) => {
                if (res.status) {
                    setPayCompData(res.data)
                } else {
                    setPayCompData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleSave = (values) => {
        const updatedComponentKeys = Object.entries(values)
            .filter(([key]) => key !== 'employeeId' && key !== 'employeeName' && key !== 'key' && key !== 'id' && key !== 'component_id')
            .map(([key, value]) => ({ [key]: value }));
        const payload = {
            key: record.key,
            id: record.id,
            employeeId: values.employeeId,
            component_id: record.component_id,
            employeeName: values.employeeName,
            componentKeys: updatedComponentKeys,
            payrollMonth: record.payrollMonth,
            payrollWeek: record.payrollWeek,
            isDerived: isDerived,
            isPending: isPending ? "PENDING" : "FINAL",
            incentive: values.incentive
        };
        service.updatePayrollCompRecords(payload)
            .then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllPayrollComponents();
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((err) => {
                console.error(err.message);
            });
    };

    const handleGrossChange = (value) => {
        setChangedGrossValue(value);
        if (isDerived) {
            calculateDerivedValues({
                ...record,
                componentKeys: {
                    ...record.componentKeys,
                    "0": { GROSS: value }
                }
            });
        }
    };

    console.log(changedGrossValue, 'GGGGGGGGGGGGGG')
    const calculateDerivedValues = (updatedRecord) => {
        console.log(updatedRecord, "LLLLL")
        const grossValue = changedGrossValue || Object.values(updatedRecord.componentKeys).find(obj => obj["GROSS"])?.["GROSS"] || 0;
        let pfEarningComponents = []
        let getNumFromPF;
        let derivedValues = payCompData?.reduce((jj, { isDerived, derivedRule, employeeType, isPfEarning, isEsiEarning, componentName }) => {
            if (isPfEarning === 1 && employeeType === "EMPLOYEE") {
                pfEarningComponents.push(componentName);
            }
            if (derivedRule && componentName !== "GROSS") {
                try {
                    const match = derivedRule.match(/BASIC\s*\*\s*([\d+]+)/);
                    if (match) {
                        getNumFromPF = match[1].match(/\d+/g).map(Number);
                    }
                    const matchDerivedRule = derivedRule.match(/[A-Za-z]+\s*\*\s*(\d+)%/);
                    if (matchDerivedRule) {
                        const calculateByPercent = parseFloat(matchDerivedRule[1]) / 100;
                        jj[componentName] = grossValue * calculateByPercent;
                    }
                } catch (err) {
                    console.error(`Error calculating ${componentName}:`, err);
                }
            }
            return jj;
        }, {});
        const basic = parseFloat(derivedValues["BASIC"] || Object.values(updatedRecord.componentKeys).find(obj => obj["BASIC"])?.["BASIC"] || 0);
        const hra = parseFloat(derivedValues["HRA"] || Object.values(updatedRecord.componentKeys).find(obj => obj["HRA"])?.["HRA"] || 0);
        const convyAllo = parseFloat(derivedValues["CONVY ALLO"] || Object.values(updatedRecord.componentKeys).find(obj => obj["CONVY ALLO"])?.["CONVY ALLO"] || 0)
            || parseFloat(derivedValues["CONVY ALLOWANCES"] || Object.values(updatedRecord.componentKeys).find(obj => obj["CONVY ALLOWANCES"])?.["CONVY ALLOWANCES"] || 0)
        const childEdu = parseFloat(derivedValues["CHILD EDU"] || Object.values(updatedRecord.componentKeys).find(obj => obj["CHILD EDU"])?.["CHILD EDU"] || 0) || parseFloat(derivedValues["CHILD EDUCATION"] || Object.values(updatedRecord.componentKeys).find(obj => obj["CHILD EDUCATION"])?.["CHILD EDUCATION"] || 0)
        if (pfEarningComponents.length > 0 && getNumFromPF) {
            let pfBaseValue = pfEarningComponents.reduce((sum, component) => {
                return sum + (derivedValues[component] || updatedRecord.componentKeys[component]);
            }, 0);
            derivedValues["PF"] = (pfBaseValue * getNumFromPF) / 100;
        }
        derivedValues["ESI"] = grossValue * (0.75 / 100)
        derivedValues["SPL PAY"] = grossValue - basic - hra - convyAllo - childEdu;
        form.setFieldsValue(derivedValues);
    };

    const handleDerivedChange = (checked) => {
        setIsDerived(checked);
        calculateDerivedValues({ ...record, componentKeys: { ...record.componentKeys } });
    };

    const handleIsPendingChange = (values) => {
        setIsPending(values);
    };

    const getPayrollComponentsByOrder = async () => {
        const res = await payrollComponentsService.getPayrollComponentsByOrder()
        setPayrollComponents(res.data)
    }
    const orderMap = payrollComponents?.reduce((acc, item) => {
        acc[item.columnName] = item.columnOrder;
        return acc;
    }, {});

    const recalculateSplPay = (updatedValues) => {
        const grossValue = updatedValues["GROSS"] || 0;
        const basic = updatedValues["BASIC"] || 0;
        const hra = updatedValues["HRA"] || 0;
        const convyAllo = updatedValues["CONVY ALLOWANCES"] || 0;
        const childEdu = updatedValues["CHILD EDU"] || 0;

        // Calculate SPL PAY
        let splPay = grossValue - basic - hra - convyAllo - childEdu;
        if (splPay < 0) splPay = 0;
        // Update the form field for SPL PAY
        form.setFieldsValue({ "SPL PAY": splPay });
    };

    return (
        <Card>
            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Row gutter={16}>
                    <Form.Item name="employeeId" hidden>
                        <Input />
                    </Form.Item>
                    <Col span={8}>
                        <Form.Item name="employeeName" label="Employee Name">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    {record?.componentKeys
                        ?.sort((a, b) => {
                            const [keyA] = Object.keys(a);
                            const [keyB] = Object.keys(b);
                            return (orderMap[keyA] || Infinity) - (orderMap[keyB] || Infinity);
                        })
                        .map((item, index) => {
                            const [key, value] = Object.entries(item)[0];
                            return (
                                <Col span={8} key={index}>
                                    <Form.Item name={key} label={key} initialValue={value}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            disabled={key.includes("CHILD EDU") || key.includes("SPL PAY") || key.includes("PF") || key.includes("ESI")}
                                            onChange={(val) => {
                                                const updatedValues = { ...form.getFieldsValue(), [key]: val };
                                                if (key === "GROSS") {
                                                    handleGrossChange(val);
                                                } else if (["BASIC", "HRA", "CONVY ALLOWANCES"].includes(key)) {
                                                    recalculateSplPay(updatedValues);
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        })}
                    {/* <Col span={8}>
                        <Form.Item label="Incentive" name="incentive">
                            <Select placeholder="Select Incentive" allowClear>
                                <Option value="YES">YES</Option>
                                <Option value="NO">NO</Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
                <br />
                {record && (
                    <>
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
                    </>
                )}
                <div style={{ float: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </div>
            </Form>
        </Card>
    );

};

export default EmployeePayrollCompForm;
