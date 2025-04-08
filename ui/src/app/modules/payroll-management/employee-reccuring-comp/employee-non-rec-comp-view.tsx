import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { EmpDataReq, EmpNonRecurringRequest } from "@hrexpert/shared-models";
import { BranchesService, DivisionService, LeaveAllocationService, PayrollRecordsSharedService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Tabs } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../common/iam-client-react';
import { useNavigate } from "react-router-dom";

const EmpPayableNonRecCompView = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const branchesService = new BranchesService();
    const { Option } = Select
    const divisionService = new DivisionService()
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const service = new PayrollRecordsSharedService()
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const navigate = useNavigate()

    useEffect(() => {
        getBranches();
        getAllDivision();
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

    const getEmpNonRecurring = () => {
        const req = new EmpNonRecurringRequest()
        const formValues = form.getFieldsValue();
        console.log(formValues, 'formValues')
        if (formValues.startDate) {
            req.startDate = formValues.startDate.format('YYYYMM');
        }
        if (formValues.branch) {
            req.branches = formValues.branch
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId
        }
        if (formValues.employeeName) {
            req.payRollEmployee = formValues.employeeName
        }
        console.log(req, 'RRRRRR')
        service.getEmpNonRecurring(req).then(res => {
            if (res.status) {
                setData(res.data)
            } else {
                message.info('No Data Found')
                setData([])
            }
        })
    }
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

    const getAllActiveEmpDropDown = async (branchId) => {
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
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
    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Employee Name",
            dataIndex: "employeeName",
            align: "center",
            ...getColumnSearchProps("employeeName", 'Employee Name'),
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
            align: "center",
            sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeCode", 'Employee Code'),
        },
        {
            title: "Branch Name",
            dataIndex: "branchName",
            align: "center",
            ...getColumnSearchProps("branchName", 'Branch Name'),
        }, {
            title: "Division Name",
            dataIndex: "divisionName",
            align: "center",
            ...getColumnSearchProps("divisionName", 'Division Name'),
        },
        {
            title: "Component Name",
            dataIndex: "componentName",
            align: "center",
            ...getColumnSearchProps("componentName", 'Component Name'),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            align: "center",
            render: (text) => (text ? text : "-")
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            align: "center",
            render: (text) => (text ? text : "-")
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            align: "center",
            render: (text) => (text ? text : "-"),
            sorter: (a, b) => a.totalAmount.localeCompare(b.totalAmount),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("totalAmount", 'Total Amount'),
        },
        {
            title: "Emi Amount",
            dataIndex: "emiAmount",
            align: "center",
            render: (text) => (text ? text : "-"),
            sorter: (a, b) => (Number(a.emiCount) || 0) - (Number(b.emiCount) || 0), // Numeric sorting
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("emiAmount", 'Emi Amount'),
        },
        {
            title: "Emi Count",
            dataIndex: "emiCount",
            align: "center",
            render: (text) => (text ? text : "-"),
            sorter: (a, b) => (Number(a.emiCount) || 0) - (Number(b.emiCount) || 0),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("emiCount", 'Emi Count'),
        },
        {
            title: "Is Permanent",
            dataIndex: "isPermanent",
            align: "center",
            // filters: [
            //     { text: "Yes", value: 1 },
            //     { text: "No", value: 0 }
            // ],
            // onFilter: (value, record) => record.isPermanent === value, // Filtering logic
            render: (value) => {
                if (value === 1) return "Yes";
                if (value === 0) return "No";
                return "-";
            },
        },
    ];

    const onReset = () => {
        form.resetFields();
        setData([])
    }

    const handleViewNonRec = () => {
        navigate('/payroll-emp-recurring-component')
    }

    return (
        <PageContainer title='Employee Earning & Deduction Components' breadcrumbRender={false} extra={<Button key='1' onClick={handleViewNonRec} color="primary" variant="outlined" type='default'>Add</Button>}>
            <Form form={form} layout="vertical" onFinish={getEmpNonRecurring}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item
                            name="branch"
                            label="Branch"
                            rules={[{ required: true, message: 'Please select a branch!' }]}
                        >
                            <Select allowClear showSearch placeholder="Select a Branch"
                                filterOption={(input, option) =>
                                    (option?.children as any).toLowerCase().includes(input.toLowerCase())
                                }
                                disabled={role === 'SuperAdmin' ? false : true}
                                onChange={(value) => getAllActiveEmpDropDown(value)}
                            >
                                <Select.Option value={null}>All</Select.Option>
                                {branches.map((branch) => (
                                    <Select.Option key={branch.id} value={branch.id}>{branch.branchName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name='startDate' label={'Month'} rules={[{ required: true, message: 'Date is Required' }]}>
                            <DatePicker picker="month" style={{ width: '100%' }} format="YYYYMM" placeholder='Select Date' />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Division" name="divisionId" >
                            <Select mode='multiple' showSearch allowClear placeholder="Select Division" optionFilterProp="children" >
                                {divisions.map((rec: any) => (
                                    <Select.Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
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
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Button color="primary" variant="outlined" htmlType="submit">
                            Submit
                        </Button>&nbsp;&nbsp;
                        <Button color="danger" onClick={onReset} variant="outlined" style={{ marginTop: '25px' }}>
                            Reset
                        </Button>
                    </Col>
                </Row>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Is Permanent Yes" key="1">
                        <Table
                            columns={columns}
                            size="small"
                            bordered
                            dataSource={data.filter(item => item.isPermanent === 1)}
                            rowKey={(record) => record.empId}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Is Permanent No" key="2">
                        <Table
                            columns={columns}
                            size="small"
                            bordered
                            dataSource={data.filter(item => item.isPermanent === 0)}
                            rowKey={(record) => record.empId}
                        />
                    </Tabs.TabPane>
                </Tabs>

            </Form>
        </PageContainer >
    );

}
export default EmpPayableNonRecCompView