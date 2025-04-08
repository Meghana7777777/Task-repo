import { PrinterFilled } from '@ant-design/icons';
import { Button, Card } from 'antd';
import dayjs from 'dayjs';
import sakkuLogo from '../../../common/icons/sakkulogo.png';

export interface CertificateEmployeeProps {
    rec: any
}

const CertificateEmployee = (props: CertificateEmployeeProps) => {
    const data = props.rec[0] ? props.rec[0] : props.rec
    const formattedDateNumber = new Date().toLocaleDateString('en-GB').split('/').join('-');
    const formattedDate = `${new Date().getDate()}${['th', 'st', 'nf', 'rd'][(new Date().getDate() % 10 > 3 || [11, 12, 13].includes(new Date().getDate())) ? 0 : new Date().getDate() % 10]} ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`;
    const formattedDateOfJoining = data.dateOfJoining ? `${new Date(data.dateOfJoining).getDate()}${['th', 'st', 'nd', 'rd'][(new Date(data.dateOfJoining).getDate() % 10 > 3 || [11, 12, 13].includes(new Date(data.dateOfJoining).getDate())) ? 0 : new Date(data.dateOfJoining).getDate() % 10]} ${new Date(data.dateOfJoining).toLocaleString('default', { month: 'long' })} ${new Date(data.dateOfJoining).getFullYear()}` : "-";

    const handlePrint = () => {
        const printCertificateEmpForm = document.getElementById('printCertificateEmpForm')
        const newWindow = window.open('', '_blank')
        if (printCertificateEmpForm) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${data.employeeName ? data.employeeName : "-"} - Certificate of Employee Letter (${formattedDateNumber})</title>
                        <style>
                            @page {
                                size: A4;
                                margin: 20mm; 
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                                font-size: 12px;
                                margin-bottom: 80px;
                            }

                        </style>
                    </head>
                     <body>
                        ${printCertificateEmpForm.innerHTML}
                    </body>
                </html>
            `)
            newWindow.document.close()
            newWindow.focus()
            newWindow.print()
            newWindow.onafterprint = () => {
                newWindow.close()
            };
        }
    };

    // const handlePrint = async () => {
    //     const element = document.getElementById('printCertificateEmpForm');
    //     const style = document.createElement('style');
    //     style.innerHTML = `
    //         .h1tags {
    //          margin-right: -28%;
    //         }
    //     `;
    //     document.head.appendChild(style);
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     await pdf.html(element, {
    //         x: 25,
    //         y: 10,
    //         html2canvas: {
    //             scale: 0.22,
    //             scrollX: 0,
    //             scrollY: 0,
    //         },
    //         callback: () => {
    //             const fileName = `${data.employeeName ? data.employeeName : "-"} - Certificate of Employee Letter (${formattedDateNumber})`;
    //             pdf.save(fileName);
    //         },
    //     });
    //     document.head.removeChild(style);
    // };

    const salaryData = () => {
        return data.salary && data.salary.length > 0 ? <>{data.salary}{" "} /- per month</> : <>-</>;
    };

    return (
        <>
            <div style={{ marginLeft: "900px" }}>
                <Button onClick={handlePrint}><PrinterFilled /></Button>
            </div>
            <Card style={{ maxWidth: 800, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                <div id='printCertificateEmpForm' className='printCertificateEmpForm' style={{ marginTop: "-25px", fontFamily: "Arial, sans-serif" }}>
                    <div className='imag' style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", }}>
                        <img src={sakkuLogo} alt="Sakku Logo" style={{ width: "30%", marginTop: "30px", marginLeft: "-10px" }} />
                    </div>
                    <h1 className="h1tags" style={{ textAlign: "center", marginBottom: "30px", borderBottom: '2px solid', display: "inline-block", marginLeft: '28%' }}>
                        CERTIFICATE OF EMPLOYMENT
                    </h1>
                    <br />
                    <b style={{ fontSize: "15px" }}>Private & Confidential</b>

                    <p style={{ marginTop: '40px', fontSize: "15px", lineHeight: '1' }}>{formattedDate}</p>

                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1' }}>
                        Employment reference for <strong>{data.employeeName ? data.employeeName : "-"}</strong>
                    </p>

                    <p style={{ marginTop: '30px', fontSize: "15px", lineHeight: '1' }}>
                        The following are the details of employment of Mr. <strong>{data.employeeName ? data.employeeName : "-"}</strong> with our firm:
                    </p>

                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1' }}>
                        <span style={{ marginRight: '240px' }}>Job Title:</span>
                        <span>{data.designationId.name ? data.designationId.name : "-"}</span>
                    </p>

                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1' }}>
                        <span style={{ marginRight: '215px' }}>Department:</span>
                        <span>{data.departmentId.name ? data.departmentId.name : "-"}</span>
                    </p>
                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1' }}>
                        <span style={{ marginRight: '228px' }}>Start Date:</span>
                        <span>{formattedDateOfJoining}</span>
                    </p>
                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1' }}>
                        <span style={{ marginRight: '200px' }}>Current Salary:</span>
                        <span>{salaryData()}</span>
                    </p>


                    <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1.6' }}>
                        This is to certify that {data.salutation ? data.salutation : "-"}. <strong>{data.employeeName ? data.employeeName : "-"}</strong>, has been employed & currently working as Deputy Manager in our organization from <strong>{data.dateOfJoining ? dayjs(data.dateOfJoining).format("DD-MM-YYYY") : "-"}</strong> to till now.
                    </p>

                    <p style={{ marginTop: '35px', fontSize: "15px", lineHeight: '1.6' }}>
                        This certification is being issued upon his request for whatever legal purpose it may serve.
                    </p>

                    <p style={{ marginTop: '10px', fontSize: "15px", lineHeight: '1' }}>
                        Please feel free to contact us if you need additional information or verification.
                    </p>

                    <p style={{ marginTop: '70px', fontSize: "15px", lineHeight: '1' }}>Yours sincerely,</p>
                </div>
            </Card>
        </>
    );
};

export default CertificateEmployee;