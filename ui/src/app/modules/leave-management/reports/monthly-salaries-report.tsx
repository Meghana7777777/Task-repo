import { BranchesService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import moment from "moment";

export default function MonthlySalariesSummaryReport() {
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
        empService.getMonthSalariesSummaryReport(req).then((res) => {
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

    const extractMonths = (data) => {
        if (!data.length) return [];

        const monthKeys = [
            "actualGross",
            "employerPF",
            "employerESI",
            "paidGross",
            "costToCompany",
            "avgCTCPerHead",
            "avgGrossPerHead",
        ];

        const months = [
            ...new Set(
                data.flatMap((item) =>
                    Object.keys(item)
                        .filter((key) => monthKeys.some((prefix) => key.startsWith(prefix)))
                        .map((key) => key.slice(-6)) // Extract MMYYYY from keys
                )
            ),
        ];

        return months;
    };

    const generateDynamicColumns = (data) => {
        const months = extractMonths(data);
        if (!months.length) return [];

        return months.map((month) => ({
            title: moment(month, "MMYYYY").format("MMM-YY"), // Format as "Jan-25"
            children: [
                {
                    title: "Actual Gross",
                    dataIndex: `actualGross${month}`,
                    key: `actualGross${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
                {
                    title: "Employer PF - 12%",
                    dataIndex: `employerPF${month}`,
                    key: `employerPF${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
                {
                    title: "Employer ESI - 3.25%",
                    dataIndex: `employerESI${month}`,
                    key: `employerESI${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
                {
                    title: "Paid Gross",
                    dataIndex: `paidGross${month}`,
                    key: `paidGross${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
                {
                    title: "Cost to Company",
                    dataIndex: `costToCompany${month}`,
                    key: `costToCompany${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
                {
                    title: "Avg CTC/Head",
                    dataIndex: `avgCTCPerHead${month}`,
                    key: `avgCTCPerHead${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
                {
                    title: "Avg Gross/Head",
                    dataIndex: `avgGrossPerHead${month}`,
                    key: `avgGrossPerHead${month}`,
                    align: "right",
                    render: (value) => Number(value || 0).toLocaleString("en-IN"),
                },
            ],
        }));
    };

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
            title: "Total Employees",
           dataIndex:'totalEmployees'
        },
        ...generateDynamicColumns(data)
    ];

    const clearData = () => {
        form.resetFields()
        getReportData()
    }
    function onFinish(values) {
        getReportData();
    };

    const exportToExcel = async () => {
        const fileName = `Payroll-Planned-vs-Actual.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Monthly Salaries Summary");
    
        // **Step 1: Extract unique months from data keys**
        let availableMonths = new Set<string>();
        data.forEach((row) => {
            Object.keys(row).forEach((key) => {
                const match = key.match(/(actualGross|employerPF|employerESI|paidGross|costToCompany|avgCTCPerHead|avgGrossPerHead)(\d{6})/);
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
    
        // **Step 2: Define Headers to Match Provided Image**
        let headerRow1 = ["Branch Name", "Total Employees", ...sortedMonths.flatMap(() => ["", "", "", "", "","",""])];
        let headerRow2 = ["", "", ...sortedMonths.flatMap(() => ["Actual Gross","Employer PF - 12%","Employer ESI - 3.25%", "Paid Gross", "Cost to Company", "Avg CTC/Head", "Avg Gross/Head"])];
    
        // **Step 3: Apply headers to worksheet**
        let excelHeader1 = worksheet.addRow(headerRow1);
        let excelHeader2 = worksheet.addRow(headerRow2);
    
        // **Apply Styles to Headers**
        [excelHeader1, excelHeader2].forEach((headerRow) => {
            headerRow.eachCell((cell) => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } };
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
            });
        });
    
        // **Step 4: Merge Month Headers Dynamically**
        try {
            let colIndex = 3; // Start after "Branch Name" & "Total Employees"
    
            sortedMonths.forEach((month) => {
                let formattedMonth = moment(month, "MMYYYY").format("MMM-YY"); // Format like "Jan-25"
    
                // Merge cells for each month (5 columns per month)
                worksheet.mergeCells(1, colIndex, 1, colIndex + 6);
                worksheet.getCell(1, colIndex).value = formattedMonth;
                worksheet.getCell(1, colIndex).alignment = { horizontal: "center", vertical: "middle" };
    
                colIndex += 7;
            });
        } catch (error) {
            console.error("Error merging month headers:", error);
        }
    
        // **Step 5: Insert Data**
        data.forEach((row, rowIndex) => {
            let rowData = [
                row.branchName || "-",
                row.totalEmployees || 0,
                ...sortedMonths.flatMap((month) => [
                    row[`actualGross${month}`] || 0,
                    row[`employerPF${month}`] || 0,
                    row[`employerESI${month}`] || 0,
                    row[`paidGross${month}`] || 0,
                    row[`costToCompany${month}`] || 0,
                    row[`avgCTCPerHead${month}`] || 0,
                    row[`avgGrossPerHead${month}`] || 0,
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