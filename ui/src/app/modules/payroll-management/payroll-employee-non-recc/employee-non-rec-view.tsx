import { EditOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { AlertMessages, BranchReq } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService, PayrollComponentsSharedService, PayrollEmployeeSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Space, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../common/iam-client-react';
import UpdateNonRecForm from './update-non-rec-form';


const EmployeeNonRecurringView = () => {
    const [form] = Form.useForm();
    const Option = Select
    const [page, setPage] = React.useState(1);
    const [data, setData] = useState<any>([])
    const [detailData, setDetailData] = useState<any>([])
    const [employees, setEmployees] = useState<any>([]);
    const [components, setComponents] = useState<any>([])
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const payrollEmployeeSharedService = new PayrollEmployeeSharedService()
    const payrollRecordsSharedService = new PayrollRecordsSharedService()
    const employeeDetails = new EmployeeOnboardingService()
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [branch, setUniqueBranch] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false)
    const [detailsModalVisible, setDetailsModalVisible] = useState(false)
    const [selectedEditData, setSelectedEditData] = useState<any>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;

    useEffect(() => {
        getAllPayrollNonRecurringComponents()
        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches()
        handleBranchChange(IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId))
        if (IAMClientAuthContext.user.roles != "SuperAdmin") {
            getData({ payRollEmployee: Number(IAMClientAuthContext.user.employeeId) })
        }
    }, []);

    const getAllPayrollNonRecurringComponents = () => {
        try {
            payrollComponentsSharedService.getAllPayrollNonRecurringComponents().then((res) => {
                if (res.status) {
                    setComponents(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getData = (values) => {
        setData([])
        try {
            if (values.branches === 'All') {
                values.branches = null
            }
            payrollRecordsSharedService.getEmpNonRecurring(values).then((res) => {
                if (res.status) {
                    setData(res.data)
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getDetails = (id) => {
        try {
            const EditData = data.find((rec) => rec.id === id)
            setDetailData(JSON.parse(EditData.TermDetails))
            setSelectedEditData(EditData)
        } catch (err) {
            console.log(err);
        }

    }

    const update = (values) => {
        try {
            payrollRecordsSharedService.updateEmpNonRecurring(values).then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    setModalVisible(false);
                    getData({})
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }

    }

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

    const handleBranchChange = (branchId: number) => {
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
            dataIndex: 'employeeName',
            sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employeeName", 'Employee Name'),
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            sorter: (a, b) => a.branchName.localeCompare(b.branchName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("branchName", 'Branch'),
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
            title: 'Component',
            dataIndex: 'componentName',
            sorter: (a, b) => (a.componentName || "").localeCompare(b.componentName || ""),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("componentName", 'Component'),
        },
        {
            title: 'Start Month',
            dataIndex: 'startDate',
            sorter: (a, b) => (a.startDate || "0000-00").localeCompare(b.startDate || "0000-00"),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("startDate", 'Start Month'),
            render: (text) => (text ? dayjs(text).format('YYYY-MM') : '-'),
        },
        {
            title: 'End Month',
            dataIndex: 'endDate',
            sorter: (a, b) => (a.endDate || "0000-00").localeCompare(b.endDate || "0000-00"),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("endDate", 'End Month'),
            render: (text) => (text ? dayjs(text).format('YYYY-MM') : '-'),
        },
        {
            title: 'Total Amount',
            align: 'right',
            dataIndex: 'totalAmount',
            sorter: (a, b) => a.totalAmount.localeCompare(b.totalAmount),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("totalAmount", 'Total Amount'),
            render: (text) => (text ? text + ' /-' : '-'),
        },
        {
            title: "No of Emi's",
            align: 'center',
            dataIndex: 'emiCount',
            sorter: (a, b) => (Number(a.emiCount) || 0) - (Number(b.emiCount) || 0),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("emiCount", 'No of Emi\'s'),
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Action',
            align: "center",
            render: (text, rowData) => (
                <>
                    <EditOutlined
                        className={"editSampleTypeIcon"}
                        type="edit"
                        onClick={() => { getDetails(rowData?.id), setModalVisible(true) }}
                        style={{ color: "#1890ff", fontSize: "14px" }}
                    />
                    <Divider type='vertical'></Divider>
                    <Button type='primary' onClick={() => { getDetails(rowData?.id), setDetailsModalVisible(true) }}>View Details</Button>
                </>
            ),
        }
    ];

    const detailColumns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: 'Pay Month',
            align: 'center',
            dataIndex: 'payMonth',
            sorter: (a, b) => a.payMonth.localeCompare(b.payMonth),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("payMonth", 'Pay Month'),
            render: (text) => (text ? dayjs(text).format('YYYY-MM') : '-'),
        },
        {
            title: 'Total Terms',
            align: 'center',
            dataIndex: 'totalTerms',
            sorter: (a, b) => a.totalTerms.localeCompare(b.totalTerms),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("totalTerms", 'Total Terms'),
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Term Count',
            align: 'center',
            dataIndex: 'termCount',
            sorter: (a, b) => a.termCount.localeCompare(b.termCount),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("termCount", 'Term Count'),
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'EMI Amount',
            align: 'right',
            dataIndex: 'emiAmount',
            sorter: (a, b) => a.emiAmount.localeCompare(b.emiAmount),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("emiAmount", 'EMI Amount'),
            render: (text) => (text ? '₹ ' + text + ' /-' : '-'),
        },
        {
            title: "Is Processed",
            align: 'center',
            dataIndex: 'isProcessed',
            render: (text) => (text ? 'Yes' : 'No'),
        },
    ];


    const reset = () => {
        setData([])
        form.resetFields()
    }

    const closeModal = () => {
        setModalVisible(false);
        setDetailsModalVisible(false)
    };


    return (
        <>
            <Card title="Payroll Component Entry Log" >
                <Form layout='vertical' form={form} onFinish={getData}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={5}>
                            <Form.Item label="Branch" name="branches"
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : Number(IAMClientAuthContext.user.unitId)}
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
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Employee Name' name='payRollEmployee' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.employeeId)}>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees.map((rec: any) => (
                                        <Option value={rec.id} key={rec.employeeId}>
                                            {rec.employeeCode} {rec.employeeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
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



                        {(IAMClientAuthContext.user.roles === "SuperAdmin" ?
                            <>

                                <Col xs={24} sm={12} md={8} lg={4} xl={5}>
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

                                <Col xs={24} sm={12} md={8} lg={4} xl={5}>
                                    <Form.Item label='Pay Roll' name='payRollComponent'>
                                        <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                            optionFilterProp="children" placeholder="Select Payroll Name"  >
                                            {components.map((rec: any) => (
                                                <Option value={rec.id} key={rec.id}>
                                                    {rec.componentName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* 
                                <Col xs={24} sm={12} md={8} lg={4} xl={4}>
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

                    </Row>

                    <Row gutter={24} justify="start" style={{ marginTop: "16px" }}>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button type="primary" htmlType="submit" variant="outlined" color="primary">
                                Submit
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button icon={<UndoOutlined />} htmlType="reset" type="dashed" danger onClick={reset}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {data.length > 0 && (
                    <Table
                        columns={dynamicColumns}
                        dataSource={data}
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
            </Card>

            <Modal
                title={"To Update"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <UpdateNonRecForm updateDetails={update} selectedEditData={selectedEditData} />
            </Modal>

            <Modal
                title={"Details"}
                open={detailsModalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <Table
                    columns={detailColumns}
                    dataSource={detailData}
                    size='small'
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
            </Modal>

        </>
    )
}

export default EmployeeNonRecurringView

