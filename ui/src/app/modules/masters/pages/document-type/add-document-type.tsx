import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Card, Typography, message, Col, Row, Select } from 'antd';
import { DocumentTypeSharedService, DomainSharedService, ExpensesTypeService } from '@hrexpert/shared-services';
import { PageContainer } from '@ant-design/pro-layout';
import { UndoOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DataType {
    documentTypeId: number;
    domain: string;
    documentType: string;
    isActive: boolean;
}

export interface Props {
    documentTypeData: any;
    isUpdate: boolean;
    closeForm: () => void;
    updateDetails: (Style: any) => void;
    getAllDocumentType: () => void
}

const AddDocumentType = (props: Props) => {
    const [form] = Form.useForm();
    const documentTypeSharedService = new DocumentTypeSharedService();
    const domainSharedService = new DomainSharedService();
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState<boolean>(false)
    const [domain, setDomain] = useState<any[]>([])


    useEffect(() => {
        fetchDomains();
    }, [])
    useEffect(() => {
        if (props.isUpdate && props.documentTypeData) {
            form.setFieldsValue({
                ...props.documentTypeData,
                documentType: props.documentTypeData.documentType,
            });
        } else {
            form.resetFields();
        }
    }, [
        props.documentTypeData && JSON.stringify(props.documentTypeData),
        props.isUpdate,
    ]);

    const fetchDomains = () => {
        domainSharedService.getDomianType().then((res) => {
            if (res.status) {
                setDomain(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const onReset = () => {
        form.setFieldsValue({
            ...props.documentTypeData,
            documentType: props.documentTypeData.documentType,
        });
    };

    const saveData = (val: any) => {
        const formattedValues = {
            ...val,
        };
        if (props.isUpdate) {
            props.updateDetails({ ...formattedValues, documentTypeId: props.documentTypeData?.documentTypeId });
        } else {
            handleSubmit(formattedValues);
        }
    };

    const handleSubmit = async (values: DataType) => {
        try {
            setLoading(true);
            setDisable(true);
            const payload = { ...values, isActive: values.isActive ?? true };
            const response = await documentTypeSharedService.createDocumentType(payload);
            if (response && response.status) {
                message.success("Document Type Added Successfully");
                form.resetFields();
                props.closeForm();
                props.getAllDocumentType();
            } else {
                message.error("Failed to Add Document Type");
            }
        } catch (error) {
            message.error("An error occurred while adding the Document type.");
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
                            name="domain"
                            rules={[{ required: true, message: 'Please enter an Category type' }]}
                        >
                            <Select style={{ width: '100%' }} placeholder="Select Category Type"
                                allowClear
                                showSearch
                            >
                                {domain.map((res) => (
                                    <Select.Option key={res.domainId} value={res.domainType}>
                                        {res.domainType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4} >
                        <Form.Item
                            label="Category Type"
                            name="CategoryType"
                            rules={[{ required: true, message: 'Please enter an Category type' }]}
                        >
                            <Input placeholder="Enter Category Type" />
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

export default AddDocumentType;

