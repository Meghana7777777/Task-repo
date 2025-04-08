import { UndoOutlined } from '@ant-design/icons';
import { AttendanceDto, BranchReq, ScopesEnum } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import React, { useEffect, useState } from 'react';
import { SequenceUtils } from "../../../common/utils";
import { useIAMClientState } from '../../../common/iam-client-react';

interface AttendanceAdjustmentForBulkIProps {
    PropsScopes?: ScopesEnum[]
}

const { Option } = Select;
const { RangePicker } = DatePicker;

const AttendanceAdjustmentForBulk = (props: AttendanceAdjustmentForBulkIProps) => {
    const { PropsScopes } = props
    const [form] = Form.useForm();
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(50);
    const [loading, setLoading] = useState<boolean>(true);
    const [departments, setDepartments] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId

    const attendanceService = new AttendanceServices();
    const departmentService = new DepartmentService();
    const branchService = new BranchesService();
    const designationsService = new DesignationsService();
    const divisionService = new DivisionService();
    const employeeOnboardingService = new EmployeeOnboardingService();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = () => {
        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            // handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            // handleBranchChange(IAMClientAuthContext.user.unitId)
        }
    };

    const getAllBranches = async () => {
        try {
            const res = await branchService.getAllBranches();
            if (res.status) {
                setBranches(res.data);
            } else {
                console.error("Failed to fetch branches");
                message.error("Failed to fetch branches");
            }
        } catch (err) {
            console.error(err);
            message.error("An error occurred while fetching branches");
        }
    };

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

    const getAllDepartments = async () => {
        try {
            const res = await departmentService.getAllDepartments();
            if (res.status) {
                setDepartments(res.data);
            } else {
                setDepartments([]);
                message.error('No Departments Found');
            }
        } catch (err) {
            console.error(err);
            message.error('An error occurred while fetching departments');
        }
    };

    // Fetch designations
    const getDesignations = async () => {
        try {
            const res = await designationsService.getDesignations();
            if (res.status) {
                setDesignations(res.data);
            } else {
                setDesignations([]);
                message.error('No Designations Found');
            }
        } catch (err) {
            console.error(err);
            message.error('An error occurred while fetching designations');
        }
    };

    // Fetch divisions
    const getAllDivision = async () => {
        try {
            const res = await divisionService.getAllDivision();
            if (res.status) {
                setDivisions(res.data);
            } else {
                setDivisions([]);
                message.error('No Divisions Found');
            }
        } catch (err) {
            console.error(err);
            message.error('An error occurred while fetching divisions');
        }
    };

    // Fetch attendance data based on form filters
    const getAllAttendance = async () => {
        const req = new AttendanceDto();
        const formValues = form.getFieldsValue();

        if (formValues.divisionName) {
            req.divisionId = formValues.divisionName;
        }
        if (formValues.department) {
            req.departmentId = formValues.department;
        }
        if (formValues.designation) {
            req.desginationid = formValues.designation;
        }
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
            req.employeeId = formValues.employeeName;
        }

        try {
            setLoading(true);
            const res = await attendanceService.getAllAttendance(req);
            if (res.status) {
                // Initialize newInTime and newOutTime based on existing inTime and outTime
                const initializedData = res.data.map((item: any) => ({
                    ...item,
                    newInTime: item.inTime ? dayjs(item.inTime).format('YYYY-MM-DD HH:mm') : null,
                    newOutTime: item.outTime ? dayjs(item.outTime).format('YYYY-MM-DD HH:mm') : null,
                }));
                setData(initializedData);
                setShowColumns(true);
            } else {
                message.error(res.internalMessage || 'Failed to fetch attendance data');
                setData([]);
                setShowColumns(false);
            }
        } catch (err) {
            console.error(err);
            message.error('An error occurred while fetching attendance data');
            setData([]);
            setShowColumns(false);
        } finally {
            setLoading(false);
        }
    };

    // Handle row selection in the table
    const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
    };

    // Handle status change
    const handleStatusChange = (value: string, record: any) => {
        setData((prevData: any[]) =>
            prevData.map((item: any) =>
                item.attendanceId === record.attendanceId ? { ...item, attnStatus: value } : item
            )
        );
    };

    // Handle time changes for newInTime and newOutTime
    const handleTimeChange = (timeString: string, field: string, attendanceId: number) => {
        setData(prevData =>
            prevData.map(item => {
                if (item.attendanceId === attendanceId) {
                    // Update only the row that was modified
                    return { ...item, [field]: timeString };
                }
                return item;
            })
        );
    };


    // Save attendance adjustments
    const saveAttendanceAdjustments = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select rows to save.');
            return;
        }

        // Filter selected rows
        const selectedData = data.filter((item: any) => selectedRowKeys.includes(item.attendanceId));


        //  Check if any of the selected rows have 'freezeStatus' set to 'Y'
        const frozenData = selectedData.filter((item: any) => item.freezeStatus === 'Y');
        const updatableData = selectedData.filter((item: any) => item.freezeStatus !== 'Y'); // Only those records that can be updated

        //  Check if there are any frozen records and show message for them
        if (frozenData.length > 0) {
            message.error(`Attendance adjustment is frozen for employee(s): ${frozenData.map(item => item.empName).join(', ')}`);
        }
        // Validate that newInTime and newOutTime are set
        for (const item of updatableData) {
            if (!item.newInTime || !item.newOutTime) {
                message.error(`Please set both In Time and Out Time for employee ${item.empName}`);
                return;
            }
        }

        // Prepare adjustment data
        const adjustmentData = updatableData.map((item: any) => ({
            attendanceId: item.attendanceId,
            employeeCode: item.empCode,
            employeeName: item.empName,
            date: item.attendanceDate,
            oldInTime: item.inTime || null,
            newInTime: item.newInTime,
            oldOutTime: item.outTime || null,
            newOutTime: item.newOutTime,
            presentStatus: item.attnStatus,
            reason: item.reason,
            departmentId: item.departmentId,
            divisionId: item.divisionId,
            designationId: item.desginationid,
            branchId: item.branchesId,
            employeeId: item.employeeId
        }));

        console.log('Adjustment Data:', adjustmentData);

        try {
            const res = await attendanceService.attnAdjustmentBulkCreation(adjustmentData);
            if (res.status) {
                message.success('Attendance adjustments saved successfully.');
                getAllAttendance(); // Refresh data
                setSelectedRowKeys([]); // Clear selection
            } else {
                message.error(res.internalMessage || 'Failed to save attendance adjustments.');
            }
        } catch (err) {
            console.error(err);
            message.error('An error occurred while saving attendance adjustments.');
        }
    };

    // Generate table columns
    const generateColumns = (): ColumnsType<any> => {

        const dynamicColumns: ColumnsType<any> = [
            {
                title: 'S No',
                render: (text, object, index) => (page - 1) * pageSize + index + 1,
                align: 'center',
                fixed: "left",
                width: 60,
            },
            {
                title: 'Branch',
                dataIndex: 'branches',
                render: (text: any) => (text ? text : '-'),
                fixed: "left",
                width: 150,
            },
            {
                title: 'Employee Name',
                dataIndex: 'empName',
                render: (text: any) => (text ? text : '-'),
                fixed: "left",
                width: 200,
            },
            {
                title: 'Employee Code',
                dataIndex: 'empCode',
                render: (text: any) => (text ? text : '-'),
                fixed: "left",
                width: 150,
            },
            {
                title: 'Division',
                dataIndex: 'divisionName',
                render: (text: any) => (text ? text : '-'),
                width: 150,
            },
            {
                title: 'Department',
                dataIndex: 'department',
                render: (text: any) => (text ? text : '-'),
                width: 150,
            },
            {
                title: 'Designation',
                dataIndex: 'designation',
                render: (text: any) => (text ? text : '-'),
                width: 150,
            },
            {
                title: 'Present Status',
                dataIndex: 'attnStatus',
                render: (text: string, record: any) => (
                    <Select
                        value={text}
                        onChange={(value) => handleStatusChange(value, record)}
                        options={[
                            { value: 'P', label: 'P' },
                            { value: 'A', label: 'A' },
                            { value: 'CO', label: 'C-Off' },
                            { value: 'OD', label: 'OD' },
                            { value: 'L', label: 'Leave' },
                        ]}
                        style={{ width: '100%' }}
                    />
                ),
                width: 150,
            },
            {
                title: 'Date',
                dataIndex: 'attendanceDate',
                render: (text: any) => (text ? text : '-'),
                width: 150,
            },
            {
                title: 'In Time',
                dataIndex: 'inTime',
                render: (text: any) =>
                    text
                        ? dayjs(text, 'YYYY-MM-DDHH:mm:ss').format('YYYY-MM-DD HH:mm:ss') // Parse and format the text
                        : '-',
                width: 150,
            },

            {
                title: 'New In Time',
                dataIndex: 'newInTime',
                render: (text: Date | null, record: any) => (
                    <DatePicker
                        value={text ? dayjs(text) : null} // Use the Date object to initialize the DatePicker
                        format="YYYY-MM-DD HH:mm" // Display format
                        showTime // Enable time selection
                        onChange={(momentObj) => {
                            if (momentObj) {
                                // Update the row data with the selected Date object
                                const updatedData = data.map((item) =>
                                    item.attendanceId === record.attendanceId
                                        ? { ...item, newInTime: momentObj.toDate() } // Store as a Date object
                                        : item
                                );
                                setData(updatedData); // Update the state
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                ),
                width: 150,
            },

            {
                title: 'Out Time',
                dataIndex: 'outTime',
                render: (text: any) =>
                    text
                        ? dayjs(text, 'YYYY-MM-DDHH:mm:ss').format('YYYY-MM-DD HH:mm:ss') // Parse and format the text
                        : '-',
                width: 150,
            },

            {
                title: 'New Out Time',
                dataIndex: 'newOutTime',
                render: (text: string | null, record: any) => (
                    <DatePicker
                        value={text ? dayjs(text) : null} // Use the Date object to initialize the DatePicker
                        format="YYYY-MM-DD HH:mm" // Display format
                        showTime // Enable time selection
                        onChange={(momentObj) => {
                            if (momentObj) {
                                // Update the row data with the selected Date object
                                const updatedData = data.map((item) =>
                                    item.attendanceId === record.attendanceId
                                        ? { ...item, newOutTime: momentObj.toDate() } // Store as a Date object
                                        : item
                                );
                                setData(updatedData); // Update the state
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                ),
                width: 150,
            },
            {
                title: 'Reason',
                dataIndex: 'reason',
                render: (text: string | null, record: any) => (
                    <Input />
                ),
                width: 150,
            },
        ];
        return dynamicColumns;
    };

    // Disable future dates in RangePicker
    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    // Reset the form and state
    const handleReset = () => {
        const currentBranch = form.getFieldValue('branches'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })
        setData([]);
        setShowColumns(false);
        setSelectedRowKeys([]);
    };

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
            .addSheet('attendance-adjustment-bulk-apply-report')
            .addColumns(attendance)
            .addDataSource(data, { str2num: true })
            .saveAs('attendance-adjustment-bulk-apply-report.xlsx');
    }

    return (
        <Card extra={data.length > 0 ? (

            <>
                <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
            </>
        ) : (<></>)}>
            <Form layout='vertical' form={form}>
                <Row gutter={24}>
                    {/* Branch Selection */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item
                            label="Branch"
                            name="branches"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch',
                                },
                            ]}
                        >
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

                    {/* Date Range Picker */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Date" name="attendanceDate">
                            <RangePicker disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Division"
                                optionFilterProp="children"
                                dropdownMatchSelectWidth={false}
                            >
                                {divisions.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* Employee Name Selection */}

                    {/* Division Selection */}


                    {/* Department Selection */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Department" name="department">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Department"
                                optionFilterProp="children"
                                dropdownMatchSelectWidth={false}
                            >
                                {departments.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Designation Selection */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Designation" name="designation">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Designation"
                                optionFilterProp="children"
                                dropdownMatchSelectWidth={false}
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
                            <Select
                                showSearch
                                allowClear
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                placeholder="Select Employee Name"
                            >
                                {employees.map((rec: any) => (
                                    <Option value={rec.employeeId} key={rec.employeeId}>
                                        {rec.employeeName} -{rec.employeeCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>


                    {/* Get Data Button */}
                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                        <Button type="primary" onClick={getAllAttendance}>
                            Get Data
                        </Button>
                    </Col>

                    {/* Reset Button */}
                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button
                            icon={<UndoOutlined />}
                            onClick={handleReset}
                            type='dashed'
                            danger
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>

            {selectedRowKeys.length > 0 && (
                <Row style={{ marginTop: "16px" }}>
                    <Col xs={24} sm={12} md={8} lg={2} xl={2}>
                        <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(PropsScopes, ScopesEnum.Create)} onClick={saveAttendanceAdjustments}>
                            Update
                        </Button>
                    </Col>
                </Row>
            )}

            {/* Attendance Table */}
            {showColumns && (
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: handleRowSelectionChange,
                    }}
                    columns={generateColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        onChange: (page) => setPage(page),
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    scroll={{ x: 'max-content' }}
                    rowKey="attendanceId"
                    bordered
                />
            )}
        </Card>
    );
}

export default AttendanceAdjustmentForBulk;
