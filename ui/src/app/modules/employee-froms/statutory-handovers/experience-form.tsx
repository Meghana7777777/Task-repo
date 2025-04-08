import { PrinterFilled } from "@ant-design/icons";
import { Button, Card } from "antd";
import dayjs from "dayjs";
import sakkuLogo from '../../../common/icons/sakkulogo.png';
export interface ExperienceFormProps {
    rec: any
}

const ExperienceForm = (props: ExperienceFormProps) => {
    const data = props.rec[0] ? props.rec[0] : props.rec
    const formattedDate = new Date().toLocaleDateString('en-GB').split('/').join('-');

    const handlePrint = () => {
        const printContent = document.getElementById('printExpForm');
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

    /*Automatically Downloads that file in Downloads by default of your browser*/
    // const handlePrint = async () => {
    //     const element = document.getElementById('printExpForm');
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     await pdf.html(element, {
    //         x: 25, 
    //         y: 10, 
    //         html2canvas: { 
    //             scale: 0.3,
    //             scrollX: 0, 
    //             scrollY: 0, 
    //         },
    //         callback: () => {
    //             const fileName = `${data.employeeName || "-"} - Experience Letter (${formattedDate})`;
    //             pdf.save(fileName);
    //         },
    //     });
    // };


    /* Open in that tab which asks print and file name */
    // const handlePrint = () => {
    //     const style = document.createElement('style');
    //     style.innerHTML = `
    //         @media print {
    //             body * {
    //                 visibility: hidden;
    //             }
    //             #printExpForm, #printExpForm * {
    //                 visibility: visible;
    //             }
    //             #printExpForm {
    //                 position: absolute;
    //                 top: 0;
    //                 left: 0;
    //                 width: 100%;
    //             }
    //         }
    //     `;

    //     document.head.appendChild(style);
    //     window.print();
    //     document.head.removeChild(style);
    // };


    const branchData = () => {
        return data?.branchId?.companyCode && data?.branchId?.companyCode.length > 0
            ? data?.branchId?.companyCode
            : "";
    };

    const designationData = () => {
        return data?.designationId?.designationCode && data?.designationId?.designationCode.length > 0
            ? data?.designationId?.designationCode
            : "";
    };

    const departmentData = () => {
        return data?.departmentId?.code && data?.departmentId?.code.length > 0
            ? data?.departmentId?.code
            : "";
    };

    const combinedData = () => {
        const branch = branchData();
        const designation = designationData();
        const department = departmentData();
        let result = branch;
        if (designation) result += `${branch ? " / " : ""}${designation}`;
        if (department) result += `${branch || designation ? " / " : ""}${department}`;

        return result;
    };

    return (
        <>
            <div style={{ marginLeft: "900px" }}>
                <Button onClick={handlePrint}><PrinterFilled /></Button>
            </div>

            <Card style={{ maxWidth: 600, margin: "0 auto", padding: "30px", fontFamily: "Arial, sans-serif" }}>
                <div id='printExpForm' className="printExpForm" style={{ marginTop: "-55px", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", }}  >
                        <img src={sakkuLogo} alt="Sakku Logo" style={{ width: "40%", marginTop: "30px", marginLeft: "-25px" }} />
                    </div>

                    <h1 style={{ textAlign: "center", marginBottom: "30px", borderBottom: '2px solid', display: "inline-block", marginLeft: '28%' }} >
                        EXPERIENCE LETTER
                    </h1>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                        <p><b>Ref:</b> {combinedData()}</p>
                        <p><b>Date: </b> {formattedDate}</p>
                    </div>

                    <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px" }} >
                        TO WHOM SO EVER IT MAY CONCERN
                    </p>

                    <p style={{ marginTop: "20px", textAlign: "justify", fontSize: "14px" }} className="ptags">
                        This is to certify that {data.salutation ? data.salutation : "-"}.{" "}
                        <b ><u>{data.employeeName ? data.employeeName : "-"}</u></b>{" "},{" "}has worked in our organization as
                        {" "}<b>Assistant - Accounts</b>{" "}from {" "}
                        <b>{data.dateOfJoining ? dayjs(data.dateOfJoining).format("DD-MM-YYYY") : "-"}</b>{" "}to{" "}
                        <b>{data.dateOfReliving ? dayjs(data.dateOfReliving).format("DD-MM-YYYY") : "-"}</b>.
                        During this tenure with us, his contributions to the organization are
                        highly appreciated.
                    </p>

                    <p style={{ textAlign: "center", fontSize: "15px" }}>
                        We wish him all the best for his future endeavors.
                    </p>
                    <br />
                    <p style={{ fontSize: "15px" }}>Yours Truly,<br />For Venkatrama Poultries Private Limited<br />Authorized By</p>


                    <p style={{ marginTop: "80px", fontWeight: "bold", fontSize: "15px" }}>
                        Manager / Authorized Signatory
                    </p>
                </div>
            </Card>
        </>

    );
};

export default ExperienceForm;