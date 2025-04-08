import { PageContainer } from "@ant-design/pro-layout"
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService, PayrollComponentsSharedService, PayrollRecordsSharedService } from "@hrexpert/shared-services"
import { Button, Card, Col, Form, Modal, Row, Select, Table } from "antd"
import { ColumnProps } from "antd/es/table"
import { useEffect, useState } from "react"
import { useIAMClientState } from "../../../common/iam-client-react"
import { BranchReq } from "@hrexpert/shared-models"
import { UndoOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import React from "react"
import { create } from "domain"

const EmpNonRecTermsLogs = () => {
    const [form] = Form.useForm();
    const Option = Select
    const [logsData, setLogsData] = useState<any>([]);
    const [loading, setLoading] = useState(false)
    const payrollRecordsSharedService = new PayrollRecordsSharedService()
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const branchService = new BranchesService()
    const employeeDetails = new EmployeeOnboardingService()
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const [components, setComponents] = useState<any>([])
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const departmentService = new DepartmentService()
    const [page, setPage] = React.useState(1);
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openModal2, setOpenModal2] = useState<boolean>(false)
    const [previousrecord, setPreviousRecord] = useState<any>([]);
    const [updateRecord, setUpdateRecord] = useState<any>({});

    useEffect(() => {
        getAllPayrollNonRecurringComponents()
        getAllDepartments();
        getDesignations();
        getAllDivision();
        getAllBranches()
        handleBranchChange(IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId))
        getTermLogs({})
    }, []);

    const getTermLogs = (values) => {
        setLogsData([])
        try {
            payrollRecordsSharedService.getTermLogs(values).then((res) => {
                if (res.status) {
                    setLogsData(res.data);
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



    const columns: ColumnProps<any>[] = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: "Role",
            dataIndex: 'role',
        },
        {
            title: "User",
            dataIndex: 'updatedUser',
        },
        {
            title: "Created At",
            dataIndex: 'createdAt',
            width: "100px",
            render: (x) => (
                dayjs(x).format('YYYY-MM-DD')
            ),
        },
        {
            title: "Payroll employee",
            dataIndex: 'employee',
        },
        {
            title: "Payroll component",
            dataIndex: 'component',
        },
        {
            title: "Action Type",
            dataIndex: 'actionType',
        },
        {
            title: "Previous Values",
            dataIndex: 'previousValues',
            render: (x, record) => (
                <><Button disabled={record.actionType === 'CREATE'} onClick={() => { setOpenModal(true), setPreviousRecord(JSON.parse(x)) }} >View</Button></>
            ),

        },
        {
            title: "Updated Values",
            dataIndex: 'updatedValues',
            render: (x, record) => (
                <><Button onClick={() => { console.log(record, x, '------00--------'), setOpenModal2(true), setUpdateRecord(JSON.parse(x)) }} >View</Button></>
            ),
        }

    ]

    const reset = () => {
        setLogsData([])
        form.resetFields()
    }

    return (
        <>
            <PageContainer backIcon title={<span style={{ fontSize: '25px' }} >Deductions Terms Logs</span>} breadcrumbRender={false}>
                <Form layout='vertical' form={form} onFinish={getTermLogs}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branches"
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId)}>
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
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Division" name="divisionId">
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

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
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
                        </Col>


                    </Row>

                    <Row gutter={24} justify="start" style={{ marginTop: "16px", marginBottom: '1rem' }}>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button type="primary" htmlType="submit">
                                Get Logs
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={4} lg={2}>
                            <Button icon={<UndoOutlined />} htmlType="reset" type="dashed" danger onClick={reset}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    columns={columns}
                    dataSource={logsData}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                    }}
                    scroll={{ x: true }}
                    rowKey="id"
                    bordered />
            </PageContainer>

            <Modal
                width={1000}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
            >
                <Card>
                    <div>
                        {previousrecord && Array.isArray(previousrecord) && previousrecord.length > 0
                            ? previousrecord.map((item, index) => (
                                <div key={index}>
                                    {Object.keys(item).map((key) => (
                                        <p key={key}>
                                            <b>{key}:</b>{" "}
                                            {key.includes("Date") || key.includes("At")
                                                ? new Date(item[key]).toLocaleString()
                                                : item[key] !== null && item[key] !== undefined
                                                    ? item[key].toString()
                                                    : "N/A"}
                                        </p>
                                    ))}
                                </div>
                            ))
                            : <p>No data</p>}

                        {updateRecord
                            ? Object.keys(updateRecord).map((key) => (
                                <p key={key}>
                                    <b>{key}:</b>{" "}
                                    {key.includes("Date") || key.includes("At")
                                        ? new Date(updateRecord[key]).toLocaleString()
                                        : updateRecord[key] !== null && updateRecord[key] !== undefined
                                            ? updateRecord[key].toString()
                                            : "N/A"}
                                </p>
                            ))
                            : <p>No record selected</p>}

                    </div>
                </Card>
            </Modal>
            <Modal
                width={1000}
                open={openModal2}
                onCancel={() => setOpenModal2(false)}
                footer={null}
            >
                <Card>
                    <div>
                        {updateRecord
                            ? Object.keys(updateRecord).map((key) => (
                                <p key={key}>
                                    <b>{key}:</b>{" "}
                                    {key.includes("Date") || key.includes("At")
                                        ? new Date(updateRecord[key]).toLocaleString()
                                        : updateRecord[key] !== null && updateRecord[key] !== undefined
                                            ? updateRecord[key].toString()
                                            : "N/A"}
                                </p>
                            ))
                            : <p>No record selected</p>}

                    </div>
                </Card>
            </Modal>

        </>
    )
}

export default EmpNonRecTermsLogs