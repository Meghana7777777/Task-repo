
import { UndoOutlined } from "@ant-design/icons";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, FormInstance, Input, message, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";

export interface LeaveMasterGridProps {
    leaveData?: any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    LeaveForm?: FormInstance<any>;
    getAllLeaves: () => void;
    leaveTypeList: any[];
    leaveGroupList: any[];
}
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
export default function LeaveMasterForm(props: LeaveMasterGridProps) {
    const [form] = Form.useForm();
    const Option = Select;
    const [disable, setDisable] = useState<boolean>(false);
    // const [leaveTypeList, setLeaveTypeList] = useState<any[]>([]);
    // const [leaveGroupList, setLeaveGroupList] = useState<any[]>([]);
    const service = new LeaveTypeService();
    const [collapse, setCollapse] = useState(null);

    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        if (collapse === "Monthly") {
          form.setFieldsValue({ collapseMonth: "Monthly" });
        }else{
            form.setFieldsValue({ collapseMonth: null });
        }
      }, [collapse, form]);

    function createLeave(val: any) {
        console.log(val)
        try {
            setDisable(true);
            service.createLeave(val).then((res) => {
                if (res.status) {
                    props.closeForm()
                    props.getAllLeaves()
                    message.success('Created successfully');
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setDisable(false);
        }
    }

    const saveData = (val: any) => {
        if (props.isUpdate) {
            props.updateDetails(val);
        }
        else {
            createLeave(val)
        }
    }

    return (
        <>
            <Card>
                <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leaveData}>
                    <Row gutter={8}>
                        <Form.Item name="leaveId" label="Leave id" hidden>
                            <Input hidden />
                        </Form.Item>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveGroupId"
                                label="Leave Group"
                                rules={[{ required: true, message: "Please Enter Leave Group" }]}
                            >
                                <Select showSearch allowClear optionFilterProp="children" placeholder="Select Leave Group">
                                    {props.leaveGroupList?.map((item) => {
                                        return (
                                            <Option key={item.leaveGroupId} value={item.leaveGroupId}>
                                                {item.leaveGroupName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="leaveTypeId"
                                label="Leave Type"
                                rules={[{ required: true, message: "Please Enter Leave Type" }]}
                            >
                                <Select showSearch allowClear optionFilterProp="children" placeholder="Select Leave Type">
                                    {props.leaveTypeList?.map((item) => (
                                        <Option key={item.leaveTypeId} value={item.leaveTypeId}>
                                            {item.leaveTypeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="accumQty"
                                label="Accum Qty"
                                rules={[{ required: true, message: "Please Enter Accum Qty" },]} 
                            >
                                <Input placeholder="Enter Accum Qty" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="accumPeriod"
                                label="Accum Period"
                                rules={[{ required: true, message: "Please Enter Accum Period" }]}
                            >
                                <Select showSearch allowClear optionFilterProp="children" placeholder="Select Accum Period">
                                    <Option value="Yearly">Yearly</Option>
                                    <Option value="Monthly">Monthly</Option>
                                    <Option value="Daily">Daily</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="collapse"
                                label="Collapse"
                                rules={[{ required: true, message: "Please Enter Collapse" }]}
                            >
                                <Select
                                    onChange={(value) => setCollapse(value)}
                                    showSearch allowClear optionFilterProp="children" placeholder="Select Collapse">
                                    <Option value="Monthly">Monthly</Option>
                                    <Option value="Yearly">Yearly</Option>
                                    <Option value="Quarterly">Quarterly</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="collapseMonth"
                                label="Collapse Month"
                                rules={[{ required: true, message: "Please Enter Collapse Month" }]}
                            >
                                {/* <Select showSearch allowClear optionFilterProp="children" placeholder="Select Collapse Month">
                                <Option value="Yearly">Yearly</Option>
                                <Option value="Quarterly">Quarterly</Option> */}
                                {/* </Select> */}
                                {collapse === "Monthly" ? (
                                    <Input readOnly />
                                ) : (
                                    <Select showSearch allowClear placeholder="Select Month">
                                        {months.map((month) => (
                                            <Option key={month} value={month}>{month}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="encashLimit"
                                label="Encash Limit"
                                rules={[{ required: true, message: "Please Enter Encash Limit" },
                                { pattern: /^[0-9]*$/, message: "Please Enter Valid Encash Limit" }]}
                            >
                                <Input placeholder="Enter Encash Limit" />
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