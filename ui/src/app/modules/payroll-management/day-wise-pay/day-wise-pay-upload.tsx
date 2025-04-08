import { FileExcelFilled } from "@ant-design/icons";
import { AlertMessages } from "@hrexpert/shared-models";
import { DayWisePaySharedService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Row, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { IExcelColumn } from "antd-table-saveas-excel/app";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import moment from "moment";
import Papa from 'papaparse';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

export const DayWisePayUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [page, setPage] = React.useState(1);
    const service = new DayWisePaySharedService()
    const navigate = useNavigate()

    const importExcel = (file: ArrayBuffer) => {
        const data = new Uint8Array(file);
        const wb = XLSX.read(data, { type: "array", cellDates: true });
        return Object.keys(wb.Sheets).map((sheetName) =>
            XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { raw: false, header: 1 })
        );
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const fileType = file.type;
        setSelectedFile(file);

        const parseDate = (dateString: string): string => {
            return moment(dateString, ["DD-MM-YYYY", "DD/MM/YYYY"], true).isValid()
                ? moment(dateString, ["DD-MM-YYYY", "DD/MM/YYYY"], true).format("YYYY-MM-DD")
                : dateString;
        };

        if (fileType === "text/csv") {
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    const formattedData = result.data.filter(row =>
                        Object.values(row).some(value => value !== "" && value !== null && value !== " ")
                    );
                    setData(formattedData);
                },
                skipEmptyLines: true,
            });
        } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = () => {
                const excelData = importExcel(reader.result as ArrayBuffer);
                const output = excelData.map((sheet: any) =>
                    sheet.slice(1).map((row: any, rowIndex) =>
                        sheet[0].reduce((acc, key, colIndex) => {
                            console.log(key, 'key');
                            console.log(acc, 'acc');
                            // Ensure acc[key] is assigned before trying to parse the date
                            acc[key] = row[colIndex] !== undefined ? row[colIndex] : "";
                            if (key.toLowerCase().includes("date")) {
                                console.log(acc[key]);
                                acc[key] = parseDate(acc[key]); // Parse and reformat date
                                console.log(acc[key], 'acc[key]');
                            }
                            return acc;
                        }, {})
                    ).filter(row => Object.values(row).some(value => value !== "" && value !== null && value !== " "))
                );
                setData(output[0]);
            };
        } else {
            alert("Please select a valid .csv or .xlsx file.");
            setSelectedFile(null);
        }
    };

    const sampleLeaveExcelFormat = [
        {
            EmpId: "",
            JobCode: "",
            Date: "",
            Units: "",
            AdditionalEarning: "",
            AdditionalDeduction: "",
        },
    ];

    const handleExport = (e: any) => {
        e.preventDefault();
        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("/");
        const excel = new Excel();
        excel.addSheet("Sheet1");
        excel.addColumns(sampleExcelFormatColumns);
        excel.addDataSource(sampleLeaveExcelFormat, { str2num: false });
        excel.saveAs(`Day-Wise-Report-${currentDate}.xlsx`);
    }

    let sampleExcelFormatColumns: IExcelColumn[] = [
        {
            title: 'EmpId',
            dataIndex: 'EmpId',
        },
        {
            title: "JobCode",
            dataIndex: "JobCode",
        },
        {
            title: "Date(DD-MM-YYYY)",
            dataIndex: "Date",
        },
        {
            title: "Units",
            dataIndex: "Units",
        },
        {
            title: "AdditionalEarning",
            dataIndex: "AdditionalEarning ",
        },
        {
            title: "AdditionalDeduction",
            dataIndex: "AdditionalDeduction ",
        },
    ];

    const onReset = () => {
        form.resetFields();
        setData([]);
        setSelectedFile(null);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const columnsData: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Emp Id",
            dataIndex: "EmpId",
            key: "EmpId",
            align: "center",
        },
        {
            title: "Job Code",
            dataIndex: "JobCode",
            key: "JobCode",
            align: "center",
        }, {
            title: "Date",
            dataIndex: "Date(DD-MM-YYYY)",
            key: "Date",
            align: "center",
            render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : '-'),
        }, {
            title: "Units",
            dataIndex: "Units",
            key: "Units",
            align: "center",
        }, {
            title: "Additional Earning",
            dataIndex: "AdditionalEarning",
            key: "AdditionalEarning",
            align: "center",
        }, {
            title: "Additional Deduction",
            dataIndex: "AdditionalDeduction",
            key: "AdditionalDeduction",
            align: "center",
        },
    ]

    const handleUpload = () => {
        try {
            service.saveDayWisePayExcel(data).then(res => {
                if (res.status) {
                    onReset()
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            })
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    }

    const handleNaviagte = () => {
        navigate('/day-wise-pay-view')
    }

    return (
        <Card
            title="Workers Daywise Jobs Excel Upload"
            extra={
                <>
                    <Button type="default" style={{ color: 'green' }} onClick={handleExport} icon={<FileExcelFilled />}> Sample Format</Button>&nbsp;
                    <Button onClick={handleNaviagte} color="primary" variant="outlined"> View</Button>
                </>
            }>

            <Form>
                <Row gutter={24}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                        <Form.Item label="">
                            <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileChange} />
                            <label style={{ color: 'blue', whiteSpace: 'nowrap' }} >Only csv & excel files are allowed</label>
                        </Form.Item>
                    </Col>
                    {data.length > 0 && (
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                            <Button color="primary" variant="outlined" onClick={handleUpload}>Submit</Button>&nbsp;
                            <Button color="danger" variant="outlined" danger onClick={onReset}>Reset</Button>
                        </Col>
                    )}
                </Row>
                {data.length > 0 ? (
                    <Table className="custom-table-wrapper" pagination={false} bordered dataSource={data} columns={columnsData} rowKey="Employee Code" />
                ) : (
                    <div>No data available</div>
                )}
            </Form>
        </Card>
    )

}

export default DayWisePayUpload