import { UndoOutlined } from "@ant-design/icons";
import { DivisionDto } from "@hrexpert/shared-models";
import { CompanySharedService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export interface Props {
    companyData: any;
    updateDetails: (Style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    companyForm?: FormInstance<any>;
    getCompany: () => void
}
const CompanyForm = (props: Props) => {

    const [form] = Form.useForm();
    const service = new CompanySharedService();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false)
    let navigate = useNavigate();
    const onReset = () => {
        form.resetFields();
    };

    const createCompany = async (val: DivisionDto) => {
        setDisable(true)
        try {
            service.createCompany(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    setDisable(false)
                    props.closeForm()
                    props.getCompany()
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

    const saveData = (values: DivisionDto) => {
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            createCompany(values);
        }

    };

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.companyData} >
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden     >
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="companyName"
                            label="CompanyName"
                            rules={[
                                { required: true, message: "Please Enter Company " },

                            ]}
                        >
                            <Input placeholder="Enter Company Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="companyCode"
                            label="Company Code"
                            rules={[
                                { required: true, message: "Please Enter Company Code" },

                            ]}
                        >
                            <Input placeholder="Enter Company Code" />
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
}
export default CompanyForm

