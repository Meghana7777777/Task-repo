import { ComponentTypeEnum, EmailRequest, PayrollProcessedLogReq } from '@hrexpert/shared-models';
import { configVariables, EmailSendingService, EmployeeOnboardingService, EmployeeTypeService, PayrollProcessedLogsService } from '@hrexpert/shared-services';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { amountToWords } from 'amount-to-words';
import { Button, Card, Col, DatePicker, Form, message, Modal, Row, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIAMClientState } from '../../../common/iam-client-react';
import PayslipPDF from '../../payroll-management/payslip/payslip-pdf';
import Payslip from '../../payroll-management/payslip/payslip-template';

const PayslipGenerationSelf = () => {
  const service = new PayrollProcessedLogsService();
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().subtract(1, 'month').format('YYYYMM')
  );
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpIds, setSelectedEmpIds] = useState<any[]>([]);
  const emailService = new EmailSendingService();
  const printRef = useRef<HTMLDivElement>(null);
  const [employeePdfData, setEmployeePdfData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState([]);
  const [deductionsData, setDeductionsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState<string>('₹0.00');
  const [totalDeductions, setTotalDeductions] = useState<string>('₹0.00');
  const [netPayable, setNetPayable] = useState<string>('₹0.00');
  const [wordAmount, setWordAmount] = useState(String);
  const [form] = useForm()
  const { IAMClientAuthContext } = useIAMClientState();
  const unitId = Number(IAMClientAuthContext.user.unitId);
  const employeeCode = IAMClientAuthContext.user.employeeCode
  const role = IAMClientAuthContext.user.roles
  const docUrl = configVariables.IMAGE_UPLOAD_URL
  
  useEffect(() => {
    getData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (role !== 'SuperAdmin') {
      form.setFieldValue('branchId', unitId)
    } else {
      form.setFieldsValue({ branchId: null })
    }
  }, [])

  const getData = async (value) => {
    const req = new PayrollProcessedLogReq();
    req.payrollMonth = value
    req.employeeCode = Number(employeeCode)
    req.branchId = form.getFieldValue('branchId')
    req.departmentId = form.getFieldValue('departmentId')
    req.divisionId = form.getFieldValue('divisionId')
    req.employeeId = form.getFieldValue('employeeId')
    await service.getPayrollMonth(req).then((res) => {
      if (res.status) {
        setEmployeeData(res.data);
        message.success(res.internalMessage, 2);
        setSelectedEmpIds([]); 
        setSelectedRows([]); 
      } else {
        setEmployeeData([]);
        message.error(res.internalMessage, 2);
      }
    }).catch((error) => {
      setEmployeeData([]);
      message.error('An error occurred while fetching data', 2);
      console.error('Error:', error);
    });
  };

  const formatCurrency = (number: number): string => {
    return `₹${number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateTotal = (items: { value: number }[]): number => {
    return items.reduce((sum, item) => sum + item.value, 0);
  };

  const getDataForPdf = async (value) => {
    try {
      const req = new PayrollProcessedLogReq();
      req.payrollMonth = value.payrollMonth;
      req.employeeId = value.empId;
      const res = await service.getPayrollDataById(req);
      if (!res.status) {
        setEmployeePdfData([]);
        message.error(res.internalMessage, 2);
        return;
      }
      const employeeData = res.data[0];
      const formatComponent = (component) => {
        const [key, value] = Object.entries(component).find(
          ([key]) => key !== 'type'
        ) || ['', '0'];
        const numericValue = parseFloat(value as string);
        return {
          item: key,
          amount: formatCurrency(numericValue),
          value: numericValue,
        };
      };
      const earnings = employeeData.componentKeys
        .filter((component) => component.type === ComponentTypeEnum.EARNING)
        .map(formatComponent);
      const deductions = employeeData.componentKeys
        .filter((component) => component.type === ComponentTypeEnum.DEDUCTION)
        .map(formatComponent);

      const totalEarningsValue = calculateTotal(earnings);
      const totalDeductionsValue = calculateTotal(deductions);
      const netPayableValue = Math.ceil(
        totalEarningsValue - totalDeductionsValue
      );
      const { numberInWords } = amountToWords(netPayableValue, 2);

      setWordAmount(numberInWords);
      setEmployeePdfData(res.data);
      setEarningsData(earnings);
      setDeductionsData(deductions);
      setTotalEarnings(formatCurrency(totalEarningsValue));
      setTotalDeductions(formatCurrency(totalDeductionsValue));
      setNetPayable(formatCurrency(netPayableValue));
    } catch (error) {
      setEmployeePdfData([]);
      message.error('An error occurred while fetching data', 2);
      console.error('Error:', error);
    }
  };

  const generatePDF = async () => {
    try {
      for (const row of selectedRows) {
        try {
          await getDataForPdf(row);
          const pdfPromise = new Promise<Blob>((resolve, reject) => {
            try {
              const pdfDoc = (
                <PayslipPDF
                  employeePdfData={employeePdfData}
                  earningsData={earningsData}
                  deductionsData={deductionsData}
                  totalEarnings={totalEarnings}
                  totalDeductions={totalDeductions}
                  netPayable={netPayable}
                  wordAmount={wordAmount}
                />
              );

              pdf(pdfDoc)
                .toBlob()
                .then((blob) => {
                  if (!blob) {
                    reject(new Error("PDF Blob is empty or undefined"));
                  } else {
                    resolve(blob);
                  }
                })
                .catch(reject);
            } catch (err) {
              reject(err);
            }
          });

          const blob = await pdfPromise;

          await sendEmail(blob);
        } catch (error) {
          console.error(`Error processing employee with ID: ${row.empCode}`, error);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const uploadPDFAndGetPath = async (blob: Blob, empCode: string, payrollMonth: string) => {
    const formData = new FormData();
    formData.append("file", blob, `Payslip-${empCode}-${payrollMonth}.pdf`);
    formData.append("empCode", empCode);
    formData.append("payrollMonth", payrollMonth);

    try {
      const response = await service.pdfUploadTemp(formData);
      if (!response?.data?.pathName) {
        throw new Error("Failed to get file path from upload");
      }
      return {
        filename: `Payslip-${empCode}-${payrollMonth}.pdf`,
        path: docUrl + response.data.filename,
      };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      throw error;
    }
  };

  const sendEmail = async (pdfBlob: Blob) => {
    try {
      const empCode = employeePdfData[0]?.empCode ?? "Unknown";
      const payrollMonth = employeePdfData[0]?.payrollMonth ?? "Unknown";

      const attachment = await uploadPDFAndGetPath(pdfBlob, empCode, payrollMonth);

      const req = new EmailRequest();
      req.to = [employeePdfData[0]?.emailId];
      req.subject = `${employeePdfData[0]?.monthYear} Payslip`;
      req.body = `
        Hi ${employeePdfData[0]?.empName},
        <br/>
        <br/>
        Please find the payslip attached for the month of ${employeePdfData[0]?.monthYear}.
      `;
      req.attachments = [attachment];

      const res = await emailService.sendEmail(req);
      message[res.status ? "success" : "error"](
        `${employeePdfData[0]?.empName}: ${res.internalMessage}`,
        2
      );
    } catch (error) {
      console.error("Error in email sending process:", error);
      message.error("An error occurred while sending emails", 2);
    }
  };

  const columns = [
    { title: 'SNo', dataIndex: 'key', render: (_: any, __: any, index: number) => index + 1, width:50},
    { title: 'Employee Code', dataIndex: 'empCode',width:130 },
    { title: 'Employee Name', dataIndex: 'empName',width:170 },
    { title: 'Email', dataIndex: 'emailId', render(text): string { return text ?? '-'; },width:250 },
    { title: 'Branch', dataIndex: 'branchName',width:150  },
    { title: 'Designation', dataIndex: 'designation',width:120 },
    { title: 'Department', dataIndex: 'department',width:120 },
  ];

  const getPageStyle = (rowCount) => {
    const orientation = rowCount === 1 ? 'portrait' : 'landscape';
    return `
      @page {
        size: A4 landscape;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          width: 100%;
        }
        .payslip-container {
          margin: 0;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .page-break {
          page-break-before: always;
        }
      }
    `;
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Payslip',
    pageStyle: getPageStyle(selectedRows.length),
    copyShadowRoots: false,
    onBeforePrint: () => {
      console.log('Preparing to print...');
      return Promise.resolve();
    },
    onAfterPrint: () => console.log('Print success'),
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const onDateChange = (date) => {
    const formattedYearMonth = date ? date.format('YYYYMM') : '';
    if (date === null) {
      setEmployeeData([]);
      setSelectedRows([]);
    } else {
      getData(formattedYearMonth);
      setSelectedRows([]);
    }
  };

  return (
    <Card title="Employee Payslips" bordered>
      <Form layout='vertical' form={form}>
        <Row gutter={16}>
          <Col xl={4} lg={6} md={12} sm={24} xs={24}>
            <Form.Item label="Year" name={'year'}>
              <DatePicker.MonthPicker
                onChange={(date) => onDateChange(date)}
                defaultValue={dayjs().subtract(1, 'month')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row justify={'end'}>
        <Space>
          <Button
            type="primary"
            disabled={selectedRows.length === 0}
            onClick={generatePDF}
          >
            Trigger Mail
          </Button>
          <Button
            onClick={() => setModalVisible(true)}
            type="primary"
            disabled={selectedRows.length === 0}
          >
            Print
          </Button>
        </Space>
      </Row>

      <Table
         rowSelection={{
          selectedRowKeys: selectedEmpIds,
          onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRows(selectedRows);
            setSelectedEmpIds(selectedRows.map((row) => row.empId));
          },
        }}
        dataSource={employeeData}
        columns={columns}
        pagination={false}
        bordered
        size='small'
        rowKey="empId"
        scroll={{ x: 800, y: 850 }}
      // components={{
      //   body: {
      //     row: (props) => <tr {...props} style={rowStyle} />, // Set row height
      //   },
      // }}
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={selectedEmpIds.length === 1 ? '60%' : '100%'}
        footer={false}
      >
        <div ref={printRef}>
          {selectedEmpIds.length === 1 ? (
            <Payslip
              empId={selectedEmpIds[0]}
              payrollMonth={selectedRows[0]?.payrollMonth}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                margin: 0,
                padding: 0,
              }}
            >
              {selectedEmpIds.map((empId, index) => (
                <Payslip
                  key={index}
                  empId={empId}
                  payrollMonth={selectedRows[0]?.payrollMonth}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
          type="primary"
          onClick={() => handlePrint()}
        >
          Print
        </Button>
       
      </Modal>

      {selectedEmpIds[0] && selectedRows[0]?.payrollMonth && (
        <PDFDownloadLink
          document={
            <PayslipPDF
              employeePdfData={employeePdfData}
              earningsData={earningsData}
              deductionsData={deductionsData}
              totalEarnings={totalEarnings}
              totalDeductions={totalDeductions}
              netPayable={netPayable}
              wordAmount={wordAmount}
            />
          }
          fileName={`Payslip-${selectedRows[0]?.empCode}-${selectedRows[0]?.monthYear}.pdf`}
        ></PDFDownloadLink>
      )}
    </Card>
  );
};

export default PayslipGenerationSelf;