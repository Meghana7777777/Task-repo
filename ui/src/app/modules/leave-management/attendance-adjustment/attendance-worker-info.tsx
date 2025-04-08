import { FileExcelOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { AttendanceDto, BranchReq } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService, EmployeeTypeService } from '@hrexpert/shared-services';
import { Badge, Button, Card, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../common/iam-client-react';
import AttendanceAdjusTForm from './attendance-adjust-form';
import './attendance-info.css';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import { PageContainer } from '@ant-design/pro-layout';

const AttendanceWorkerInfo = () => {
    const [form] = Form.useForm();
    const Option = Select
    const { RangePicker } = DatePicker;
    const [data, setData] = useState<any>([])
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [branch, setUniqueBranch] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const service = new AttendanceServices;
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const employeeDetails = new EmployeeOnboardingService()
    //const defaultDateRange = [dayjs().startOf('month'), dayjs().startOf('month').add(4, 'days')];
    const defaultDateRange = [dayjs().startOf('month'), dayjs()];
    const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [rawData, setRawData] = useState<any>([]);
    const [groupedData, setGroupedData] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [modelData, setModelData] = useState<any>();
    const [employeeTypes, setEmployeeTypes] = useState([])
    const employeeTypesService = new EmployeeTypeService()



    useEffect(() => {
        // getAllAttendance();
        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches();
        getEmployeeTypes()
        // getEmpDetailsByBranch();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)
        }
    }, []);

    useEffect(() => {
        setUniqueBranch(Array.from(new Map(data.filter((rec: any) => rec.branches != null).map((rec: any) => [rec.branches, rec])).values()));
    }, [data]);
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

    useEffect(() => {
        if (rawData.length > 0) {
            const grouped = groupDataByEmployee(rawData);
            setGroupedData(grouped);
        } else {
            setGroupedData([]);
        }
    }, [rawData]);

    const getEmployeeTypes = () => {

        employeeTypesService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeTypes(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleBranchChange = (branchId) => {
        // if (!branchId) {
        //     setEmployees(''); // Clear employees if no branch is selected
        //     return;
        // }

        if (branchId === "ALL") {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
            branchId = null
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
                setEmployees(res.data.filter((w) => w.employeeTypeId != 1))
            } else {
                setEmployees('No Data Found');
            }
        });
    };

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

    const getAllAttendance = () => {
        const req = new AttendanceDto()
        const formValues = form.getFieldsValue();
        if (formValues.divisionName && formValues.divisionName) {
            req.divisionId = formValues.divisionName;
        }
        if (formValues.department && formValues.department) {
            req.departmentId = formValues.department;
        }
        if (formValues.designation && formValues.designation) {
            req.desginationid = formValues.designation;
        }
        // if (formValues.branches && formValues.branches) {
        //     req.branch = formValues.branches;
        // }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branches === "ALL") {
            req.branch = null; // "ALL" translates to null
        } else {
            req.branch = formValues.branches; // Send selected branch ID
        }
        if (formValues.attendanceDate) {
            req.attnFromDate = formValues.attendanceDate[0]?.format('YYYY-MM-DD');
            req.attnToDate = formValues.attendanceDate[1]?.format('YYYY-MM-DD');
        }
        if (formValues.employeeName && formValues.employeeName) {
            req.employeeCode = formValues.employeeName
        }
        if (formValues.attnStatus && formValues.attnStatus) {
            req.attnStatus = formValues.attnStatus;
        }
        // if (formValues.employeeTypeId && formValues.employeeTypeId) {
        //     req.employeeTypeId = formValues.employeeTypeId;
        // }
        req.employeeTypeId = 0
        try {
            setLoading(true)
            service.getAllAttendance(req).then((res) => {
                if (res.status) {
                    setRawData(res.data);
                    setData(res.data)
                    setShowColumns(true);
                    setLoading(false);
                } else {
                    message.error(res.internalMessage);
                    setShowColumns(false);
                    setLoading(false);
                    setData([])
                }
            });
        } catch (Err) {
            console.log(Err);
            setData([])
            setShowColumns(false);
            setLoading(false);
        }
    }

    const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<any> => ({
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

    // Group raw data by employeeId so that each row represents one employee.
    const groupDataByEmployee = (data: any[]) => {
        const grouped = data.reduce((acc: any, record) => {
            if (!acc[record.employeeId]) {
                acc[record.employeeId] = [];
            }
            acc[record.employeeId].push(record);
            return acc;
        }, {});
        return Object.keys(grouped).map((key) => {
            const records = grouped[key];
            const presentCount1 = records.filter((r: any) => r.attnStatus === "P"  || r.attnStatus === "WP" || r.attnStatus === "HP").length;
            const presentCount2 = records.filter((r: any) => r.attnStatus === "P/2" || r.attnStatus === "HP/2" || r.attnStatus === "WP/2").length;
            const presentCount = presentCount1 + (presentCount2/2)
            const absentCount = records.filter((r: any) => r.attnStatus === "A" ).length;
            const leaveCount1 = records.filter((r: any) => r.leaveStatus !== "A").length;
            const leaveCount2 = records.filter((r: any) => r.leaveStatus.includes('/2')).length;
            const leaveCount = leaveCount1 + (leaveCount2/2)            
            const weekoffCount = records.filter((r: any) => r.attnStatus === "W" || r.attnStatus === "H" || r.attnStatus === "WP" || r.attnStatus === "HP" || r.attnStatus === "WP/2" || r.attnStatus === "HP/2").length;
            return {
                key, // for table row key
                employeeId: key,
                branches: records[0].branches,
                empName: records[0].empName,
                empCode: records[0].empCode,
                divisionName: records[0].divisionName,
                department: records[0].department,
                designation: records[0].designation,
                // all attendance records for this employee
                presentCount,
                absentCount,
                leaveCount,
                weekoffCount,
                attendanceRecords: records,
            };
        });
    };


    // Main table columns: only employee details
    const mainColumns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, record, index) => (page - 1) * pageSize + (index + 1),
            align: 'center',
        },
        {
            title: 'Employee Name',
            dataIndex: 'empName',
            width: '10rem',
            sorter: (a, b) => a.empName.localeCompare(b.empName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('empName', 'Employee Name'),
        },
        {
            title: 'Employee Code',
            dataIndex: 'empCode',
            width: '7rem',
            ...getColumnSearchProps('empCode', 'Employee Code'),
        },
        {
            title: 'Branch',
            dataIndex: 'branches',
            width: '10rem',
            sorter: (a, b) => a.branches.localeCompare(b.branches),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('branches', 'Branch'),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            width: '7rem',
            sorter: (a, b) => a.department.localeCompare(b.department),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('department', 'Department'),
        },
        {
            title: 'Division',
            dataIndex: 'divisionName',
            width: '9rem',
            sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('divisionName', 'Division'),
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            width: '9rem',
            sorter: (a, b) => a.designation.localeCompare(b.designation),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps('designation', 'Designation'),
        },
        {
            title: '',
            dataIndex: 'count',
            render: (_, record) => {
                const tags = [
                    { key: 'Present', value: record.presentCount, color: 'green' },
                    { key: 'Absent', value: record.absentCount, color: 'red' },
                    { key: 'Leaves', value: record.leaveCount, color: 'blue' },
                    { key: 'Week Off', value: record.weekoffCount, color: 'orange' }
                ];

                return (
                    <>
                        {tags.map(({ key, value, color }) => (
                            <Tag color={color} key={key}>
                                {`${key}: ${value}`}
                            </Tag>
                        ))}
                    </>
                );
            },
        }


    ];

    // Nested table columns for attendance details
    const detailColumns: ColumnsType<any> = [
        {
            title: 'Attendance Date',
            dataIndex: 'attendanceDate',
            render: (text: any) =>
                text ? dayjs(text).format('ddd, DD-MMM-YYYY') : '-',
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            render: (text: any) =>
                text ? 'G' : 'G',
        },
        {
            title: 'Attendance Status',
            dataIndex: 'attnStatus',
            render: (status: string) => {
                const statusMap: Record<string, { color: string; label: string }> = {
                    P: { color: '#4CAF50', label: 'P' },
                    A: { color: '#F44336', label: 'A' },
                    'P/2': { color: '#FFD700', label: 'P/2' },
                    CO: { color: '#2196F3', label: 'CO' },
                    TU: { color: '#FF9800', label: 'TU' },
                    OD: { color: '#9C27B0', label: 'OD' },
                    H: { color: '#E0E0E0', label: 'H' },
                    W: { color: '#9E9E9E', label: 'W' },
                    WP: { color: '#795548', label: 'WP' },
                    'WP/2': { color: '#8D6E63', label: 'WP/2' },
                    HP: { color: '#BDBDBD', label: 'HP' },
                    'HP/2': { color: '#CFD8DC', label: 'HP/2' }
                };

                return statusMap[status] ? (
                    <Badge color={statusMap[status].color} text={statusMap[status].label} />
                ) : (
                    <Badge color="gray" text="Unknown" />
                );
            },
        },
        {
            title: 'Leave Status',
            dataIndex: 'leaveStatus',
            render: (text: any) =>
                text === 'A' ? '-' : text,
        },
        {
            title: 'In Time',
            dataIndex: 'inTime',
            render: (text: any) =>
                text && dayjs(text).isValid() ? dayjs(text).format('HH:mm') : '-',
        },
        {
            title: 'Out Time',
            dataIndex: 'outTime',
            render: (text: any) =>
                text && dayjs(text).isValid() ? dayjs(text).format('HH:mm') : '-',
        },
        {
            title: 'Working Hours',
            dataIndex: 'workingHours',
            render: (text: any, record: any) => {
                return (
                    <>
                     {/* <span style={{ color: record.lateMin === 0 && record.attnStatus !== 'A' ? 'black' : 'red' }}> */}
                        {text !== '00:00:00' ? dayjs(text, 'HH:mm:ss').format('HH:mm') : '-'}
                     {/* </span> */}
                    </>
                );
            },
        },
        // {
        //     title: 'Late min',
        //     dataIndex: 'lateMin',
        //     render: (text: any, record: any) => {
        //         return (
        //             <>
        //             {/* <span style={{ color: record.lateMin === 0 && record.attnStatus !== 'A' ? 'black' : 'red' }}> */}
        //                 {text ? text : '-'}
        //             {/* </span> */}
        //             </>
        //         );
        //     },
        // },
        // {
        //     title: 'Cumulative Late min ',
        //     dataIndex: 'cumLateMin',
        //     render: (text: any) => (text ? text : '-'),
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, record: any) => (
                <>
                    <Typography.Link onClick={() => { setOpen(true), setModelData(record) }}>
                        Edit
                    </Typography.Link>
                </>
            )
        },
    ];


    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const Reset = () => {
        const currentBranch = form.getFieldValue('branches'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branches: 'ALL' })
        //getAllAttendance()
        setFilteredEmployees([])
        setShowColumns(false);
        setData([]);
        setGroupedData([])
    }
    let i = 1;
    const attendance = [
        { title: 'Employee Name', dataIndex: 'empName' },
        { title: 'EmployeeCode', dataIndex: 'empCode' },
        { title: 'Branch', dataIndex: 'branches' },
        { title: 'Division', dataIndex: 'divisionName' },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Designation', dataIndex: 'designation' },
        { title: 'Attendance Status', dataIndex: 'attnStatus', },
        {
            title: 'Leave Status', dataIndex: 'leaveStatus',
            render: (text: any) =>
                text === 'A' ? '-' : text,
        },
        { title: ' Date', dataIndex: 'attendanceDate', },
        {
            title: 'Shift', dataIndex: 'shift',
            render: (text: any) =>
                text ? 'G' : '-',
        },
        {
            title: 'In Time', dataIndex: 'inTime', render: (text: any) =>
                text && dayjs(text).isValid() ? dayjs(text).format('HH:mm') : '-',
        },
        {
            title: 'Out Time', dataIndex: 'outTime', render: (text: any) =>
                text && dayjs(text).isValid() ? dayjs(text).format('HH:mm') : '-',
        },
        {
            title: 'Working Hours', dataIndex: 'workingHours',
            render: (text: any) =>
                text !== '00:00:00' ? dayjs(text, 'HH:mm:ss').format('HH:mm') : '-',
        },
        { title: 'Late min', dataIndex: 'lateMin', render: (text) => (text ? text : '-') },
        { title: 'Late min per month', dataIndex: 'cumLateMin', render: (text) => (text ? text : '-') },

    ];

    function formatTime(date) {
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    const exportExcel = () => {
        const excel = new Excel();
        const calculateColumnWidths = (columns: IExcelColumn[], data: any[]) =>
            columns.map((col: any) => ({
                ...col,
                width: Math.max(
                    col.title.toString().length,
                    ...data.map((row) => row[col.dataIndex]?.toString().length || 0)
                ) * 12
            }));
        const adjustedColumns = calculateColumnWidths(attendance, groupedData);
        excel
            .addSheet('attendance-report')
            .addColumns(adjustedColumns)
            .addDataSource(groupedData, { str2num: true })
            .saveAs('attendance-report.xlsx');
    }

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>

            <PageContainer title="Workers Attendance">
                <Form layout='vertical' form={form} initialValues={{ attendanceDate: defaultDateRange }}>
                    <Row gutter={24}>

                        <Col xs={24} sm={12} md={9} lg={5} xl={5}>
                            <Form.Item label="Date" name="attendanceDate" rules={[{ required: true, message: 'Please select a date' }]}>
                                <RangePicker style={{ width: '100%' }} disabledDate={disableFutureDates} />
                            </Form.Item>
                        </Col>

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
                                    <Option value={'ALL'}> ALL </Option>
                                    {branches?.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item label='Employee' name='employeeName' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : IAMClientAuthContext.user.employeeCode}>
                                <Select showSearch allowClear
                                    disabled={IAMClientAuthContext.user.roles === "SuperAdmin" ? false : true}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees?.map((rec: any) => (
                                        <Option value={rec.employeeCode} key={rec.employeeId}>
                                            {rec.employeeName}-{rec.employeeCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {(IAMClientAuthContext.user.roles === "SuperAdmin" ?
                            <>
                                <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Form.Item label="Department" name="department">
                                        <Select showSearch allowClear placeholder="Select Department" optionFilterProp="children">
                                            {departments.map((rec: any) => (
                                                <Option value={rec.id} key={rec.id}>
                                                    {rec.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                <Form.Item label="Designation" name="designation">
                                    <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children">
                                        {designations.map((rec: any) => (
                                            <Option value={rec.id} key={rec.id}>
                                                {rec.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col> */}

                                {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                <Form.Item label="Division" name="divisionName">
                                    <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children">
                                        {divisions.map((rec: any) => (
                                            <Option value={rec.id} key={rec.id}>
                                                {rec.divisionName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col> */}
                            </> :
                            <></>
                        )}

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>

                            <Form.Item
                                label="Attendance Status"
                                name="attnStatus"
                            >
                                <Select placeholder="Select Attendance Status" allowClear>
                                    {Object.entries({
                                        P: { color: '#4CAF50', label: 'Present (P)' },
                                        A: { color: '#F44336', label: 'Absent (A)' },
                                        'P/2': { color: '#FFD700', label: 'Half-day (P/2)' },
                                        CO: { color: '#2196F3', label: 'Comp-Off (CO)' },
                                        TU: { color: '#FF9800', label: 'Tour (TU)' },
                                        OD: { color: '#9C27B0', label: 'Outdoor Duty (OD)' },
                                        H: { color: '#E0E0E0', label: 'Holiday (H)' },
                                        W: { color: '#9E9E9E', label: 'Week-Off Holiday (W)' },
                                        WP: { color: '#795548', label: 'Week-Off Present (WP)' },
                                        'WP/2': { color: '#8D6E63', label: 'Week-Off Half-day (WP/2)' },
                                        HP: { color: '#BDBDBD', label: 'Holiday Present (HP)' },
                                        'HP/2': { color: '#CFD8DC', label: 'Holiday Half-day (HP/2)' }
                                    }).map(([value, { color, label }]) => (
                                        <Select.Option key={value} value={value}>
                                            <Badge color={color} text={label} />
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label='Employee Type' name='employeeTypeId'>
                                <Select placeholder={'Select Employee Type'} >
                                    {
                                        employeeTypes.map((v: any) => { return <Option key={v.id} value={v?.id}>{v?.name}</Option> })
                                    }
                                </Select>
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button color="primary" variant="outlined" onClick={getAllAttendance}>
                                Submit
                            </Button>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button icon={<UndoOutlined />} onClick={Reset} type="dashed" danger>
                                Reset
                            </Button>
                        </Col>

                        {data.length > 0 ? <> <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={exportExcel}>
                                Get Excel
                            </Button>
                        </Col></> : <></>}

                    </Row>

                </Form>
                <br></br>
                {groupedData.length > 0 && (
                    <Table
                        className="small-table"
                        columns={mainColumns}
                        dataSource={groupedData}
                        loading={loading}
                        pagination={{
                            pageSize: 20,
                            onChange(current, pageSize) {
                                setPage(current);
                                setPageSize(pageSize)
                            },
                            position: ['bottomRight'],
                        }}
                        scroll={{ x: true }}
                        rowKey="employeeId"
                        bordered
                        expandable={{
                            expandedRowRender: (record) => (
                                <Table
                                    columns={detailColumns}
                                    dataSource={record.attendanceRecords}
                                    pagination={false}
                                    rowKey="attendanceId"
                                />
                            ),
                        }}
                    />
                )}

            </PageContainer>

            <Drawer
                //  title={` Drawer`}
                placement="right"
                onClose={onClose}
                open={open}
                size={'large'}

            >
                <AttendanceAdjusTForm isUpdate={true} Data={modelData} updateDetails={undefined} closeForm={onClose} />
            </Drawer>

        </>
    )
}

export default AttendanceWorkerInfo