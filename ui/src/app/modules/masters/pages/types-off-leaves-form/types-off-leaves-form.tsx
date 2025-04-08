import { UndoOutlined } from "@ant-design/icons";
import { BranchesService, TypesOfLeavesService } from '@hrexpert/shared-services';
import { BranchesDto, TypeOfLeavesDto } from '@hrexpert/shared-models';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
    leavesData: TypeOfLeavesDto | any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    typesOfLeavesForm?: FormInstance<any>;
    getAllTypesOfLeaves: () => void
}

const TypesOfLeavesForm = (props: Props) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate();
    const service = new TypesOfLeavesService();

    useEffect(() => {
        if (props.leavesData) {
            form.setFieldsValue(props.leavesData);
        }
    }, [props.leavesData, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createTypesOfLeaves = async (val:TypeOfLeavesDto) => {
        try {
            service.createTypesOfLeaves(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllTypesOfLeaves()
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

    const saveData = (val:any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.leavesData?.id });
        }
        else {
            createTypesOfLeaves(val)
        }
    }



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leavesData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="typeOfLeave"
                            label="Type of Leave"
                            rules={[
                                { required: true, message: "Please Enter Type of Leave" },

                            ]}
                        >
                            <Input placeholder="Enter Type of Leave" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Leave Code"
                            name="leaveCode"
                            rules={[
                                { required: true, message: "Please Enter Leave Code" },
                            ]}
                        >
                             <Input placeholder="Enter Leave Code" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Default Leaves"
                            name="defaultLeaves"
                            rules={[
                                { required: true, message: "Please Enter Default Leaves" },
                            ]}
                        >
                             <Input placeholder="Enter Default Leaves" />
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

export default TypesOfLeavesForm;
