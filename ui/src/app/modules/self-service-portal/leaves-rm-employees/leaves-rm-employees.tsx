import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ApplyForLeaveStatusEnum, ApproveLeaveStatusReq, BranchReq, ScopesEnum } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Tabs } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from "../../../common/iam-client-react";
import { SequenceUtils } from "../../../common/utils";
import dayjs, { Dayjs } from "dayjs";

interface LeavesApprovalGridIProps {
    scopes: ScopesEnum[]
}

export const LeavesApprovalGrid = (props: LeavesApprovalGridIProps) => {
    const { scopes } = props
    const { TabPane } = Tabs;
    const { Option } = Select
    const [form] = Form.useForm()
    const searchInput = useRef(null);
    const { RangePicker } = DatePicker;

    const [remarks, setRemarks] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [openData, setOpen] = useState<any>([]);
    const [approvedData, setApproved] = useState<any>([]);
    const [rejectedData, setRejected] = useState<any>([]);
    const [cancelData, setCancel] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isApprovedModalVisible, setIsApprovedModalVisible] = useState(false);
    const [isRejectedModalVisible, setIsRejectedModalVisible] = useState(false);
    const [isCancelledModalVisible, setIsCancelledModalVisible] = useState(false);

    const [reportingManager, setReportingManager] = useState<any>([]);
    const [RM,setRM] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<ApplyForLeaveStatusEnum>(ApplyForLeaveStatusEnum.OPEN);

    const service = new ApplForLeavesSharedService()


    const { IAMClientAuthContext } = useIAMClientState();
    const user = IAMClientAuthContext.user;

    useEffect(() => {
        getAppliedForLeavesOpen();
        getAppliedForLeavesApproved();
        getAppliedForLeavesRejected();
        getAppliedForLeavesCancel();
        getAllRMLeaves();
        getAllRM();
        if (IAMClientAuthContext.user.roles === "Self Service Portal") {
            // form.setFieldsValue({ branches: "ALL" })
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
        }
    }, []);

    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const getAllRMLeaves = () => {
        setLoading(true)
        try {
            service.getAllRMLeaves().then((res) => {
                if (res.status) {
                    setReportingManager(res.data)
                    setLoading(false)
                } else {
                    setReportingManager('No Data Found')
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    const getAllRM= () => {
    
        setLoading(true)
        try {
            service.getAllRMData().then((res) => {
                if (res.status) {
                    setRM(res.data)
                    setLoading(false)
                } else {
                    setRM('No Data Found')
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (user) {
            if (user.roles === 'SuperAdmin') {
                getAppliedForLeavesOpen();
                getAppliedForLeavesApproved();
                getAppliedForLeavesRejected();
                getAppliedForLeavesCancel();
            } else if (user.unitId) {
                form.setFieldsValue({ reportingManager: user.unitId });
                getAppliedForLeavesOpen();
                getAppliedForLeavesApproved();
                getAppliedForLeavesRejected();
                getAppliedForLeavesCancel();
            }
        }
    }, [user, form]);

    const getAppliedForLeavesOpen = () => {
        setLoading(true)
        const req = new ApproveLeaveStatusReq()
        const formValues = form.getFieldsValue();
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.divisionName) req.divisionId = formValues.divisionName;
        if (formValues.department) req.departmentId = formValues.department;
        if (formValues.designation) req.desginationid = formValues.designation;
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.employeeName) req.employeeId = formValues.employeeName;
        try {
            service.getAppliedForLeavesOpen(req).then((res) => {
                if (res.status) {
                    setOpen(res.data)
                    setLoading(false)
                } else {
                    console.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const getAppliedForLeavesApproved = () => {
        setLoading(true)
        const req = new ApproveLeaveStatusReq()
        const formValues = form.getFieldsValue();
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.divisionName) req.divisionId = formValues.divisionName;
        if (formValues.department) req.departmentId = formValues.department;
        if (formValues.designation) req.desginationid = formValues.designation;
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.employeeName) req.employeeId = formValues.employeeName;
        try {
            service.getAppliedForLeavesApproved(req).then((res) => {
                if (res.status) {
                    setApproved(res.data)
                    setLoading(false)
                } else {
                    console.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const getAppliedForLeavesRejected = () => {
        setLoading(true)
        const req = new ApproveLeaveStatusReq()
        const formValues = form.getFieldsValue();
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.divisionName) req.divisionId = formValues.divisionName;
        if (formValues.department) req.departmentId = formValues.department;
        if (formValues.designation) req.desginationid = formValues.designation;
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.employeeName) req.employeeId = formValues.employeeName;
        try {
            service.getAppliedForLeavesRejected(req).then((res) => {
                if (res.status) {
                    setRejected(res.data)
                    setLoading(false)
                } else {
                    console.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const getAppliedForLeavesCancel = () => {
        setLoading(true)
        const req = new ApproveLeaveStatusReq()
        const formValues = form.getFieldsValue();
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.divisionName) req.divisionId = formValues.divisionName;
        if (formValues.department) req.departmentId = formValues.department;
        if (formValues.designation) req.desginationid = formValues.designation;
        if (formValues.branchName) req.branchId = formValues.branchName;
        if (formValues.employeeName) req.employeeId = formValues.employeeName;
        try {
            service.getAppliedForLeavesCancel(req).then((res) => {
                if (res.status) {
                    setCancel(res.data)
                    setLoading(false)
                } else {
                    console.error(res.internalMessage)
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const getColumnSearchProps = (dataIndex: any, title: string): ColumnType<any> => ({
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

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }

    const formatNoOfDays = (value) => {
        const parsed = parseFloat(value);
        return Math.round(parsed * 10) / 10;
    };

    const handleApproveClick = () => {
        setIsApprovedModalVisible(true);
    };

    const handleRejectedClick = () => {
        setIsRejectedModalVisible(true);
    };

    const handleCancelledClick = () => {
        setIsCancelledModalVisible(true);
    };

    const updateApplyLeaveStatusApproved = async () => {
        const applyForLeavesIds = selectedRowKeys
            .map((key) => {
                const selectedRow = openData.find(
                    row => row.employeeId + row.applyForLeavesId === key
                );
                return selectedRow?.applyForLeavesId;
            })
            .filter(Boolean);
        const req = {
            applyForLeavesId: applyForLeavesIds,
            employeeIds: selectedRowKeys.map(key =>
                openData.find(row => row.employeeId + row.applyForLeavesId === key)?.employeeId
            ),
            leaveTypeIds: selectedRowKeys.map(key =>
                openData.find(row => row.employeeId + row.applyForLeavesId === key)?.typeOfLeave
            ),
            noOfDays: selectedRowKeys.map(key =>
                openData.find(row => row.employeeId + row.applyForLeavesId === key)?.noOfDays
            ),
            status: ApplyForLeaveStatusEnum.CANCEL,
            remarks,
        };

        const res = await service.updateApplyLeaveStatusApproved(req);
        if (res.status) {
            message.success(res.internalMessage);
            getAppliedForLeavesOpen();
            setIsApprovedModalVisible(false);
            setRemarks('');
        } else {
            message.error(res.internalMessage);
        }
    }

    const updateApplyLeaveStatusRejected = async () => {
        try {
            const applyForLeavesIds = selectedRowKeys
                .map((key) => {
                    const selectedRow = openData.find(
                        row => row.employeeId + row.applyForLeavesId === key
                    );
                    return selectedRow?.applyForLeavesId;
                })
                .filter(Boolean);

            const req = {
                applyForLeavesId: applyForLeavesIds,
                employeeIds: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.employeeId
                ),
                leaveTypeIds: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.typeOfLeave
                ),
                noOfDays: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.noOfDays
                ),
                status: ApplyForLeaveStatusEnum.REJECTED,
                remarks,
            };

            const res = await service.updateApplyLeaveStatusRejected(req);
            if (res.status) {
                message.success(res.internalMessage);
                getAppliedForLeavesOpen();
                setIsRejectedModalVisible(false);
                setRemarks('');
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            console.error("Error in Rejected:", error);
            message.error(error.message || "An error occurred");
        }
    };

    const updateApplyLeaveStatusCanceled = async () => {
        try {
            const applyForLeavesIds = selectedRowKeys
                .map((key) => {
                    const selectedRow = openData.find(
                        row => row.employeeId + row.applyForLeavesId === key
                    );
                    return selectedRow?.applyForLeavesId;
                })
                .filter(Boolean);

            const req = {
                applyForLeavesId: applyForLeavesIds,
                employeeIds: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.employeeId
                ),
                leaveTypeIds: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.typeOfLeave
                ),
                noOfDays: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.noOfDays
                ),
                status: ApplyForLeaveStatusEnum.CANCEL,
                remarks,
            };

            const res = await service.updateApplyLeaveStatusCanceled(req);
            if (res.status) {
                message.success(res.internalMessage);
                getAppliedForLeavesOpen();
                setIsCancelledModalVisible(false);
                setRemarks('');
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            console.error("Error in Cancelled:", error);
            message.error(error.message || "An error occurred");
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            width: '70px',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            align: "center",
            sorter: (a, b) => a.employeeCode?.localeCompare(b.employeeCode),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('employeeCode', 'Employee Code')
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            align: "center",
            sorter: (a, b) => a.employeeName?.localeCompare(b.employeeName),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('employeeName', 'Employee Name')
        },
        {
            title: 'Type of leave',
            dataIndex: 'leave_code',
            align: "center",
            sorter: (a, b) => a.leave_code?.localeCompare(b.leave_code),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('leave_code', 'Type of leave')
        },
        {
            title: 'From Date',
            dataIndex: 'fromDate',
            align: "center",
            render: (text, record) => {
                return (record.fromDate)
            },
            sorter: (a, b) => a.fromDate.localeCompare(b.fromDate),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'To Date',
            width: 100,
            dataIndex: 'toDate',
            align: "center",
            render: (text, record) => {
                return (record.toDate)
            },
            sorter: (a, b) => a.toDate.localeCompare(b.toDate),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: "Leave Reason",
            dataIndex: "leaveReason",
            align: "center",
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            align: "center",
            sorter: (a, b) => a.noOfDays.localeCompare(b.noOfDays),
            sortDirections: ['descend', 'ascend'],
        },
    ];

    const columnsA: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            width: '70px',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            align: "center",
            sorter: (a, b) => a.employeeCode?.localeCompare(b.employeeCode),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('employeeCode', 'Employee Code')
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            align: "center",
            sorter: (a, b) => a.employeeName?.localeCompare(b.employeeName),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('employeeName', 'Employee Name')
        },
        {
            title: 'Type of leave',
            dataIndex: 'leave_code',
            align: "center",
            sorter: (a, b) => a.leave_code?.localeCompare(b.leave_code),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('leave_code', 'Type of leave')
        },
        {
            title: 'From Date',
            dataIndex: 'fromDate',
            align: "center",
            render: (text, record) => {
                return (record.fromDate)
            },
            sorter: (a, b) => a.fromDate.localeCompare(b.fromDate),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'To Date',
            width: 100,
            dataIndex: 'toDate',
            align: "center",
            render: (text, record) => {
                return (record.toDate)
            },
            sorter: (a, b) => a.toDate.localeCompare(b.toDate),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: "Leave Reason",
            dataIndex: "leaveReason",
            align: "center",
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            align: "center",
            sorter: (a, b) => a.noOfDays.localeCompare(b.noOfDays),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            align: "center",
            sorter: (a, b) => a.remarks.localeCompare(b.remarks),
            sortDirections: ['descend', 'ascend'],
        },
    ];

    const onChangeTabs = (value) => {
        if (value === ApplyForLeaveStatusEnum.OPEN) {
            getAppliedForLeavesOpen()
        }
        else if (value === ApplyForLeaveStatusEnum.APPROVED) {
            getAppliedForLeavesApproved()
        }
        else if (value === ApplyForLeaveStatusEnum.REJECTED) {
            getAppliedForLeavesRejected()
        }
        else if (value === ApplyForLeaveStatusEnum.CANCEL) {
            getAppliedForLeavesCancel()
        }
    }

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            console.log('Selected Rows:', rows);
        },
    };

    const isApproveDisabled =
        selectedRowKeys.length === 0 ||
        SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Approve);

    const isRejectDisabled =
        selectedRowKeys.length === 0 ||
        SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Rejected);

    const isCancelDisabled =
        selectedRowKeys.length === 0 ||
        SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Cancel);

    const tabExtraContent = () => {
        if (ApplyForLeaveStatusEnum.OPEN) {
            return (
                <Row justify="end">
                    <Col>
                        <Button type="primary" style={{ marginRight: 8 }} disabled={isApproveDisabled} onClick={handleApproveClick}>
                            Approve
                        </Button>
                    </Col>
                    <Col>
                        <Button type="dashed" danger style={{ marginRight: 8 }} disabled={isRejectDisabled} onClick={handleRejectedClick}>
                            Reject
                        </Button>
                    </Col>
                    <Col>
                        <Button type="default" disabled={isCancelDisabled} onClick={handleCancelledClick}>
                            Cancel
                        </Button>
                    </Col>
                </Row>
            );
        }
        return null;
    };

    const onReset = () => {
        form.resetFields()
        if (user) {
            if (user.roles === 'SuperAdmin') {
                getAppliedForLeavesOpen();
                getAppliedForLeavesApproved();
                getAppliedForLeavesRejected();
                getAppliedForLeavesCancel();
            } else if (user.unitId) {
                form.setFieldsValue({ branchName: user.unitId });
                getAppliedForLeavesOpen();
                getAppliedForLeavesApproved();
                getAppliedForLeavesRejected();
                getAppliedForLeavesCancel();
            }
        }
    }

    return (
        <PageContainer title='RM - Employees Leaves' breadcrumbRender={false}>
            <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Reporting Manager" name="managerName">
                            <Select showSearch allowClear placeholder="Select Reporting Manager"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                            >
                                {RM.map((rec: any) => (
                                    <Option value={rec.id} key={rec.managerName}>
                                        {rec.managerName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Date" name="attendanceDate">
                            <RangePicker disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                        <Button onClick={getAppliedForLeavesOpen} type="primary">Submit</Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                        <Button onClick={onReset} icon={<UndoOutlined />} type="dashed" danger>Reset</Button>
                    </Col>
                </Row>
            </Form>
            <Tabs defaultActiveKey={ApplyForLeaveStatusEnum.OPEN} type="card"
                onChange={(value) => {
                    setActiveTab(value as ApplyForLeaveStatusEnum); 
                    onChangeTabs(value as ApplyForLeaveStatusEnum);
                }}  >

                <TabPane tab={
                    <span style={{
                        fontWeight: 'bold',
                        fontFamily: 'initial',
                        color: activeTab === ApplyForLeaveStatusEnum.OPEN ? 'white' : 'black',
                        backgroundColor: activeTab === ApplyForLeaveStatusEnum.OPEN ? 'blue' : 'transparent',
                        padding: '8px 8px',
                        borderRadius: '4px',
                        boxShadow: activeTab === ApplyForLeaveStatusEnum.OPEN ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
                    }}>
                        OPEN
                    </span>}
                    key={ApplyForLeaveStatusEnum.OPEN} >
                    {tabExtraContent()}
                    <Table
                        rowKey={(record) => record.employeeId + record.applyForLeavesId}
                        rowSelection={rowSelection}
                        columns={columns}
                        size="small"
                        dataSource={openData}
                        loading={loading}
                        scroll={{ x: true }}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                            position: ['topRight'],
                        }}
                        onChange={onChange}
                        bordered />
                </TabPane>

                <TabPane tab={
                    <span style={{
                        fontWeight: 'bold',
                        fontFamily: 'initial',
                        color: activeTab === ApplyForLeaveStatusEnum.APPROVED ? 'white' : 'black',
                        backgroundColor: activeTab === ApplyForLeaveStatusEnum.APPROVED ? 'green' : 'transparent',
                        padding: '8px 8px',
                        borderRadius: '4px',
                        boxShadow: activeTab === ApplyForLeaveStatusEnum.APPROVED ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
                    }}>
                        APPROVED
                    </span>} key={ApplyForLeaveStatusEnum.APPROVED} >
                    <Table
                        columns={columnsA}
                        size="small"
                        dataSource={approvedData}
                        loading={loading}
                        scroll={{ x: true }}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                            position: ['topRight'],
                        }}
                        onChange={onChange}
                        bordered />
                </TabPane>

                <TabPane tab={
                    <span style={{
                        fontWeight: 'bold',
                        fontFamily: 'initial',
                        color: activeTab === ApplyForLeaveStatusEnum.REJECTED ? 'white' : 'black',
                        backgroundColor: activeTab === ApplyForLeaveStatusEnum.REJECTED ? 'red' : 'transparent',
                        padding: '8px 8px',
                        borderRadius: '4px',
                        boxShadow: activeTab === ApplyForLeaveStatusEnum.REJECTED ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
                    }}>
                        REJECTED
                    </span>} key={ApplyForLeaveStatusEnum.REJECTED} >
                    <Table
                        columns={columnsA}
                        size="small"
                        dataSource={rejectedData}
                        loading={loading}
                        scroll={{ x: true }}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                            position: ['topRight'],
                        }}
                        onChange={onChange}
                        bordered />
                </TabPane>

                <TabPane tab={
                    <span style={{
                        fontWeight: 'bold',
                        fontFamily: 'initial',
                        color: activeTab === ApplyForLeaveStatusEnum.CANCEL ? 'white' : 'black',
                        backgroundColor: activeTab === ApplyForLeaveStatusEnum.CANCEL ? 'black' : 'transparent',
                        padding: '8px 8px',
                        borderRadius: '4px',
                        boxShadow: activeTab === ApplyForLeaveStatusEnum.CANCEL ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
                    }}>
                        CANCEL
                    </span>} key={ApplyForLeaveStatusEnum.CANCEL} >
                    <Table
                        columns={columnsA}
                        size="small"
                        dataSource={cancelData}
                        loading={loading}
                        scroll={{ x: true }}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                            position: ['topRight'],
                        }}
                        onChange={onChange}
                        bordered />
                </TabPane>
            </Tabs>

            <Modal
                title="Add Remarks"
                visible={isApprovedModalVisible}
                onOk={updateApplyLeaveStatusApproved}
                onCancel={() => setIsApprovedModalVisible(false)}
                okText="Submit"
                cancelText="Cancel"
            >
                <Input.TextArea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    placeholder="Add your remarks here..."
                />
            </Modal>

            <Modal
                title="Add Remarks"
                visible={isRejectedModalVisible}
                onOk={updateApplyLeaveStatusRejected}
                onCancel={() => setIsRejectedModalVisible(false)}
                okText="Submit"
                cancelText="Cancel"
            >
                <Input.TextArea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    placeholder="Add your remarks here..."
                />
            </Modal>

            <Modal
                title="Add Remarks"
                visible={isCancelledModalVisible}
                onOk={updateApplyLeaveStatusCanceled}
                onCancel={() => setIsCancelledModalVisible(false)}
                okText="Submit"
                cancelText="Cancel"
            >
                <Input.TextArea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    placeholder="Add your remarks here..."
                />
            </Modal>
        </PageContainer>
    )


}
export default LeavesApprovalGrid;