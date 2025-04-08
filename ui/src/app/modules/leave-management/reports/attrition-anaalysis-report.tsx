import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";
import Column from "antd/es/table/Column";

export default function AttritionAnalysisReport() {
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
        empService.getAttritionAnalysisReport(req).then((res) => {
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

    const getUniqueMonths = () => {
        const monthsSet = new Set();
        data.forEach((row) => {
            Object.keys(row).forEach((key) => {
                const match = key.match(/(newJoinees|leftEmployees|attrition|headCount)(\d{6})/);
                if (match) {
                    const monthYear = match[2]; // Extract 012025 or 022025
                    monthsSet.add(monthYear);
                }
            });
        });
        return [...monthsSet].sort();
    };

    // ✅ Define Static and Dynamic Columns
    const columns: any[] = [
        {
            title: "Branch Name",
            dataIndex: "branchName",
            key: "branchName",
            fixed: "left",
        },
        {
            title: "Total Employees",
            dataIndex: "totalEmployees",
            key: "totalEmployees",
            align: "center",
        },
        ...getUniqueMonths().map((monthYear) => {
            const formattedMonth = moment(monthYear, "MMYYYY").format("MMM-YY"); // e.g., Jan-25
            return {
                title: formattedMonth,
                children: [
                    {
                        title: "Head Count",
                        dataIndex: `headCount${monthYear}`,
                        key: `headCount${monthYear}`,
                        align: "center",
                    },
                    {
                        title: "New Joinees",
                        dataIndex: `newJoinees${monthYear}`,
                        key: `newJoinees${monthYear}`,
                        align: "center",
                    },
                    {
                        title: "Left Employees",
                        dataIndex: `leftEmployees${monthYear}`,
                        key: `leftEmployees${monthYear}`,
                        align: "center",
                    },
                    {
                        title: "Attrition %",
                        dataIndex: `attrition${monthYear}`,
                        key: `attrition${monthYear}`,
                        align: "center",
                    },
                ],
            };
        }),
    ];

    // ✅ Export to Excel with Nested Headers
    const exportToExcel = async () => {
        const fileName = `Attrition_Analysis_Report.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attrition Analysis Summary");
    
        // **Step 1: Extract Unique Months from Data Keys**
        let availableMonths = new Set<string>();
        data.forEach((row) => {
            Object.keys(row).forEach((key) => {
                const match = key.match(/(headCount|newJoinees|leftEmployees|attrition)(\d{6})/);
                if (match) {
                    availableMonths.add(match[2]); // Extract MMYYYY
                }
            });
        });
    
        // Sort months for consistent order
        let sortedMonths = [...availableMonths].sort();
    
        if (sortedMonths.length === 0) {
            console.warn("No valid months found in the data.");
            return;
        }
    
        // **Step 2: Define Headers with Parent and Child Columns**
        // Corrected Header Rows
        let headerRow1 = ["Branch Name", "Total Employees", ...sortedMonths.flatMap(() => ["", "", "", ""])];
        let headerRow2 = ["", "", ...sortedMonths.flatMap(() => ["Head Count", "New Joinees", "Left Employees", "Attrition %"])];

    
        // **Step 3: Apply Headers to Worksheet**
        let excelHeader1 = worksheet.addRow(headerRow1);
        let excelHeader2 = worksheet.addRow(headerRow2);
    
        // **Apply Styles to Headers**
        [excelHeader1, excelHeader2].forEach((headerRow) => {
            headerRow.eachCell((cell) => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }; // Blue background
                cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
            });
        });
    
        // **Step 4: Merge Month Headers Dynamically**
        try {
            let colIndex = 3; // Start after "Branch Name" & "Total Employees"
    
            sortedMonths.forEach((month) => {
                let formattedMonth = moment(month, "MMYYYY").format("MMM-YY"); // Format like "Jan-25"
    
                // Merge cells for each month (4 columns per month)
                worksheet.mergeCells(1, colIndex, 1, colIndex + 3);
                worksheet.getCell(1, colIndex).value = formattedMonth;
                worksheet.getCell(1, colIndex).alignment = { horizontal: "center", vertical: "middle" };
    
                colIndex += 4;
            });
        } catch (error) {
            console.error("Error merging month headers:", error);
        }
    
        // **Step 5: Insert Data Rows**
        data.forEach((row, rowIndex) => {
            let rowData = [
                row.branchName || "-",
                row.totalEmployees || 0,
                ...sortedMonths.flatMap((month) => [
                    row[`headCount${month}`] || 0,
                    row[`newJoinees${month}`] || 0,
                    row[`leftEmployees${month}`] || 0,
                    row[`attrition${month}`] || "0.00",
                ]),
            ];
            const insertedRow = worksheet.addRow(rowData);
            insertedRow.eachCell((cell) => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
            });
        });
    
        // **Step 6: Export File**
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, fileName);
    };
    
    return (
        <>
            <Card title='Monthly Salaries Summary Report'
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