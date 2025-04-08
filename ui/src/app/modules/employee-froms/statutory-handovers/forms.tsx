import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, FilterOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { AlertMessages, BranchReq, EmployeeDetailsDto } from "@hrexpert/shared-models";
import { BranchesService, DepartmentService, DesignationsService, EmployeeOnboardingService, EmployeeTypeService } from "@hrexpert/shared-services";
import { Button, Card, Checkbox, Col, Form, Input, Modal, Row, Select, Space, Table, Tag } from "antd";
import { ColumnProps } from "antd/es/table";
import { ColumnType, TableRowSelection } from "antd/es/table/interface";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from "../../../common/iam-client-react";
import CertificateEmployee from "./certificate-employee";
import EmployeeJoiningForm from "./employee-joining-form";
import ExperienceForm from "./experience-form";
import RelievingForm from "./relieving-form";
import { PageContainer } from "@ant-design/pro-layout";

const Forms = () => {
    const { Option } = Select
    const [employeeData, setEmployeeData] = useState<any>([])
    const [allEmployees, setAllEmployees] = useState<any>([])
    const empService = new EmployeeOnboardingService()
    const [departments, setDepartments] = useState([]);
    const [designatioin, setDesignatioin] = useState([]);
    const dpService = new DepartmentService()
    const desService = new DesignationsService();
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, });
    const branchesService = new BranchesService()
    const [branches, setBranches] = useState<any>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [employeType, setEmployeType] = useState<any>([]);
    const empTypeService = new EmployeeTypeService()
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            console.log('Selected Rows:', rows);
        },
    };

    useEffect(() => {
        getDesignationList()
        getDepartmentList()
        getBranches()
        getActiveEmployeeType()
        // getAllActiveEmployees()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
            getAllActiveEmployees(null)
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
            getAllActiveEmployees(IAMClientAuthContext.user.unitId)
        }
    }, [])

    const getBranches = () => {
        try {
            branchesService.getActiveBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data)
                } else {
                    setBranches([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getDepartmentList = () => {
        try {
            dpService.getAllDepartments().then((res) => {
                if (res.status) {
                    setDepartments(res.data);
                } else {
                    console.error("Failed to fetch departments");
                }
            })
        } catch (err) {
            console.log(err);
        }
    };

    const getDesignationList = () => {
        try {
            desService.getDesignations().then((res) => {
                if (res.status) {
                    setDesignatioin(res.data);
                } else {
                    console.error("failed to fetch designations");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getActiveEmployeeType = () => {
        try {
            empTypeService.getActiveEmployeeType().then((res) => {
                if (res.status) {
                    setEmployeType(res.data);
                } else {
                    console.error("failed to fetch designations");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    const getAllActiveEmployees = (branchId) => {
        try {
            if (branchId === "ALL") {
                form.setFieldsValue({ branchId: null });
            } else if (branchId === null) {
                form.setFieldsValue({ branchId: "ALL" });
            } else if (branchId === '') {
                form.setFieldsValue({ branchId: "ALL" });
            } else {
                form.setFieldsValue({ branchId: branchId });
            }
            const branchRequest = new BranchReq(branchId);
            empService.getAllActiveEmpForAttendance(branchRequest).then((res) => {
                if (res.status) {
                    setAllEmployees(res.data);
                } else {
                    console.error("failed to fetch designations");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    // const getEmployeeData = () => {
    //     const req = new EmployeeDetailsDto()
    //     const formValues = form.getFieldsValue();
    //     if (formValues.departmentId) {
    //         req.departmentId = formValues.departmentId
    //     }
    //     // if (formValues.branchId) {
    //     //     req.branchId = formValues.branchId
    //     // }
    //     if (formValues.branchId) {
    //         req.branchId = formValues.branchId === 'All' ? null : formValues.branchId;
    //     }
    //     if (formValues.divisionId) {
    //         req.divisionId = formValues.divisionId
    //     }
    //     if (formValues.designationId) {
    //         req.designationId = formValues.designationId
    //     }
    //     if (formValues.employeeCode) {
    //         req.id = formValues.employeeCode
    //     }
    //     if (formValues.employeeName) {
    //         req.id = formValues.employeeName
    //     }
    //     setLoading(true)
    //     try {
    //         empService.getAllEmployeesTableFroms(req).then((res) => {
    //             if (res.status) {
    //                 setEmployeeData(res.data);
    //                 setLoading(false)
    //             } else {
    //                 console.error("Failed to fetch employees");
    //             }
    //         });
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };
    const getEmployeeData = () => {
        const req = new EmployeeDetailsDto();
        const formValues = form.getFieldsValue();

        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId;
        }
        if (formValues.branchId) {
            req.branchId = formValues.branchId === 'All' ? null : formValues.branchId;
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId;
        }
        if (formValues.designationId) {
            req.designationId = formValues.designationId;
        }
        if (formValues.employeeCode) {
            req.id = formValues.employeeCode;
        }
        if (formValues.employeeName) {
            req.id = formValues.employeeName;
        }
        if (formValues.employeeType) {
            req.employeeTypeId = formValues.employeeType;
        }

        try {
            empService.getAllEmployeesTableFroms(req).then((res) => {
                if (res.status && res.data && res.data.length > 0) {
                    setEmployeeData(res.data);
                } else {
                    AlertMessages.getErrorMessage('No Data Found');
                    setEmployeeData([]); // Clear employee data
                }
            })
        } catch (err) {
            console.error(err);
            AlertMessages.getErrorMessage('An error occurred while fetching data.');
        }
    };

    const clearForm = () => {
        form.resetFields();
        setPagination((prev) => ({
            ...prev,
            current: 1,
        }));
        setEmployeeData([])
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
        onFilter: (value, record) => {
            const keys = dataIndex.split(".");
            let nestedValue = record;
            keys.forEach((key) => {
                nestedValue = nestedValue ? nestedValue[key] : null;
            });
            return nestedValue
                ? nestedValue.toString().toLowerCase().includes((value as string).toLowerCase())
                : false;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
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

    const columns: ColumnProps<any>[] = [
        {
            title: "S.No",
            key: "sno",
            fixed: 'left',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: "Employee Name",
            fixed: 'left',
            dataIndex: "firstName",
            ...getColumnSearchProps('firstName', "Employee Name"),
            render: (v, obj) => obj.firstName + " " + obj.lastName,
        },
        {
            title: "Employee ID",
            fixed: 'left',
            dataIndex: "employeeCode",
            ...getColumnSearchProps('employeeCode', "Employee ID"),
            render: (text, record) => record.employeeCode,
        },
        {
            title: "Employee Type",
            ...getColumnSearchProps('employeeTypeId.name', "Employee Type"),
            render: (text, record) => record.employeeTypeId?.name,
        },
        {
            title: "Branch",
            ...getColumnSearchProps('branchId.branchName', "Branch"),
            render: (text, record) => record.branchId?.branchName,
        },
        {
            title: "Department",
            ...getColumnSearchProps('departmentId.name', "Department"),
            render: (text, record) => record.departmentId?.name,
        },
        {
            title: "Designation",
            ...getColumnSearchProps('designationId.name', "Designation"),
            render: (text, record) => record.designationId?.name,
        },
        {
            title: "Division",
            ...getColumnSearchProps('divisionId.divisionName', "Division"),
            render: (text, record) => record.divisionId?.divisionName,
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
            title: "Actions",
            render: (rec) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewClick(rec)}
                    disabled={!selectedDocumentType}
                >
                    View
                </Button>
            )
        }
    ];

    const handleViewClick = (rec) => {
        const dataToPass = { ...rec, documentType: selectedDocumentType };
        setFormData(dataToPass);
        setIsModalVisible(true);
    };


    return (
        <>
            <PageContainer
                title="HR Forms & Certificates"
                extra={
                    <div style={{ width: "300px" }}>
                        <Form form={form}>
                            <Form.Item
                                label="Document Type"
                                name="documentType"
                                style={{ margin: 0 }}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="Select Document Type"
                                    onChange={(value) => setSelectedDocumentType(value)}
                                >
                                    <Option value="experienceForm">Experience Form</Option>
                                    <Option value="certificateEmployee">Certificate Employee</Option>
                                    <Option value="relievingForm">Relieving Form</Option>
                                    <Option value="employeeJoiningForm">Employee Joining Form</Option>
                                </Select>
                            </Form.Item>

                        </Form>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={getEmployeeData}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item name='branchId' label='Branch' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : Number(IAMClientAuthContext.user.unitId)}  >
                                <Select placeholder="Select Branch" showSearch allowClear optionFilterProp="children"
                                    onChange={(value) => getAllActiveEmployees(value)}>
                                    <Option value={''}> ALL </Option>
                                    {branches.map((br) => (
                                        <Option key={br.id} value={br.id}>
                                            {br.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item name='employeeName' label='Employee'  >
                                <Select placeholder="Select Employee Name" showSearch allowClear optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                    {allEmployees.map((rec) => (
                                        <Option key={rec.id} value={rec.employeeId}>
                                            {rec.employeeName}- {rec.employeeCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item name={'departmentId'} label={'Department'}>
                                <Select placeholder="Select Department" showSearch allowClear optionFilterProp="children">
                                    {departments.map((dept) => (
                                        <Option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item name={'designationId'} label={'Designation'}>
                                <Select placeholder="Select Designation" showSearch allowClear optionFilterProp="children">
                                    {designatioin.map((des) => (
                                        <Option key={des.id} value={des.id}>
                                            {des.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item name={'employeeType'} label={'Employee Type'}>
                                <Select placeholder="Select Employee Type" showSearch allowClear>
                                    {employeType.map((empTy) => (
                                        <Option key={empTy.id} value={empTy.id}>
                                            {empTy.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* <Col span={4}>
                            <Form.Item name='employeeCode' label='Employee Code'  >
                                <Select placeholder="Select Employee Code" showSearch allowClear optionFilterProp="children">
                                    {allEmployees.map((rec) => (
                                        <Option key={rec.id} value={rec.employeeId}>
                                            {rec.employeeCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> */}
                        <Col span={6}>
                            <Button color="primary" variant="outlined" htmlType="submit" style={{ marginRight: '8px',marginTop:"23px" }}>Submit</Button>
                            <Button icon={<UndoOutlined />} onClick={clearForm} color="danger" variant="outlined" style={{ marginRight: '8px',marginTop:"23px" }}>Reset</Button>
                        </Col>
                        {/* <Col span={2} style={{ marginTop: "23px" }}>
                            <Button style={{ width: '100%' }} icon={<SearchOutlined />} type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Col>
                        <Col span={2} style={{ marginTop: "23px" }}>
                            <Button
                                style={{ width: '100%' }}
                                type="dashed"
                                icon={<UndoOutlined />}
                                danger
                                onClick={clearForm}
                            >
                                Reset
                            </Button>
                        </Col> */}
                    </Row>
                </Form>
                {employeeData.length > 0 ?
                    <Table columns={columns} dataSource={employeeData} scroll={{ x: true }} bordered
                    // rowSelection={rowSelection}
                    // rowKey={(record) => record.id + record.employeeCode}
                    style={{ marginTop: '8px' }}
                    />
                    : <></>}

                <Modal
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={1000}
                    style={{ marginTop: "-100px" }}
                >
                    {selectedDocumentType === "certificateEmployee" && formData && (
                        <CertificateEmployee rec={formData} />
                    )}
                    {selectedDocumentType === "experienceForm" && formData && (
                        <ExperienceForm rec={formData}/>
                    )}
                    {selectedDocumentType === "relievingForm" && formData && (
                        <RelievingForm rec={formData} />
                    )}
                    {selectedDocumentType === "employeeJoiningForm" && formData && (
                        <EmployeeJoiningForm rec={formData} />
                    )}
                </Modal>
            </PageContainer>
        </>
    )
}
export default Forms;