import { EditOutlined } from '@ant-design/icons';
import { EmpDataReq, PayrollProcessedLogReq } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeTypeService, LeaveAllocationService, PayrollComponentsSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Modal, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIAMClientState } from '../../../common/iam-client-react';
import EmployeePayrollCompForm from './employe-payroll-componet-form';

const EmployeePayrollComponent = () => {
    const [payrollCompData, setPayrollCompData] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [desginations, setDesginations] = useState<any>([]);
    const [divisions, setDivisons] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [employees, setEmployees] = useState<any>([]);
    const service = new PayrollRecordsSharedService();
    const [form] = Form.useForm()
    const { RangePicker } = DatePicker
    const Option = Select
    const empTypeService = new EmployeeTypeService()
    const [employeeTypes, setEmployeeTypes] = useState([])
    const payrollComponentsService = new PayrollComponentsSharedService()
    const [payrollComponents, setPayrollComponents] = useState([])
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const leaveAllocationService = new LeaveAllocationService();
    const divisionService = new DivisionService();
    const deptService = new DepartmentService()
    const designService = new DesignationsService()
    const branchService = new BranchesService()
    const navigate = useNavigate()

    const getEmployeeTypes = async () => {
        const res = await empTypeService.getActiveEmployeeType()
        setEmployeeTypes(res.data)
    }

    const getPayrollComponentsByOrder = async () => {
        const res = await payrollComponentsService.getPayrollComponentsByOrder()
        setPayrollComponents(res.data)
    }

    useEffect(() => {
        // getEmployeePayrollCompData();
        getEmployeeTypes()
        getPayrollComponentsByOrder()
        getDivisions();
        getDepartments()
        getDesignations()

        getAllBranches()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            //getAllActiveEmpDropDown(undefined)
        }
        else {
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        }

    }, []);


    const getDivisions = async () => {
        const res = await divisionService.getAllActiveDivisions();
        setDivisons(res.status ? res.data : []);
    };

    const getDepartments = async () => {
        const res = await deptService.getActiveDepartments();
        setDepartments(res.status ? res.data : []);
    };

    const getDesignations = async () => {
        const res = await designService.getDesignations();
        setDesginations(res.status ? res.data : []);
    };

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
    const getAllActiveEmpDropDown = async (branchId) => {

        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getEmployeePayrollCompData = () => {
        const req = new PayrollProcessedLogReq()
        const formValues = form.getFieldsValue();
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        if (formValues.status) {
            req.status = formValues.status
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null; // "ALL" translates to null
        } else {
            req.branchId = formValues.branchId; // Send selected branch ID
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId
        }
        if (formValues.designationId) {
            req.designationId = formValues.designationId
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId
        }
        if (formValues.employeeTypeId) {
            req.employeeTypeId = formValues.employeeTypeId
        }
        req.isActive = 1
        setLoading(true)
        try {
            setLoading(true)
            service.getPayrollRecords(req).then((res) => {
                if (res.status) {
                    setPayrollCompData(res.data)
                    setLoading(false)
                    setOpenModal(false);
                }
                else {
                    setPayrollCompData([])
                    setLoading(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleEditClick = (record) => {
        setSelectedRecord(record);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRecord(null);
    };

    const generateColumns = (data: any) => {

        const orderMap = payrollComponents.reduce((acc, item) => {
            acc[item.columnName] = item.columnOrder;
            return acc;
        }, {});
        const baseColumns = [
            {
                title: 'S No',
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: "center"
            },
            {
                title: "Employee Code",
                dataIndex: "employeeCode",
                fixed: "left",
            },
            {
                title: "Employee Name",
                dataIndex: "employeeName",
                fixed: "left",
            },
            {
                title: "Branch",
                dataIndex: "branchName",
                fixed: "left",
            },
            {
                title: "Department",
                dataIndex: "departmentName",
                fixed: "left",
            },
            {
                title: "Designation",
                dataIndex: "designationName",
            },
            {
                title: "Employee Type",
                dataIndex: "employeeTypeName",
            },
        ];

        const dynamicColumns =
            data[0]?.componentKeys
                ?.map((component: any) => {
                    const key = Object.keys(component)[0];
                    return {
                        title: key,
                        dataIndex: key,
                        key,
                    };
                })
                ?.sort((a, b) => (orderMap[a.title] || Infinity) - (orderMap[b.title] || Infinity)) || [];


        const actionColumns = [
            {
                title: 'Actions',
                key: 'actions',
                fixed: 'right',
                align: "center",
                width: '100px',
                render: (text, record, index) => {
                    return (
                        <EditOutlined
                            style={{ fontSize: '15px', color: '#1890ff' }}
                            onClick={() => handleEditClick(record)}

                        />
                    );
                }
            }
        ]
        return [...baseColumns, ...dynamicColumns, ...actionColumns];
    };

    const generateDataSource = (data: any) => {
        return data.map((item: any) => {
            const components = item.componentKeys?.reduce((acc: any, component: any) => {
                const key = Object.keys(component)[0];
                acc[key] = component[key];
                return acc;
            }, {}) || {};

            return {
                key: item.id,
                ...item,
                ...components,
            };
        });
    };

    const columns: any = generateColumns(payrollCompData);
    const dataSource = generateDataSource(payrollCompData);

    const onReset = () => {
        form.resetFields(["divisionId"]);
        form.resetFields(["departmentId"]);
        form.resetFields(["designationId"]);
        form.resetFields(["employeeTypeId"]);
        form.resetFields(["employeeName"]);
        form.resetFields(["status"]);
        form.setFieldsValue({ branchId: "ALL" });
        setPayrollCompData([])
    }

    return (
        <div>
            <Card title={<span>Employee Salary Breakdown</span>}
                extra={<Button variant='outlined' color='danger' onClick={() => { navigate('/employee-payroll-component-logs') }}>Logs</Button>}>

                <Form onFinish={getEmployeePayrollCompData} form={form} layout="vertical">
                    <Row gutter={[24, 4]}>
                        <Col span={4}>
                            <Form.Item label='Branch' name='branchId'>
                                <Select placeholder='Select Branch' allowClear showSearch
                                    disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children"
                                    onChange={(value) => getAllActiveEmpDropDown(value)}
                                >
                                    <Option value={''}> ALL </Option>
                                    {branches?.map((rec: any) => {
                                        return <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='Employee Name' name='employeeName'>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                    optionFilterProp="children" placeholder="Select Employee Name"  >
                                    {employees?.map((emp: any) => (
                                        <Option key={emp.id} value={emp.id}>
                                            {emp.fullName}-{emp.empCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='Employee Type' name='employeeTypeId'>
                                <Select placeholder='Select Employee Type' allowClear showSearch
                                    optionFilterProp="children"
                                >
                                    {employeeTypes?.map((rec: any) => {
                                        return <Option value={rec.id} key={rec.id}>{rec.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='Division' name='divisionId'>
                                <Select placeholder='Select Division' allowClear showSearch
                                    optionFilterProp="children"
                                >
                                    {divisions?.map((rec: any) => {
                                        return <Option value={rec.divisionId} key={rec.divisionId}>{rec.divisionName}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label='Departments' name='departmentId'>
                                <Select placeholder='Select Departments' allowClear showSearch
                                    optionFilterProp="children"
                                >
                                    {departments?.map((res: any) => {
                                        return <Option key={res.deptId} value={res.deptId}>
                                            {res.deptName}
                                        </Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='Designation' name='designationId'>
                                <Select placeholder='Select Designation' allowClear showSearch
                                    optionFilterProp="children"
                                >
                                    {desginations?.map((res: any) => {
                                        return <Option key={res.des_id} value={res.des_id}>
                                            {res.des_name}
                                        </Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={3}>
                            <Form.Item label="Status" name="status">
                                <Select placeholder="Select Status" allowClear>
                                    <Option value="FINAL">FINAL</Option>
                                    <Option value="PENDING">PENDING</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button htmlType="submit" style={{ marginTop: "23px" }} color="primary" variant="outlined">Submit</Button>
                        </Col>
                        <Col>
                            <Button onClick={onReset} style={{ marginTop: "23px" }} danger>Reset</Button>
                        </Col>
                    </Row>
                </Form>

                {(payrollCompData.length > 0 ? <> <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                            setPageSize(pageSize)
                        },
                    }}
                    style={{ marginTop: '1rem' }}
                /></> : <></>)}

                <Modal
                    open={openModal}
                    onCancel={handleCloseModal}
                    footer={null}
                    width='600px'
                >
                    <EmployeePayrollCompForm record={selectedRecord} openModal={openModal} />
                </Modal>
            </Card>
        </div>
    );
};

export default EmployeePayrollComponent;
