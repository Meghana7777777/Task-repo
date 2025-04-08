import { TourIntimationEnum } from '@hrexpert/shared-models';
import { Button, Card } from 'antd';
import dayjs from 'dayjs';
import sakkuLogo from './sakku-logo.png';
import { DownloadOutlined, PrinterFilled } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';

interface TourIntimationPdfProps {
  submittedData: any
  employeedetails: any
  formORview: number
  remarks?: string
}

const TourIntimationPdf = (props: TourIntimationPdfProps) => {
  const { submittedData, employeedetails, formORview, remarks } = props
  const [noOfRows, setNoOfRows] = useState<number>(formORview ? JSON.parse(submittedData?.employeeTourDetails).length : submittedData?.employeeTourDetails.length);

  const getDate = (index: number, data: string) => {
    let date;
    const employeeTourDetails = formORview ? JSON.parse(submittedData?.employeeTourDetails) : submittedData?.employeeTourDetails;
    if (employeeTourDetails) {
      const rawDate = formORview ? employeeTourDetails[index]?.[data] : employeeTourDetails[index]?.[data];
      date = rawDate ? dayjs(rawDate).format('YYYY-MM-DD') : null;
    } else {
      date = null;
    }
    return date;
  };

  const getPlace = (index: number, data: string) => {
    let date;
    const employeeTourDetails = formORview ? JSON.parse(submittedData?.employeeTourDetails) : submittedData?.employeeTourDetails;
    if (employeeTourDetails) {
      const rawDate = formORview ? employeeTourDetails[index]?.[data] : employeeTourDetails[index]?.[data];
      date = rawDate ? rawDate : null;
    } else {
      date = null;
    }
    return date;
  };

  const downloadPdf = () => {
    const input = document.getElementById('carhartt')!;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${employeedetails[0]?.employeeCode}_Tour-Intimation-Form.pdf`);
    });
  };

  const rows = Array.from({ length: formORview ? JSON.parse(submittedData?.employeeTourDetails).length : submittedData?.employeeTourDetails.length }, (_, index) => (
    <tr key={index}>
      <td style={{ fontSize: "14px", padding: "16px", border: "1px solid black" }}>
        {getDate(index, "fromDate")}
      </td>
      <td style={{ fontSize: "14px", padding: "16px", border: "1px solid black" }}>
        {getPlace(index, "fromPlace")}
      </td>
      <td style={{ fontSize: "14px", padding: "16px", border: "1px solid black" }}>
        {getDate(index, "toDate")}
      </td>
      <td style={{ fontSize: "14px", padding: "16px", border: "1px solid black" }}>
        {getPlace(index, "toPlace")}
      </td>
    </tr>
  ));

  return (
    <>
      <div style={{ marginLeft: "900px" }}> 
        <Button onClick={downloadPdf}><DownloadOutlined  /></Button>
      </div>
      <Card id='carhartt' style={{ maxWidth: 800, margin: "0 auto", padding: "10px" }}>
        <div  >
          <div style={{ textAlign: 'center' }}>
            <img
              src={sakkuLogo}
              alt=" Vinay Logo"
              style={{ width: "20%", textAlign: 'center' }}
            />
          </div>

          <p style={{ textAlign: 'center' }}>
            <b style={{ fontSize: "25px" }}>TOUR INTIMATION FORM</b>
            <br />
            <h2 style={{ fontSize: "13px" }}>(Original shall be with HR Department and Duplicate is to be forwarded by HR Department to Accounts Department)</h2>
          </p>
          <hr />

          <h3>
            <strong>TO:</strong> HR Department,
            <br />
            Sir/Madam,
          </h3>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            I have been directed by my superiors to proceed on tour and the Tentative Tour Schedule is mentioned below.
            Please note that in the event of any change in my Tour Schedule; please ignore this schedule as I will submit
            the revised Tour Schedule. This is for your information for Attendance Record. Also, please forward the second
            copy to Accounts Department for Tour Advance.
          </p>

          <h3 style={{ textAlign: 'center' }}>
            <strong><u>Details of Tentative Tour Schedule and HOD Remarks:</u></strong>
          </h3>

          <section >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td colSpan={1} style={{ fontSize: "14px", fontWeight: 'bold', padding: '6px', border: '1px solid black', width: '50%' }}>
                    Employee ID: {employeedetails[0]?.employeeCode}
                  </td>
                  <td colSpan={1} style={{ fontSize: "14px", fontWeight: 'bold', padding: '6px', border: '1px solid black' }}>
                    Name of the Employee:
                  </td>
                  <td colSpan={2} style={{ padding: '6px', border: '1px solid black', width: '25%' }}>{employeedetails[0]?.firstName}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: "-1px" }}>
            <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                    Department:
                  </td>
                  <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>{employeedetails[0]?.departmentName}</td>
                  <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                    Designation:
                  </td>
                  <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>{employeedetails[0]?.designationName}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                    Branch:
                  </td>
                  <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>{employeedetails[0]?.branchName}</td>
                  <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                    Tour type: 
                  </td>
                  <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>{submittedData?.tourType }</td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ fontSize: "14px", padding: '8px', border: '1px solid black', fontWeight: 'bold' }}>
                     Purpose Of Visit: {submittedData?.purposeOfVisit }
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ fontSize: "14px", textAlign: 'center', padding: '2px', border: '1px solid black', fontWeight: 'bold' }}>
                    Tentative Tour Schedule
                  </td>
                </tr>
                <tr>
                  <th style={{ fontSize: "14px", padding: '5px', border: '1px solid black', textAlign: "center" }} colSpan={2}>FROM</th>
                  <th style={{ fontSize: "14px", padding: '5px', border: '1px solid black', textAlign: "center" }} colSpan={2}>TO</th>
                </tr>
                <tr>
                  <th style={{ fontSize: "14px", padding: '8px', border: '1px solid black' }}>Date</th>
                  <th style={{ fontSize: "14px", padding: '8px', border: '1px solid black' }}>Place</th>
                  <th style={{ fontSize: "14px", padding: '8px', border: '1px solid black' }}>Date</th>
                  <th style={{ fontSize: "14px", padding: '8px', border: '1px solid black' }}>Place</th>
                </tr>
                {rows}
                <tr>
                  <td style={{ fontWeight: 'bold', fontSize: "14px", padding: '8px', border: '1px solid black' }} colSpan={4}>Expenditure advance amount:{' ₹' + submittedData?.advanceRequired + ' /-'}</td>

                </tr>
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: "-1px" }}>
            <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", marginBottom: "20px", }}>
              <thead>
                <tr>
                  <td colSpan={2} style={{ fontSize: "14px", textAlign: "center", fontWeight: "bold", borderBottom: "1px solid black", padding: "10px", }}>
                    Remarks of the Concerned Department Head
                    <br></br>
                    <span style={{ color: 'gray', fontStyle: 'italic' }}>{remarks ? remarks : submittedData?.remarks} </span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontSize: "14px", textAlign: "left", padding: "10px", }}>
                    <br />
                    <b>Date: {submittedData?.permission === TourIntimationEnum.APPROVED ? dayjs(submittedData?.permissionDate).format('YYYY-MM-DD') : ''}</b>
                  </td>
                  <td style={{ fontSize: "14px", textAlign: "right", padding: "10px", }}>
                    <br />
                    <b>Signature of HOD</b>
                  </td>
                </tr>
                {/* <hr style={{ width: "245%" }} /> */}
                <tr>
                  <td style={{ fontSize: "14px", textAlign: "left", padding: "10px", }}>
                    <br />
                    <b>Date:</b>
                  </td>
                  <td style={{ fontSize: "14px", textAlign: "right", padding: "10px", }}>
                    <br />
                    <b>Signature of the Employee</b>
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }}>
              <thead>
                <tr>
                  <td colSpan={2} style={{ fontSize: "14px", textAlign: "center", fontWeight: "bold", borderBottom: "1px solid black", padding: "10px", }}>
                    Remarks of HR - Department Head
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontSize: "14px", textAlign: "left", padding: "10px", }}>
                    <br />
                    <b>Date:</b>
                  </td>
                  <td style={{ fontSize: "14px", textAlign: "right", padding: "10px", }}>
                    <br />
                    <b>Signature</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div >
      </Card >
    </>
  );
};

export default TourIntimationPdf;






