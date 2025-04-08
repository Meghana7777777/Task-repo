import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";

export default function AttendanceMisReport() {
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
        empService.getMonthlyAttendanceMisReport(req).then((res) => {
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

    const generateDynamicColumns = (data) => {
        if (!data.length) return [];
    
        // Extract unique months from keys
        const months = [...new Set(data.flatMap((item) =>
            Object.keys(item)
                .filter((key) => key.match(/plannedEmp(\d{6})|actualEmp(\d{6})/)) // Matches plannedEmpMMYYYY / actualEmpMMYYYY
                .map((key) => key.slice(-6)) // Extract MMYYYY
        ))];
    
        // Generate columns for each month
        const dynamicColumns = months.map((month) => ({
            title: moment(month, "MMYYYY").format("MMM-YY"), // Format as "Jan-25"
            children: [
                {
                    title: "Planned",
                    dataIndex: `plannedEmp${month}`,
                    key: `planned${month}`,
                    align: "center",
                },
                {
                    title: "Actual",
                    dataIndex: `actualEmp${month}`,
                    key: `actual${month}`,
                    align: "center",
                },
                {
                    title: "Absent %",
                    key: `absent${month}`,
                    render: (_, record) => {
                        const planned = record[`plannedEmp${month}`] || 0;
                        const actual = record[`actualEmp${month}`] || 0;
                        return planned > 0
                            ? `${(((planned - actual) / planned) * 100).toFixed(2)}%`
                            : "0%";
                    },
                    align: "center",
                },
            ],
        }));
    
        return dynamicColumns;
    };
    
    // Combine static and dynamic columns
    const columns :any= [
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
            title:'Employees',
            dataIndex:'employeeActive',
        },
        ...generateDynamicColumns(data), // Append only month-based columns without "Employee" grouping
    ];
    
    

    const clearData = () => {
        form.resetFields()
        getReportData()
    }
    function onFinish(values) {
        getReportData();
    };

    const exportToExcel = async () => {
        const fileName = `Employee-Attendance-Audit-Report.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Employee Audit");
    
        // **Step 1: Extract unique months from data keys**
        let availableMonths = new Set();
        data.forEach((row) => {
            Object.keys(row).forEach((key) => {
                const match = key.match(/(plannedEmp|actualEmp)(\d{6})/);
                if (match) {
                    availableMonths.add(match[2]); // Extract MMYYYY
                }
            });
        });
    
        // Sort months for consistent order
        let sortedMonths = [...availableMonths].sort();
    
        // **Step 2: Define Headers (With Parent Grouping)**
        let headerRow1 = [
            "S No",
            "Branch Name",
            "State",
            "Employees",
            ...sortedMonths.flatMap(() => ["", "", ""]), // For Planned, Actual, and Absent % dynamically
        ];
        let headerRow2 = [
            "",
            "",
            "",
            "",
            ...sortedMonths.flatMap(() => ["Planned", "Actual", "Absent %"]),
        ];
    
        // **Step 3: Apply headers to worksheet**
        let excelHeader1 = worksheet.addRow(headerRow1);
        let excelHeader2 = worksheet.addRow(headerRow2);
    
        // **Apply Styles to Headers**
        [excelHeader1, excelHeader2].forEach((headerRow) => {
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
    
        // **Step 4: Merge Parent Header Cells**
        try {
            worksheet.mergeCells("D1:D2"); // Merge "Employees" header
    
            let colIndex = 5; // Starting column for months after Employees
            sortedMonths.forEach((month) => {
                worksheet.mergeCells(1, colIndex, 1, colIndex + 2); // Merge Month Header (e.g., Jan-25)
                worksheet.getCell(1, colIndex).value = moment(month, "MMYYYY").format("MMM-YY");
                worksheet.getCell(1, colIndex).alignment = { horizontal: "center", vertical: "middle" };
                colIndex += 3;
            });
        } catch (error) {
            console.error("Merge error:", error);
        }
    
        // **Step 5: Insert Data**
        data.forEach((row, rowIndex) => {
            let rowData = [
                rowIndex + 1,
                row.branchName || "-",
                row.state || "-",
                row.employeeActive || "-", // Employee count or value
                ...sortedMonths.flatMap((month) => {
                    const planned = row[`plannedEmp${month}`] || 0;
                    const actual = row[`actualEmp${month}`] || 0;
                    const absentPercentage = planned > 0 ? (((planned - actual) / planned) * 100).toFixed(2) + "%" : "0%";
    
                    return [planned, actual, absentPercentage];
                }),
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
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
    };
    
    return (
        <>
            <Card title='Employee Attendance MIS Report'
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