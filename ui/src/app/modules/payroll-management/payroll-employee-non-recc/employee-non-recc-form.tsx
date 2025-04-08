import { UndoOutlined } from '@ant-design/icons';
import { AlertMessages, BranchReq } from '@hrexpert/shared-models';
import { BranchesService, EmployeeOnboardingService, PayrollComponentsSharedService, PayrollEmployeeSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';


const EmployeeNonRecurringForm = () => {
    const [form] = Form.useForm();
    const Option = Select
    const [employees, setEmployees] = useState<any>([]);
    const [components, setComponents] = useState<any>([])
    const branchService = new BranchesService()
    const employeeDetails = new EmployeeOnboardingService()
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const payrollEmployeeSharedService = new PayrollEmployeeSharedService()
    const payrollRecordsSharedService = new PayrollRecordsSharedService()
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [branches, setBranches] = useState<any>([]);

    useEffect(() => {
        getAllPayrollNonRecurringComponents()
        getAllBranches();
        if (IAMClientAuthContext.user.roles != "SuperAdmin") {
            handleBranchChange(Number(IAMClientAuthContext.user.unitId))
        }
        getAllPayrollNonRecurringComponents()
    }, []);

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId: number) => {
        const branchRequest = new BranchReq(branchId);
        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

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

    const submit = (values) => {
        try {
            values.createdUser = role
            values.updatedUser = IAMClientAuthContext.user.employeeId
            payrollRecordsSharedService.createEmpNonRecurring(values).then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    form.resetFields()
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }

    }

    const validation = () => {
        if (form.getFieldValue('totalAmount') && form.getFieldValue('emiCount')) {
            const emiAmount = (form.getFieldValue('totalAmount')) / (form.getFieldValue('emiCount'))
            form.setFieldsValue({ emiAmount: emiAmount })
        } else {
            form.setFieldsValue({ emiCount: '' })
            form.setFieldsValue({ emiAmount: '' })
            if (!form.getFieldValue('totalAmount')) {
                form.setFields([{ name: 'totalAmount', errors: ['Please fill in the Total Amount'] }])
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
        const startDate = form.getFieldValue("startDate");
        if (startDate && value) {
            const endDate = dayjs(startDate).add(value - 1, "months")
            form.setFieldsValue({ endDate });
        } else {
            form.setFieldsValue({ endDate: null });
        }
    };

    return (
        <>
            <Card title="Employee Monthly Installments" >
                <Form layout='vertical' form={form} onFinish={submit}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branches"
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId)}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a branch',
                                    },
                                ]}>
                                <Select showSearch disabled={role === 'SuperAdmin' ? false : true}
                                    allowClear
                                    placeholder="Select Branch"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                    onChange={(value) => handleBranchChange(value)}>
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Employee Name' name='payRollEmployee' rules={[{ required: true, message: 'Please select a Employee' }]}
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.employeeId)} >
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees.map((rec: any) => (
                                        <Option value={rec.employeeId} key={rec.employeeId}>
                                            {rec.employeeCode} {rec.employeeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Pay Roll' name='payRollComponent'
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
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Total Amount' name='totalAmount' rules={[{ required: true, message: 'Please Enter Amount!' }, { pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                <Input onChange={validation} />
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
                            <Form.Item label="Start Month" name="startDate" rules={[
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
                            <Button color="primary" variant="outlined" htmlType="submit">
                                Submit
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button icon={<UndoOutlined />} htmlType="reset" type="dashed" danger>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </>
    )
}

export default EmployeeNonRecurringForm

