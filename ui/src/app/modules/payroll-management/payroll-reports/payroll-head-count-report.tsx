import { PageContainer } from "@ant-design/pro-layout";
import { PayRollComparisontReq } from "@hrexpert/shared-models";
import { BranchesService, PayrollProcessedLogsService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";

const PayrollHeadcountReport = () => {
    const [componentsData, setComponentsData] = useState<any>([])
    const [empDatawithAddDel, setEmpDatawithAddDel] = useState<any>([])
    const [branchesData, setBranchesData] = useState<any>([])
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const service = new PayrollProcessedLogsService();
    const branchesService = new BranchesService();
    const Option = Select

    useEffect(() => {
        getActiveBranches()
    }, [])

    const getPayrollHeadCountReportData = () => {
        const req = new PayRollComparisontReq()
        const formValues = form.getFieldsValue();
        if (formValues.payrollMonth) {
            req.payrollMonth = formValues.payrollMonth.format('YYYYMM');
        }
        if (formValues.branchId) {
            req.branchId = formValues.branchId
        }
        setLoading(true)
        try {
            setLoading(true)
            service.getPayrollHeadCountReportData(req).then((res) => {
                if (res.status) {
                    setComponentsData(res.data)
                    setEmpDatawithAddDel(res.data1)
                    setLoading(false)
                }
                else {
                    setComponentsData([])
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    console.log(empDatawithAddDel, "empDatawithAddDel")
    console.log(componentsData, "componentsData")
    const getActiveBranches = () => {
        setLoading(true)
        try {
            branchesService.getActiveBranches().then((res) => {
                if (res.status) {
                    setBranchesData(res.data)
                    setLoading(false)
                }
                else {
                    setBranchesData([])
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const generateColumns = (data: any) => {
        const dynamicColumns = Object.keys(data[0] || {}).map((key) => {
            return {
                title: key.toUpperCase(),
                dataIndex: key,
                key,
            };
        });

        const monthColumn = dynamicColumns.find(col => col.dataIndex === 'monthName');
        const headCountColumn = dynamicColumns.find(col => col.dataIndex === 'headCount');
        const grossColumn = dynamicColumns.find(col => col.dataIndex === 'grossTotal');
        const netPaySalaryColumn = dynamicColumns.find(col => col.dataIndex === 'netSalary');
        const ctcColumn = dynamicColumns.find(col => col.dataIndex === 'ctcTotal');

        if (monthColumn) {
            dynamicColumns.splice(dynamicColumns.indexOf(monthColumn), 1);
            dynamicColumns.unshift(monthColumn);
            monthColumn.title = 'Month Name';
        }
        if (headCountColumn) {
            headCountColumn.title = 'Head Count';
        }
        if (grossColumn) {
            grossColumn.title = 'Gross Salary';
        }
        if (netPaySalaryColumn) {
            netPaySalaryColumn.title = 'Net Salary';
        }
        if (ctcColumn) {
            ctcColumn.title = 'CTC';
        }

        return dynamicColumns;
    };

    const generateDataSource = (data: any) => {
        const rows = Object.keys(data).map((key) => {
            const item = data[key];
            return {
                key: key,
                ...item,
            };
        });
        const lastRow = rows[rows.length - 1];
        const secondLastRow = rows[rows.length - 2];

        if (lastRow && secondLastRow) {
            const differenceRow = {
                key: 'difference',
                monthName: 'Difference',
                headCount: Math.abs(lastRow.headCount - secondLastRow.headCount) || 0,
                grossTotal: Math.abs(lastRow.grossTotal - secondLastRow.grossTotal) || 0,
                netSalary: Math.abs(lastRow.netSalary - secondLastRow.netSalary) || 0,
                ctcTotal: Math.abs(lastRow.ctcTotal - secondLastRow.ctcTotal) || 0,
            };
            const additionsRow = {
                key: 'additions',
                monthName: `${lastRow.monthName} - Joinings`,
                headCount: empDatawithAddDel.additionsData.empAdditionsCount || 0,
                grossTotal: empDatawithAddDel.additionsData.additionOfGrossFromEmp || 0,
                netSalary: empDatawithAddDel.additionsData.additionOfNetPayableFromEmp || 0,
                ctcTotal: empDatawithAddDel.additionsData.additionOfCTCFromEmp || 0,
            };
            const deletionsRow = {
                key: 'deletions',
                monthName: `${lastRow.monthName} - Relivings`,
                headCount: empDatawithAddDel.deletionsData.empDeletionsCount || 0,
                grossTotal: empDatawithAddDel.deletionsData.deletionOfGrossFromEmp || 0,
                netSalary: empDatawithAddDel.deletionsData.deletionOfNetPayableFromEmp || 0,
                ctcTotal: empDatawithAddDel.deletionsData.deletionOfCTCFromEmp || 0,
            };
            rows.push(differenceRow, additionsRow, deletionsRow);
        }
        return rows;
    };

    const columns = generateColumns(Object.values(componentsData));
    const dataSource = generateDataSource(componentsData);


    const onReset = () => {
        form.resetFields()
        generateColumns(componentsData);
        generateDataSource(componentsData);
        setComponentsData([])
    }

    return (
        <PageContainer title='Payroll Headcount Report' breadcrumbRender={false}>
            <Form form={form} onFinish={getPayrollHeadCountReportData} layout="vertical">
                <Row gutter={[24, 4]}>

                    <Col span={4}>
                        <Form.Item label="Branch" name="branchId">
                            <Select
                                placeholder="Select Branch"
                                allowClear
                                showSearch
                                loading={loading}
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                            >
                                {branchesData.map((rec) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="Month" name="payrollMonth">
                            <DatePicker picker="month" />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button htmlType="submit" style={{ marginTop: "23px" }} type="primary" variant="outlined" color="primary">
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={onReset} style={{ marginTop: "23px" }} danger>
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
            />
        </PageContainer>
    );
};

export default PayrollHeadcountReport;
