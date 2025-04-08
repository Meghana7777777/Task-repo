import { PrinterFilled } from "@ant-design/icons";
import { PayrollProcessedLogReq } from "@hrexpert/shared-models";
import { PayrollRecordsSharedService } from "@hrexpert/shared-services";
import { Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import sakkuHeading from '../employee-froms/images/Offer-letter-sakku1.jpg';
import sakkuAddress from '../employee-froms/images/Offer-letter-sakku2.jpg';
import dayjs from "dayjs";

interface SampleOfferLetterPdfProps {
  rec: any;
  payroll: any;
}

export const SampleOfferLetterPdf = (props: SampleOfferLetterPdfProps) => {
  const data = props.rec[0] ? props.rec[0] : props.rec
  const payrollService = new PayrollRecordsSharedService()
  const [allPayrollEmployees, setAllPayrollEmployees] = useState<any[]>([])

  useEffect(() => {
    getAllPayrollEmployees()
  }, [props.rec])

  const getAllPayrollEmployees = () => {
    try {
      const req = new PayrollProcessedLogReq(undefined, props.rec.id)
      payrollService.getPayrollRecords(req).then((res) => {
        if (res.status) {
          setAllPayrollEmployees(res.data);
        } else {
          console.error("failed to fetch designations");
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  const getBasicOrPerDay = (employee) => {
    if (!employee?.componentRecords) return "-";

    const componentRecords = JSON.parse(employee.componentRecords);

    if (employee.designationName?.toUpperCase() === "WORKER") {
      return componentRecords["PER DAY"] || "-";
    } else {
      return componentRecords["BASIC"] || "-";
    }
  };

  const getPfEmployerValue = (allPayrollEmployees) => {
    if (allPayrollEmployees.length > 0) {
      const pfEmployerItem = allPayrollEmployees[0].componentKeys.find(
        (item) => item["PF-Employer"] !== undefined
      );
      const pfEmployerValue = pfEmployerItem?.["PF-Employer"];
      return pfEmployerValue !== undefined ? pfEmployerValue : "-";
    } else {
      return "-";
    }
  };

  const getBasicOrPerDayAnnum = (employee) => {
    if (!employee?.componentRecords) return "-";

    const componentRecords = JSON.parse(employee.componentRecords);
    let basicOrPerDay = 0;

    if (employee.designationName?.toUpperCase() === "WORKER") {
      basicOrPerDay = componentRecords["PER DAY"] || 0;
      return basicOrPerDay * 365;
    } else {
      basicOrPerDay = componentRecords["BASIC"] || 0;
      return basicOrPerDay * 12;
    }
  };

  const getAnnualHRA = (employees) => {
    if (employees.length === 0) return "-";

    const hraValue = employees[0].componentKeys.find(item => item.HRA)?.HRA || 0;
    return (hraValue * 12).toFixed(2);
  };
  const getAnnualConveyAllow = (employees) => {
    if (employees.length === 0) return "-";

    const conveyValue = employees[0].componentKeys.find(item => item["CONVY ALLO"])?.["CONVY ALLO"] || 0;
    return (conveyValue.toString().trim() * 12).toFixed(2);
  };
  const getAnnualSP = (employees) => {
    if (employees.length === 0) return "-";

    const SpValue = employees[0].componentKeys.find(item => item["SPL PAY"])?.["SPL PAY"] || 0;
    return (SpValue.toString().trim() * 12).toFixed(2);
  };
  const getAnnualChild = (employees) => {
    if (employees.length === 0) return "-";

    const ChildValue = employees[0].componentKeys.find(item => item["CHILD EDU"])?.["CHILD EDU"] || 0;
    return (ChildValue.toString().trim() * 12).toFixed(2);
  };

  const getPfEmployerAnnual = (allPayrollEmployees) => {
    const monthlyPf = getPfEmployerValue(allPayrollEmployees);
    return monthlyPf !== "-" ? monthlyPf * 12 : "-";
  };

  const getAnnualSumOfA = (employees) => {
    if (employees.length === 0) return "-";

    const safeParse = (value) => (value === "-" ? 0 : parseFloat(value) || 0);

    const total = employees.reduce((sum, employee) => {
      return (
        sum +
        safeParse(getBasicOrPerDayAnnum(employee)) +
        safeParse(getAnnualHRA(employees)) +
        safeParse(getAnnualConveyAllow(employees)) +
        safeParse(getAnnualSP(employees)) +
        safeParse(getAnnualChild(employees))
      );
    }, 0);

    return total.toFixed(2);
  };
  const getAnnualSumB = (employees) => {
    if (employees.length === 0) return "-";

    const safeParse = (value) => (value === "-" ? 0 : parseFloat(value) || 0);

    const total = employees.reduce((sum, employee) => {
      return (
        sum +
        safeParse(getMonthlySumB(employees))
      );
    }, 0);

    return total.toFixed(2);
  };

  const getMonthlySumOfA = (employees) => {
    return employees.reduce((sum, employee) => {
      const basic = parseFloat(getBasicOrPerDay(employee)) || 0;
      const hra = parseFloat(employee.componentKeys.find(item => item.HRA)?.HRA) || 0;
      const conveyance = parseFloat(employee.componentKeys.find(item => item["CONVY ALLO"])?.["CONVY ALLO"]) || 0;
      const specialPay = parseFloat(employee.componentKeys.find(item => item["SPL PAY"])?.["SPL PAY"]) || 0;
      const childEdu = parseFloat(employee.componentKeys.find(item => item["CHILD EDU"])?.["CHILD EDU"]) || 0;

      return sum + basic + hra + conveyance + specialPay + childEdu;
    }, 0);
  };

  const getMonthlySumB = (employees) => {
    return employees.reduce((sum, employee) => {
      const childEdu = parseFloat(employee.componentKeys.find(item => item["PF-Employer"])?.["PF-Employer"]) || 0;

      return sum + childEdu;
    }, 0);
  };

  const getMonthlySumAB = (employees) => {
    const sumA = getMonthlySumOfA(employees);
    const sumB = getMonthlySumB(employees);
    return (sumA + sumB).toFixed(2);
  };

  const getAnnualSumAB = (employees) => {
    if (employees.length === 0) return "-";

    const safeParse = (value) => (value === "-" ? 0 : parseFloat(value) || 0);

    const total = employees.reduce((sum, employee) => {
      return (
        sum +
        safeParse(getAnnualSumOfA(employees)) +
        safeParse(getAnnualSumB(employees))
      );
    }, 0);

    return total.toFixed(2);
  };


  const handlePrint = () => {
    const printContent = document.getElementById('sakkuId');
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

      <Card style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ marginLeft: "600px" }}>
          <Button onClick={handlePrint}><PrinterFilled /></Button>
        </div>
        <div style={{ margin: 'auto' }} className="record-container " id='sakkuId'>

          <img src={sakkuHeading} alt="Logo" className="offer-letter-logo" style={{ width: "90%", marginTop: "30px", marginLeft: "20px" }} />
          <br />

          <p style={{ textAlign: 'right', marginRight: '50px' }}>{getCurrentDate()}</p>
          <p style={{ textAlign: 'left' }}>Ref: { props.rec.branchId.companyCode+'/OFFER/'+dayjs(props.rec.dateOfJoining).format('MMM')+'/'+dayjs(props.rec.dateOfJoining).format('YY')+'/'+dayjs(props.rec.dateOfJoining).format('DD')+'___'}</p>
          <div id="offerLetter">
            <h2 style={{ textAlign: 'center' }}>Offer of Appointment</h2>
            <p style={{}}>Dear <b>{data?.employeeName ? data.employeeName : "-"}</b></p>
            <p style={{ fontSize: '13px' }}>With reference to your application and subsequent interview you had with us, we are delighted to offer you the role of {data?.designationId.name ? data?.designationId.name : "-"}, with Venkatrama Poultries Private Limited. We are confident that your extensive experience and skills will be valuable assets to our company. </p>
            <div style={{ marginLeft: '10px' }}>
              <p style={{}}>The terms and conditions of this offer are as below.</p>
              <ul style={{ listStyleType: 'numaric' }}>
                <li style={{ fontSize: '13px' }}>You are offered the position of {data?.designationId.name ? data?.designationId.name : "-"}, reporting directly to the GM & Management of the company</li>
                <li style={{ fontSize: '13px' }}>Your primary work location will be at the Head Office Guntur Location, occasionally required to visit our production units.  </li>
                {allPayrollEmployees.map((employee) => (
                  <li style={{ fontSize: '13px' }}>Your Annual CTC is Rs. {getAnnualSumAB(allPayrollEmployees)}/- would be as mutually agreed. Please refer the Annexure for the detailed CTC breakup.</li>
                ))}
                <li style={{ fontSize: '13px' }}>You will be on Probation for Six Months from the date of your joining.</li>
                <li style={{ fontSize: '13px' }}>This Offer is valid till _____________ for acceptance and till _____________ for joining duty. Please note that this is purely an offer letter and we shall issue an Appointment Letter on the date of joining.</li>
                <li style={{ fontSize: '13px' }}>You are requested to send a copy of the documents as mentioned in Annexure at the time of joining for releasing the detailed appointment letter. Your appointment will be issued only upon submission of all the below mentioned documents.</li>
              </ul>
            </div>
            <p style={{ fontSize: '13px' }}>Please return the duplicate copy of this letter duly signed by you as token of acceptance of this offer. We look forward to welcoming you to our team and wish you a successful and fulfilling tenure with Sakku Group.</p>
            <br />

            <p style={{ fontSize: '13px' }}>Yours faithfully,</p>
            <br />
            <p style={{ fontSize: '13px' }}>
              For VENKATRAMA POULTRIES PVT. LTD.,
            </p>
            <br />

            <Row>
              <Col span={12}>
                <h2>Authorized Signatory</h2>
              </Col>
              <Col span={12}>
                <h2 style={{ textAlign: 'right', marginRight: '20px' }}>Accepted</h2>
              </Col>
            </Row>
            <img src={sakkuAddress} alt="Logo" className="offer-letter-logo" style={{ width: "90%", marginTop: "30px", marginLeft: "20px" }} />
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <img src={sakkuHeading} alt="Logo" className="offer-letter-logo" style={{ width: "90%", marginTop: "30px", marginLeft: "20px" }} />
          <div id="annexure">
            <hr style={{ borderWidth: '3px', borderColor: 'blue' }} />
            <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>Annexure</h1>
            <table style={{ fontFamily: 'Arial, sans-serif', borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th colSpan={4} style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '8px' }}>
                    VENKATARAMA POULTRIES PRIVATE <br /> LIMITED
                  </th>
                </tr>
                <tr>
                  <th colSpan={4} style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '8px' }}>
                    GROSS SALARY & BENEFITS - CTC STRUCTURE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Name: <b>{data?.employeeName ? data?.employeeName : "-"}</b></td>
                  <td colSpan={2} style={{ border: '1px solid #dddddd', padding: '5px' }}>Date Of Joining: <b>{data?.dateOfJoining ? data?.dateOfJoining : "-"}</b></td>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Employee ID: <b>{data?.employeeCode ? data?.employeeCode : "-"}</b></td>
                  <td colSpan={2} style={{ border: '1px solid #dddddd', padding: '5px' }}>Department: <b>{data?.departmentId.name ? data?.departmentId.name : "-"}</b></td>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Level & Grade: </td>
                  <td colSpan={2} style={{ border: '1px solid #dddddd', padding: '5px' }}>Location: <b>{data?.branchId.branchName ? data?.branchId.branchName : "-"} / {data?.divisionId.divisionName ? data?.divisionId.divisionName : "-"}</b></td>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Designation: <b>{data?.designationId.name ? data?.designationId.name : "-"}</b></td>
                  <td colSpan={2} style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <th colSpan={2} style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '5px' }}>SALARY DETAILS</th>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Rs. (Per Month)</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Rs. (Per Annum)</td>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>1</td> */}
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}>COMPONENTS OF SALARY THROUGH PAYSLIP</th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr>
                {allPayrollEmployees.map((employee, index) => (
                  <tr key={employee.id}>
                    {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{index + 1}</td> */}
                    <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Basic Pay / Per Day:</td>
                    <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getBasicOrPerDay(employee)}</td>
                    <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getBasicOrPerDayAnnum(employee)}</td>
                  </tr>
                ))}

                {Number(getAnnualHRA(allPayrollEmployees))>0?
                 <tr>
                 {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>2</td> */}
                 <td style={{ border: '1px solid #dddddd', padding: '5px' }}>House Rent Allowance</td>
                 <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{allPayrollEmployees.length > 0 ? (allPayrollEmployees[0].componentKeys.find(item => item.HRA)?.HRA || "-") : "-"}</td>
                 <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualHRA(allPayrollEmployees)}</td>
               </tr> : <></>
                }

                {Number(getAnnualConveyAllow(allPayrollEmployees)) > 0 ?  <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>3</td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Conveyance Allowance</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{allPayrollEmployees.length > 0
                    ? (allPayrollEmployees[0].componentKeys.find(item => item["CONVY ALLO"])?.["CONVY ALLO"]?.toString().trim().toUpperCase() || "-")
                    : "-"}</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualConveyAllow(allPayrollEmployees)}</td>
                </tr>: <></>}
               
               {Number(getAnnualSP(allPayrollEmployees))>0?
                <tr>
                {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>4</td> */}
                <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Special Pay</td>
                <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{allPayrollEmployees.length > 0
                  ? (allPayrollEmployees[0].componentKeys.find(item => item["SPL PAY"])?.["SPL PAY"]?.toString().trim().toUpperCase() || "-")
                  : "-"}</td>
                <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualSP(allPayrollEmployees)}</td>
              </tr>:<></> }
               
               {Number(getAnnualChild(allPayrollEmployees))>0?
                <tr>
                {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>5</td> */}
                <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Children Education</td>
                <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{allPayrollEmployees.length > 0
                  ? (allPayrollEmployees[0].componentKeys.find(item => item["CHILD EDU"])?.["CHILD EDU"]?.toString().trim().toUpperCase() || "-")
                  : "-"}</td>
                <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualChild(allPayrollEmployees)}</td>
              </tr>:<></>}
               
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>Sub Total: A</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getMonthlySumOfA(allPayrollEmployees)}</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualSumOfA(allPayrollEmployees)}</td>
                </tr>
                {/* <tr>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr> */}
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <th colSpan={2} style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '5px' }}>COMPONENTS OF STATUTORY BENEFITS</th>
                </tr>
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}>1</td> */}
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}>EPFO</th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getPfEmployerValue(allPayrollEmployees)}</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getPfEmployerAnnual(allPayrollEmployees)}</td>
                </tr>
                {/* <tr>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}></th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr> */}
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}>Sub Total: B</th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getMonthlySumB(allPayrollEmployees)}</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualSumB(allPayrollEmployees)}</td>
                </tr>
                {/* <tr>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}></th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr> */}
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}>TOTAL: (A+B)</th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getMonthlySumAB(allPayrollEmployees)}</td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}>{getAnnualSumAB(allPayrollEmployees)}</td>
                </tr>
                {/* <tr>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}></th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr> */}
                <tr>
                  {/* <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td> */}
                  <th style={{ border: '1px solid #dddddd', padding: '5px' }}>TOTAL Cost to Company:</th>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                  <td style={{ border: '1px solid #dddddd', padding: '5px' }}></td>
                </tr>
              </tbody>
            </table>
            <img src={sakkuAddress} alt="Logo" className="offer-letter-logo" style={{ width: "90%", marginTop: "30px", marginLeft: "20px" }} />

          </div>
          <br />
          <br />
          <br />
          <br />
          <br />

          <img src={sakkuHeading} alt="Logo" className="offer-letter-logo" style={{ width: "90%", marginTop: "30px", marginLeft: "20px" }} />

          <div id="checklist">
            <h1 style={{ textAlign: 'center' }}>Checklist of Documents</h1>
            <br /><br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: "lightskyblue" }}>
                    <th style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '6px' }}>
                      S.No
                    </th>
                    <th style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '6px' }}>
                      List of Documents
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>1</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Bank Account Details </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>2</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Updated Resume </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>3</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Copy of Educational Certificates </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>4</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Copy of PAN card </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>5</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Copy of AADHAR Card </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>6</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Resignation Copy and Relieving letter from previous employer  </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>7</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Last drawn salary slips (3 months)  </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>8</td>
                    <td style={{ border: '1px solid #dddddd', padding: '6px' }}>Experience Certificate from the previous organization </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <img src={sakkuAddress} alt="Logo" className="offer-letter-logo" style={{ width: "90%", marginTop: "30px", marginLeft: "20px" }} />

          </div>
        </div>
      </Card>
    </>

  );
};

export default SampleOfferLetterPdf;