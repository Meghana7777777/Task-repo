import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";
import { title } from "process";

export default function WorkerMisReport() {
    const [form] = Form.useForm();
    const Option = Select;
    const [page, setPage] = React.useState(1);
    const [data, setData] = useState([]);
    const [branches, setBranches] = useState<any>([]);
    const branchService = new BranchesService();
    const empService = new EmployeeOnboardingService();

    useEffect(() => {
        getAllBranches()
        getReportData()
    }, []);

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

    function getReportData() {
        const req = {
            branchId: form.getFieldValue('branches'),
        }
        empService.getBranchWorkerWiseMisReport(req).then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
    }

    const clearData = () => {
        form.resetFields()
        getReportData()
    }

    function onFinish(values) {
        getReportData();
    };

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
            title: 'State',
            dataIndex: 'state',
            render: (val, rec) => {
                return val ? val : '-'
            }
        },
        {
            title: 'Workers',
            dataIndex: 'employeeActive'
        },
        {
            title: 'Gender',
            children: [
                {
                    title: 'Men',
                    dataIndex: 'maleEmpCount'
                },
                {
                    title: 'Women',
                    dataIndex: 'femaleEmpCount'
                }
            ]
        },
        {
            title: 'Age',
            children: [
                {
                    title: 'Below 18',
                    dataIndex: 'age_below_18'
                },
                {
                    title: '18-24',
                    dataIndex: 'age_18_24'
                },
                {
                    title: '25-34',
                    dataIndex: 'age_25_34'
                },
                {
                    title: '35-44',
                    dataIndex: 'age_35_44'
                },
                {
                    title: 'Above 45',
                    dataIndex: 'age_45_above'
                },
            ]
        },
        {
            title: 'Worker Tenure',
            children: [
                {
                    title: '0-1',
                    dataIndex: 'tenure_0_1'
                },
                {
                    title: '1-3',
                    dataIndex: 'tenure_1_3'
                },
                {
                    title: '3-5',
                    dataIndex: 'tenure_3_5'
                },
                {
                    title: 'Above 5',
                    dataIndex: 'tenure_above_5'
                },
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
    ];

  const exportToExcel = async () => {
         const fileName = `Worker-mis-Report.xlsx`;
         const workbook = new ExcelJS.Workbook();
         const worksheet = workbook.addWorksheet("Employee Report");
     
         // Define parent headers
         const parentHeaders = [ "S No", "Branch Name", "State", "Workers", "Gender", "", "Age", "", "", "", "", "Worker Tenure", "", "", "", "Leave Policy Code", "Salary Policy Code"
         ];
     
         // Define subheaders to align correctly
         const subHeaders = [ "", "", "", "", "Men", "Women", "Below 18", "18-24", "25-34", "35-44", "Above 45", "0-1", "1-3", "3-5", "Above 5", "", ""
         ];
     
         // Apply parent headers
         const headerRow1 = worksheet.addRow(parentHeaders);
         const headerRow2 = worksheet.addRow(subHeaders);
     
         // Apply styles to header rows
         [headerRow1, headerRow2].forEach((headerRow) => {
             headerRow.eachCell((cell) => {
                 cell.fill = {
                     type: "pattern",
                     pattern: "solid",
                     fgColor: { argb: "228B22" } // Green background
                 };
                 cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text, bold
                 cell.alignment = { horizontal: "center", vertical: "middle" };
                 cell.border = {
                     top: { style: "thin" },
                     left: { style: "thin" },
                     bottom: { style: "thin" },
                     right: { style: "thin" }
                 };
             });
         });
     
         // Merge parent headers where needed
         worksheet.mergeCells("E1:F1"); // Gender
         worksheet.mergeCells("G1:K1"); // Age
         worksheet.mergeCells("L1:O1"); // Employee Tenure
     
         // Apply column widths for better display
         const columnWidths = [10, 25, 18, 12, 10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 18, 18];
         worksheet.columns = columnWidths.map((width) => ({ width }));
     
         // Insert data rows into the sheet
         data.forEach((row, index) => {
             const excelRow = [
                 index + 1, // S No
                 row.branchName ? row.branchName : "-",
                 row.state ? row.state : "-",
                 row.employeeActive || 0,
                 row.maleEmpCount || 0,
                 row.femaleEmpCount || 0,
                 row.age_below_18 || 0,
                 row.age_18_24 || 0,
                 row.age_25_34 || 0,
                 row.age_35_44 || 0,
                 row.age_45_above || 0,
                 row.tenure_0_1 || 0,
                 row.tenure_1_3 || 0,
                 row.tenure_3_5 || 0,
                 row.tenure_above_5 || 0,
                 row.leavePolicyCode ? row.leavePolicyCode : "-",
                 row.salaryPolicyCode ? row.salaryPolicyCode : "-"
             ];
             const rowInserted = worksheet.addRow(excelRow);
     
             // Apply border and alignment to all data rows
             rowInserted.eachCell((cell) => {
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
            <Card title='Worker MIS Report'
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
                >
                    <Row gutter={24}>
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