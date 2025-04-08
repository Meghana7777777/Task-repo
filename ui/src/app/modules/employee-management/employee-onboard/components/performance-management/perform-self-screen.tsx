import { EmployeeOnboardingService, PerformanceManagementShareService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Input, Rate, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";

export interface PerformanceManagementProps {
    rec: any,
    performData?: any
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
    }>;
}

const PerformanceManagementSelfScreenForm = (props: PerformanceManagementProps) => {
    const [form] = Form.useForm<PerformanceData>();
    const data = props.rec;
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title, Text } = Typography;
    const service = new PerformanceManagementShareService();
    const [performData, setPerformData] = useState<any>([]);
    const [empData, setEmployeeData] = useState<any>([]);
    const empService = new EmployeeOnboardingService()
    const [isReadOnly, setIsReadOnly] = useState(false);

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
        getPerformanceManagement()
        getEmployeeData()
    }, [])

    const getEmployeeData = () => {
        try {
            empService.getAllEmployeesTableFroms({ employeeCode: data }).then((res) => {
                if (res.status) {
                    setEmployeeData(res.data);
                } else {
                    setEmployeeData([])
                }
            })
        } catch (err) {
            console.error(err);
        }
    };

    const getPerformanceManagement = () => {
        const req = data
        try {
            service.getPerformanceManagement({ employeeCode: req }).then((res) => {
                if (res.status) {
                    setPerformData(res.data);
                    if (res.data.length > 0 && res.data[0].empInfo) {
                        const status = res.data[0].empInfo.status;
                        if (status === "Employee Confirmed" || status === "RM Saved" || status === "RM Confirmed") {
                            setIsReadOnly(true);
                        }
                    }
                } else {
                    setPerformData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (empData && empData.length > 0) {
            const employee = empData[0];
            let achievements = {
                impactAreas: ['', '', ''],
                keyAchievements: ['', '', ''],
                managerAssessments: ['', '', '']
            };
            let ratings = competenceAreas.map(area => ({
                competence: area.name,
                description: area.description,
                rating: '',
                remarks: '',
            }));
            if (performData && performData.length > 0) {
                const performance = performData[0].empInfo;
                if (performance.reviewAchivements && performance.reviewAchivements.length > 0) {
                    performance.reviewAchivements.forEach((achievement, index) => {
                        if (index < 3) {
                            achievements.impactAreas[index] = achievement.impactAreas || '';
                            achievements.keyAchievements[index] = achievement.keyAchievements || '';
                            achievements.managerAssessments[index] = achievement.managerAssessments || '';
                        }
                    });
                }
                if (performance.reviewRatings && performance.reviewRatings.length > 0) {
                    ratings = performance.reviewRatings.map(rating => ({
                        competence: rating.competence,
                        description: rating.description,
                        rating: rating.rating || '',
                        remarks: rating.remarks || ''
                    }));
                }
            }

            form.setFieldsValue({
                employeeInfo: {
                    employeeCode: employee.employeeCode || '-',
                    employeeName: employee.firstName || '-',
                    department: employee.departmentId?.name || '-',
                    designation: employee.designationId?.name || '-',
                    reportingManager: employee.reportingManagerName || '-',
                },
                achievements: achievements,
                ratings: ratings
            });
        }
    }, [empData, performData, form]);

    const handleSave = () => {
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
                remarks: ''
            };
            return {
                competence: area.name,
                description: area.description,
                rating: ratingData.rating || '',
                remarks: ratingData.remarks || ''
            };
        });

        const structuredData = {
            "empInfo": {
                employeeCode: values.employeeInfo?.employeeCode || '',
                employeeName: values.employeeInfo?.employeeName || '',
                department: values.employeeInfo?.department || '',
                designation: values.employeeInfo?.designation || '',
                reportingManager: values.employeeInfo?.reportingManager || '',
                status: "Employee Saved",
                reviewAchivements: reviewAchievements,
                reviewRatings: reviewRatings
            }
        };

        service.createPerformanceForm(structuredData).then((res) => {
            if (res.status) {
                console.log("Saved Success")
            } else {
                console.log("Failed Saved")
            }
        }).catch((err) => {
            console.log(err, 'eerr')
        })
    };

    const handleConfirm = () => {
        const values = form.getFieldsValue();
        const impacts = Array(3).fill('').map((_, index) =>
            values.achievements?.impactAreas?.[index] || ''
        );
        const achievements = Array(3).fill('').map((_, index) =>
            values.achievements?.keyAchievements?.[index] || ''
        );

        const reviewAchievements = impacts.map((_, index) => ({
            impactAreas: impacts[index],
            keyAchievements: achievements[index],
        }));
        const reviewRatings = competenceAreas.map((area, index) => {
            const ratingData = values.ratings?.[index] || {
                competence: area.name,
                description: area.description,
                rating: '',
                remarks: ''
            };
            return {
                competence: area.name,
                description: area.description,
                rating: ratingData.rating || '',
                remarks: ratingData.remarks || ''
            };
        });

        const structuredData = {
            "empInfo": {
                employeeCode: values.employeeInfo?.employeeCode || '',
                employeeName: values.employeeInfo?.employeeName || '',
                department: values.employeeInfo?.department || '',
                designation: values.employeeInfo?.designation || '',
                reportingManager: values.employeeInfo?.reportingManager || '',
                status: "Employee Confirmed",
                reviewAchivements: reviewAchievements,
                reviewRatings: reviewRatings
            }
        };

        service.createPerformanceForm(structuredData).then((res) => {
            if (res.status) {
                console.log("Saved Success")
                setIsReadOnly(true);
            } else {
                console.log("Failed Saved")
            }
        }).catch((err) => {
            console.log(err, 'eerr')
        })
    };

    const ReadOnlyInput = ({ value }: { value: any }) => (
        <div >
            {value || '-'}
        </div>
    );

    const ReadOnlyTextArea = ({ value }: { value: any }) => (
        <h4>
            {value || '-'}
        </h4>
    );

    const ReadOnlySelect = ({ value, options }: { value: any, options: any[] }) => {
        const selectedOption = options.find(opt => opt.value === value);
        return (
            <div>
                <b>{selectedOption?.label || value || '-'}</b>
            </div>

        );
    };

    const ReadOnlyRate = ({ value }: { value: number }) => (
        <div >
            <Rate
                value={value}
                count={5}
                disabled
            />
        </div>
    );

    const selectOptions = [
        { value: "0", label: "0" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" }
    ];

    return (
        <Form form={form} layout="vertical">
            <Card title={"Employee Info"}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item
                            initialValue={props.rec}
                            name={['employeeInfo', 'employeeCode']}
                            label="Employee ID"
                        >
                            {isReadOnly ? (
                                <ReadOnlyInput value={form.getFieldValue(['employeeInfo', 'employeeCode'])} />
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
                            {isReadOnly ? (
                                <ReadOnlyInput value={form.getFieldValue(['employeeInfo', 'employeeName'])} />
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
                            {isReadOnly ? (
                                <ReadOnlyInput value={form.getFieldValue(['employeeInfo', 'department'])} />
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
                            {isReadOnly ? (
                                <ReadOnlyInput value={form.getFieldValue(['employeeInfo', 'designation'])} />
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
                            {isReadOnly ? (
                                <ReadOnlyInput value={form.getFieldValue(['employeeInfo', 'reportingManager'])} />
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
                                                {isReadOnly ? (
                                                    <ReadOnlySelect
                                                        value={form.getFieldValue(['achievements', 'impactAreas', index])}
                                                        options={selectOptions}
                                                    />
                                                ) : (
                                                    <Select placeholder="Please Select" allowClear showSearch style={{ width: '100%' }}>
                                                        {selectOptions.map(opt => (
                                                            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                                        ))}
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
                                                {isReadOnly ? (
                                                    <ReadOnlyTextArea
                                                        value={form.getFieldValue(['achievements', 'keyAchievements', index])}
                                                    />
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
                                    <Col span={6}>
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
                                    <Col span={4}>
                                        <Form.Item name={[field.name, 'rating']}>
                                            {isReadOnly ? (
                                                <ReadOnlyRate
                                                    value={form.getFieldValue(['ratings', index, 'rating'])}
                                                />
                                            ) : (
                                                <Rate
                                                    count={5}
                                                    style={{ marginTop: 10 }}
                                                    tooltips={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name={[field.name, 'remarks']}>
                                            {isReadOnly ? (
                                                <ReadOnlyTextArea
                                                    value={form.getFieldValue(['ratings', index, 'remarks'])}
                                                />
                                            ) : (
                                                <TextArea placeholder="Enter Remarks" />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                        </>
                    )}
                </Form.List>
            </Card>

            {!isReadOnly && (
                <>
                    <Button type="primary" onClick={handleSave}>Save</Button>
                    <Button style={{ marginLeft: 15 }} type="primary" onClick={handleConfirm}>Confirm</Button>
                </>
            )}
        </Form>
    );
};

export default PerformanceManagementSelfScreenForm;