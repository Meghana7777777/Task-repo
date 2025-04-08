import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, DatePicker, Empty, Form, Input, Modal, Row, Select, Space, Spin, Table, Typography, message } from "antd";
import { FilePdfOutlined, PrinterOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { Excel } from "antd-table-saveas-excel";
import dayjs from 'dayjs';
import moment from "moment";
import saveAs from "file-saver";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { BranchesService, EmployeeOnboardingService, PayrollProcessedLogsService } from "@hrexpert/shared-services";
import { useIAMClientState } from "../../../common/iam-client-react";
import { BranchReq } from "@hrexpert/shared-models";
// import vmrda from 'ui/src/app/vmrda.jpg'
const { Option } = Select;

export const CashReconciliation = (props: any) => {
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState<any>({});
    const [BankRecData, setBankRecData] = useState<any[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState("");
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [employeeDetails, setEmployeeDetails] = useState<any[]>([]);
    const service = new PayrollProcessedLogsService();
    const [branch, setUniqueBranch] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const monthFormat = 'YYYY/MM';
    const [employees, setEmployees] = useState<any>([]);
    const branchService = new BranchesService()
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId;
    const [printHidden, setPrintHidden] = useState<boolean>(true)
    const employeeDetailsService = new EmployeeOnboardingService()
    useEffect(() => {
        // getBankReconilation()
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)

        }
    }, []);
    useEffect(() => {

    }, [printHidden])
    useEffect(() => {
        setUniqueBranch(Array.from(new Map(BankRecData?.filter((rec: any) => rec.branches != null).map((rec: any) => [rec.branches, rec])).values()));
    }, [BankRecData]);
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

    const handleConfirm = () => {
        console.log("Form submitted:", form.getFieldsValue());
    };



    const handleModalClose = () => {
        setSelectedRecord(false);
    };

    const handleBranchChange = (branch) => {
        // if (!branchId) {
        //     setEmployees(''); // Clear employees if no branch is selected
        //     return;
        // }

        if (branch === "ALL") {
            form.setFieldsValue({ branches: null }); // Map "ALL" to null
        } else if (branch === null) {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
        } else if (branch === '') {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
        } else {
            form.setFieldsValue({ branches: branch }); // Set selected branch ID
        }

        // Create an instance of BranchReq
        const branchRequest = new BranchReq(branch);

        employeeDetailsService.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };
    const [selectedEmployeeType, setSelectedEmployeeType] = useState<number | null>(null);

    const [selectedMonth, setSelectedMonth] = useState('');
    const [modalBankFullName, setModalBankFullName] = useState<string>('');
    const [modalBank, setModalBank] = useState<string>('');
    // const [loading, setLoading] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [showImage, setShowImage] = useState<boolean>(false);


    const getBankReconilation = () => {
        setLoading(true);
        form.validateFields().then(values => {
            const formattedMonth = values.month;
            let payload;

            payload = {
                month: formattedMonth.format('YYYYMM'),

            };
            if (IAMClientAuthContext.user.roles === "SuperAdmin" && values.branches === "ALL") {
                payload.branch = null; // "ALL" translates to null
            } else {
                payload.branch = values.branches; // Send selected branch ID
            }
            service?.getCashRecompilationData(payload).then(res => {
                if (res.status) {
                    setBankRecData(res.data);
                    message.success(res.internalMessage);
                } else {
                    setBankRecData([]);
                    message.error(res.internalMessage);
                }
            }).catch(err => {
                setBankRecData([]);
                message.error(err.message);
            }).finally(() => {
                setLoading(false);
                setTimeout(() => {
                    onReset();
                }, 300000);
            });
        }).catch(err => console.log(err.message));
    };


    const handleEmpCountClick = (employeeId: any, bankCode: string) => {
        setSelectedRecord(true);
        const selectedMonth = form.getFieldValue("month").format('YYYYMM');
        service.getEmployeesData({
            employeeId,
            month: selectedMonth,
        }).then(res => {
            if (res.status) {
                setEmployeeDetails(res.data);
                const bankCode = res.data[0]?.bankName;
                const bankFullName = getBankFullName(bankCode);

                setModalBank(bankFullName);
                message.success(res.internalMessage);
            } else {
                setEmployeeDetails([]);
            }
            setTimeout(() => {
                onReset();
            }, 300000);
        }).catch(err => console.log(err.message));
    };


    const getBankFullName = (bank) => {
        const bankMapping = {
            SBI: 'State Bank Of India',
            HDFC: 'Housing Development Finance Corporation',
            ICICI: 'Industrial Credit and Investment Corporation of India',
            AXIS: 'Axis Bank',
            UNION: "UNION",
            BOB: 'Bank Of Baroda',
            AB: 'Andhra Bank',
            IOB: 'Indian Overseas Bank',
            BOI: 'Bank of India'
        };

        return bankMapping[bank] || bank;
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const onReset = () => {
        form.resetFields();
        setBankRecData([]);
        setSelectedEmployeeType(null);
    }

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            confirm();
                            setSearchText(selectedKeys[0]);
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>

                    <Button
                        onClick={() => {
                            clearFilters();
                            setSearchText('');
                            confirm({ closeDropdown: true });
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            ) : null
    });

    const getModalColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            confirm();
                            setSearchText(selectedKeys[0]);
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            setSearchText('');
                            confirm({ closeDropdown: true });
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: text =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            ) : null
    });

    const columns: any = [
        {
            title: "PayMode",
            dataIndex: "payMode",
            key: "payMode",
            sorter: (a: { payMode: string }, b: { payMode: any }) =>
                a.payMode?.localeCompare(b.payMode),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("payMode"),
            render: (text, record) => {
                return record.payMode ? record.payMode : '-';
            },
        },
        {
            title: "Employee Count",
            dataIndex: "headCount",
            key: "headCount",
            render: (text: any, record: any) => (

                <Button type="link" onClick={() => handleEmpCountClick(record.employeeIds.split(','), record.bankCode)}>
                    {text}
                </Button>
            ),
        },
        {
            title: "Amount",
            dataIndex: "netAmount",
            key: "netAmount",
            render: (text, record) => {
                return record.netAmount ? record.netAmount.toLocaleString() : '-';
            },
            align: 'right'
        },
    ];

    const modalColumns: any = [
        {
            title: 'S.No',
            key: 'sno',
            width: '3%',
            render: (text: any, object: any, index: number) => index + 1,
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            key: "employeeCode",
            width: '8%',
            ...getModalColumnSearchProps('employeeCode'),
            render: (text, record) => {
                return record.employeeCode ? record.employeeCode : '-';
            },
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            key: "employeeName",
            width: '12%',
        },
        {
            title: 'Branch Name',
            dataIndex: 'branch',
            key: "branch",
            width: '8%',
        },
        {
            title: 'Amount',
            dataIndex: 'netSalary',
            key: "netSalary",
            width: '6%',
            render: (text, record) => {
                return record.netSalary ? record.netSalary.toLocaleString() : '-';
            },
            align: 'right'
        },
        {
            title: 'Signature',
            width: '6%',

        },
    ];

    // Conditionally append columns based on `printHidden`
    // const finalColumns = printHidden
    //     ? modalColumns
    //     : [
    //         ...modalColumns,
    //         {
    //             title: 'Remaining Amount',
    //             width: '6%',

    //         },
    //         {
    //             title: 'Signature',
    //             width: '6%',

    //         },
    //     ];



    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    }

    const exportExcel = () => {
        const selectedDate = form.getFieldValue("month").format('YYYY-MM');
        const filteredData = BankRecData?.filter(record =>
            Object.keys(record).some(key =>
                key !== 'key' &&
                record[key] &&
                record[key].toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );

        const filteredColumns = columns
            .filter(col => col.dataIndex)
            .map(col => ({
                title: col.title,
                dataIndex: col.dataIndex,
            }));

        let serialNumber = 0;
        const exportingColumns = filteredData.map(item => {
            const rowData = {};
            rowData['S No'] = ++serialNumber;
            filteredColumns.forEach(col => {
                const dataIndex = col.dataIndex as string;
                // Check if the value is numeric and convert it to an integer
                const value = Number.isNaN(Number(item[dataIndex])) ? item[dataIndex] : parseInt(item[dataIndex]);
                rowData[col.title] = value;
            });
            return rowData;
        });

        let totalAmount = 0;
        filteredData.forEach(({ netAmount }) => {
            if (Number(netAmount)) {
                totalAmount += Number(netAmount);
            }
        });

        exportingColumns.push({
            'S No': filteredData.length + 1,
            'Bank Name': 'Total Amount',
            'Employee Count': '',
            'Amount': `₹: ${totalAmount.toLocaleString()}`,
        });

        if (exportingColumns.length === 0) {
            exportingColumns.push({
                'S No': 1,
                'Bank Name': '-',
                'Employee Count': '-',
                'Amount': '-',
            });
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([...exportingColumns]);
        worksheet['!cols'] = [{ wch: 5 }, ...Array(exportingColumns.length - 1).fill({ wch: 25 })];
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Cash-Reconciliation-Data${selectedDate}.xlsx`);
    };


    const exportEmpExcel = async () => {
        const selectedDate = form.getFieldValue("month").format('YYYY-MM');
        const currentDate = moment().format("YYYY-MM-DD");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        const columns = [
            { header: 'S.no', key: 's.no', width: 5 },
            { header: 'Employee Code', key: 'employee_code', width: 15 },
            { header: 'Employee Name', key: 'employee_name', width: 30 },
            //   { header: 'Bank Account Number', key: 'bank_account_number', width: 20 },
            //   { header: 'Bank IFSC Code', key: 'bank_ifsc_code', width: 20 },
            { header: 'Branch Name', key: 'bank_branch', width: 25 },
            { header: 'Total Amount', key: 'total_amount', width: 20 },
            // { header: 'Recived Amount', key: '', width: 20 },
            { header: 'Remaining Amount', key: '', width: 20 },
            { header: 'Signature', key: '', width: 25 },
        ];

        const headerRow = worksheet.addRow(columns.map(column => column.header));
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
        };

        headerRow.eachCell(cell => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        employeeDetails.forEach((item, index) => {
            worksheet.addRow([
                index + 1,
                item.employeeCode,
                item.employeeName,
                // item.bankAccountNumber,
                // item.ifscCode,
                item.branch,
                Math.round(Number(item.netSalary)), // Round the netSalary to nearest integer
            ]).eachCell(cell => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
        });

        let totalAmount = 0;
        employeeDetails.forEach(({ netSalary }) => {
            if (Number(netSalary)) {
                totalAmount += Math.round(Number(netSalary)); // Round and then add to totalAmount
            }
        });

        worksheet.addRow(['', '', '', '', '', 'Total Amount', totalAmount]).eachCell(cell => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        columns.forEach((column, index) => {
            worksheet.getColumn(index + 1).width = column.width;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Cash-Reconcilation-Employee-Data-${selectedDate}.xlsx`);
    };



    useEffect(() => {
    }, [selectedMonth]);

    const handleMonthChange = (value) => {
        setSelectedMonth(value.format('YYYYMM'));
    };

    const handlePrintModal = async () => {

        try {
            setLoad(true);
            setPrintHidden(false)
            const modalContentElement = document.getElementById('modalContentId') as HTMLElement | null;
            const divContents = modalContentElement?.innerHTML ?? '';
            const element = window.open('', '', 'height=700, width=4048');
            element?.document.write(`
        <html>
          <head>
          <style>
@media print {
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        border: 2px solid #000; /* Set the border to 2px solid black */
        text-align: left;
        align-items: center; /* Align items vertically in table cells */
        padding: 1px; /* Adjust padding as needed */
    }
    th {
        background-color: #f2f2f2;
    }
    @page {
        size: auto;
        margin: 6mm;
    }
}

body {
    font-family: Arial, sans-serif;
    font-size: 8px;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
}
th, td {
    border: 1px solid #000; /* Set the border to 1px solid black */
    text-align: left;
    align-items: center; /* Align items vertically in table cells */
    padding: 1px; /* Adjust padding as needed */
}
th {
    background-color: #f2f2f2;
}

.print-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}
</style>

          </head>
          <body>
        
        
          ${divContents}
              </tbody>
            </table>
          </body>
        </html>
      `);

            element?.document.close();

            setTimeout(() => {
                element?.print();
                element?.close();
                setLoad(false);

            }, 1000);
        } catch (error) {
            console.error('Error printing modal:', error);
            setLoad(false);
            setPrintHidden(true)
        }
    };



    return (
        <Card title="Cash Reconciliation Report"
            extra={BankRecData?.length > 0 ? (
                <>
                    <Button style={{ marginLeft: '8px' }} icon={<FilePdfOutlined />} onClick={exportExcel}>
                        Export as Excel
                    </Button>
                </>
            ) : (<></>)}>
            <Form form={form} layout="vertical" onFinish={handleConfirm} initialValues={initialValues}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branches"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch', // Custom error message
                                },
                            ]}>
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                disabled={role === 'SuperAdmin' ? false : true}
                                // defaultValue={role === 'SuperAdmin' ? 'ALL' : branch}
                                optionFilterProp="children"
                                onChange={(value) => handleBranchChange(value)}>
                                <Option value={''}> ALL </Option>
                                {branches?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item
                            name="month"
                            label="Select Month"
                            rules={[{ required: true, message: 'Please select a month!' }]}
                            wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, md: { span: 16 }, lg: { span: 16 } }}
                        >
                            <DatePicker
                                format={monthFormat}
                                picker="month"
                                onChange={handleMonthChange}
                                // onChange={(value) => getBankReconilation()}
                                disabledDate={disabledDate} />
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }} style={{ padding: '15px' }}>
                        <Form.Item>
                            <Button
                                htmlType="submit" type='primary' variant="outlined" color="primary" onClick={() => getBankReconilation()}>
                                Submit
                            </Button>

                            <Button style={{ margin: 10, backgroundColor: "", color: "black", position: "relative" }}
                                icon={<UndoOutlined />} htmlType="reset" type='dashed' danger onClick={onReset}>
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Card style={{ width: '100%' }}>
                    {
                        BankRecData?.length > 0 ? (
                            <Table
                                dataSource={BankRecData}
                                columns={columns}
                                pagination={false}
                                bordered
                                rowKey={(record) => record}

                                summary={(pageData) => {
                                    let totalAmount = 0;

                                    pageData.forEach(({ netAmount }) => {
                                        if (Number(netAmount)) {
                                            totalAmount += Number(netAmount);
                                        }
                                    });

                                    return (
                                        <>
                                            <Table.Summary.Row
                                                className="tableFooter"
                                                style={{
                                                    position: 'sticky',
                                                    bottom: 0,
                                                    backgroundColor: '',
                                                    color: 'black',
                                                }}
                                            >
                                                <Table.Summary.Cell index={2} colSpan={2}>
                                                    <b>Total Amount</b>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1} align={'right'}>
                                                    <b>₹ {Number(totalAmount).toLocaleString()}</b>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}
                            />
                        ) : (
                            <Empty description="No Data" />
                        )
                    }
                </Card>
                <Modal
                    style={{
                        display: 'contents',
                        marginTop: '400px'
                    }}
                    open={selectedRecord}
                    onCancel={handleModalClose}
                    footer={[]}
                >
                    <Card
                        title={<span style={{ color: "black", width: '80%' }}>Cash Reconcilation Details </span>}
                        style={{ textAlign: "center", marginTop: '100px', background: '', color: 'white' }}
                        headStyle={{ backgroundColor: '#69c0ff', border: 0 }}
                        extra={BankRecData?.length > 0 ? (
                            <>
                                <Button style={{ marginLeft: '8px' }} icon={<FilePdfOutlined />} onClick={exportEmpExcel}>
                                    Export as Excel
                                </Button>
                                <Button style={{ marginLeft: '8px' }} icon={<PrinterOutlined />} onClick={() => { handlePrintModal() }}>
                                    Print
                                </Button>
                            </>
                        ) : (<></>)}
                    >
                        <div id='modalContentId'>
                            {selectedRecord && (
                                <>
                                    {/* <Typography.Title level={4} style={{ alignItems:'center' }}> */}
                                    {/* {selectedText} */}
                                    {/* <h3 >VISHAKAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY</h3>- {moment(selectedMonth, 'YYYYMM').format('MMMM YYYY')} */}

                                    {/* </Typography.Title> */}

                                    {/* <Typography.Title level={4} style={{ marginBottom: '16px' }}>
                   <h3> Bank-Name: {modalBank}</h3>
                  </Typography.Title> */}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <img src={vmrda} alt="VMRDA Logo" style={{ width: '80px', marginRight: '10px' }} /> */}
                                        {/* <h3 style={{ fontSize: '15px', fontWeight: '400', margin: '0', color: "black" }}>
                      <b><h3 >VISHAKAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY</h3></b>
                    </h3> */}
                                    </div>
                                    <h3 style={{ textAlign: 'center', fontSize: '15px', fontWeight: '400px', color: "black" }}>
                                        Cash Reconciliation  Report
                                        - {moment(selectedMonth, 'YYYYMM').format('MMMM YYYY')}
                                    </h3>
                                    <h3 style={{ textAlign: 'left', fontSize: '15px', fontWeight: '400px', color: "black" }} > Pay Mode: {modalBank}</h3>

                                    <Card >
                                        {loading ? (
                                            <Spin tip="Loading..." />
                                        ) : (
                                            employeeDetails && employeeDetails.length > 0 ? (
                                                <Table
                                                    dataSource={employeeDetails}
                                                    columns={modalColumns}
                                                    pagination={false}
                                                    // scroll={{ x: 'max-content' }}
                                                    rowKey={(record) => record}
                                                    summary={(pageData) => {
                                                        let totalAmount = 0;

                                                        pageData.forEach(({ netSalary }) => {
                                                            if (Number(netSalary)) {
                                                                totalAmount += Number(netSalary);
                                                            }
                                                        });
                                                        return (
                                                            <>
                                                                <Table.Summary.Row
                                                                    className="tableFooter"
                                                                    style={{
                                                                        position: 'sticky',
                                                                        bottom: 0,
                                                                        backgroundColor: '',
                                                                        color: 'black',
                                                                    }}
                                                                >
                                                                    <Table.Summary.Cell index={3} colSpan={4}>
                                                                        <b>Total Amount</b>
                                                                    </Table.Summary.Cell>
                                                                    <Table.Summary.Cell index={-1} align={'right'}>
                                                                        <b>₹ {Number(totalAmount).toLocaleString()}</b>
                                                                    </Table.Summary.Cell>
                                                                </Table.Summary.Row>
                                                            </>
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Empty description="No Data" />
                                            )
                                        )}
                                    </Card>
                                </>
                            )}
                        </div>
                    </Card>
                </Modal>
            </Form >
        </Card >
    );
};

export default CashReconciliation;




