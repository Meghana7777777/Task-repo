import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";

export default function EntrollStatusReport() {
    const [form] = Form.useForm();
    const Option = Select;
    const [page, setPage] = React.useState(1);
    const [data, setData] = useState([])
    const [branches, setBranches] = useState<any>([]);
    const branchService = new BranchesService();
    const empService = new EmployeeOnboardingService();

    useEffect(() => {
        getAllBranches()
        getReportData()
    }, []);

    function getReportData() {
        const req = {
            branchId: form.getFieldValue('branches')
        }
        empService.getEnrollmentReport(req).then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
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
            title: 'Total Employees',
            dataIndex: 'employeeCount',
            render: (val, rec) => {
                return val ? val : '-'
            }
        },
        {
            title: 'PF Enrolled',
            dataIndex: 'pfEnrolledCount',
            render: (val, rec) => {
                return val ? val : 0;
            }
        },
        {
            title: 'PF To Be Enrolled',
            dataIndex: 'pfToBeEnrolledCount',
            render: (val, rec) => {
                return val ? val : 0
            }
        },
        {
            title: 'ESI Enrolled',
            dataIndex: 'esciEnrolledCount',
            render: (val, rec) => {
                return val ? val : 0
            }
        },
        {
            title: 'ESI To Be Enrolled',
            dataIndex: 'esciToBeEnrolledCount',
            render: (val, rec) => {
                return val ? val : 0
            }
        },

    ]

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

    const getSummaryRow = (data) => {
        let totalEmployees = 0;
        let pfEnrolled = 0;
        let pfToBeEnrolled = 0;
        let esiEnrolled = 0;
        let esiToBeEnrolled = 0;

        data.forEach((item) => {
            totalEmployees += item.employeeCount || 0;
            pfEnrolled += item.pfEnrolledCount || 0;
            pfToBeEnrolled += item.pfToBeEnrolledCount || 0;
            esiEnrolled += item.esciEnrolledCount || 0;
            esiToBeEnrolled += item.esciToBeEnrolledCount || 0;
        });

        return {
            branchName: "Grand Total",
            employeeCount: totalEmployees,
            pfEnrolledCount: pfEnrolled,
            pfToBeEnrolledCount: pfToBeEnrolled,
            esciEnrolledCount: esiEnrolled,
            esciToBeEnrolledCount: esiToBeEnrolled,
        };
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Enrollment Report");
    
        // Define header row
        const headerRow = [
            "S No",
            "Branch Name",
            "Total Employees",
            "PF Enrolled",
            "PF To Be Enrolled",
            "ESI Enrolled",
            "ESI To Be Enrolled",
        ];
        worksheet.addRow(headerRow);
    
        // Add data rows
        data.forEach((item, index) => {
            worksheet.addRow([
                index + 1,
                item.branchName || "-",
                item.employeeCount || 0,
                item.pfEnrolledCount || 0,
                item.pfToBeEnrolledCount || 0,
                item.esciEnrolledCount || 0,
                item.esciToBeEnrolledCount || 0,
            ]);
        });
    
        // Add Grand Total row
        const summaryRow = getSummaryRow(data);
        worksheet.addRow([
            "",
            "Grand Total",
            summaryRow.employeeCount,
            summaryRow.pfEnrolledCount,
            summaryRow.pfToBeEnrolledCount,
            summaryRow.esciEnrolledCount,
            summaryRow.esciToBeEnrolledCount,
        ]);
    
        // Apply styles to header row
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "228B22" }, // Green background
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });
    
        // Apply border and alignment to all data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                if (rowNumber !== 1) {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                }
            });
        });
    
        // Generate Excel buffer and download
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Enrollment_Report.xlsx`);
    };
    


    return (
        <>
            <Card title="Entroll Status Report" style={{ marginBottom: 20 }} extra={<span><Button
                                onClick={exportToExcel}
                                style={{
                                    border: "1px dashed #22f534",
                                    color: "green",
                                    fontWeight: "bold",
                                }}
                                type="dashed"
                            >
                                Get Excel
                            </Button></span>}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item name="branches" label="Branch">
                                <Select placeholder="Select Branch" allowClear>
                                    {branches.map((branch: any) => (
                                        <Option key={branch.id} value={branch.id}>{branch.branchName}</Option>
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
                </Form>
            </Card>
            <Card>
                <Table
                    columns={columns}
                    dataSource={[...data, getSummaryRow(data)]}
                    pagination={false}
                // pagination={{ pageSize: 10, current: page, onChange: (page) => setPage(page) }}
                />
            </Card>
        </>
    )
}