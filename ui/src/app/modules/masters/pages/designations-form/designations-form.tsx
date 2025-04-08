import { UndoOutlined } from "@ant-design/icons";
import { DesignationsReq } from '@hrexpert/shared-models';
import { DesignationsService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, message } from "antd";
import { useEffect } from "react";


export interface Props {
    isUpdate?: boolean;
    designationsData?: any
    closeModal?: () => void
    getDesignations?: () => void
}

const DesignationsForm = ({ isUpdate, designationsData, closeModal, getDesignations }: Props) => {
    const [form] = Form.useForm();
    const service = new DesignationsService();

    useEffect(() => {
        if (designationsData) {
            form.setFieldsValue(designationsData);
        }
    }, [designationsData]);

    const onReset = () => form.resetFields();



    const createDesignations = async (val: DesignationsReq) => {
        try {
            service.createDesignations(val).then((res) => {
                if (res.status) {
                    message.success('Created SuccessFully');
                    closeModal?.()
                    getDesignations()
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    const updateDesginations = (formData: any) => {
        try {
            service.updateDesginations(formData)
                .then((res) => {
                    if (res.status) {
                        message.success("Updated SuccessFully");
                        closeModal?.()
                        getDesignations()
                    } else {
                        message.error(res.internalMessage);
                    }
                })
        } catch (error) {
            console.error("Error Updating Designations Details:", error);
        }
    };

    const saveData = (val: any) => {
        if (isUpdate) {
            updateDesginations({ ...val, id: designationsData?.id });
        }
        else {
            createDesignations(val)
        }
    }

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={designationsData}>
                <Row gutter={8}>
                    <Form.Item name="id"  hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please Enter Name" }]}
                        >
                            <Input placeholder="Enter Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                        <Form.Item
                            name="designationCode"
                            label="Designation Code"
                            rules={[{ required: true, message: "Please Enter Designation Code" }]}
                        >
                            <Input placeholder="Enter Designation Code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={2} xl={2}>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="ant-submit-btn"
                            style={{ marginTop: 23 }}
                        >
                            {isUpdate ? "Update" : "Submit"}
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={2} xl={2}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                                style={{ marginTop: 23 }}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default DesignationsForm;
