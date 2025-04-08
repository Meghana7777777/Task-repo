import { UndoOutlined } from "@ant-design/icons";
import { EmployeeTypeService, IdProofService } from '@hrexpert/shared-services';
import { BranchesDto } from '@hrexpert/shared-models';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { IdProofDto } from "libs/shared-models/src/lib/masters/id-proof/id-proof-dto";
import { EmployeeTypeDto } from "libs/shared-models/src/lib/masters/employee-type/employee-type-dto";

export interface Props {
    data: any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    form?: FormInstance<any>;
    getAll: () => void
}

const EmployeeTypeForm = (props: Props) => {
    const [form] = Form.useForm();
    const [disable, setDisable] = useState<boolean>(false);
    const empTypeService = new EmployeeTypeService();

    useEffect(() => {
        if (props.data) {
            form.setFieldsValue(props.data);
        }
    }, [props.data, form]);

    const onReset = () => {
        form.resetFields();
    };

    const createEmployeeType =  (val: EmployeeTypeDto) => {
        try {
            empTypeService.createEmployeeType(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAll()
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

    const saveData = (val:any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.data?.id });
        }
        else {
            createEmployeeType(val)
        }
    }



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.data}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: "Please EnterEmployee Type" }]}
                        >
                            <Input placeholder="Enter Employee Type" />
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

export default EmployeeTypeForm;
