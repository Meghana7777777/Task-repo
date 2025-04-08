import {
  ComponentTypeEnum,
  PayrollProcessedLogReq,
} from '@hrexpert/shared-models';
import { PayrollProcessedLogsService } from '@hrexpert/shared-services';
import { amountToWords } from 'amount-to-words';
import { Card, Col, Divider, message, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import logo from './sakku-logo.png';
const { Title, Text } = Typography;

export interface PaySlipProps {
  empId: number[];
  payrollMonth: number;
  style?: React.CSSProperties;
}

const Payslip = (props: PaySlipProps) => {
  const service = new PayrollProcessedLogsService();
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState([]);
  const [deductionsData, setDeductionsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState<string>('₹0.00');
  const [totalDeductions, setTotalDeductions] = useState<string>('₹0.00');
  const [netPayable, setNetPayable] = useState<string>('₹0.00');
  const [wordAmount, setWordAmount] = useState(String);

  useEffect(() => {
    getData(props);
  }, [props.empId, props.payrollMonth]);

  const formatCurrency = (number: number): string => {
    return `₹${number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // const calculateTotal = (items: { value: number }[]): number => {
  //   return items.reduce((sum, item) => sum + item.value, 0);
  // };

  const getData = async (value) => {
    try {
      const req = new PayrollProcessedLogReq();
      req.payrollMonth = value.payrollMonth;
      req.employeeId = value.empId;
  
      const res = await service.getPayrollDataById(req);
  
      if (!res.status) {
        setEmployeeData([]);
        message.error(res.internalMessage, 2);
        return;
      }
  
      const employeeData = res.data[0];
  
      const formatComponent = (component) => {
        const [key, value] = Object.entries(component).find(([key]) => key !== 'type') || ['', '0'];
        const numericValue = parseFloat(value as string);
  
        // Exclude if the value is 0
        if (numericValue === 0) return null;
  
        return {
          item: key,
          amount: formatCurrency(numericValue),
          value: numericValue,
        };
      };
  
      // Filter and map only valid components (non-null)
      const earnings = employeeData.componentKeys
        .filter(component => component.type === ComponentTypeEnum.EARNING)
        .map(formatComponent)
        .filter(Boolean);
  
      const deductions = employeeData.componentKeys
        .filter(component => component.type === ComponentTypeEnum.DEDUCTION)
        .map(formatComponent)
        .filter(Boolean);
  
      const totalEarningsObj = employeeData.componentKeys.find(item => "Total Earnings" in item);
      const totalDeductionsObj = employeeData.componentKeys.find(item => "Total Deductions" in item);
      const totalNetPayableObj = employeeData.componentKeys.find(item => "Net Payable" in item);
  
      const totalEarningsValue = totalEarningsObj ? Number(totalEarningsObj["Total Earnings"]) : 0;
      const totalDeductionsValue = totalDeductionsObj ? Number(totalDeductionsObj["Total Deductions"]) : 0;
      const netPayableValue = totalNetPayableObj ? Number(totalNetPayableObj["Net Payable"]) : 0;
  
      const { numberInWords } = amountToWords(netPayableValue, 2);
  
      setWordAmount(numberInWords);
      setEmployeeData(res.data);
      setEarningsData(earnings);
      setDeductionsData(deductions);
  
      // Only set totals if they are nonzero
      setTotalEarnings(totalEarningsValue !== 0 ? formatCurrency(totalEarningsValue) : null);
      setTotalDeductions(totalDeductionsValue !== 0 ? formatCurrency(totalDeductionsValue) : null);
      setNetPayable(netPayableValue !== 0 ? formatCurrency(netPayableValue) : null);
    } catch (error) {
      setEmployeeData([]);
      message.error('An error occurred while fetching data', 2);
      console.error('Error:', error);
    }
  };
  

  // const getData = async (value) => {
  //   try {
  //     const req = new PayrollProcessedLogReq();
  //     req.payrollMonth = value.payrollMonth;
  //     req.employeeId = value.empId;

  //     const res = await service.getPayrollDataById(req);

  //     if (!res.status) {
  //       setEmployeeData([]);
  //       message.error(res.internalMessage, 2);
  //       return;
  //     }

  //     const employeeData = res.data[0];

  //     const formatComponent = (component) => {
  //       const [key, value] = Object.entries(component).find(
  //         ([key]) => key !== 'type'
  //       ) || ['', '0'];
  //       const numericValue = parseFloat(value as string);
  //       return {
  //         item: key,
  //         amount: formatCurrency(numericValue),
  //         value: numericValue,
  //       };
  //     };

  //     const earnings = employeeData.componentKeys.filter((component) => component.type === ComponentTypeEnum.EARNING).map(formatComponent);
  //     const deductions = employeeData.componentKeys.filter((component) => component.type === ComponentTypeEnum.DEDUCTION).map(formatComponent);

  //     const totalEarningsObj = employeeData.componentKeys.find(
  //       item => "Total Earnings" in item // ✅ Only check for key existence, ignore type
  //     );

  //     const totalDeductionsObj = employeeData.componentKeys.find(
  //       item => "Total Deductions" in item // ✅ Only check for key existence, ignore type
  //     );

  //     const totalNetPayableObj = employeeData.componentKeys.find(
  //       item => "Net Payable" in item // ✅ Only check for key existence, ignore type
  //     );

  //     const totalEarningsValue = totalEarningsObj ? Number(totalEarningsObj["Total Earnings"]) : 0;
  //     const totalDeductionsValue = totalDeductionsObj ? Number(totalDeductionsObj["Total Deductions"]) : 0;
  //     const netPayableValue = totalNetPayableObj ? Number(totalNetPayableObj["Net Payable"]) : 0;

  //     const { numberInWords } = amountToWords(netPayableValue, 2);

  //     setWordAmount(numberInWords);
  //     setEmployeeData(res.data);
  //     setEarningsData(earnings);
  //     setDeductionsData(deductions);
  //     setTotalEarnings(formatCurrency(totalEarningsValue));
  //     setTotalDeductions(formatCurrency(totalDeductionsValue));
  //     setNetPayable(formatCurrency(netPayableValue));
  //   } catch (error) {
  //     setEmployeeData([]);
  //     message.error('An error occurred while fetching data', 2);
  //     console.error('Error:', error);
  //   }
  // };

  return (
    <div>
      {employeeData.map((employee, index) => (
        <Card
          key={index}
          style={{
            width: '100%',
            maxWidth: 900,
            margin: 'auto',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid #ddd',
          }}
          id="payslip-container"
        >
          <Row
            style={{
              backgroundColor: 'powderblue',
              color: '#fff',
              padding: '10px',
              border: '1px solid #000',

            }}
            justify="space-between"
            align="middle"
          >
            <Col>
              <Text strong style={{ fontSize: '20px', color: 'black' }}>
                Venkatrama Poultries Pvt. Ltd.
              </Text>
            </Col>

            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <img
                src={logo}
                alt="Company Logo"
                style={{ maxWidth: '150px', width: '100%', height: 'auto' }}
              />
            </Col>
          </Row>

          <div style={{ padding: '10px 0' }}>
            <Title
              level={5}
              style={{ marginBottom: '5px', textAlign: 'center' }}
            >
              Payslip for {employee.monthYear}
            </Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 5 }}>
              <Col span={16}>
                <Title level={5} style={{ marginBottom: '2px' }}>
                  {employee.empName}, {employee.empCode}
                </Title>
                <Text>
                  {employee.designation} | {employee.department}
                </Text>
                <br />
                <Text>
                  Date of Joining: {dayjs(employee.doj).format('YYYY-MM-DD')}
                </Text>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Title level={4} style={{ color: '#52c41a', fontSize: '22px' }}>
                  {netPayable || '0'}
                </Title>
                <Text>Paid Days: {employee.payDays}</Text>
                <Divider type="vertical" style={{ border: '1px solid' }} />
                <Text>LOP Days: {employee.lopDays ? employee.lopDays : 0}</Text>
              </Col>
            </Row>
          </div>

          <Divider style={{ borderBottom: 1, borderColor: '#000', margin: '5px 0', }} />

          <Row gutter={16} style={{ padding: '5px 0' }}>
            <Col span={12}>
              <Text strong>
                {/* <FaUniversity />  */}
                PF A/C No:</Text>{' '}{employee.pfNo}
              <br />
              <Text strong>
                {/* <FaFileAlt />  */}
                PAN:</Text>{' '}{employee.pan}
              <br />
              <Text strong>
                {/* <MdOutlineAccountBalanceWallet />  */}
                Bank A/c No:</Text>{' '}{employee.bankAccNo}
            </Col>
            <Col span={12}>
              <Text strong>
                {/* <FaRegAddressCard />  */}
                UAN:</Text>{' '}{employee.uan}
              <br />
              <Text strong>
                {/* <FaRegAddressCard />  */}
                ESI :</Text>{' '}{employee.esicNo}
              <br />
              <Text strong>
                {/* <FaUniversity />  */}
                Branch:</Text>{' '}
              {employee.branch}
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col span={24}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{ backgroundColor: '#e6f7ff', textAlign: 'center' }}
                  >
                    <th style={{ padding: '5px', border: '1px solid #000' }}>
                      EARNINGS
                    </th>
                    <th style={{ padding: '5px', border: '1px solid #000' }}>
                      AMOUNT
                    </th>
                    <th style={{ padding: '5px', border: '1px solid #000' }}>
                      DEDUCTIONS
                    </th>
                    <th style={{ padding: '5px', border: '1px solid #000' }}>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({
                    length: Math.max(
                      earningsData.length,
                      deductionsData.length
                    ),
                  }).map((_, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: '5px',
                          border: '1px solid #000',
                        }}
                      >
                        {earningsData[index]?.item || ''}
                      </td>
                      <td
                        style={{
                          padding: '5px',
                          border: '1px solid #000',
                          textAlign: 'right',
                        }}
                      >
                        {earningsData[index]?.amount || ''}
                      </td>
                      <td
                        style={{
                          padding: '5px',
                          border: '1px solid #000',
                        }}
                      >
                        {deductionsData[index]?.item || ''}
                      </td>
                      <td
                        style={{
                          padding: '5px',
                          border: '1px solid #000',
                          textAlign: 'right',
                        }}
                      >
                        {deductionsData[index]?.amount || ''}
                      </td>
                    </tr>
                  ))}
                  <tr
                    style={{
                      backgroundColor: '#f0f5ff',
                      fontWeight: 'bold',
                    }}
                  >
                    <td
                      style={{
                        padding: '5px',
                        border: '1px solid #000',
                      }}
                    >
                      Total Earnings
                    </td>
                    <td
                      style={{
                        padding: '5px',
                        border: '1px solid #000',
                        textAlign: 'right',
                      }}
                    >
                      {totalEarnings}
                    </td>
                    <td
                      style={{
                        padding: '5px',
                        border: '1px solid #000',
                      }}
                    >
                      Total Deductions
                    </td>
                    <td
                      style={{
                        padding: '5px',
                        border: '1px solid #000',
                        textAlign: 'right',
                      }}
                    >
                      {totalDeductions}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>

          <Row
            style={{
              marginTop: 10,
              padding: '5px 0',
              backgroundColor: '#fafafa',
            }}
            align='middle'
          >
            <Col span={24} style={{ textAlign: 'left', paddingLeft: '10px' }}>
              <Text strong>Total Net Payable: {netPayable}</Text>
              <br />
            </Col>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ textAlign: 'left', paddingLeft: '10px' }}>In Words: {wordAmount}</Text>
              <Text strong style={{ textAlign: 'right', paddingRight: '10px' }}>Signature</Text>
            </Col>
            <br />
            <Col span={24} style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                -- This is a system-generated document. --
              </Text>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default Payslip;
