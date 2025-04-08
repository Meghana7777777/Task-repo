import { PrinterFilled } from '@ant-design/icons';
import { configVariables } from '@hrexpert/shared-services';
import { Button, Card, Col, Image, Row } from 'antd';
import dayjs from 'dayjs';
import jsPDF from "jspdf";
import sakkuLogo from '../../../common/icons/sakkulogo.png';
import { useEffect } from 'react';

export interface EmployeeJoiningFormProps {
    rec: any
}


const EmployeeJoiningForm = (props: EmployeeJoiningFormProps) => {
    // useEffect(() => {
     
    // }, [props])
    const data = props.rec[0] ? props.rec[0] :props.rec
    const formattedDate = `${new Date().getDate()}${['ᵗʰ', 'ˢᵗ', 'ⁿᵈ', 'ʳᵈ'][(new Date().getDate() % 10 > 3 || [11, 12, 13].includes(new Date().getDate())) ? 0 : new Date().getDate() % 10]} ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`;
    const config = configVariables

    const currentAddressPincode = () => {
        return data.currentAddress && data.currentAddress.length > 0
            ? <>{`${data.currentAddress} - ${data.currentPincode}`}</>
            : <>&nbsp;</>;
    };

    const currentVillageDistrict = () => {
        return data.currentVillage && data.currentVillage.length > 0
            ? <>{`${data.currentVillage} - ${data.currentDistrict}`}</>
            : <>&nbsp;</>;
    };

    const currentStateCountry = () => {
        return data.currentState && data.currentState.length > 0
            ? <>{`${data.currentState} - ${data.currentCountry}`}</>
            : <>&nbsp;</>;
    };

    const permanentAddressPincode = () => {
        return data.permanentAddress && data.permanentAddress.length > 0
            ? <>{`${data.permanentAddress} - ${data.permanentPincode}`}</>
            : <>&nbsp;</>;
    };

    const permanentVillageDistrict = () => {
        return data.permanentVillage && data.permanentVillage.length > 0
            ? <>{`${data.permanentVillage} - ${data.permanentDistrict}`}</>
            : <>&nbsp;</>;
    };

    const permanentStateCountry = () => {
        return data.permanentState && data.permanentState.length > 0
            ? <>{`${data.permanentState} - ${data.permanentCountry}`}</>
            : <>&nbsp;</>;
    };

    const marialStatusData = () => {
        if (data.maritualStatus === "Married") {
            return <>Married</>
        }
        else if (data.maritualStatus === "Single") {
            return <>Single</>
        }
        else {
            return <>&nbsp;</>
        }
    }
    const formattedDateNumber = new Date().toLocaleDateString('en-GB').split('/').join('-');
    const handlePrint = () => {
        const printForm = document.getElementById('printJoiningFormSection1')
        const newWindow = window.open('', '_blank')
        if (printForm) {
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
                        ${printForm.innerHTML}
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
    //     const section1 = document.getElementById('printJoiningFormSection1');
    //     const style = document.createElement('style');
    //     style.innerHTML = `
    //         table, th, td {
    //             border: 0.1px solid #000 !important;
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

    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const section1Element = section1.querySelector('.section1') as HTMLElement;
    //     await pdf.html(section1Element, {
    //         x: 20,
    //         y: 10,
    //         html2canvas: { scale: 0.22, scrollX: 0, scrollY: 0 },
    //     });

    //     const section2Element = section1.querySelector('.section2') as HTMLElement;
    //     const currentY = pdf.internal.pageSize.height;
    //     const marginBottom = 20;
    //     const yOffset = currentY + marginBottom;

    //     await pdf.html(section2Element, {
    //         x: 20,
    //         y: yOffset,
    //         html2canvas: { scale: 0.22, scrollX: 0, scrollY: 0 },
    //     });

    //     const fileName = `${data.employeeName} - Joining Form (${formattedDate})`;
    //     pdf.save(fileName);

    //     document.head.removeChild(style);
    // };


    return (
        <>
            <div style={{ marginLeft: "900px" }}>
                <Button onClick={handlePrint}><PrinterFilled /></Button>
            </div>
            <Card style={{ maxWidth: 800, margin: "0 auto", fontFamily: "Arial, sans-serif" }} id='printJoiningFormSection1'>
                <div className='section1' style={{ fontFamily: "Arial, sans-serif" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "2px" }}>
                        <img src={sakkuLogo} alt="Sakku Logo" style={{ width: "32%", marginTop: "30px", marginLeft: "-25px" }} />

                        <p className='printLayout' style={{ margin: "0", lineHeight: "1.5", marginLeft: "10px", marginTop: "25px", textAlign: "left", }}>
                            Venkatrama Poultries Pvt. Ltd., <br />
                            D.No.5-87-39/1, Main Road, Lakshmi Puram, <br />
                            Guntur – 522007,<br />
                            Andhra Pradesh., Phone: 0863 2341111
                        </p>
                    </div>

                    <h1 style={{ textAlign: "center", borderBottom: '2px solid', display: "inline-block", marginLeft: '37%', fontSize: '18px' }}>
                        EMPLOYEE JOINING FORM
                    </h1>

                    <section className='joiningDetails'>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td className='backgroundColor' colSpan={4} style={{ background: 'lightgrey', fontSize: "15px", fontWeight: "bold", textDecoration: "underline", padding: "10px", }}>
                                        JOINING DETAILS
                                    </td>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "5px", }}>
                                        ERP ID
                                    </td>
                                    <td style={{ fontSize: "15px", border: "1px solid black", width: "25%", padding: "5px", fontWeight: 400 }}>
                                        {data.id ? data.id : "-"}
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "5px", }}>
                                        DEPARTMENT
                                    </td>
                                    <td style={{ fontSize: "15px", border: "1px solid black", width: "25%", padding: "5px", fontWeight: 400 }}>
                                        {data?.departmentId?.name ? data.departmentId?.name : "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "5px", }}>
                                        DESIGNATION
                                    </td>
                                    <td style={{ fontSize: "15px", border: "1px solid black", width: "25%", padding: "5px", fontWeight: 400 }}>
                                        {data.designationId.name ? data.designationId.name : "-"}
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "5px", }}>
                                        SALARY/ MONTH
                                    </td>
                                    <td style={{ fontSize: "15px", border: "1px solid black", width: "25%", padding: "5px", fontWeight: 400 }}>
                                        {data.salary ? data.salary : "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "5px", }}>
                                        DOJ
                                    </td>
                                    <td style={{ fontSize: "15px", border: "1px solid black", width: "25%", padding: "5px", fontWeight: 400 }}>
                                        {data.dateOfJoining ? dayjs(data.dateOfJoining).format("DD-MM-YYYY") : "-"}
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", width: "25%", textAlign: "center", padding: "5px", }}>
                                        REFERENCE
                                    </td>
                                    <td style={{ fontSize: "15px", border: "1px solid black", width: "25%", padding: "5px", fontWeight: 400 }}>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginTop: "10px" }} className='personalDetails'>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td colSpan={4} style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", padding: "10px", }}>
                                        PERSONAL DETAILS
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }}>
                                        <b>Name :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{data.employeeName ? data.employeeName : "-"}</span>
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", textAlign: "center", padding: "10px", }} rowSpan={5}>
                                        <p style={{ height: "175px", margin: "auto" }}>
                                            <Image
                                                src={data?.filename
                                                    ? URL.createObjectURL(data.filename)
                                                    : `${config.IMAGE_UPLOAD_URL}/${data.fileName}`}
                                                alt="employee-avatar"
                                                width={130}
                                                preview={false} />
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }}>
                                        <b>Father’s/Husband’s Name :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{data.employeeName ? data.employeeName : "-"}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }}>
                                        <b>Correspondence Address :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{currentAddressPincode()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "6px" }}>
                                        <span style={{ fontSize: "15px", fontWeight: 400 }}>{currentVillageDistrict()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "6px" }}>
                                        <span style={{ fontSize: "15px", fontWeight: 400 }}>{currentStateCountry()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }} colSpan={3}>
                                        <b> Permanent Address :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{permanentAddressPincode()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }} colSpan={3}>
                                        <span style={{ fontSize: "15px", fontWeight: 400 }}>{permanentVillageDistrict()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }} colSpan={3}>
                                        <span style={{ fontSize: "15px", fontWeight: 400 }}>{permanentStateCountry()}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginTop: "-1px" }} className="mobilePhoneEmail">
                        <table style={{ borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }} colSpan={3}>
                                        <b>Mobile :</b>{" "} <span style={{ fontSize: "15px", fontWeight: 400, textAlign: "left" }}>&nbsp;{data.mobileNo ? data.mobileNo : "-"}</span>
                                        <b style={{ marginLeft: "31%" }}>Phone :</b>{" "} <span style={{ fontSize: "15px", fontWeight: 400, textAlign: "left" }}>&nbsp;{data.mobileNo ? data.mobileNo : "-"}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", padding: "6px" }} colSpan={3}>
                                        <b> Email :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{data.emailId ? data.emailId : "-"}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginTop: "-1px" }} className='dobsection' >
                        <table style={{ borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td style={{ borderLeft: "1px solid black", borderBottom: "1px solid black", fontSize: "15px", padding: "6px" }}>
                                        <b>Date of Birth :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{data.dateOfBirth ? dayjs(data.dateOfBirth).format("DD-MM-YYYY") : "-"}</span>
                                    </td>
                                    <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "6px" }}>
                                        <b>Marital Status :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{marialStatusData()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "6px" }}>
                                        <b>Pan Card No :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>&nbsp;</span>
                                    </td>
                                    <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "6px" }}>
                                        <b>Blood Group :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{data.bloodGroup ? data.bloodGroup : "-"}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginTop: "-1px" }} className='emergencyContactDetails' >
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td colSpan={4}
                                        style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", padding: "10px", }}>
                                        EMERGENCY CONTACT DETAILS
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        style={{ width: "30%", border: "1px solid black", fontSize: "15px", padding: "10px", textAlign: "left", }}>
                                        <b>Name :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>&nbsp;</span>
                                    </td>
                                    <td
                                        style={{ width: "30%", border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px", textAlign: "left", }}>
                                        <b>Relation :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>&nbsp;</span>
                                    </td>
                                    <td
                                        style={{ width: "30%", border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px", textAlign: "left", }}>
                                        <b>Contact No :</b>{" "}<span style={{ fontSize: "15px", fontWeight: 400 }}>{data.emergencyContactNo ? data.emergencyContactNo : "-"}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section style={{ marginTop: "20px" }} className='educationalDetails'>
                        <table
                            style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td colSpan={6} style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", padding: "10px", }}>
                                        EDUCATIONAL DETAILS
                                    </td>
                                </tr>
                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px" }}>
                                        Degree
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px" }}>
                                        Specialization
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px" }}>
                                        From
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px" }}>
                                        To
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px" }}>
                                        Percentage/Grade
                                    </td>
                                    <td style={{ border: "1px solid black", fontSize: "15px", fontWeight: "bold", padding: "10px" }}>
                                        University/Institute
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {data.employeeEduDetails.map((eduDetail, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "20%" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 400 }}>{eduDetail.empQualification ? eduDetail.empQualification : "-"}</span>
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "15%" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 400 }}>{eduDetail.specialization ? eduDetail.specialization : "-"}</span>
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "15%" }}></td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "15%" }}></td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "20%" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 400 }}>{eduDetail.percentage ? eduDetail.percentage : "-"}</span>
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "30%" }}></td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </section>
                    <br />
                </div>

                <div className='section2' style={{ fontFamily: "Arial, sans-serif", pageBreakBefore: "auto" }}>
                    <section style={{ pageBreakBefore: "always" }}>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", maxWidth: "100%", }} cellPadding="5" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td colSpan={6} style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", }}>
                                        PREVIOUS EMPLOYMENT DETAILS
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        S.No
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Organisation
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Designation
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", padding: "5px" }} colSpan={2}>
                                        Period of Service
                                        <div style={{ width: "100%", borderBottom: "1px solid black", marginTop: "5px" }}></div>
                                        <div style={{ display: "flex", justifyContent:"space-evenly", marginTop: "5px" }}>
                                            <div>From</div>
                                            <div>To</div>
                                        </div>
                                    </th>



                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Annual CTC
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(3)].map((_, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                            {index + 1}
                                        </td>
                                        <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
                                        <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
                                        <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
                                        <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
                                        <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    <br />

                    <section>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="5" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td colSpan={8} style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", }}>
                                        FAMILY DETAILS
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        S.No
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Name
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Relation
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Occupation
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Age/DOB
                                    </th>
                                    <th style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                        Mobile
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.employeeFamilyDetails.map((empFamily, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                            {index + 1}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "30%" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 400 }}>{empFamily.familyMemName ? empFamily.familyMemName : "-"}</span>
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "30%" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 400 }}>{empFamily.relation ? empFamily.relation : "-"}</span>
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "30%" }}></td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "30%" }}></td>
                                        <td style={{ border: "1px solid black", padding: "15px", width: "30%" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 400 }}>{empFamily.contactNo ? empFamily.contactNo : "-"}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* <tbody>
    {[...Array(5)].map((_, index) => (
        <tr key={index}>
            <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                {index + 1}
            </td>
            <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
            <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
            <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
            <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
            <td style={{ border: "1px solid black", fontSize: "15px", }}></td>
        </tr>
    ))}
