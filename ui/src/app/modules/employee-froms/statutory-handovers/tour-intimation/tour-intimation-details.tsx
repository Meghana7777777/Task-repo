import { ProCard } from "@ant-design/pro-components";
import { AlertMessages } from "@hrexpert/shared-models";
import { PayrollRecordsSharedService, TourIntimationService } from "@hrexpert/shared-services";
import { Button, Card, Col, Form, Input, Modal, Row, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import TourIntimationPdf from "./tour-intimation-pdf-form";
import StatusTag from "./status-tag";
import dayjs from "dayjs";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

const TourIntimationDetails = () => {
    const tourIntimationService = new TourIntimationService()
    const [employeedetails, setEmployeedetails] = useState<any>([])
    const [pdfData, setPdfData] = useState<any>(null)
    const [form] = Form.useForm();
    const currentUrl: string = window.location.href;
    const params = currentUrl.split('?')[1];
    const [value1, value2] = params.split('-').map(Number);
    const payrollRecordsSharedService = new PayrollRecordsSharedService()
    const [loanData, setLoanData] = useState<any>([])
    const [remarks, setRemarks] = useState<string>()
     const [openInfo, setOpenInfo] = useState<boolean>(false)

    useEffect(() => {
        submit()
        getEmployeeDetails()
        getLoansData({ payRollEmployee: value1 })
    }, []);

    const submit = () => {
        try {
            const req = { id: value2 };
            tourIntimationService.gettourIntimation(req).then((res) => {
                if (res.status) {
                    const record = res.data.find((rec) => rec.id === value2);
                    console.log("Filtered record:", record);
                    setPdfData(record);
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getEmployeeDetails = () => {
        const req = { employeeId: value1 }
        try {
            tourIntimationService.gettourEmployeeData(req).then((res) => {
                if (res.status) {
                    setEmployeedetails(res.data)
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const approveReject = (request) => {
        try {
            const req = { id: value2, remarks: form.getFieldValue('remarks'), req: request, permissionAmount: form.getFieldValue('permissionAmount') }
            tourIntimationService.approveReject(req).then((res) => {
                if (res.status) {
                    form.resetFields()
                    window.location.reload()
                    AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getLoansData = (value1) => {
        try {
            payrollRecordsSharedService.getEmpNonRecurring(value1).then((res) => {
                if (res.status) {
                    const record = res.data.filter((rec) => rec.componentName === 'TOUR');
                    setLoanData(record)
                    //AlertMessages.getSuccessMessage(res.internalMessage)
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value)
    };

    const getRemainingAmount = (TermDetails) => {
        let amount = 0
        for (const x of JSON.parse(TermDetails)) {
            if (x.isProcessed === 0) {
                amount += Number(x.emiAmount)
            }
        }
        return amount
    }

    if (pdfData) {
        return <>
            <ProCard gutter={20} split="vertical" style={{ background: 'transparent', boxShadow: 'none' }}>
                <ProCard colSpan="60%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }} >
                    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <TourIntimationPdf
                            submittedData={pdfData}
                            employeedetails={employeedetails}
                            formORview={1}
                            remarks={remarks} />
                    </div>
                </ProCard>

                <ProCard colSpan="40%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Card>
                        {(pdfData?.permission !== 'OPEN' ? <Card>You Already <StatusTag status={pdfData?.permission} />
                            <br></br>
                            <br></br>
                            {(pdfData?.remarks ? <><b>Remarks</b> :  <span>{pdfData?.remarks}</span></> : <> <b>Remarks</b> : <span style={{ color: 'gray', fontStyle: 'italic' }}>No Remarks Added</span></>)}
                        </Card> : <Card>Still In <StatusTag status={pdfData?.permission} /></Card>)}

                        {(pdfData?.permission === 'OPEN' ? <>
                            <Form layout='vertical' form={form}>
                                <Row gutter={24}>
                                    <Form.Item hidden label='id' name='id' rules={[{ required: true }]}>
                                        <Input disabled />
                                    </Form.Item>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item label='Remarks' name='remarks'>
                                            <TextArea onChange={handleRemarksChange} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item label={<>{'Permission Amount '}<InfoCircleOutlined style={{marginLeft:'0.5rem', cursor:'pointer'}} onClick={()=>{setOpenInfo(true)}} /></>} name='permissionAmount' rules={[{ required: true, message: 'Please Enter Amount!' }, { pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                            <Input defaultValue={pdfData?.advanceRequired}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24} >
                                    <Button style={{ width: 100, marginLeft: '1rem' }} type="primary" onClick={() => approveReject('Approved')}>
                                        Approve
                                    </Button>
                                    <Button style={{ width: 100, marginLeft: '1rem' }} type="primary" danger onClick={() => approveReject('Rejected')}>
                                        Reject
                                    </Button>
                                </Row>
                            </Form>
                        </> : <></>)}

                        {(loanData && loanData.length > 0 ?
                            <>
                                {loanData.map((data, index) => {
                                    return (
                                        <Card style={{ marginTop: '1rem' }} bordered title={<span>{data.componentName}</span>}>
                                            <Row gutter={[16, 16]}>
                                                <Col span={12}>
                                                    <Text type="secondary">Loan Amount</Text>
                                                    <br />
                                                    <Text strong>{'₹ ' + data.totalAmount + ' /-'}</Text>
                                                </Col>
                                                <Col span={12}>
                                                    <Text type="secondary">Remaining Amount</Text>
                                                    <br />
                                                    <Text strong>{'₹ ' + getRemainingAmount(data.TermDetails) + ' /-'}</Text>
                                                </Col>
                                            </Row>
                                            <Row gutter={[16, 16]}>
                                                <Col span={12}>
                                                    <Text type="secondary">Start Month</Text>
                                                    <br />
                                                    <Text strong>{dayjs(data.startDate).format('YYYY-MM')}</Text>
                                                </Col>
                                                <Col span={12}>
                                                    <Text type="secondary">End Month</Text>
                                                    <br />
                                                    <Text strong>{dayjs(data.endDate).format('YYYY-MM')}</Text>
                                                </Col>
                                            </Row>
                                        </Card>)
                                }
                                )}
                            </> :
                            <Card style={{ marginTop: '1rem' }}><span style={{ color: 'gray', fontStyle: 'italic' }}>No Current Running Loans</span></Card>
                        )}
                    </Card>
                </ProCard>
            </ProCard >

            <Modal
                width={1000}
                open={openInfo}
                onCancel={() => setOpenInfo(false)}
                footer={null}
            >
              <Card>information</Card>
            </Modal>
        </>
    }

}
export default TourIntimationDetails;