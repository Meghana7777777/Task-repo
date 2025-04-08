import { AntDesignOutlined } from '@ant-design/icons';
import { configVariables, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Avatar, Card, Col, Collapse, Descriptions, Image, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './personal-information-management.css';
const PersonalInfromationManagementView = () => {
    const { Panel } = Collapse;
    const [employeeData, setEmployeeData] = useState<any>([])
    const empservice = new EmployeeOnboardingService()
    const { Title, Text, Link } = Typography;
    const config = configVariables

    useEffect(() => {
        getAllEmployeesPersonalImformationManagement()
    }, [])
    console.log(employeeData, 'employeeData');

    const getAllEmployeesPersonalImformationManagement = () => {
        try {
            empservice.getAllEmployeesPersonalImformationManagement().then((res) => {
                if (res.status) {
                    setEmployeeData(res.data[0])
                } else {
                    setEmployeeData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    const columnsFamily = [
        { title: 'Name', dataIndex: 'familyMemName', key: 'familyMemName' },
        { title: 'Relation', dataIndex: 'relation', key: 'relation' },
        { title: 'Contact', dataIndex: 'contactNo', key: 'contactNo' },
        { title: 'Aadhaar No', dataIndex: 'aadhaarNo', key: 'aadhaarNo' },
    ];

    const columnsEducation = [
        { title: 'Qualification', dataIndex: 'empQualification', key: 'empQualification' },
        { title: 'Specialization', dataIndex: 'specialization', key: 'specialization' },
        { title: 'Year of Passing', dataIndex: 'yearOfPass', key: 'yearOfPass' },
        { title: 'Percentage', dataIndex: 'percentage', key: 'percentage' },
    ];

    const columnsExperience = [
        { title: 'Organization', dataIndex: 'organisation', key: 'organisation' },
        { title: 'From Date', dataIndex: 'fromDate', key: 'fromDate' },
        { title: 'To Date', dataIndex: 'toDate', key: 'toDate' },
        { title: 'Experience', dataIndex: 'yearOfExp', key: 'yearOfExp' },
    ];

    const columnsIdProofs = [
        { title: 'ID Type', dataIndex: 'idType', key: 'idType' },
        { title: 'ID Number', dataIndex: 'idNumber', key: 'idNumber' },
    ];

    const marialStatusData = () => {
        if (employeeData.maritualStatus === "M") {
            return <>Married</>
        }
        else if (employeeData.maritualStatus === "U") {
            return <>Unmarried</>
        }
        else if (employeeData.maritualStatus === "O") {
            return <>Others</>
        }
        else {
            return <>&nbsp;</>
        }
    }

    const genderStatus = () => {
        if (employeeData.gender === "M") {
            return <>Male</>
        }
        else if (employeeData.gender === "F") {
            return <>Female</>
        }
        else if (employeeData.gender === "Other") {
            return <>Other</>
        }
        else {
            return <>&nbsp;</>
        }
    }

    return (
        <Card>
            <Row gutter={16}>
                <Col span={6} >
                    <Card style={{ height: "100%", display: 'flex', flexDirection: 'column', }}>
                        {employeeData?.fileName?.length > 0 ? (
                            <div style={{ textAlign: 'center', marginTop: 15 }}>
                                <Image
                                    src={
                                        employeeData?.filename
                                            ? URL.createObjectURL(employeeData.filename)
                                            : `${config.IMAGE_UPLOAD_URL}/${employeeData.fileName}`
                                    }
                                    alt="employee-avatar"
                                    width={200}
                                    // style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #f0f0f0', }}
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
                            <Title level={5} style={{ margin: '8px 0' }}>
                                <span>
                                    {/* {employeeData?.salutation ? employeeData?.salutation : " "} */}
                                    {/* &nbsp; */}
                                    {employeeData?.firstName ? employeeData?.firstName : " "}
                                    &nbsp;
                                    {employeeData?.lastName ? employeeData?.lastName : " "}
                                </span>
                            </Title>
                            <Text type="secondary"><span>{employeeData.emailId ? employeeData.emailId : "-"}</span></Text>
                            <br />
                            <Text type="secondary"><span>{employeeData.mobileNo ? employeeData.mobileNo : "-"}</span></Text>
                        </div>
                    </Card>
                </Col>

                <Col span={18} >

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Branch Name</b>}>
                            <span>{employeeData?.branchId?.branchName ? employeeData?.branchId?.branchName : "-"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Department Name</b>}>
                            <span>{employeeData?.departmentId?.name ? employeeData?.departmentId?.name : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Designation Name</b>}>
                            <span>{employeeData?.designationId?.name ? employeeData?.designationId?.name : "-"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Division Name</b>}>
                            <span>{employeeData?.divisionId?.divisionName ? employeeData?.divisionId?.divisionName : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Date of Birth</b>}>
                            <span>{employeeData.dateOfBirth ? dayjs(employeeData.dateOfBirth).format('DD-MM-YYYY') : '-'}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Aadhar Number</b>}>
                            <span>{employeeData.aadhaarNo ? employeeData.aadhaarNo : "-"}</span>
                        </Descriptions.Item>

                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Gender</b>}>
                            <span>{genderStatus()}</span>
                        </Descriptions.Item>

                        <Descriptions.Item label={<b>Provident Fund</b>}>
                            <span>{employeeData.pfNo ? employeeData.pfNo : '-'}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Marital Status</b>}>
                            <span>{marialStatusData()}</span>
                        </Descriptions.Item>

                        <Descriptions.Item label={<b>ESIC Number</b>}>
                            <span>{employeeData.esicNo ? employeeData.esicNo : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Date of Joining</b>}>
                            <span>{employeeData.dateOfJoining ? dayjs(employeeData.dateOfJoining).format('DD-MM-YYYY') : '-'}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Blood Group</b>}>
                            <span>{employeeData.bloodGroup ? employeeData.bloodGroup : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Employee Grade</b>}>
                            <span>{employeeData.empGrade ? employeeData.empGrade : "-"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Bank Name</b>}>
                            <span>{employeeData.bankName ? employeeData.bankName : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Reporting Manager</b>}>
                            <span>{employeeData.reportingManagerName ? employeeData.reportingManagerName : "-"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Bank IFSC Code</b>}>
                            <span>{employeeData.bankIfscCode ? employeeData.bankIfscCode : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Date of Reliving</b>}>
                            <span>{employeeData.dateOfReliving ? dayjs(employeeData.dateOfReliving).format('DD-MM-YYYY') : '-'}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Bank Account Number</b>}>
                            <span>{employeeData.bankAcNo ? employeeData.bankAcNo : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered>
                        <Descriptions.Item label={<b>Reason Of Reliving</b>}>
                            <span>{employeeData.reasonOfReliving ? employeeData.reasonOfReliving : "-"}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<b>Nominee</b>}>
                            <span>{employeeData.nominee ? employeeData.nominee : "-"}</span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered className='singleRow'>
                        <Descriptions.Item label={<b>Current Address</b>}>
                            {employeeData.currentAddress || "-"},
                            {employeeData.currentVillage || "-"},
                            {employeeData.currentPincode || "-"},
                            {employeeData.currentDistrict || "-"},
                            {employeeData.currentState || "-"},
                            {employeeData.currentCountry || "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions bordered className='singleRow'>
                        <Descriptions.Item label={<b>Permanent Address</b>}>
                            {employeeData.currentAddress || "-"},
                            {employeeData.currentVillage || "-"},
                            {employeeData.currentPincode || "-"},
                            {employeeData.currentDistrict || "-"},
                            {employeeData.currentState || "-"},
                            {employeeData.currentCountry || "-"}
                        </Descriptions.Item>
                    </Descriptions>

                </Col>

            </Row>
            <br />

            <Row gutter={[16, 16]} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Col span={12}>
                    <Card title="Family Details">
                        <Table
                            dataSource={employeeData.employeeFamilyDetails}
                            columns={columnsFamily}
                            rowKey="id"
                            bordered
                            pagination={false}
                            style={{ marginBottom: '16px' }}
                        />
                    </Card>
                    <br />

                    <Card title="Experience Details">
                        <Table
                            dataSource={employeeData.employeeExperienceDetails}
                            columns={columnsExperience}
                            rowKey="id"
                            bordered
                            pagination={false}
                        />
                    </Card>
                </Col>
                <br />
                <Col span={12}>
                    <Card title="Education Details">
                        <Table
                            dataSource={employeeData.employeeEduDetails}
                            columns={columnsEducation}
                            rowKey="id"
                            bordered
                            pagination={false}
                            style={{ marginBottom: '16px' }}
                        />
                    </Card>
                    <br />

                    <Card title="ID Proofs">
                        <Table
                            dataSource={employeeData.employeeIdProofs}
                            columns={columnsIdProofs}
                            rowKey="id"
                            bordered
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>

        </Card >
    )
}

export default PersonalInfromationManagementView