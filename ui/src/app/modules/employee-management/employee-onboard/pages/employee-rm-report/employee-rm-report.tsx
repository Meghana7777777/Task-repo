import { CheckOutlined, ManOutlined, SearchOutlined, UndoOutlined, WomanOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeFilterReq, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, message, Row, Select, Space, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { SequenceUtils } from '../../../../../common/utils';
import Highlighter from 'react-highlight-words';
import { Excel } from 'antd-table-saveas-excel';
interface EmployeeRMUpdateProps {
    scopes: ScopesEnum[]
}

const EmployeeRMUnAssignedReport = (props: EmployeeRMUpdateProps) => {
    const { scopes } = props
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const service = new EmployeeOnboardingService();
    const [data, setData] = useState<any>([]);
    const [filteredData, setFilteredData] = useState<any>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [form] = Form.useForm();
    const [uniqueReportingManagers, setUniqueReportingManagers] = useState<any>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedManager, setSelectedManager] = useState<string | undefined>(undefined);
    const [divisions, setDivisions] = useState<any>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [designations, setDesignations] = useState<any>([]);
    const [empData, setEmpData] = useState<any[]>([])
    const { Option } = Select
    const brService = new BranchesService()
    const [branches, setBranches] = useState<any>([]);
    const { IAMClientAuthContext } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const divisionService = new DivisionService()
    const departmentService = new DepartmentService()
    const designationsService = new DesignationsService()

    useEffect(() => {
        // const branchId = IAMClientAuthContext.user.unitId;
        getAllEmployee();
        // getActiveEmployeeList();
        // getAssignedReportingManagers();
        getAllBranches();
        getAllDivision();
        getAllDepartments();
        getDesignations();
        // if (IAMClientAuthContext.user.roles === "SuperAdmin") {
        //     form.setFieldsValue({ branches: "ALL" })
        // } else {
        //     form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
        // }
    }, [/*IAMClientAuthContext.user.unitId*/]);

    const getAllEmployee = async () => {
        // setLoading(true);
        const req = new EmployeeFilterReq();
        const formValues = form.getFieldsValue();
        if (formValues.branchId) {
            req.branchId = formValues.branchId === 'All' ? 0 : formValues.branchId;
        }
        if (formValues.divisionName && formValues.divisionName) {
            req.divisionName = formValues.divisionName;
        }
        if (formValues.department && formValues.department) {
            req.departmentId = formValues.department;
        }
        if (formValues.designation && formValues.designation) {
            req.designationId = formValues.designation;
        }

        req.reportingManager = 0
        try {
            service.getAllEmployeesData(req).then((res) => {
                if (res.status) {
                    setData(res.data);
                    setFilteredData(res.data);
                    res.data.find((rec) => rec.branchId === IAMClientAuthContext.user.unitId)
                    setEmpData(res.data)
                    const uniqueManagers = Array.from(new Map(res.data.map((rec: any) => [rec.reportingManagerName, rec])).values());
                    setUniqueReportingManagers(uniqueManagers);
                } else {
                    message.error('Failed to fetch employee data');
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };
    const getAllDivision = () => {
        divisionService.getAllDivision().then((res) => {
            if (res.status) {
                setDivisions(res.data)
            } else {
                setDivisions('No Data Found')
            }
        })
    }
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
                setDesignations(res.data)
            } else {
                setDesignations('No Data Found')
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



    const columns: ColumnsType<any> = [

        {
            title: 'S.No',
            key: 'sno',
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            ...getColumnSearchProps("employeeCode"),
        },
        {
            title: 'Employee Name',
            dataIndex: 'fullName',
            ...getColumnSearchProps("fullName"),
        },

        {
            title: 'Branch',
            dataIndex: 'branchName',
            ...getColumnSearchProps("branchName"),
        },
        {
            title: 'Division',
            dataIndex: 'divisionName',
            ...getColumnSearchProps("divisionName"),
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            ...getColumnSearchProps("departmentName"),
        },
        {
            title: 'Designation',
            dataIndex: 'designationName',
            ...getColumnSearchProps("designationName"),
        },

        {
            title: 'Mobile Number',
            dataIndex: 'mobileNo',
            ...getColumnSearchProps("mobileNo"),
        },
        {
            title: 'Reporting Manager',
            dataIndex: 'reportingManagerName',
            width: 120,
            render: (text: any, record: any) => { return record.reportingManagerName ? record.reportingManagerName : '-' }
        },
        // {
        //     title: 'Date of Birth',
        //     render: (v, obj) => dayjs(obj.dateOfBirth).format('DD/MM/YYYY'),
        //     ...getColumnSearchProps("dateOfBirth"),
        // },
        {
            title: 'Gender',
            dataIndex: 'gender',
            ...getColumnSearchProps("gender"),
            align: 'center',
            render: (v, obj) => {
                if (obj.gender === 'M') {
                    return <Tag icon={<ManOutlined />} color="cyan">Male</Tag>;
                }
                if (obj.gender === 'F') {
                    return <Tag icon={<WomanOutlined />} color="magenta">Female</Tag>;
                }
                return <Tag color="red">Others</Tag>;
            },
        },
        // {
        //     title: 'Reporting Manager',
        //     dataIndex: 'reportingManagerName',
        //     ...getColumnSearchProps("reportingManagerName"),
        // },
    ];

    const exceldata = [
        { title: 'Employee Name', dataIndex: 'fullName', width: 120, render: (text: any, record: any) => { return record.fullName ? record.fullName : '-' } },
        { title: 'Employee Code', dataIndex: 'employeeCode', width: 120, render: (text: any, record: any) => { return record.employeeCode ? record.employeeCode : '-' } },
        { title: 'Branch', dataIndex: 'branchName', width: 120, render: (text: any, record: any) => { return record.branchName ? record.branchName : '-' } },
        { title: 'Department', dataIndex: 'departmentName', width: 120, render: (text: any, record: any) => { return record.departmentName ? record.departmentName : '-' } },
        { title: 'Designation', dataIndex: 'designationName', width: 120, render: (text: any, record: any) => { return record.designationName ? record.designationName : '-' } },
        { title: 'Mobile Number', dataIndex: 'mobileNo', width: 120, render: (text: any, record: any) => { return record.mobileNo ? record.mobileNo : '-' } },
        { title: 'Date of Birth', dataIndex: 'dateOfBirth', width: 120, render: (text: any, record: any) => { return record.dateOfBirth ? dayjs(record.dateOfBirth).format('YYYY-MM-DD') : '-' } },
        { title: 'Gender', dataIndex: 'gender', width: 120, render: (text: any, record: any) => { return record.gender ? record.gender : '-' } },
        { title: 'Reporting Manager', dataIndex: 'reportingManagerName', width: 120, render: (text: any, record: any) => { return record.reportingManagerName ? record.reportingManagerName : '-' } },
    ];

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet('Excel Master')
            .addColumns(exceldata)
            .addDataSource(data, { str2num: false })
            .saveAs('employees_RMs Data.xlsx');
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            setSelectedRowKeys(keys); // Update selected row keys on individual row selection
        },
        onSelect: (record: any, selected: boolean) => {
            const newSelectedKeys = selected
                ? [...selectedRowKeys, record.id] // Add the record id if selected
                : selectedRowKeys.filter((key) => key !== record.id); // Remove the record id if deselected

            setSelectedRowKeys(newSelectedKeys);
        },
        onSelectAll: (selected: boolean, selectedRows: any[]) => {
            if (selected) {
                // Select all rows across all pages
                const allSelectedKeys = filteredData.map((row) => row.id);
                setSelectedRowKeys(allSelectedKeys); // Update selected row keys with all rows' ids
            } else {
                // Deselect all rows across all pages
                setSelectedRowKeys([]); // Clear selected row keys
            }
        },
        getCheckboxProps: (record: any) => ({
            disabled: false, // Enable checkbox
        }),
    };



    const onReset = () => {
        form.resetFields();
        const branchId = IAMClientAuthContext.user.unitId;
        getAllEmployee();
        setFilteredData(data);
        setSelectedRowKeys([])
        setSelectedEmployee(undefined);
        setSelectedManager(undefined);
    };

    const getAllBranches = async () => {
        const res = await brService.getAllBranches();
        if (res.status) {
            setBranches(res.data);
        }
        else {
            console.error("failed to fetch");
        }
    };

    return (
        <PageContainer title="RM Un assigned Employees" breadcrumbRender={false}>
            <Form layout="vertical" form={form}>
                <Row gutter={[24, 6]}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name="branchId" label="Branch" initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : IAMClientAuthContext.user.unitId}>
                            <Select placeholder="Select Branch" disabled={role === 'SuperAdmin' ? false : true} showSearch allowClear onChange={getAllEmployee} optionFilterProp="children" >
                                {branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false} onChange={getAllEmployee}>
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
                            <Select showSearch allowClear placeholder="Select Department" optionFilterProp="children" dropdownMatchSelectWidth={false} onChange={getAllEmployee}>
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
                            <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children" dropdownMatchSelectWidth={false} onChange={getAllEmployee}>
                                {designations.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>


                        <Button
                            type="dashed"
                            danger
                            icon={<UndoOutlined />}
                            onClick={onReset}
                            style={{ marginTop: '23px', marginLeft: '8px' }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            onClick={exportExcel}
                            style={{ backgroundColor: "#06b844", color: "white", marginLeft: '8px' }}

                        >
                            Export Excel
                        </Button>
                    </Col>
                </Row>
            </Form>
            <br />
            <div style={{ position: 'relative' }}>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    // loading={loading}
                    bordered
                    size="small"
                    rowSelection={selectedManager ? rowSelection : undefined}
                    pagination={{
                        pageSize: 20,
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize)
                        },
                        position: ['topRight'],
                        onShowSizeChange(current, size) {
                            const totalPages = Math.ceil(filteredData.length / size);
                        },
                        total: filteredData.length,
                        showSizeChanger: true,
                    }}
                    rowKey="id"
                />
            </div>
        </PageContainer>
    );
};

export default EmployeeRMUnAssignedReport;
