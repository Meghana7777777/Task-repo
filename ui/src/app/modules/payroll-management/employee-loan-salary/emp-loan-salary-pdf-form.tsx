import { PrinterFilled } from '@ant-design/icons';
import { empLoanSalaryIdDto, EmpLoanSalarySharedDto } from '@hrexpert/shared-models';
import { EmpLoanSalarySharedService } from '@hrexpert/shared-services';
import { Button, Card, message } from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import sakkuLogo from './sakku-logo.png';

interface EmpLoanSalaryPdfProps {
  submittedData: any;
  employeedetails: any;
  formORview: number;
  remarks?: string;
  getPreviousLoans: any;
  empId: any
}

const EmpLoanSalaryPdf = (props: EmpLoanSalaryPdfProps) => {
  const [previousLoanData, setPreviousLoanData] = useState<EmpLoanSalarySharedDto | null>(null);
  const empLoanSalaryService = new EmpLoanSalarySharedService()

  useEffect(() => {
    if (props.empId?.employeeId) {
      console.log(props.empId.employeeId, 'props.empId.employeeIdddddddddddddd');
      getPreviousLoans(props.empId.employeeId);
    }
  }, [props.empId?.employeeId]);

  // const downloadPdf = () => {
  //   const input = document.getElementById('carhartt')!;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`${props.empId?.employeeCode}_Employee-Loan-Salary-Form.pdf`);
  //   });
  // };

  
  const downloadPdf = () => {
    const printRelievingForm = document.getElementById('carhartt')
    if (printRelievingForm) {
        const newWindow = window.open('', '_blank')
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
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

  const getPreviousLoans = (empId) => {
    try {
      const req = new empLoanSalaryIdDto(empId)
      empLoanSalaryService.getPreviousLoans(req).then((res) => {
        console.log(res, 'resssssssssssssssss');
        if (res.status) {
          setPreviousLoanData(res.data);
        } else {
          message.error("Failed to retrieve Emp-Loan/Salary ");
        }
      })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id='carhartt'>

      <Card id="loanSalaryForm" style={{ maxWidth: 800, margin: '0 auto', padding: '10px' }}>
        <div style={{ marginLeft: '700px' }}>
          <Button onClick={downloadPdf} icon={<PrinterFilled />}></Button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={sakkuLogo} alt="Sakku Logo" style={{ width: '30%' }} />
        </div>

        <p style={{ textAlign: 'center' }}>
          <b style={{ fontSize: "25px" }}>Employee Loan/Salary Application</b>
          <br />
          <h2 style={{ fontSize: "13px" }}>(Original shall be with HR Department and Duplicate is to be forwarded by HR Department to Accounts Department)</h2>
        </p>
        <hr />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>
            <strong>TO:</strong> HR Department,
            <br />
            Sir/Madam,
          </h3>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <strong>Date: </strong>{dayjs(props.empId?.dateOfApplying)?.format('YYYY-MM-DD')}
          </div>
        </div>

        <p style={{ fontSize: "12px", fontWeight: "bold" }}>
          I am applying for a loan/salary advance due to urgent financial needs.
          Please find the details of my request below. In case of any changes to my financial situation,
          I will promptly inform you and submit a revised application.
          This application is for your consideration and necessary action.
          Kindly forward the second copy to the Accounts Department for processing the loan/salary advance.
        </p>

        <br></br>
        <strong>Loan Ref No: </strong>{props.empId?.loanRefNo}

        <h3 style={{ textAlign: 'center' }}>
          <strong><u>Details of Loan/Salary Of Employee and HOD Remarks:</u></strong>
        </h3>
        <section>
          <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
            <tbody>
              <tr>
                <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                  Employee Id:
                </td>
                <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>{props.empId?.employeeCode || 'N/A'}</td>
                <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                  Name Of Employee:
                </td>
                <td colSpan={2} style={{ padding: '6px', border: '1px solid black', width: '25%' }}>{props.empId?.firstName}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%", }} cellPadding="10" cellSpacing="0">
            <tbody>
              <tr>
                <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                  Designation:
                </td>
                <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>{props.empId?.designation}</td>
                <td style={{ fontSize: "14px", fontWeight: 'bold', padding: '8px', border: '1px solid black', width: '25%' }}>
                  Date Of Joining:
                </td>
                <td style={{ padding: '8px', border: '1px solid black', width: '25%' }}>
                  {props.empId?.dateOfJoining ? new Date(props.empId?.dateOfJoining).toISOString().slice(0, 10) : ''}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <br></br>
        <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid black' }}>Type of Loan / Advance Requested</th>
              <th style={{ padding: '8px', border: '1px solid black' }}>Amount Applied For</th>
              <th style={{ padding: '8px', border: '1px solid black' }}>No. of Installments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid black' }}>{props.empId?.type}</td>
              <td style={{ padding: '8px', border: '1px solid black' }}>{props.empId?.advanceAmount}</td>
              <td style={{ padding: '8px', border: '1px solid black' }}>{props.empId?.installments}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '15px' }}>Purpose of Personal Loan:</p>
        <ul style={{ columns: 2, paddingLeft: '40px', listStylePosition: 'inside' }}>
          <li>
            <strong>Holidays</strong>
            {props.submittedData?.purpose === 'Holidays' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Travel</strong>
            {props.submittedData?.purpose === 'Travel' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Education</strong>
            {props.submittedData?.purpose === 'Education' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Children's Education</strong>
            {props.submittedData?.purpose === 'Children\'s Education' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Medical Expenses</strong>
            {props.submittedData?.purpose === 'Medical Expenses' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Investments</strong>
            {props.submittedData?.purpose === 'Investments' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Marriage purpose</strong>
            {props.submittedData?.purpose === 'Marriage purpose' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>House Improvement</strong>
            {props.submittedData?.purpose === 'House Improvement' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>House Renovation</strong>
            {props.submittedData?.purpose === 'House Renovation' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Loan Transfer</strong>
            {props.submittedData?.purpose === 'Loan Transfer' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li>
            <strong>Purchase of Equipment's</strong>
            {props.submittedData?.purpose === 'Purchase of Equipment\'s' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
          <li style={{ whiteSpace: 'nowrap' }}>
            <strong>Other:</strong>
            <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '200px', textAlign: 'center' }}>
              {props.submittedData?.reason}
            </span>
            {props.submittedData?.purpose === 'Other' && <span style={{ color: 'green', marginLeft: '5px' }}>✔️</span>}
          </li>
        </ul>

        <p style={{ fontSize: '14px' }}>
          <strong>• Do you have any outstanding loan prior to this loan? If so please provide the following details</strong>
        </p>
        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
          <p style={{ fontSize: '13px', textAlign: 'center' }}>
            <strong>1. Type of Loan: </strong>
            <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '300px', textAlign: 'center' }}>
              {props?.getPreviousLoans?.type || 'No previous loans'}
            </span>
          </p>
        </div><div>
          <p style={{ fontSize: '13px', textAlign: 'center', margin: '0' }}>
            <strong>2. Amount Outstanding: </strong>
            <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px', textAlign: 'center' }}>
              {props?.getPreviousLoans?.advanceAmount || 'No previous loans'}
            </span>
            <strong> Date on which availed: </strong>
            <span style={{ borderBottom: '1px solid black', display: 'inline-block', width: '150px', textAlign: 'center' }}>
              {props?.getPreviousLoans?.dateOfApplying || 'No previous loans'}
            </span>
          </p>
        </div>
        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>
          I have read all the provisions of the company policy on loans/advances and undertake to comply by them. I authorize the
          company to recover any outstanding amount under this policy from my salary.
        </p>
        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>
          Recommendation of HOD:
          <span style={{ textDecoration: 'underline', fontWeight: 'normal', display: 'inline-block', width: '300px', textAlign: 'center' }}>
            {props.empId?.hodMail || ' '}
          </span>
        </p>
        <br></br>
        <br></br>
        <br></br>
        <div style={{ marginTop: '20px', textAlign: 'center', gap: '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '13px' }}>
              <div style={{ borderBottom: '1px solid black', width: '150px', marginBottom: '5px' }}></div>
              <strong>Employee Signature</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '13px' }}>
              <div style={{ borderBottom: '1px solid black', width: '150px', marginBottom: '5px' }}></div>
              <strong>Manager Signature</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '13px' }}>
              <div style={{ borderBottom: '1px solid black', width: '150px', marginBottom: '5px' }}></div>
              <strong>Sanctioning Authority Signature</strong>
            </div>
          </div>
        </div>


        <br></br>
        <br></br>
        <br></br>


      </Card>
    </div>
  );
};

export default EmpLoanSalaryPdf;







