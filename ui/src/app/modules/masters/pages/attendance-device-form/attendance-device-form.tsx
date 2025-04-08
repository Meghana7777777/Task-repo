import { UndoOutlined } from "@ant-design/icons";
import { AlertMessages, AttendanceDevDto } from "@hrexpert/shared-models";
import { AttendanceDeviceService, BranchesService } from "@hrexpert/shared-services";
import { Card, Form, message, Select, Radio, Col, Row, Button, Space } from "antd";
import { useEffect, useState } from "react";

export interface AttendanceDeviceFormProps {
    AttendanceDeviceData : AttendanceDevDto
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    getAttendanceDevice:() => void;
}

export default function AttendanceDeviceForm(props: AttendanceDeviceFormProps) {
    const [form] = Form.useForm();
    const service = new AttendanceDeviceService();
    const getService = new BranchesService();
    const [branchList, setBranchList] = useState<any[]>([]);

    const CreateAttendanceDevice = (req: AttendanceDevDto) => {
        try {
            service.CreateAttendanceDevice(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    props.getAttendanceDevice();
                    props.closeForm();
                } else {
                    message.error(res.internalMessage);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        form.setFieldsValue({
            branchId: props?.AttendanceDeviceData?.branchId,
            deviceType: props?.AttendanceDeviceData?.deviceType,
            id: props?.AttendanceDeviceData?.id
        })
    },[props])

    const getActiveBranches = () => {
        getService.getActiveBranches()
            .then(res => {
                if (res.status) {
                    setBranchList(res.data);
                } else {
                    setBranchList([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch(err => {
                setBranchList([]);
                AlertMessages.getErrorMessage(err.message);
            });
    };

    useEffect(() => {
        getActiveBranches();
    }, []);

    useEffect(() => {
        if (!props.isUpdate) {
            form.resetFields();  
        }
    }, [props.isUpdate, form]);

    const onReset = () => {
        form.resetFields()
    }

    return (
        <Card>
            <Form form={form} onFinish={CreateAttendanceDevice} layout= "vertical" >
                <Row gutter={16} justify="start">
                    <Col xs={24} sm={24} md={10} lg={8} >
                    <Form.Item name={'id'} hidden></Form.Item>
                        <Form.Item
                            label="Branch"
                            name="branchId"
                            
                            rules={[{ required: true, message: "Please select a branch" }]}
                        >
                            <Select placeholder="Select a branch" style={{width: '100%'}}>
                                {branchList.map(branch => (
                                    <Select.Option key={branch.id} value={branch.id}>
                                        {branch.branchName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={8} >
                        <Form.Item
                            name="deviceType"
                            label="Device Type"
                            rules={[{ required: true, message: "Please select a device type" }]}
                        >
                            <Radio.Group>
                                <Space direction="horizontal">
                                    <Radio value="Single">Single </Radio>
                                    <Radio value="Multiple">Multiple </Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

               
                <Row gutter={[24, 24]}justify="center">
                    <Col xs={24} sm={12} md={8} lg={6} xl={2} style={{ marginLeft: 20, marginTop: 23 }}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                
                            >
                                {props.isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}  style={{ marginLeft: 20, marginTop: 23 }}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                               
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col></Row>

            </Form>
        </Card>
    );
}
