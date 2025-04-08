import { FilePdfOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { configVariables } from '@hrexpert/shared-services'
import { Button, Col, DatePicker, Form, FormInstance, Input, message, Modal, Row, Upload } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
export interface EmployeeExperienceDetailsFormProps {
    form: FormInstance<any>
    isUpdate: boolean
    employeeData: any
}
const EmployeeExperienceDetailsForm = (props: EmployeeExperienceDetailsFormProps) => {
    const { form } = props
    const [fileList, setFileList] = useState<any[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [ModalOpen, setModalOpen] = useState(false);
    const [pdfViewindex, setPdfViewindex] = useState<string>();
    const docUrl = configVariables.EXPERIENCE_PROOF_UPLOAD_URL
    useEffect(() => {
        const values = form.getFieldValue("employeeExperienceDetails");
        if (!values || values.length === 0) {
            form.setFieldsValue({ employeeExperienceDetails: [{}] });
        }
    }, []);

    const onChangeFromDate = (date: dayjs.Dayjs | null, name: number) => {
        const fields = form.getFieldValue('employeeExperienceDetails')
        const noOfYears = form.getFieldValue(['employeeExperienceDetails', name, 'yearOfExp'])
    
        if (date && noOfYears) {
            const years = Math.floor(noOfYears)
            const months = (noOfYears % 1) * 12
            const toDate = date.add(years, 'year').add(months, 'month').startOf('day')
    
            if (toDate.isAfter(dayjs())) {
                message.error('Experience cannot be in the future')
                fields[name].toDate = null
                fields[name].toDateDisabled = true
            } else {
                fields[name].toDate = toDate
                fields[name].toDateDisabled = false
            }
    
            form.setFieldsValue({ employeeExperienceDetails: fields })
        }
    }
    

    const onChangeNoOfYearsExperience = (value: string, name: number) => {
        const fields = form.getFieldValue('employeeExperienceDetails')
        const fromDate = fields[name]?.fromDate

        if (fromDate && /^\d*\.?\d*$/.test(value)) {
            const noOfYears = parseFloat(value)
            const toDate = dayjs(fromDate).add(noOfYears * 365, 'day')

            if (toDate.isAfter(dayjs())) {
                message.error('Wrong date: Experience cannot be in the future.')
                fields[name].toDate = null
                fields[name].toDateDisabled = true
            } else {
                fields[name].toDate = toDate
                fields[name].toDateDisabled = false
            }
        } else {
            fields[name].toDate = null
            fields[name].toDateDisabled = true
        }

        form.setFieldsValue({ employeeExperienceDetails: fields })
    }

    // const onChangeNoOfYearsExperience = (value: string, name: number) => {
    //     const numericValue = parseFloat(value)
    //     if (isNaN(numericValue)) {
    //         return
    //     }
    //     const years = Math.floor(numericValue)
    //     const fractionalYears = numericValue - years
    //     const months = Math.floor(fractionalYears * 12)
    //     const days = Math.floor((fractionalYears * 12 - months) * 30)
    //     const totalMonths = years * 12 + months
    //     const totalDays = years * 365 + days
    //     setNoOfYears(totalDays)
    //     const fields = form.getFieldValue('employeeExperienceDetails')
    //     if (fields[name].fromDate) {
    //         const fromDate = dayjs(fields[name].fromDate)
    //         const toDate = fromDate.add(totalMonths, 'months').add(days, 'days')
    //         fields[name].toDate = toDate
    //         form.setFieldsValue({ employeeExperienceDetails: fields })
    //     }

    //     if (!totalDays) {
    //         fields[name].fromDate = null
    //         fields[name].toDate = null
    //         form.setFieldsValue({ employeeExperienceDetails: fields })
    //     }
    // }

    const handleFileChange = (index, newList) => {
        const updatedFileLists = [...fileList];
        updatedFileLists[index] = newList;
        setFileList(updatedFileLists);
    };

    const handleRemoveRow = (index: number) => {
        const updatedFileLists = [...fileList];
        updatedFileLists.splice(index, 1);
        setFileList(updatedFileLists);
        const updatedTypes = [...selectedTypes];
        updatedTypes.splice(index, 1);
        setSelectedTypes(updatedTypes);
    };

    const uploadProps = (index) => ({
        multiple: false,
        onRemove: (file) => {
            const updatedList = fileList[index].filter((rec) => rec.uid !== file.uid);
            handleFileChange(index, updatedList);
        },
        beforeUpload: (file) => {
            if (!file.name.match(/\.(pdf|PDF)$/)) {
                message.error("Only PDF files are allowed.");
                return false;
            }
            const newList = [file];
            handleFileChange(index, newList);

            return false;
        },
        fileList: fileList[index] || [],
        defaultFileList: fileList[index] || [],
        showUploadList: true,
    });

    const pdfPreview = (index) => {
        setModalOpen(true)
        setPdfViewindex(index)
    }

    return (
        <>
            <Form.List name="employeeExperienceDetails" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => (
                            <Row gutter={[24, 16]} style={{ marginBottom: '16px' }}>
                                <Form.Item name={[name, 'id']} hidden></Form.Item>

                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                    <Form.Item label='Organisation' name={[name, 'organisation']}>
                                        <Input placeholder='Enter Organisation' />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                    <Form.Item
                                        label="Year of Exp"
                                        name={[name, 'yearOfExp']}
                                    >
                                        <Input
                                            placeholder="Enter Year of Exp"
                                            onKeyPress={(e) => {
                                                if (!/^[0-9.]$/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    e.target.value = value;
                                                    onChangeNoOfYearsExperience(value, name);
                                                } else {
                                                    e.target.value = value.slice(0, -1);
                                                }
                                            }}
                                        />
                                    </Form.Item>

                                </Col>

                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                    <Form.Item label='From Date' name={[name, 'fromDate']} >
                                        <DatePicker placeholder='Enter From Date' style={{ width: "100%" }} format="DD/MM/YYYY" disabledDate={(current) => current && current > dayjs().endOf('day')} onChange={(date) => onChangeFromDate(date, name)} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                    <Form.Item label='To Date' name={[name, 'toDate']}>
                                        <DatePicker
                                            placeholder='Enter To Date'
                                            style={{ width: "100%" }}
                                            format="DD/MM/YYYY"
                                            disabled={form.getFieldValue(['employeeExperienceDetails', name, 'toDateDisabled'])}
                                        />
                                    </Form.Item>
                                </Col>


                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                    <Form.Item
                                        name={[name, 'file']}
                                        label="Document Upload"
                                    //rules={[{ required: true, message: 'Upload is required' }]}

                                    >
                                        <Upload
                                            key={`upload-${index}`}
                                            showUploadList={true}
                                            {...uploadProps(index)}
                                            style={{ width: "100%" }}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>


                                <Col xs={5} sm={8} md={6} lg={4} xl={3} style={{ textAlign: "center", marginTop: 20 }}>
                                    {(fileList[index] && fileList[index]?.length > 0) || (props.isUpdate && props?.employeeData[index]?.file) ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} onClick={() => pdfPreview(index)} />
                                        </div>
                                    ) : <> </>}
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginLeft: 'auto', textAlign: 'right', marginTop: "23px" }}>
                                    {index === fields.length - 1 && (
                                        <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                            <PlusOutlined />
                                        </Button>
                                    )}
                                    {fields.length > 1 ? (
                                        <Button type="dashed" danger onClick={() => { remove(index), handleRemoveRow(index); }} style={{ width: "20%", marginLeft: "23px" }}>
                                            <MinusCircleOutlined />
                                        </Button>
                                    ) : null}
                                </Col>

                            </Row>
                        ))}
                    </>
                )}

            </Form.List>

            <Modal
                open={ModalOpen}
                footer={null}
                onCancel={() => setModalOpen(false)}
                width="50%"
                height='50%'
            >
                {/* <iframe  width="80%" height='800px' src={props.isUpdate ? docUrl + props?.employeeData[pdfViewindex]?.file : fileList ? URL.createObjectURL(fileList[pdfViewindex]?.[0]) : ''} ></iframe>  */}
                <iframe
                    width="80%"
                    height="800px"
                    src={
                        props.isUpdate
                            ? docUrl + (props?.employeeData[pdfViewindex]?.file || '')
                            : fileList && fileList[pdfViewindex]?.[0] instanceof File
                                ? URL.createObjectURL(fileList[pdfViewindex][0])
                                : ''
                    }
                ></iframe>
            </Modal>
        </>
    )
}

export default EmployeeExperienceDetailsForm