import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { OTBulkApprovalDtoReq, ShiftDto } from "@hrexpert/shared-models";
import { AttendanceServices, DepartmentService, EmployeeOnboardingService, ShiftService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

export default function OtApprovalReport() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [deptData, setDeptData] = useState<any[]>([])
    const [shiftsData, setShiftsData] = useState<any[]>([])
    const [empData, setEmpData] = useState<any[]>([])

    const { Option } = Select
    const attendanceService = new AttendanceServices()
    const shiftsService = new ShiftService()
    const deptService = new DepartmentService()
    const emService = new EmployeeOnboardingService()

    const [form] = Form.useForm();


    useEffect(() => {
        getAllDepartments()
        getAllShifts()
        getActiveEmployeeList()
    }, []);

    const getActiveEmployeeList = () => {
        emService.getActiveEmployeeList().then(res => {
            if (res.status) {
                setEmpData(res.data)
            } else {
                setEmpData([])
            }
        })
    }

    const getAllForBulkOTApproval = (req) => {
        attendanceService.getAllForBulkOTApproval(req).then(res => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
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
    const getAllShifts = () => {
        const req = new ShiftDto()
        const formValues = form.getFieldsValue();
        if (formValues.branchId) {
            req.branchId = formValues.branchId
        }
        shiftsService.getAllShifts(req).then(res => {
            if (res.status) {
                setShiftsData(res.data)
            } else {
                setShiftsData([])
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

    let i = 1;
    const otApproval = [
        { title: "Employee", dataIndex: "employee" },
        { title: 'Code', dataIndex: 'empCode' },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Shift', dataIndex: 'shiftType' },
        { title: 'Shift In Time', dataIndex: 'shiftIn' },
        { title: 'Shift Out Time', dataIndex: 'shiftOut' },
        { title: 'In Time', dataIndex: 'inTime' },
        { title: 'Out Time', dataIndex: 'outTime' },
        { title: 'Working Hours', dataIndex: 'workingHrs' },
        { title: 'Shift Hours', dataIndex: 'shiftDuration' },
        { title: 'OT Hours', dataIndex: 'otHours' },
        { title: 'OT Allowence/hr', dataIndex: '' },
        { title: 'Reason', dataIndex: 'reason' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            otApproval.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(data);
        excel
            .addSheet('ot-approval-report')
            .addColumns(otApproval)
            .addDataSource(processedData, { str2num: false })
            .saveAs('ot-approval-report.xlsx');
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
            dataIndex: 'employee',
            sorter: (a, b) => a.employee.localeCompare(b.employee),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employee"),
            align: "center",
        },
        {
            title: "Code",
            dataIndex: 'empCode',
            sorter: (a, b) => a.empCode.localeCompare(b.empCode),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("empCode"),
            align: "center",
        },
        {
            title: "Department",
            dataIndex: 'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("department"),
            align: "center",
        },
        {
            title: "Shift",
            dataIndex: 'shiftType',
            sorter: (a, b) => a.shiftType.localeCompare(b.shiftType),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftType"),
            align: "center",
        },
        {
            title: "Shift In Time",
            dataIndex: 'shiftIn',
            sorter: (a, b) => a.shiftIn.localeCompare(b.shiftIn),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftIn"),
            align: "center",
        },
        {
            title: "Shift Out Time",
            dataIndex: 'shiftOut',
            sorter: (a, b) => a.shiftOut.localeCompare(b.shiftOut),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftOut"),
            align: "center",
        },
        {
            title: "In Time",
            dataIndex: 'inTime',
            sorter: (a, b) => a.inTime.localeCompare(b.inTime),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("inTime"),
            align: "center",
        },
        {
            title: "Out Time",
            dataIndex: 'outTime',
            sorter: (a, b) => a.outTime.localeCompare(b.outTime),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("outTime"),
            align: "center",
        },
        {
            title: "Working Hours",
            dataIndex: 'workingHrs',
            sorter: (a, b) => a.workingHrs.localeCompare(b.workingHrs),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("workingHrs"),
            align: "center",
        },
        {
            title: "Shift Hours",
            dataIndex: 'shiftDuration',
            sorter: (a, b) => a.shiftDuration.localeCompare(b.shiftDuration),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftDuration"),
            align: "center",
        },

        {
            title: 'OT Hours',
            dataIndex: 'otHours',
            sorter: (a, b) => a.otHours.localeCompare(b.otHours),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("otHours"),
            align: "center",
        },
        {
            title: 'OT Allowence/hr',
            // dataIndex:'otHours',
            // sorter: (a, b) => a.otHours.localeCompare(b.otHours),
            // sortDirections: ['ascend', 'descend'],
            // ...getColumnSearchProps("otHours"),
            align: "center",
        },
        {
            title: "Reason",
            dataIndex: "reason",
            sorter: (a, b) => a.reason.localeCompare(b.reason),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("reason"),
            align: "center",
        },
        {
            title: "Ot Status",
            dataIndex: "otStatus",
            sorter: (a, b) => a.otStatus.localeCompare(b.otStatus),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("otStatus"),
            align: "center",
            render: (_, record) => {
                return <span>{record.otStatus === 1 ? 'Approved' : 'Not Approved'}</span>
            }
        },

    ];

    const getData = () => {
        const dept = form.getFieldValue('departmentId')
        const date = form.getFieldValue('date')
        const shift = form.getFieldValue('shiftId')
        const employeeId = form.getFieldValue('employeeId')
        if (date != undefined) {
            const req = new OTBulkApprovalDtoReq()
            req.date = dayjs(date).format('YYYY-MM-DD')
            req.shiftId = shift
            req.departmentId = dept
            req.employeeId = employeeId
            getAllForBulkOTApproval(req)

        } else {
            date ? '' : form.setFields([{ name: 'date', errors: ['Please Select Attendance Date'] },])
        }
    }

    const onReset = () => {
        form.resetFields()
        setData([])
    }
    return (
        <PageContainer title='OT' breadcrumbRender={false}
        >
            <Form form={form} onFinish={getData} layout="vertical">
                <Row gutter={24}>
                    <Col span={3} style={{ width: '100%' }}>
                        <Form.Item name={'date'} label={'Date'} rules={[{ required: true, message: 'Date is Required' }]}>
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name={'departmentId'} label={'Department'}>
                            <Select showSearch allowClear>
                                {deptData.map(dept => {
                                    return <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name={'shiftId'} label={'Shift Type'}>
                            <Select showSearch allowClear>
                                {shiftsData.map((shft) => {
                                    return <Option key={shft.id} value={shft.id}>{shft.shiftType}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name={'employeeId'} label={'Employee'}>
                            <Select showSearch allowClear>
                                {empData.map((emp) => {
                                    return <Option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ paddingTop: '23px' }}>
                        <Button onClick={getData} style={{ marginRight: '8px' }}>Get Data</Button>
                        <Button onClick={onReset} style={{ marginRight: '8px' }}>Reset</Button>
                        <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
                    </Col>

                </Row>
                <Table
                    columns={columns}
                    dataSource={data}
                    // loading={loading}
                    size="small"
                    rowKey={(record) => record.employeeId}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                    }}
                />
            </Form>
        </PageContainer>
    );
}
