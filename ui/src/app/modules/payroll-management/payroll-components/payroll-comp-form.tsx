import { ConsoleSqlOutlined, UndoOutlined } from '@ant-design/icons';
import { ComponentTypeEnum, PayrollComponentsFormReq, RoundStrgEnum, TypeEnum } from '@hrexpert/shared-models';
import { PayrollComponentsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
export interface payrollComponentsFormProps {
    payrollComponentsData?: PayrollComponentsFormReq | any;
    isUpdate?: boolean;
    closeForm: () => void;
}

export default function PayrollComponentsForm(props: payrollComponentsFormProps) {
    const [form] = Form.useForm();
    const [type, setType] = useState()
    const [roundStrgData, setRoundStrgData] = useState()
    const [componentTypeData, setComponentTypeData] = useState()
    const [empTypeData, setEmpTypeData] = useState<any>([])
    const [isDerived, setIsDerived] = useState<any>();
    const [isDerivedGross, setIsDerivedGross] = useState<any>();
    const [isFieldDisabled, setIsFieldDisabled] = useState<boolean>(true);
    const [derivedFrom, setDerivedFrom] = useState(null)
    const { Option } = Select;
    // const empTypeService = new EmployeeTypeService()
    const componentService = new PayrollComponentsSharedService()

    //   useEffect(()=>{
    //     getAllEmployeeTypesFetch()
    // },[])


    // const getAllEmployeeTypesFetch = async () => {
    //     try {
    //         empTypeService.getAllEmployeeTypes().then((res) => {
    //             if (res.status) {
    //                 setEmpTypeData(res.data)
    //             }
    //             else {
    //                 // console.log("[[[[[[[[[[")
    //                 message.error(res.internalMessage)
    //             }
    //         })
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    // useEffect(() => {
    //     console.log("Fetching employee types");
    //     getAllEmployeeTypesFetch();
    // }, []);

    useEffect(() => {
        const derivedValue = form.getFieldValue('derivedRule');
        const calculatedValue = form.getFieldValue('calculatedRule');
        if (derivedValue || calculatedValue) {
            setIsFieldDisabled(true);
        } else {
            setIsFieldDisabled(false);
        }
    }, [form]);

    useEffect(() => {
        if (props.payrollComponentsData && props.isUpdate) {
            const { isDerived, derivedRule, calculatedRule } = props.payrollComponentsData;
            form.setFieldsValue({
                ...props.payrollComponentsData,
                effDate: props.payrollComponentsData.effDate ? dayjs(props.payrollComponentsData.effDate, 'DD-MM-YYYY') : "-",
            });
            if (isDerived === 'Yes' && derivedRule) {
                setIsDerived('Yes');
                setIsFieldDisabled(true);
            } else if (isDerived === 'No' && calculatedRule) {
                setIsDerived('No');
                setIsFieldDisabled(true);
            } else {
                setIsFieldDisabled(false);
            }
        }
        if (props.isUpdate && props.payrollComponentsData) {
            const initialRule = props.payrollComponentsData.derivedRule || "";
            const [initialDerivedFrom, percentage] = initialRule.split("*").map((item) => item.trim());
            setDerivedFrom(initialDerivedFrom);
            form.setFieldsValue({
                derivedFrom: initialDerivedFrom,
                derivedRule: percentage ? percentage.replace("%", "").trim() : "",
            });
        }

    }, [props.payrollComponentsData, props.isUpdate, form]);

    useEffect(() => {
        if (props.isUpdate && props.payrollComponentsData) {
            const isGrossDerivedData = props.payrollComponentsData.isGrossDervied;
            const derivedValue = isGrossDerivedData === 1 ? "Yes" : isGrossDerivedData === 0 ? "No" : null;
            setIsDerivedGross(derivedValue)
            form.setFieldsValue({
                isGrossDerived: derivedValue,
            });
        }
    }, [props.payrollComponentsData, props.isUpdate, form]);
    

    const handleFieldChange = (changedValues: any) => {
        if ('derivedRule' in changedValues || 'calculatedRule' in changedValues) {
            const derivedValue = form.getFieldValue('derivedRule');
            const calculatedValue = form.getFieldValue('calculatedRule');
            if (derivedValue || calculatedValue) {
                setIsFieldDisabled(true);
            } else {
                setIsFieldDisabled(false);
            }
        }
    };

    const createPayrollTypes = (req: PayrollComponentsFormReq) => {
        try {
            componentService.createPayrollComponents(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage)
                    props.closeForm()
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updatePayrollComponents = (data: any) => {
        componentService.updatePayrollComponents(data)
            .then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    props.closeForm()
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Payroll Types details:", error);
            });
    };

    const saveData = (val: any) => {
        const formatedValue = {
            ...val,
            derivedRule: val.derivedFrom ? `${val.derivedFrom} * ${val.derivedRule}%` : null,
            effDate: dayjs(val.effDate, 'DD-MM-YYYY'),
        }
        if (props.isUpdate) {
            updatePayrollComponents({ ...formatedValue, id: props.payrollComponentsData?.id });
        }
        else {
            val.derivedRule = val.derivedFrom ? `${val.derivedFrom} * ${val.derivedRule}%` : null,
                createPayrollTypes(val)

        }
    }

    const onReset = () => {
        form.resetFields();
        setIsDerived(undefined);
        setIsFieldDisabled(false);
    };

    return (
        <Card style={{ justifyContent: "center", alignItems: 'center' }}>
            <Form
                layout="vertical"
                onValuesChange={handleFieldChange}
                scrollToFirstError form={form} onFinish={saveData} initialValues={props?.payrollComponentsData}
            >
                <Row gutter={[24, 24]} style={{ justifyContent: "center", alignItems: 'center' }}>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="employeeTypeId"
                            label="Employee Type"
                            initialValue={props.isUpdate ? props.payrollComponentsData?.employeeTypeId : undefined}
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Employee Type"
                                optionFilterProp="children"
                            >
                                <Select.Option value={1}>EMPLOYEE</Select.Option>
                                <Select.Option value={2}>WORKER</Select.Option>
                                <Select.Option value={3}>KARLAM WORKER</Select.Option>
                                <Select.Option value={4}>WEEKLY WORKER</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>



                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Type'
                            name='type'
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Type" }] : []}
                        >
                            <Select
                                id="type"
                                value={type}
                                onChange={(value) => setType(value)}
                                placeholder="Select Type"
                                allowClear
                            >
                                {Object.values(TypeEnum).map((option) => (
                                    <Option key={option} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Component'
                            name='componentName'
                            rules={!props.isUpdate ? [{ required: true, message: "Please Enter Component Name" }] : []}>
                            <Input placeholder='Enter Component' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Column'
                            name='columnName'
                            rules={!props.isUpdate ? [{ required: true, message: "Please Enter Column Name" }] : []}>
                            <Input placeholder='Enter Column' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ justifyContent: "center", alignItems: 'center' }}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Is Derived" name="isDerived"
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Is Derived" }] : []}>
                            <Select
                                placeholder="Select Is Derived"
                                onChange={(value) => {
                                    setIsDerived(value);
                                    setDerivedFrom(null);
                                }}
                                // disabled={isFieldDisabled}
                                allowClear
                            >
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Derived From" name="derivedFrom"
                        >
                            <Select
                                value={derivedFrom}
                                placeholder="Select Derived From"
                                onChange={(value) => setDerivedFrom(value)}
                                allowClear
                            >
                                <Option value="GROSS">GROSS</Option>
                                <Option value="BASIC">BASIC</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Derived Percentage" name="derivedRule"
                            rules={isDerived === 'Yes' || !props.isUpdate ? [{ required: false, message: "Please Enter Derived Rule" }] : []}
                        >
                            <Input
                                placeholder="Enter Derived Percentage"
                                disabled={isDerived !== 'Yes' || !derivedFrom}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label="Is Gross Derived"
                            name="isGrossDerived"
                            rules={
                                !props.isUpdate
                                    ? [{ required: true, message: "Please Select Is Derived" }]
                                    : []
                            }
                        >
                            <Select
                                value={isDerivedGross}
                                placeholder="Select Is Derived"
                                onChange={(value) => setIsDerivedGross(value)}
                                allowClear
                            >
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Cutoff Amount" name="cutoffAmount"
                        // rules={isDerived === 'No' || !props.isUpdate ? [{ required: true, message: "Please Enter Calculated Rule" }] : []}
                        >
                            <Input
                                placeholder="Enter Amount"
                                disabled={isDerived !== 'Yes'}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Amount" name="calculatedRule"
                        // rules={isDerived === 'No' || !props.isUpdate ? [{ required: true, message: "Please Enter Calculated Rule" }] : []}
                        >
                            <Input
                                placeholder="Enter Amount"
                                disabled={isDerived !== 'No'}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Round Strg'
                            name='roundStrg'
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Round Strg" }] : []}>
                            <Select
                                id="roundStrg"
                                value={roundStrgData}
                                onChange={(value) => setRoundStrgData(value)}
                                placeholder="Select Round Strg"
                                allowClear
                            >
                                {Object.values(RoundStrgEnum).map((option) => (
                                    <Option key={option} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label="Eff Date"
                            name="effDate"
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Eff Date" }] : []}>
                            <DatePicker
                                format='DD-MM-YYYY'
                                style={{ width: '100%' }}
                                placeholder='Select Eff Date'
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Component Type'
                            name='componentType'
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Component Type" }] : []}>
                            <Select
                                id="componentType"
                                value={componentTypeData}
                                onChange={(value) => setComponentTypeData(value)}
                                placeholder="Select Component Type"
                                allowClear
                            >
                                {Object.values(ComponentTypeEnum).map((option) => (
                                    <Option key={option} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Is PF Earning" name="isPfEarning"
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Is PF Earning" }] : []}>
                            <Select
                                placeholder="Select Is PF Earning"
                                allowClear
                            >
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Is ESI Earning" name="isEsiEarning"
                            rules={!props.isUpdate ? [{ required: true, message: "Please Select Is ESI Earning" }] : []}>
                            <Select
                                placeholder="Select Is ESI Earning"
                                allowClear
                            >
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} style={{ visibility: 'hidden' }}>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                {props.isUpdate ? 'Update' : 'Submit'}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Card>
    );
}