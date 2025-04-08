import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Card, Typography, message, Col, Row } from 'antd';
import { ExpensesTypeService } from '@hrexpert/shared-services';
import { PageContainer } from '@ant-design/pro-layout';
import { UndoOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DataType {
  expenseId: number;
  expenseType: string;
  isActive: boolean;
}

export interface Props {
  expensesData: any;
  isUpdate: boolean;
  closeForm: () => void;
  updateDetails: (Style: any) => void;
  getAllExpenses: () => void
}

const AddExpensesType = (props: Props) => {
  const [form] = Form.useForm();
  const expensesTypeService = new ExpensesTypeService();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState<boolean>(false)


  useEffect(() => {
    if (props.isUpdate && props.expensesData) {
      form.setFieldsValue({
        ...props.expensesData,
        expenseType: props.expensesData.expenseType,
      });
    } else {
      form.resetFields();
    }
  }, [
    props.expensesData && JSON.stringify(props.expensesData),
    props.isUpdate,
  ]);

  const onReset = () => {
    form.setFieldsValue({
      ...props.expensesData,
      expenseType: props.expensesData.expenseType,
    });
  };

  const saveData = (val: any) => {
    const formattedValues = {
      ...val,
    };

    if (props.isUpdate) {
      props.updateDetails({ ...formattedValues, expenseId: props.expensesData?.expenseId });
    } else {
      handleSubmit(formattedValues);
    }
  };


  const handleSubmit = async (values: DataType) => {
    try {
      setLoading(true);
      setDisable(true);
      const payload = { ...values, isActive: values.isActive ?? true };
      const response = await expensesTypeService.CreateExpensesType(payload);
      if (response && response.status) {
        message.success("Expense Type Added Successfully");
        form.resetFields();
        props.closeForm();
        props.getAllExpenses();
      } else {
        message.error("Failed to Add Expense Type");
      }
    } catch (error) {
      message.error("An error occurred while adding the expense type.");
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };



  return (
    <PageContainer>
      <Form
        form={form}
        layout="vertical"
        onFinish={saveData}
      >
        <Row gutter={8}>
          <Col span={4} >
            <Form.Item
              label="Expenses Type"
              name="expenseType"
              rules={[{ required: true, message: 'Please enter an expense type' }]}
            >
              <Input placeholder="Enter Expenses Type" />
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
    </PageContainer>
  );
}

export default AddExpensesType;

