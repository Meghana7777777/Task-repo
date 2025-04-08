import { FileExcelOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { EmpDataReq, LeavesAccumulationReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeTypeService, LeaveAllocationService, LeaveBalanceService, LeavePolicyService, LeaveTypeService, } from '@hrexpert/shared-services';
import { Badge, Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../common/iam-client-react';
import '../attendance-adjustment/attendance-info.css';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title } = Typography;
const { Option } = Select;

interface LeaveAllocationViewProps {
    scopes: ScopesEnum[];
}

const LeaveBalanceView = (props: LeaveAllocationViewProps) => {
    const { scopes } = props;
    const { IAMClientAuthContext } = useIAMClientState();
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<any[]>([]);
    const [empData, setEmpData] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editedRows, setEditedRows] = useState<any[]>([]);
    const [leaveGroup, setLeaveGroup] = useState<any[]>([]);
    const [branchCheckBox, setBranchCheckBox] = useState<boolean>(false);
    const [departmentCheckBox, setDepartmentCheckBox] = useState<boolean>(false);
    const [designationCheckBox, setDesignationCheckBox] = useState<boolean>(false);
    const [divisionCheckBox, setDivisionCheckBox] = useState<boolean>(false);
    const [empTypeCheckBox, setEmpTypeCheckBox] = useState<boolean>(false);
    const [employeeTypes, setEmployeeTypes] = useState([])

    const leaveAllocationService = new LeaveAllocationService();
    const leaveBalanceService = new LeaveBalanceService();
    const divisionService = new DivisionService();
    const deptService = new DepartmentService();
    const designService = new DesignationsService();
    const branchService = new BranchesService();
    const policyService = new LeavePolicyService();
    const leaveTypeService = new LeaveTypeService()
    const employeeTypesService = new EmployeeTypeService()


    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const branchRes = await branchService.getAllBranches();
                const divisionRes = await divisionService.getAllActiveDivisions();
                const deptRes = await deptService.getActiveDepartments();
                const designRes = await designService.getDesignations();
                const leaveGroupRes = await leaveTypeService.getAllActiveLeaveGroup()
                const empTypeRes = await employeeTypesService.getActiveEmployeeType()

                // Error handling for each service call
                if (!branchRes.status) {
                    message.error(`${branchRes.internalMessage || 'Unknown error'}`);
                }
                if (!divisionRes.status) {
                    message.error(`${divisionRes.internalMessage || 'Unknown error'}`);
                }
                if (!deptRes.status) {
                    message.error(`${deptRes.internalMessage || 'Unknown error'}`);
                }
                if (!designRes.status) {
                    message.error(`${designRes.internalMessage || 'Unknown error'}`);
                }
                if (!leaveGroupRes.status) {
                    message.error(`${leaveGroupRes.internalMessage || 'Unknown error'}`);
                }
                if (!empTypeRes.status) {
                    message.error(`${empTypeRes.internalMessage || 'Unknown error'}`);
                }

                setBranches(branchRes.status ? branchRes.data : []);
                setDivisions(divisionRes.status ? divisionRes.data : []);
                setDepartments(deptRes.status ? deptRes.data : []);
                setDesignations(designRes.status ? designRes.data : []);
                setLeaveGroup(leaveGroupRes.status ? leaveGroupRes.data : []);
                setEmployeeTypes(empTypeRes.status ? empTypeRes.data : []);

                if (IAMClientAuthContext.user.roles === 'SuperAdmin') {
                    // form.setFieldsValue({ branchId: 'ALL' });
                } else {
                    form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId });
                }

                if (IAMClientAuthContext.user.roles !== 'SuperAdmin') {
                    await getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId);
                }
            } catch (error) {
                console.error('Error in fetchInitialData:', error);
                message.error('Failed to load initial data. Please try again.');
            }
        };

        fetchInitialData();
    }, [IAMClientAuthContext.user.roles, IAMClientAuthContext.user.unitId, form]);


    const getAllActiveEmpDropDown = async (branchId) => {
        try {
            const formValues = form.getFieldsValue();
            const req = new EmpDataReq(formValues.employeeId, formValues.departmentId, formValues.designationId, null, formValues.divisionId, branchId === 'ALL' ? null : branchId);
            const res = await leaveAllocationService.getAllActiveEmpDropDown(req);

            if (!res?.status) {
                message.error(`Failed to load employee dropdown: ${res?.internalMessage || 'Unknown error'}`);
                setEmpData([]);
                return;
            }

            setEmpData(res.data || []);
        } catch (error) {
            console.error('Error in getAllActiveEmpDropDown:', error);
            message.error('Failed to load employee dropdown. Please try again.');
            setEmpData([]);
        }
    };

    const getEmpData = async () => {
        try {
            const formValues = form.getFieldsValue();

            if (!formValues.branchId) {
                message.warning('Please select a branch');
                return;
            }

            const req = new EmpDataReq(formValues.employeeId, null, null, null, null,
                formValues.branchId === 'ALL' ? null : formValues.branchId, formValues.leaveGroupId, formValues.employeeTypeId,
            );

            const res = await leaveBalanceService.getAllLeaveBalanceData(req);

            if (!res.status) {
                message.error(`${res.internalMessage || 'Unknown error'}`);
                setEmployees([]);
                return;
            }

            setEmployees(res.data || []);

            if (!res.data || res.data.length === 0) {
                message.info('No employee data found for the selected criteria');
            }
        } catch (error) {
            console.error('Error in getEmpData:', error);
            message.error('Failed to load employee data. Please try again.');
            setEmployees([]);
        }
    };

    const getBadgeColor = (available: number, total: number) => {
        const percentage = (available / total) * 100;

        if (percentage > 50) return "success";
        if (percentage > 20) return "warning";
        return "error";
    };


    const data = employees.flatMap((employee) =>
        employee.leaveTypes.map((leave, index) => ({
            key: `${employee.id}-${leave.type}`,
            serialNumber: index === 0 ? employees.indexOf(employee) + 1 : '',
            name: index === 0 ? employee.name : '',
            department: index === 0 ? employee.department : '',
            designation: index === 0 ? employee.designation : '',
            division: index === 0 ? employee.division : '',
            branchName: index === 0 ? employee.branchName : '',
            leaveAllocationId: leave.leaveAllocationId,
            type: leave.type,
            carryForward: leave.carryForward,
            monthAccumulation: leave.monthAccumulation,
            openingBalance: leave.openingBalance,
            utilized: leave.utilized,
            balance: leave.balance,
            rowSpan: index === 0 ? employee.leaveTypes.length : 0,
            employeeCode: index === 0 ? employee.employeeCode : '',
            employeeTypeName: index === 0 ? employee.employeeTypeName : '',
        }))
    );

    const onReset = () => {
        try {
            form.resetFields();
            setEmployees([])
            setSelectedRows([])
            setSelectedRowKeys([])
        } catch (error) {
            console.error('Error in onReset:', error);
            message.error('Failed to reset form. Please try again.');
        }
    };

    const LeavesAccumulation = async () => {
        try {
            const formValues = form.getFieldsValue();

            if (!formValues.branchId) {
                message.warning('Please select a branch');
                return;
            }

            if (!formValues.monthYear) {
                message.warning('Please select a branch');
                return;
            }

            const req = new LeavesAccumulationReq(null, null, null, null,
                formValues.branchId === 'ALL' ? null : formValues.branchId, formValues.leaveGroupId, formValues.employeeTypeId, formValues.monthYear
            );
            const res = await leaveBalanceService.leavesAccumlation(req);

            if (res.status) {
                message.success(res.internalMessage || 'Leaves accumulation successfully');
                setEmployees([])
            } else {
                message.error(res.internalMessage || 'Failed to accumulat leaves');
            }
        } catch (error) {
            console.error('Error in accumulateLeavesToEmp:', error);
            message.error('Failed to accumulat leaves. Please try again.');
        }
    };

    const updateLeavesAccumulation = async () => {
        try {
            const req = { rows: editedRows.filter((rec) => selectedRowKeys.includes(rec.leaveAllocationId)) }
            const res = await leaveBalanceService.updateLeavesBalance(req);

            if (res.status) {
                message.success(res.internalMessage || 'Leaves balance updated successfully');
                setEmployees([])
                setEditedRows([])
                setSelectedRowKeys([])
                setSelectedRows([])
                getEmpData()
            } else {
                message.error(res.internalMessage || 'Failed to updated leave balance');
            }
        } catch (error) {
            console.error('Error in updated :', error);
            message.error('Failed to updated leave balance. Please try again.');
        }
    };

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

    const handleTableValuesChange = (event: React.ChangeEvent<HTMLInputElement>, key: string, record: any) => {
        const value = event.target.value;
        const duplicateRecord = {
            "leaveAllocationId": record.leaveAllocationId,
            'carryForward': record.carryForward,
            'monthAccumulation': record.monthAccumulation,
            'openingBalance': record.openingBalance,
            'utilized': record.utilized,
            'balance': record.balance
        }

        setEditedRows((prevRows) => {
            const existingIndex = prevRows.findIndex(
                (row) => row.leaveAllocationId === record.leaveAllocationId
            );

            if (existingIndex !== -1) {
                return prevRows.map((row, index) =>
                    index === existingIndex ? { ...row, [key]: value } : row
                );
            } else {
                return [...prevRows, { ...duplicateRecord, [key]: value }];
            }
        });
    };

    const columns: any = [
        {
            title: 'S.No.',
            dataIndex: 'serialNumber',
            key: 'sno',
            render: (text, record) => ({
                children: text,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
        },
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            // sorter: (a, b) => a.name.localeCompare(b.name),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("name"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            // sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeCode"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
        },
        {
            title: 'Employee Type',
            dataIndex: 'employeeTypeName',
            key: 'employeeTypeName',
            width: 150,
            // sorter: (a, b) => a.employeeTypeName.localeCompare(b.employeeTypeName),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeTypeName"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            key: 'branchName',
            // sorter: (a, b) => a.branchName.localeCompare(b.branchName),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("branchName"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            hidden: branchCheckBox ? false : true
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("department"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            hidden: departmentCheckBox ? false : true
        },
        {
            title: 'Division',
            dataIndex: 'division',
            key: 'division',
            sorter: (a, b) => a.division.localeCompare(b.division),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("division"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            hidden: divisionCheckBox ? false : true
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            sorter: (a, b) => a.designation.localeCompare(b.designation),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("designation"),
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            hidden: designationCheckBox ? false : true
        },
        {
            title: 'Leave Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Carry Forward',
            dataIndex: 'carryForward',
            key: 'carryForward',
            align: 'right',
            render: (text: number | null, record: any) => {
                if (selectedRowKeys.includes(record.leaveAllocationId)) {
                    return <Input style={{width:'50px', height:'20px'}} defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
                        onChange={(e) => handleTableValuesChange(e, 'carryForward', record)} />
                }
                return text;
            },
        },
        {
            title: 'Accumulation',
            dataIndex: 'monthAccumulation',
            key: 'monthAccumulation',
            align: 'right',
            render: (text: number | null, record: any) => {
                if (selectedRowKeys.includes(record.leaveAllocationId)) {
                    return <Input style={{width:'50px', height:'20px'}} defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
                        onChange={(e) => handleTableValuesChange(e, 'monthAccumulation', record)} />
                }
                return text;
            },
        },
        {
            title: 'Opening Balance',
            dataIndex: 'openingBalance',
            key: 'openingBalance',
            align: 'right',
            render: (text: number | null, record: any) => {
                if (selectedRowKeys.includes(record.leaveAllocationId)) {
                    return <Input style={{width:'50px', height:'20px'}} defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
                        onChange={(e) => handleTableValuesChange(e, 'openingBalance', record)} />
                }
                return text;
            },
        },
        {
            title: 'Utilized',
            dataIndex: 'utilized',
            key: 'utilized',
            align: 'right',
            render: (text: number | null, record: any) => {
                if (selectedRowKeys.includes(record.leaveAllocationId)) {
                    return <Input style={{width:'50px', height:'20px'}} defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
                        onChange={(e) => handleTableValuesChange(e, 'utilized', record)} />
                }
                return text;
            },
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            render: (text: number | null, record: any) => {
                if (selectedRowKeys.includes(record.leaveAllocationId)) {
                    return <Input style={{width:'50px', height:'20px'}} defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
                        onChange={(e) => handleTableValuesChange(e, 'balance', record)} />
                }
                return text;
            },
        },
        {
            title: 'Status',
            dataIndex: 'balance',
            key: 'status',
            align: 'center',
            render: (balance, record) => {
                const availableNumber = Number(balance);
                const totalNumber = Number(record.openingBalance);
                if (availableNumber !== 0 && totalNumber !== 0) {
                    return <Badge status={getBadgeColor(availableNumber, totalNumber)} text={`${((availableNumber / totalNumber) * 100).toFixed(0)}%`} />;
                }
                return '-';
            },
        }

    ];

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: any[]) => {
            setSelectedRowKeys(keys)
            setSelectedRows(rows)
        },
    };



    const exportToExcel = (data, columns) => {
        const visibleColumns = columns.filter(col => col.title !== 'Status');
        const headers = visibleColumns.map(col => col.title);
        const rows = data.map(row => {
            return visibleColumns.map(col => row[col.dataIndex] || '');
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Report");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "Leave_Report.xlsx");
    };


    return (
        <Card
            title={'Leave Balance Information'}
        >
            <Form form={form} layout="vertical" onFinish={getEmpData}>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item label="Branch" name="branchId" >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                disabled={IAMClientAuthContext.user.roles === 'SuperAdmin' ? false : true}
                                optionFilterProp="children"
                                onChange={(value) => getAllActiveEmpDropDown(value)}
                            >
                                {/* <Option value="ALL">ALL</Option> */}
                                <Option value={'ALL'}> ALL </Option>
                                {branches.map((rec) => (
                                    <Option key={rec.id} value={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item label='Employee Type' name='employeeTypeId'>
                            <Select placeholder={'Select Employee Type'} >
                                {
                                    employeeTypes.map((v: any) => { return <Option key={v.id} value={v?.id}>{v?.name}</Option> })
                                }
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Leave Group" name="leaveGroupId" >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Leave Group"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                            >
                                {leaveGroup.map((rec) => (
                                    <Option key={rec.id} value={rec.id}>
                                     {rec.leaveGroupName} - {rec.leaveGroupCode}
                                     </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item label="Month" name="monthYear">
                            <DatePicker
                                picker="month"
                                style={{ width: '100%' }}
                                disabledDate={(current) => {
                                    const currentMonth = dayjs().startOf('month');
                                    const nextMonth = currentMonth.add(1, 'month');

                                    return current.isBefore(currentMonth) || current.isAfter(nextMonth);
                                }}
                            />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginBottom: '10px', marginTop: '10px' }}>
                    <Col>
                        <Button
                            icon={<SearchOutlined />}
                            type="primary"
                            onClick={getEmpData}
                        >
                            Search
                        </Button>
                    </Col>
                    <Col>
                        <Button icon={<RedoOutlined />} onClick={onReset} danger>
                            Reset
                        </Button>
                    </Col>
                    {selectedRowKeys.length > 0 ? <>
                        <Col>
                            <Button icon={<RedoOutlined />} onClick={updateLeavesAccumulation} type="primary">
                                Update Leave Balance
                            </Button>
                        </Col></> : <></>}

                    <Col>
                        <Button
                            icon={<RedoOutlined />}
                            type="primary"
                            onClick={LeavesAccumulation}
                        >
                            Process accumulation
                        </Button>
                    </Col>

                    {data.length > 0 ? <> <Col>
                        <Button icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportToExcel(data, columns)}>
                            Get Excel
                        </Button>
                    </Col></> : <></>}

                </Row>
            </Form>
            <br></br>

            {data.length > 0 ?
                <>
                    <Row gutter={16} style={{ marginBottom: '10px', justifyContent: 'flex-end' }}>
                        <Checkbox checked={branchCheckBox} onChange={() => branchCheckBox ? setBranchCheckBox(false) : setBranchCheckBox(true)} > Branch </Checkbox>
                        <Checkbox checked={departmentCheckBox} onChange={() => departmentCheckBox ? setDepartmentCheckBox(false) : setDepartmentCheckBox(true)}  > Departments </Checkbox>
                        <Checkbox checked={divisionCheckBox} onChange={() => divisionCheckBox ? setDivisionCheckBox(false) : setDivisionCheckBox(true)}  > Division </Checkbox>
                        <Checkbox checked={designationCheckBox} onChange={() => designationCheckBox ? setDesignationCheckBox(false) : setDesignationCheckBox(true)}  > Designation </Checkbox>
                    </Row>
                    <Table
                        className='small-table'
                        rowKey={(record) => record.leaveAllocationId}
                        rowSelection={rowSelection}
                        bordered
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100', '200'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        }}
                        onChange={handleTableChange}
                    /></> : <></>}

        </Card>
    );
};

export default LeaveBalanceView;