import { UndoOutlined } from '@ant-design/icons';
import { ComponentNamesSharedService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, Form, Input, message, Row, Select } from 'antd';
import { DepartmentReq } from 'libs/shared-models/src/lib/masters/departments/department-req';
import { useEffect } from 'react';

export interface ComponentNamesFormProps {
    componentNames?: DepartmentReq | any;
    isUpdate?: boolean;
    closeForm: () => void;
    employeeData?: any

}

export default function ComponentNamesForm(props: ComponentNamesFormProps) {
    const { Option } = Select
    const [form] = Form.useForm();
    const service = new ComponentNamesSharedService()
    // const [isDerived, setIsDerived] = useState(false);

    useEffect(() => {
        if (props.componentNames) {
            form.setFieldsValue(props.componentNames);
        }
    }, [props.componentNames, form]);

    useEffect(() => {
        const value = form.getFieldValue("isDerived")
        console.log(value, "valuevalue")
        if (value === 1 || value === true || value === "Yes") {
            form.setFieldsValue({ isDerived: "1" })
        } else if (value === 0 || value === false || value === "No") {
            form.setFieldsValue({ isDerived: "0" })
        } else {
            form.setFieldsValue({ isDerived: null })
        }
    }, [props.isUpdate]);


    const createComponentNames = (req: DepartmentReq) => {
        try {
            service.createComponentNames(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage)
                    props.closeForm()
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updateComponentNames = (data: any) => {
        service.updateComponentNames(data)
            .then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    props.closeForm()
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Department details:", error);
            });
    };

    const saveData = (val: any) => {
        if (props.isUpdate) {
            updateComponentNames({ ...val, id: props.componentNames?.id });
        }
        else {
            createComponentNames(val)
        }
    }

    const onReset = () => {
        form.resetFields()
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 4 }
        },
    };

    const handleCheckBoxChange = (values) => {
    };
    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.componentNames}>
                <Row gutter={8}>
                    <Form.Item name="id" label="id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="componentName"
                            label="Component Name"
                            rules={[{ required: true, message: "Please Enter Component Name" }]}
                        >
                            <Input placeholder="Enter Component Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="componentNameCode"
                            label="Component Code"
                            rules={[{ required: true, message: "Enter Component Code" }]}
                        >
                            <Input placeholder="Enter Component Code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: "Select Type" }]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                allowClear
                                placeholder={"Select Type"}
                            >
                                <Option value="RECURRING">RECURRING</Option>
                                <Option value="NONRECURRING">NON RECURRING</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                        <Form.Item
                            name="roundStrg"
                            label="Round Strg"
                            rules={[{ required: true, message: "Select Round Strg" }]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                allowClear
                                placeholder={"Round Strg"}
                            >
                                <Option value="ACTUAL">ACTUAL</Option>
                                <Option value="ON">ON</Option>
                                <Option value="OFF">OFF</Option>
                                <Option value="SEAL">SEAL</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="componentType"
                            label="Component Type"
                            rules={[{ required: true, message: "Select Component Type" }]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                allowClear
                                placeholder={"Component Type"}
                            >
                                <Option value="EARNING">EARNING</Option>
                                <Option value="DEDUCTION">DEDUCTION</Option>
                                <Option value="INFO">INFO</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="isDerived"
                            label="Is Derived"
                            rules={[{ required: true, message: "Select Is Derived" }]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                allowClear
                                placeholder={"Is Derived"}
                            // value={props.isUpdate?"Yes":"No"}
                            // onChange={(value) => props.setIsUpdate(value)}
                            >
                                <Option value="1">Yes</Option>
                                <Option value="0">No</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    {/* <div style={{ float: "left" }}>
                        <Form.Item name={"isDerived"} valuePropName="checked">
                            <Checkbox onChange={(e) => handleCheckBoxChange(e.target.checked)}>
                                Is Derived
                            </Checkbox>
                        </Form.Item>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div style={{ float: 'left' }}>
                        <Form.Item name={"derivedRule"} valuePropName="checked">
                            <Checkbox
                                onChange={(e) => handleCheckBoxChange(e.target.checked)}
                            >
                                Derived Rule
                            </Checkbox>
                        </Form.Item>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                    <div style={{ float: 'left' }}>
                        <Form.Item name={"cutOffAmount"} valuePropName="checked">
                            <Checkbox
                                onChange={(e) => handleCheckBoxChange(e.target.checked)}
                            >
                                Cut Off Amount
                            </Checkbox>
                        </Form.Item>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div style={{ float: 'left' }}>
                        <Form.Item name={"calculatedRule"} valuePropName="checked">
                            <Checkbox
                                onChange={(e) => handleCheckBoxChange(e.target.checked)}
                            >
                                Fixed Amount
                            </Checkbox>
                        </Form.Item>
                    </div>
                </Row>
                <Row gutter={8}>
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
    )
}
