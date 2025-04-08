import { PrinterFilled } from "@ant-design/icons";
import { Button, Card } from "antd";
import sakkuLogo from '../../../common/icons/sakkulogo.png';

export interface RelievingFormProps {
    rec: any
}
const RelievingForm = (props: RelievingFormProps) => {
    const data = props.rec[0] ? props.rec[0] : props.rec
    const formattedDate = new Date().toLocaleDateString('en-GB').split('/').join('-');

    const handlePrint = () => {
        const printRelievingForm = document.getElementById('printRelievingForm')
        if (printRelievingForm) {
            const newWindow = window.open('', '_blank')
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${data.employeeName ? data.employeeName : "-"} - Relieving Letter (${formattedDate})</title>
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
                            .lineHeight {
                                line-height : 20px;
                            }
                            .signature {
                                margin-bottom: 50%;
                            }

                        </style>
                    </head>
                     <body>
                        ${printRelievingForm.innerHTML}
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
    //     const element = document.getElementById('printRelievingForm');
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     await pdf.html(element, {
    //         x: 27,
    //         y: 10,
    //         html2canvas: {
    //             scale: 0.27,
    //             scrollX: 0,
    //             scrollY: 0,
    //         },
    //         callback: () => {
    //             const fileName = `${data.employeeName || "-"} - Experience Letter (${formattedDate})`;
    //             pdf.save(fileName);
    //         },
    //     });
    // };

    return (
        <>
            <div style={{ marginLeft: "900px" }}>
                <Button onClick={handlePrint}><PrinterFilled /></Button>
            </div>
            <Card style={{ maxWidth: 600, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                <div id="printRelievingForm" className="printRelievingForm" style={{ marginTop: "-25px", fontFamily: "Arial, sans-serif" }}>
                    <div
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", }}>
                        <img src={sakkuLogo} alt="Sakku Logo" style={{ width: "40%", marginTop: "30px", marginLeft: "-10px" }} />
                    </div>

                    <h1 style={{ textAlign: "center", marginBottom: "30px", borderBottom: '2px solid', display: "inline-block", marginLeft: '28%' }}>
                        RELIEVING LETTER
                    </h1>
                    <p style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "15px" }}><b>Date :</b> {formattedDate}</span>
                    </p>

                    <p className="lineHeight">
                        <span style={{ fontSize: "15px" }}>To ,</span>
                        <br />
                        <span style={{ fontSize: "15px" }}>{data.salutation ? data.salutation : "-"}.{" "}<b>{data.employeeName ? data.employeeName : "-"}</b></span>
                        <br />
                        <span style={{ fontSize: "15px" }}>Assistant – Accounts.</span>
                    </p>

                    <p style={{ textAlign: "center" }}><span style={{ fontSize: "15px", fontWeight: "bold" }}>To Whomsoever It May Concern</span></p>

                    <span className="lineHeight" style={{ textAlign: "center", fontSize: "15px" }}>
                        With reference to your resignation letter, we accepted your resignation and agreed to relieve you from your duties on <b><u>{data.designationId.name}</u></b>. We would also want to confirm that your full & final settlement would be cleared within 10 days with the Organisation.
                    </span>
                    <br />
                    <br />
                    <span className="lineHeight" style={{ textAlign: "center", fontSize: "15px" }}>
                        During this tenure with us we observed that you are hardworking, honest and diligent in performing your duties.
                    </span>
                    <br />
                    <br />
                    <span style={{ textAlign: "center", fontSize: "15px" }}>
                        We would like to thank you for your service and we wish you success in your future endeavours.
                    </span>
                    <br />
                    <br />
                    <br />
                    <span style={{ textAlign: "center", fontSize: "15px" }}>
                        Yours Sincerely,
                    </span>
                    <br />
                    <br />
                    <br />
                    <br />
                    <span style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold" }} className="signature">
                        Manager / Authorized Signatory
                    </span>
                </div>
            </Card >

        </>
    );
};

export default RelievingForm;

