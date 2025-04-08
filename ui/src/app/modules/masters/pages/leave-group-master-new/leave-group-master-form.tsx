
import { UndoOutlined } from "@ant-design/icons";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, FormInstance, Input, message, Row, Select } from "antd";
import { useEffect, useState } from "react";

export interface LeaveGroupMasterGridProps {
    leaveGroupData?: any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    LeaveGroupForm?: FormInstance<any>;
    getAllLeaveGroups: () => void
}

export default function LeaveGroupMasterForm(props: LeaveGroupMasterGridProps) {
    const [form] = Form.useForm();
    const Option = Select;
    const [disable, setDisable] = useState<boolean>(false);
    const [leaveTypeList, setLeaveTypeList] = useState<any[]>([]);
    const service = new LeaveTypeService();

    const onReset = () => {
        form.resetFields();
    };

    // useEffect(() => {
    //     getAllActiveLeaveType()
    // }, []);

    // function getAllActiveLeaveType(){
    //     service.getAllActiveLeaveType().then((res) => {
    //         if (res.status) {
    //             setLeaveTypeList(res.data);
    //         }else {
    //             setLeaveTypeList([])
    //         }
    //     })
    // }

    function createLeaveGroup(val: any) {
        console.log(val)
        try{
            setDisable(true);
        service.createLeaveGroup(val).then((res) => {
            if (res.status) {
                props.closeForm()
                props.getAllLeaveGroups()
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
            createLeaveGroup(val)
        }
    }

    return (
        <>
            <Card>
                <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leaveGroupData}>
                    <Row gutter={8}>
                        <Form.Item name="leaveGroupId" label="Leave Group id" hidden>
                            <Input hidden />
                        </Form.Item>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveGroupName"
                                label="Leave Group Name"
                                rules={[{ required: true, message: "Please Enter Leave Group Name" }]}
                            >
                                <Input placeholder="Enter Leave Group Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveGroupDesc"
                                label="Leave Group Description"
                                rules={[{ required: true, message: "Please Enter Leave Group Desc" }]}
                            >
                                <Input placeholder="Enter Leave Group Desc" />
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