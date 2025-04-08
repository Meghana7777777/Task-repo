import { UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { BranchesService, EmployeeTypeService, PayrollComponentsSharedService, PayrollRecordsSharedService, PayrollReq } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useIAMClientState } from './../../../common/iam-client-react';

const PayrollComponentWIseReport = () => {
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>([]);
    const payrollComponentService = new PayrollComponentsSharedService();
    const [pcData, setPcData] = useState<any>([]);
    const payrollRecordsService = new PayrollRecordsSharedService();
    const employeeTypeService = new EmployeeTypeService()
    const [empType, setEmpType] = useState<any>([]);
    const brService = new BranchesService()
    const [branches, setBranches] = useState<any>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const { Option } = Select;

    useEffect(() => {
        getAllPayrollComponents();
        getAllEmployeeTypes();
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: 'ALL' });
            handleBranchChange(null);
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId });
            handleBranchChange(IAMClientAuthContext.user.unitId);
        }
    }, []);

    const handleBranchChange = (branchId) => {

        if (branchId === "ALL") {
            form.setFieldsValue({ branches: null }); // Map "ALL" to null
        } else if (branchId === null) {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
        } else if (branchId === '') {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
        } else {
            form.setFieldsValue({ branches: branchId }); // Set selected branch ID
        }
    }

    const columns: any = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center",
        },
        {
            title: "Employee Name",
            dataIndex: "employeeName",
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
        },
        {
            title: "Component Name",
            dataIndex: "componentKey", // Use componentKey for clarity
        },
        {
            title: "Amount",
            dataIndex: "componentValue", // Amount for the selected component
        },
    ];

    const getAllPayrollRecords = async (req: PayrollReq) => {
        const res = await payrollRecordsService.getAllPayrollRecords(req);
        if (res.status) {
            setData(res.data)
        }
    }

    const getAllEmployeeTypes = async () => {
        const res = await employeeTypeService.getAllEmployeeTypes();
        if (res.status) {
            setEmpType(res.data)
        }
    }
    const getAllPayrollComponents = async () => {
        const res = await payrollComponentService.getAllPayrollComponents();
        if (res.status) {
            setPcData(res.data);
        }
    };

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const req: PayrollReq = {
                yearMonth: values.yearAndMonth?.format("YYYYMM") || '',
                componentName: values.ComponentName || '',
                componentRecode: '',
                employeeType: values.EmployeeType || null,
                branch: values.branches === 'ALL' || !values.branches ? null : values.branches,
            };
            console.log("Payload:", req);
            await getAllPayrollRecords(req);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleComponentChange = (value: string | null) => {
        if (!value) {
            // If the value is cleared, reset the form and table data
            clearForm();
        }
    };

    const clearForm = () => {
        form.resetFields();
        setData([]);
        if (role === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" });
        }
    };

    const getAllBranches = async () => {
        const res = await brService.getAllBranches();
        if (res.status) {
            setBranches(res.data);
        }
        else {
            console.error("failed to fetch");
        }
    };
    return (
        <PageContainer title='Payroll Component Wise Report' breadcrumbRender={false}
        >
            <Form form={form} onFinish={handleFormSubmit}>
                <Row gutter={[24, 4]}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name="branches" label="Branch">
                            <Select placeholder="Select Branch" showSearch allowClear
                                dropdownMatchSelectWidth={false}
                                disabled={role === 'SuperAdmin' ? false : true}
                                optionFilterProp="children">
                                <Option value={''}> ALL </Option>
                                {branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={5}>
                        <Form.Item
                            name="yearAndMonth"
                            label="Year & Month"
                            rules={[{ required: true, message: "Please select a year and month!" }]}
                        >
                            <DatePicker picker="month" style={{ width: "100%" }}
                                onChange={handleComponentChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Component Name" name="ComponentName"
                            rules={[{ required: true, message: "Please select component name" }]}
                        >
                            <Select allowClear placeholder="Select Component"
                                onChange={handleComponentChange}
                            >
                                {pcData.map((component) => (
                                    <Select.Option key={component.id} value={component.componentName}>
                                        {component.componentName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Employee Type" name="EmployeeType">
                            <Select allowClear placeholder="Select Employee Type"
                                onChange={handleComponentChange}
                            >
                                {empType.map((emptype) => (
                                    <Select.Option key={emptype.id} value={emptype.id}>
                                        {emptype.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Button type="primary" htmlType="submit" variant="outlined" color="primary">
                            Submit
                        </Button>
                        <Button
                            type="dashed"
                            icon={<UndoOutlined />}
                            danger
                            onClick={clearForm}
                            style={{ marginLeft: "10px" }}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row><br />
                <Table
                    bordered
                    columns={columns}
                    size="small"
                    dataSource={data}
                    rowKey="empCode"
                    pagination={{
                        onChange: (current) => setPage(current),
                    }}
                />
            </Form>
        </PageContainer>

    )
}
export default PayrollComponentWIseReport