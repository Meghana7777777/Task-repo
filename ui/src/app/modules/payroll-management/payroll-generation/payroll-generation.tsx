import { BranchMonthReq, EmpDataReq } from '@hrexpert/shared-models';
import { BranchesMappingSharedService, BranchesService, DivisionService, EmployeeTypeService, LeaveAllocationService, PayrollAttendanceSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Typography } from 'antd';
import Table, { ColumnsType, ColumnType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';
import { useNavigate } from 'react-router-dom';
import PayrollProcessedLogReport from '../payroll-reports/payroll-processed-log-report';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const PayrollGeneration = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const [isGenerateEnabled, setIsGenerateEnabled] = useState<boolean>(false);
    const [divisions, setDivisions] = useState<any>([]);
    const [employeeType, setEmployeeType] = useState<any>([]);
    const service = new PayrollAttendanceSharedService();
    const branchesService = new BranchesService();
    const divisionService = new DivisionService();
    const employeeTypeService = new EmployeeTypeService();
    const leaveAllocationService = new LeaveAllocationService();
    const [employees, setEmployees] = useState<any>([]);
    const Option = Select
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPayrollProcessedLogModalVisible, setIsPayrollProcessedLogModalVisible] = useState(false);
    const [pendingData, setPendingData] = useState<any>([])
    const payrollRecordsService = new PayrollRecordsSharedService();
    const [branchesMappingData, setBranchesMappingData] = useState([]);
    const branchesMappingService = new BranchesMappingSharedService()
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [filteredDivisions, setFilteredDivisions] = useState<{ id: number; divisionName: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getBranches();
        getAllDivision();
        getAllEmployeeTypes()
        getBranchMapping();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branch: "ALL" })
        } else {
            form.setFieldsValue({ branch: IAMClientAuthContext.user.unitId })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            // getAllActiveEmpDropDown(undefined)
        }
        else {
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        }
    }, []);

    const getAllAttendance = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            if (!values.payrollMonth) {
                message.warning('Please select a payroll month!');
                return;
            }
            const formattedMonth = values.payrollMonth.format('YYYYMM');
            const req = new BranchMonthReq(values.branch, formattedMonth, values.divisionId, values.employeeType, values.employeeName);
            if (IAMClientAuthContext.user.roles === "SuperAdmin" && values.branch === "ALL") {
                req.branchId = null;
            } else {
                req.branchId = values.branch;
            }
            setLoading(true);
            req.employeeId = values.employeeName
            const res = await service.getPayRollAttendance(req);
            if (res.status) {
                setData(res.data || []);
                setShowColumns(true);
                setIsGenerateEnabled(true);
            } else {
                message.error(res.internalMessage || 'Failed to fetch attendance data.');
                setData([]);
                setShowColumns(false);
            }
        } catch (err) {
            console.error('Error:', err);
            message.error(err.message || err);
            setData([]);
            setShowColumns(false);
            setIsGenerateEnabled(false);
        } finally {
            setLoading(false);
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

    const getBranchMapping = () => {
        try {
            branchesMappingService.getBranchMapping().then((res) => {
                if (res.status) {
                    setBranchesMappingData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId: number) => {
        setSelectedBranch(branchId);
        // console.log(branchesMappingData);
        getAllActiveEmpDropDown(branchId);
        const uniqueDivisions = Array.from(
            new Map(
                branchesMappingData
                    .filter(branch => branch.branchId === branchId)
                    .map(branch => [branch.divisionId, { id: branch.divisionId, divisionName: branch.divisionName }])
            ).values()
        );

        setFilteredDivisions(uniqueDivisions);
    };

    const getBranches = async () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data);
            } else {
                message.error(res.internalMessage || 'Failed to fetch branches.');
            }
        }).catch((err) => {
            console.error('Error:', err);
            message.error('An error occurred while fetching branches.');
        });
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

    const getAllEmployeeTypes = () => {
        employeeTypeService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeType(res.data)
            } else {
                setEmployeeType('No Data Found')
            }
        })
    };

    const getAllActiveEmpDropDown = async (branchId) => {

        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const generateColumns = () => {
        const dynamicColumns: ColumnsType<any> = [
            {
                title: 'S No',
                render: (text: any, object: any, index: number) => index + 1,
                align: 'center',
            },
            {
                title: 'Branch',
                dataIndex: 'branch',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("branch", 'Branch'),
            },
            {
                title: 'Division',
                dataIndex: 'division',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("division", 'Division'),
            },
            {
                title: 'Employee Type',
                dataIndex: 'employeeType',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("employeeType", 'Employee Type'),
            },
            {
                title: 'Employee Name',
                dataIndex: 'empName',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("empName", 'Employee Name'),
            },
            {
                title: 'Employee Code',
                dataIndex: 'empCode',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("empCode", 'Employee Code'),
            },
            {
                title: 'Present',
                dataIndex: 'present_count',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("present_count", 'Present Count'),

            },
            {
                title: 'Absent',
                dataIndex: 'lop_data',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("lop_data", 'Absent Count'),
            },
            {
                title: 'Leaves',
                dataIndex: 'leave_count',
                render: (text) => (text ? text : '-'),
                ...getColumnSearchProps("leave_count", 'Leave Count'),
            },
            {
                title: 'CO ',
                dataIndex: 'co_count',
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'OD ',
                dataIndex: 'od_count',
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Week Off',
                dataIndex: 'wo_count',
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Week Presents',
                dataIndex: 'wp_count',
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Holidays',
                dataIndex: 'holiday_count',
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Holiday Presents',
                dataIndex: 'hp_count',
                render: (text) => (text ? text : '-'),
            },
            {
                title: 'Pay Days',
                dataIndex: 'pay_days',
                fixed: 'right',
                // sorter: (a, b) => a.pay_days.localeCompare(b.pay_days),
                // sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("pay_days", 'Pay Days'),
            },
            {
                title: 'Allowance Days',
                dataIndex: 'allowance_days',
                render: (text) => (text ? text : '-'),
                fixed: 'right'
            },
        ];
        return dynamicColumns;
    };

    const getAllPayrollRecordsData = (values) => {
        try {
            setLoading(true);
            const employeeIds = data.map(item => item.employee_id);
            const req = { employee_ids: employeeIds, status: "PENDING" };
            payrollRecordsService.getAllPayrollRecordsData(req)
                .then((res) => {
                    setLoading(false);
                    if (res.status) {
                        if (res.data.length > 0) {
                            setPendingData(res.data);
                            setIsModalVisible(true);
                        } else {
                            setIsModalVisible(false);
                            handleSave({
                                payrollMonth: form.getFieldValue('payrollMonth'),
                                branch: form.getFieldValue('branch'),
                                divisionId: form.getFieldValue('divisionId'),
                                employeeType: form.getFieldValue('employeeType'),
                                employeeName: form.getFieldValue('employeeName')
                            });
                        }
                    } else {
                        console.log("Failed response:", res);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.error("Error fetching payroll records:", err);
                });

        } catch (err) {
            console.error("Error in getAllPayrollRecordsData::::", err);
        }
    };

    const handleSave = (values) => {
        // console.log(values, 'values');
        const formattedMonth = values.payrollMonth.format('YYYYMM'); // Format as YYYYMM
        const req = new BranchMonthReq(values.branch, formattedMonth, values.divisionId, values.employeeType, values.employeeName);
        // console.log(req, 'req')
        service.generatePayroll(req)
            .then((res) => {
                if (res.status) {
                    // navigate('/payroll-processed-log-report')
                    setIsPayrollProcessedLogModalVisible(true)
                    handleCancel()
                    message.success('Payroll generated successfully!');
                } else {
                    message.error(res.internalMessage || 'Failed to generate payroll.');
                }
            })
            .catch((err) => {
                message.error('An error occurred while generating payroll.');
                console.error('Error:', err);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePayrollProcessedLogCancel = () => {
        setIsPayrollProcessedLogModalVisible(false);
    };

    const pendingColumns: any = [
        {
            title: "Sno",
            key: "sno",
            render: (text: any, object: any, index: number) => index + 1,
        },
        {
            title: "Employee ID",
            dataIndex: "employeeId",
            key: "employeeId",
            align: "center",
        },
        {
            title: "Name",
            dataIndex: "employeeName",
            key: "employeeName",
            align: "center",
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
            key: "employeeCode",
            align: "center",
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            key: "departmentName",
            align: "center",
        },
        {
            title: "Branch",
            dataIndex: "branchName",
            key: "branchName",
            align: "center",
        },
        {
            title: "Designation",
            dataIndex: "designationName",
            key: "designationName",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            key: "status",
            render: (text: string) => <span style={{ color: "red" }}>{text}</span>,
        },
    ];

    return (
        <Card title={<span>Employees Payroll Generation</span>}>
            <Form form={form} layout="vertical" onFinish={getAllAttendance}>
                <Row gutter={[24, 4]}>
                    <Col span={4}>
                        <Form.Item
                            name="branch"
                            label="Branch"
                            rules={[{ required: true, message: 'Please select a branch!' }]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select a Branch"
                                filterOption={(input, option) =>
                                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleBranchChange}
                                options={branchesMappingData
                                    .reduce((acc, branch) => {
                                        if (!acc.some((b) => b.value === branch.branchId)) {
                                            acc.push({ label: branch.branchName, value: branch.branchId });
                                        }
                                        return acc;
                                    }, [] as { label: string; value: number }[])
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="payrollMonth"
                            label="Payroll Month"
                            rules={[{ required: true, message: 'Please select a Payroll month!' }]}
                        >
                            <DatePicker picker="month" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Division" name="divisionId"
                            rules={[{ required: true, message: 'Please select a Division!' }]}>
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Division"
                                optionFilterProp="children"
                                mode='multiple'
                            >
                                {filteredDivisions.map((rec) => (
                                    <Select.Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Employee Type" name="employeeType">
                            <Select showSearch allowClear placeholder="Select Employee Type" optionFilterProp="children" >
                                {employeeType.map((rec: any) => (
                                    <Select.Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees?.map((emp: any) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col style={{ marginTop: '23px' }}>
                        <Button
                            type="primary"
                            onClick={getAllAttendance}
                            htmlType='submit'
                            variant="outlined" color="primary"
                        >
                            Submit
                        </Button>
                    </Col>
                    <Col style={{ marginTop: '23px' }}>
                        <Form.Item>
                            <Button type="primary" onClick={getAllPayrollRecordsData} disabled={!isGenerateEnabled}>
                                Generate
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Modal
                    open={isModalVisible}
                    width={800}
                    footer={[
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="proceed" type="primary" onClick={() => form.submit()}>
                            Proceed
                        </Button>,
                    ]}
                >
                    <Typography.Title level={5}>Payroll Pending Employee</Typography.Title>
                    <Table
                        columns={pendingColumns}
                        dataSource={pendingData.map((item) => ({
                            ...item,
                            key: item.id,
                        }))}
                        pagination={false}
                    />
                </Modal>
                <Modal
                    open={isPayrollProcessedLogModalVisible}
                    title="Payroll Processed Log Report"
                    width={1600}
                    footer={null}
                    onCancel={handlePayrollProcessedLogCancel}
                >
                    <PayrollProcessedLogReport branchId={form.getFieldValue('branch')} payrollMonth={form.getFieldValue('payrollMonth')} employeeTypeId={form.getFieldValue('employeeType')} divisionId={form.getFieldValue('divisionId')} />
                </Modal>

            </Form>
            {showColumns && (
                <Table
                    columns={generateColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: true }}
                    rowKey="id"
                    bordered
                />
            )}
        </Card>
    );
};

export default PayrollGeneration;
