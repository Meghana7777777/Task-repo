import { EmpDataReq, PayrollProcessedLogReq } from '@hrexpert/shared-models'
import { BranchesMappingSharedService, BranchesService, DepartmentService, EmployeeTypeService, LeaveAllocationService, PayrollComponentsSharedService, PayrollProcessedLogsService } from '@hrexpert/shared-services'
import { Button, Card, Col, DatePicker, Form, message, Row, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useIAMClientState } from '../../../common/iam-client-react'
const Option = Select
const PayrollHeadWiseReport = () => {
    const service = new PayrollProcessedLogsService()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const [branches, setBranches] = useState<any>([]);
    const branchesService = new BranchesService();
    const [page, setPage] = React.useState(1);
    const [form] = Form.useForm()
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const branchesMappingService = new BranchesMappingSharedService()
    const [componentData, setComponentData] = useState<any>([])
    const leaveAllocationService = new LeaveAllocationService();
    const [employees, setEmployees] = useState<any>([]);
    const [departmentsData, setDepartments] = useState<any>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const empTypeService = new EmployeeTypeService()
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [branchesMappingData, setBranchesMappingData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [filteredDepartment, setFilteredDepartment] = useState<{ id: number; departmentName: string }[]>([]);
    const deptService = new DepartmentService()
    useEffect(() => {
        getBranches();
        getAllPayrollComponents()
        getEmployeeTypes();
        getBranchMapping();
        getDepartments()
        getAllPayrollHeadWiseReport()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            getAllActiveEmpDropDown(undefined)
        }
        else {
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        }

    }, []);

    const getDepartments = async () => {
        const res = await deptService.getActiveDepartments();
        setDepartments(res.status ? res.data : []);
    };

    const getBranches = async () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data);
            } else {
                message.error(res.internalMessage || 'Failed to fetch branches.');
            }
        }).catch((err) => {
            console.error('Error:', err);
        });
    }

    const getAllPayrollComponents = () => {
        try {
            payrollComponentsSharedService.getAllPayrollComponents().then((res) => {
                if (res.status) {
                    setComponentData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getBranchMapping = () => {
        try {
            branchesMappingService.getBranchMapping().then((res) => {
                if (res.status) {
                    setBranchesMappingData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId) => {
        setSelectedBranch(branchId);
        const departments = branchesMappingData
            .filter(branch => branch.branchId === branchId)
            .map(branch => ({ id: branch.departmentId, departmentName: branch.departmentName }));
    };

    const getEmployeeTypes = async () => {
        const res = await empTypeService.getActiveEmployeeType()
        setEmployeeTypes(res.data)
    }

    const getAllActiveEmpDropDown = async (branchId) => {
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getAllPayrollHeadWiseReport = () => {
        const req = new PayrollProcessedLogReq()
        const formValues = form.getFieldsValue();
        if (formValues.payrollMonth) {
            const startMonthYear = formValues.payrollMonth?.format('YYYYMM');
            req.payrollMonth = Number(startMonthYear);
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null;
        } else {
            req.branchId = formValues.branchId;
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId
        }
        if (formValues.employeeTypeId) {
            req.employeeTypeId = formValues.employeeTypeId
        }
        setLoading(true)
        try {
            service.getAllPayrollHeadWiseReport(req).then((res) => {
                if (res.status) {
                    setData(res.data)
                    setShowColumns(true);
                    setLoading(false)
                } else {
                    setData([])
                    setLoading(false)
                    setShowColumns(false);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const generateColumns = (data: any) => {
        const baseColumns = [
            {
                title: 'S No',
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: "center",
                fixed: 'left',
            },
            {
                title: "Department",
                dataIndex: "departmentName",
                sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
                sortDirections: ['ascend', 'descend'],
            },
        ];

        const allComponentKeys = Array.from(new Set(
            data.flatMap(item => {
                try {
                    const componentRecords = JSON.parse(item.componentRecords);
                    return componentRecords ? Object.keys(componentRecords) : [];
                } catch (error) {
                    console.error("Error parsing componentRecords:", error);
                    return [];
                }
            })
        ));

        const getComponentColumns = (type: string) => {
            return allComponentKeys.map(key => {
                const componentType = componentData.find(rec => rec.columnName === key)?.componentType;
                if (componentType === type) {
                    return {
                        title: key,
                        dataIndex: key,
                        key,
                        align: "center",
                        render: (text) => text ? text : '0',
                    };
                }
                return null;
            }).filter(Boolean);
        };

        const earningColumns = getComponentColumns('EARNING');
        const deductionColumns = getComponentColumns('DEDUCTION');
        const grossColumn = allComponentKeys.includes('Gross') ? [{
            title: 'Gross',
            dataIndex: 'Gross',
            key: 'Gross',
            align: "center",
        }] : [];

        const TotalEarningsColumn = allComponentKeys.includes('Total Earnings') ? [{
            title: 'Total Earnings',
            dataIndex: 'Total Earnings',
            key: 'Total Earnings',
            align: "center",
        }] : [];

        const TotalCTCColumn = allComponentKeys.includes('CTC') ? [{
            title: 'CTC',
            dataIndex: 'CTC',
            key: 'CTC',
            align: "center",
        }] : [];

        const TotalDeductionColumn = allComponentKeys.filter(key => key === 'Total Deductions' || key === 'Net Payable').map(key => ({
            title: key,
            dataIndex: key,
            key,
            align: "center",
        }));

        const groupedEarningColumns = earningColumns.length > 0 ? [{
            title: 'Earnings',
            children: earningColumns,
            align: "center",
        }] : [];

        const groupedDeductionColumns = deductionColumns.length > 0 ? [{
            title: 'Deductions',
            children: deductionColumns,
            align: "center",
        }] : [];

        return [
            ...baseColumns,
            ...grossColumn,
            ...groupedEarningColumns,
            ...TotalEarningsColumn,
            ...groupedDeductionColumns,
            ...TotalDeductionColumn,
            ...TotalCTCColumn
        ];
    };

    const generateDataSource = (data) => {
        const allKeys = new Set();
        data.forEach(item => {
            try {
                const componentRecords = JSON.parse(item.componentRecords)
                Object.keys(componentRecords).forEach(key => {
                    allKeys.add(key)
                });
            } catch (error) {
                console.error("Error in ComponentRecords", error);
            }
        });
        const expectedKeys = Array.from(allKeys);
        return data.map(item => {
            let components = {};
            try {
                components = JSON.parse(item.componentRecords) || {}
            } catch (error) {
                console.error("Error parsing componentRecords:", error);
            }
            expectedKeys.forEach((key: any) => {
                if (!(key in components)) {
                    components[key] = null;
                }
            });
            return {
                key: item.id,
                ...item,
                ...components,
            };
        });
    };

    const columns: any = generateColumns(data)
    const dataSource = generateDataSource(data)
    const onReset = () => {
        const currentBranch = form.getFieldValue('branchId');
        form.resetFields();
        form.setFieldsValue({ branchId: currentBranch })
    }
    return (
        <Card title={'Dept-Wise Payroll Report'}>
            <Form layout='vertical' onFinish={getAllPayrollHeadWiseReport} form={form}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8} lg={2} xl={4}>
                        <Form.Item
                            name="branchId"
                            label="Branch"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select a Branch"
                                filterOption={(input, option) =>
                                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleBranchChange}
                                options={branchesMappingData
                                    .reduce((acc, branch) => {
                                        if (!acc.some((b) => b.value === branch.branchId)) {
                                            acc.push({ label: branch.branchName, value: branch.branchId });
                                        }
                                        return acc;
                                    }, [] as { label: string; value: number }[])
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item label='Month' name='payrollMonth' >
                            <DatePicker picker="month" style={{ width: "100%" }} placeholder='Select Month' />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label="Department" name="departmentId">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Department"
                                optionFilterProp="children"
                                dropdownMatchSelectWidth={false}
                            >
                                {departmentsData.map((rec) => (
                                    <Select.Option value={rec.deptId} key={rec.deptId}>
                                        {rec.deptName}
                                    </Select.Option>
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
                </Row>
                <Row gutter={8}>
                    <Col span={2}>
                        <Button type='primary' htmlType='submit' variant="outlined" color="primary">Submit</Button>
                    </Col>
                    <Col span={2}>
                        <Button danger onClick={onReset}>Reset</Button>
                    </Col>
                </Row>
            </Form>

            {showColumns && (
                <>
                    <br />
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={generateDataSource(dataSource)}
                            scroll={{ x: 'max-content' }}
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                },
                            }}
                        />
                    </Card>
                </>
            )}
        </Card>
    )
}

export default PayrollHeadWiseReport