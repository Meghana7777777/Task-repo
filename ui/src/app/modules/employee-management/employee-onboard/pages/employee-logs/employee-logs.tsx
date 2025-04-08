import { PageContainer } from "@ant-design/pro-layout"
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeLogsService, EmployeeOnboardingService } from "@hrexpert/shared-services"
import { Button, Card, Col, Form, Input, Row, Select, Space, Table } from "antd"
import { ColumnProps, ColumnsType, ColumnType } from "antd/es/table"
import { useEffect, useRef, useState } from "react"
import './employee-logs.css'
import { SearchOutlined, UndoOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import form from "antd/es/form"
import React from "react"
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { BranchReq, EmpDataReq } from "@hrexpert/shared-models"

const EmployeeLogs = () => {

    const service = new EmployeeLogsService()
    const [logsData, setLogsData] = useState<any>([]);
    const searchInput = useRef(null);
    const [data, setData] = useState<any>([])
    const [form] = Form.useForm();
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = React.useState(1);
    const [pageSize] = useState(50);
    const [loading, setLoading] = useState(true);
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const employeeDetails = new EmployeeOnboardingService()
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [branch, setUniqueBranch] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const Option = Select


    useEffect(() => {

        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches();

        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            // handleBranchChange("ALL")
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

    const handleBranchChange = (branchId) => {
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

        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        }).catch((err) => {
            setEmployees([]);
        })
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

    // useEffect(() => {
    //     getAllEmployeeLogs()
    // }, [])

    const getAllEmployeeLogs = () => {

        const req = new EmpDataReq()
        const formValues = form.getFieldsValue();
        if (formValues.divisionName && formValues.divisionName) {
            req.divisionId = formValues.divisionName;
        }
        if (formValues.department && formValues.department) {
            req.departmentId = formValues.department;
        }
        if (formValues.designation && formValues.designation) {
            req.designationId = formValues.designation;
        }

        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branches === "ALL") {
            req.branchId = null; // "ALL" translates to null
        } else {
            req.branchId = formValues.branches; // Send selected branch ID
        }

        if (formValues.employeeName && formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        setLoading(true)
        try {
            service.getAllEmployeeLogs(req).then((res) => {
                if (res.status) {
                    setLogsData(res.data)
                    setShowColumns(true);
                    setLoading(false)
                } else {
                    setShowColumns(false);
                    setLogsData([])

                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<string> => ({
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

    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    const handleResets = () => {
        const currentBranch = form.getFieldValue('branches'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })
        getAllEmployeeLogs()

        setShowColumns(false);
        setData([]);
    }

    const generateColumns = () => {
        const columns: ColumnsType<any> = [
            {
                title: 'S No',
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: 'center',
            },
            {
                title: "Branch",
                dataIndex: 'branchName',
                ...getColumnSearchProps("branchName", "Branch"),

            },
            {
                title: "Employee Code",
                dataIndex: 'employeeCode',
                ...getColumnSearchProps("employeeCode", "Employee Code"),

            },
            {
                title: "Employee Type",
                dataIndex: 'employeeType',
                ...getColumnSearchProps("employeeType", "Employee Type"),

            },
            {
                title: "Employee Name",
                dataIndex: 'fullName',
                ...getColumnSearchProps("fullName", "Employee Name"),

            },
            {
                title: "Role",
                dataIndex: 'role',
                ...getColumnSearchProps("role", "Role"),

            },

            {
                title: "Action Type",
                dataIndex: 'actionType',
                ...getColumnSearchProps("actionType", "Action Type"),
            },


        ]
        return columns;
    }




    const expandedRowRender = (record) => {
        const empTypeColData: any = [{
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: "Previous Values",
            dataIndex: 'previousValues',
            // ...getColumnSearchProps("previousValues"),
            render: (text: any) => {
                const data = typeof text === 'string' ? JSON.parse(text) : text;
                return Object.keys(data).map((key: string) => (
                    <>
                        {key}: {data[key]} <br />
                    </>
                ));
            }
        },
        {
            title: "Updated Values",
            dataIndex: 'updatedValues',
            // ...getColumnSearchProps("updatedValues"),
            render: (text: any) => {
                const data = typeof text === 'string' ? JSON.parse(text) : text;
                return Object.keys(data).map((key: string) => (
                    <>
                        {key}: {data[key]} <br />
                    </>
                ));
            }
        },
        {
            title: "Created At",
            dataIndex: 'createdAt',
            // ...getColumnSearchProps("createdAt"),
            width: "100px",
            render: (_, rec) => (
                <>
                    {new Date(rec.createdAt).toLocaleDateString('en-GB')}
                    <br />
                    {new Date(rec.createdAt).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, })}
                </>
            ),
        },
        {
            title: "Remarks",
            dataIndex: 'remarks',
            // ...getColumnSearchProps("remarks"),
            render: (text: any) => {
                return text.split('||').map((remark: string, index: number) => (
                    <>{remark.trim()} <br /></>
                ));
            }
        }

        ];

        return (
            <Table
                bordered
                columns={empTypeColData}
                dataSource={record?.empTypeData?.map((empTypeData, index) => ({
                    ...empTypeData,
                    key: index,
                }))}
                pagination={false}
                components={{
                    header: {
                        cell: (props) => (
                            <th
                                {...props}
                                style={{
                                    padding: '8px',
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    background: '#f5f5f5',
                                }}
                            />
                        ),
                    },
                }}
            />
        );
    }

    return (
        // <PageContainer backIcon title={<span style={{ fontSize: '25px' }} >Employee Logs</span>} breadcrumbRender={false}>

        //     <Table columns={columns} dataSource={logsData} bordered />
        // </PageContainer>
        <PageContainer title="Employee Log">
            <Form layout='vertical' form={form} >
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
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.employeeName}- {rec.employeeCode}
                                    </Option>
                                ))}
                            </Select>
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

                    {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Designation" name="designation">
                            <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {designations.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}


                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                        <Button color="primary" variant="outlined" onClick={getAllEmployeeLogs}>
                            Submit
                        </Button>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={handleResets} type='dashed' danger> Reset </Button>
                    </Col>

                </Row>
            </Form>
            {showColumns && (
                <Table
                    columns={generateColumns()}
                    dataSource={logsData.map((item, index) => ({
                        ...item,
                        key: index,
                    }))}
                    expandable={{ expandedRowRender }}
                    loading={loading}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                    }}
                    scroll={{ x: true }}
                    rowKey="employeeId"
                    bordered
                />
            )}

        </PageContainer>
    )
}

export default EmployeeLogs