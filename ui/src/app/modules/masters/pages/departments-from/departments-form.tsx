import { UndoOutlined } from '@ant-design/icons';
import { ApplForLeavesSharedService, DepartmentService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, FormInstance, Input, message, Row, Select } from 'antd';
import { DepartmentReq } from 'libs/shared-models/src/lib/masters/departments/department-req';
import { useEffect, useState } from 'react';

export interface DepartmentsFormProps {
    departmentData?: DepartmentReq | any;
    isUpdate?: boolean;
    closeForm: () => void;
    employeeData?: any

}

export default function DepartmentsForm(props: DepartmentsFormProps) {
    const [form] = Form.useForm();
    const service = new DepartmentService() 
    const Option = Select

    useEffect(() => {
        if (props.departmentData) {
            form.setFieldsValue(props.departmentData);
        }
    }, [props.departmentData, form]);

    const createDepartments = (req: DepartmentReq) => {
        try {
            service.createDepartments(req).then((res) => {
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

    const updateDepartment = (data: any) => {
        service.updateDepartment(data)
            .then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    props.closeForm()
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Department details:", error);
            });
    };

    const saveData = (val: any) => {
        if (props.isUpdate) {
            updateDepartment({ ...val, id: props.departmentData?.id });
        }
        else {
            createDepartments(val)
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
            <Form layout='vertical' scrollToFirstError form={form} onFinish={saveData} initialValues={props.departmentData}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='Department Name' name='name' rules={[{ required: true, message: 'Enter Department'}]}>
                            <Input placeholder='Enter Name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='Department Code' name='code' rules={[
                            {
                                pattern: /^[0-9A-Za-z]{3}$/,
                                message: "Only 3 characters allowed",
                               // required: true
                            }
                        ]}>
                            <Input placeholder='Enter Code' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='HOD' name='hod' 
                        rules={[{ required: true, message: 'Select HOD'}]}>
                                <Select
                                mode='multiple'
                                    showSearch
                                    allowClear
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                    } >
                                    {props?.employeeData.map((employee) => (
                                        <Option key={employee.id} value={employee.id}>
                                            {employee.employeeCode} - {employee.employeeName}
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
