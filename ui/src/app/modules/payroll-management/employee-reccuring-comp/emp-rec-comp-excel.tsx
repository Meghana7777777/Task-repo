import { FileExcelFilled, UploadOutlined } from '@ant-design/icons';
import { AlertMessages, EmpDataReq } from '@hrexpert/shared-models';
import { BranchesService, EmpRecCompSharedService, LeaveAllocationService, PayrollComponentsSharedService, PayrollEmployeeSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, message, Row, Select, Upload, UploadProps } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export const EmpRecCompExcel = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [form] = Form.useForm();
    const [data, setData] = useState<any>([]);
    const service = new EmpRecCompSharedService();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [componentData, setComponentData] = useState<any[]>([]);
    const [empData, setEmpData] = useState<any[]>([])
    const servicePayRoll = new PayrollComponentsSharedService();
    const branchService = new BranchesService();
    const leaveAllocationService = new LeaveAllocationService();
    const [branches, setBranches] = useState<any>([]);
    const { Option } = Select

    useEffect(() => {
        getAllActiveEmpDropDown();
        getAllBranches();
    }, []);


    const getPayrollComponents = async (value) => {
        try {
            const res = await servicePayRoll.getPayrollComponentsByBranch({ branchId: value });
            if (res.status) {
                setComponentData(res.data);
            } else {
                message.error('Failed to fetch payroll components');
            }
        } catch (error) {
            console.error("Error fetching payroll components", error);
        }
    };

    const getAllActiveEmpDropDown = async () => {
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, undefined);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmpData(res?.status ? res.data : []);
    };

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

    const handleFileChange = (event) => {
        const file = event.file.originFileObj;
        setSelectedFile(file);

        if (file && file.type === "text/csv") {
            // Handle CSV file
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const parsedData = result.data.filter((row) =>
                        Object.keys(row).some((key) => row[key] !== "")
                    );

                    if (parsedData.length > 0) {
                        setData(parsedData);
                    } else {
                        alert("No valid rows found in the CSV file.");
                        setData([]);
                    }
                },
                error: (err) => {
                    console.error("Error parsing CSV file:", err);
                    alert("Error parsing CSV file. Please check the file and try again.");
                },
            });
        } else if (
            file &&
            file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataArray = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = XLSX.read(dataArray, { type: "array", cellDates: true });
                const jsonData = [];

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

                    jsonData.push(...rows.filter((row) => Object.values(row).some((val) => val !== undefined)));
                });
                console.log(jsonData, 'jsonDatajsonData');
                setData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Please select a valid CSV or Excel file.");
            setSelectedFile(null);
            setData([]);
        }
    };
    console.log(data, 'data');

    const handleUpload = async () => {
        try {
            form.validateFields().then(async () => {
                setLoading(true);
                const fromDate = form.getFieldValue('fromDate');
                const startDate = dayjs(fromDate).format('YYYYMM')
                const formData = data.map((item) => ({
                    amount: item["Amount"],
                    employeeId: empData.find((rec) => rec.empCode === item["Employee Code"].toString()).id,
                    componentId: componentData.find((rec) => rec.componentName === item["Component"]).id,
                }));
                const reqData = { startDate, formData };
                await service.uploadEmpRecComponent(reqData).then((res) => {
                    if (res.status) {
                        AlertMessages.getSuccessMessage(res.internalMessage)
                        setLoading(false);
                        navigate("/payroll-emp-recurring-component");
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage)
                    }
                }).finally(() => {
                    setLoading(false);
                })
            })
        } catch (error) {
            AlertMessages.getErrorMessage(error.message);
        }
    }
    interface IExcelColumn {
        title: string;
        dataIndex: string;
    }

    const excelColumns: IExcelColumn[] = [
        {
            title: 'Employee Code',
            dataIndex: 'employee_id',
        },
        {
            title: 'Component',
            dataIndex: 'component_id',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
    ];

    const excelData = [
        {
            employee_id: '',
            component_id: '',
            amount: '',
        },
    ];

    const additionalExcelColumns: IExcelColumn[] = [
        {
            title: 'Components',
            dataIndex: 'componentName',
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

        excel.addColumns(excelColumns);
        excel.addDataSource(excelData, { str2num: false });

        const startRow = 2;
        const startCol = 6;

        excel.drawCell(6, 1, { value: (additionalExcelColumns[0].title) });
        for (let i = 0; i < componentData.length; i++) {
            for (let j = 0; j < additionalExcelColumns.length; j++) {
                const cellValue = componentData[i][additionalExcelColumns[j].dataIndex];
                excel.drawCell(startCol + j, startRow + i, { value: cellValue });
            }
        }
        excel.saveAs(`EMP-RECURRING-COMPONENT-${currentDate}.xlsx`);
    };


    const uploadProps: UploadProps = {
        name: 'file',
    };

    return (
        <Card title="Employee Earnings & Deductions Excel Upload" extra={<Button type="default" style={{ color: 'green' }} onClick={exportExcel} icon={<FileExcelFilled />}>
            Sample Format
        </Button>}>
            <Form>
                <Row gutter={[24, 4]}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}>
                        <Form.Item label="Month" name="fromDate" rules={[{ required: true }]}>
                            <DatePicker
                                picker="month"
                                style={{ width: '100%' }}
                                placeholder='Select Month'
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 5 }}>
                        <Form.Item label="Branch" name="branchId" rules={[{ required: true }]}>
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                optionFilterProp="children"
                                onChange={(value) => getPayrollComponents(value)}
                            >
                                {branches.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }}>
                        <Form.Item >
                            <Upload {...uploadProps} showUploadList={false} accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileChange}>
                                <Button icon={<UploadOutlined />} loading={loading} disabled={loading}>Click to Upload</Button>
                                <br />
                                <label style={{ color: 'blue', whiteSpace: 'nowrap' }} >Only CSV & Excel files are allowed</label>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }} lg={{ span: 4 }} xl={{ span: 4 }}>
                        <Button type="primary"
                            onClick={handleUpload}
                            loading={loading} disabled={!selectedFile}>
                            Upload
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
};

export default EmpRecCompExcel;
