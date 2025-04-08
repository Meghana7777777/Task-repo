import { UndoOutlined } from "@ant-design/icons";
import { JobReq } from '@hrexpert/shared-models';
import { JobsService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useIAMClientState } from "../../../../common/iam-client-react";

export interface Props {
    jobsData?: JobReq;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    jobsForm?: FormInstance<any>;
    getAllJobs: () => void
}

const JobsForm = (props: Props) => {
    const [form] = Form.useForm();
    const [disable, setDisable] = useState<boolean>(false);
    const jobsService = new JobsService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();

    useEffect(() => {
        if (props.jobsData) {
            form.setFieldsValue(props.jobsData);
        }
    }, [props.jobsData, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createJob = async (val: JobReq) => {
        try {
            val.createdUser = IAMClientAuthContext.user.employeeCode
            jobsService.createJob(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllJobs()
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

    const saveData = (val: any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.jobsData?.id });
        }
        else {
            createJob(val)
        }
    }

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.jobsData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="jobCode"
                            label="Job Code"
                            rules={[{ required: true, message: "Please Enter Job Code" }]}
                        >
                            <Input placeholder="Enter Job Code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="jobDescription"
                            label="Job Description"
                            rules={[{ required: true, message: "Please Enter Job Description" }]}
                        >
                            <Input placeholder="Enter Job Description" />
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

export default JobsForm;
