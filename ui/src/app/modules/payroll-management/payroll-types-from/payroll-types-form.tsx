import { UndoOutlined } from '@ant-design/icons';
import { PayrollTypesReq } from '@hrexpert/shared-models';
import { PayrollTypesSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';

export interface payrollTypesFormProps {
    payrollTypesData?: PayrollTypesReq | any;
    isUpdate?: boolean;
    closeForm: () => void;

}

export default function PayrollTypesForm(props: payrollTypesFormProps) {
    const [form] = Form.useForm();
    const service = new PayrollTypesSharedService()

    useEffect(() => {
        if (props.payrollTypesData) {
            form.setFieldsValue(props.payrollTypesData);
        }
    }, [props.payrollTypesData, form]);

    const createPayrollTypes = (req: PayrollTypesReq) => {
        try {
            service.createPayrollTypes(req).then((res) => {
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

    const updatePayrollTypes = (data: any) => {
        service.updatePayrollTypes(data)
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
        if (props.isUpdate) {
            updatePayrollTypes({ ...val, id: props.payrollTypesData?.id });
        }
        else {
            createPayrollTypes(val)
        }
    }

    const onReset = () => {
        form.resetFields()
    }

    return (
        <Card>
            <Form layout='vertical' scrollToFirstError form={form} onFinish={saveData} initialValues={props.payrollTypesData}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Name'
                            name='name'
                            rules={[
                                { required: true, message: "Please Enter Name" },
                            ]}>
                            <Input placeholder='Enter Name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label='Description'
                            name='description'
                            rules={[
                                { required: true, message: "Please Enter Description" },
                            ]}>
                            <TextArea placeholder='Enter Description' />
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
