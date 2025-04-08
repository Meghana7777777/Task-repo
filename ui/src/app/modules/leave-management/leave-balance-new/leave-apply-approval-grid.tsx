import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ApplyForLeaveStatusEnum, ApproveLeaveStatusReq, BranchReq, ScopesEnum } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tabs, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from "../../../common/iam-client-react";
import { SequenceUtils } from "../../../common/utils";
import dayjs from "dayjs";

interface LeavesApprovalGridIProps {
    scopes: ScopesEnum[]
}
 
export const LeaveApplyApprovalGrid = (props: LeavesApprovalGridIProps) => {
    const { scopes } = props
    const { TabPane } = Tabs;
    const { Option } = Select
    const [form] = Form.useForm()
    const [remarks, setRemarks] = useState('');
    const searchInput = useRef(null); 
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const service = new ApplForLeavesSharedService()
    const [openData, setOpen] = useState<any>([]);
    const [approvedData, setApproved] = useState<any>([]);
    const [rejectedData, setRejected] = useState<any>([]);
    const [cancelData, setCancel] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isApprovedModalVisible, setIsApprovedModalVisible] = useState(false);
    const [isRejectedModalVisible, setIsRejectedModalVisible] = useState(false);
    const [isCancelledModalVisible, setIsCancelledModalVisible] = useState(false);
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const employeeDetails = new EmployeeOnboardingService()
    const [employees, setEmployees] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<ApplyForLeaveStatusEnum>(ApplyForLeaveStatusEnum.OPEN);
    const { IAMClientAuthContext } = useIAMClientState();
    const user = IAMClientAuthContext.user;

    useEffect(() => {
        getAppliedForLeavesOpen();
        getAppliedForLeavesApproved();
        getAppliedForLeavesRejected();
        getAppliedForLeavesCancel();
        getAllBranches()
        getAllDepartments();
        getDesignations();
        getAllDivision();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)
        }
    }, []);



    const handleBranchChange = (branchId) => {
        // if (!branchId) {
        //     setEmployees(''); // Clear employees if no branch is selected
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

        // Create an instance of BranchReq
        const branchRequest = new BranchReq(branchId);

        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

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

    useEffect(() => {
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

    function getMonthDays(fromDateStr: string, toDateStr: string, leaveFromDay: string, leaveToDay: string, noOfDays: number) {
        const fromDate = new Date(fromDateStr.split('-').reverse().join('-'))
        const toDate = new Date(toDateStr.split('-').reverse().join('-'))
    
        const result: { month: number; days: number }[] = []
        let remainingDays = noOfDays
        let currentDate = new Date(fromDate);
    
        while (currentDate <= toDate && remainingDays > 0) {
            const month = currentDate.getMonth() + 1
            const year = currentDate.getFullYear()
    
            const daysInMonth = new Date(year, month, 0).getDate()
            const startDay = currentDate.getDate()
            const endDay = month === toDate.getMonth() + 1 && year === toDate.getFullYear() ? toDate.getDate() : daysInMonth
    
            let days = endDay - startDay + 1
    
            if (currentDate.getTime() === fromDate.getTime()) {
                if (leaveFromDay === "First Half") days -= 0.5
                else if (leaveFromDay === "Second Half") days -= 1
            }
            if (currentDate.getTime() === toDate.getTime()) {
                if (leaveToDay === "First Half") days -= 1
                else if (leaveToDay === "Second Half") days -= 0.5
            }
    
            days = Math.min(days, remainingDays)
            remainingDays -= days;
    
            const existingMonth = result.find((entry) => entry.month === month);
            if (existingMonth) {
                existingMonth.days += days
            } else {
                result.push({ month, days })
            }
    
            currentDate.setMonth(currentDate.getMonth() + 1, 1);
        }
    
        return result;
    }

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
            //     applyForLeavesId: applyForLeavesIds,
            //     status: ApplyForLeaveStatusEnum.APPROVED,
            //     remarks
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
                
                leaveGroupCodeId: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.leaveGroupCodeId
                ), 

                dates: selectedRowKeys.map(key => {
                    const selectedRow = openData.find(row => row.employeeId + row.applyForLeavesId === key);
                    if (!selectedRow) return null;
    
                    return getMonthDays(
                        dayjs(selectedRow.fromDate).format('DD-MM-YYYY'),
                        dayjs(selectedRow.toDate).format('DD-MM-YYYY'),
                        selectedRow.leaveFromDay, selectedRow.leaveToDay, selectedRow.noOfDays
                    );
                }).filter(Boolean),

                status: ApplyForLeaveStatusEnum.REJECTED,
                remarks,
                createdMonth: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.createdAt
                ), 
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

                leaveGroupCodeId: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.leaveGroupCodeId
                ), 

                dates: selectedRowKeys.map(key => {
                    const selectedRow = openData.find(row => row.employeeId + row.applyForLeavesId === key);
                    if (!selectedRow) return null;
    
                    return getMonthDays(
                        dayjs(selectedRow.fromDate).format('DD-MM-YYYY'),
                        dayjs(selectedRow.toDate).format('DD-MM-YYYY'),
                        selectedRow.leaveFromDay, selectedRow.leaveToDay, selectedRow.noOfDays
                    );
                }).filter(Boolean),

                status: ApplyForLeaveStatusEnum.CANCEL,
                remarks,
                createdMonth: selectedRowKeys.map(key =>
                    openData.find(row => row.employeeId + row.applyForLeavesId === key)?.createdAt
                ),
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
            dataIndex: 'leaveCode',
            align: "center",
            sorter: (a, b) => a.leaveCode?.localeCompare(b.leaveCode),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('leaveCode', 'Type of leave')
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
            dataIndex: 'leaveCode',
            align: "center",
            sorter: (a, b) => a.leaveCode?.localeCompare(b.leaveCode),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('leaveCode', 'Type of leave')
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
        setSelectedRowKeys([])
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

    const filterDataByOpenStatus = (status) => {
        return openData?.filter(item => item.status === status) || [];
    };
    const filterDataByApprovedStatus = (status) => {
        return approvedData?.filter(item => item.status === status) || [];
    };
    const filterDataByRejectedStatus = (status) => {
        return rejectedData?.filter(item => item.status === status) || [];
    };
    const filterDataByCancelStatus = (status) => {
        return cancelData?.filter(item => item.status === status) || [];
    };

    return (
        <PageContainer title='Leaves Approval' breadcrumbRender={false}>
            <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Form.Item name="branchName" label="Branch ">
                            <Select showSearch allowClear placeholder="Select Branch" dropdownMatchSelectWidth={false} optionFilterProp="children"
                                // disabled={user?.roles !== 'SuperAdmin'}
                                disabled={user?.roles === 'SuperAdmin' ? false : true}
                                onChange={(value) => handleBranchChange(value)}
                            >
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
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.employeeName} -{rec.employeeCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                        <Button onClick={getAppliedForLeavesOpen} color="primary" variant="outlined">Submit</Button>
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

                <TabPane tab={<span>OPEN: <Tag color="blue">{filterDataByOpenStatus('OPEN').length}</Tag></span>}
                    key={ApplyForLeaveStatusEnum.OPEN} >
                    {tabExtraContent()}
                    <Table
                    style={{marginTop:'5px'}}
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

                <TabPane tab={<span>APPROVED: <Tag color="blue">{filterDataByApprovedStatus('APPROVED').length}</Tag></span>} key={ApplyForLeaveStatusEnum.APPROVED} >
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

                <TabPane tab={<span>REJECTED: <Tag color="blue">{filterDataByRejectedStatus('REJECTED').length}</Tag></span>} key={ApplyForLeaveStatusEnum.REJECTED} >
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

                <TabPane tab={<span>CANCEL: <Tag color="blue">{filterDataByCancelStatus('CANCEL').length}</Tag></span>} key={ApplyForLeaveStatusEnum.CANCEL} >
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
export default LeaveApplyApprovalGrid;