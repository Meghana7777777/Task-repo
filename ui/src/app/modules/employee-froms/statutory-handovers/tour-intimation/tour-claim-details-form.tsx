import { MinusCircleOutlined, PlusOutlined, UndoOutlined } from "@ant-design/icons";
import { AlertMessages, EmailRequest, ModeOfTransportEnum } from "@hrexpert/shared-models";
import { configVariables, EmailSendingService, PayrollRecordsSharedService, TourIntimationService } from "@hrexpert/shared-services";
import { pdf } from "@react-pdf/renderer";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import sakkuLogo from './sakku-logo.png';
import TourExpensesClaimForm from "./tour-claim-pdf-form";
import './tour.css';
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";

const TourClaimDetailsForm = () => {
    const tourIntimationService = new TourIntimationService()
    const [employeedetails, setEmployeedetails] = useState<any>([])
    const [pdfData, setPdfData] = useState<any>(null)
    const [form] = Form.useForm();
    const currentUrl: string = window.location.href;
    const params = currentUrl.split('?')[1];
    const [eId, tId, tcId] = params.split('-').map(Number);
    const [fareDetailsTotalAmount, setFreDetailsTotalAmount] = useState<number>(0)
    const [taDaDetailsTotalAmount, setTaDaDetailsTotalAmount] = useState<number>(0)
    const [LocalConvyTotalAmount, setLocalConvyTotalAmount] = useState<number>(0)
    const [otherExpensesTotalAmount, setOtherExpensesTotalAmount] = useState<number>(0)
    const [balanceTotalAmount, setBalanceTotalAmount] = useState<number>(null)
    const emailService = new EmailSendingService();
    const [tourClaimData, setTourClaimData] = useState<any>([])
    const [frdLen, setFrdLen] = useState<number>()
    const navigate = useNavigate();
    const docUrl = configVariables.TOUR_PDF_URL
    

    useEffect(() => {
        gettourIntimation()
        getEmployeeDetails()
        if (tcId !== 0) {
            gettourClaim()
        }
    }, []);

    const gettourIntimation = async () => {
        try {
            const req = { id: tId };
            const res = await tourIntimationService.gettourIntimation(req);

            if (res.status && Array.isArray(res.data) && res.data.length > 0) {
                const tourData = res.data[0];
                setPdfData(tourData);
                const employeeTourDetails = JSON.parse(tourData.employeeTourDetails);
                if (tcId === 0) {
                    setFrdLen(employeeTourDetails.length)
                    let fields = form.getFieldValue('fareDetails') || [];
                    employeeTourDetails.forEach((tourDetail, index) => {
                        fields[index] = fields[index] || {};
                        fields[index].fareDetailsFromPlace = tourDetail.fromPlace;
                        fields[index].fareDetailstoPlace = tourDetail.toPlace;
                        fields[index].fareDetailsfromDate = dayjs(tourDetail.fromDate);
                        fields[index].fareDetailstoDate = dayjs(tourDetail.toDate);
                    });
                    form.setFieldsValue({ fareDetails: fields });
                }
            } else {
                console.error("Failed to fetch data or no data available.");
            }
        } catch (err) {
            console.error("An error occurred:", err);
        }
    };

    const gettourClaim = () => {
        try {
            const req = { id: tcId };
            tourIntimationService.gettourClaim(req).then((res) => {
                if (res.status) {
                    const Data = res.data[0]
                    setTourClaimData(Data)
                    const fareTourDetails = JSON.parse(Data.fareDetails)
                    if (tcId !== 0) {
                        setFrdLen(fareTourDetails.length)
                        let fields1 = form.getFieldValue('fareDetails') || []
                        let count = 0
                        fareTourDetails.forEach((fareDetails, index) => {
                            fields1[index] = fields1[index] || {}
                            fields1[index].fareDetailsFromPlace = fareDetails.fareDetailsFromPlace
                            fields1[index].fareDetailstoPlace = fareDetails.fareDetailstoPlace
                            fields1[index].fareDetailsfromDate = dayjs(fareDetails.fareDetailsfromDate)
                            fields1[index].fareDetailstoDate = dayjs(fareDetails.fareDetailstoDate)
                            fields1[index].fareDetailstransport = fareDetails.fareDetailstransport
                            fields1[index].fareDetailsAmount = fareDetails.fareDetailsAmount
                            count += Number(fareDetails.fareDetailsAmount)
                        });
                        form.setFieldsValue({ fareDetails: fields1 })
                        setFreDetailsTotalAmount(count)

                        let fields2 = form.getFieldValue('taDaDetails') || []
                        count = 0
                        JSON.parse(Data.taDaDetails).forEach((taDaDetails, index) => {
                            fields2[index] = fields2[index] || {}
                            fields2[index].taDaDetailsDetails = taDaDetails.taDaDetailsDetails
                            fields2[index].taDaDetailsFoodExpenses = taDaDetails.taDaDetailsFoodExpenses
                            fields2[index].taDaDetailsDate = dayjs(taDaDetails.taDaDetailsDate)
                            fields2[index].taDaDetailsAmount = taDaDetails.taDaDetailsAmount
                            count += Number(taDaDetails.taDaDetailsAmount)
                        })
                        form.setFieldsValue({ taDaDetails: fields2 })
                        setTaDaDetailsTotalAmount(count)

                        let fields3 = form.getFieldValue('localConvyDetails') || []
                        count = 0
                        JSON.parse(Data.localConvyDetails).forEach((d, index) => {
                            fields3[index] = fields3[index] || {}
                            fields3[index].localConvyFromPlace = d.localConvyFromPlace
                            fields3[index].localConvyToPlace = d.localConvyToPlace
                            fields3[index].localConvyDate = dayjs(d.localConvyDate)
                            fields3[index].localConvytourType = d.localConvytourType
                            fields3[index].LocalConvyAmount = d.LocalConvyAmount
                            count += Number(d.LocalConvyAmount)
                        })
                        form.setFieldsValue({ localConvyDetails: fields3 });
                        setLocalConvyTotalAmount(count)

                        let fields4 = form.getFieldValue('otherExpensesDetails') || []
                        count = 0
                        JSON.parse(Data.otherExpensesDetails).forEach((d, index) => {
                            fields4[index] = fields4[index] || {}
                            fields4[index].otherExpNatureOfexp = d.otherExpNatureOfexp
                            fields4[index].otherExpDate = dayjs(d.otherExpDate)
                            fields4[index].otherExpAmount = d.otherExpAmount
                            count += Number(d.otherExpAmount)
                        })
                        form.setFieldsValue({ otherExpensesDetails: fields4 });
                        setOtherExpensesTotalAmount(count)
                    }
                } else {
                    console.log("Failed to fetch data");
                    AlertMessages.getErrorMessage(res.internalMessage)

                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getEmployeeDetails = () => {
        const req = { employeeId: eId }
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

    const Reset = () => {
        form.resetFields()
    }

    const tableStyle: React.CSSProperties = {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "15px",
    };

    const boldText: React.CSSProperties = {
        fontWeight: "bold",
        margin: "10px 0",
    };

    const calculateTotal = (value: string, value1: string) => {
        const Details = form.getFieldValue(value) || [];
        const totalAmount = Details.reduce((total, row) => {
            const amount = parseFloat(row?.[value1]) || 0;
            return total + amount;
        }, 0);
        if (value === 'fareDetails') {
            setFreDetailsTotalAmount(totalAmount)
        } else if (value === 'taDaDetails') {
            setTaDaDetailsTotalAmount(totalAmount)
        } else if (value === 'localConvyDetails') {
            setLocalConvyTotalAmount(totalAmount)
        } else if (value === 'otherExpensesDetails') {
            setOtherExpensesTotalAmount(totalAmount)
        }
    };

    const getbalAmount = (value) => {
        const claim = Number(fareDetailsTotalAmount + taDaDetailsTotalAmount + LocalConvyTotalAmount + otherExpensesTotalAmount)
        const advance = Number(pdfData?.advanceRequired)
        setBalanceTotalAmount(claim - (Number(advance) + Number(value)))
    }

    const uploadPDFAndGetPath = async (blob: Blob, empCode: string, TourId: string) => {
        const formData = new FormData()
        formData.append("file", blob, `TI-${TourId}-${empCode}-TourClaim.pdf`)
        formData.append("empCode", empCode)
        formData.append("TourId", TourId)
        try {
            const response = await tourIntimationService.tourPdfUploadTemp(formData)
            if (!response?.data?.pathName) {
                throw new Error("Failed to get file path from upload")
            }
            return {
                filename: `TI-${TourId}-${empCode}-TourClaim.pdf`,
                path: docUrl + response.data.filename,
            };
        } catch (error) {
            console.error("Error uploading PDF:", error);
            throw error;
        }
    };

    const generatePDF = async (values) => {
        try {
            try {
                const req = { ...values, tourClaimPdf: `TI-${pdfData?.id}-${values.employeeCode}-TourClaim.pdf`, advanceTaken: pdfData?.advanceRequired, amountClaimed: fareDetailsTotalAmount + taDaDetailsTotalAmount + otherExpensesTotalAmount + LocalConvyTotalAmount }
                const res = await tourIntimationService.createtourClaim(req);
                if (!res.status) {
                    console.log("Failed to post Data");
                    return;
                }
                AlertMessages.getSuccessMessage(res.internalMessage);
                form.resetFields();
                const pdfPromise = new Promise<Blob>((resolve, reject) => {
                    try {
                        const pdfDoc = (
                            <TourExpensesClaimForm
                                submittedData={values}
                                fareDetailsTotalAmount={fareDetailsTotalAmount}
                                taDaDetailsTotalAmount={taDaDetailsTotalAmount}
                                LocalConvyTotalAmount={LocalConvyTotalAmount}
                                otherExpensesTotalAmount={otherExpensesTotalAmount}
                                balanceTotalAmount={balanceTotalAmount}
                                pdfData={pdfData}
                            />
                        );
                        pdf(pdfDoc)
                            .toBlob()
                            .then((blob) => {
                                if (!blob) {
                                    reject(new Error("PDF Blob is empty or undefined"));
                                } else {
                                    resolve(blob);
                                }
                            })
                            .catch(reject);
                    } catch (err) {
                        reject(err);
                    }
                });
                const blob = await pdfPromise;
                await submitSendEmail(blob, values.hodEmail)
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "TourExpensesClaimForm.pdf"
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            } catch (error) {
                console.error(`Error processing Tour Form with ID:`, error)
            }
        } catch (error) {
            console.error("Error generating PDF:", error)
            throw error;
        }
    };

    const submitSendEmail = async (pdfBlob: Blob, hodEmail: string) => {
        try {
            const empCode = employeedetails[0]?.employeeCode ?? "Unknown";
            const TourId = pdfData?.id ?? "Unknown";

            const attachment = await uploadPDFAndGetPath(pdfBlob, empCode, TourId);

            const req = new EmailRequest();
            req.to = ['rvkmohan07@gmail.com', employeedetails[0]?.rmEmail, hodEmail];
            req.subject = `Tour Expenses Claim Request`;
            req.body = `
             <p><span style="font-weight:bold">To : </span> ${employeedetails[0]?.rmFirstName},</p>
              <br></br>
              <p >Sir/Madam,</p>  
              <p >I hope this email finds you well. I am writing to inform you that request for the tour claim.</p>
              <p>Details of the Tour claim submitted in the form please check and validate</p>
              <p>I kindly request your approval for this tour claim. Please let me know if you need any further details or if there are forms to be submitted for official purposes.</p>
              <p>Thank you for your understanding and support.</p>
              Please find the Tour Expenses Claim Request form attached.
          `;
            req.attachments = [attachment];

            const res = await emailService.sendEmail(req);
            if (res.status) {
                message.success(res.internalMessage)
                form.resetFields()
            }
        } catch (error) {
            console.error("Error in email sending process:", error);
            message.error("An error occurred while sending emails", 2);
        }
    };

    const approve = () => {
        if (form.getFieldValue('sanctionedAmount')) {
            const values = { id: tcId, remarks: form.getFieldValue('accountsDepartmentRemarks'), sanctionedAmount: form.getFieldValue('sanctionedAmount'), balanceAmount: balanceTotalAmount }
            tourIntimationService.TourClaimApprove(values).then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage)
                    navigate('/tour-claim-view')
                } else {
                    console.log("Failed to fetch data");
                }
            })
        } else {
            form.setFields([{ name: 'sanctionedAmount', errors: ['Please fill in the Sanctioned Amount'] },])
        }
    }

    if (pdfData) {
        return <>

            <div style={{ justifyContent: 'center', }}>
                <Form layout='horizontal' form={form} onFinish={generatePDF} style={{ justifyContent: 'center' }} initialValues={{ fareDetailsTotalAmount: 0, fareDetails: [{}] }}>
                    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px", padding: "10px", border: "1px solid #000", boxSizing: "border-box", width: "90%", justifyContent: 'center' }}>
                        <header style={{ textAlign: "center", marginBottom: "20px" }}>
                            <img
                                src={sakkuLogo}
                                alt=" sakku Logo"
                                style={{ width: "20%", textAlign: 'center' }}
                            />
                        </header>

                        <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", marginBottom: "20px", }}> TOUR EXPENSES CLAIM FORM </div>

                        <Form.Item hidden label='Employee No :' name='employeeId' initialValue={employeedetails[0]?.employeeId} >
                            <Input hidden style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={employeedetails[0]?.employeeCode} />
                        </Form.Item>
                        <Form.Item hidden label='Tour No :' name='tourIntimationId' initialValue={pdfData?.id} >
                            <Input hidden style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={employeedetails[0]?.employeeCode} />
                        </Form.Item>

                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <td style={{ fontSize: "14px", padding: '10px', border: '1px solid black' }}>
                                        <Form.Item label='Employee No :' name='employeeCode' initialValue={employeedetails[0]?.employeeCode} >
                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={employeedetails[0]?.employeeCode} />
                                        </Form.Item></td>
                                    <td style={{ fontSize: "14px", padding: '10px', border: '1px solid black' }}>
                                        <Form.Item label='Name :' name='employeeName' initialValue={employeedetails[0]?.firstName} >
                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={employeedetails[0]?.firstName} />
                                        </Form.Item></td>
                                </tr>
                                <tr>
                                    <td style={{ fontSize: "14px", padding: '10px', border: '1px solid black' }}>
                                        <Form.Item label='Department :' name='department' initialValue={employeedetails[0]?.departmentName}  >
                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={employeedetails[0]?.departmentName} />
                                        </Form.Item></td>

                                    <td style={{ fontSize: "14px", padding: '10px', border: '1px solid black' }}>
                                        <Form.Item label='Designation :' name='designation' initialValue={employeedetails[0]?.designationName} >
                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={employeedetails[0]?.designationName} />
                                        </Form.Item></td>

                                </tr>
                            </tbody>
                        </table>

                        {/* Tour Period */}
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Tour Period (Date, Time) :</td>
                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                        <Form.Item label='From :' name='tourPeriodFromDate' initialValue={JSON.parse(pdfData.employeeTourDetails)[0].fromDate}>
                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={JSON.parse(pdfData.employeeTourDetails)[0].fromDate} />
                                        </Form.Item></td>
                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                        <Form.Item label='To :' name='tourPeriodToDate' initialValue={JSON.parse(pdfData.employeeTourDetails)[JSON.parse(pdfData.employeeTourDetails).length - 1].toDate} >
                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} defaultValue={JSON.parse(pdfData.employeeTourDetails)[JSON.parse(pdfData.employeeTourDetails).length - 1].toDate} />
                                        </Form.Item></td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Fare Details */}
                        <div style={boldText}>I. Fare Details :</div>
                        <Form.List name="fareDetails" initialValue={[{}]} >
                            {(fields, { add, remove }) => (
                                <>
                                    {/* Table Display */}
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: "12px", padding: '16px', border: '1px solid black' }}>
                                                    From<br />Place / Date / Time
                                                </th>
                                                <th style={{ fontSize: "12px", padding: '16px', border: '1px solid black' }}>
                                                    To<br />Place / Date / Time
                                                </th>
                                                <th style={{ fontSize: "12px", padding: '16px', border: '1px solid black' }}>Mode of Transport</th>
                                                <th style={{ fontSize: "12px", padding: '16px', border: '1px solid black' }}>Fares Rs.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <tr key={key}>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} label='From Date' name={[name, 'fareDetailsfromDate']} >
                                                            <DatePicker inputReadOnly={tcId !== 0} open={tcId === 0 ? undefined : false}
                                                                style={{ width: '100%', border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item {...restField} label='From Place' name={[name, 'fareDetailsFromPlace']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Destination Place' />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} label='To Date' name={[name, 'fareDetailstoDate']}>
                                                            <DatePicker inputReadOnly={tcId !== 0} open={tcId === 0 ? undefined : false}
                                                                style={{ width: '100%', border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item {...restField} label='To Place' name={[name, 'fareDetailstoPlace']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Destination Place' />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'fareDetailstransport']} rules={[{ required: true, message: 'Please select' }]}>
                                                            <Select disabled={tcId !== 0} open={tcId === 0 ? undefined : false} showSearch allowClear dropdownMatchSelectWidth={false} optionFilterProp="children" placeholder="Select" className="custom-select">
                                                                {Object.entries(ModeOfTransportEnum).map(([key, value]) => (
                                                                    <Select.Option value={value} key={key}>
                                                                        {value}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} label='Amount' name={[name, 'fareDetailsAmount']} rules={[{ required: true }, { pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} onChange={() => { calculateTotal('fareDetails', 'fareDetailsAmount') }} />
                                                        </Form.Item>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={3} style={{ fontSize: "14px", padding: '16px', border: '1px solid black', textAlign: 'right' }}>
                                                    {(tcId === 0 ? <>
                                                        <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                            <PlusOutlined />
                                                        </Button>
                                                        {fields.length > frdLen && (
                                                            <Button type="dashed" danger onClick={() => remove(frdLen)} block style={{ width: "20%", marginLeft: '1rem' }}>
                                                                <MinusCircleOutlined />
                                                            </Button>
                                                        )}</> : <></>)}

                                                    <span style={{ marginLeft: '20rem' }}>TOTAL :</span>
                                                </td>
                                                <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                    {fareDetailsTotalAmount + ' /-'}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </>
                            )}
                        </Form.List>

                        {/* TA/DA Details */}
                        <div style={boldText}>II. TA/DA Details (Bills to be enclosed) :</div>
                        <Form.List name="taDaDetails" initialValue={[]} >
                            {(fields, { add, remove }) => (
                                <>
                                    {/* Table Display */}
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Date</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Lodging Details</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Food Expenses</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <tr key={key}>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'taDaDetailsDate']} >
                                                            <DatePicker inputReadOnly={tcId !== 0} open={tcId === 0 ? undefined : false}
                                                                style={{ width: '100%', border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }}
                                                            />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'taDaDetailsDetails']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Details' />
                                                        </Form.Item>
                                                        {/* <Form.Item {...restField} name={[name, "upload"]} style={{ fontWeight: "bold" }}
                                                            rules={[{
                                                                //required: (fileLists[index]?.length > 0 || initialValues[index]?.filesData?.fileName) ? false : true,
                                                                message: 'Please Upload Sample!'
                                                            }]}
                                                        >
                                                            <Upload
                                                                // key={`upload-${index}`}
                                                                showUploadList={false}
                                                                //  {...uploadProps(index)}
                                                                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                                                            >
                                                                <Button
                                                                    // disabled={(fileLists[index] || []).length >= 1}
                                                                    icon={<UploadOutlined />}
                                                                >
                                                                    Click to Upload
                                                                </Button>
                                                            </Upload>
                                                        </Form.Item> */}
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'taDaDetailsFoodExpenses']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Details' />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item label='Amount' {...restField} name={[name, 'taDaDetailsAmount']} rules={[{ pattern: /^\d+$/, message: 'Only numbers are allowed' }]} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} onChange={() => { calculateTotal('taDaDetails', 'taDaDetailsAmount') }} />
                                                        </Form.Item>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={3} style={{ fontSize: "14px", padding: '16px', border: '1px solid black', textAlign: 'right' }}>
                                                    {(tcId === 0 ? <>
                                                        <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                            <PlusOutlined />
                                                        </Button>
                                                        {fields.length > 0 && (
                                                            <Button type="dashed" danger onClick={() => remove(fields.length - 1)} block style={{ width: "20%", marginLeft: '1rem' }}>
                                                                <MinusCircleOutlined />
                                                            </Button>
                                                        )}</> : <></>)}
                                                    <span style={{ marginLeft: '20rem' }}>TOTAL :</span>
                                                </td>
                                                <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                    {taDaDetailsTotalAmount + ' /-'}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </>
                            )}
                        </Form.List>

                        {/* Local Conveyance */}
                        <div style={boldText}>III. Local Conveyance & Other Expenses :</div>
                        <h2 style={{ fontSize: "15px", fontWeight: "bold" }}>
                            Part - A :: Local Conveyance
                        </h2>
                        <Form.List name="localConvyDetails" initialValue={[]} >
                            {(fields, { add, remove }) => (
                                <>
                                    {/* Table Display */}
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Date</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>From</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>To</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Mode of Travel</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Amount (Rs.)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <tr key={key}>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'localConvyDate']} >
                                                            <DatePicker inputReadOnly={tcId !== 0} open={tcId === 0 ? undefined : false}
                                                                style={{ width: '100%', border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'localConvyFromPlace']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Details' />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'localConvyToPlace']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Details' />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'localConvytourType']} >
                                                            <Select disabled showSearch allowClear dropdownMatchSelectWidth={false} optionFilterProp="children" placeholder="Select Tour Type" className="custom-select">
                                                                {Object.entries(ModeOfTransportEnum).map(([key, value]) => (
                                                                    <Select.Option value={value} key={key}>
                                                                        {value}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item label='Amount'{...restField} name={[name, 'LocalConvyAmount']} rules={[{ pattern: /^\d+$/, message: 'Only numbers are allowed' }]} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} onChange={() => { calculateTotal('localConvyDetails', 'LocalConvyAmount') }} />
                                                        </Form.Item>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={4} style={{ fontSize: "14px", padding: '16px', border: '1px solid black', textAlign: 'right' }}>
                                                    {(tcId === 0 ? <>
                                                        <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                            <PlusOutlined />
                                                        </Button>
                                                        {fields.length > 0 && (
                                                            <Button type="dashed" danger onClick={() => remove(fields.length - 1)} block style={{ width: "20%", marginLeft: '1rem' }}>
                                                                <MinusCircleOutlined />
                                                            </Button>
                                                        )}</> : <></>)}
                                                    <span style={{ marginLeft: '20rem' }}>TOTAL :</span>
                                                </td>
                                                <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                    {LocalConvyTotalAmount + ' /-'}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </>
                            )}
                        </Form.List>

                        <h2 style={{ fontSize: "15px", fontWeight: "bold" }}>
                            Part-B :: Other Expenses
                        </h2>
                        <Form.List name="otherExpensesDetails" initialValue={[]} >
                            {(fields, { add, remove }) => (
                                <>
                                    {/* Table Display */}
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Date</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Nature of expenses</th>
                                                <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>Amount (Rs.)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <tr key={key}>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'otherExpDate']} >
                                                            <DatePicker inputReadOnly={tcId !== 0} open={tcId === 0 ? undefined : false}
                                                                style={{ width: '100%', border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item {...restField} name={[name, 'otherExpNatureOfexp']} >
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} placeholder='Enter Details' />
                                                        </Form.Item>
                                                    </td>
                                                    <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                        <Form.Item label='Amount'{...restField} name={[name, 'otherExpAmount']} rules={[{ pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                                            <Input readOnly={tcId !== 0} style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} onChange={() => { calculateTotal('otherExpensesDetails', 'otherExpAmount') }} />
                                                        </Form.Item>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={2} style={{ fontSize: "14px", padding: '16px', border: '1px solid black', textAlign: 'right' }}>
                                                    {(tcId === 0 ? <>
                                                        <Button type="primary" onClick={() => add()} block style={{ width: "20%" }}>
                                                            <PlusOutlined />
                                                        </Button>
                                                        {fields.length > 0 && (
                                                            <Button type="dashed" danger onClick={() => remove(fields.length - 1)} block style={{ width: "20%", marginLeft: '1rem' }}>
                                                                <MinusCircleOutlined />
                                                            </Button>
                                                        )}</> : <></>)}
                                                    <span style={{ marginLeft: '20rem' }}>TOTAL :</span>
                                                </td>
                                                <td style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                    {otherExpensesTotalAmount + ' /-'}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </>
                            )}
                        </Form.List>

                        <div style={{ fontSize: "14px", marginBottom: "20px" }}>
                            <p>
                                <strong>Total Expenses:</strong>
                            </p>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>1. Fares: {fareDetailsTotalAmount + ' /-'}</th>
                                    </tr>
                                    <tr>
                                        <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>2. TA/DA: {taDaDetailsTotalAmount + ' /-'}</th>
                                    </tr>
                                    <tr>
                                        <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>3. Conveyance & Other Expenses: {(LocalConvyTotalAmount + otherExpensesTotalAmount) + ' /-'}</th>
                                    </tr>
                                </thead>
                                <tr>
                                    <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}> GRAND TOTAL: {(fareDetailsTotalAmount + taDaDetailsTotalAmount + LocalConvyTotalAmount + otherExpensesTotalAmount) + ' /-'}</th>
                                </tr>
                            </table>
                        </div>


                        {(tcId !== 0 ? <>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                                <p><b>Date:</b></p>
                                <p><b>Signature of the Employee:</b></p>
                                <p><b>Signature of HOD:</b></p>
                                <p><b>Signature of HRD Head:</b></p>
                            </div>
                            <hr />

                            <h3 style={{ textDecoration: "underline", marginBottom: "20px", textAlign: "center", }}>
                                For the use of Accounts Department
                            </h3>
                            <div style={{ marginBottom: "20px" }}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}> Advance Taken: {pdfData?.advanceRequired + ' /-'}</th>
                                        </tr>
                                        <tr>
                                            <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}> Amount Claimed: {(fareDetailsTotalAmount + taDaDetailsTotalAmount + LocalConvyTotalAmount + otherExpensesTotalAmount) + ' /-'}</th>
                                        </tr>
                                        <tr>
                                            <th style={{ padding: '16px', border: '1px solid black' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                                    <span style={{ marginRight: '8px' }}>Sanctioned Amount:</span>
                                                    <Form.Item name="sanctionedAmount" style={{ margin: 0 }} rules={[{ pattern: /^\d+$/, message: 'Only numbers are allowed' }]}>
                                                        <Input onChange={(e) => getbalAmount(e.target.value)} placeholder="Enter sanctioned Amount" style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9' }} />
                                                    </Form.Item>
                                                </div>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}> Balance Amount: {balanceTotalAmount ? balanceTotalAmount + ' /-' : null} </th>
                                        </tr>
                                        <tr>
                                            <th style={{ fontSize: "14px", padding: '16px', border: '1px solid black' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                                    <span style={{ marginRight: '8px' }}>Remarks of Accounts Department:</span>
                                                    <Form.Item name="accountsDepartmentRemarks" style={{ margin: 0 }}>
                                                        <TextArea placeholder="Enter Remarks" style={{ border: 'none', outline: 'none', padding: '8px', backgroundColor: '#f9f9f9', width: '100%', minWidth: '700px', maxWidth: '700px', height: '50px' }} />
                                                    </Form.Item>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", }}>
                                <div style={{ paddingTop: "70px" }}>
                                    <p><strong>Verification Authority Signature with Date</strong></p>
                                </div>
                                <div style={{ paddingTop: "70px" }}>
                                    <p><strong>Bill Passing Authority Signature with Date</strong></p>
                                </div>
                                <div style={{ paddingTop: "70px" }}>
                                    <p><strong>Sanctioning Authority Signature with Date</strong></p>
                                </div>
                            </div>
                        </> : <></>)}


                    </div>
                    <Row gutter={24} style={{ marginTop: '5rem', marginLeft: '3rem' }}>
                        {(tcId === 0 ? <>
                            <Col xs={24} sm={12} md={8} lg={4} xl={6}>
                                <Form.Item label='CC Email' name='hodEmail' rules={[{ type: 'email', message: 'Please enter a valid email address!', }]}>
                                    <Input />
                                </Form.Item>
                            </Col></> : <></>)}

                        {(tcId === 0 ? <>
                            <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginLeft: '1rem' }}>
                                <Button color="primary" variant="outlined" htmlType="submit">
                                    Submit
                                </Button>
                            </Col></> : <>
                            <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginLeft: '1rem' }}>
                                <Button type="primary" onClick={approve}>
                                    Approve
                                </Button>
                            </Col></>)}

                        <Col xs={24} sm={12} md={8} lg={2} xl={2} >
                            <Button icon={<UndoOutlined />} onClick={Reset} type='dashed' danger> Reset </Button>
                        </Col>

                    </Row>

                </Form >
            </div >

            {/* <PDFViewer style={{ width: '100%', height: '800px' }}>
                <TourExpensesClaimForm
                    submittedData={form.validateFields()}
                    fareDetailsTotalAmount={fareDetailsTotalAmount}
                    taDaDetailsTotalAmount={taDaDetailsTotalAmount}
                    LocalConvyTotalAmount={LocalConvyTotalAmount}
                    otherExpensesTotalAmount={otherExpensesTotalAmount}
                    balanceTotalAmount={balanceTotalAmount}
                    pdfData={pdfData}
                />
            </PDFViewer> */}

        </>
    }

}
export default TourClaimDetailsForm;



