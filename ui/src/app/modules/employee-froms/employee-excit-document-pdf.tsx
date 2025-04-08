import { PrinterFilled } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import jsPDF from "jspdf";
import dayjs from 'dayjs';
// import sakkuLogo from '../../../common/icons/sakkulogo.png';
import html2canvas from "html2canvas";
import sakkuLogo from '../../common/icons/sakkulogo.png';

export interface EmployeeExitDocumentDataPdfProps {
    rec: any;
}

const EmployeeExitDocumentDataPdf = (props: EmployeeExitDocumentDataPdfProps) => {
    const data = props.rec;
    const formattedDate = dayjs().format("DD-MM-YYYY");

    // const handlePrint = async () => {
    //     const section1 = document.getElementById('printEmployeeExitDocumentDataPdf');
    //     if (!section1) {
    //         console.error("Section not found!");
    //         return;
    //     }
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const style = document.createElement('style');
    //     style.innerHTML = `
    //         table, th, td {
    //             border: 0.5px solid #000 !important;
    //             border-collapse: collapse !important;
    //         }
    //         th, td {
    //             padding: 8px;
    //             text-align: left;
    //         }
    //         .section2 {
    //             page-break-before: always;
    //         }
    //     `;
    //     document.head.appendChild(style);
    //     const canvas = await html2canvas(section1, { scale: 2 });
    //     const imgData = canvas.toDataURL("image/png");
    //     const imgWidth = 190;
    //     const pageHeight = 297;
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //     let heightLeft = imgHeight;
    //     let yPosition = 10;
    //     pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //     while (heightLeft > 0) {
    //         yPosition = heightLeft - imgHeight;
    //         pdf.addPage();
    //         pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
    //         heightLeft -= pageHeight;
    //     }
    //     const formattedDate = new Date().toISOString().split("T")[0];
    //     const fileName = `${data.employeeName || "Employee"} - Exit Form (${formattedDate}).pdf`;
    //     pdf.save(fileName);
    //     document.head.removeChild(style);
    // };


    const handlePrint = () => {
        const printContent = document.getElementById('printEmployeeExitDocumentDataPdf');
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
                <div id='printEmployeeExitDocumentDataPdf' className="record-container" style={{ marginTop: "-25px", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <img src={sakkuLogo} alt="Company Logo" style={{ width: "30%", marginTop: "30px" }} />
                    </div>

                    <h1 style={{ textAlign: "center", marginBottom: "30px", textDecoration: 'underline' }}>
                        FULL AND FINAL SETTLEMENT AGREEMENT
                    </h1>

                    <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                        <tr>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Emp Name</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>{data.employeeName || "-"}</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Emp Id</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}><strong> {data.id ? data?.id : "-"}</strong></th>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Designation</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}><strong>{data?.designationId?.name ? data?.designationId?.name : "-"}</strong></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Dept</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>{data?.departmentId?.name ? data?.departmentId?.name : "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>DOJ</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}> {data?.dateOfJoining ? dayjs(data?.dateOfJoining).format("DD-MM-YYYY") : "-"}</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>DOL</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Reporting Manager</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>{data?.reportingManager ? data?.reportingManager : "-"}</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>HOD</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>{data?.departmentId?.hod ? data?.departmentId?.hod : "-"}</td>
                        </tr>


                    </table>
                    <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                        <tr>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>S/NO</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Function</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Handed over</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Not Handed
                                over
                            </th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Not
                                Applicable
                            </th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Signature</th>
                        </tr>
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>EXISTING DEPARTMENT</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>1</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Files/Documents/Client List</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td rowSpan={5}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>2</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Books/Journals/Notes</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>3</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Stationery/Cupboard Key/Other
                                Keys
                            </td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>4</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Distributor/Vendor Clearance</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>5</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Other if any:</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>6</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Other if any:</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Reporting Manager</td>
                        </tr>

                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>IT DEPARTMENT</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>7</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Desktop/Laptop</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td rowSpan={5}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>8</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Printer/Fax</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>9</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Access to Systems
                            </td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>10</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Other if any:</td>
                            <td ></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>11</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>All user logins deactivated</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>YES / NO</td>
                           
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>12</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>E Mail ID deactivated</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>YES / NO</td>
                            
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>IT Manager</td>
                        </tr>
                       
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>HR DEPARTMENT</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>13</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Mobile Handset/Internet Card/SIM</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td rowSpan={5} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>14</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Company Car + Driver</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>15</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Company Accommodation
                            </td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>16</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Food Coupons</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>17</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Other if any:</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>18</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Other if any:</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>HRD</td>
                        </tr>
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>ACCOUNTS DEPARTMENT</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>19</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Travel / Other Advances</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }} >NIL / Recovery / Payable</td>
                            <td rowSpan={4} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>20</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>SAP Statement</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Attached / Not Attached</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>21</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Salary Advance</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>NIL / Recoverable</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>22</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Loans Outstanding</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>NIL / Recoverable</td>

                        </tr>

                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>23</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Other if any:</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>NIL / Recoverable</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>HRD</td>
                        </tr>

                    </table>
                    <br />
                    <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                        <tr>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>S/NO</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Function</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Handed over</th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Not Handed
                                over
                            </th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Not
                                Applicable
                            </th>
                            <th style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Signature</th>
                        </tr>
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>EXISTING DEPARTMENT</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>24</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Resignation Acceptance Letter</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td rowSpan={5} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>25</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>EL balance - Leave Encashment</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>NIL / Recoverable</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>26</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Biometric deactivation
                            </td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}></td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>27</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Gratuity</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}> 5 Years /  5 Years'</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>28</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Bonus</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Payable / Not Payable</td>

                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>29</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Experience & Relieving Letter</td>
                            <td colSpan={3} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>Issued / Not Issued</td>
                            <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "1px", }}>HRD</td>
                        </tr>
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "left", padding: "1px", }}>* Tick (√) or Strike Off wherever applicable</td>
                        </tr>
                        </table>
                        
                        
                        <p style={{ marginTop: '20px', fontSize: "15px", lineHeight: '1.6' }}>
                            Declaration by Employee: I have handed over my duties to <strong style={{ marginRight:'4px'}}>{ "________________ "}</strong> 
                             w.e.f  ________________ . I also confirm that there is no commitment/liability on my part to company.

                        </p>
                        <p style={{ marginTop: '1px', fontSize: "15px", lineHeight: '1.6' }}>My Permanent address and Contact number is:-<strong> {data.permanentAddress} {data.permanentVillage} {data.permanentDistrict} {data.permanentState} {data.permanentPincode}
                         {data.mobileNo}</strong></p>
                        <Row>
                        <Col span={8}>
                        <h1 style={{ fontSize: "15px", lineHeight: '1.6', marginBottom:'0px'   }}>{data.employeeName || "-"}</h1>
                            <h1 style={{ fontSize: '15px',  marginTop:'0px', }}>Employee</h1>
                        </Col>
                        <Col span={8}>
                        <h1 style={{ fontSize: "15px", lineHeight: '1.6', marginBottom:'0px'   }}>{data?.reportingManager ? data?.reportingManager : "-"}</h1>
                            <h1 style={{ fontSize: '15px',  marginTop:'0px'  }}>Reporting Manager</h1>
                        </Col>
                        <Col span={8}>
                        <h1 style={{ fontSize: "15px", lineHeight: '1.6', marginBottom:'0px'  }}>{data.employeeName || "________________"}</h1>
                            <h1 style={{ fontSize: '15px',  marginTop:'0px'  }}>HR</h1>
                        </Col>
                       
                    </Row>



                    
                </div>
            </Card>

        </>
    );
};

export default EmployeeExitDocumentDataPdf;
