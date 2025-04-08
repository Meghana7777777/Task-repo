import { PageContainer } from "@ant-design/pro-layout";
import { PayRollMisReportReq, ScopesEnum } from "@hrexpert/shared-models";
import { BranchesService, EmployeeOnboardingService, PayrollProcessedLogsService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, message, Row, Select } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useIAMClientState } from '../../../common/iam-client-react';
interface PayrollMisReportEmployeeProps {
    scopes: ScopesEnum[]
}


const PayrollMisEmployeeReport = (props: PayrollMisReportEmployeeProps) => {
    const [comparisonData, setComparisonData] = useState<any>([]);
    const [page, setPage] = React.useState(1);
    const service = new PayrollProcessedLogsService();
    const branchesService = new BranchesService();
    const [form] = Form.useForm()
    const Option = Select
    const [branches, setBranches] = useState<any>([])
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const empService: EmployeeOnboardingService = new EmployeeOnboardingService()


    useEffect(() => {
        getPayrollMisReportEmployee()
    }, [])
    useEffect(() => {
        getBranches()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
        }
    }, [props.scopes])

    const getBranches = async () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data);
            } else {
                message.error(res.internalMessage || 'Failed to fetch branches.');
            }
        }).catch((err) => {
            console.error('Error:', err);
            message.error('An error occurred while fetching branches.');
        });
    }

    const getPayrollMisReportEmployee = () => {
        const req = new PayRollMisReportReq()
        const formValues = form.getFieldsValue();
        if (formValues.branchId) {
            req.branchId = formValues.branchId
        }
        if (formValues.payrollYear) {
            req.payrollYear = formValues.payrollYear.format('YYYYMM');
        }
        if (formValues.payMode) {
            req.payMode = formValues.payMode
        }
        try {
            service.getPayrollMisReportEmployee(req).then((res) => {
                if (res.status) {
                    setComparisonData(res.data)
                } else {
                    setComparisonData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const onReset = () => {
        form.resetFields()
        getPayrollMisReportEmployee()
    }

    const columns: ColumnProps<any>[] = [
        {
            title: "Sno",
            key: "sno",
            render: (text: any, object: any, index: number) => index + 1,
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            align: "center"
        },
        {
            title: 'Payroll Month',
            dataIndex: 'payrollMonth',
            align: "center"
        },
        {
            title: 'Head Count',
            dataIndex: 'employeeCount',
        },
        {
            title: 'Gross',
            dataIndex: 'totalGross',
        },
        {
            title: 'Earnings',
            dataIndex: 'totalEarnings',
        },
        {
            title: 'Deductions',
            dataIndex: 'totalDeductions',
        },
        {
            title: 'Net Payable',
            dataIndex: 'totalNetPayable',
        },
        {
            title: 'CTC',
            dataIndex: 'totalCTC',
        },
        {
            title: 'TDS',
            dataIndex: 'totalTDS',
        },
        {
            title: 'PF',
            dataIndex: 'totalPF',
        },
        {
            title: 'ESI',
            dataIndex: 'totalESI',
        },
        {
            title: 'Bank',
            dataIndex: 'bankCount',
        },
        {
            title: 'Cash',
            dataIndex: 'cashCount',
        },
        {
            title: 'Hold',
            dataIndex: 'holdCount',
            render: (text) => text ? text : 0
        },
    ]

    return (
        <PageContainer title='Payroll Employee Audit Report' breadcrumbRender={false}>
            <Form form={form} layout="vertical">
                <Row gutter={[16, 8]}>
                    <Col span={4}>
                        <Form.Item label={'Branch'} name='branchId'>
                            <Select disabled={role === 'SuperAdmin' ? false : true} placeholder="Select Branch" showSearch allowClear optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                <Option value={''}> ALL </Option>
                                {branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='Payroll Month' name='payrollYear'>
                            <DatePicker style={{ width: "100%" }} placeholder='Select Payroll Month' picker="month" />
                        </Form.Item>
                    </Col>
                    {/* <Col span={4}>
                        <Form.Item label="Pay Mode" name="payMode">
                            <Select placeholder="Select Pay Mode" allowClear>
                                <Option value="Bank">Bank</Option>
                                <Option value="Cash">Cash</Option>
                            </Select>
                        </Form.Item>
                    </Col> */}

                    <Col>
                        <Button onClick={getPayrollMisReportEmployee} style={{ marginTop: "23px" }} type="primary" variant="outlined" color="primary">Submit</Button>
                    </Col>
                    <Col>
                        <Button onClick={onReset} style={{ marginTop: "23px" }} danger>Reset</Button>
                    </Col>
                </Row>
            </Form>

            <Table columns={columns} dataSource={comparisonData} bordered
                pagination={{
                    onChange(current) {
                        setPage(current);
                    },
                }}
                scroll={{ x: true }}
            />

        </PageContainer>
    )
}

export default PayrollMisEmployeeReport;