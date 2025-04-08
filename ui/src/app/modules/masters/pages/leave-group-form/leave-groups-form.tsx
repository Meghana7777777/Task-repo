import { UndoOutlined } from "@ant-design/icons";
import { LeaveGroupsDto } from '@hrexpert/shared-models';
import { LeaveGroupsService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
    leaveGroupsData?: LeaveGroupsDto;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    LeaveGroupsForm?: FormInstance<any>;
    getAllLeaveGroups: () => void
}

const LeaveGroupsForm = (props: Props) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate();
    const leaveGroupsService = new LeaveGroupsService();

    useEffect(() => {
        if (props.leaveGroupsData) {
            form.setFieldsValue(props.leaveGroupsData);
        }
    }, [props.leaveGroupsData, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createLeaveGroups = async (val: LeaveGroupsDto) => {
        try {
            leaveGroupsService.createLeaveGroups(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllLeaveGroups()
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
            props.updateDetails({ ...val, id: props.leaveGroupsData?.id });
        }
        else {
            createLeaveGroups(val)
        }
    }



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leaveGroupsData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="name"
                            label="Leave Group Name"
                            rules={[{ required: true, message: "Please Enter Leave Group Name" }]}
                        >
                            <Input placeholder="Enter Leave Group Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="code"
                            label="Leave Group Code"
                            rules={[{ required: true, message: "Please Enter Leave Group Code" }]}
                        >
                            <Input placeholder="Enter Leave Group Code" />
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

export default LeaveGroupsForm;
