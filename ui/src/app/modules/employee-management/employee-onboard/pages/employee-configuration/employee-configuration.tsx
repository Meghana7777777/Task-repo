import React, { useState, useEffect } from "react";
import axios from "axios";
import { EmployeeOnboardingService, EmployeeTypeService } from "@hrexpert/shared-services";
import { message, Spin, Table, Checkbox, Input, Button, Select, Modal } from "antd";
import { PageContainer } from "@ant-design/pro-layout";

interface FieldConfig {
    id: number;
    employeeType: number;
    fieldName: string;
    displayName: string;
    isOptional: boolean;
    isVisible: boolean;
    isEditable: boolean;
    displayOrder: number;
}

const EmployeeFormConfig = ({ open, onClose, onSelectEmployee }: any) => {
    const [fields, setFields] = useState<FieldConfig[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [employeeTypes, setEmployeeTypes] = useState([])
    const service = new EmployeeOnboardingService();
    const employeeTypesService = new EmployeeTypeService()
    const { Option } = Select

    // Fetch field configuration for a specific employee type
    useEffect(() => {
        getEmployeeTypes();
    }, []);

    const getEmployeeTypes = () => {
        employeeTypesService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeTypes(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleFieldChange = (id: number, key: keyof FieldConfig, value: any) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, [key]: value } : field
            )
        );
    };

    const saveConfiguration = async () => {
        try {
            setLoading(true);
            const res = await service.saveOrUpdateConfigurations(fields);
            if (res.status) {
                message.success(res.internalMessage);
                onClose();
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            message.error("Failed to save configurations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getConfiguration = async (value) => {
        try {
            setLoading(true);
            const res = await service.getConfigurations({ employeeType: value });
            if (res.status) {
                setFields(res.data);
                message.success(res.internalMessage);
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            message.error("Failed to fetch configurations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Field Name",
            dataIndex: "fieldName",
            key: "fieldName",
        },
        {
            title: "Display Name",
            dataIndex: "displayName",
            key: "displayName",
            render: (text: string, record: FieldConfig) => (
                <Input
                    value={text}
                    onChange={(e) =>
                        handleFieldChange(record.id, "displayName", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Visible",
            dataIndex: "isVisible",
            key: "isVisible",
            render: (checked: boolean, record: FieldConfig) => (
                <Checkbox
                    checked={checked}
                    onChange={(e) =>
                        handleFieldChange(record.id, "isVisible", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Editable",
            dataIndex: "isEditable",
            key: "isEditable",
            render: (checked: boolean, record: FieldConfig) => (
                <Checkbox
                    checked={checked}
                    onChange={(e) =>
                        handleFieldChange(record.id, "isEditable", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Optional",
            dataIndex: "isOptional",
            key: "isOptional",
            render: (checked: boolean, record: FieldConfig) => (
                <Checkbox
                    checked={checked}
                    onChange={(e) =>
                        handleFieldChange(record.id, "isOptional", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Display Order",
            dataIndex: "displayOrder",
            key: "displayOrder",
            render: (text: number, record: FieldConfig) => (
                <Input
                    type="number"
                    value={text}
                    onChange={(e) =>
                        handleFieldChange(record.id, "displayOrder", Number(e.target.value))
                    }
                />
            ),
        },
    ];

    return (
        <Modal
            title="Employee Form Configurations"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>
            ]}
            width={'70%'}
        >
            <PageContainer title="Employee form Config">
                <div style={{ marginBottom: "20px" }}>
                    <label>Select Employee Type: </label>
                    <Select
                        onChange={(value) => getConfiguration(value)}
                        style={{ width: "200px", marginLeft: "10px" }}
                    >
                        {
                            employeeTypes.map((v: any) => { return <Option key={v.id} value={v?.id}>{v?.name}</Option> })
                        }
                    </Select>
                </div>
                <Spin spinning={loading}>
                    <Table
                        dataSource={fields}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />
                </Spin>
                <Button
                    type="primary"
                    onClick={saveConfiguration}
                    style={{ marginTop: "20px" }}
                >
                    Save Configuration
                </Button>
            </PageContainer>
        </Modal>
    );
};

export default EmployeeFormConfig;