</tbody> */}
                        </table>
                    </section>
                    <br />

                    <section>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", maxWidth: "100%", }} cellPadding="5" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td colSpan={6} style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", }}>
                                        HEALTH CONDITION
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "20%", }}>
                                        <b>Sugar</b>
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "30%", }}>
                                        &nbsp;
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "20%", }}>
                                        <b>Kidney Function</b>
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "30%", }}>
                                        &nbsp;
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "20%", }}>
                                        <b>Hemoglobin %</b>
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "30%", }}>
                                        &nbsp;
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "20%", }}>
                                        <b>BP</b>
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "30%", }}>
                                        &nbsp;
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "20%", }}>
                                        <b>Any Operation/ Surgery</b>
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "30%", }}>
                                        &nbsp;
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "20%", }}>
                                        <b>ECG</b>
                                    </td>

                                    <td style={{ border: "1px solid black", fontSize: "15px", textAlign: "center", width: "30%", }}>
                                        &nbsp;
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </section>
                    <br />

                    <section>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", maxWidth: "100%", }} cellPadding="5" cellSpacing="0">
                            <thead>
                                <tr style={{ border: "1px solid black" }}>
                                    <td colSpan={6} style={{ backgroundColor: "lightgrey", fontSize: "15px", fontWeight: "bold", textDecoration: "underline", }}>
                                        DECLARATION
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{ fontSize: "15px" }}>
                                            I hereby declare that the above statements made in my
                                            application form are true, complete and correct to the best of
                                            my knowledge and belief. In the event of any information being
                                            found false or incorrect at any stage, my services are liable
                                            to be terminated without notice.
                                        </p>
                                        <b style={{ fontSize: "15px" }}>Date:</b>{" "}<span style={{ fontSize: "13px" }}>19-12-2024</span>
                                        <br />
                                        <Row gutter={4}>
                                            <Col style={{ paddingTop: "10px" }}>
                                                <b style={{ fontSize: "15px" }}>Place:</b>{" "}<span style={{ fontSize: "13px" }}> {data.permanentDistrict}</span>
                                            </Col>
                                            <Col style={{ marginLeft: "80%", paddingBottom: "10px", display: "inline-block", }}>
                                                <b style={{ fontSize: "15px" }}>Signature</b> 
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </section>
                    <br />

                    <section>
                        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="5" cellSpacing="0">
                            <tr style={{ backgroundColor: "lightgrey" }}>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                    <b>
                                        <u>HOD</u>
                                    </b>
                                </td>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                    <b>
                                        <u>HRD</u>
                                    </b>
                                </td>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                    <b>
                                        <u>BM/GM(UNIT)</u>
                                    </b>
                                </td>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                    <b>
                                        <u>CGM</u>
                                    </b>
                                </td>
                            </tr>
                            <tr style={{ height: "30px" }}>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>
                                    <span style={{ fontSize: "15px", fontWeight: 400 }}>{data.departmentId.hod ? data.departmentId.hod : "-"}</span>
                                </td>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>

                                </td>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>

                                </td>
                                <td style={{ width: '25%', border: "1px solid black", fontSize: "15px", textAlign: "center" }}>

                                </td>
                            </tr>
                        </table>
                    </section>
                    <br />
                </div>

            </Card >
        </>
    );
};

export default EmployeeJoiningForm;