import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";

export default function PayBankCashMisReport() {
    const [form] = Form.useForm();
    const Option = Select;
    const [page, setPage] = React.useState(1);
    const [data, setData] = useState([])
    const [branches, setBranches] = useState<any>([]);
    const branchService = new BranchesService();
    const empService = new EmployeeOnboardingService();
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 2 }, (_, i) => currentYear - i);
    const initialMonth = moment().month() + 1;
    const initialYear = moment().year();

    useEffect(() => {
        getAllBranches()
        getReportData()
    }, []);

    function getReportData() {
        const req = {
            branchId: form.getFieldValue('branches'),
            year: form.getFieldValue('year'),
            month: form.getFieldValue('month')
        }
        empService.getBankAndCashMisReport(req).then((res) => {
            console.log(res)
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
    }

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const clearData = () => {
        form.resetFields()
        getReportData()
    }
    function onFinish(values) {
        getReportData();
    };

    const generateDynamicColumns = (data) => {
        if (!data.length) return [];

        // Extract unique months from keys
        const months = [...new Set(data.flatMap((item) =>
            Object.keys(item)
                .filter((key) =>
                    key.match(
                        /(empBank|workerBank|empCash|workerCash|payroll_employee_bank|payroll_worker_bank|payroll_employee_cash|payroll_worker_cash)(\d{6})/
                    )
                )
                .map((key) => key.slice(-6)) // Extract MMYYYY
        ))];

        // Generate grouped columns for each month
        const dynamicColumns = months.map((month) => ({
            title: moment(month, "MMYYYY").format("MMM-YY"), // Format as "Jan-25"
            children: [
                {
                    title: "Employees",
                    children: [
                        {
                            title: "Bank Planned",
                            dataIndex: `empBank${month}`,
                            key: `empBank${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                        {
                            title: "Bank Actual",
                            dataIndex: `payroll_employee_bank${month}`,
                            key: `payroll_employee_bank${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                        {
                            title: "Cash Planned",
                            dataIndex: `empCash${month}`,
                            key: `empCash${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                        {
                            title: "Cash Actual",
                            dataIndex: `payroll_employee_cash${month}`,
                            key: `payroll_employee_cash${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                    ],
                },
                {
                    title: "Workers",
                    children: [
                        {
                            title: "Bank Planned",
                            dataIndex: `workerBank${month}`,
                            key: `workerBank${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                        {
                            title: "Bank Actual",
                            dataIndex: `payroll_worker_bank${month}`,
                            key: `payroll_worker_bank${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                        {
                            title: "Cash Planned",
                            dataIndex: `workerCash${month}`,
                            key: `workerCash${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                        {
                            title: "Cash Actual",
                            dataIndex: `payroll_worker_cash${month}`,
                            key: `payroll_worker_cash${month}`,
                            align: "right",
                            render: (value) => Number(value).toLocaleString("en-IN"),
                        },
                    ],
                },
            ],
        }));

        return dynamicColumns;
    };

    const columns: any = [
        {
            title: "S No",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center",
        },
        {
            title: "Branch Name",
            dataIndex: "branchName",
            render: (val) => (val ? val : "-"),
        },
        {
            title: "State",
            dataIndex: "state",
            render: (val) => (val ? val : "-"),
        },
        {
            title: "Current Workforce",
            children: [
                {
                    title: "Employee",
                    dataIndex: "employeeActive",
                    align: "center",
                },
                {
                    title: "Worker",
                    dataIndex: "workerActive",
                    align: "center",
                },
            ],
        },
        ...generateDynamicColumns(data), // Append dynamically generated columns
    ];

    const exportToExcel = async () => {
        const fileName = `Bank-Cash-Mode-Report.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Bank & Cash Mode Report");
    
        // **Step 1: Extract unique months from data keys**
        let availableMonths = new Set<string>();
        data.forEach((row) => {
            Object.keys(row).forEach((key) => {
                const match = key.match(
                    /(empBank|workerBank|empCash|workerCash|payroll_employee_bank|payroll_worker_bank|payroll_employee_cash|payroll_worker_cash)(\d{6})/
                );
                if (match) {
                    availableMonths.add(match[2]); // Extract MMYYYY
                }
            });
        });
    
        // Sort months for consistent order
        let sortedMonths = [...availableMonths].sort();
    
        // **Step 2: Define Headers**
        let headerRow1 = [
            "S No",
            "Branch Name",
            "State",
            "Current Workforce",
            "",
            ...sortedMonths.flatMap(() => [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ]),
        ];
        let headerRow2 = [
            "",
            "",
            "",
            "Employee",
            "Worker",
            ...sortedMonths.flatMap(() => [
                "Employee - Bank",
                "",
                "Employee - Cash",
                "",
                "Worker - Bank",
                "",
                "Worker - Cash",
                "",
            ]),
        ];
        let headerRow3 = [
            "",
            "",
            "",
            "",
            "",
            ...sortedMonths.flatMap(() => [
                "Planned Bank",
                "Actual Bank",
                "Planned Cash",
                "Actual Cash",
                "Planned Bank",
                "Actual Bank",
                "Planned Cash",
                "Actual Cash",
            ]),
        ];
    
        // **Step 3: Apply headers to worksheet**
        let excelHeader1 = worksheet.addRow(headerRow1);
        let excelHeader2 = worksheet.addRow(headerRow2);
        let excelHeader3 = worksheet.addRow(headerRow3);
    
        // **Apply Styles to Headers**
        [excelHeader1, excelHeader2, excelHeader3].forEach((headerRow) => {
            headerRow.eachCell((cell) => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "228B22" } };
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });
    
        // **Step 4: Merge Static Header Cells**
        try {
            worksheet.mergeCells("D1:E1"); // Workforce Header
            let colIndex = 6; // Starting column for months (after static columns)
    
            sortedMonths.forEach((month) => {
                let formattedMonth = moment(month, "MMYYYY").format("MMM-YY"); // e.g., "Jan-25"
    
                // Merge Month Header for Employee & Worker
                worksheet.mergeCells(1, colIndex, 1, colIndex + 7); // Merge Month Header
                worksheet.getCell(1, colIndex).value = formattedMonth;
                worksheet.getCell(1, colIndex).alignment = { horizontal: "center", vertical: "middle" };
    
                // Merge Employees and Workers for each month
                worksheet.mergeCells(2, colIndex, 2, colIndex + 3); // Employee
                worksheet.getCell(2, colIndex).value = "Employee";
                worksheet.getCell(2, colIndex).alignment = { horizontal: "center", vertical: "middle" };
    
                worksheet.mergeCells(2, colIndex + 4, 2, colIndex + 7); // Worker
                worksheet.getCell(2, colIndex + 4).value = "Worker";
                worksheet.getCell(2, colIndex + 4).alignment = { horizontal: "center", vertical: "middle" };
    
                colIndex += 8; // 8 columns per month
            });
        } catch (error) {
            console.error("Merge error:", error);
        }
    
        // **Step 5: Insert Data**
        data.forEach((row, rowIndex) => {
            let rowData = [
                rowIndex + 1, // S No
                row.branchName || "-", // Branch Name
                row.state || "-", // State
                row.employeeActive, // Employee Count
                row.workerActive, // Worker Count
                ...sortedMonths.flatMap((month) => [
                    row[`empBank${month}`] || 0,
                    row[`payroll_employee_bank${month}`] || 0,
                    row[`empCash${month}`] || 0,
                    row[`payroll_employee_cash${month}`] || 0,
                    row[`workerBank${month}`] || 0,
                    row[`payroll_worker_bank${month}`] || 0,
                    row[`workerCash${month}`] || 0,
                    row[`payroll_worker_cash${month}`] || 0,
                ]),
            ];
    
            const insertedRow = worksheet.addRow(rowData);
            insertedRow.eachCell((cell) => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });
    
        // **Step 6: Export File**
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, fileName);
    };
    

    return (
        <>
            <Card title='Payroll method wise planned vs actual'
                extra={<span><Button
                    onClick={exportToExcel}
                    style={{
                        border: "1px dashed #22f534",
                        color: "green",
                        fontWeight: "bold",
                    }}
                    type="dashed"
                >
                    Get Excel
                </Button></span>}
            >
                <Form layout='vertical' form={form}
                    onFinish={onFinish}
                    initialValues={{ month: initialMonth, year: initialYear }} >
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={3}>
                            <Form.Item label="Year" name="year" rules={[{ required: false, message: "Please select a year!" }]}>
                                <Select placeholder="Select Year" allowClear>
                                    {years.map((year) => (
                                        <Select.Option key={year} value={year}>
                                            {year}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label="Branch" name="branches"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please select a branch', // Custom error message
                                    },
                                ]}>
                                <Select showSearch
                                    allowClear
                                    placeholder="Select Branch"
                                    optionFilterProp="children"

                                >
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={2}>
                            <Button type="primary" htmlType="submit" style={{ marginTop: '25px' }} variant="outlined" color="primary">
                                Submit
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={1}>
                            <Button htmlType="button" onClick={clearData} type='dashed' danger style={{ marginTop: '25px' }}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={data}
                        // loading={loading}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                        }}
                        scroll={{ x: "max-content" }}
                        rowKey="id"
                        bordered
                    />
                </Form>
            </Card >
        </>
    )
}