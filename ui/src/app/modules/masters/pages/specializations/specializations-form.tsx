import { UndoOutlined } from "@ant-design/icons";
import { QualificationsReq } from '@hrexpert/shared-models';
import { QualificationsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";


export interface Props {
    // qualificationsData: SkillsDto;
    specializationsData: any
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    specializationsForm?: FormInstance<any>;
    getSpecializations: () => void
    qualifications: any
}

const SpecializationsForm = (props: Props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const service = new QualificationsSharedService();
    const Option = Select



    useEffect(() => {
        if (props.specializationsData) {
            form.setFieldsValue(props.specializationsData);
        }
    }, [props.specializationsData, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createSpecializations = async (val: QualificationsReq) => {
        setLoading(true)
        try {
            service.createSpecializations(val).then((res) => {
                if (res.status) {
                    message.success('Created SuccessFully');
                    setLoading(false)
                    props.closeForm()
                    props.getSpecializations()
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        }
    };


    const saveData = (val: any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.specializationsData?.id });
        }
        else {
            createSpecializations(val)
        }
    }


    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.specializationsData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='Qualification' name='qualificationId' rules={[{ required: true, message: 'Please select a qualification' }]}>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select qualification" >
                                {props?.qualifications.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="specialization"
                            label="Specialization"
                            rules={[{ required: true, message: "Please Enter specialization" }]}
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
    );
};

export default SpecializationsForm;
