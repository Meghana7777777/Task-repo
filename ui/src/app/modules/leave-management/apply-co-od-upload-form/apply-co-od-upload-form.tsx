import { FileExcelFilled, UploadOutlined } from "@ant-design/icons";
import { AlertMessages } from "@hrexpert/shared-models";
import { AttendanceServices, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Col, Form, Row, Table, Upload, UploadProps } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { IExcelColumn } from "antd-table-saveas-excel/app";
import dayjs from "dayjs";
import moment from "moment";
import Papa from 'papaparse';
import { useState } from "react";
import * as XLSX from 'xlsx';
import '../../../../styles.css';
export interface ApplyForOdCoFormProps {
    data: any;
    closeForm: () => void;
    getApplyCoOdUploadData?: () => void
}

const ApplyForOdCoForm = (props: ApplyForOdCoFormProps) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([]);
    const service = new AttendanceServices()
    const [loading, setLoading] = useState(false);
    const [errorRows, setErrorRows] = useState([]);
    const [errorEmpCodeRows, setErrorEmpCodeRows] = useState([]);
    const [employees, setEmployees] = useState<any>([]);
    const employeeDetails = new EmployeeOnboardingService()

    const importExcel = (file: any[]) => {
        var data = new Uint8Array(file);
        var wb = XLSX.read(data, { type: 'array', cellDates: true });
        let sheet: any[] = [];
        for (const Sheet in wb.Sheets) {
            if (Sheet) {
                if (wb.Sheets.hasOwnProperty(Sheet)) {
                    sheet.push(XLSX.utils.sheet_to_json(wb.Sheets[Sheet], { raw: true, header: 1 }));
                }
            }
        }
        return sheet;
    }

    // useEffect(() => {
    //     getAllEmployeesTable()
    // }, [employees]);

    // const getAllEmployeesTable = () => {
    //     try {
    //         setLoading(true);
    //         employeeDetails.getAllEmployeesTable().then((res) => {
    //             if (res.status) {
    //                 setEmployees(res.data);
    //                 // setLoading(false); 
    //             } else {
    //                 setEmployees('No Data Found');
    //                 // setLoading(false); 
    //             }
    //         });
    //     } catch (err) {
    //         console.error(err);
    //     }
    //     finally {
    //         setLoading(false);
    //     }
    // };


    let exportingColumns: IExcelColumn[] = [
        {
            title: 'Employee Code',
            dataIndex: 'employee_code',
            __cellType__: "TypeString",
            render: (text, record) => record.employee_code ? record.employee_code : '-'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            __cellType__: "TypeString",
            render: (text, record) => record.type ? record.type : '-'
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            __cellType__: "TypeString",
        },
        {
            title: 'To Date',
            dataIndex: 'to_date',
            __cellType__: "TypeString",
        },
        {
            title: 'No of Days',
            dataIndex: 'no_of_days',
            __cellType__: "TypeString",
            render: (text, record) => record.no_of_days ? record.no_of_days : '-'
        },
        {
            title: 'Leave Reason',
            dataIndex: 'leave_reason',
            __cellType__: "TypeString",
            render: (text, record) => record.leave_reason ? record.leave_reason : '-'
        },
    ];

    const sampleHolidays = [
        {
            employee_code: "Employee Code",
            type: "OD/CO",
            from_date: "YYYY-MM-DD",
            to_date: "YYYY-MM-DD",
            no_of_days: "3",
            leave_reason: "Example Reason",
        },
    ];

    const exportExcel = (e: any) => {
        e.preventDefault();
        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("/");
        const excel = new Excel();
        excel.addSheet("Sheet1");
        excel.addColumns(exportingColumns);
        excel.addDataSource(sampleHolidays, { str2num: false });
        excel.saveAs(`CO-OD-Sample-${currentDate}.xlsx`);
    }

    const parseDate = (dateString, addDays = 0) => {
        const date = moment(dateString, "DD-MM-YYYY").local();
        if (date.isValid()) {
            return date.add(addDays, 'days').format("YYYY-MM-DD");
        }
        return null;
    }

    const handleFileChange = (event) => {
        const file = event.file.originFileObj;
        setSelectedFile(file);
        if (file && file.type === 'text/csv') {
            const tempErrorRows = [];
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    const parsedData = result.data.filter((row) => Object.keys(row).some((key) => row[key] !== ""));
                    const validatedData = parsedData.map((row) => {
                        const fromDate = parseDate(row["From Date"]);
                        const toDate = parseDate(row["To Date"]);
                        if (!fromDate || !toDate) {
                            tempErrorRows.push(row);
                            return row;
                        }
                        const expectedDays = moment(toDate).diff(moment(fromDate), 'day') + 1;
                        const actualDays = parseInt(row["No of Days"], 10);
                        if (actualDays !== expectedDays) {
                            tempErrorRows.push(row);
                        }
                        row["From Date"] = fromDate;
                        row["To Date"] = toDate;
                        return row;
                    });
                    setData(validatedData);
                    setColumns(Object.keys(parsedData[0] || {}));
                    setErrorRows(tempErrorRows);
                },
                skipEmptyLines: true,
            });
        } else if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataArray = new Uint8Array(e.target.result as ArrayBuffer);
                importExcel(data);
                const workbook = XLSX.read(dataArray, { type: 'array', cellDates: true });
                const jsonData = [];
                const tempErrorRows = [];
                const tempErrorEmpCodeRows = [];
                workbook.SheetNames.forEach((sheetName) => {
                    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                    const headers = sheet[0];
                    const rows = sheet.slice(1).map((row: any) =>
                        row.reduce((acc, value, index) => {
                            if (headers[index]) {
                                acc[headers[index]] = value;
                            }
                            return acc;
                        }, {})
                    );
                    rows.forEach((row) => {
                        const fromDate = parseDate(row["From Date"], 1);
                        const toDate = parseDate(row["To Date"], 1);
                        if (!fromDate || !toDate) {
                            tempErrorRows.push(row);
                            return;
                        }
                        const expectedDays = moment(toDate).diff(moment(fromDate), 'day') + 1;
                        const actualDays = parseInt(row["No of Days"], 10);

                        if (actualDays !== expectedDays) {
                            tempErrorRows.push(row);
                        }
                        // Employee Code validation
                        // const employeeCode = row["Employee Code"];
                        // const isValidEmployee = employees.some(
                        //     (employee: any) => employee.employeeCode === String(employeeCode)
                        // );
                        // if (!isValidEmployee) {
                        //     tempErrorEmpCodeRows.push(row);
                        // }
                        row["From Date"] = fromDate;
                        row["To Date"] = toDate;
                    });

                    jsonData.push(...rows.filter((row) => Object.values(row).some((val) => val !== undefined)));
                });

                setData(jsonData);
                setColumns(Object.keys(jsonData[0] || {}));
                setErrorRows(tempErrorRows);
                setErrorEmpCodeRows(tempErrorEmpCodeRows);
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please select a valid CSV or Excel file.');
            setSelectedFile(null);
        }
    };

    console.log(data, 'data');

    const handleUpload = async () => {
        try {
            form.validateFields().then(async () => {
                data["From Date"] = dayjs(data["From Date"]).format("YYYY-MM-DD")
                data["To Date"] = dayjs(data["To Date"]).format("YYYY-MM-DD")
                data["Employee Name"] = data['Employee Name']
                await service.createOdCo(data).then(res => {
                    if (res.status) {
                        console.log(res.data);
                        props.closeForm();
                        props.getApplyCoOdUploadData();
                        AlertMessages.getSuccessMessage(`${data.length} Records Created`);
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage);
                    }
                })
            });
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
    };

    const errorColumns: any = [
        {
            title: "Employee Code",
            dataIndex: "Employee Code",
            align: "center"
        },
        {
            title: "Type",
            dataIndex: "Type",
            align: "center"
        },
        {
            title: "From Date",
            dataIndex: "From Date",
            align: "center"
        },
        {
            title: "To Date",
            dataIndex: "To Date",
            align: "center"
        },
        {
            title: "No of Days",
            dataIndex: "No of Days",
            align: "center",
            render: (text) => (
                <div style={{ border: "1px solid red", animation: "blinkBorder 1s infinite" }}>{text}</div>
            )
        },
        {
            title: "Leave Reason",
            dataIndex: "Leave Reason",
            align: "center"
        },
    ]

    // const errorEmpCodeColumns: any = [
    //     {
    //         title: "Employee Code",
    //         dataIndex: "Employee Code",
    //         align: "center",
    //         render: (text) => (
    //             <div style={{ border: "1px solid red", animation: "blinkBorder 1s infinite" }}>{text}</div>
    //         )
    //     },
    //     {
    //         title: "Type",
    //         dataIndex: "Type",
    //         align: "center"
    //     },
    //     {
    //         title: "From Date",
    //         dataIndex: "From Date",
    //         align: "center"
    //     },
    //     {
    //         title: "To Date",
    //         dataIndex: "To Date",
    //         align: "center"
    //     },
    //     {
    //         title: "No of Days",
    //         dataIndex: "No of Days",
    //         align: "center",
    //     },
    //     {
    //         title: "Leave Reason",
    //         dataIndex: "Leave Reason",
    //         align: "center"
    //     },
    // ]

    return (
        <>
            <Form>
                <Row gutter={[24, 4]}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                        <Form.Item >
                            <Upload {...uploadProps} showUploadList={true} accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileChange}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                <br />
                                <label style={{ color: 'blue', whiteSpace: 'nowrap' }} >Only CSV & Excel files are allowed</label>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                        <Button type="primary"
                            disabled={data.length === 0}
                            onClick={handleUpload}>
                            Upload
                        </Button>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                        <Button type="default" style={{ color: 'green' }} onClick={exportExcel} icon={<FileExcelFilled />}>
                            Sample Format
                        </Button>
                    </Col>
                </Row>
            </Form>

            {errorRows.length > 0 && (
                <>
                    <h4 style={{ color: "red" }}>More Entires in No of Days</h4>
                    <Table columns={errorColumns} dataSource={errorRows} pagination={false} bordered />
                </>
            )}
            {/* 
            {errorEmpCodeRows.length > 0 && (
                <>
                    <h4 style={{ color: "red" }}>Thier is No Employee Code</h4>
                    <Table columns={errorEmpCodeColumns} dataSource={errorEmpCodeRows} pagination={false} bordered />
                </>
            )} */}

        </>
    )

}

export default ApplyForOdCoForm;