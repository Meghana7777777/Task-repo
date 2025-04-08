import { UndoOutlined } from '@ant-design/icons';
import { AlertMessages } from '@hrexpert/shared-models';
import { PayrollComponentsSharedService, PayrollEmployeeSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface editProps {
    selectedEditData: any
    updateDetails: (style: any) => void;
}

const UpdateNonRecForm = (props: editProps) => {
    const [form] = Form.useForm();
    const payrollRecordsSharedService = new PayrollRecordsSharedService()
    const Option = Select
    const [employees, setEmployees] = useState<any>([]);
    const [components, setComponents] = useState<any>([])
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const payrollEmployeeSharedService = new PayrollEmployeeSharedService()

    useEffect(() => {
        setData()
    }, [props.selectedEditData, form]);
    useEffect(() => {
        getAllPayrollNonRecurringComponents()
        getPayRollEmpDetails()
    }, []);

    console.log(props?.selectedEditData, '----------mohan')

    const setData = () => {
        const filteredTerms = JSON.parse(props?.selectedEditData.TermDetails).filter((rec) => rec.isProcessed === 0)
        if (props?.selectedEditData) {
            form.setFieldsValue({
                id: props?.selectedEditData?.id,
                payRollEmployee: props?.selectedEditData?.employeeId,
                payRollComponent: props?.selectedEditData?.payRollCompId,
                remainingAmount: (filteredTerms[0].emiAmount) * (filteredTerms.length),
                emiCount: filteredTerms.length,
                emiAmount: filteredTerms[0].emiAmount,
                currentDate: dayjs(filteredTerms[0].payMonth),
                endDate: dayjs(filteredTerms[filteredTerms.length - 1].payMonth),
            });
        }
    }


    const getPayRollEmpDetails = () => {
        try {
            payrollEmployeeSharedService.getPayRollEmpDetails().then((res) => {
                if (res.status) {
                    setEmployees(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllPayrollNonRecurringComponents = () => {
        try {
            payrollComponentsSharedService.getAllPayrollNonRecurringComponents().then((res) => {
                if (res.status) {
                    setComponents(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const validation = () => {
        if (form.getFieldValue('remainingAmount') && form.getFieldValue('emiCount')) {
            const emiAmount = (form.getFieldValue('remainingAmount')) / (form.getFieldValue('emiCount'))
            form.setFieldsValue({ emiAmount: emiAmount })
        } else {
            form.setFieldsValue({ emiCount: '' })
            form.setFieldsValue({ emiAmount: '' })
            if (!form.getFieldValue('remainingAmount')) {
                form.setFields([{ name: 'remainingAmount', errors: ['Please fill in the Total Amount'] }])
            }
        }
    }

    const handleStartMonthChange = (value) => {
        const emiCount = form.getFieldValue("emiCount");
        if (emiCount && value) {
            const endDate = dayjs(value).add(emiCount - 1, "months")
            form.setFieldsValue({ endDate });
        } else {
            form.setFieldsValue({ endDate: null });
        }
    };

    const handleEmiCountChange = (value) => {
        const currentDate = form.getFieldValue("currentDate");
        if (currentDate && value) {
            const endDate = dayjs(currentDate).add(value - 1, "months")
            form.setFieldsValue({ endDate });
        } else {
            form.setFieldsValue({ endDate: null });
        }
    };

    const reset = () => {
        setData()
    }

    const saveData = (val: any) => {
        props.updateDetails({ ...val });
    }


    return (
        <>
            <Card title="Employee Monthly Installments" >
                <Form layout='vertical' form={form} onFinish={saveData}>
                    <Row gutter={24}>
                        <Form.Item hidden label='id' name='id' rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} label='Employee Name' name='payRollEmployee' rules={[{ required: true, message: 'Please select a Employee' }]}>
                            <Select showSearch allowClear
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} label='Pay Roll' name='payRollComponent'
                            rules={[{ required: true, message: 'Please select a PayRoll!' }]}
                        >
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Payroll Name"  >
                                {components.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.componentName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Remaining Amount' name='remainingAmount' rules={[{ required: true, message: 'Please Enter Amount!' }, { pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                <Input disabled onChange={validation} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='EMI Months' name='emiCount' rules={[{ required: true, message: 'Please select a emi count!' }]}>
                                <InputNumber
                                    onChange={(value) => { validation(), handleEmiCountChange(value) }}
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='EMI Amount' name='emiAmount' rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label="Current Month" name="currentDate" rules={[
                                { required: true, message: "Please select a start month!" },
                            ]}>
                                <DatePicker
                                    picker="month"
                                    style={{ width: "100%" }}
                                    // disabledDate={(current) => {
                                    //     return current && current < moment().startOf("day");
                                    // }}
                                    onChange={handleStartMonthChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label="End Month" name="endDate" rules={[
                                { required: true, message: "Please select a end month!" },
                            ]}>
                                <DatePicker
                                    disabled
                                    picker="month"
                                    style={{ width: "100%" }}
                                // disabledDate={(current) => {
                                //     return current && current < moment().startOf("day");
                                // }}
                                />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={24} justify="start" style={{ marginTop: "16px" }}>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button icon={<UndoOutlined />} onClick={reset} type="dashed" danger>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </>
    )
}

export default UpdateNonRecForm

