import { FileExcelOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { AttendanceDto, BranchReq } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Excel } from 'antd-table-saveas-excel';
dayjs.extend(isBetween);
import '../attendance-adjustment/attendance-info.css'

import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useIAMClientState } from '../../../common/iam-client-react';
import { from } from 'rxjs';
import Highlighter from 'react-highlight-words';
import { PageContainer } from '@ant-design/pro-layout';

const LeaveCollisionReport = () => {
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
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
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
    const [attnStatus, setAttnStatus] = useState("P");
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    console.log(role)
    console.log(Branch)
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

    const getAllLeaveCollisions = () => {
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
            service.getAllLeaveCOllision(req).then((res) => {
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

    const handleAttendanceClick = (record) => {
        console.log(record)
        setSelectedRecord(record);
        setAttendanceModalVisible(true);
        form.setFieldsValue({
            attnStatus: record.attnStatus,
            attendanceId: record.attendanceId,
            inTime: record.inTime ? dayjs(record.inTime) : null,
            outTime: record.outTime ? dayjs(record.outTime) : null,
        });
    };

    const handleLeaveClick = (record) => {
        setSelectedRecord(record);
        setLeaveModalVisible(true);
    };


    const handleAttendanceSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                console.log("Form Values:", values); // Log form values

                try {
                    // Create the request object
                    const req = {
                        attendanceId: values.attendanceId, // Get attendanceId from form values
                        attendanceStatus: values.attnStatus, // Get attnStatus from form values
                        inTime: values.inTime ? values.inTime.format("YYYY-MM-DD HH:mm:ss") : null, // Format inTime
                        outTime: values.outTime ? values.outTime.format("YYYY-MM-DD HH:mm:ss") : null, // Format outTime
                    };

                    // Call the service to update attendance
                    const response = await service.updateAttendanceWhileCollision(req);

                    if (response.status = true) {
                        message.success("Attendance updated successfully!");
                        setAttendanceModalVisible(false)
                    } else {
                        message.error("Failed to update attendance");
                        setAttendanceModalVisible(false)
                    }
                } catch (error) {
                    console.error("Error updating attendance:", error);
                    message.error("Failed to update attendance");
                }
            })
            .catch((error) => {
                console.error("Validation Failed:", error);
            });
    };

    const handleDeleteLeave = async () => {
        try {
            // Check if a record is selected
            if (!selectedRecord) {
                message.error("No record selected for deletion.");
                return;
            }

            const req = {
                attendanceId: selectedRecord.attendanceId,
                leaveStatus: selectedRecord.leaveStatus,
                attendanceStatus: "A", // Set attendanceStatus to "A" (Absent)
                attendanceDate: selectedRecord.attendanceDate,
                empCode: selectedRecord.empCode
            };

            // Call the service to delete the leave record
            const response = await service.deleteLeaveInAttendanceWhileCollision(req);

            if (response.status) {
                message.success("Leave record deleted successfully!");
                setLeaveModalVisible(false); // Close the modal
                getAllLeaveCollisions()
            } else {
                message.error(response.internalMessage);
            }
        } catch (error) {
            console.error("Error deleting leave record:", error);
            message.error("Failed to delete leave record");
        }
    };

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
                sorter: (a, b) => a.empName.localeCompare(b.empName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("empName", 'Employee Name'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Employee Code',
                dataIndex: 'empCode',
                sorter: (a, b) => a.empCode.localeCompare(b.empCode),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("empCode", 'Employee Code'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Branch',
                dataIndex: 'branches',
                sorter: (a, b) => a.branches.localeCompare(b.branches),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("branches", 'Branch'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Division',
                dataIndex: 'divisionName',
                sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("divisionName", 'Division'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Department',
                dataIndex: 'department',
                sorter: (a, b) => a.department.localeCompare(b.department),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("department", 'Department'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Designation',
                dataIndex: 'designation',
                sorter: (a, b) => a.designation.localeCompare(b.designation),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("designation", 'Designation'),
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Collision',
                children: [
                    {
                        title: 'Attendance Status',
                        dataIndex: 'attnStatus',
                        render: (text, record) => (
                            <Button type="link" onClick={() => handleAttendanceClick(record)}>{text || '-'}</Button>
                        ),
                    },
                    {
                        title: 'Leave Status',
                        dataIndex: 'leaveStatus',
                        render: (text, record) => (
                            <Button type="link" onClick={() => handleLeaveClick(record)}>{text || '-'}</Button>
                        ),
                    },
                ],
            },
            {
                title: 'Date',
                dataIndex: 'attendanceDate',
                sorter: (a, b) => a.attendanceDate.localeCompare(b.attendanceDate),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("attendanceDate", 'Date'),
                render: (text: any) => (text ? text : '-'),
                //width: 150,
            },
            {
                title: 'In Time',
                dataIndex: 'inTime',
                sorter: (a, b) => a.inTime.localeCompare(b.inTime),
                sortDirections: ['ascend', 'descend'],
                render: (text) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-')
            },
            {
                title: 'Out Time',
                dataIndex: 'outTime',
                sorter: (a, b) => a.outTime.localeCompare(b.outTime),
                sortDirections: ['ascend', 'descend'],
                render: (text) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-')
            },
            {
                title: 'Working Hours',
                dataIndex: 'workingHours',
                sorter: (a, b) => a.workingHours.localeCompare(b.workingHours),
                sortDirections: ['ascend', 'descend'],
                render: (text) => text !== '00:00:00' ? dayjs(text, 'HH:mm:ss').format('HH:mm') : '-'
            },
        ];
        return dynamicColumns;
    };

    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const Reset = () => {
        const currentBranch = form.getFieldValue('branches'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })
        getAllLeaveCollisions()
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
        excel
            .addSheet('attendance-report')
            .addColumns(attendance)
            .addDataSource(data, { str2num: true })
            .saveAs('attendance-report.xlsx');
    }
    return (

        <PageContainer title="Leave Collision Report" >
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
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
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
                </Row>
                <Row gutter={16} style={{ marginBottom: '10px', marginTop: '10px' }}>
                    <Col>
                        <Button color="primary" variant="outlined" onClick={getAllLeaveCollisions}>
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <Button icon={<UndoOutlined />} onClick={Reset} type='dashed' danger> Reset </Button>
                    </Col>
                    {data.length > 0 ? (
                        <> <Col>
                            <Button icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                                Get Excel
                            </Button>
                        </Col>
                        </>
                    ) : (<></>)}
                </Row>


            </Form>
            {showColumns && (<>
                <Table
                    style={{ marginTop: '10px' }}
                    className='small-table'
                    columns={generateColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['bottomRight'],
                    }}
                    scroll={{ x: true }}
                    rowKey="id"
                    bordered
                />
                <Modal
                    title="Update Attendance Status"
                    visible={attendanceModalVisible}
                    onCancel={() => setAttendanceModalVisible(false)}
                    onOk={handleAttendanceSubmit}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item label="Attendance Id" name="attendanceId">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Attendance Status" name="attnStatus" >
                            <Select value={attnStatus} onChange={setAttnStatus}>
                                <Select.Option value="P">Present</Select.Option>
                                <Select.Option value="A">Absent</Select.Option>
                            </Select>
                        </Form.Item>

                        {attnStatus === "P" && (
                            <>
                                <Form.Item
                                    label="In Time"
                                    name="inTime"
                                    rules={[{ required: true, message: "Please select In Time" }]}
                                >
                                    <DatePicker showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label="Out Time"
                                    name="outTime"
                                    rules={[{ required: true, message: "Please select Out Time" }]}
                                >
                                    <DatePicker showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        style={{ width: '100%' }} />
                                </Form.Item>
                            </>
                        )}

                        <Button color="primary" variant="outlined" onClick={handleAttendanceSubmit}>
                            Submit
                        </Button>
                    </Form>
                </Modal>
                {/* Leave Modal */}
                <Modal
                    title="Manage Leave Status"
                    visible={leaveModalVisible}
                    onCancel={() => setLeaveModalVisible(false)}
                    footer={[
                        <Button key="delete" type="primary" danger onClick={handleDeleteLeave}>Delete</Button>,
                        <Button key="cancel" onClick={() => setLeaveModalVisible(false)}>Cancel</Button>
                    ]}
                >
                    <p>Are you sure you want to delete this leave record?</p>
                </Modal>
            </>)}
        </PageContainer>
    )
}

export default LeaveCollisionReport