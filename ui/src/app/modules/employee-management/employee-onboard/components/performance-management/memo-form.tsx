import { UndoOutlined } from "@ant-design/icons";
import { BranchesDto } from '@hrexpert/shared-models';
import { MemoSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIAMClientState } from "../../../../../common/iam-client-react";
export interface Props {
    memoData?: any;
    updateDetails?: (style: any) => void;
    isUpdate?: boolean;
    closeForm?: () => void;
    memoForm?: FormInstance<any>;
    getAllMemo?: () => void
    empData?: any;
}

const MemoForm = (props: Props) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate();
    const Service = new MemoSharedService();
    const { IAMClientAuthContext } = useIAMClientState();

    // useEffect(() => {
    //     if (props.memoData) {
    //         form.setFieldsValue(props.memoData);
    //     }
    // }, [props.memoData, form]);

    console.log(props, "[[")
    useEffect(() => {
        if (props.isUpdate) {
            console.log(props.memoData.date, "props.memoData");

            const formattedMemoData = {
                ...props.memoData,
                date: dayjs(props.memoData.date, 'YYYY-MM-DD').format("DD-MM-YYYY")
            };

            form.setFieldsValue(formattedMemoData);
        } else {
            form.resetFields();
        }
    }, [props.isUpdate, props.memoData, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createMemo = async (val: BranchesDto) => {
        console.log(val, "valalaj")
        try {
            Service.createMemo(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllMemo()
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
            props.updateDetails({ ...val, id: props.memoData?.id });
        }
        else {
            createMemo(val)
        }
    }

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.memoData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col span={8}>
                        <Form.Item
                            name="date"
                            label="Date"
                            rules={[{ required: true, message: 'Please select date' }]}
                        >
                            <DatePicker format='DD-MM-YYYY'
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item label="Type" name="type" rules={[{ required: true, message: 'please select' }]}>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select Type"
                                style={{ width: '100%' }}
                            >
                                {Object.values(PerformanceType).map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
                    <Col span={8}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item label={'Type'} name='type'>
                                {/* <Input placeholder="Enter Type" /> */}
                                <Select style={{ width: "100%" }}>
                                    <Option value="Appreciation">Appreciation</Option>
                                    <Option value="Best Practices">Best Practices</Option>
                                    <Option value="Memo">Memo</Option>
                                    <Option value="Issue">Issue</Option>
                                    <Option value="Escalation">Escalation</Option>
                                    <Option value="Suggestion">Suggestion</Option>
                                    <Option value="Outage">Outage</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Col>
                    {/* <Col span={8}>
                        <Form.Item label="Feedback On " name="feedBackOn" rules={[{ required: true, message: 'please select' }]}>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select Type"
                            >
                                {Object.values(PerformanceFeedbackOn).map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}

                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item label="Feedback On" name="employeeId" rules={[{ required: true, message: 'please select' }]}>
                            <Select
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {props.empData?.map((employee) => (
                                    <Select.Option key={employee.id} value={employee.id}>
                                        {employee.employeeCode} - {employee.employeeName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item label={'Description'} name='description'>
                                <Input.TextArea placeholder="Enter description" />
                            </Form.Item>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item label={'Impact On Business'} name='impactOnBussiness' rules={[{ required: true, message: 'please enter' }]}>
                                <Input placeholder="Enter Impact On Business" />
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23, width: "100%" }}
                                disabled={disable}
                            >
                                {props.isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Form.Item>
                    </Col> &nbsp;&nbsp;
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

export default MemoForm;
