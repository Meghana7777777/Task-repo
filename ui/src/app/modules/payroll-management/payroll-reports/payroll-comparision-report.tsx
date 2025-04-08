import { PageContainer } from "@ant-design/pro-layout";
import { PayRollComparisontReq } from "@hrexpert/shared-models";
import { PayrollRecordsSharedService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Row, Select } from "antd";
import Table from "antd/es/table";
import React, { useState } from "react";

const PayrollComparisonReport = () => {
    const [comparisonData, setComparisonData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = React.useState(1);
    const service = new PayrollRecordsSharedService();
    const [form] = Form.useForm()
    const Option = Select

    const getPayrollComparisonReport = () => {
        const req = new PayRollComparisontReq()
        const formValues = form.getFieldsValue();
        if (formValues.payrollMonth) {
            req.payrollMonth = formValues.payrollMonth.format('YYYYMM');
        }
        if (formValues.employeeId) {
            req.employeeId = formValues.employeeId
        }
        try {
            setLoading(true)
            service.getPayrollComparisonReport(req).then((res) => {
                if (res.status) {
                    setComparisonData(res.data)
                    setLoading(false)
                } else {
                    setComparisonData([])
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const onReset = () => {
        form.resetFields()
        setComparisonData([])
    }

    const dynamicKeys = Object.keys(comparisonData[0]?.comparison || {});
    const columns = [
        {
            title: "Sno",
            key: "sno",
            render: (text: any, object: any, index: number) => index + 1,
        },
        {
            title: "Employee Name",
            dataIndex: "name",
            key: "name",
            fixed: "left",
        },
        ...dynamicKeys.map((key) => ({
            title: key.replace(/_/g, " "),
            key,
            children: [
                {
                    title: "Current Month",
                    dataIndex: `${key}-currentMonth`,
                    key: `${key}-currentMonth`,
                    render: (value: any) => <span>{value || 0}</span>,
                },
                {
                    title: "Previous Month",
                    dataIndex: `${key}-previousMonth`,
                    key: `${key}-previousMonth`,
                    render: (value: any) => <span>{value || 0}</span>,
                },
                {
                    title: "Difference",
                    dataIndex: `${key}-difference`,
                    key: `${key}-difference`,
                    render: (value: any) => (
                        <span style={{ color: value > 0 ? "green" : "red" }}>
                            {value || 0}
                        </span>
                    ),
                },
            ],
        })),
    ]
    const dataSource = comparisonData.map((item: any) => {
        const transformedItem: any = {
            employeeId: item.employeeId,
            name: item.name,
        };
        dynamicKeys.forEach((key) => {
            transformedItem[`${key}-currentMonth`] =
                item.comparison[key]?.currentMonth || 0;
            transformedItem[`${key}-previousMonth`] =
                item.comparison[key]?.previousMonth || 0;
            transformedItem[`${key}-difference`] =
                item.comparison[key]?.difference || 0;
        });
        return transformedItem;
    })

    return (
        <PageContainer title='Payroll Comparsion Report' breadcrumbRender={false}>
            <Form onFinish={getPayrollComparisonReport} form={form} layout="vertical">
                <Row gutter={[24, 4]}>
                    <Col span={5}>
                        <Form.Item label='Month & Year' name='payrollMonth'>
                            <DatePicker picker="month" />
                        </Form.Item>
                    </Col>
                    {comparisonData.length > 0 && (
                        <Col span={5}>
                            <Form.Item label='Employee Name' name='employeeId'>
                                <Select placeholder='Select Employee Name' allowClear showSearch
                                    onChange={() => {
                                        getPayrollComparisonReport()
                                    }
                                    }>
                                    {comparisonData.map((rec) => {
                                        return <Option value={rec.employeeId} key={rec.employeeId}>{rec.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    <Col>
                        <Button htmlType="submit" style={{ marginTop: "23px" }} type="primary" variant="outlined" color="primary">Submit</Button>
                    </Col>
                    <Col>
                        <Button onClick={onReset} style={{ marginTop: "23px" }} danger>Reset</Button>
                    </Col>
                </Row>
            </Form>

            <Table columns={comparisonData.length > 0 ? (columns as any) : []} dataSource={dataSource} loading={loading} bordered
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

export default PayrollComparisonReport