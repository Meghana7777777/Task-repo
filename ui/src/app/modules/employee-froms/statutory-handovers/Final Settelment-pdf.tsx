import { PrinterFilled } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import dayjs from 'dayjs';
import sakkuLogo from '../../../common/icons/sakkulogo.png';

export interface FinalSettlementPdfProps {
    rec: any;
}

const FinalSettlementtPdf = (props: FinalSettlementPdfProps) => {
    const data = props.rec;
    const formattedDate = dayjs().format("DD-MM-YYYY");

    const handlePrint = () => {
        const printContent = document.getElementById('printFinalSettlementtPdf');
        if (printContent) {
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <style>
                            @page {
                                size: A4;
                                margin: 20mm;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                                font-size: 15px;
                            }
                            .ptags {
                                line-height: 30px;
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);

            newWindow.document.close()
            newWindow.focus()
            newWindow.print()
            newWindow.onafterprint = () => {
                newWindow.close()
            };
        }
    };

    return (
        <>

            <Card style={{ maxWidth: 600, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                <div style={{ marginLeft: "500px" }}>
                    <Button onClick={handlePrint}><PrinterFilled /></Button>
                </div>
                <div id='printFinalSettlementtPdf' className="record-container" style={{ marginTop: "-25px", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <img src={sakkuLogo} alt="Company Logo" style={{ width: "30%", marginTop: "30px" }} />
                    </div>

                    <h1 style={{ textAlign: "center", marginBottom: "30px", textDecoration: 'underline' }}>
                        FULL AND FINAL SETTLEMENT AGREEMENT
                    </h1>

                    <p style={{ marginTop: '40px', textAlign: 'right', fontSize: "15px", lineHeight: '1.6' }}>Date: {formattedDate}</p>

                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1.6' }}>
                        This settlement is entered into between <strong>Venkatrama Poultries Private Limited</strong> (hereinafter referred to as the "Company/Management/Employer") and
                        <strong> {data.employeeName || "________________"}</strong> (AADHAAR No: {data?.employeeIdProofs?.find((res) => res.idType === 'Aadhar Card') ? data?.employeeIdProofs?.find((res) => res.idType === 'Aadhar Card').idNumber : '!Aadhar not found'}), S/o {data.fatherName || "________________"} (hereinafter referred to as the "Employee/Workman").
                    </p>

                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1.6' }}>
                        Whereas the employee <strong>{data.employeeName || "________________"}</strong> was working with the company and has decided to voluntarily leave the company. The present settlement is being entered into with full and final satisfaction on the following terms and conditions:
                    </p>

                    <ol style={{ fontSize: "15px", lineHeight: '1.6' }}>
                        <li>
                            The employee will be paid full and final settlement of all claims, including back wages, overtime wages, gratuity, bonus, and all unpaid wages for the entire period of employment.
                        </li>
                        <li>
                            The employee will forgo all claims of re-employment, reinstatement, etc., and will not claim any additional amount beyond this settlement in any Court of Law or Labor Court.
                        </li>
                        <li>
                            The settlement shall be treated as final under Section 18 of the Industrial Disputes Act, and the company may file it with the relevant authorities.
                        </li>
                        <li>
                            The employee will provide a separate acknowledgment receipt for the amount received, which shall form part of this settlement.
                        </li>
                        <li>
                            Any past, present, or future disputes or claims by the employee are considered withdrawn, and this settlement may be presented to close any legal proceedings.
                        </li>
                    </ol>
                    <p style={{ marginTop: '35px', fontSize: "15px", lineHeight: '1.6' }}>
                        For Venkatrama Poultries Pvt. Ltd.
                    </p>
                    <Row>
                        <Col span={12}>
                            <p style={{ marginTop: '70px', fontSize: "15px", lineHeight: '1.6' }}>
                                <strong>Authorized Signatory:</strong>
                            </p>
                        </Col>
                        <Col span={12}>
                            <p style={{ marginTop: '70px', textAlign: 'right', fontSize: "15px", lineHeight: '1.6' }}>
                                <strong>Employee</strong>
                            </p>
                            <p style={{ textAlign: 'right', fontSize: "15px", lineHeight: '1.6' }}>
                                {data.employeeName || "________________"}
                            </p>
                        </Col>
                    </Row>
                    <p style={{ marginTop: '10px', fontSize: "15px", lineHeight: '1.6' }}>Witnesses:</p>
                    <ol style={{ fontSize: "15px", lineHeight: '1.6' }}>
                        <li>________________</li>
                        <li>________________</li>
                    </ol>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <img src={sakkuLogo} alt="Company Logo" style={{ width: "30%", marginTop: "30px" }} />
                    </div>

                    <h1 style={{ textAlign: "center", marginBottom: "30px", textDecoration: 'underline' }}>
                        FULL AND FINAL SETTLEMENT
                    </h1>
                    <p style={{ marginTop: '40px', textAlign: 'right', fontSize: "15px", lineHeight: '1.6' }}>Date: {formattedDate}</p>
                    <p style={{ fontSize: "15px", lineHeight: '1.6' }}>To,</p>
                    <p style={{ fontSize: "15px", lineHeight: '1.6' }}>General Manager,</p>
                    <p style={{ fontSize: "15px", lineHeight: '1.6' }}>Corporate Office,</p>
                    <p style={{ fontSize: "15px", lineHeight: '1.6' }}>Venkatrama Poultries Pvt. Ltd.</p>
                    <p style={{ fontSize: "15px", lineHeight: '1.6', marginTop: '30px' }}>Respected Sir,</p>
                    <h1 style={{ fontSize: "15px", lineHeight: '1.6' }}>Sub: Acknowledgement of Full and Final Settlement Payment</h1>
                    <p style={{ fontSize: "15px", lineHeight: '1.6' }}>I, <strong> {data.employeeName || "________________"}</strong>have received Rs.100/- (Hundred Rupees only) towards Full and Final Settlement of all my dues with Venkatrama Poultries Pvt. Ltd. There are no dues pending and hence will not have claim in the Court of Law, Labor Court and Employees’ Insurance Court or any concerned authorities in the future. I discharge the company from, all and any past, present and future disputes, controversies, actions, causes of action, claims, obligations, demands, rights, damages, costs, expenses, compensation or liabilities of any kind or nature whatsoever. Hereby, I am losing all relinquish rights with Venkatrama Poultries Private Limited.</p>
                    <p style={{ fontSize: "15px", lineHeight: '1.6', marginLeft: '25%' }}>Thank you,</p>
                    <Row>
                        <Col span={12}>
                            <h1 style={{ fontSize: '15px', marginTop: '50px' }}>Authorized Signatory</h1>
                        </Col>
                        <Col span={12}>
                            <p style={{ fontSize: "15px", lineHeight: '1.6', marginTop: '20px', marginLeft: '54%' }}>(Employee Name)</p>
                            <p style={{ fontSize: "15px", lineHeight: '1.6', marginLeft: '54%' }}>{data.employeeName || "________________"}</p>
                            <p style={{ fontSize: "15px", lineHeight: '1.6', marginTop: '35px', textAlign: 'right' }}>(Employee Signature with date)</p>

                        </Col>
                    </Row>
                </div>
            </Card>

        </>
    );
};

export default FinalSettlementtPdf;
