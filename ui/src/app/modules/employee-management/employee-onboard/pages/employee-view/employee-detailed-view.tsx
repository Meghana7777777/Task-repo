import { AntDesignOutlined } from '@ant-design/icons';
import { configVariables, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Avatar, Card, Col, Descriptions, Image, Modal, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import EmployeeDeactiveForm from './employee-deactive-model';
export interface EmployeeDetailedViewProps {
    rec: any;
}
const EmployeeDetailedView = (props: EmployeeDetailedViewProps) => {
    const { Title, Text, Link } = Typography;
    const employeeData = props.rec
    const service = new EmployeeOnboardingService();
    const [data, setData] = useState<any>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any>([]);
    const [loading, setLodaing] = useState(false);
    const config = configVariables
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getAllEmployeesData()
    }, [])

    useEffect(() => {
        if (data.length > 0 && employeeData.employeeId) {
            const matchedEmployee = data.find((emp: any) => emp.id === employeeData.employeeId);
            setSelectedEmployee(matchedEmployee);
        }
    }, [data, employeeData.employeeId]);

    const getAllEmployeesData = () => {
        setLodaing(true)
        try {
            service.getAllEmployeeData().then((res) => {
                if (res.status) {
                    setData(res.data)
                    setLodaing(false)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

   

    console.log(selectedEmployee, "selectedEmployee");
    return (
        <>
            <Card style={{ border: "1px solid whilte" }} loading={loading}>
                <Row gutter={[24, 4]} justify={"space-between"}>
                    <Col span={6} >
                        <Card
                            style={{
                                height: "100%",
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {selectedEmployee?.fileName?.length > 0 ? (
                                <div style={{ textAlign: 'center', marginTop: 15 }}>
                                    <Image
                                        src={
                                            selectedEmployee?.filename
                                                ? URL.createObjectURL(selectedEmployee.filename)
                                                : `${config.IMAGE_UPLOAD_URL}/${selectedEmployee.fileName}`
                                        }
                                        alt="employee-avatar"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            border: '2px solid #f0f0f0',
                                        }}
                                        preview={true}
                                    />
                                </div>
                            ) : (
                                <Avatar
                                    size={120}
                                    icon={<AntDesignOutlined />}
                                    alt="Employee Image"
                                    style={{ marginBottom: 16, marginLeft: "30%" }}
                                />
                            )}
                            <div style={{ textAlign: 'center', marginTop: 16 }}>

                                <Title level={4} style={{ margin: '8px 0' }}>
                                    <span>
                                        {selectedEmployee?.salutation ? selectedEmployee?.salutation : " "}
                                        &nbsp;
                                        {selectedEmployee?.firstName ? selectedEmployee?.firstName : " "}
                                        &nbsp;
                                        {selectedEmployee?.lastName ? selectedEmployee?.lastName : " "}
                                    </span>
                                </Title>
                                <Text type="secondary"><span>{selectedEmployee.emailId ? selectedEmployee.emailId : "-"}</span></Text>
                                <br />
                                <Text type="secondary"><span>{selectedEmployee.mobileNo ? selectedEmployee.mobileNo : "-"}</span></Text>
                            </div>
                        </Card>
                    </Col>

                    <Col span={18} >
                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Date of Birth</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.dateOfBirth ? dayjs(selectedEmployee.dateOfBirth).format('DD-MM-YYYY') : '-'}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Gender</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.gender ? selectedEmployee.gender : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Salary</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.salary ? selectedEmployee.salary : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Designation Name</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.designationName ? selectedEmployee.designationName : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Division Name</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.divisionName ? selectedEmployee.divisionName : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Employee Code</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.employeeCode ? selectedEmployee.employeeCode : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Department Name</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.departmentName ? selectedEmployee.departmentName : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Branch Name</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.branchName ? selectedEmployee.branchName : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Date of Joining</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.dateOfJoining ? dayjs(selectedEmployee.dateOfJoining).format('DD-MM-YYYY') : '-'}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered>
                            {/* <Descriptions.Item label={<b>Qualification</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                            <span>{selectedEmployee.qualification ? selectedEmployee.qualification : "-"}</span>
                        </Descriptions.Item> */}
                            <Descriptions.Item label={<b>Current Address</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.currentAddress ? selectedEmployee.currentAddress : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Current State</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.currentState ? selectedEmployee.currentState : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Current Pincode</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.currentPincode ? selectedEmployee.currentPincode : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Permanent State</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.permanentState ? selectedEmployee.permanentState : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Permanent Pincode</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.permanentPincode ? selectedEmployee.permanentPincode : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Salary</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.salary ? selectedEmployee.salary : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Provident Fund Number</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.pfNo ? selectedEmployee.pfNo : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>ESIC Number</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.esicNo ? selectedEmployee.esicNo : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Bank Name</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.bankName ? selectedEmployee.bankName : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Bank Name</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.bankName ? selectedEmployee.bankName : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Bank Account Number</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.bankAcNo ? selectedEmployee.bankAcNo : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Bank IFSC Code</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.bankIfscCode ? selectedEmployee.bankIfscCode : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        {/* <Descriptions bordered>
                            <Descriptions.Item label={<b>Accommodation</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.accommodation ? selectedEmployee.accommodation : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Transportation</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.transportation ? selectedEmployee.transportation : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions> */}

                        <Descriptions bordered>
                            <Descriptions.Item label={<b>Date of Reliving</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.dateOfReliving ? dayjs(selectedEmployee.dateOfReliving).format('DD-MM-YYYY') : '-'}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Reason Of Reliving</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.reasonOfReliving ? selectedEmployee.reasonOfReliving : "-"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<b>Reporting Manager</b>} labelStyle={{ backgroundColor: '#f7f5f5' }}>
                                <span>{selectedEmployee.reportingManagerName ? selectedEmployee.reportingManagerName : "-"}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row >
        
            </Card>
        </>
    )
}

export default EmployeeDetailedView