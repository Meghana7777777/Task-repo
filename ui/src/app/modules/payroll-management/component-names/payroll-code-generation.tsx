import { PageContainer } from "@ant-design/pro-layout";
import { AlertMessages } from "@hrexpert/shared-models";
import { ComponentNamesSharedService, PayrollComponentsSharedService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Input, message, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";

interface PayrollCodeGenerationIProps {
    payrollGroupCode: any;
    generatedId: any;
    handleCloseModal: () => void;
}

export default function PayrollCodeGeneration(props: PayrollCodeGenerationIProps) {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [componentNamesData, setComponentNamesData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [payrollCodeData, setPayrollCodeData] = useState('');

    const service = new PayrollComponentsSharedService();
    const componentNamesService = new ComponentNamesSharedService();

    useEffect(() => {
        fetchComponentNames();
    }, []);

    const fetchComponentNames = async () => {
        try {
            const res = await componentNamesService.getActiveComponentsNames();
            if (res.status) {
                setComponentNamesData(res.data);
            } else {
                setComponentNamesData([]);
            }
        } catch (error) {
            console.error("Error fetching component names:", error);
        }
    };

    const handleSubmit = async () => {
        if (selectedRows.length === 0) {
            message.error("Please select at least one row");
            return;
        }

        const generatedCode = selectedRows
            .map(record => record.derivedRule ? `${record.componentNameCode}-${record.derivedRule}` : record.componentNameCode)
            .join('/');

        setPayrollCodeData(generatedCode);

        const payrollTypeValue = form.getFieldValue("payrollType");

        if (!payrollTypeValue) {
            AlertMessages.getErrorMessage('Please Enter the Payroll Type');
            return;
        }

        try {
            const res = await service.createPayrollCode({
                payrollGroupCode: generatedCode,
                payrollData: selectedRows,
                payrollType: payrollTypeValue,
                state: form.getFieldValue("state"),
            });

            if (res.status) {
                message.success("Payroll Code Generated Successfully");
                // props.handleCloseModal();
                handleReset();
            } else {
                message.error("Failed to Generate Payroll Code");
            }
        } catch (error) {
            console.error("Error generating payroll code:", error);
            message.error("Error occurred while generating payroll code");
        }
    };

    const handleReset = () => {
        form.resetFields();
        fetchComponentNames();
        setPayrollCodeData('');
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    const columns: any = [
        // {
        //     title: "S.No",
        //     key: "sno",
        //     render: (text, object, index) => (page - 1) * pageSize + (index + 1),
        //     align: "center",
        //     width: 50,
        //     fixed: "left"
        // },
        {
            title: "Component Name",
            dataIndex: "componentName",
            align: "center",
            width: 150,
            fixed: "left"
        },
        {
            title: "Component Code",
            dataIndex: "componentNameCode",
            align: "center",
            width: 150,
            fixed: "left"
        },
        {
            title: 'Derived Rule',
            dataIndex: "derivedRule",
            align: "center",
            render: (text, record, index) => (
                <Input
                    disabled={record.isDerived === false}
                    placeholder="NAME * 50%"
                    onChange={(e) => handleInputChange(index, 'derivedRule', e.target.value)}
                    allowClear
                />
            ),
            width: 140
        },
        {
            title: 'Cutoff Amount',
            dataIndex: "cutOffAmount",
            align: "center",
            render: (text, record, index) => (
                <Input
                    disabled={record.cutOffAmount === false}
                    onChange={(e) => handleInputChange(index, 'cutoffAmount', e.target.value)}
                    allowClear
                />
            ),
            width: 80
        },
        {
            title: 'Amount',
            dataIndex: "calculatedRule",
            align: "center",
            render: (text, record, index) => (
                <Input
                    disabled={record.calculatedRule === false}
                    onChange={(e) => handleInputChange(index, 'calculatedRule', e.target.value)}
                    allowClear
                />
            ),
            width: 80
        },
        {
            title: 'Is Gross Derived',
            dataIndex: "isGrossDervied",
            align: "center",
            render: (text, record, index) => (
                <Select
                    value={record.isGrossDerived === true ? "1" : record.isGrossDerived === false ? "0" : undefined}
                    onChange={(value) => handleInputChange(index, "isGrossDerived", value)}
                    style={{ width: "100%" }}
                    allowClear
                >
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                </Select>
            ),
            width: 80
        },
        {
            title: 'Is PF Earning',
            dataIndex: "isPfEarning",
            align: "center",
            render: (text, record, index) => (
                <Select
                    value={record.isPfEarning === true ? "1" : record.isPfEarning === false ? "0" : undefined}
                    onChange={(value) => handleInputChange(index, "isPfEarning", value)}
                    style={{ width: "100%" }}
                    allowClear
                >
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                </Select>
            ),
            width: 100
        },
        {
            title: 'Is ESI Earning',
            dataIndex: "isEsiEarning",
            align: "center",
            render: (text, record, index) => (
                <Select
                    value={record.isEsiEarning === true ? "1" : record.isEsiEarning === false ? "0" : undefined}
                    onChange={(value) => handleInputChange(index, "isEsiEarning", value)}
                    style={{ width: "100%" }}
                    allowClear
                >
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                </Select>
            ),
            width: 100
        },
    ];

    const handleInputChange = (index, field, value) => {
        setComponentNamesData(prevData => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
    };

    const states = [
        { value: 'AP', label: 'Andhra Pradesh' },
        { value: 'AR', label: 'Arunachal Pradesh' },
        { value: 'AS', label: 'Assam' },
        { value: 'BR', label: 'Bihar' },
        { value: 'CT', label: 'Chhattisgarh' },
        { value: 'GA', label: 'Goa' },
        { value: 'GJ', label: 'Gujarat' },
        { value: 'HR', label: 'Haryana' },
        { value: 'HP', label: 'Himachal Pradesh' },
        { value: 'JH', label: 'Jharkhand' },
        { value: 'KA', label: 'Karnataka' },
        { value: 'KL', label: 'Kerala' },
        { value: 'MP', label: 'Madhya Pradesh' },
        { value: 'MH', label: 'Maharashtra' },
        { value: 'MN', label: 'Manipur' },
        { value: 'ML', label: 'Meghalaya' },
        { value: 'MZ', label: 'Mizoram' },
        { value: 'NL', label: 'Nagaland' },
        { value: 'OD', label: 'Odisha' },
        { value: 'PB', label: 'Punjab' },
        { value: 'RJ', label: 'Rajasthan' },
        { value: 'SK', label: 'Sikkim' },
        { value: 'TN', label: 'Tamil Nadu' },
        { value: 'TG', label: 'Telangana' },
        { value: 'TR', label: 'Tripura' },
        { value: 'UP', label: 'Uttar Pradesh' },
        { value: 'UK', label: 'Uttarakhand' },
        { value: 'WB', label: 'West Bengal' }
    ];

    return (
        <PageContainer title='Payroll Code Generation' breadcrumbRender={false}>
            <Card>
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                            <Form.Item label='State' name="state" initialValue="AP">
                                <Select showSearch allowClear optionFilterProp="children" placeholder='Select State'>
                                    {states.map((state) => (
                                        <Option key={state.value} value={state.value}>
                                            {state.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item label="Payroll Type" name="payrollType"
                                rules={[{ required: true, message: 'Please Enter Payroll Type' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Row justify="end" gutter={16} style={{ marginTop: "20px" }}>
                            <Col>
                                <Button type="primary" onClick={handleSubmit} variant="outlined" color="primary" disabled={selectedRows.length === 0}>
                                    Submit
                                </Button>
                            </Col>
                            <Col>
                                <Button onClick={handleReset}>Reset</Button>
                            </Col>
                        </Row>
                    </Row>
                    <Table
                        rowSelection={rowSelection} // Enables row selection
                        rowKey="componentName"
                        columns={columns}
                        size="small"
                        bordered
                        dataSource={componentNamesData}
                        pagination={false}
                        scroll={{ y: 'calc(70vh - 75px)' }}
                    />
                </Form>
            </Card>
        </PageContainer>
    );
}