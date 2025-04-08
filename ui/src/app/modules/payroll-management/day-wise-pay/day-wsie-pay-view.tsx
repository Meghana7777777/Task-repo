import { PageContainer } from "@ant-design/pro-layout";
import { DayWisePayReq, EmpDataReq } from "@hrexpert/shared-models";
import { BranchesService, DayWisePaySharedService, DepartmentService, DivisionService, LeaveAllocationService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIAMClientState } from '../../../common/iam-client-react';
import { ColumnType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const DayWisePayExcelView = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const branchesService = new BranchesService();
    const { Option } = Select
    const divisionService = new DivisionService()
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const navigate = useNavigate()
    const dayWisePayService = new DayWisePaySharedService()
    const [departments, setDepartments] = useState<any>([]);
    const deptService = new DepartmentService()
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        getDivisions();
        getDepartments()
        getBranches();
        // if (IAMClientAuthContext.user.roles === "SuperAdmin") {
        //     form.setFieldsValue({ branch: "ALL" })
        // } else {
        //     form.setFieldsValue({ branch: IAMClientAuthContext.user.unitId })
        // }
        // if (IAMClientAuthContext.user.roles === "SuperAdmin") {
        // }
        // else {
        //     getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        // }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
            getAllActiveEmpDropDown(null)
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)

        }
    }, []);

    const getDayWiseData = () => {
        const req = new DayWisePayReq()
        const formValues = form.getFieldsValue();
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        if (formValues.payDate) {
            req.payDate = (formValues.payDate).format("DD-MM-YYYY")
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null; // "ALL" translates to null
        } else {
            req.branchId = formValues.branchId; // Send selected branch ID
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId
        }
        if (formValues.designationId) {
            req.designationId = formValues.designationId
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId
        }
        dayWisePayService.getDayWiseData(req).then(res => {
            if (res.status) {
                setData(res.data)
            } else {
                message.info('No Data Found')
                setData([])
            }
        })
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

    const getAllActiveEmpDropDown = async (branchId) => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branchId: null });
        } else if (branchId === null) {
            form.setFieldsValue({ branchId: "ALL" });
        } else if (branchId === '') {
            form.setFieldsValue({ branchId: "ALL" });
        } else {
            form.setFieldsValue({ branchId: branchId });
        }
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getDivisions = async () => {
        const res = await divisionService.getAllActiveDivisions();
        setDivisions(res.status ? res.data : []);
    };

    const getDepartments = async () => {
        const res = await deptService.getActiveDepartments();
        setDepartments(res.status ? res.data : []);
    };

    const columns: any = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center",
            width: "40px",
        },
        {
            title: "Employee Name",
            dataIndex: "employeeName",
            align: "center",
            width: "120px",
            ...getColumnSearchProps("employeeName", 'Employee Name'),
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
            align: "center",
            width: "90px",
            ...getColumnSearchProps("employeeCode", 'Employee Code'),
        },
        {
            title: "Branch",
            dataIndex: "branchName",
            align: "center",
            width: "80px",
            ...getColumnSearchProps("branchName", 'Branch'),
        },
        {
            title: "Division",
            dataIndex: "divisionName",
            align: "center",
            width: "80px",
            ...getColumnSearchProps("divisionName", 'Division'),
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            align: "center",
            width: "90px",
            ...getColumnSearchProps("departmentName", 'Department'),
        },
        {
            title: "Pay Date",
            dataIndex: "payDate",
            width: "70px",
            align: "center",
            ...getColumnSearchProps("payDate", 'Pay Date'),
        },
        {
            title: "Job Code",
            dataIndex: "jobCode",
            align: "center",
            width: "70px",
            ...getColumnSearchProps("jobCode", 'Job Code'),
        },
        {
            title: "Job Description",
            dataIndex: "jobDescription",
            width: "100px",
            align: "center",
            ...getColumnSearchProps("jobDescription", 'Job Description'),
        },
        {
            title: "Units",
            dataIndex: "units",
            align: "center",
            width: "50px",
            ...getColumnSearchProps("units", 'Units'),
        },
        {
            title: "Job Rate",
            dataIndex: "jobRate",
            align: "center",
            width: "50px",
            ...getColumnSearchProps("jobRate", 'Job Rate'),
        },
        {
            title: "Add Earn",
            dataIndex: "addEarn",
            align: "center",
            width: "50px"
        },
        {
            title: "Add Dedu",
            dataIndex: "addDedu",
            align: "center",
            width: "50px"
        },
        {
            title: "Emp Pay",
            dataIndex: "empPay",
            align: "center",
            width: "50px"
        }
    ];

    const handleNaviagte = () => {
        navigate('/day-wise-pay-upload')
    }

    const onReset = () => {
        form.resetFields();
        setData([])
    }

    const activeJobs = data.filter(item => item.jobStatus == 1);
    const inactiveJobs = data.filter(item => item.jobStatus == 0);

    return (
        <PageContainer title='Worker Day Wise Pay View' breadcrumbRender={false}
            extra={
                <Button type="primary" onClick={handleNaviagte} >Upload</Button>
            }>
            <Form form={form} layout="vertical" onFinish={getDayWiseData}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item
                            name="branchId"
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
                                <Option value={''}> ALL </Option>
                                {branches.map((branch) => (
                                    <Select.Option key={branch.id} value={branch.id}>{branch.branchName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={3}>
                        <Form.Item name='payDate' label={'Date'} rules={[{ required: true, message: 'Date is Required' }]}>
                            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder='Select Date' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={3}>
                        <Form.Item label='Division' name='divisionId'>
                            <Select placeholder='Select Division' allowClear showSearch
                                optionFilterProp="children"
                            >
                                {divisions?.map((rec: any) => {
                                    return <Option value={rec.divisionId} key={rec.divisionId}>{rec.divisionName}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={5}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees?.map((emp: any) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={3}>
                        <Form.Item label='Departments' name='departmentId'>
                            <Select placeholder='Select Departments' allowClear showSearch
                                optionFilterProp="children"
                            >
                                {departments?.map((res: any) => {
                                    return <Option key={res.deptId} value={res.deptId}>
                                        {res.deptName}
                                    </Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={2}>
                        <Button htmlType="submit" style={{ marginTop: "23px" }} color="primary" variant="outlined" >Submit</Button> &nbsp;
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={2}>
                        <Button color="danger" onClick={onReset} variant="outlined" style={{ marginTop: '23px' }}>Reset</Button>
                    </Col>
                </Row>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Active Jobs" key="1">
                        <Table
                            columns={columns}
                            dataSource={activeJobs}
                            bordered
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                },
                            }}
                            scroll={{ y: '500px' }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Not found Jobs" key="2">
                        <Table
                            columns={columns}
                            dataSource={inactiveJobs}
                            bordered
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                },
                            }}
                            scroll={{ y: '500px' }}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </PageContainer >
    );
}
export default DayWisePayExcelView