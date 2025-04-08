import { PerformanceManagementShareService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Input, Rate, Row, Select, Typography } from "antd";
import { useEffect } from 'react';

export interface PerformanceManagementProps {
    rec: any,
    handleCloseModal: any,
    getEmployeeData: any,
    performData: any
}

interface PerformanceData {
    employeeInfo: {
        employeeCode: string;
        employeeName: string;
        department: string;
        designation: string;
        reportingManager: string;
    };
    achievements: {
        impactAreas: string[];
        keyAchievements: string[];
        managerAssessments: string[];
    };
    ratings: Array<{
        competence: string;
        description: string;
        rating: string;
        remarks: string;
        rmRating: string;
        rmRemarks: string;
    }>;
}

const PerformanceManagementForm = (props: PerformanceManagementProps) => {
    const [form] = Form.useForm<PerformanceData>();
    const data = props.rec;
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title, Text } = Typography;
    const service = new PerformanceManagementShareService();

    const isConfirmed = props.performData && props.performData.length > 0 &&
        props.performData[0].empInfo.status === "RM Confirmed";

    const competenceAreas = [
        {
            name: "Quality of Work",
            description: "Assessment of the individual in productivity level, time management, ability to meet deadlines"
        },
        {
            name: "Job Knowledge",
            description: "The ability of the employee to demonstrate knowledge as to how to effectively perform the essential functions of the job"
        },
        {
            name: "Passion for result",
            description: "Demostrates the passion for growth,learning & performance"
        },
        {
            name: "Communication Skills",
            description: "Written & oral communicaion are clear organized and effective; listen and comprehends well"
        },
        {
            name: "Judgement & Decision Making",
            description: "Making thoughtful, well reasoned decisions; exercise good judgement, resourcefulness and creativity in problem-solving"
        },
        {
            name: "Future Leadership",
            description: "Demonstrates the ability and takes initiatives for self growth and lead the organizaiton in a longer run"
        },
        {
            name: "Team work & Cooperation",
            description: "Ensures conducivenss within the team, motivates & influences the team in a positive manner"
        }
    ];

    useEffect(() => {
        if (props.performData && props.performData.length > 0) {
            const performData = props.performData[0].empInfo;
            const achievements = {
                impactAreas: ['', '', ''],
                keyAchievements: ['', '', ''],
                managerAssessments: ['', '', '']
            };

            if (performData.reviewAchivements && performData.reviewAchivements.length > 0) {
                performData.reviewAchivements.forEach((achievement, index) => {
                    achievements.impactAreas[index] = achievement.impactAreas || '';
                    achievements.keyAchievements[index] = achievement.keyAchievements || '';
                    achievements.managerAssessments[index] = achievement.managerAssessments || '';
                });
            }

            let ratings = [];
            if (performData.reviewRatings && performData.reviewRatings.length > 0) {
                ratings = performData.reviewRatings.map(rating => ({
                    competence: rating.competence,
                    description: rating.description,
                    rating: rating.rating,
                    remarks: rating.remarks,
                    rmRemarks: rating.rmRemarks,
                    rmRating: rating.rmRating
                }));
            } else {
                ratings = competenceAreas.map(area => ({
                    competence: area.name,
                    description: area.description,
                    rating: '',
                    remarks: '',
                    rmRemarks: '',
                    rmRating: ''
                }));
            }

            form.setFieldsValue({
                employeeInfo: {
                    employeeCode: performData.employeeCode || data.employeeCode,
                    employeeName: performData.employeeName || data.employeeName,
                    department: performData.department || data.departmentId?.name,
                    designation: performData.designation || data.designationId?.name,
                    reportingManager: performData.reportingManager || data.reportingManagerName
                },
                achievements: achievements,
                ratings: ratings
            });
        } else {
            form.setFieldsValue({
                employeeInfo: {
                    employeeCode: data.employeeCode,
                    employeeName: data.employeeName,
                    department: data.departmentId?.name,
                    designation: data.designationId?.name,
                    reportingManager: data.reportingManagerName
                },
                achievements: {
                    impactAreas: ['', '', ''],
                    keyAchievements: ['', '', ''],
                    managerAssessments: ['', '', '']
                },
                ratings: competenceAreas.map(area => ({
                    competence: area.name,
                    description: area.description,
                    rating: '',
                    remarks: '',
                    rmRating: '',
                    rmRemarks: ''
                }))
            });
        }
    }, [props.performData, form, data]);

    const handleSave = () => {
        if (isConfirmed) return;

        const values = form.getFieldsValue();
        const impacts = Array(3).fill('').map((_, index) =>
            values.achievements?.impactAreas?.[index] || ''
        );
        const achievements = Array(3).fill('').map((_, index) =>
            values.achievements?.keyAchievements?.[index] || ''
        );
        const assessments = Array(3).fill('').map((_, index) =>
            values.achievements?.managerAssessments?.[index] || ''
        );

        const reviewAchievements = impacts.map((_, index) => ({
            impactAreas: impacts[index],
            keyAchievements: achievements[index],
            managerAssessments: assessments[index]
        }));

        const reviewRatings = competenceAreas.map((area, index) => {
            const ratingData = values.ratings?.[index] || {
                competence: area.name,
                description: area.description,
                rating: '',
                remarks: '',
                rmRating: '',
                rmRemarks: ''
            };
            return {
                competence: area.name,
                description: area.description,
                rating: ratingData.rating || '',
                remarks: ratingData.remarks || '',
                rmRating: ratingData.rmRating || '',
                rmRemarks: ratingData.rmRemarks || ''
            };
        });

        const structuredData = {
            "empInfo": {
                employeeCode: values.employeeInfo?.employeeCode || '',
                employeeName: values.employeeInfo?.employeeName || '',
                department: values.employeeInfo?.department || '',
                designation: values.employeeInfo?.designation || '',
                reportingManager: values.employeeInfo?.reportingManager || '',
                status: "RM Saved",
                reviewAchivements: reviewAchievements,
                reviewRatings: reviewRatings
            }
        };

        service.createPerformanceForm(structuredData).then((res) => {
            if (res.status) {
                console.log("Saved Success")
                props.handleCloseModal()
                props.getEmployeeData()
            } else {
                console.log("Failed Saved")
            }
        }).catch((err) => {
            console.log(err, 'eerr')
        })
    };

    const handleConfirm = () => {
        if (isConfirmed) return;

        const values = form.getFieldsValue();
        const impacts = Array(3).fill('').map((_, index) =>
            values.achievements?.impactAreas?.[index] || ''
        );
        const achievements = Array(3).fill('').map((_, index) =>
            values.achievements?.keyAchievements?.[index] || ''
        );
        const assessments = Array(3).fill('').map((_, index) =>
            values.achievements?.managerAssessments?.[index] || ''
        );

        const reviewAchievements = impacts.map((_, index) => ({
            impactAreas: impacts[index],
            keyAchievements: achievements[index],
            managerAssessments: assessments[index]
        }));
        const reviewRatings = competenceAreas.map((area, index) => {
            const ratingData = values.ratings?.[index] || {
                competence: area.name,
                description: area.description,
                rating: '',
                remarks: '',
                rmRating: '',
                rmRemarks: ''
            };
            return {
                competence: area.name,
                description: area.description,
                rating: ratingData.rating || '',
                remarks: ratingData.remarks || '',
                rmRating: ratingData.rmRating || '',
                rmRemarks: ratingData.rmRemarks || ''
            };
        });

        const structuredData = {
            "empInfo": {
                employeeCode: values.employeeInfo?.employeeCode || '',
                employeeName: values.employeeInfo?.employeeName || '',
                department: values.employeeInfo?.department || '',
                designation: values.employeeInfo?.designation || '',
                reportingManager: values.employeeInfo?.reportingManager || '',
                status: "RM Confirmed",
                reviewAchivements: reviewAchievements,
                reviewRatings: reviewRatings
            }
        };

        service.createPerformanceForm(structuredData).then((res) => {
            if (res.status) {
                console.log("Saved Success")
                props.handleCloseModal()
                props.getEmployeeData()
            } else {
                console.log("Failed Saved")
            }
        }).catch((err) => {
            console.log(err, 'eerr')
        })
    };

    const renderReadOnlyText = (value: string) => {
        return <h4>{value || '-'}</h4>;
    };

    const renderReadOnlyRate = (value: string) => {
        const numericValue = parseInt(value || '0');
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Rate
                    value={numericValue}
                    count={5}
                    disabled
                    style={{ marginRight: 8 }}
                />
            </div>
        );
    };

    return (
        <Form form={form} layout="vertical">
            <Card title={"Employee Info"}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item
                            name={['employeeInfo', 'employeeCode']}
                            label="Employee ID"
                        >
                            {isConfirmed ? (
                                renderReadOnlyText(form.getFieldValue(['employeeInfo', 'employeeCode']))
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            name={['employeeInfo', 'employeeName']}
                            label="Employee Name"
                        >
                            {isConfirmed ? (
                                renderReadOnlyText(form.getFieldValue(['employeeInfo', 'employeeName']))
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            name={['employeeInfo', 'department']}
                            label="Department"
                        >
                            {isConfirmed ? (
                                renderReadOnlyText(form.getFieldValue(['employeeInfo', 'department']))
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            name={['employeeInfo', 'designation']}
                            label="Designation"
                        >
                            {isConfirmed ? (
                                renderReadOnlyText(form.getFieldValue(['employeeInfo', 'designation']))
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            name={['employeeInfo', 'reportingManager']}
                            label="Reporting Manager"
                        >
                            {isConfirmed ? (
                                renderReadOnlyText(form.getFieldValue(['employeeInfo', 'reportingManager']))
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title={"Review Achievements"}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Impact Areas">
                            <Form.List name={['achievements', 'impactAreas']}>
                                {(fields) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                {...field}
                                                key={index}
                                                style={{ marginTop: index === 0 ? 0 : 35 }}
                                            >
                                                {isConfirmed ? (
                                                    renderReadOnlyText(form.getFieldValue(['achievements', 'impactAreas', index]))
                                                ) : (
                                                    <Select placeholder="Please Select" allowClear showSearch style={{ width: '100%' }}>
                                                        <Option value="0">0</Option>
                                                        <Option value="1">1</Option>
                                                        <Option value="2">2</Option>
                                                        <Option value="3">3</Option>
                                                        <Option value="4">4</Option>
                                                        <Option value="5">5</Option>
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="3 Key Achievements (employee)">
                            <Form.List name={['achievements', 'keyAchievements']}>
                                {(fields) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item {...field} key={index} style={{ marginBottom: 8 }}>
                                                {isConfirmed ? (
                                                    renderReadOnlyText(form.getFieldValue(['achievements', 'keyAchievements', index]))
                                                ) : (
                                                    <TextArea placeholder={`Achievement`} />
                                                )}
                                            </Form.Item>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Manager's Assessment">
                            <Form.List name={['achievements', 'managerAssessments']}>
                                {(fields) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item {...field} key={index} style={{ marginBottom: 8 }}>
                                                {isConfirmed ? (
                                                    renderReadOnlyText(form.getFieldValue(['achievements', 'managerAssessments', index]))
                                                ) : (
                                                    <TextArea placeholder={`Assessment`} />
                                                )}
                                            </Form.Item>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title={"Review Rating"}>
                <Form.List name="ratings">
                    {(fields) => (
                        <>
                            {fields.map((field, index) => (
                                <Row gutter={16} key={index}>
                                    <Col span={4}>
                                        <Form.Item>
                                            <div style={{ marginBottom: 45 }}>
                                                <Text strong>{competenceAreas[index]?.name}</Text>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item>
                                            <div style={{ marginBottom: 15 }}>
                                                <Text strong>{competenceAreas[index]?.description}</Text>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item
                                            name={[field.name, 'rating']}
                                            label={index === 0 ? "Employee Rating" : ""}
                                        >
                                            {isConfirmed ? (
                                                renderReadOnlyRate(form.getFieldValue(['ratings', index, 'rating']))
                                            ) : (
                                                <Rate
                                                    disabled
                                                    count={5}
                                                    style={{ marginTop: 10 }}
                                                    tooltips={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name={[field.name, 'remarks']}
                                            label={index === 0 ? "Employee Remarks" : ""}
                                        >
                                            {isConfirmed ? (
                                                renderReadOnlyText(form.getFieldValue(['ratings', index, 'remarks']))
                                            ) : (
                                                <TextArea disabled placeholder="Enter remarks" />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item
                                            name={[field.name, 'rmRating']}
                                            label={index === 0 ? "RM Rating" : ""}
                                        >
                                            {isConfirmed ? (
                                                renderReadOnlyRate(form.getFieldValue(['ratings', index, 'rmRating']))
                                            ) : (
                                                <Rate
                                                    count={5}
                                                    style={{ marginTop: 10 }}
                                                    tooltips={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>

                                    <Col span={4}>
                                        <Form.Item name={[field.name, 'rmRemarks']}
                                            label={index === 0 ? "RM Remarks" : ""}
                                        >
                                            {isConfirmed ? (
                                                renderReadOnlyText(form.getFieldValue(['ratings', index, 'rmRemarks']))
                                            ) : (
                                                <TextArea placeholder="Enter RM Remarks" />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                        </>
                    )}
                </Form.List>
            </Card>

            {!isConfirmed && (
                <>
                    <Button type="primary" onClick={handleSave}>Save</Button>
                    <Button style={{ marginLeft: 15 }} type="primary" onClick={handleConfirm}>Confirm</Button>
                </>
            )}
        </Form>
    );
};

export default PerformanceManagementForm;