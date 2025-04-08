import { HomeFilled, IdcardFilled, PhoneFilled } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Col, Divider, Row, Typography } from 'antd';

const { Text, Link } = Typography;

interface DetailsProps {
    empData: any
}


const PersonalInformation = (props: DetailsProps) => {
    const { empData } = props

    function calculateAge(dateOfBirth: string): number {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (
            today.getMonth() < dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ) {
            age--;
        }
        return age;
    }

    console.dir(empData, '------total data--------')

    return (
        <>
            <ProCard gutter={20} split="vertical" style={{ background: 'transparent', boxShadow: 'none' }}>
                <ProCard colSpan="60%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }} >
                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><span role="img" aria-label="info">👤</span> Personal Information</>}
                        bordered
                        headerBordered
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text type="secondary">Full Name</Text>
                                <br />
                                <Text strong>{empData?.employeeName}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Gender</Text>
                                <br />
                                <Text strong>{empData?.gender === 'M' ? 'Male' : empData?.gender === 'F' ? 'Female' : 'Other'}</Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary">Marital Status</Text>
                                <br />
                                <Text strong>{empData?.maritualStatus === 'M' ? 'Married' : empData?.maritualStatus === 'U' ? 'Un Married' : 'Other'}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Birthdate</Text>
                                <br />
                                <Text strong>{empData?.dateOfBirth}</Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary">Blood Type</Text>
                                <br />
                                <Text strong>{empData?.bloodGroup}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Age</Text>
                                <br />
                                <Text strong>{calculateAge(empData?.dateOfBirth)}</Text>
                            </Col>
                        </Row>
                    </ProCard>

                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><HomeFilled /> Address Information</>}
                        bordered
                        headerBordered
                    >
                        <Row>
                            <Col span={24}>
                                <Text type="secondary">Current Address</Text>
                                <br />
                                <Text strong>{empData?.currentAddress?empData?.currentAddress:null}</Text>
                                <br />
                                <Text strong>{empData?.currentVillage ? empData?.currentVillage + ', ' : null + empData?.currentDistrict ? empData?.currentDistrict + ', ' : null + empData?.currentState ? empData?.currentState + ', ' : null + empData?.currentCountry ? empData?.currentCountry + ', ' : null }</Text>
                                <br />
                                <Text strong>Pincode: {empData?.currentPincode?empData?.currentPincode:'-'}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 1 }}>
                            <Col span={24}>
                                <br />
                                <Link href="https://www.google.com/maps/" target="_blank">View on Map &gt;</Link>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '16px 0' }} />
                        <Row>
                            <Col span={24}>
                                <Text type="secondary">Permanent Address</Text>
                                <br />
                                <Text strong>{empData?.permanentAddress?empData?.permanentAddress:null}</Text>
                                <br />
                                <Text strong>{empData?.permanentVillage?empData?.permanentVillage + ', ': null + empData?.permanentDistrict?empData?.permanentDistrict + ', ':null + empData?.permanentState?empData?.permanentState + ', ':null + empData?.permanentCountry?empData?.permanentCountry + ', ':null }</Text>
                                <br />
                                <Text strong>Pincode: {empData?.permanentPincode?empData?.permanentPincode:'-'}</Text>
                            </Col>
                        </Row>
                    </ProCard>

                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<> <span role="img" aria-label="info">👤</span> Family Details</>}
                        bordered
                        headerBordered
                    >
                        {(empData?.employeeFamilyDetails?.length ?
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {empData?.employeeFamilyDetails &&
                                        empData?.employeeFamilyDetails?.map((exp, parentIndex: number) => (
                                            <>
                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <Text type="secondary">Full Name</Text>
                                                        <br />
                                                        <Text strong>{exp?.familyMemName}</Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">Relation</Text>
                                                        <br />
                                                        <Text strong>{exp?.relation}</Text>
                                                    </Col>

                                                    <Col span={12}>
                                                        <Text type="secondary">Contact No</Text>
                                                        <br />
                                                        <Text strong>{exp?.contactNo}</Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">Aadhaar No</Text>
                                                        <br />
                                                        <Text strong>{exp?.aadhaarNo}</Text>
                                                    </Col>
                                                </Row>
                                            </>
                                        ))}
                                </div>

                            </> :
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text type="secondary">No Family Details</Text>
                                </Col>
                            </Row>
                        )}
                    </ProCard>
                </ProCard>


                <ProCard colSpan="40%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><PhoneFilled /> Contact Information </>}
                        bordered
                        headerBordered
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Personal Contact</Text>
                        </div>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text type="secondary">Phone Number</Text>
                                <br />
                                <Text strong style={{ color: '#1890ff' }}>+91-{empData?.mobileNo}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Email</Text>
                                <br />
                                <Text strong style={{ color: '#1890ff' }}>{empData?.emailId}</Text>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Other Contact</Text>
                            <br />
                            <Text type="secondary">emergency Contact Number</Text>
                            <br />
                            <Text strong style={{ color: '#1890ff' }}>+91-{empData?.emergencyContactNo}</Text>
                        </div>
                    </ProCard>

                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<> <IdcardFilled /> Education Details </>}
                        bordered
                        headerBordered
                    >
                        {(empData?.employeeEduDetails?.length ?
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {empData?.employeeEduDetails &&
                                        empData?.employeeEduDetails?.map((edu, parentIndex: number) => (
                                            <>
                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <Text type="secondary">Employee Qualification</Text>
                                                        <br />
                                                        <Text strong>{edu?.empQualification}</Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">Specialization</Text>
                                                        <br />
                                                        <Text strong>{edu?.specialization}</Text>
                                                    </Col>
                                                </Row>

                                                <div style={{ marginTop: 3 }}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <Text type="secondary">Year of Pass</Text>
                                                            <br />
                                                            <Text strong>{edu?.yearOfPass}</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text type="secondary">Percentage</Text>
                                                            <br />
                                                            <Text strong>{edu?.percentage + '%'}</Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </>
                                        ))}
                                </div>

                            </> :
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text type="secondary">No Education Details</Text>
                                </Col>
                            </Row>
                        )}
                    </ProCard>

                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><IdcardFilled /> Employment Overview</>}
                        bordered
                        headerBordered
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text type="secondary">Date Started</Text>
                                <br />
                                <Text strong>{empData?.dateOfJoining}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Job Role</Text>
                                <br />
                                <Text strong>{empData?.designationId?.name}</Text>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 16 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text type="secondary">Job Level</Text>
                                    <br />
                                    <Text strong>{empData?.employeeType?.employeTypeName}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary">Employment Status</Text>
                                    <br />
                                    <Text strong>Fulltime</Text>
                                </Col>
                            </Row>
                        </div>
                    </ProCard>

                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><IdcardFilled /> Experience Details </>}
                        bordered
                        headerBordered
                    >
                        {(empData?.employeeExperienceDetails?.length ?
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {empData?.employeeExperienceDetails &&
                                        empData?.employeeExperienceDetails?.map((exp, parentIndex: number) => (
                                            <>
                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <Text type="secondary">Organisation</Text>
                                                        <br />
                                                        <Text strong>{exp?.organisation}</Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">Year of Exp</Text>
                                                        <br />
                                                        <Text strong>{exp?.yearOfExp}</Text>
                                                    </Col>
                                                </Row>

                                                <div style={{ marginTop: 3 }}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <Text type="secondary">From Date</Text>
                                                            <br />
                                                            <Text strong>{exp?.fromDate}</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text type="secondary">To Date</Text>
                                                            <br />
                                                            <Text strong>{exp?.toDate}</Text>
                                                        </Col>
                                                    </Row>
                                                </div>

                                            </>
                                        ))}
                                </div>

                            </> :
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text type="secondary">No Experience Details</Text>
                                </Col>
                            </Row>
                        )}
                    </ProCard>
                </ProCard>
            </ProCard>


        </>

    );
};

export default PersonalInformation;
