import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";

export default function BranchWiseEmployeeTrack() {
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
        empService.getBranchWiseEmpStatusReport(req).then((res) => {
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

    const columns: any = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: 'Branch Name',
            dataIndex: 'branchName',
            render: (val, rec) => {
                return val ? val : '-'
            }
        },
        {
            title: 'Employee',
            children: [
                {
                    title: 'Active',
                    dataIndex: 'employeeActive'
                },
                {
                    title: 'In Active',
                    dataIndex: 'employeeInactive'
                }
            ]
        },

        {
            title: 'Attendance (MTD)',
            children: [
                {
                    title: 'Present',
                    dataIndex: 'employeePresentMTD',
                    key: 'employeePresentMTD',
                    align: 'center'
                },
                {
                    title: 'Absent',
                    dataIndex: 'employeeAbsentMTD',
                    key: 'employeeAbsentMTD',
                    align: 'center'
                },
                {
                    title: 'Leave',
                    dataIndex: 'employeeLeaveMTD',
                    key: 'employeeLeaveMTD',
                    align: 'center'
                }
            ]
        },
        {
            title: 'Payroll',
            children: [
                {
                    title: 'Cash',
                    dataIndex: 'empCashPayment'
                },
                {
                    title: 'Bank',
                    dataIndex: 'empBankPayment'
                }
            ]
        },
        {
            title: 'Leave Policy Code',
            dataIndex: 'leavePolicyCode'
        },
        {
            title: 'Salary Policy Code',
            dataIndex: 'salaryPolicyCode'
        }
    ]

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" }
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
        const worksheet = workbook.addWorksheet("Employee Attendance Audit");
    
        // Define column headers and structure based on the provided table
        const headers = [
            ["Branch Name", "Employee", "", "Attendance (MTD)", "", "", "Payroll", "", "Leave Policy Code", "Salary Policy Code"],
            ["", "Active", "In Active", "Present", "Absent", "Leave", "Cash", "Bank", "", ""]
        ];
    
        // Define column width for better spacing
        const columnWidths = [25, 12, 12, 12, 12, 12, 12, 12, 18, 18];
    
        // Apply headers to worksheet
        headers.forEach((row) => {
            const headerRow = worksheet.addRow(row);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "228B22" } // Green background
                };
                cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text, bold
                cell.alignment = { horizontal: "center", vertical: "middle" }; // Center align
                cell.border = { // Thin border
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });
        });
    
        // Merge necessary header cells based on the table structure
        worksheet.mergeCells("B1:C1"); // Employee
        worksheet.mergeCells("D1:F1"); // Attendance (MTD)
        worksheet.mergeCells("G1:H1"); // Payroll
    
        // Apply column width
        worksheet.columns = columnWidths.map((width) => ({ width }));
    
        // Insert data into the sheet
        data.forEach(row => {
            const excelRow = [
                row.branchName ? row.branchName : '-',
                row.employeeActive, row.employeeInactive,
                row.employeePresentMTD, row.employeeAbsentMTD, row.employeeLeaveMTD,
                row.empCashPayment, row.empBankPayment,
                row.leavePolicyCode ? row.leavePolicyCode : '-', row.salaryPolicyCode ? row.salaryPolicyCode : '-'
            ];
            const rowInserted = worksheet.addRow(excelRow);
    
            // Apply border & alignment to all data cells
            rowInserted.eachCell(cell => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });
        });
    
        // Create and save the file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, fileName);
    };
    

    return (
        <>
            <Card title='Employee Attendance Audit Report'
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
                        {/* Month Dropdown */}
                        <Col xs={24} sm={12} md={8} lg={4} xl={3} style={{ marginRight: '18px' }}>
                            <Form.Item label="Month" name="month" rules={[{ required: false, message: "Please select a month!" }]}>
                                <Select placeholder="Select Month" allowClear>
                                    {months.map((month) => (
                                        <Select.Option key={month.value} value={month.value}>
                                            {month.label}
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