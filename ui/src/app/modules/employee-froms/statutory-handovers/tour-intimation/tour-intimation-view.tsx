import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined, UndoOutlined } from "@ant-design/icons";
import { AlertMessages, BranchReq, TourIntimationEnum } from "@hrexpert/shared-models";
import { BranchesService, configVariables, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService, TourIntimationService } from "@hrexpert/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Space, Table, Tabs, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import StatusTag from "./status-tag";
import TourIntimationPdf from "./tour-intimation-pdf-form";
import { useIAMClientState } from '../../../../common/iam-client-react';
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-layout";


const TourIntimationView = () => {
    const [form] = Form.useForm();
    const Option = Select
    const [data, setData] = useState<any>([])
    const [filterTableData, setfilterTableData] = useState<any>([])
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const [page, setPage] = React.useState(1);
    const branchService = new BranchesService()
    const employeeDetails = new EmployeeOnboardingService()
    const tourIntimationService = new TourIntimationService()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [employeedetails, setEmployeedetails] = useState<any>([])
    const [pdfData, setPdfData] = useState<any>(null)
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const departmentService = new DepartmentService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const [permissionStatus, setPermissionStatus] = useState<string>('OPEN')


    useEffect(() => {
        getAllBranches();
        getAllDepartments();
        getDesignations();
        getAllDivision();
        // handleBranchChange(IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId))
        if (IAMClientAuthContext.user.roles != "SuperAdmin") {
            submit({ employeeId: Number(IAMClientAuthContext.user.employeeId) })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
            handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)
        }
    }, []);

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
            form.setFieldsValue({ branches: "ALL" })
            branchId = null
        } else if (branchId === null) {
            form.setFieldsValue({ branches: "ALL" })
        } else if (branchId === '') {
            form.setFieldsValue({ branches: "ALL" })
        } else {
            form.setFieldsValue({ branches: branchId })
        }

        const branchRequest = new BranchReq(branchId);

        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data.filter((r) => r.employeeTypeId === 1))
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


    const submit = (values) => {
        try {
            tourIntimationService.gettourIntimation(values).then((res) => {
                if (res.status) {
                    setData(res.data)
                    setfilterTableData(res.data.filter((rec) => rec.permission === TourIntimationEnum.OPEN))
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getEmployeeDetails = (value) => {
        const req = { employeeId: value }
        try {
            tourIntimationService.gettourEmployeeData(req).then((res) => {
                if (res.status) {
                    setEmployeedetails(res.data)
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const filterData = (id) => {
        const tourEmployeeData = data.find((rec) => rec.id === id)
        setPdfData(tourEmployeeData)
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


    const dynamicColumns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeCode", 'Employee Code'),
        },
        {
            title: 'Employee Name',
            dataIndex: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("firstName", 'Employee Name'),
        },
        {
            title: 'Division',
            dataIndex: 'divisionName',
            sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("divisionName", 'Division'),
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("departmentName", 'Department'),
        },
        {
            title: 'Designation',
            dataIndex: 'designationName',
            sorter: (a, b) => a.designationName.localeCompare(b.designationName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("designationName", 'Designation'),
        },
        {
            title: 'Reporting Manager',
            dataIndex: 'rmFirstName',
            sorter: (a, b) => a.rmFirstName.localeCompare(b.rmFirstName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("rmFirstName", 'Reporting Manager'),
        },
        {
            title: 'Applied Date',
            dataIndex: 'appliedDate',
            sorter: (a, b) => a.appliedDate.localeCompare(b.appliedDate),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Requested Amount',
            dataIndex: 'requestedAmount',
            sorter: (a, b) => a.requestedAmount.localeCompare(b.requestedAmount),
            sortDirections: ['ascend', 'descend'],
            render: (text) => ('₹ ' + text + ' /-'),
        },
        {
            title: 'Approved Amount',
            dataIndex: 'advanceRequired',
            hidden: permissionStatus === 'APPROVED' ? false : true,
            sorter: (a, b) => a.advanceRequired.localeCompare(b.advanceRequired),
            sortDirections: ['ascend', 'descend'],
            render: (text) => ('₹ ' + text + ' /-'),
        },
        {
            title: 'Date',
            dataIndex: 'permissionDate',
            sorter: (a, b) => a.permissionDate.localeCompare(b.permissionDate),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Status',
            dataIndex: 'permission',
            sorter: (a, b) => a.permission.localeCompare(b.permission),
            sortDirections: ['ascend', 'descend'],
            render: (value: TourIntimationEnum) => {
                return <StatusTag status={value} />
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <><Button color="primary" variant="link" onClick={() => { setOpenModal(true), getEmployeeDetails(record.employeeId), filterData(record.id) }}>View Pdf</Button>
                    <Divider type="vertical" />
                    {(IAMClientAuthContext.user.roles === "SuperAdmin" && record.permission === 'OPEN' ?
                        <> <Button style={{ marginTop: '1rem' }} type="primary" target='_blank' onClick={() => navigate(`/tour-intimation-details?${record.employeeId}-${record.id}`)}
                        //href={`http://139.59.79.77/hrexpert_dev_app/#/tour-intimation-details?${record.employeeId}-${record.id}`}
                        >
                            Approve
                        </Button></> : <></>)}
                    {(record.permission === 'APPROVED' && record.tourClaim === 0 ? <> <Button style={{ marginTop: '1rem' }} color="primary" variant="outlined" target='_blank' onClick={() => { navigate(`/tour-claim-details-form?${record.employeeId}-${record.id}-${0}`) }} >Tour Claim</Button></> : <></>)}</>
            )
        },
    ];

    const reset = () => {
        setData([])
        form.resetFields()
    }

    const tabsOnchange = (value: string) => {
        setfilterTableData(data.filter((rec) => rec.permission === value))
        setPermissionStatus(value)
    };

    return (
        <>
            <PageContainer title="Tour Intimation Applications" >
                <Form layout='vertical' form={form} onFinish={submit}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branches"
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : Number(IAMClientAuthContext.user.unitId)} >
                                <Select showSearch disabled={role === 'SuperAdmin' ? false : true}
                                    allowClear
                                    placeholder="Select Branch"
                                    dropdownMatchSelectWidth={false}
                                    optionFilterProp="children"
                                    onChange={(value) => handleBranchChange(value)}>
                                    <Option value={'ALL'}> ALL </Option>
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={7} xl={7}>
                            <Form.Item label='Employee Name' name='employeeId' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.employeeId)}>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees.map((rec: any) => (
                                        <Option value={rec.employeeId} key={rec.employeeId}>
                                            {rec.employeeCode} {rec.employeeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>


                        {(IAMClientAuthContext.user.roles === "SuperAdmin" ?
                            <>
                                {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                                    <Form.Item label="Division" name="divisionId">
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
                                    <Form.Item label="Department" name="departmentId">
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
                                    <Form.Item label="Designation" name="designationId">
                                        <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                            {designations.map((rec: any) => (
                                                <Option value={rec.id} key={rec.id}>
                                                    {rec.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col> */}
                            </> : <></>
                        )}

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                            <Button style={{ width: '100%' }} color="primary" variant="outlined" htmlType="submit">
                                Submit
                            </Button>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button icon={<UndoOutlined />} onClick={reset} type='dashed' danger> Reset </Button>
                        </Col>
                    </Row>


                </Form>


                {data.length > 0 && (
                    <Tabs defaultActiveKey={TourIntimationEnum.OPEN} onChange={tabsOnchange}>
                        {[
                            { label: <><SyncOutlined spin /> {TourIntimationEnum.OPEN} : <Tag color="blue">{data.filter((rec) => rec.permission === TourIntimationEnum.OPEN).length}</Tag></>, key: TourIntimationEnum.OPEN },
                            { label: <><CheckCircleOutlined /> {TourIntimationEnum.APPROVED} : <Tag color="blue">{data.filter((rec) => rec.permission === TourIntimationEnum.APPROVED).length}</Tag></>, key: TourIntimationEnum.APPROVED },
                            { label: <><ExclamationCircleOutlined /> {TourIntimationEnum.REJECTED} : <Tag color="blue">{data.filter((rec) => rec.permission === TourIntimationEnum.REJECTED).length}</Tag></>, key: TourIntimationEnum.REJECTED },
                            { label: <><CloseCircleOutlined /> {TourIntimationEnum.CANCLE} : <Tag color="blue">{data.filter((rec) => rec.permission === TourIntimationEnum.CANCLE).length}</Tag></>, key: TourIntimationEnum.CANCLE },
                        ].map((tab) => (
                            <Tabs.TabPane tab={tab.label} key={tab.key}>
                                {filterTableData.length > 0 && (
                                    <Table
                                        columns={dynamicColumns}
                                        dataSource={filterTableData}
                                        pagination={{
                                            onChange(current) {
                                                setPage(current);
                                            },
                                            position: ['topRight'],
                                        }}
                                        scroll={{ x: true }}
                                        rowKey="id"
                                        bordered
                                    />
                                )}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>)}

                <Modal
                    width={1000}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    footer={null}
                >
                    <TourIntimationPdf submittedData={pdfData} employeedetails={employeedetails} formORview={1} />
                </Modal>

            </PageContainer>
        </>
    )
}
export default TourIntimationView;