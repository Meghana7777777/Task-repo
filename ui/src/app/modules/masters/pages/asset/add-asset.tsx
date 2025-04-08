import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Card, Typography, message, Col, Row, Select } from 'antd';
import { AssetSharedService, DomainSharedService, ExpensesTypeService } from '@hrexpert/shared-services';
import { PageContainer } from '@ant-design/pro-layout';
import { UndoOutlined } from '@ant-design/icons';
import { AssetTypeEnum } from '@hrexpert/shared-models';

const { Title } = Typography;

interface DataType {
    assetId: number;
    asset: string;
    assetType: AssetTypeEnum;
    isActive: boolean;
}

export interface Props {
    assetData: any;
    isUpdate: boolean;
    closeForm: () => void;
    updateDetails: (Style: any) => void;
    getAllAssets: () => void
}

const AddAsset = (props: Props) => {
    const [form] = Form.useForm();
    const assetService = new AssetSharedService();
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState<boolean>(false)

    useEffect(() => {
        if (props.isUpdate && props.assetData) {
            form.setFieldsValue({
                ...props.assetData,
                asset: props.assetData.asset,
            });
        } else {
            form.resetFields();
        }
    }, [
        props.assetData && JSON.stringify(props.assetData),
        props.isUpdate,
    ]);

    const onReset = () => {
        form.setFieldsValue({
            ...props.assetData,
            asset: props.assetData.asset,
        });
    };

    const saveData = (val: any) => {
        const formattedValues = {
            ...val,
        };
        if (props.isUpdate) {
            props.updateDetails({ ...formattedValues, assetId: props.assetData?.assetId });
        } else {
            handleSubmit(formattedValues);
        }
    };

    const handleSubmit = async (values: DataType) => {
        try {
            setLoading(true);
            setDisable(true);
            const payload = { ...values, isActive: values.isActive ?? true };
            const response = await assetService.createAsset(payload);
            if (response && response.status) {
                message.success("Asset Type Added Successfully");
                form.resetFields();
                props.closeForm();
                props.getAllAssets();
            } else {
                message.error("Failed to Add Asset Type");
            }
        } catch (error) {
            message.error("An error occurred while adding the asset type.");
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
                            label="Asset"
                            name="asset"
                            rules={[{ required: true, message: 'Please enter an asset' }]}
                        >
                            <Input placeholder="Enter asset" />
                        </Form.Item>
                    </Col>
                    <Col span={4} >
                        <Form.Item
                            label="Asset Type"
                            name="assetType"
                            rules={[{ required: true, message: 'Please enter an asset type' }]}
                        >
                            <Select placeholder="Select Asset Type">
                                {Object.values(AssetTypeEnum).map((mode) => (
                                    <Select.Option key={mode} value={mode}>
                                        {mode}
                                    </Select.Option>
                                ))}
                            </Select>
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

export default AddAsset;

