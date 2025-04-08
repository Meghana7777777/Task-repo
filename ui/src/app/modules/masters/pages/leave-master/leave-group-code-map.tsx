import { UndoOutlined } from "@ant-design/icons";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, FormInstance, Input, notification, Row, Select } from "antd";
import { useState } from "react";

export interface LeaveGroupCodeMapIProps {
    leaveCodeMapData?: any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    LeaveForm?: FormInstance<any>;
    getAllLeavesCodeMapData: () => void;
    leaveGroupCodeList: any[];
    leaveGroupList: any[];
    branchList: any[];
    employeType: any[]
}

export default function LeaveGroupCodeMapForm(props: LeaveGroupCodeMapIProps) {
    const [form] = Form.useForm();
    const Option = Select;
    const [disable, setDisable] = useState<boolean>(false);
    const service = new LeaveTypeService();

    const saveData = (val: any) => {
        if (props.isUpdate) {
            props.updateDetails(val);
        }
        else {
            saveLeaveGroupCodeMapping()
        }
    }

    const onReset = () => {
        form.resetFields();
    };

    function saveLeaveGroupCodeMapping() {
        form.validateFields().then((values) => {
            service.saveLeaveGroupCodeMapping(values).then((res) => {
                if (res.status) {
                    props.closeForm();
                    props.getAllLeavesCodeMapData();
                    notification.success({ message: res.internalMessage })
                } else {
                    notification.error({ message: res.internalMessage })
                }
            });
        });
    }
    return (
        <>
            <Card>
                <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leaveCodeMapData}>
                    <Row gutter={8}>
                        <Form.Item name="id" label="id" hidden>
                            <Input hidden />
                        </Form.Item>
                        {/* {
                            !props.isUpdate && ( */}
                        <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                            <Form.Item
                                name="generatedCodeId"
                                label="Leave Group Code"
                                rules={[{ required: true, message: "Please Select Leave Group" }]}
                            >
                                <Select showSearch allowClear optionFilterProp="children" placeholder="Select Leave Group Code">
                                    {props.leaveGroupCodeList?.map((item) => {
                                        return (
                                            <Option key={item.id} value={item.id}>
                                                {`${item.state + '/' + item.generatedCode}`}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* ) */}
                        {/* } */}
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item
                                name="branchId"
                                label="Branch"
                                rules={[{ required: true, message: "Please Select Branch" }]}
                            >
                                <Select mode="multiple" showSearch allowClear optionFilterProp="children" placeholder="Select Branch">
                                    {props.branchList?.map((item) => {
                                        return (
                                            <Option key={item.id} value={item.id}>
                                                {item.branchName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item name={'employeeTypeId'} label={'Employee Type'}
                                rules={[{ required: true, message: "Please Select Employee Type" }]}
                            >
                                <Select placeholder="Select Employee Type" showSearch allowClear>
                                    {props.employeType.map((empTy) => (
                                        <Option key={empTy.id} value={empTy.id}>
                                            {empTy.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                            <Form.Item>
                                <Button
                                    color="primary" variant="outlined"
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