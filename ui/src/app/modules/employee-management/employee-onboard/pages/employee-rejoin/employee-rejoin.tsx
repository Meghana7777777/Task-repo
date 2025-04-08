import { DashboardReq } from '@hrexpert/shared-models';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Descriptions, Form, message, Modal, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../../../common/iam-client-react';
const { Option } = Select;

const EmployeeRejoinModal = ({ open, onClose, onSelectEmployee, OnRejoinState }: any) => {
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const service = new EmployeeOnboardingService();
    const { IAMClientAuthContext } = useIAMClientState();
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            fetchEmployeeList();
        }
    }, [open]);

    const fetchEmployeeList = async () => {
        try {
            const req = new DashboardReq();
            if (IAMClientAuthContext.user?.roles === "SuperAdmin") {
                req.branchId = null;
            } else {
                req.branchId = IAMClientAuthContext.user?.unitId || null;
            }
            const response = await service.getInActiveEmployeeList(req);
            if (response.status) {
                setEmployeeList(response.data);
            } else {
                message.error(response.internalMessage);
            }
        } catch (error) {
            message.error('Failed to fetch employees.');
        }
    };

    const handleSelect = (value: number) => {
        const employee = employeeList.find((emp: any) => emp.id === value);
        setSelectedEmployee(employee);
    };

    const handleSubmit = () => {
        if (selectedEmployee) {
            onSelectEmployee(selectedEmployee.id);
            OnRejoinState()
            onClose();
        } else {
            message.warning('Please select an employee code.');
        }
    };

    return (
        <Modal
            title="Select Employee for Rejoin"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="select" type="primary" onClick={handleSubmit}>
                    Select
                </Button>,
            ]}
        >
            <Select
                style={{ width: '100%' }}
                placeholder="Select Employee Code"
                showSearch
                allowClear
                onChange={handleSelect}
            >
                {employeeList.map((employee: any) => (
                    <Option key={employee.id} value={employee.id}>
                        {employee.employeeCode} - {employee.firstName} {employee.lastName}
                    </Option>
                ))}
            </Select>

            {selectedEmployee && (
                <Row style={{ marginTop: 20 }}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Employee Code">{selectedEmployee.employeeCode}</Descriptions.Item>
                        <Descriptions.Item label="Employee Type">{selectedEmployee.employeeTypeName}</Descriptions.Item>
                        <Descriptions.Item label="Employee Name">{selectedEmployee.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Employee Department">{selectedEmployee.departmentName}</Descriptions.Item>
                        <Descriptions.Item label="Branch">{selectedEmployee.branchName}</Descriptions.Item>
                        <Descriptions.Item label="Designation">{selectedEmployee.designationName}</Descriptions.Item>
                        <Descriptions.Item label="Reporting Manager">{selectedEmployee.reportingManagerName}</Descriptions.Item>
                        <Descriptions.Item label="Date Of Joining">{dayjs(selectedEmployee.dateOfJoining).format("DD-MM-YYYY")}</Descriptions.Item>
                        <Descriptions.Item label="Date Of Reliving">{dayjs(selectedEmployee.dateOfReliving).format("DD-MM-YYYY")}</Descriptions.Item>
                        <Descriptions.Item label="Reason Of Reliving">{selectedEmployee.reasonOfReliving ? selectedEmployee.reasonOfReliving : '-'}</Descriptions.Item>
                    </Descriptions>

                </Row>
            )}
        </Modal>
    );
};

export default EmployeeRejoinModal;
