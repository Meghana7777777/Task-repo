import { BankFilled, HomeFilled, IdcardFilled, MinusOutlined, PhoneFilled } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components'
import { configVariables } from '@hrexpert/shared-services';
import { Col, Row, Typography } from 'antd'
import React from 'react'

interface DetailsProps {
    empData: any
    RMData: any
}

const { Text, Link } = Typography;

const EmployeeInformationCard = (props: DetailsProps) => {
    const { empData, RMData} = props

    const handleFileOpen = (fileName: string) => {
        const fileUrl = configVariables.ID_PROOF_UPLOAD_URL + fileName;
        window.open(fileUrl, '_blank');
    };

    return (
        <>
            <ProCard colSpan="100%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }} >
                <ProCard
                    style={{ marginBottom: '1rem' }}
                    title={<><span role="img" aria-label="info">👤</span> Employee Information</>}
                    bordered
                    headerBordered
                >
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <Text type="secondary">Employee Type</Text>
                            <br />
                            <Text strong>{empData?.employeeType?.employeTypeName}</Text>
                        </Col>
                        <Col span={6}>
                            <Text type="secondary">Date Of Joining</Text>
                            <br />
                            <Text strong>{empData?.dateOfJoining}</Text>
                        </Col>
                        <Col span={6}>
                            <Text type="secondary">Designation</Text>
                            <br />
                            <Text strong>{empData?.designationId?.name}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Department</Text>
                            <br />
                            <Text strong>{empData?.departmentId?.name}</Text>
                        </Col>
                        <Col span={6}>
                            <Text type="secondary">Branch</Text>
                            <br />
                            <Text strong>{empData?.branchId?.branchName}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Accomdation</Text>
                            <br />
                            <Text strong>{empData?.accomdation}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Salary</Text>
                            <br />
                            <Text strong>{'₹ ' + empData?.salary + ' /-'}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Attendance Allowance</Text>
                            <br />
                            <Text strong>{empData?.attendanceAllowance ? 'Yes' : 'No'}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Time Restriction</Text>
                            <br />
                            <Text strong>{empData?.timeRestrictions}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Travelling Allowance</Text>
                            <br />
                            <Text strong>{empData?.travellingAllowance ? 'Yes' : 'No'}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Employee Status</Text>
                            <br />
                            <Text strong>{empData?.employeeStatus}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Reporting Manager</Text>
                            <br />
                            <Text strong>{RMData?.firstNameRM + RMData?.lastNameRM}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Nominee</Text>
                            <br />
                            <Text strong>{empData?.nominee}</Text>
                        </Col>

                        <Col span={6}>
                            <Text type="secondary">Date Of Reliving</Text>
                            <br />
                            <Text strong>{empData?.dateOfReliving}</Text>
                        </Col>
                        <Col span={6}>
                            <Text type="secondary">Reason Of Reliving</Text>
                            <br />
                            <Text strong>{empData?.reasonOfReliving}</Text>
                        </Col>
                    </Row>
                </ProCard>
            </ProCard>

            <ProCard gutter={20} split="vertical" style={{ background: 'transparent', boxShadow: 'none' }}>

                <ProCard colSpan="60%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }} >
                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><BankFilled /> Bank Details</>}
                        bordered
                        headerBordered
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text type="secondary">Pf Number</Text>
                                <br />
                                <Text strong>{empData?.pfNo}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">ESIC No</Text>
                                <br />
                                <Text strong>{empData?.esicNo}</Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary">Bank Name</Text>
                                <br />
                                <Text strong>{empData?.bankName}</Text>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Bank Ac No</Text>
                                <br />
                                <Text strong>{empData?.bankAcNo}</Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary">Bank IFSC Code</Text>
                                <br />
                                <Text strong>{empData?.bankIfscCode}</Text>
                            </Col>
                        </Row>
                    </ProCard>

                </ProCard>


                <ProCard colSpan="40%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <ProCard
                        style={{ marginBottom: '1rem' }}
                        title={<><IdcardFilled /> Documents Information </>}
                        bordered
                        headerBordered
                    >
                        {(empData?.employeeIdProofs?.length ?
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {empData?.employeeIdProofs &&
                                        empData?.employeeIdProofs?.map((exp, parentIndex: number) => (
                                            <>
                                                <Row gutter={[16, 16]}>
                                                    <Col span={12}>
                                                        <Text type="secondary">ID Type</Text>
                                                        <br />
                                                        <Text strong><a onClick={() => handleFileOpen(exp?.originalFileName)}>{exp?.idType}</a></Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">ID Number</Text>
                                                        <br />
                                                        <Text strong>{exp?.idNumber}</Text>
                                                    </Col>
                                                </Row>
                                            </>
                                        ))}
                                </div>

                            </> :
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text type="secondary">No Documents</Text>
                                </Col>
                            </Row>
                        )}

                    </ProCard>






                </ProCard>
            </ProCard>
        </>
    )
}

export default EmployeeInformationCard