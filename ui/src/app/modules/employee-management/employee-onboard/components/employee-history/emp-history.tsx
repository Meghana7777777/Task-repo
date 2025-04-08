import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { EmpDataReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, EmployeeOnboardingService, LeaveAllocationService } from '@hrexpert/shared-services';
import { Button, Card, Col, Collapse, Descriptions, Form, Input, message, Row, Select, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { ColumnsType } from 'antd/es/table';
interface EmpHistoryProps {
    scopes: ScopesEnum[]
}
interface DataType {
    key?: React.Key;
    type?: string;
    title?: string;
    fixed?: string;
    width?: number;
    dataIndex?: any
    align?: any
    render?: any
    filterDropdown?: any
    filterIcon?: any
    onFilter?: any
}
dayjs.extend(duration);
const { Panel } = Collapse;
const EmpHistory = (props: EmpHistoryProps) => {
    const [page, setPage] = useState(1);
    const [employeeData, setEmployeeData] = useState([])
    const service = new EmployeeOnboardingService()
    const branchesService = new BranchesService();
    const [branches, setBranches] = useState<any>([]);
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [form] = Form.useForm()
    const Option = Select
    const [employees, setEmployees] = useState<any>([]);

    useEffect(() => {
        getBranches()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
        // if (IAMClientAuthContext.user.roles === "SuperAdmin") {
        //     getAllActiveEmpDropDown(undefined)
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
        if (IAMClientAuthContext.user.roles !== "SuperAdmin") {
            getSingleEmployeeDetails()
        }
    }, [])

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

    const getBranches = () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const getEmployeeDetails = () => {
        const req = new EmpDataReq()
        const formValues = form.getFieldsValue();
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null;
        } else {
            req.branchId = formValues.branchId;
        }
        if (formValues.employeeId) {
            req.employeeId = formValues.employeeId
        }
        service.getEmpHistoryDetials(req).then((res) => {
            if (res.status) {
                setEmployeeData(res.data);
            } else {
                message.error(res.internalMessage);
                setEmployeeData([])
            }
        })
    }

    const getSingleEmployeeDetails = () => {
        const req = new EmpDataReq()
        req.branchId = IAMClientAuthContext.user.unitId
        req.employeeId = Number(IAMClientAuthContext.user.employeeId)
        service.getEmpHistoryDetials(req).then((res) => {
            if (res.status) {
                setEmployeeData(res.data);
            } else {
                message.error(res.internalMessage);
                setEmployeeData([])
            }
        })
    }

    const employeeColumns: TableColumnsType<DataType> = [
        {
            title: 'S No',
            key: 'sno',
            width: '70px',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "Employee Name",
            fixed: 'left',
            align: "center",
            dataIndex: "fullName",
            width: 200,
        },
        {
            title: "Employee Code",
            fixed: 'left',
            align: "center",
            dataIndex: "employeeCode",
            width: 150,
        },
        {
            title: "Branch",
            dataIndex: "branchName",
            align: "center",
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            align: "center",
        },
        {
            title: "Designation",
            dataIndex: "designationName",
            align: "center",
        },
        {
            title: "Division",
            dataIndex: "divisionName",
            align: "center",
        },
        {
            title: "Date Of Birth",
            dataIndex: "dateOfBirth",
            align: "center",
            render: (t) => (t ? dayjs(t).format("DD-MM-YYYY") : "-")
        }
    ];

    const historyColumns: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            width: 70,
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "Type",
            fixed: "left",
            dataIndex: "type",
            width: 200,
            align: "center",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Type"
                        value={selectedKeys[0] || ""}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 180, marginBottom: 8, display: "block" }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            setSelectedKeys([]);
                            confirm();
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
            ),
            onFilter: (value, record) =>
                record.type?.toString().toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            title: "Description",
            fixed: 'left',
            align: "center",
            dataIndex: "description",
            width: 350,
            render: (text) => (
                <div>
                    {text.split("\n").map((item, index) => (
                        <div key={index}>&bull; {item}</div>
                    ))}
                </div>
            ),
        },
        {
            title: "Impact On Business",
            fixed: 'left',
            align: "center",
            dataIndex: "impactOnBussiness",
            width: 100,
        },
        {
            title: "Created On",
            fixed: 'left',
            align: "center",
            dataIndex: "createdAt",
            width: 80,
            render: (t) => {
                if (!t) return "-";
                const [year, month, day] = t.split("T")[0].split("-");
                return `${day}-${month}-${year}`;
            }
        }

    ];

    const onReset = () => {
        form.resetFields()
        setEmployeeData([])
    }

    return (
        <>
            <PageContainer title='Employee History' breadcrumbRender={false}>
                <Form layout='vertical' onFinish={getEmployeeDetails} form={form}>
                    <Row gutter={[8, 8]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item label={'Branch'} name='branchId'
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'ALL' : Number(IAMClientAuthContext.user.unitId)}
                            >
                                <Select disabled={role === 'SuperAdmin' ? false : true} placeholder="Select branch" showSearch allowClear optionFilterProp="children" dropdownMatchSelectWidth={false}
                                    onChange={(value) => getAllActiveEmpDropDown(value)}

                                >
                                    <Option value={''}> ALL </Option>
                                    {branches.map((br) => (
                                        <Option key={br.id} value={br.id}>
                                            {br.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item label='Employee Name' name='employeeId'
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? '' : Number(IAMClientAuthContext.user.employeeId)}
                            >
                                <Select disabled={role === 'SuperAdmin' ? false : true} showSearch allowClear dropdownMatchSelectWidth={false}
                                    optionFilterProp="children" placeholder="Select Employee Name">
                                    {employees?.map((emp: any) => (
                                        <Option key={emp.id} value={emp.id}>
                                            {emp.fullName}-{emp.empCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {IAMClientAuthContext.user.roles === "SuperAdmin" ? <>
                            <Col xs={24} sm={12} md={8} lg={2} xl={6} style={{ marginTop: "23px" }}>
                                <Button color="primary" variant="outlined" htmlType='submit' >Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button danger onClick={onReset}>Reset</Button>
                            </Col></> : <></>}
                    </Row>
                </Form >
            {employeeData.length > 0 && (
                <Table
                    size="small"
                    columns={employeeColumns}
                    dataSource={employeeData}
                    bordered
                    expandable={{
                        expandedRowRender: (employee) => (
                            <Card style={{ backgroundColor: "white", color: "black" }}>
                                <Descriptions column={2} bordered>
                                    <Descriptions.Item label="Employee Code">{employee.employeeCode}</Descriptions.Item>
                                    <Descriptions.Item label="Branch">{employee.branchName}</Descriptions.Item>
                                    <Descriptions.Item label="Department">{employee.departmentName}</Descriptions.Item>
                                    <Descriptions.Item label="Designation">{employee.designationName}</Descriptions.Item>
                                    <Descriptions.Item label="Division">{employee.divisionName}</Descriptions.Item>
                                    <Descriptions.Item label="Email Id">{employee.emailId}</Descriptions.Item>
                                    <Descriptions.Item label="Date of Joining">
                                        {employee.dateOfJoining ? dayjs(employee.dateOfJoining).format("DD-MM-YYYY") : "-"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Experience">
                                        {employee.dateOfJoining
                                            ? (() => {
                                                const startDate = dayjs(employee.dateOfJoining);
                                                const today = dayjs();
                                                const diff = dayjs.duration(today.diff(startDate));
                                                return `${diff.years()}y ${diff.months()}m ${diff.days()}d`;
                                            })()
                                            : "-"}
                                    </Descriptions.Item>
                                </Descriptions>
                                {employee.memos && employee.memos.length > 0 && (
                                    <Collapse>
                                        <Panel style={{ backgroundColor: "#00ABE4" }} header="View History" key={employee.employeeCode}>
                                            <Table
                                                columns={historyColumns}
                                                dataSource={employee.memos.map((memo, memoIndex) => ({
                                                    key: memoIndex,
                                                    sno: memoIndex + 1,
                                                    type: memo.type,
                                                    description: memo.description,
                                                    impactOnBussiness: memo.impactOnBussiness,
                                                    createdAt: memo.createdAt,
                                                }))}
                                                bordered
                                                size="small"
                                                pagination={false}
                                            />
                                        </Panel>
                                    </Collapse>
                                )}
                            </Card>
                        ),
                    }}
                    rowKey="employeeCode"
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                    }}
                />
            )}
            </PageContainer>

        </>
    );
}
export default EmpHistory