import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExportOutlined, PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { AlertMessages, ApplyCoOdReq, ApplyForOdCoDto, BranchReq, ScopesEnum } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Tooltip } from "antd";
import { Excel } from "antd-table-saveas-excel";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from "../../../common/iam-client-react";
import { SequenceUtils } from "../../../common/utils";
import ApplyForOdCoForm from "../apply-co-od-upload-form/apply-co-od-upload-form";

interface ApplyForOdCoViewIProps {
    scopes: ScopesEnum[]
}


export const ApplyForOdCoView = (props: ApplyForOdCoViewIProps) => {
    const { scopes } = props
    const Option = Select
    const [form] = Form.useForm()
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [editingRow, setEditingRow] = useState<string | null>(null);
    const [editingValues, setEditingValues] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedData, setSelectedData] = useState<any>(null);
    const [uniqueType, setUniqueType] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const service = new AttendanceServices();
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const employeeDetails = new EmployeeOnboardingService()
    const { IAMClientAuthContext } = useIAMClientState();
    const user = IAMClientAuthContext.user;
     const employeeOnboardingService = new EmployeeOnboardingService();

    useEffect(() => {
        getApplyCoOdUploadData();
        getAllBranches();
        getAllDepartments();
        getDesignations();
        getAllDivision();
        //getAllEmployeesTable()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchName: "ALL" })
            // handleBranchChange(null)
        } else {
            form.setFieldsValue({ branchName: IAMClientAuthContext.user.unitId })
            // handleBranchChange(IAMClientAuthContext.user.unitId)
        }
    }, []);

    useEffect(() => {
        setUniqueType(Array.from(new Map(data.map((rec: any) => [rec.type, rec])).values()));
    }, [data]);

    // useEffect(() => {
    //     if (user) {
    //         if (user.roles === 'SuperAdmin') {
    //             getApplyCoOdUploadData();
    //         } else if (user.unitId) {
    //             form.setFieldsValue({ branchName: user.unitId });
    //             getApplyCoOdUploadData();
    //         }
    //     }
    // }, [user, form]);

    // const getAllEmployeesTable = async () => {
    //     setLoading(true)
    //     try {
    //         const res = await new EmployeeOnboardingService().getAllEmployeesTable();
    //         if (res.status) {
    //             setEmployees(res.data);
    //             setLoading(false)
    //         } else {
    //             message.error('No Data Found');
    //             setLoading(false)
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         message.error('Failed to fetch employees');
    //     }
    // };


    const getAllBranches = () => {
        setLoading(true)
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data)
                    setLoading(false)
                } else {
                    setBranches('No Data Found')
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

     const handleBranchChange = async (branchId) => {
            // if (!branchId) {
            //     setEmployees([]);
            //     return;
            // }
            if (branchId === "ALL") {
                form.setFieldsValue({ branches: null }); // Map "ALL" to null
            } else if (branchId === null) {
                form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
            } else if (branchId === '') {
                form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
            } else {
                form.setFieldsValue({ branches: branchId }); // Set selected branch ID
            }
    
            const branchRequest = new BranchReq(branchId);
    
            try {
                const res = await employeeOnboardingService.getEmpDetailsByBranch(branchRequest);
                if (res.status) {
                    setEmployees(res.data);
                } else {
                    setEmployees([]);
                    message.error('No Employees Found for the Selected Branch');
                }
            } catch (err) {
                console.error(err);
                message.error('An error occurred while fetching employees');
            }
        };

    const getAllDepartments = () => {
        setLoading(true)
        try {
            departmentService.getAllDepartments().then((res) => {
                if (res.status) {
                    setDepartments(res.data)
                    setLoading(false)
                } else {
                    setDepartments('No Data Found')
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getDesignations = () => {
        setLoading(true)
        try {
            designationsService.getDesignations().then((res) => {
                if (res.status) {
                    setDesginations(res.data)
                    setLoading(false)
                } else {
                    setDesginations('No Data Found')
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllDivision = () => {
        setLoading(true)
        try {
            divisionService.getAllDivision().then((res) => {
                if (res.status) {
                    setDivisions(res.data)
                    setLoading(false)
                } else {
                    setDivisions('No Data Found')
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getApplyCoOdUploadData = async () => {
        const req = new ApplyCoOdReq();
        const formValues = form.getFieldsValue();
        if (formValues.divisionName) req.divisionId = formValues.divisionName;
        if (formValues.department) req.departmentId = formValues.department;
        if (formValues.designation) req.desginationid = formValues.designation;
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.employeeName) req.employeeId = formValues.employeeName;
        if (formValues.type) req.type = formValues.type;
        try {
            setLoading(true);
            const res = await new AttendanceServices().getApplyCoOdUploadData(req);
            if (res.status) {
                setData(res.data);
            } else {
                message.error('No Data Found');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            message.error('Failed to fetch data');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const updateApplyCoOdUpload = (req: ApplyForOdCoDto) => {
        setLoading(true)
        try {
            const fromDate = req.fromDate ? dayjs(req.fromDate) : undefined;
            const toDate = req.toDate ? dayjs(req.toDate) : undefined;
            if (fromDate && toDate) {
                const noOfDays = toDate.diff(fromDate, 'day') + 1;
                req.noOfDays = noOfDays;
            }
            service.updateApplyCoOdUpload(req).then(res => {
                if (res.status) {
                    getApplyCoOdUploadData();
                    setLoading(false)
                    AlertMessages.getSuccessMessage("Updated Successfully");
                    setEditingRow(null);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = () => {
        const currentBranch = form.getFieldValue('branchName'); // Save the current branch value
        form.resetFields(); 
        form.setFieldsValue({ branchName: currentBranch })
        // clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    size="small"
                    style={{ width: 90 }}
                    onClick={() => {
                        handleReset();
                        // setSearchedColumn(dataIndex);
                        // confirm({ closeDropdown: true });
                    }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                type="search"
                style={{ color: filtered ? "#1890ff" : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select());
            }
        },
        render: (text) =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : (
                    text
                )
            ) : null,
    });

    const handleEditClick = (record) => {
        setEditingRow(record.applyOdCoId);
        setEditingValues({
            ...record,
            fromDate: record.fromDate ? dayjs(record.fromDate, 'YYYY-MM-DD') : null,
            toDate: record.toDate ? dayjs(record.toDate, 'YYYY-MM-DD') : null,
        });
    };

    const saveChanges = () => {
        const formattedValues = {
            ...editingValues,
            fromDate: editingValues.fromDate ? dayjs(editingValues.fromDate).format('YYYY-MM-DD') : null,
            toDate: editingValues.toDate ? dayjs(editingValues.toDate).format('YYYY-MM-DD') : null,
        };
        updateApplyCoOdUpload(formattedValues);
        setEditingRow(null);
    };

    const handleInputChange = (valueOrEvent, fieldName) => {
        const value =
            valueOrEvent && valueOrEvent.target
                ? valueOrEvent.target.value
                : valueOrEvent;

        setEditingValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };

    const cancelEdit = () => {
        setEditingRow(null);
    };

    const columns: any = [
        {
            title: 'S No',
            key: 'sno',
            align: "center",
            width: "30px",
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
        },
        {
            title: <div style={{ textAlign: "center" }}>Employee Name</div>,
            width: 150,
            dataIndex: 'employeeName',
            align: "center",
            ...getColumnSearchProps('employeeName'),
        },
        {
            title: <div style={{ textAlign: "center" }}>Employee Code</div>,
            width: 50,
            dataIndex: 'employeeCode',
            align: "center",
            sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
            sortDirections: ["ascend", "descend"],
            ...getColumnSearchProps('employeeCode'),
            render: (text, record) => {
                return editingRow === record.applyOdCoId ? (
                    <Input
                        value={editingValues.employeeCode}
                        onChange={(e) => handleInputChange(e, 'employeeCode')}
                    />
                ) : (
                    text || "-"
                );
            },
        },
        {
            title: <div style={{ textAlign: "center" }}>Type</div>,
            width: 50,
            dataIndex: 'type',
            align: "center",
            sorter: (a, b) => a.type.localeCompare(b.type),
            sortDirections: ["ascend", "descend"],
            ...getColumnSearchProps('type'),
            render: (text, record) => {
                return editingRow === record.applyOdCoId ? (
                    <Select
                        style={{ width: "100%" }}
                        value={editingValues.type}
                        onChange={(e) => handleInputChange(e, 'type')}
                    >
                        {uniqueType.map((rec) => (
                            <Select.Option value={rec.type} key={rec.id}>
                                {rec.type}
                            </Select.Option>
                        ))}
                    </Select>
                ) : (
                    text || "-"
                );
            },
        },
        {
            title: <div style={{ textAlign: "center" }}>From Date</div>,
            width: 50,
            dataIndex: 'fromDate',
            align: "center",
            sorter: (a, b) => a.fromDate.localeCompare(b.fromDate),
            sortDirections: ["ascend", "descend"],
            render: (text, record) => {
                return editingRow === record.applyOdCoId ? (
                    <DatePicker
                        style={{ width: "100%" }}
                        value={editingValues.fromDate}
                        onChange={(e) => handleInputChange(e, 'fromDate')}
                        format="YYYY-MM-DD"
                    />
                ) : (
                    text ? dayjs(text).format('YYYY-MM-DD') : "-"
                );
            }
        },
        {
            title: <div style={{ textAlign: "center" }}>To Date</div>,
            width: 60,
            dataIndex: 'toDate',
            align: "center",
            sorter: (a, b) => a.toDate.localeCompare(b.toDate),
            sortDirections: ["ascend", "descend"],
            render: (text, record) => {
                return editingRow === record.applyOdCoId ? (
                    <DatePicker
                        style={{ width: "100%" }}
                        value={editingValues.toDate}
                        onChange={(e) => handleInputChange(e, 'toDate')}
                        format="YYYY-MM-DD"
                    />
                ) : (
                    text ? dayjs(text).format('YYYY-MM-DD') : "-"
                );
            }
        },
        {
            title: <div style={{ textAlign: "center" }}>No of Days</div>,
            width: 50,
            dataIndex: 'noOfDays',
            align: "center",
            ...getColumnSearchProps('noOfDays'),
            // render: (text, record) => {
            //     return editingRow === record.applyOdCoId ? (
            //         <Input
            //             value={editingValues.noOfDays}
            //             onChange={(e) => handleInputChange(e, 'noOfDays')}
            //         />
            //     ) : (
            //         text ? text : "-"
            //     );
            // }
        },
        {
            title: <div style={{ textAlign: "center" }}>Leave Reason</div>,
            width: 50,
            dataIndex: 'leaveReason',
            align: "center",
            ...getColumnSearchProps('leaveReason'),
            render: (text, record) => {
                return editingRow === record.applyOdCoId ? (
                    <Input
                        value={editingValues.leaveReason}
                        onChange={(e) => handleInputChange(e, 'leaveReason')}
                    />
                ) : (
                    text ? text : "-"
                );
            }
        },
        {
            title: <div style={{ textAlign: "center" }}>Action</div>,
            width: 100,
            align: "center",
            render: (text, record) => (
                editingRow === record.applyOdCoId ? (
                    <span>
                        <Button onClick={saveChanges} style={{ border: "1px solid blue" }}><CheckCircleOutlined style={{ color: "blue" }} /></Button>&nbsp;&nbsp;&nbsp;
                        <Button onClick={cancelEdit} style={{ border: "1px dashed red" }}><CloseCircleOutlined style={{ color: "red" }} /></Button>
                    </span>
                ) : (
                    <Tooltip placement="top" title='Edit'>
                        <EditOutlined
                            onClick={() => handleEditClick(record)}
                            style={{ color: '#1890ff', fontSize: '1rem', display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    </Tooltip>
                )
            ),
        },
    ];

    const exceldata = [
        { title: 'Employee Code', dataIndex: 'employeeCode', width: 120, render: (text: any, record: any) => { return record.employeeCode ? record.employeeCode : '-' } },
        { title: 'Type', dataIndex: 'type', width: 120, render: (text: any, record: any) => { return record.type ? record.type : '-' } },
        { title: 'From Date', dataIndex: 'fromDate', width: 120, render: (text: any, record: any) => { return record.fromDate ? dayjs(record.fromDate).format('YYYY-MM-DD') : '-' } },
        { title: 'To Date', dataIndex: 'toDate', width: 120, render: (text: any, record: any) => { return record.toDate ? dayjs(record.toDate).format('YYYY-MM-DD') : '-' } },
        { title: 'No of Days', dataIndex: 'noOfDays', width: 120, render: (text: any, record: any) => { return record.noOfDays ? record.noOfDays : '-' } },
        { title: 'Leave Reason', dataIndex: 'leaveReason', width: 120, render: (text: any, record: any) => { return record.leaveReason ? record.leaveReason : '-' } },
    ];

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet('Excel Master')
            .addColumns(exceldata)
            .addDataSource(data, { str2num: false })
            .saveAs('CO_OD_Table Data.xlsx');
    };

    const closeModal = () => {
        setModalVisible(false)
    }

    const openForm = () => {
        setSelectedData(null)
        setModalVisible(true)
    }

    const onReset = () => {
        const currentBranch = form.getFieldValue('branchName'); // Save the current branch value
        form.resetFields(); 
        form.setFieldsValue({ branchName: currentBranch })
        // form.resetFields()
        // if (user) {
        //     if (user.roles === 'SuperAdmin') {
        //         getApplyCoOdUploadData();
        //     } else if (user.unitId) {
        //         form.setFieldsValue({ branchName: user.unitId });
        //         getApplyCoOdUploadData();
        //     }
        // }
    }

    return (
        <>
            <PageContainer title='Apply CO - OD' breadcrumbRender={false}
                extra={
                    <Space>
                        <Button >Filter</Button>
                        <Button icon={<ExportOutlined />} />
                        <Button
                            type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button
                            type="primary"
                            onClick={exportExcel}
                            style={{ backgroundColor: "#06b844", color: "white" }}

                        >
                            Export Excel
                        </Button>
                    </Space >
                }>

                <Form form={form} layout="vertical">
                    <Row gutter={2}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branchName">
                                <Select showSearch allowClear placeholder="Select Branch" dropdownMatchSelectWidth={false} optionFilterProp="children"
                                    disabled={user?.roles !== 'SuperAdmin'}
                                    onChange={(value) => handleBranchChange(value)}>
                                    <Option value={''}> ALL </Option>
                                    {branches.map((rec) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Division" name="divisionName">
                                <Select showSearch allowClear placeholder="Select Division"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                >
                                    {divisions.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.divisionName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                      

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Department" name="department">
                                <Select showSearch allowClear placeholder="Select Department"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                >
                                    {departments.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Designation" name="designation">
                                <Select showSearch allowClear placeholder="Select Designation"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                >
                                    {designations.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label='Type' name='type'>
                                <Select showSearch allowClear placeholder="Select Type"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                >
                                    {uniqueType.map((rec: any) => (
                                        <Option value={rec.type} key={rec.type}>
                                            {rec.type}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                               <Form.Item label='Employee Name' name='employeeName'>
                                                   <Select
                                                       showSearch
                                                       allowClear
                                                       dropdownMatchSelectWidth={false}
                                                       optionFilterProp="children"
                                                       placeholder="Select Employee Name"
                                                   >
                                                       {employees.map((rec: any) => (
                                                           <Option value={rec.id} key={rec.id}>
                                                               {rec.employeeName} - {rec.employeeCode}
                                                           </Option>
                                                       ))}
                                                   </Select>
                                               </Form.Item>
                                           </Col>
                       
                       
                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button onClick={getApplyCoOdUploadData} type="primary">Submit</Button>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button onClick={onReset} icon={<UndoOutlined />} type="dashed" danger>Reset</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    // loading={loading}
                    dataSource={data}
                    columns={columns}
                    bordered
                    pagination={{
                        onChange(current) {
                            setPage(current);
                            setPageSize(pageSize)
                        },
                        position: ["topRight"],
                    }}
                    rowKey="id" />
            </PageContainer >

            <Modal
                width='80%'
                onClose={closeModal}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                key={Date.now()}
            >
                <ApplyForOdCoForm
                    data={selectedData}
                    closeForm={closeModal}
                    getApplyCoOdUploadData={getApplyCoOdUploadData}
                />
            </Modal>
        </>
    );
};

export default ApplyForOdCoView;