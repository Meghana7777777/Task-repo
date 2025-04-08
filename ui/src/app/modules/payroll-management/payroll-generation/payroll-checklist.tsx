import { CheckCircleOutlined } from '@ant-design/icons'
import { EmpDataReq, PayrollProcessedLogReq } from '@hrexpert/shared-models'
import { BranchesMappingSharedService, BranchesService, DivisionService, EmployeeTypeService, LeaveAllocationService, PayrollCheklistSharedService, PayrollProcessedLogsService } from '@hrexpert/shared-services'
import { Button, Card, Checkbox, Col, DatePicker, Divider, Form, message, Row, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useIAMClientState } from '../../../common/iam-client-react'
const { Title, Text } = Typography;
const Option = Select

const checklistItems = [
    { title: "Verify Employee Details", key: 'employeeCheck', description: "Ensure all employees are correctly registered in the payroll system." },
    { title: "Check Attendance & Adjustments", key: 'attendanceCheck', description: "Review attendance logs and attendance adjustments." },
    { title: "Leaves & Collision track", key: 'leavesCheck', description: "Review approved leaves, and overtime records." },
    { title: "Validate Salary & Deductions", key: 'salaryCheck', description: "Confirm salary components, deductions, and benefits." },
    { title: "Review Payroll Report", key: 'payrollCheck', description: "Double-check payroll calculations before final processing." },
];

const PayrollCheckList = () => {
    const service = new PayrollCheklistSharedService()
    const [payData, setPayData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [branches, setBranches] = useState<any>([]);
    const branchesService = new BranchesService();
    const [form] = Form.useForm()
    const branchesMappingService = new BranchesMappingSharedService()
    const [divisions, setDivisions] = useState<any>([]);
    const divisionService = new DivisionService()
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const empTypeService = new EmployeeTypeService()
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [branchesMappingData, setBranchesMappingData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [filteredDivisions, setFilteredDivisions] = useState<{ id: number; divisionName: string }[]>([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        getBranches();
        getAllDivision();
        getEmployeeTypes();
        getBranchMapping();

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
        setPayData([])
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

    const handleBranchChange = (branchId: number) => {
        setSelectedBranch(branchId);
        const uniqueDivisions = Array.from(
            new Map(
                branchesMappingData
                    .filter(branch => branch.branchId === branchId)
                    .map(branch => [branch.divisionId, { id: branch.divisionId, divisionName: branch.divisionName }])
            ).values()
        );
        setFilteredDivisions(uniqueDivisions);
        form.setFieldsValue({ payrollMonth: null }); // Reset payroll month
        setCheckedItems([]); // Clear checklist on branch change
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

    const getEmployeeTypes = async () => {
        const res = await empTypeService.getActiveEmployeeType()
        setEmployeeTypes(res.data)
    }

    const getBranches = async () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data);
            } else {
                message.error(res.internalMessage || 'Failed to fetch branches.');
            }
        }).catch((err) => {
            console.error('Error:', err);
            message.error('An error occurred while fetching branches.');
        });
    }

    const toggleItem = (item) => {
        setCheckedItems((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const handleSubmit = async () => {
        if (!selectedBranch || !form.getFieldValue("payrollMonth")) {
            message.warning("Please select a branch and payroll month.");
            return;
        }

        const requestData = {
            branchId: selectedBranch,
            payrollMonth: form.getFieldValue("payrollMonth")?.format('YYYYMM'),
            ...Object.fromEntries(checklistItems.map(item => [item.key, checkedItems.includes(item.key) ? "YES" : "NO"]))
        };

        try {
            setLoading(true);
            const response = await service.saveOrUpdateChecklist(requestData);
            if (response.status) {
                message.success("Payroll checklist submitted successfully!");
                setSubmitted(true);
            } else {
                message.error(response.internalMessage || "Failed to submit checklist.");
            }
        } catch (error) {
            console.error("API Error:", error);
            message.error("An error occurred while submitting.");
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (date: moment.Moment | null) => {
        const selectedMonth = date ? date.format('YYYYMM') : null;
        if (selectedBranch && selectedMonth) {
            fetchChecklist(selectedBranch, selectedMonth);
        }
    };

    const fetchChecklist = async (branchId: number, payrollMonth: string) => {
        try {
            const response = await service.getChecklist({ branchId: branchId, payrollMonth: payrollMonth });
            const data = await response.data;
            if (data && data.id) {
                setCheckedItems(
                    checklistItems.filter(item => data[item.key] === "YES").map(item => item.key)
                );
            } else {
                setCheckedItems([]); // No data found, reset checklist
            }
        } catch (error) {
            console.error("Error fetching checklist:", error);
            setCheckedItems([]);
        }
    };


    return (
        <Card title={'Payroll Checklist'}>
            <Form layout='vertical' form={form}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8} lg={2} xl={4}>
                        <Form.Item
                            name="branchId"
                            label="Branch"
                            rules={[{ required: true, message: 'Please select a branch!' }]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select a Branch"
                                filterOption={(input, option) =>
                                    (option?.children as any).toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleBranchChange}
                            >
                                {branches.map((branch) => (
                                    <Select.Option key={branch.id} value={branch.id}>{branch.branchName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label='Month' name='payrollMonth' rules={[{ required: true, message: 'Please Select Month!' }]}>
                            <DatePicker onChange={handleMonthChange} picker="month" style={{ width: "100%" }} placeholder='Select Month' />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row gutter={8}>
                    <Col span={2}>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                    </Col>
                    <Col span={2}>
                        <Button danger onClick={onReset}>Reset</Button>
                    </Col>
                </Row> */}
            </Form>
            <Divider />
            <Card title={<Title level={4}><CheckCircleOutlined style={{ color: "green" }} /> Payroll Checklist</Title>} bordered>
                {checklistItems.map((item) => (
                    <div key={item.key} style={{ marginBottom: "12px" }}>
                        <Checkbox
                            checked={checkedItems.includes(item.key)}
                            onChange={() => toggleItem(item.key)}
                        >
                            <Text strong>{item.title}</Text>
                        </Checkbox>
                        <p style={{ marginLeft: "24px", color: "#666" }}>{item.description}</p>
                    </div>
                ))}
                <Button
                    type="primary"
                    block
                    onClick={handleSubmit}
                    disabled={!checkedItems.length}>
                    Submit Checklist
                </Button>

                {submitted && <p style={{ marginTop: "12px", color: "green" }}>✔ Payroll checklist submitted successfully!</p>}
            </Card>
        </Card>
    )
}

export default PayrollCheckList