import { UndoOutlined } from '@ant-design/icons';
import { AlertMessages, PayrollCodeBranchMappingReq } from '@hrexpert/shared-models';
import { PayrollCodeBranchMappingSharedService, PayrollComponentsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import { DepartmentReq } from 'libs/shared-models/src/lib/masters/departments/department-req';
import { useEffect } from 'react';

export interface CodeBranchEmpTypeFormProps {
    payrollCodeBranch?: DepartmentReq | any;
    isUpdate?: boolean;
    closeForm?: () => void;
    employeeData?: any
    branches?: any
    employeType?: any
    data?: any
}

export default function CodeBranchEmpTypeForm(props: CodeBranchEmpTypeFormProps) {
    const [form] = Form.useForm();
    const service = new PayrollCodeBranchMappingSharedService()
    const componentsService = new PayrollComponentsSharedService()
    const { Option } = Select

    useEffect(() => {
        if (props.payrollCodeBranch) {
            form.setFieldsValue(props.payrollCodeBranch);
        }
    }, [props.payrollCodeBranch, form]);


    const createPayrollCodeBranchMapping = (req: PayrollCodeBranchMappingReq) => {
        try {
            componentsService.updateEmployeeTypeInPayrollComponents(req).then((res) => {
                if (res.status) {
                    service.createPayrollCodeBranchMapping(req).then((res) => {
                        message.success("Payroll Code Mapped to Branch Successfully")
                        props.closeForm()
                    })
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updatePayrollCodeBranchMapping = (req: any) => {
        try {
            componentsService.updateEmployeeTypeInPayrollComponents(req).then((res) => {
                if (res.status) {
                    service.updatePayrollCodeBranchMapping(req).then((res) => {
                        message.success("Updated Successfully")
                        props.closeForm()
                    })
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    };

    const saveData = (val: any) => {
        if (props.isUpdate) {
            updatePayrollCodeBranchMapping({ ...val, id: props.payrollCodeBranch?.id });
        }
        else {
            createPayrollCodeBranchMapping(val)
        }
    }

    const onReset = () => {
        form.resetFields()
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 4 }
        },
    };

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.payrollCodeBranch}>
                <Row gutter={8}>
                    <Form.Item name="id" label="id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item label={'Payroll Code'} name='payrollCode'>
                            <Select
                                placeholder="Select Payroll Code"
                                showSearch allowClear
                                optionFilterProp="children"
                            >
                                {props.data.map((pc) => (
                                    <Option key={pc.id} value={pc.payrollCode}>
                                        {pc.payrollCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item label={'Branch'} name='branchId'>
                            <Select
                                placeholder="Select branch"
                                showSearch allowClear
                                optionFilterProp="children"
                            >
                                {props.branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='Employee Type' name='employeeTypeId'>
                            <Select
                                placeholder="Select Employee Type"
                                showSearch
                                allowClear
                                style={{ width: "100%" }}
                            >
                                {props.employeType?.map((empTy) => (
                                    <Option key={empTy.id} value={empTy.id}>
                                        {empTy.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                            >
                                {props.isUpdate ? "Update" : "Submit"}
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
    )
}
