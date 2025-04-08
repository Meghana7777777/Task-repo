import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { QualificationsSharedService } from '@hrexpert/shared-services'
import { Button, Col, DatePicker, Form, FormInstance, Input, message, Row, Select } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
const { Option } = Select
export interface EmployeeEducationDetailsFormProps {
    form: FormInstance<any>
    isUpdateEduDetails?: boolean
    rejoinStateChange?: boolean
}
const EmployeeEducationDetailsForm = (props: EmployeeEducationDetailsFormProps) => {
    const { form } = props
    const [qualifications, setQualifications] = useState<any[]>([])
    const [specializations, setSpecializations] = useState<any[]>([])
    const qualificcationsService = new QualificationsSharedService()
    const [selectedEdu, setSelectedEdu] = useState<any>([])
    useEffect(() => {
        getQualifications()
    }, [])
    const getQualifications = () => {
        qualificcationsService.getActiveQualifications().then((res) => {
            if (res.status) {
                setQualifications(res.data)
            }
        }).catch((err) => {
            console.error(err)
        })
    }
    const getSpecializations = (val) => {
        qualificcationsService.getSpecializations({ qualificationId: val }).then((res) => {
            if (res.status) {
                setSpecializations(res.data)
            }
        }).catch((err) => {
            console.error(err)
        })
    }
    useEffect(() => {
        const values = form.getFieldValue("employeeEduDetails");
        if (!values || values.length === 0) {
            form.setFieldsValue({ employeeEduDetails: [{}] });
        }
    }, []);

    const EduDuplicateValidate = (val: any, name: any) => {
        if (selectedEdu.includes(val)) {
            message.error('Education Already selected')
            const fields = form.getFieldValue('employeeEduDetails');
            fields[name].empQualification = null
            form.setFieldsValue({ employeeEduDetails: fields });
        } else {
            setSelectedEdu([...selectedEdu, val]);
        }
    };

    const removeSelectedEduProof = (name: number) => {
        const fields = form.getFieldValue('employeeEduDetails');
        if (!fields || !fields[name] || !fields[name].empQualification) {
            console.error("Invalid field data");
            return;
        }
        const updatedSelectedEdu = selectedEdu.filter(
            (item) => item === fields[name].empQualification
        );
        setSelectedEdu(updatedSelectedEdu)
    };



    return (
        <>
            <Form.List name="employeeEduDetails" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => {
                            return (
                                <Row gutter={[24, 16]} style={{ marginBottom: '16px' }}>
                                    <Form.Item name={[name, 'id']} hidden></Form.Item>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='Employee Qualification' name={[name, 'empQualification']}>
                                            <Select placeholder="Select Qualificaiton" allowClear onChange={(val) => { getSpecializations(val), EduDuplicateValidate(val, name) }} >
                                                {qualifications.map((v) => (
                                                    <Option key={v.id} value={v.id}>{v.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='University' name={[name, 'university']} >
                                            <Input placeholder='Enter University' />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='College Name' name={[name, 'collegeName']} >
                                            <Input placeholder='Enter College Name' />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='Specialization' name={[name, 'specialization']}>
                                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                                optionFilterProp="children" placeholder="Select Specialization" >
                                                {specializations.map((rec: any) => (
                                                    <Option value={rec.specialization} key={rec.specialization}>
                                                        {rec.specialization}
                                                    </Option>
                                                ))}
                                                <Select.Option key="others" value="Others">
                                                    Others
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='Year of Pass' name={[name, 'yearOfPass']}
                                        >
                                            <DatePicker
                                                picker='year'
                                                style={{ width: "100%" }}
                                                placeholder='Enter Year of Pass'
                                                format="YYYY"
                                                disabledDate={(current) => current && current > dayjs().endOf('year')}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                        <Form.Item label='Percentage' name={[name, 'percentage']}>
                                            <Input placeholder='Enter Percentage' />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginLeft: 'auto', textAlign: 'right', marginTop: "23px" }}>
                                        {index === fields.length - 1 && (
                                            <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                <PlusOutlined />
                                            </Button>
                                        )}
                                        {fields.length > 1 ? (
                                            <Button type="dashed" danger onClick={() => { remove(index), removeSelectedEduProof(name) }} style={{ width: "20%", marginLeft: "23px" }}>
                                                <MinusCircleOutlined />
                                            </Button>
                                        ) : null}
                                    </Col>

                                </Row>
                            )
                        })}
                    </>
                )}

            </Form.List>
        </>
    )
}

export default EmployeeEducationDetailsForm