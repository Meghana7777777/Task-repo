import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";

export default function MonthlyAttritionReport() {
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
        empService.getBranchWiseAttritionCount(req).then((res) => {
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
        const months = new Set();
    
        // Extract unique month-year values from keys
        data.forEach(item => {
            Object.keys(item).forEach(key => {
                const match = key.match(/resign_emp(\d{6})|resign_worker(\d{6})/);
                if (match) {
                    months.add(match[1] || match[2]); // Extract MMYYYY
                }
            });
        });
    
        // Sort months in ascending order
        const sortedMonths = [...months].sort(
            (a, b) => moment(a, "MMYYYY").valueOf() - moment(b, "MMYYYY").valueOf()
        );

        return sortedMonths.map(month => ({
            title: moment(month, "MMYYYY").format("MMM-YY"), // Format: "Jan-25"
            children: [
                {
                    title: "Employees",
                    dataIndex: `resign_emp${month}`,
                    key: `resign_emp${month}`,
                    align: "center",
                },
                {
                    title: "Workers",
                    dataIndex: `resign_worker${month}`,
                    key: `resign_worker${month}`,
                    align: "center",
                },
            ],
        }));
    };
    
    // Combine static and dynamic columns
    const columns:any = [
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
            title: "Workforce",
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
        ...generateDynamicColumns(data),
         // Append dynamically generated columns
    ];

    const clearData = () => {
        form.resetFields()
        getReportData()
    }
    function onFinish(values) {
        getReportData();
    };
    const exportToExcel = async () => {
        const fileName = `monthly-attrition-Report.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Workforce Audit");
    
        // **Step 1: Extract and Sort Unique Months**
        let availableMonths = new Set();
    
        data.forEach(row => {
            Object.keys(row).forEach(key => {
                const match = key.match(/resign_(emp|worker)(\d{6})/); // Matches resign_empMMYYYY or resign_workerMMYYYY
                if (match) {
                    availableMonths.add(match[2]); // Extract MMYYYY
                }
            });
        });
    
        let sortedMonths = [...availableMonths].sort(
            (a, b) => moment(a, "MMYYYY").valueOf() - moment(b, "MMYYYY").valueOf()
        );
    
        // **Step 2: Define Headers**
        let headerRow1 = ["S No", "Branch Name", "State", "Workforce", "", ...sortedMonths.flatMap(() => ["", ""])];
        let headerRow2 = ["", "", "", "Employee", "Worker", ...sortedMonths.flatMap(() => ["Employees", "Workers"])];
    
        // **Step 3: Apply Headers**
        let excelHeader1 = worksheet.addRow(headerRow1);
        let excelHeader2 = worksheet.addRow(headerRow2);
    
        // **Apply Styles**
        [excelHeader1, excelHeader2].forEach((headerRow) => {
            headerRow.eachCell(cell => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "228B22" } };
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
            });
        });
    
        // **Step 4: Merge Headers**
        try {
            worksheet.mergeCells("D1:E1"); // Merge Workforce Columns
            let colIndex = 6; // Start index for months
    
            sortedMonths.forEach(month => {
                let formattedMonth = moment(month, "MMYYYY").format("MMM-YY"); // e.g., "Jan-25"
    
                worksheet.mergeCells(1, colIndex, 1, colIndex + 1);
                worksheet.getCell(1, colIndex).value = formattedMonth;
                worksheet.getCell(1, colIndex).alignment = { horizontal: "center", vertical: "middle" };
    
                colIndex += 2; // Move to next month column
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
                row.employeeActive || 0,
                row.workerActive || 0,
                ...sortedMonths.flatMap(month => [
                    row[`resign_emp${month}`] || 0,
                    row[`resign_worker${month}`] || 0,
                ])
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
            <Card title='Monthly Attrition Report'
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