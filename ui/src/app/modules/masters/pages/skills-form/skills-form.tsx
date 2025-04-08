import { UndoOutlined } from "@ant-design/icons";
import { SkillsReq } from '@hrexpert/shared-models';
import { SkillsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export interface Props {
    // skillsData: SkillsReq;
    skillsData: any
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    skillsForm?: FormInstance<any>;
    getSkills: () => void
}

const SkillsForm = (props: Props) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate();
    const service = new SkillsSharedService();

    useEffect(() => {
        if (props.skillsData) {
            form.setFieldsValue(props.skillsData);
        }
    }, [props.skillsData, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createSkills = async (val: SkillsReq) => {
        try {
            service.createSkills(val).then((res) => {
                if (res.status) {
                    message.success('Created SuccessFully');
                    props.closeForm()
                    props.getSkills()
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
            props.updateDetails({ ...val, id: props.skillsData?.id });
        }
        else {
            createSkills(val)
        }
    }


    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.skillsData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please Enter Name" }]}
                        >
                            <Input placeholder="Enter Name" />
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

export default SkillsForm;
