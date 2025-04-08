import { UndoOutlined } from "@ant-design/icons";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, FormInstance, Input, message, Row, Select } from "antd";
import { useState } from "react";

export interface LeaveTypeGridProps {
    leaveTypeData?: any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    LeaveTypeForm?: FormInstance<any>;
    getAllLeaveTypes: () => void
}

export default function LeaveTypeForm(props: LeaveTypeGridProps) {
    const [form] = Form.useForm();
    const Option = Select;
    const [disable, setDisable] = useState<boolean>(false);
    const service = new LeaveTypeService();

    const onReset = () => {
        form.resetFields();
    };

    function createLeaveType(val: any) {
        console.log(val)
        try{
            setDisable(true);
        service.createLeaveType(val).then((res) => {
            if (res.status) {
                props.closeForm()
                props.getAllLeaveTypes()
                message.success('Created successfully');
            }else {
                message.error(res.internalMessage);
            }
        })} catch (error) {
            console.error(error);
        } finally {
            setDisable(false);
        }
    }

    const saveData = (val:any) => {
        if (props.isUpdate) {
            props.updateDetails(val);
        }
        else {
            createLeaveType(val)
        }
    }

    return (
        <>
            <Card>
                <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leaveTypeData}>
                    <Row gutter={8}>
                        <Form.Item name="leaveTypeId" label="Leave Type id" hidden>
                            <Input hidden />
                        </Form.Item>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveTypeName"
                                label="Leave Type Name"
                                rules={[{ required: true, message: "Please Enter Leave Type Name" }]}
                            >
                                <Input placeholder="Enter Leave Type Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                            <Form.Item
                                name="leaveTypeCode"
                                label="Leave Type Code"
                                rules={[{ required: true, message: "Please Enter Leave Type Code" }]}
                            >
                                <Input placeholder="Enter Leave Type Code" />
                            </Form.Item>
                        </Col>
                    {/* </Row> */}
                    {/* <Row gutter={24} justify={'end'}> */}
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
        </>
    )
}