import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Card, Typography, message, Col, Row } from 'antd';
import { DomainSharedService, ExpensesTypeService } from '@hrexpert/shared-services';
import { PageContainer } from '@ant-design/pro-layout';
import { UndoOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DataType {
    domainId: number;
    domainType: string;
    isActive: boolean;
}

export interface Props {
    domainData: any;
    isUpdate: boolean;
    closeForm: () => void;
    updateDetails: (Style: any) => void;
    getAllDomain: () => void
}

const DomainAdd = (props: Props) => {
    const [form] = Form.useForm();
    const domainService = new DomainSharedService();
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState<boolean>(false)

    useEffect(() => {
        if (props.isUpdate && props.domainData) {
            form.setFieldsValue({
                ...props.domainData,
                domainType: props.domainData.domainType,
            });
        } else {
            form.resetFields();
        }
    }, [
        props.domainData && JSON.stringify(props.domainData),
        props.isUpdate,
    ]);

    const onReset = () => {
        form.setFieldsValue({
            ...props.domainData,
            domainType: props.domainData.domainType,
        });
    };

    const saveData = (val: any) => {
        const formattedValues = {
            ...val,
        };
        if (props.isUpdate) {
            props.updateDetails({ ...formattedValues, domainId: props.domainData?.domainId });
        } else {
            handleSubmit(formattedValues);
        }
    };

    const handleSubmit = async (values: DataType) => {
        try {
            setLoading(true);
            setDisable(true);
            const payload = { ...values, isActive: values.isActive ?? true };
            const response = await domainService.createDomainType(payload);
            if (response && response.status) {
                message.success("Domain Type Added Successfully");
                form.resetFields();
                props.closeForm();
                props.getAllDomain();
            } else {
                message.error("Failed to Add Domain Type");
            }
        } catch (error) {
            message.error("An error occurred while adding the domain type.");
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
                            label="Category Type"
                            name="domainType"
                            rules={[{ required: true, message: 'Please enter an doman type' }]}
                        >
                            <Input placeholder="Enter Domain Type" />
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

export default DomainAdd;

