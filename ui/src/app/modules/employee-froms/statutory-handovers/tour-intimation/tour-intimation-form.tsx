import { MinusCircleOutlined, PlusOutlined, UndoOutlined } from "@ant-design/icons";
import { AlertMessages, BranchReq, EmailRequest, TourTypeEnum } from "@hrexpert/shared-models";
import { BranchesService, configVariables, EmailSendingService, EmployeeOnboardingService, PayrollComponentsSharedService, TourIntimationService } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useIAMClientState } from '../../../../common/iam-client-react';
import TourIntimationPdf from "./tour-intimation-pdf-form";
import TourClaimPdfForm from "./tour-claim-pdf-form";
import TourExpensesClaimForm from "./tour-claim-pdf-form";
import axios from "axios";

const TourIntimationForm = () => {
    const [form] = Form.useForm();
    const Option = Select
    const [branches, setBranches] = useState<any>([]);
    const [toPlacebranches, settoPlaceBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const branchService = new BranchesService()
    const employeeDetails = new EmployeeOnboardingService()
    const tourIntimationService = new TourIntimationService()
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const [components, setComponents] = useState<any>([])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [pdfData, setPdfData] = useState<any>(null)
    const [employeedetails, setEmployeedetails] = useState<any>([])
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [internal, setInternal] = useState<boolean>(false)
    const [fromDateInput, setFromDateInput] = useState<boolean>(false)
    const [toDate, setToDate] = useState(null);
    const [noOfDays, setNoOfDays] = useState(null);
    const emailService = new EmailSendingService();
    const [tourEmployeedetails, setTourEmployeedetails] = useState<any>([])

    useEffect(() => {
        getAllBranches();
        // if (IAMClientAuthContext.user.roles != "SuperAdmin") {
        //     console.log(IAMClientAuthContext.user.roles, '-------uuuuuu----------')
        //     handleBranchChange(Number(IAMClientAuthContext.user.unitId))
        // }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            //form.setFieldsValue({ branches: "ALL" })
           // handleBranchChange(null)
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
            handleBranchChange(IAMClientAuthContext.user.unitId)

        }
        //getAllPayrollNonRecurringComponents()
    }, []);

    const getAllBranches = () => {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId: any) => {

        // if (branchId === "ALL") {
        //     form.setFieldsValue({ branches: null }); 
        // } else if (branchId === null) {
        //     form.setFieldsValue({ branches: "ALL" }); 
        // } else if (branchId === '') {
        //     form.setFieldsValue({ branches: "ALL" }); 
        // } else {
        form.setFieldsValue({ branches: branchId });

        const branchRequest = new BranchReq(branchId);
        employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
            if (res.status) {
                setEmployees(res.data);
            } else {
                setEmployees('No Data Found');
            }
        });
    };

    const Reset = () => {
        form.resetFields()
    }

    const submit = (values) => {
        try {
            const payRollComponent = components.find((rec) => rec.componentName === 'TOUR')?.id;
            values = { ...values, payRollComponent };
            tourIntimationService.createtourIntimation(values)
                .then((res) => {
                    if (res.status && res.errorCode === 1) {
                        //submitSendEmail(res.data[0].id);
                        AlertMessages.getSuccessMessage(res.internalMessage);
                        form.resetFields();
                        getEmployeeDetails();
                    } else if (res.status && res.errorCode === 0) {
                        AlertMessages.getInfoMessage(res.internalMessage);
                    } else {
                        console.log("Failed to post Data, unexpected response:", res);
                    }
                })
                .catch((err) => {
                    console.error("API Call Failed:", err);
                });
        } catch (err) {
            console.error("Unexpected Error in submit:", err);
        }
    };



    const submitSendEmail = (saveId: number) => {
        try {
            const req = {
                'to': ['rvkmohan07@gmail.com'],
                'cc': [form.getFieldValue('hodEmail')],
                'subject': `Tour Intimation Request`,
                'body': `
            <html>
            <head>
              <meta charset="UTF-8" />
            </head>
            <body>
              <p><span style="font-weight:bold">To : </span> ${tourEmployeedetails[0]?.rmFirstName},</p>
              <p >Sir/Madam,</p>  
              <p >I hope this email finds you well. I am writing to inform you that I am planning to go on a tour. During this period, I will not be available for regular duties.</p>
              <p>Details of the Tour submitted in the form please check and validate</p>
              <p>I kindly request your approval for this tour. Please let me know if you need any further details or if there are forms to be submitted for official purposes.</p>
              <p>Thank you for your understanding and support.</p>

              <p>Please click link below for the Information of tour and for response upload</p>
              <p>You can click below link to add remarks and  Approve & Reject</p>
              <a href="${configVariables.APP_EMS_SERVICE_URL}tour-intimation-details?${form.getFieldValue('employeeId') + "-" + saveId}" target='_blank'>Tour Information Details</a>
            </body>
          </html> `}
            const response = axios.post("https://alerts.schemaxtech.in/email/send", req, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("Email sent successfully!");
        } catch (error) {
            console.error("Error in email sending process:", error);
            message.error("An error occurred while sending emails", 2);
        }
    };

    const handleViewPdf = async () => {
        try {
            const values = await form.validateFields();
            getEmployeeDetails()
            setPdfData(values)
            setOpenModal(true)
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    const getEmployeeDetails = () => {
        const req = { employeeId: form.getFieldValue('employeeId') }
        try {
            tourIntimationService.gettourEmployeeData(req).then((res) => {
                if (res.status) {
                    setTourEmployeedetails(res.data)
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllPayrollNonRecurringComponents = () => {
        try {
            payrollComponentsSharedService.getAllPayrollNonRecurringComponents().then((res) => {
                if (res.status) {
                    setComponents(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const validation = () => {
        if (form.getFieldValue('advanceRequired') && form.getFieldValue('emiCount')) {
            const emiAmount = (form.getFieldValue('advanceRequired')) / (form.getFieldValue('emiCount'))
            form.setFieldsValue({ emiAmount: emiAmount })
        } else {
            form.setFieldsValue({ emiCount: '' })
            form.setFieldsValue({ emiAmount: '' })
            if (!form.getFieldValue('advanceRequired')) {
                form.setFields([{ name: 'advanceRequired', errors: ['Please fill in the Total Amount'] }])
            }
        }
    }

    const handleStartMonthChange = (value) => {
        const emiCount = form.getFieldValue("emiCount");
        if (emiCount && value) {
            const endDate = dayjs(value).add(emiCount - 1, "months")
            form.setFieldsValue({ endDate });
        } else {
            form.setFieldsValue({ endDate: null });
        }
    };

    const handleEmiCountChange = (value) => {
        const startDate = form.getFieldValue("startDate");
        if (startDate && value) {
            const endDate = dayjs(startDate).add(value - 1, "months")
            form.setFieldsValue({ endDate });
        } else {
            form.setFieldsValue({ endDate: null });
        }
    };

    const onTourTypeChange = (value) => {
        if (value === 'Internal') {
            setInternal(true)
        } else {
            setInternal(false);
        }
    }

    const onFromPlaceChange = (value, name) => {
        settoPlaceBranches(branches.filter((rec) => rec.branchName !== value))
        const fields = form.getFieldValue('employeeTourDetails');
        fields[name].fromPlace = value
        form.setFieldsValue({ employeeTourDetails: fields });

    }

    const onToPlaceChange = (value, name) => {
        const fields = form.getFieldValue('employeeTourDetails');
        fields[name].toPlace = value
        form.setFieldsValue({ employeeTourDetails: fields });

    }

    const onChangeNoOfDays = (value: string, name: number) => {
        const noOfDays = Number(value)
        setNoOfDays(noOfDays)
        if (!noOfDays) {
            const fields = form.getFieldValue('employeeTourDetails');
            fields[name].fromDate = null
            fields[name].toDate = null
            form.setFieldsValue({ employeeTourDetails: fields });
        }
    };

    const onChangeFromDate = (date: Dayjs | null, name: number) => {
        const fields = form.getFieldValue('employeeTourDetails');
        if (date) {
            const toDate = date.clone().add(noOfDays - 1, "days");
            fields[name].toDate = toDate
            form.setFieldsValue({ employeeTourDetails: fields });
        }
    };


    return (
        <>
            <Card title="Apply Tour Intimation Form"
                extra={<><Button onClick={() => { handleViewPdf() }}>View Pdf</Button></>} >
                <Form layout='vertical' form={form} onFinish={submit}>
                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Branch" name="branches"
                                // initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.unitId)}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a branch',
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    placeholder="Select Branch"
                                    dropdownMatchSelectWidth={false}
                                    showSearch disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children"
                                    onChange={(value) => handleBranchChange(value)}>
                                    {/* <Option value={''}> ALL </Option> */}
                                    {branches.map((rec: any) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label='Employee Name' name='employeeId' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : Number(IAMClientAuthContext.user.employeeId)} rules={[{ required: true, message: 'Please select a Employeee' }]}>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} disabled={role === 'SuperAdmin' ? false : true}
                                    optionFilterProp="children" placeholder="Select Employee Name" >
                                    {employees.map((rec: any) => (
                                        <Option value={rec.employeeId} key={rec.employeeId}>
                                            {rec.employeeCode} {rec.employeeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Form.Item label="Tour Type" name="tourType" rules={[{ required: true, message: 'Please select a Tour Type' }]}>
                                <Select showSearch allowClear dropdownMatchSelectWidth={false} optionFilterProp="children" placeholder="Select Tour Type" onChange={onTourTypeChange}>
                                    {Object.entries(TourTypeEnum).map(([key, value]) => (
                                        <Select.Option value={value} key={key}>
                                            {value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Purpose Of Visit' name='purposeOfVisit' >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Card>
                        <Form.List name="employeeTourDetails" initialValue={[{}]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <>
                                            <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'noOfDays']}
                                                    label="No of Days For Tour"
                                                    rules={[
                                                        { required: true, message: 'Please enter days!' },
                                                        { pattern: /^\d+$/, message: 'Only numbers are allowed' },
                                                    ]}
                                                >
                                                    <Input onChange={(e) => onChangeNoOfDays(e.target.value, name)} />
                                                </Form.Item>
                                            </Col>

                                            <Row gutter={[24, 16]} style={{ marginBottom: '16px' }}>
                                                <Form.Item name={[name, 'id']} hidden></Form.Item>
                                                <Form.Item name='employeeId' hidden></Form.Item>

                                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'fromDate']}
                                                        label="From Date"
                                                        rules={[{ required: true, message: 'Please select date' }]}
                                                    >
                                                        <DatePicker
                                                            style={{ width: '100%' }}
                                                            onChange={(date) => onChangeFromDate(date, name)}
                                                        //disabledDate={(current) => current && current < moment().startOf('day')}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                                    <Form.Item label='From Place' name={[name, 'fromPlace']} >
                                                        {(internal ?
                                                            <>  <Select showSearch onChange={(place) => onFromPlaceChange(place, name)}
                                                                allowClear
                                                                placeholder="Select Branch"
                                                                dropdownMatchSelectWidth={false}
                                                                optionFilterProp="children">
                                                                {branches.map((rec: any) => (
                                                                    <Option value={rec.branchName} key={rec.branchName}>
                                                                        {rec.branchName}
                                                                    </Option>
                                                                ))}
                                                            </Select></> :
                                                            <><Input placeholder='Enter To Place' /></>)}
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'toDate']}
                                                        label="To Date"
                                                        rules={[{ required: true, message: 'Please select date' }]}
                                                    >
                                                        <DatePicker
                                                            style={{ width: '100%' }} disabled
                                                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                                                    <Form.Item label='To Place' name={[name, 'toPlace']} >
                                                        {(internal ?
                                                            <>  <Select showSearch onChange={(place) => onToPlaceChange(place, name)}
                                                                allowClear
                                                                placeholder="Select Branch"
                                                                dropdownMatchSelectWidth={false}
                                                                optionFilterProp="children">
                                                                {toPlacebranches.map((rec: any) => (
                                                                    <Option value={rec.branchName} key={rec.branchName}>
                                                                        {rec.branchName}
                                                                    </Option>
                                                                ))}
                                                            </Select></> :
                                                            <><Input placeholder='Enter Destination Place' /></>)}
                                                    </Form.Item>
                                                </Col>


                                                <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginLeft: 'auto', textAlign: 'right', marginTop: "23px" }}>
                                                    <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                        <PlusOutlined />
                                                    </Button>

                                                    {fields.length > 1 ? (
                                                        <Button type="dashed" danger onClick={() => { remove(index) }} style={{ width: "20%", marginLeft: "23px" }}>
                                                            <MinusCircleOutlined />
                                                        </Button>
                                                    ) : null}
                                                </Col>

                                            </Row>

                                        </>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Card>
                    <Row gutter={24} style={{ marginTop: '1rem' }}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='Expenditure advance amount' name='advanceRequired' rules={[{ required: true, message: 'Please Enter Amount!' }, { pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                <Input onChange={validation} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='CC Email' name='hodEmail' rules={[{ type: 'email', message: 'Please enter a valid email address!', }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                    </Row>

                    {/* <Row gutter={24}>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='EMI Months' name='emiCount' rules={[{ required: true, message: 'Please select a emi count!' }]}>
                                <InputNumber
                                    onChange={(value) => { validation(), handleEmiCountChange(value) }}
                                    style={{ width: '100%' }}
                                    min={1}
                                    max={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label='EMI Amount' name='emiAmount' rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label="Start Month" name="startDate" rules={[
                                { required: true, message: "Please select a start month!" },
                            ]}>
                                <DatePicker
                                    picker="month"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) => {
                                        return current && current < moment().startOf("day");
                                    }}
                                    onChange={handleStartMonthChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                            <Form.Item label="End Month" name="endDate" rules={[
                                { required: true, message: "Please select a end month!" },
                            ]}>
                                <DatePicker
                                    disabled
                                    picker="month"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) => {
                                        return current && current < moment().startOf("day");
                                    }}
                                />
                            </Form.Item>
                        </Col>

                    </Row> */}

                    <Row gutter={24}>
                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                            <Button color="primary" variant="outlined" htmlType="submit">
                                Submit
                            </Button>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                            <Button icon={<UndoOutlined />} onClick={Reset} type='dashed' danger> Reset </Button>
                        </Col>
                    </Row>


                </Form>

                <Modal
                    width={1000}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    footer={null}
                >
                    <TourIntimationPdf submittedData={pdfData} employeedetails={tourEmployeedetails} formORview={0} />
                </Modal>

            </Card>
        </>
    )
}
export default TourIntimationForm;