import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { BranchReq, OTBulkApprovalReq, ScopesEnum } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DivisionService, EmployeeOnboardingService, ShiftService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, TimePicker } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { SequenceUtils } from "../../../../../common/utils";

interface BulkOtApprovalIProps {
    scopes: ScopesEnum[]
}

const BulkOtApproval = (props: BulkOtApprovalIProps) => {
    const { scopes } = props
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowKeysData, setSelectedRowKeysData] = useState([]);
    const [deptData, setDeptData] = useState<any[]>([])
    const [shiftsData, setShiftsData] = useState<any[]>([])
    const [bulkOtHours, setBulkOtHours] = useState(null);
    const [inputChange, setInputChange] = useState<boolean>(false)
    const [otVal, setOtVal] = useState<any>(undefined)
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [bulkReason, setBulkReason] = useState<any>([]);
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

    useEffect(() => {
        getAllBranches()
        getAllDepartments()
        getAllShifts()
        getAllDivision()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
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

    const getAllForBulkOTApplyApprove = (req) => {
        attendanceService.getAllForBulkOTApplyApprove(req).then(res => {
            if (res.status) {
                setData(res.data)
            } else {
                message.info('No Data Found')
                setData([])
            }
        })
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
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRowKeysData(selectedRows);
        },
        selectedRowKeys,
    };
    const handleBranchChange = (branchId) => {
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
        emService.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
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

    const handleBulkOtChange = (time) => {
        setInputChange(true);
        const formattedTime = time ? time.format("HH:mm") : null;
        setOtVal(formattedTime);
        setBulkOtHours(time)
        const newData = selectedRowKeysData.map((record) => {
            return {
                ...record,
                finalOtHours: formattedTime
            };
        });
        setData(newData)
    }

    const handleBulkReasonChange = (e) => {
        const reason = e.target.value;
        setBulkReason(reason);
        const updatedValues = selectedRowKeysData.reduce((acc, key) => {
            acc[key.employeeId + "reason"] = reason;
            return acc;
        }, {});
        form.setFieldsValue(updatedValues);
    }

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            width: 40,
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Branch",
            width: 100,
            ...getColumnSearchProps("branches"),
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'branches'} initialValue={record.branches}><span>{record.branches}</span></Form.Item><Form.Item name={record.employeeId + 'employeeId'} hidden></Form.Item></>
            }
        },
        // {
        //     title: "Division",
        //     width: 90,
        //     sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
        //     sortDirections: ['ascend', 'descend'],
        //     ...getColumnSearchProps("divisionName"),
        //     align: "center",
        //     render: (_, record) => {
        //         return <><Form.Item name={record.employeeId + 'divisionName'} initialValue={record.divisionName}><span>{record.divisionName}</span></Form.Item><Form.Item name={record.employeeId + 'employeeId'} hidden></Form.Item></>
        //     }
        // },
        {
            title: "Employee",
            width: 100,
            ...getColumnSearchProps("employee"),
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'employee'} initialValue={record.employee}><span>{record.employee}</span></Form.Item><Form.Item name={record.employeeId + 'employeeId'} hidden></Form.Item></>
            }
        },
        {
            title: "Code",
            width: 60,
            ...getColumnSearchProps("empCode"),
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'empCode'} initialValue={record.empCode}><span>{record.empCode}</span></Form.Item></>
            }
        },
        {
            title: "Department",
            width: 100,
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'department'} initialValue={record.department}><span>{record.department}</span></Form.Item></>
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
            width: 90,
            align: "center",
            render: (text) => (text ? dayjs(text).format('DD-MM-YYYY') : '-'),
        },
        {
            title: "In Time",
            sorter: (a, b) => a.outTime.localeCompare(b.outTime),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("inTime"),
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'intTime'}><span>{record.inTime}</span></Form.Item></>
            },
            width: 90,
        },
        {
            title: "Out Time",
            sorter: (a, b) => a.outTime.localeCompare(b.outTime),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("outTime"),
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'outTime'}><span>{record.outTime}</span></Form.Item></>
            },
            width: 100,
        },
        {
            title: "Working Hours",
            dataIndex: 'workingHrs',
            ...getColumnSearchProps("workingHrs"),
            align: "center",
            width: 90,
        },
        {
            title: 'OT Hours',
            width: 90,
            sorter: (a, b) => a.otHours.localeCompare(b.otHours),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("otHours"),
            align: "center",
            render: (_, record) => {
                return <><Form.Item name={record.employeeId + 'otHours'}><span>{record.otHours}</span></Form.Item></>
            }
        },
        {
            title: "Reason",
            render: (_, record) => {
                const isSelected = selectedRowKeysData.some(
                    (key) => key.employeeId === record.employeeId
                );
                return (
                    <Form.Item
                        name={record.employeeId + "reason"}
                        initialValue={record.reason}
                        rules={isSelected ? [{ required: true, message: "Reason is needed" }] : []}
                    >
                        <Input allowClear />
                    </Form.Item>
                );
            },
            align: "center",
            width: 100,
        },
        {
            title: "Final OT Hours",
            align: "center",
            width: 120,
            render: (_, record) => {
                const isSelected = selectedRowKeysData.some(
                    (key) => key.employeeId === record.employeeId
                );
                return (
                    <>
                        {inputChange === true ? (
                            <Form.Item name={record.employeeId + "editedFinalOtHours"}>
                                <span>{record.finalOtHours}</span>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name={record.employeeId + "finalOtHours"}
                                initialValue={
                                    record.finalOtHours
                                        ? moment(record.finalOtHours, "HH:mm")
                                        : null
                                }
                            >
                                <TimePicker
                                    format="HH:mm"
                                    minuteStep={30}
                                    disabledMinutes={() => {
                                        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
                                    }}
                                />
                            </Form.Item>
                        )}
                    </>
                );
            },
        },
    ];

    const updateOt = (req) => {
        attendanceService.updateBulkOTApproval(req).then(res => {
            if (res.status) {
                message.success('OT Apply Process Done')
                onReset()
            } else {
                message.error('Some thing went Wrong')
            }
        })
    }

    const onApprove = () => {
        const allRecords = form.getFieldsValue();
        const updatedRecords = [];
        let hasInputValues = false;

        data.forEach((record) => {
            const reason = allRecords[`${record.employeeId}reason`];
            const finalOtHoursMoment = allRecords[`${record.employeeId}finalOtHours`];
            const finalOtHours = finalOtHoursMoment ? finalOtHoursMoment.format('HH:mm') : null;
            if (reason || finalOtHours) {
                hasInputValues = true;
            }
            if (selectedRowKeysData.some((key) => key.employeeId === record.employeeId) || reason || finalOtHours) {
                updatedRecords.push({
                    employeeId: record.employeeId,
                    employeeCode: record.employeeCode,
                    reason,
                    finalOtHours,
                    inTime: record.inTime,
                    outTime: record.outTime,
                    editedFinalOtHours: otVal,
                    date: dayjs(record.date).format('YYYY-MM-DD'),
                    departmentId: record.departmentId,
                    designationId: record.designationId,
                    divisionId: record.divisionId,
                    divisionName: record.divisionName,
                    branch_id: record.branch_id,
                    branches: record.branches,
                    shiftType: record.shiftType,
                    department: record.department,
                    empCode: record.empCode,
                });
            }
        });
        if (updatedRecords.length === 0) {
            if (!hasInputValues) {
                message.warning("No Data Selected");
            } else {
                message.warning("No Records to Update");
            }
            return;
        }
        updateOt(updatedRecords);
    };

    const getData = () => {
        const dept = form.getFieldValue('departmentId')
        const date = form.getFieldValue('date')
        const shift = form.getFieldValue('shiftId')
        const employeeId = form.getFieldValue('employeeId')
        const branchId = form.getFieldValue('branchId') === "ALL" ? null : form.getFieldValue('branchId')
        const divisionId = form.getFieldValue('divisionName')
        if (date != undefined) {
            const req = new OTBulkApprovalReq()
            req.date = dayjs(date).format('YYYY-MM-DD')
            req.shiftId = shift
            req.departmentId = dept
            req.employeeId = employeeId
            req.reportType = 'OT'
            req.reportType = undefined
            req.branchId = branchId
            req.divisionId = divisionId
            getAllForBulkOTApplyApprove(req)
        } else {
            date ? '' : form.setFields([{ name: 'date', errors: ['Please Select Attendance Date'] },])
        }
    }

    const onReset = () => {
        const currentBranch = form.getFieldValue('branchId');
        form.resetFields();
        setData([])
        form.setFieldsValue({ branchId: currentBranch })
        setInputChange(false)
        setOtVal(undefined)
        setBulkOtHours("")
        setSelectedRowKeys([])
        setSelectedRowKeysData([])
    }

    return (
        <PageContainer title='OT Apply' breadcrumbRender={false}>
            <Form form={form} onFinish={onApprove} layout="vertical">
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
                    <Col xs={24} sm={12} md={8} lg={4} xl={3}>
                        <Form.Item name={'date'} label={'Date'} rules={[{ required: true, message: 'Date is Required' }]}>
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name={'departmentId'} label={'Department'} >
                            <Select placeholder='Select Department' showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children">
                                {deptData?.map(dept => {
                                    return <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={6} style={{ paddingTop: '23px' }}>
                        <Button color="primary" variant="outlined" onClick={getData} style={{ marginRight: '8px' }}>Submit</Button>
                        <Button onClick={onReset} color="danger" variant="outlined" style={{ marginRight: '8px' }}>Reset</Button>

                        <>
                        </>
                    </Col>

                </Row>
                <Row>
                    {selectedRowKeysData.length > 0 && (
                        <>
                            <Col span={4}>
                                <Form.Item name={'reason'} label={'Reason'} >
                                    <Input
                                        placeholder="Enter Reason"
                                        allowClear
                                        onChange={handleBulkReasonChange}
                                    />
                                </Form.Item>
                            </Col>&nbsp;&nbsp;
                            <Col span={4}>
                                <Form.Item name={'editedFinalOtHours'} label={'Final OT Hours'}>
                                    {selectedRowKeysData.length > 0 && (
                                        <TimePicker
                                            placeholder="Enter Final OT Hours"
                                            value={bulkOtHours}
                                            onChange={handleBulkOtChange}
                                            format="HH:mm"
                                            minuteStep={30}
                                            style={{ width: '100%' }}
                                            disabledMinutes={() => {
                                                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                                                    21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                                                    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>&nbsp;&nbsp;
                        </>
                    )}
                    <Col span={4} style={{ paddingTop: '23px', marginBottom:'5px' }}>
                        <Button htmlType="submit" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} type="primary">Apply</Button>
                    </Col>
                </Row>
                <Table
                    bordered
                    columns={columns}
                    dataSource={data}
                    rowSelection={rowSelection}
                    size="small"
                    scroll={{ y: 'calc(100vh - 130px)' }}
                    rowKey={(record) => record.employeeId}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                    }}
                />
            </Form>
        </PageContainer>
    );
}
export default BulkOtApproval