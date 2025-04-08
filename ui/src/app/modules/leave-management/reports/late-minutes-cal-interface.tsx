import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Select, Table, Typography, Badge, Row, Col, message, DatePicker } from 'antd';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { EmpDataReq, lateMinReq, ScopesEnum } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, LeaveAllocationService, LeavePolicyService } from '@hrexpert/shared-services';
import { useIAMClientState } from '../../../common/iam-client-react';
import { SequenceUtils } from '../../../common/utils';
import dayjs from 'dayjs';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

interface LeaveAllocationViewProps {
    PropsScopes: ScopesEnum[];
}

const LateMinutescalculationInterface = (props: LeaveAllocationViewProps) => {
    const { PropsScopes } = props;
    const { IAMClientAuthContext } = useIAMClientState();
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<any[]>([]);
    const [empData, setEmpData] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100)

    const leaveAllocationService = new LeaveAllocationService();
    const divisionService = new DivisionService();
    const deptService = new DepartmentService();
    const designService = new DesignationsService();
    const branchService = new BranchesService();
    const attnService = new AttendanceServices()

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const branchRes = await branchService.getAllBranches();
                const divisionRes = await divisionService.getAllActiveDivisions();
                const deptRes = await deptService.getActiveDepartments();
                const designRes = await designService.getDesignations();

                // Error handling for each service call
                if (!branchRes.status) {
                    message.error(`${branchRes.internalMessage || 'Unknown error'}`);
                }
                if (!divisionRes.status) {
                    message.error(`${divisionRes.internalMessage || 'Unknown error'}`);
                }
                if (!deptRes.status) {
                    message.error(`${deptRes.internalMessage || 'Unknown error'}`);
                }
                if (!designRes.status) {
                    message.error(`${designRes.internalMessage || 'Unknown error'}`);
                }

                setBranches(branchRes.status ? branchRes.data.filter((res) => res.address === 'CORPORATE' || res.address === 'CORPORATE OFFICE') : []);
                setDivisions(divisionRes.status ? divisionRes.data : []);
                setDepartments(deptRes.status ? deptRes.data : []);
                setDesignations(designRes.status ? designRes.data : []);

                if (IAMClientAuthContext.user.roles === 'SuperAdmin') {
                    // form.setFieldsValue({ branchId: 'ALL' });
                } else {
                    form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId });
                }

                if (IAMClientAuthContext.user.roles !== 'SuperAdmin') {
                    await getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId);
                }
            } catch (error) {
                console.error('Error in fetchInitialData:', error);
                message.error('Failed to load initial data. Please try again.');
            }
        };

        fetchInitialData();
    }, [IAMClientAuthContext.user.roles, IAMClientAuthContext.user.unitId, form]);


    const getAllActiveEmpDropDown = async (branchId) => {
        try {
            const formValues = form.getFieldsValue();
            const req = new EmpDataReq(formValues.employeeId, formValues.departmentId, formValues.designationId, null, formValues.divisionId, branchId);
            const res = await leaveAllocationService.getAllActiveEmpDropDown(req);

            if (!res?.status) {
                message.error(`Failed to load employee dropdown: ${res?.internalMessage || 'Unknown error'}`);
                setEmpData([]);
                return;
            }

            setEmpData(res.data || []);
        } catch (error) {
            console.error('Error in getAllActiveEmpDropDown:', error);
            message.error('Failed to load employee dropdown. Please try again.');
            setEmpData([]);
        }
    };

    const RunLateMinuteCalculations = async () => {
        try {
            const formValues = form.getFieldsValue();
           // const date = dayjs(formValues.date).format('YYYY-MM-DD')
            const req = new lateMinReq(formValues.branchId, formValues.departmentId, formValues.employeeId, dayjs(formValues.date).format('YYYY-MM-DD'), formValues.designationId, formValues.divisionId);
            const res = await attnService.calculateLateMin(req);

            if (res?.status) {
                message.success(res.internalMessage);
            } else {
                message.error(`Failed to calculate Late Minutes`);
                return;
            }
        } catch (error) {
            console.error('Error in calculateLateMin:', error);
            message.error('Failed to calculate Late Minutes. Please try again.');
        }
    };

    return (
        <Card
            title={'Leave Allocation'}
        >
            <Form form={form} layout="vertical" onFinish={RunLateMinuteCalculations}>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item label="Branch" name="branchId">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                onChange={(value) => getAllActiveEmpDropDown(value)}
                            >
                                {branches.map((rec) => (
                                    <Option key={rec.id} value={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item label="Department" name="departmentId">
                            <Select
                                allowClear
                                placeholder="Select Department"
                                showSearch
                                optionFilterProp="children"
                            >
                                {departments.map((res) => (
                                    <Option key={res.deptId} value={res.deptId}>
                                        {res.deptName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item label="Division" name="divisionId">
                            <Select
                                allowClear
                                placeholder="Select Division"
                                showSearch
                                optionFilterProp="children"
                            >
                                {divisions.map((res) => (
                                    <Option key={res.divisionId} value={res.divisionId}>
                                        {res.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item label="Designation" name="designationId">
                            <Select
                                allowClear
                                placeholder="Select Designation"
                                showSearch
                                optionFilterProp="children"
                            >
                                {designations.map((rec) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item label="Employee Name" name="employeeId">
                            <Select
                                allowClear
                                placeholder="Select Employee"
                                showSearch
                                optionFilterProp="children"
                            >
                                {empData.map((emp) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Form.Item label="Date" name="date">
                            <DatePicker
                            style={{width:'100%'}}
                                format={'YYYY-MM-DD'}
                                disabledDate={(current) => current && current > moment().endOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end" gutter={16} style={{ marginTop: '16px' }}>
                    <Col>
                        <Button
                            icon={<RedoOutlined />}
                            htmlType='submit'
                            type="primary"
                        >
                            Calculate Late Minutes
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default LateMinutescalculationInterface;