import { UndoOutlined } from "@ant-design/icons";
import { EmployeeTypeService, ExpensesAganistService, IdProofService } from '@hrexpert/shared-services';
import { BranchesDto } from '@hrexpert/shared-models';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { IdProofDto } from "libs/shared-models/src/lib/masters/id-proof/id-proof-dto";
import { EmployeeTypeDto } from "libs/shared-models/src/lib/masters/employee-type/employee-type-dto";


interface DataType {
    expenseAgainstId: number;
    expenseAgainst: string;
    isActive: boolean;
}

export interface Props {
    data: any;
    form?: FormInstance<any>;
    isUpdate: boolean;
    updateDetails: (style: any) => void;
    closeForm: () => void;
    getAllExpensesAgainst: () => void
}

const AddExpensesAgainst = (props: Props) => {
    const [form] = Form.useForm();
    const [disable, setDisable] = useState<boolean>(false);
    const expensesAgainstService = new ExpensesAganistService();

    useEffect(() => {
        if (props.isUpdate && props.data) {
            form.setFieldsValue({
                ...props.data, expenseAgainst: props.data.expenseAgainst
            });
        } else {
            form.resetFields();
        }
    },
        [props.data && JSON.stringify(props.data), props.isUpdate]);

    const onReset = () => {
        form.resetFields({
            ...props.data,
            exxpensesAgainst: props.data.expensesAgainst
        });
    };

    const handleSubmit = (val: DataType) => {
        try {
            setDisable(true);
            expensesAgainstService.createExpensesAgainst(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    form.resetFields();
                    props.closeForm()
                    props.getAllExpensesAgainst()
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
        const formattedValues = {
            ...val,
        };

        if (props.isUpdate) {
            props.updateDetails({ ...formattedValues, expenseAgainstId: props.data?.expenseAgainstId });
        } else {
            handleSubmit(formattedValues);
        }
    };



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.data}>
                <Row gutter={8}>
                    <Form.Item name="expenseAgainstId" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="expenseAgainst"
                            label="Expense Against"
                            rules={[{ required: true, message: "Please Enter Expense Against" }]}
                        >
                            <Input placeholder="Enter Expense Agains" />
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

export default AddExpensesAgainst;
