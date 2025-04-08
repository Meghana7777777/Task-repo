import { ProCard } from "@ant-design/pro-components";
import { AlertMessages, empLoanSalaryIdDto } from "@hrexpert/shared-models";
import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import StatusTag from "./status-tag";
import dayjs from "dayjs";
import { EmpLoanSalarySharedService, PayrollComponentsSharedService, PayrollRecordsSharedService } from "@hrexpert/shared-services";
import EmpLoanSalaryPdf from "./emp-loan-salary-pdf-form";

const { Text, Link } = Typography;

interface EmpLoanSalaryDetailsProps {
    submittedData: any;
    employeedetails: any;
    formORview: number;
    remarks?: string;
    getPreviousLoans: any;
    empId: any 
  }

const EmpLoanSalaryDetails = (props: EmpLoanSalaryDetailsProps) => {
    const Service = new EmpLoanSalarySharedService()
    const [employeedetails, setEmployeedetails] = useState<any>([])
    const [pdfData, setPdfData] = useState<any>(null)
    const [form] = Form.useForm();
    const currentUrl: string = window.location.href;
    const params = currentUrl.split('?')[1];
    const [value1, value2] = params.split('-').map(Number);
    const [previousLoanData, setPreviousLoanData] = useState<any>([])
    const [remarks, setRemarks] = useState<string>()
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const [components, setComponents] = useState<any>([])
    const [loanData, setLoanData] = useState<any>()

    const submit = () => {
        try {
            const req = { employeeId: value1 }
            Service.getEmpLoanSalary(req).then((res) => {
                console.log("EmpLoanSalary response:", res);
                if (res.status) {
                    const record = res.data.find((rec) => rec.id === value2);
                    console.log("Filtered record:", record);
                    setPdfData(record);
                } else {
                    console.log("Failed to fetch data");
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        submit();
        getEmployeeDetails();
        getPreviousLoans();
        getAllPayrollNonRecurringComponents()
        getLoansData()
    }, []);

    useEffect(() => {
        if (pdfData) {
            form.setFieldsValue({
                id: pdfData.id || '',
            });
        }
    }, [pdfData]);


    const getEmployeeDetails = () => {
        const req = { id: value2 }
        try {
            Service.getEmpLoanSalary(req).then((res) => {
                console.log("Employee details response:", res);
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
            const component = components.find((res) => res.componentName === employeedetails[0].type)
            const req = { id: value2, remarks: form.getFieldValue('remarks'), req: request, componentId: component.id }
            Service.approveRejectLoan(req).then((res) => {
                console.log("Approve/Reject response:", res);
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

    const getPreviousLoans = () => {
        try {
            const req = new empLoanSalaryIdDto(value1)
            Service.getPreviousLoans(req).then((res) => {
                if (res.status) {
                    // const x = res.data.filter((res)=> res.employeeId === value1)
                    setPreviousLoanData(res.data)
                }
                else {
                    message.error("Failed to retrieve Loans ");
                }
            })
        } catch (error) {
            console.log(error);

        }
    };

    const getLoansData = () => {
        try {
            const req = new empLoanSalaryIdDto(null, value2)
            Service.getLoansData(req).then((res) => {
                if (res.status) {
                    // const x = res.data.filter((res)=> res.employeeId === value1)
                    setLoanData(res.data)
                }
                else {
                    message.error("Failed to retrieve Loans ");
                }
            })
        } catch (error) {
            console.log(error);

        }
    };

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

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value)
    };

    const totalLoanPendingAmount = () => {
        let x = 0
        {previousLoanData.map((data, index) => {
            x += Number(data.advanceAmount)
        }
        )}
        return x
    }


    if (pdfData) {
        return <>
            <ProCard gutter={20} split="vertical" style={{ background: 'transparent', boxShadow: 'none' }}>
                <ProCard colSpan="60%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }} >
                    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <EmpLoanSalaryPdf
                            submittedData={pdfData}
                            employeedetails={employeedetails}
                            formORview={1}
                            remarks={remarks}
                            getPreviousLoans={loanData}
                            empId={pdfData}
                        />
                    </div>
                </ProCard>

                <ProCard colSpan="40%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Card>
                        {(pdfData?.status !== 'OPEN' ? <Card>You Already <StatusTag status={pdfData?.status} />
                            <br></br>
                            <br></br>
                            {(pdfData?.remarks ? <><b>Remarks</b> :  <span>{pdfData?.remarks}</span></> : <> <b>Remarks</b> : <span style={{ color: 'gray', fontStyle: 'italic' }}>No Remarks Added</span></>)}
                        </Card> : <Card>Still In <StatusTag status={pdfData?.status} /></Card>)}

                        {(pdfData?.status === 'OPEN' ? <>
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
                                </Row>
                                <Row gutter={24} >
                                    <Popconfirm onConfirm={e => { approveReject('Approved') }}
                                        title={
                                            <>
                                            Previous total Pending Loans amounts : {'₹ ' + totalLoanPendingAmount()+ ' /-'}
                                           <br></br>
                                            Monthly Salary : {pdfData.monthlySalary? '₹ '+ pdfData.monthlySalary + ' /-': '-'}
                                            <br></br>
                                            Are you sure to Approve
                                            </>
                                        }
                                    >
                                        <Button style={{ width: 100, marginLeft: '1rem' }} type="primary" >
                                            Approve
                                        </Button>
                                    </Popconfirm>
                                    <Button style={{ width: 100, marginLeft: '1rem' }} type="primary" danger onClick={() => approveReject('Rejected')}>
                                        Reject
                                    </Button>
                                </Row>
                            </Form>
                        </> : <></>)}
                    </Card>
                    {(previousLoanData && previousLoanData.length > 0 ?
                        <>
                            {previousLoanData.map((data, index) => {
                                return (
                                    <Card style={{ marginTop: '1rem' }} bordered title={<span>{data.componentName}</span>}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}>
                                                <Text type="secondary">{data.type}</Text>
                                                <br />
                                                <Text strong>{'₹ ' + data.advanceAmount + ' /-'}</Text>
                                            </Col>
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}>
                                                <Text type="secondary">Date Of Applying</Text>
                                                <br />
                                                <Text strong>{dayjs(data.dateOfApplying).format('YYYY-MM-DD')}</Text>
                                            </Col>
                                        </Row>
                                    </Card>)
                            }
                            )}
                        </> :
                        <Card style={{ marginTop: '1rem' }}><span style={{ color: 'gray', fontStyle: 'italic' }}>No Current Running Loans</span></Card>
                    )}

                </ProCard>
            </ProCard >

        </>
    }

}
export default EmpLoanSalaryDetails;