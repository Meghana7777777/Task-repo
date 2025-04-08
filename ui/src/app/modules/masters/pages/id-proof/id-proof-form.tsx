import { UndoOutlined } from "@ant-design/icons";
import { IdProofService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { IdProofDto } from "libs/shared-models/src/lib/masters/id-proof/id-proof-dto";

export interface Props {
    data: IdProofDto | any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    form?: FormInstance<any>;
    getAll: () => void
}

const IdProofForm = (props: Props) => {
    const [form] = Form.useForm();
    const [disable, setDisable] = useState<boolean>(false);
    const idProofService = new IdProofService();

    useEffect(() => {
        if (props.data) {
            form.setFieldsValue(props.data);
        }
    }, [props.data, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createIdProof =  (val: IdProofDto) => {
        try {
            idProofService.createIdProof(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAll()
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setDisable(false);
        }
    };

    const saveData = (val:IdProofDto) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.data?.id });
        }
        else {
            createIdProof(val)
        }
    }



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.data}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please Enter Id Proof Name" }]}
                        >
                            <Input placeholder="Enter Id Proof  Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                                disabled={disable}
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
                                disabled={disable}
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

export default IdProofForm;
