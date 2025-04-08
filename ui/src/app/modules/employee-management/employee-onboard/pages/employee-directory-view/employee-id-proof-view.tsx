import { CheckCircleOutlined, CloseCircleOutlined, FilterOutlined, IdcardOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { BranchReq, EmployeeDocDto, EmployeeDocModel } from '@hrexpert/shared-models';
import { BranchesService, configVariables, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService, IdProofService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, Form, Input, message, Row, Select, Space, Tag } from 'antd';
import Table, { ColumnsType, ColumnType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { PageContainer } from '@ant-design/pro-layout';

const EmployeeIdProofView = () => {
    const [form] = Form.useForm();
    const [Idform] = Form.useForm();
    const Option = Select
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [branch, setUniqueBranch] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const employeeDetails = new EmployeeOnboardingService()
    const idProofService = new IdProofService()
    const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
    const [idProofs, setIdProofs] = useState([])
    const docUrl = configVariables.ID_PROOF_UPLOAD_URL
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState<number>(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [pageSize, setPageSize] = useState<number>(1);


    useEffect(() => {
        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches();
        getIdProofs()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)

        }
    }, []);

    useEffect(() => {
        setUniqueBranch(Array.from(new Map(data.filter((rec: any) => rec.branches != null).map((rec: any) => [rec.branches, rec])).values()));
    }, [data]);

    const getIdProofs = () => {
        idProofService.getActiveIdProofs().then((idProofs) => {
            if (idProofs.status) {
                const x = { "id": 0, "name": "All" }
                setIdProofs([x, ...idProofs.data])
            }
        })
    }

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                    setBranches([]);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId: any) => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branches: null });
        } else if (branchId === null) {
            form.setFieldsValue({ branches: "ALL" });
        } else if (branchId === '') {
            form.setFieldsValue({ branches: "ALL" });
        } else {
            form.setFieldsValue({ branches: branchId });
        }
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


    const getAllEmployeeDocuments = () => {
        const req = new EmployeeDocDto();
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
        if (formValues.branches) {
            req.branch = formValues.branches === 'All' ? null : formValues.branches;
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName;
        }

        setLoading(true);

        try {
            employeeDetails.getEmployeeDocuments(req).then((res) => {
                if (res.status && res.data && res.data.length > 0) {
                    setData(res.data);
                    message.success("Employee documents retrieved successfully.");
                } else if (res.status && (!res.data || res.data.length === 0)) {
                    message.warning("No employee documents found.");
                    setData([]); // Clear data if no results
                } else {
                    message.error(res.internalMessage || "Failed to fetch employee documents.");
                    setData([]); // Clear data on failure
                }
            }).catch((error) => {
                console.error(error);
                message.error("An error occurred while fetching data.");
                setData([]);
            }).finally(() => {
                setLoading(false);
            });
        } catch (err) {
            console.error(err);
            message.error("An unexpected error occurred.");
            setData([]);
            setLoading(false);
        }
    };


    const handleFileOpen = (fileName: string) => {
        const fileUrl = docUrl + fileName;
        window.open(fileUrl, '_blank');
    };

    const Reset = () => {
        form.resetFields()
        // getAllEmployeeDocuments()
        // setFilteredEmployees([])
        setData([]);
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


    const SelectedOrderDataSource = (employeeDocModel: EmployeeDocModel[]) => {
        const empty = [];
        if (employeeDocModel) {
            employeeDocModel.forEach((item, index) => {
                if (item) {
                    const obj = {
                        employeeName: item.employeeName,
                        employeeCode: item.employeeCode,
                        employeeType: item.employeeType,
                        isActive: item.isActive,
                        all: item.fileData
                    };
                    empty.push(obj);
                }
            });
        }
        return empty;
    };

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: any[]) => {
            setSelectedRowKeys(keys)
            setSelectedRows(rows)
        },
    };

    const handleFileDownload = (fileName: string, empCode: string, doc: string) => {
        const fileUrl = docUrl + fileName;
        fetch(fileUrl)
            .then(response => {
                if (response.ok) {
                    response.blob().then(blob => {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `${empCode}_${doc}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                } else {
                    message.error('Failed to download the file');
                }
            })
            .catch(error => {
                console.error('Error while downloading the file:', error);
                message.error('An error occurred while downloading the file');
            });
    };

    const getBulkDownload = (id) => {
        if (id && typeof id === 'object' && id.id === 0) {
            for (const code of selectedRowKeys) {
                const empData = data.find((rec) => rec.employeeCode === code)
                empData.fileData.forEach((file) => {
                    handleFileDownload(file.fileName, empData.employeeCode, idProofs.find((rec) => rec.id === file.idType)?.name)
                })
            }
        } else {
            for (const code of selectedRowKeys) {
                const empData = data.find((rec) => rec.employeeCode === code)
                const filter = empData.fileData.filter((rec) => rec.idType === id.id);
                filter.forEach((file) => {
                    if (file) {
                        handleFileDownload(file.fileName, empData.employeeCode, idProofs.find((rec) => rec.id === file.idType)?.name)
                    }
                })
            }

        }
    }

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: "Employee",
            dataIndex: 'employeeName',
            // sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeName", "Employee"),
            align: "center",
        },
        {
            title: "Employee Id",
            dataIndex: 'employeeCode',
            // sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeCode", "Employee Id"),
        },
        {
            title: "EmployeeType",
            dataIndex: 'employeeType',
            // sorter: (a, b) => a.employeeType.localeCompare(b.employeeType),
            // sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeType", "EmployeeType"),
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "isActive",
            fixed: 'right',
            align: "center",
            width: 100,
            ...getColumnSearchProps("isActive", "Status"),
            render: (isActive, rowData) => (
                <>
                    {isActive ? (
                        <Tag icon={<CheckCircleOutlined />} color="#87d068">
                            Active
                        </Tag>
                    ) : (
                        <Tag icon={<CloseCircleOutlined />} color="#f50">
                            Inactive
                        </Tag>
                    )}
                </>
            ),
            filterIcon: (filtered: boolean) => (
                <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
            ),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }: any) => (
                <div
                    className="custom-filter-dropdown"
                    style={{ flexDirection: "row", marginLeft: 10 }}
                >
                    <Checkbox
                        checked={selectedKeys.includes('Active')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Active') ? [] : ['Active']
                            )
                        }
                    >
                        <span style={{ color: "green" }}>Active</span>
                    </Checkbox>
                    <Checkbox
                        checked={selectedKeys.includes('Inactive')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Inactive') ? [] : ['Inactive']
                            )
                        }
                    >
                        <span style={{ color: "red" }}>Inactive</span>
                    </Checkbox>
                    <div className="custom-filter-dropdown-btns">
                        <Button
                            onClick={() => {
                                handleReset(clearFilters);
                                confirm();
                            }}
                            className="custom-reset-button"
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: 10 }}
                            onClick={() => confirm()}
                            className="custom-ok-button"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            ),
            onFilter: (value, record) => {
                if (typeof value === 'string') {
                    const status = record.isActive ? 'Active' : 'Inactive';
                    return value === status;
                }
                return false;
            },
        },

        {
            title: (<>
                <Form layout='vertical' form={Idform} onFinish={getBulkDownload}>
                    <Row gutter={16} align="middle">
                        <Col>
                            <Form.Item name="id" initialValue={0} style={{ width: '100%' }}>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} optionFilterProp="children">
                                    {idProofs.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item>
                                <Button htmlType='submit' type='primary'> Get Download</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </>
            ),
            dataIndex: 'all',
            render: (text, record) =>
                <>
                    {text && text.length > 0 ? (
                        text.map((file, childIndex: number) => (
                            file.fileName ? (
                                <div key={childIndex} style={{ display: 'flex', alignItems: 'center' }}>
                                    {idProofs.find((rec) => rec.id === file.idType)?.name}
                                    <IdcardOutlined
                                        style={{ fontSize: '1rem', cursor: 'pointer', marginLeft: '1rem' }}
                                        onClick={() => handleFileOpen(file.fileName)}
                                    />
                                </div>
                            ) : <p style={{ color: 'gray', fontStyle: 'italic' }}>No files uploaded</p>
                        ))
                    ) : (
                        <p style={{ color: 'gray', fontStyle: 'italic' }}>No files uploaded</p>
                    )}
                </>
        },

    ];

    return (

        <PageContainer title="Download ID Proofs Docs" >
            <Form layout='vertical' form={form} >
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branches" initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'ALL' : Number(IAMClientAuthContext.user.unitId)}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch',
                                },
                            ]}>
                            <Select showSearch
                                disabled={role === 'SuperAdmin' ? false : true}
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                onChange={(value) => handleBranchChange(value)}>
                                {/* <Option value={''}> ALL </Option> */}
                                <Option value={'ALL'}> ALL </Option>
                                {branches.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees.map((rec: any) => (
                                    <Option value={rec.employeeId} key={rec.employeeId}>
                                        {rec.employeeCode} {rec.employeeName}
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

                    {/* <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                        <Button type="primary" onClick={getAllEmployeeDocuments}>
                            Get Report
                        </Button>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={Reset} type='dashed' danger> Reset </Button>
                    </Col> */}

                    <Col span={6} style={{ paddingTop: '23px' }}>
                        <Button color="primary" variant="outlined" onClick={getAllEmployeeDocuments} style={{ marginRight: '8px' }}>Submit</Button>
                        <Button icon={<UndoOutlined />} onClick={Reset} color="danger" variant="outlined" style={{ marginRight: '8px' }}>Reset</Button>
                    </Col>

                </Row>
            </Form>

            {data.length > 0 ?
                <Table
                    rowKey={(record) => record.employeeCode}
                    rowSelection={rowSelection}
                    columns={columns}
                    size="small"
                    dataSource={SelectedOrderDataSource(data)}
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                        position: ['topRight'],
                    }}
                    bordered /> : ''}

        </PageContainer>
    )
}

export default EmployeeIdProofView