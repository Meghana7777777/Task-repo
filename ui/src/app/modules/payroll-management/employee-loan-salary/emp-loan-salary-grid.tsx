import { PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { BranchReq, empLoanSalaryIdDto, EmpLoanSalarySharedDto, EmpLoanSalarySharedIdDto, LoanSalaryStatusEnum } from "@hrexpert/shared-models";
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmpLoanSalarySharedService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Col, Divider, Form, Input, message, Modal, Row, Select, Space, Table, Tabs } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import EmployeeLoanForm from "./emp-loan-salary-form";
import StatusTag from "../employee-loan-salary/status-tag";
import EmpLoanSalaryPdf from "./emp-loan-salary-pdf-form";
import { useIAMClientState } from "../../../common/iam-client-react"
import { useNavigate } from "react-router-dom";


const EmployeeLoanGrid = () => {
    const [data, setData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [isUpdate, setIsUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const empLoanSalaryService = new EmpLoanSalarySharedService()
    const [form] = Form.useForm();
    const [refresh, setRefresh] = useState<number>(1)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [pdfData, setPdfData] = useState<any>(null)
    const [loanData, setLoanData] = useState<any>([]);
    const [empId, setEmpId] = useState<any>(null);
    const Option = Select
    const departmentService = new DepartmentService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const branchService = new BranchesService()
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const employeeDetails = new EmployeeOnboardingService()
    const navigate = useNavigate()
    useEffect(() => {
        getAllBranches();
        getAllDepartments();
        getDesignations();
        getAllDivision();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)

        }
    }, []);
    const submit = (values) => {
        empLoanSalaryService.getEmpLoanSalary(values).then((res) => {
            if (res.status) {
                if (res.data.length > 0) {
                    setData(res.data);
                    console.log(res.data, 'Fetched employee details'); // Log fetched data
                } else {
                    message.info("No data found.");
                    setData([]);
                }
            } else {
                message.error("Failed to retrieve Emp-Loan/Salary Details");
            }
        }).catch(error => {
            console.error("Error fetching data:", error);
        }).finally(() => {
            setLoading(false); // Ensure loading state is updated
        });
    };

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                    setBranches([]);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllDepartments = () => {
        departmentService.getAllDepartments().then((res) => {
            if (res.status) {
                setDepartments(res.data)
            } else {
                setDepartments('No Data Found')
            }
        })
    }

    const getDesignations = () => {
        designationsService.getDesignations().then((res) => {
            if (res.status) {
                setDesginations(res.data)
            } else {
                setDesginations('No Data Found')
            }
        })
    }

    const getAllDivision = () => {
        divisionService.getAllDivision().then((res) => {
            if (res.status) {
                setDivisions(res.data)
            } else {
                setDivisions('No Data Found')
            }
        })
    }


    // const getPreviousLoans = (emp: empLoanSalaryIdDto) => {
    //     try {
    //         empLoanSalaryService.getPreviousLoans(emp).then((res) => {
    //             console.log(res, 'resssssssssssssssss');
    //             if (res.status) {
    //                 setLoanData(res?.data)
    //                 console.log(res.data, 'loanData');
    //             }
    //             else {
    //                 message.error("Failed to retrieve Previous Loans ");
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error);

    //     }
    // };

    const getLoansData = (Id) => {
        try {
            const req = new empLoanSalaryIdDto(null, Id)
            empLoanSalaryService.getLoansData(req).then((res) => {
                if (res.status) {
                    setLoanData(res.data)
                }
                else {
                    message.error("Failed to retrieve Loans ");
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const getEmpLoanSalaryById = (id: number) => {
        try {
            const req = new EmpLoanSalarySharedIdDto(id)
            empLoanSalaryService.getEmpLoanSalaryById(req).then((res) => {
                if (res.status) {
                    setEmpId(res.data)
                }
                else {
                    setEmpId([])
                    message.error("Failed to retrieve Employee by Id ");
                }
            })
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    }

    const updateEmpLoanSalary = (data: EmpLoanSalarySharedDto) => {
        console.log(data, 'data');
        empLoanSalaryService.updateEmpLoanSalary(data)
            .then((res) => {
                if (res.status) {
                    message.success("Emp-Loan-Salary updated successfully");
                    setModalVisible(false);
                    window.location.reload
                    setIsUpdate(false);
                    setRefresh(prev => prev + 1);

                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Emp-Loan-Salary details:", error);
            });
    };


    const openForm = () => {
        setSelectedStyleData(null);
        setModalVisible(true);
        setRefresh(prev => prev + 1);
    };

    const editEmpLoanSalary = (rowData: any) => {
        console.log(rowData, 'rowData');
        rowData.dateOfJoining = dayjs(rowData.dateOfJoining, "YYYY-MM-DD")
        rowData.effectiveFrom = dayjs(rowData.effectiveFrom, "YYYY-MM-DD")
        rowData.dateOfApplying = dayjs(rowData.dateOfApplying, "YYYY-MM-DD")
        setSelectedStyleData(rowData);
        setModalVisible(true);
        setIsUpdate(true);
        setRefresh(prev => prev + 1);
    };

    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
        window.location.reload
    };

    const getColumnSearchProps = (dataIndex: any,title:any): ColumnType<any> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys as string[], confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys as string[], confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            handleReset(clearFilters);
                            setSearchedColumn(dataIndex);
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
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
                : false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    /**
     *
     * @param selectedKeys
     * @param confirm
     * @param dataIndex
     */
    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    const filterData = (id) => {
        const employeeData = data.find((rec) => rec.id === id)
        setPdfData(employeeData)
    }



    let i = 1;
    const empLoanSalaryForm = [
        { title: 'Employee Code ', dataIndex: 'employeeCode' },
        { title: 'Employee Name', dataIndex: 'employeeName' },
        { title: 'Designation', dataIndex: 'designationName' },
        { title: 'Date of Joining', dataIndex: 'dateOfJoining' },
        { title: 'Type', dataIndex: 'type' },
        { title: ' Advance Amount', dataIndex: 'advanceAmount' },
        { title: 'Installments', dataIndex: 'installments' },
        { title: 'Effective From', dataIndex: 'effectiveFrom' },
        { title: 'Purpose', dataIndex: 'purpose' },
        { title: 'Other Reason', dataIndex: 'reason' },
        { title: 'Amount Outstanding', dataIndex: 'amountOutstanding' },
        { title: 'Date of Applying', dataIndex: 'dateOfApplying' },
        { title: 'HOD Mail', dataIndex: 'hodMail' },
        { title: 'Status', dataIndex: 'status' },
    ];

    const preprocessData = (data) => {
        return data.map((record) => {
            const updatedRecord = {};
            for (const key in record) {
                if (["dateOfJoining", "effectiveFrom", "dateOfApplying"].includes(key)) {
                    updatedRecord[key] = record[key]
                        ? new Date(record[key]).toISOString().split("T")[0]
                        : "";
                } else {
                    updatedRecord[key] = record[key] === null || record[key] === undefined ? "" : record[key];
                }
            }

            return updatedRecord;
        });
    };

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(data);
        excel
            .addSheet('Employee-Loan-Salary-Form')
            .addColumns(empLoanSalaryForm)
            .addDataSource(processedData, { str2num: false })
            .saveAs('Emp-Loan-Salary-Form.xlsx');
    };


    const handlePdf = async (id, emp) => {
        getEmpLoanSalaryById(id);
        setOpenModal(true);
        getLoansData(id);
        filterData(id)
    }

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center",
            width:"40px"
        },
        // {
        //     title: "Employee Id", dataIndex: "employeeId", key: "employeeId",
        //     sorter: (a, b) => a.employeeId?.localeCompare(b?.employeeId) - b.employeeId?.localeCompare(a?.employeeId),
        //     sortDirections: ['descend', 'ascend'],
        //     ...getColumnSearchProps("employeeId"),
        // },
        {
            title: "Employee Code", dataIndex: "employeeCode", key: "employeeCode",
            ...getColumnSearchProps("employeeCode","Employee Code"),
            width:"120px"
        },
        {
            title: "Employee Name", dataIndex: "employeeName", key: "employeeName",
            sorter: (a, b) => a.employeeName?.localeCompare(b?.employeeName) - b.employeeName?.localeCompare(a?.employeeName),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("employeeName","Employee Name"),
            width:"100px"
        },
        {
            title: "Designation", dataIndex: "designation", key: "designation",
            sorter: (a, b) => a.designation?.localeCompare(b?.designation) - b.designation?.localeCompare(a?.designation),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("designation","Designation"),
            width:"100px"
        },
        {
            title: "Date of Joining", dataIndex: "dateOfJoining", key: "dateOfJoining",
            width:"100px",
            render: (date: string) => {
                const parsedDate = new Date(date);
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const day = String(parsedDate.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // YYYY-MM-DD format
            },
        },
        {
            title: "Type", dataIndex: "type", key: "type",
            sorter: (a, b) => a.type?.localeCompare(b?.type) - b.type?.localeCompare(a?.type),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("type","Type"),
            width:"100px"
        },
        {
            title: "Loan Ref No", dataIndex: "loanRefNo", key: "loanRefNo",
            sorter: (a, b) => a.loanRefNo?.localeCompare(b?.loanRefNo) - b.loanRefNo?.localeCompare(a?.loanRefNo),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("loanRefNo","Loan Ref No"),
            width:"100px"
        },
        {
            title: "Advance Amount", dataIndex: "advanceAmount", key: "advanceAmount",
            sorter: (a, b) => a.advanceAmount?.localeCompare(b?.advanceAmount) - b.advanceAmount?.localeCompare(a?.advanceAmount),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("advanceAmount","Advance Amount"),
            width:"100px"
        },
        {
            title: "Installments", dataIndex: "installments", key: "installments",
            sorter: (a, b) => a.installments?.localeCompare(b?.installments) - b.installments?.localeCompare(a?.installments),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("installments","Installments"),
            width:"100px"
        },
        {
            title: "Effective From", dataIndex: "effectiveFrom", key: "effectiveFrom",
            width:"100px",
            render: (date: string) => {
                const parsedDate = new Date(date);
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const day = String(parsedDate.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            },
        },
        {
            title: "Purpose", dataIndex: "purpose", key: "purpose",
            width:"100px",
            sorter: (a, b) => a.purpose?.localeCompare(b?.purpose) - b.purpose?.localeCompare(a?.purpose),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("purpose","Purpose"),
        },
        {
            title: "Other Reason", dataIndex: "reason", key: "reason",
            width:"100px",
            sorter: (a, b) => a.reason?.localeCompare(b?.reason) - b.reason?.localeCompare(a?.reason),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("reason","Reason"),
        },
        {
            title: "Date of Applying", dataIndex: "dateOfApplying", key: "dateOfApplying",
            width:"100px",
            render: (date: string) => {
                const parsedDate = new Date(date);
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const day = String(parsedDate.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            },
        },
        {
            title: "HOD Mail",
            dataIndex: "hodMail",
            key: "hodMail",
            width:"100px",
            sorter: (a, b) => a.hodMail?.localeCompare(b?.hodMail) - b.hodMail?.localeCompare(a?.hodMail),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("hodMail","HOD Mail"),
            render: (text) => (
                <a
                    href={`mailto:${text}`}
                    style={{ color: 'blue', textDecoration: 'underline' }}
                >
                    {text}
                </a>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width:"100px",
            sorter: (a, b) => a.status.localeCompare(b.status),
            sortDirections: ['ascend', 'descend'],
            render: (value: LoanSalaryStatusEnum) => {
                return <StatusTag status={value} />
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width:"100px",
            render: (text, record) => (
                <><Button type='primary' onClick={() => handlePdf(record.id, record.employeeId)}>View Pdf</Button>
                    <Divider type="vertical" />
                    {(record.status === 'OPEN' ? <> <Button style={{ marginTop: '1rem' }} hidden={IAMClientAuthContext.user.roles === "SuperAdmin" ? false : true}
                        type="primary"
                        target='_blank'
                        // href={`http://139.59.79.77/hrexpert_dev_app/#/emp-loan-salary-details?${record.employeeId}-${record.id}`}
                        onClick={()=>navigate(`/emp-loan-salary-details?${record.employeeId}-${record.id}`)}
                    >
                        Permission
                    </Button></> : <></>)}
                </>
            )
        },
    ];

    const filterDataByStatus = (status) => {
        return data.filter(item => item.status === status);
    };

    const handleBranchChange = (branchId: any) => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branchId: null }); 
        } else if (branchId === null) {
            form.setFieldsValue({ branchId: "ALL" }); 
        } else if (branchId === '') {
            form.setFieldsValue({ branchId: "ALL" }); 
        } else {
            form.setFieldsValue({ branchId: branchId }); 
        }
        const branchRequest = new BranchReq(branchId);
        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

    const reset = () => {
        setData([])
        form.resetFields()
    }

    return (
        <>
            <PageContainer
                title='Salary Advance'
                extra={[
                    <Button type="primary" icon={<PlusOutlined />} onClick={openForm} key="add">
                        Add
                    </Button>,
                    <Button
                        key="get-excel"
                        style={{
                            border: "1px dashed #22f534",
                            color: "green",
                            fontWeight: "bold",
                        }}
                        type="dashed"
                        onClick={() => exportExcel()}
                    >
                        Get Excel
                    </Button>,
                ]}
            >
                <Form layout='vertical' form={form} onFinish={submit}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branches"
                                 
                                //initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : Number(IAMClientAuthContext.user.unitId)} 
                                >
                                <Select showSearch disabled={role === 'SuperAdmin' ? false : true}
                                    allowClear
                                    placeholder="Select Branch"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                    onChange={(value) => handleBranchChange(value)}>
                                         <Option value={''}> ALL </Option>
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label='Employee Name' name='employeeId' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.employeeId)}>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees.map((rec: any) => (
                                        <Option value={rec.employeeId} key={rec.employeeId}>
                                            {rec.employeeCode} {rec.employeeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {(IAMClientAuthContext.user.roles === "SuperAdmin" ?
                            <>
                                {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Form.Item label="Division" name="divisionId">
                                        <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                            {divisions.map((rec: any) => (
                                                <Option value={rec.id} key={rec.id}>
                                                    {rec.divisionName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col> */}

                                <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Form.Item label="Department" name="departmentId">
                                        <Select showSearch allowClear placeholder="Select Department" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                            {departments.map((rec: any) => (
                                                <Option value={rec.id} key={rec.id}>
                                                    {rec.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Form.Item label="Designation" name="designationId">
                                        <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                            {designations.map((rec: any) => (
                                                <Option value={rec.id} key={rec.id}>
                                                    {rec.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </> : <></>
                        )}

                        <Col  xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginTop: '23px' }}>
                            <Button color="primary" variant="outlined" htmlType="submit">
                                Submit
                            </Button>&nbsp;&nbsp;&nbsp;
                            <Button icon={<UndoOutlined />} onClick={reset} type='dashed' danger> Reset </Button>
                        </Col>
                    </Row>

                </Form>

                {(data.length > 0 && <>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="OPEN" key="1">
                            <Table
                                columns={columns}
                                dataSource={filterDataByStatus('OPEN')}
                                rowKey="employeeId"
                                loading={loading}
                                bordered
                                size="small"
                                scroll={{y:'calc(70vh-120px)'}}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="APPROVED" key="2">
                            <Table
                                columns={columns}
                                dataSource={filterDataByStatus('APPROVED')}
                                rowKey="employeeId"
                                loading={loading}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="REJECTED" key="3">
                            <Table
                                columns={columns}
                                dataSource={filterDataByStatus('REJECTED')}
                                rowKey="employeeId"
                                loading={loading}
                            />
                        </Tabs.TabPane>
                    </Tabs></>)}

                {/* 
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="employeeId"
                    size="small"
                    pagination={{
                        current: page,
                        pageSize: 10,
                        onChange: (pageNumber) => setPage(pageNumber),
                    }}
                    loading={loading}
                    scroll={{
                        x: "max-content",
                    }}
                /> */}

                <Modal
                    title={isUpdate ? "Update Emp-Loan/Salary" : "Create Emp-loan/salary "}
                    open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                    width="80%"
                    key={data.id}
                >
                    <EmployeeLoanForm
                        key={refresh}
                        updateDetails={updateEmpLoanSalary}
                        isUpdate={isUpdate}
                        empLoanSalaryData={selectedStyleData}
                        closeForm={closeModal}
                        //getEmpLoanSalary={submit}
                        form={form}
                        // refreshData={getEmpLoanSalary}
                        getPreviousLoans={loanData}
                    />

                </Modal>
                <Modal
                    width={1000}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    footer={null}
                >
                    <EmpLoanSalaryPdf
                        submittedData={pdfData}
                        employeedetails={data}
                        empId={empId}
                        formORview={1}
                        getPreviousLoans={loanData} />

                </Modal>

            </PageContainer>
        </>
    );
};

export default EmployeeLoanGrid;
