import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { BranchReq, OTBulkApprovalReq, ScopesEnum } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DivisionService, EmployeeOnboardingService, ShiftService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Tabs, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../../../common/iam-client-react';

interface OtApprovedViewProps {
    scopes: ScopesEnum[]
}

const OtApprovedView = (props: OtApprovedViewProps) => {
    const { scopes } = props
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const branchService = new BranchesService()
    const { Option } = Select
    const attendanceService = new AttendanceServices()
    const shiftsService = new ShiftService()
    const deptService = new DepartmentService()
    const emService = new EmployeeOnboardingService()
    const divisionService = new DivisionService()
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [form] = Form.useForm();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [deptData, setDeptData] = useState<any[]>([])
    const [shiftsData, setShiftsData] = useState<any[]>([])
    const [divisions, setDivisions] = useState<any>([]);
    const [activeTab, setActiveTab] = useState("1");
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        getAllBranches()
        getAllDepartments()
        getAllShifts()
        getAllDivision()
        getAllForOTApproved()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
    }, []);

    const onReset = () => {
        const currentBranch = form.getFieldValue('branchId');
        form.resetFields();
        form.setFieldsValue({ branchId: currentBranch })
        setDeptData([])
        setShiftsData([])
        setDivisions([])
        setActiveTab("1");
        setSelectedRowKeys([])
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

    const getAllDepartments = () => {
        deptService.getAllDepartments().then(res => {
            if (res.status) {
                setDeptData(res.data)
            } else {
                setDeptData([])
            }
        })
    }

    const getAllShifts = (req?: any) => {
        shiftsService.getAllShifts(req).then(res => {
            if (res.status) {
                setShiftsData(res.data)
            } else {
                setShiftsData([])
            }
        })
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

    const getColumnSearchProps = (dataIndex: any,title:any): ColumnType<any> => ({
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

    const getColumns = (activeTab: string): ColumnsType<any> => {
        const baseColumns: ColumnsType<any> = [
            {
                title: "S.No",
                key: "sno",
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: "center"
            },
            {
                title: "Branch",
                dataIndex: "branches",
                sorter: (a, b) => a.branches.localeCompare(b.branches),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("branches","Branch"),
                align: "center",
            },
            {
                title: "Employee Name",
                dataIndex: "empName",
                sorter: (a, b) => a.empName.localeCompare(b.empName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("empName","Employee Name"),
                align: "center",
            },
            {
                title: "Employee Code",
                dataIndex: "empCode",
                sorter: (a, b) => a.empCode.localeCompare(b.empCode),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("empCode","Employee Code"),
                align: "center",
            },
            {
                title: 'Date',
                dataIndex: 'date',
                align: "center",
                render: (text) => (text ? dayjs(text).format('DD-MM-YYYY') : '-'),
            },
            {
                title: "In Time",
                dataIndex: "inTime",
                sorter: (a, b) => a.inTime.localeCompare(b.inTime),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("inTime","In Time"),
                align: "center",
            },
            {
                title: "Out Time",
                dataIndex: "outTime",
                sorter: (a, b) => a.outTime.localeCompare(b.outTime),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("outTime","Out Time"),
                align: "center",
            },
            {
                title: "Final OT Hours",
                dataIndex: "finalOtHours",
                sorter: (a, b) => a.finalOtHours.localeCompare(b.finalOtHours),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("finalOtHours","Final OT Hours"),
                align: "center",
            },
        ];

        if (activeTab === "3") { // Only add "Reason" column for REJECTED tab
            baseColumns.push({
                title: "Reason",
                dataIndex: "reason",
                align: "center",
            });
        }

        return baseColumns;
    };

    const getAllForOTApproved = () => {
        const req = new OTBulkApprovalReq()
        const formValues = form.getFieldsValue();
        if (formValues.date) {
            req.date = formValues.date.format('YYYYMM');
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId
        }
        attendanceService.getAllForOTApproved(req).then(res => {
            if (res.status) {
                setData(res.data)
            } else {
                message.info('No Data Found')
                setData([])
            }
        })
    }

    const filterDataByStatus = (status) => {
        return data?.filter(item => item.status === status) || [];
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRows);
        },
    };

    const updateApprovedOTStatus = (newStatus) => {
        const updatedRows = selectedRowKeys.map((key) => ({
            ...key,
            status: newStatus
        }));
        attendanceService.updateApprovedOTStatus(updatedRows).then(res => {
            if (res.status) {
                setSelectedRowKeys([]);
                getAllForOTApproved()
            } else {
                message.error(res.internalMessage);
            }
        });
        getAllForOTApproved();
    }

    const revertApprovedButtonData = (data) => {
        const updateStatus = selectedRowKeys.map((key) => ({
            ...key,
            status: data
        }));
        attendanceService.updateRevertOTStatus(updateStatus).then((res) => {
            if (res.status) {
                getAllForOTApproved()
                setSelectedRowKeys([]);
                message.success(res.internalMessage);
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    // const updateRejectedOTStatus = (newStatus) => {
    //     const updatedRows = selectedRowKeys.map((key) => ({
    //         ...key,
    //         status: newStatus
    //     }));
    //     attendanceService.updateRejectedOTStatus(updatedRows).then(res => {
    //         if (res.status) {
    //             getAllForOTApproved()
    //             setSelectedRowKeys([]);
    //         } else {
    //             message.error(res.internalMessage);
    //         }
    //     });
    //     getAllForOTApproved();
    // };
    const handleRejectClick = () => {
        setRejectModalOpen(true);
    };

    const handleRejectSubmit = () => {
        if (!rejectReason.trim()) {
            message.error("Please enter a reason for rejection.");
            return;
        }

        const updatedRows = selectedRowKeys.map((key) => ({
            ...key,
            status: "REJECTED",
            reason: rejectReason,
        }));

        attendanceService.updateRejectedOTStatus(updatedRows).then((res) => {
            if (res.status) {
                getAllForOTApproved();
                setSelectedRowKeys([]);
                setRejectModalOpen(false);
                setRejectReason("");
            } else {
                message.error(res.internalMessage);
            }
        });
    };

    const revertRejectButtonData = (data) => {
        const updateStatus = selectedRowKeys.map((key) => ({
            ...key,
            status: data
        }));
        attendanceService.updateRevertOTStatus(updateStatus).then((res) => {
            if (res.status) {
                getAllForOTApproved()
                setSelectedRowKeys([]);
                message.success(res.internalMessage);
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    const handleBranchChange = (branchId) => {
        // if (!branchId) {
        //     setEmployees(''); // Clear employees if no branch is selected
        //     return;
        // }
        if (branchId === "ALL") {
            form.setFieldsValue({ branchId: null });
        } else if (branchId === null) {
            form.setFieldsValue({ branchId: "ALL" });
        } else if (branchId === '') {
            form.setFieldsValue({ branchId: "ALL" });
        } else {
            form.setFieldsValue({ branchId: branchId }); // Set selected branch ID
        }
        const branchRequest = new BranchReq(branchId);

        emService.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

    return (
        <PageContainer title='OT Approval' breadcrumbRender={false}>
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branchId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch',
                                },
                            ]}>
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                disabled={role === 'SuperAdmin' ? false : true}
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
                        <Form.Item name='date' label={'Date'} rules={[{ required: true, message: 'Date is Required' }]}>
                            <DatePicker picker="month" style={{ width: '100%' }} format="YYYYMM" placeholder='Select Date' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionId">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name={'departmentId'} label={'Department'} >
                            <Select placeholder="Select Department" showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children">
                                {deptData?.map(dept => {
                                    return <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Button color="primary" variant="outlined" onClick={getAllForOTApproved} >
                            Submit
                        </Button>&nbsp;&nbsp;
                        <Button onClick={onReset} color="danger" variant="outlined" style={{ marginTop: '25px' }}>
                            Reset
                        </Button>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={6}>
                        {data.length > 0 && (
                            <>
                                {activeTab === "1" && selectedRowKeys.length > 0 && (
                                    <>
                                        <Button onClick={() => updateApprovedOTStatus('APPROVED')} type="primary">
                                            Approve
                                        </Button>&nbsp;
                                        <Button onClick={handleRejectClick} type="primary" danger>
                                            Reject
                                        </Button>&nbsp;
                                    </>
                                )}

                                {activeTab === "2" && selectedRowKeys.length > 0 && (
                                    <Button onClick={() => revertApprovedButtonData('APPROVED')} color="primary" variant="dashed">
                                        Approved Revert
                                    </Button>
                                )}

                                {activeTab === "3" && selectedRowKeys.length > 0 && (
                                    <Button type="dashed" danger onClick={() => revertRejectButtonData('REJECTED')}>
                                        Rejected Revert
                                    </Button>
                                )}

                                <Modal
                                    title="Reject OT"
                                    open={isRejectModalOpen}
                                    onCancel={() => setRejectModalOpen(false)}
                                    onOk={handleRejectSubmit}
                                >
                                    <p>Please Enter a Reason For Rejection:</p>
                                    <Input.TextArea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows={3}
                                        placeholder="Enter Rejection Reason..."
                                    />
                                </Modal>
                            </>
                        )}

                    </Col>
                </Row>

                <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                    <Tabs.TabPane tab={<span>OPEN: <Tag color="blue">{filterDataByStatus('OPEN').length}</Tag></span>}
                        key="1">
                        <Table
                            columns={getColumns(activeTab)}
                            dataSource={filterDataByStatus('OPEN')}
                            rowSelection={rowSelection}
                            size="small"
                            rowKey={(record) => record.empId}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span>APPROVED: <Tag color="blue">{filterDataByStatus('APPROVED').length}</Tag></span>} key="2">
                        <Table
                            columns={getColumns(activeTab)}
                            dataSource={filterDataByStatus('APPROVED')}
                            rowSelection={rowSelection}
                            size="small"
                            rowKey={(record) => record.empId}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span>REJECTED: <Tag color="blue">{filterDataByStatus('REJECTED').length}</Tag></span>} key="3">
                        <Table
                            columns={getColumns(activeTab)}
                            dataSource={filterDataByStatus('REJECTED')}
                            rowSelection={rowSelection}
                            size="small"
                            rowKey={(record) => record.empId}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </PageContainer >
    );

}
export default OtApprovedView