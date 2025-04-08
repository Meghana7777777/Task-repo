import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { AttendanceDto, BranchReq } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { IExcelColumn } from 'antd-table-saveas-excel/app';
import React, { useEffect, useRef, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';
import { PageContainer } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';

const SinglePunchAttandenceReport = () => {
    const [form] = Form.useForm();
    const Option = Select
    const { RangePicker } = DatePicker;
    const [data, setData] = useState<any>([])
    const [page, setPage] = React.useState(1);
    const [pageSize] = useState(50);
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
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        // getAllAttendance();
        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches();
        // getEmpDetailsByBranch();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            // handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            // handleBranchChange(IAMClientAuthContext.user.unitId)
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

    const getAllSinglePunchAttendance = () => {
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
        try {
            setLoading(true)
            service.getAllSinglePunchAttendance(req).then((res) => {
                if (res.status) {
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

    const generateColumns = () => {
        const dynamicColumns: ColumnsType<any> = [
            {
                title: 'S No',
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: 'center',
            },
            {
                title: 'Employee Name',
                dataIndex: 'empName',
                ...getColumnSearchProps("empName", "Employee Name"),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Employee Code',
                dataIndex: 'empCode',
                ...getColumnSearchProps("empCode", "Employee Code"),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Branch',
                dataIndex: 'branches',
                ...getColumnSearchProps("branches", "Branch"),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Division',
                dataIndex: 'divisionName',
                ...getColumnSearchProps("divisionName", "Division"),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Department',
                dataIndex: 'department',
                ...getColumnSearchProps("department", "Department"),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Designation',
                dataIndex: 'designation',
                ...getColumnSearchProps("designation", "Designation"),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Present Status',
                dataIndex: 'attnStatus',
                ...getColumnSearchProps("attnStatus", 'Present Status'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Date',
                dataIndex: 'attendanceDate',
                ...getColumnSearchProps("attendanceDate", "Date"),
                render: (text: any) => (text ? text : '-'),
                width: 150,
            },
            {
                title: 'In Time',
                dataIndex: 'inTime',
                sorter: (a, b) => dayjs(a.inTime).valueOf() - dayjs(b.inTime).valueOf(),
                sortDirections: ['ascend', 'descend'],
                render: (text) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-')
            },
            {
                title: 'Out Time',
                dataIndex: 'outTime',
                sorter: (a, b) => dayjs(a.outTime).valueOf() - dayjs(b.outTime).valueOf(),
                sortDirections: ['ascend', 'descend'],
                render: (text) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-')
            },
            {
                title: 'Working Hours',
                dataIndex: 'workingHours',
                sorter: (a, b) => dayjs(a.workingHours).valueOf() - dayjs(b.workingHours).valueOf(),
                sortDirections: ['ascend', 'descend'],

            },
        ];
        return dynamicColumns;
    };

    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const Reset = () => {
        const currentBranch = form.getFieldValue('branches');
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })
        getAllSinglePunchAttendance()
        setFilteredEmployees([])
        setShowColumns(false);
        setData([]);
    }
    let i = 1;
    const attendance = [
        { title: 'S No', dataIndex: 'sNo', render: (text, object, index) => { return i++; } },
        { title: 'Branch', dataIndex: 'branches' },
        { title: 'Employee Name', dataIndex: 'empName' },
        { title: 'EmployeeCode', dataIndex: 'empCode' },
        { title: 'Division', dataIndex: 'divisionName' },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Designation', dataIndex: 'designation' },
        { title: 'Attn Status', dataIndex: 'attnStatus', },

        { title: ' Date', dataIndex: 'attendanceDate', },
        {
            title: 'In Time', dataIndex: 'inTime',
            render: (text) => formatTime(new Date(text))
        },
        {
            title: 'Out Time', dataIndex: 'outTime',
            render: (text) => formatTime(new Date(text))
        },



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
                ) * 15
            }));
        const adjustedColumns = calculateColumnWidths(attendance, data);
        excel
            .addSheet('Single-Punch-Attendance-Report')
            .addColumns(adjustedColumns)
            .addDataSource(data, { str2num: true })
            .saveAs('Single-Punch-Attendance-Report.xlsx');
    };

    return (

        <PageContainer title="Single Punch Attendance Report" >
            <Form layout='vertical' form={form} initialValues={{ attendanceDate: defaultDateRange }}>
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
                                dropdownMatchSelectWidth={false}
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
                    <Col xs={24} sm={12} md={8} lg={4} xl={5}>
                        <Form.Item label="Date" name="attendanceDate">
                            <RangePicker disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>


                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
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
                        <Form.Item label="Designation" name="designation">
                            <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children" dropdownMatchSelectWidth={false}>
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
                                    <Option value={rec.employeeId} key={rec.employeeId}>
                                        {rec.employeeName}-{rec.employeeCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                        <Button type="primary" onClick={getAllSinglePunchAttendance} variant="outlined" color="primary">
                            Submit
                        </Button>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={Reset} type='dashed' danger> Reset </Button>
                    </Col>

                    {data.length > 0 ? (
                        <>  <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                            <Button className='panel_button' style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
                        </Col>

                        </>
                    ) : (<></>)}

                </Row>
            </Form>
            {showColumns && (
                <Table
                    columns={generateColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                    }}
                    scroll={{ x: true }}
                    rowKey="id"
                    bordered
                />
            )}

        </PageContainer>
    )
}

export default SinglePunchAttandenceReport