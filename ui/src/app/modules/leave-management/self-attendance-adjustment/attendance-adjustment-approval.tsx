import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ApprovalStatusEnum, BranchReq, ScopesEnum, UnitIdReq } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DivisionService, EmployeeOnboardingService, ShiftService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Tabs, Tag } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../common/iam-client-react';
import { SequenceUtils } from "../../../common/utils";

interface BulkAttendanceApprovalIProps {
    scopes: ScopesEnum[]
}

const AttendanceApprovalByRm = (props: BulkAttendanceApprovalIProps) => {
    const { scopes } = props
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    // const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [inputChange, setInputChange] = useState<boolean>(false)
    const [otVal, setOtVal] = useState<number>(undefined)
    const { Option } = Select
    const [form] = Form.useForm();
    const [openData, setOpenData] = useState<any[]>([]);
    const [approvedData, setApprovedData] = useState<any[]>([]);
    const [rejectedData, setRejectedData] = useState<any[]>([]);
    const [canceledData, setCanceledData] = useState<any[]>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId
    console.log(IAMClientAuthContext.user)
    const attnService = new AttendanceServices()
    const branchService = new BranchesService()
    const shiftsService = new ShiftService()
    const deptService = new DepartmentService()
    const emService = new EmployeeOnboardingService()
    const divisionService = new DivisionService()
    const [employees, setEmployees] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [deptData, setDeptData] = useState<any[]>([])
    const [divisions, setDivisions] = useState<any>([]);



    useEffect(() => {
        getAllBranches()
        getAllDepartments()
        getAllDivision()
        getAllAttnAdjustmentData();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)
        }
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

    const getAllDepartments = () => {
        deptService.getAllDepartments().then(res => {
            if (res.status) {
                setDeptData(res.data)
            } else {
                setDeptData([])
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


    const getAllAttnAdjustmentData = () => {
        const req = new UnitIdReq
        const formValues = form.getFieldsValue();
        if (formValues.divisionName && formValues.divisionName) {
            req.divisionId = formValues.divisionName;
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId;
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId;
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.unitId = null;
        } else {
            req.unitId = formValues.branchId;
        }
        if (formValues.date) {
            const startDate = formValues.date.startOf('month').format('YYYY-MM-01');
            const endDate = formValues.date.endOf('month').format('YYYY-MM-DD');
            req.startDate = startDate;
            req.endDate = endDate;
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        req.reportingManager = Number(IAMClientAuthContext.user.employeeId)
        attnService.getAllAttnAdjustmentData(req).then(res => {
            console.log(req)
            if (res.status) {
                const allData = res.data;
                setData(allData);
                setOpenData(allData.filter((item) => item.status === ApprovalStatusEnum.OPEN));
                setApprovedData(allData.filter((item) => item.status === ApprovalStatusEnum.APPROVED));
                setRejectedData(allData.filter((item) => item.status === ApprovalStatusEnum.REJECTED));
                setCanceledData(allData.filter((item) => item.status === ApprovalStatusEnum.CANCEL));
            } else {
                setData([]);
                setOpenData([]);
                setApprovedData([]);
                setRejectedData([]);
                setCanceledData([]);
            }
        });
    };

    const updatBulkAttendanceApproval = (req: any) => {
        console.log(req)
        attnService.updatBulkAttendanceApproval(req).then(res => {
            if (res.status) {
                message.success(res.internalMessage)
                getAllAttnAdjustmentData()
                setSelectedRowKeys([])
            } else {
                message.error(res.internalMessage)
            }
        })
    }



    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
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
                // setTimeout(() => searchInput.current?.select(), 100);
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

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRows);
        },
    };

    const onApprove = () => {
        const updatedData = selectedRowKeys.map((row) => ({
            ...row,
            status: ApprovalStatusEnum.APPROVED, // Use the enum here
        }));
        updatBulkAttendanceApproval(updatedData);
    };

    const onReject = () => {
        const updatedData = selectedRowKeys.map((row) => ({
            ...row,
            status: ApprovalStatusEnum.REJECTED, // Use the enum here
        }));
        updatBulkAttendanceApproval(updatedData);
    };

    const onCancel = () => {
        const updatedData = selectedRowKeys.map((row) => ({
            ...row,
            status: ApprovalStatusEnum.CANCEL, // Use the enum here
        }));
        updatBulkAttendanceApproval(updatedData);
    };


    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Employee",
            dataIndex: 'empName',

            ...getColumnSearchProps("empName"),
            align: "center",
        },
        {
            title: "Code",
            dataIndex: 'empCode',

            ...getColumnSearchProps("empCode"),
        },
        {
            title: "Department",
            dataIndex: 'departmentName',

            ...getColumnSearchProps("departmentName"),
        },
        {
            title: "Date",
            dataIndex: 'attnAdjstDate',

            ...getColumnSearchProps("attnAdjstDate"),
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : "-")
        },
        // {
        //     title: "Shift",
        //     dataIndex:'shiftType',
        //     sorter: (a, b) => a.shiftType.localeCompare(b.shiftType),
        //     sortDirections: ['ascend', 'descend'],
        //     ...getColumnSearchProps("shiftType"),
        //     align: "center",
        // },
        // {
        //     title: "Shift In Time",
        //     dataIndex:'shiftStartTime',
        //     sorter: (a, b) => a.shiftStartTime.localeCompare(b.shiftStartTime),
        //     sortDirections: ['ascend', 'descend'],
        //     ...getColumnSearchProps("shiftStartTime"),
        //     align: "center",
        // },
        // {
        //     title: "Shift Out Time",
        //     dataIndex:'shiftEndTime',
        //     sorter: (a, b) => a.shiftEndTime.localeCompare(b.shiftEndTime),
        //     sortDirections: ['ascend', 'descend'],
        //     ...getColumnSearchProps("shiftEndTime"),
        //     align: "center",

        // },
        {
            title: "Old In Time",
            dataIndex: 'oldInTime',

            ...getColumnSearchProps("oldInTime"),
            align: "center",
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-"),
        },
        {
            title: "Old Out Time",
            dataIndex: 'oldOutTime',

            ...getColumnSearchProps("oldOutTime"),
            align: "center",
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-"),
        },
        {
            title: "Attendance Status",
            dataIndex: 'presentStatus',

            ...getColumnSearchProps("presentStatus"),
        },
        {
            title: "In Time",
            dataIndex: 'inTime',

            ...getColumnSearchProps("inTime"),
            align: "center",
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-"),
        },
        {
            title: "Out Time",
            dataIndex: 'outTime',

            ...getColumnSearchProps("outTime"),
            align: "center",
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "-"),
        },
        {
            title: 'status',
            dataIndex: 'status',
            align: "center",
        },
    ];

    const handleBranchChange = (branchId) => {
        // if (!branchId) {
        //     setEmployees(''); // Clear employees if no branch is selected
        //     return;
        // }
        if (branchId === "ALL") {
            form.setFieldsValue({ branchId: null });
        } else if (branchId === null) {
            form.setFieldsValue({ branchId: "ALL" });
        } else if (branchId === '') {
            form.setFieldsValue({ branchId: "ALL" });
        } else {
            form.setFieldsValue({ branchId: branchId }); // Set selected branch ID
        }
        const branchRequest = new BranchReq(branchId);

        emService.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

    const onReset = () => {
        const currentBranch = form.getFieldValue('branchId');
        form.resetFields();
        form.setFieldsValue({ branchId: 'ALL' })
        setDeptData([])
        setDivisions([])
        setSelectedRowKeys([])
        setOpenData([])
        setApprovedData([])
        setRejectedData([])
        setCanceledData([])
    }

    return (
        <PageContainer title="Attendance Approval" breadcrumbRender={false}>
            <Form form={form} layout="vertical">
                <Row gutter={24}>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name='date' label={'Date'} >
                            <DatePicker picker="month" style={{ width: '100%' }} format="YYYYMM" placeholder='Select Date' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branchId"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: 'Please select a branch',
                        //     },
                        // ]}
                        >
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                disabled={role === 'SuperAdmin' ? false : true}
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
                        <Form.Item label='Employee' name='employeeName' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : IAMClientAuthContext.user.employeeCode}>
                            <Select showSearch allowClear
                                disabled={IAMClientAuthContext.user.roles === "SuperAdmin" ? false : true}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees?.map((rec: any) => (
                                    <Option value={rec.employeeId} key={rec.employeeId}>
                                        {rec.employeeName}-{rec.employeeCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name={'departmentId'} label={'Department'} >
                            <Select showSearch placeholder="Select Department" allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children">
                                {deptData?.map(dept => {
                                    return <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionId">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Button color="primary" variant="outlined" onClick={getAllAttnAdjustmentData} >
                            Submit
                        </Button>&nbsp;&nbsp;
                        <Button onClick={onReset} color="danger" variant="outlined" style={{ marginTop: '25px' }}>
                            Reset
                        </Button>
                    </Col>
                </Row>

                <br></br>
                <Tabs
                    defaultActiveKey={ApprovalStatusEnum.OPEN}
                    type="card"
                    tabBarExtraContent={
                        selectedRowKeys.length > 0 ? <>
                            <Row justify="end">
                                <Col>
                                    <Button
                                        type="primary"
                                        disabled={
                                            !selectedRowKeys.length ||
                                            SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Approve)
                                        }
                                        onClick={onApprove}
                                        style={{ margin: '2px' }}
                                    >
                                        Approve
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type="dashed"
                                        danger
                                        disabled={
                                            !selectedRowKeys.length ||
                                            SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Rejected)
                                        }
                                        onClick={onReject}
                                        style={{ margin: '2px' }}
                                    >
                                        Reject
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type="default"
                                        disabled={
                                            !selectedRowKeys.length ||
                                            SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Cancel)
                                        }
                                        onClick={onCancel}
                                        style={{ margin: '2px' }}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </> : <></>
                    }
                >
                    <TabPane tab={<span>OPEN : <Tag color="blue">{openData.length}</Tag></span>} key={ApprovalStatusEnum.OPEN}>
                        <Table
                            columns={columns}
                            dataSource={openData}
                            rowSelection={rowSelection}
                            rowKey={(record) => record.attnAdjstId}
                            pagination={{
                                onChange: (current) => setPage(current),
                            }}
                        />
                    </TabPane>
                    <TabPane tab={<span>APPROVED : <Tag color="blue">{approvedData.length}</Tag></span>} key={ApprovalStatusEnum.APPROVED}>
                        <Table
                            columns={columns}
                            dataSource={approvedData}
                            rowKey={(record) => record.attnAdjstId}
                            pagination={{
                                onChange: (current) => setPage(current),
                            }}
                        />
                    </TabPane>
                    <TabPane tab={<span>REJECTED : <Tag color="blue">{rejectedData.length}</Tag></span>} key={ApprovalStatusEnum.REJECTED}>
                        <Table
                            columns={columns}
                            dataSource={rejectedData}
                            rowKey={(record) => record.attnAdjstId}
                            pagination={{
                                onChange: (current) => setPage(current),
                            }}
                        />
                    </TabPane>
                    <TabPane tab={<span>CANCEL : <Tag color="blue">{canceledData.length}</Tag></span>} key={ApprovalStatusEnum.CANCEL}>
                        <Table
                            columns={columns}
                            dataSource={canceledData}
                            rowKey={(record) => record.attnAdjstId}
                            pagination={{
                                onChange: (current) => setPage(current),
                            }}
                        />
                    </TabPane>
                </Tabs>
            </Form>

        </PageContainer>
    );
}
export default AttendanceApprovalByRm