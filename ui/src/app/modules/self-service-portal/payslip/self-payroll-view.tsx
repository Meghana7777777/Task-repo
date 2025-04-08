import { ProCard, ProFormDatePicker } from '@ant-design/pro-components';
import { ComponentTypeEnum, PayrollProcessedLogReq } from '@hrexpert/shared-models';
import { PayrollProcessedLogsService } from '@hrexpert/shared-services';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { message, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { amountToWords } from 'amount-to-words';
import Payslip from '../../payroll-management/payslip/payslip-template';
import PayslipPDF from '../../payroll-management/payslip/payslip-pdf';

const SelfServicePaySlip = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const service = new PayrollProcessedLogsService();
  const currentYear = new Date().getFullYear();
  const [empId, setEmpId] = useState<number[]>([]);
  const [payrollMonth, setPayrollMonth] = useState(Number);
  const [showPdfLink, setShowPdfLink] = useState(false);
  const currentUserString = JSON.parse(localStorage.getItem('currentUser')).user.employeeId;

  const [employeePdfData, setEmployeePdfData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState([]);
  const [deductionsData, setDeductionsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState<string>('₹0.00');
  const [totalDeductions, setTotalDeductions] = useState<string>('₹0.00');
  const [netPayable, setNetPayable] = useState<string>('₹0.00');
  const [wordAmount, setWordAmount] = useState(String);

  useEffect(() => {
    getData(currentYear);
  }, []);

  const getData = async (value) => {
    const req = new PayrollProcessedLogReq();
    req.payrollMonth = value;
    req.employeeId = Number(currentUserString)
    await service
      .getPayrollMonth(req)
      .then((res) => {
        if (res.status) {
          setData(res.data);
          message.success(res.internalMessage, 2);
        } else {
          setData([]);
          message.error(res.internalMessage, 2);
        }
      })
      .catch((error) => {
        setData([]);
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

  // const calculateTotal = (items: { value: number }[]): number => {
  //   return items.reduce((sum, item) => sum + item.value, 0);
  // };

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

      const earnings = employeeData.componentKeys.filter((component) => component.type === ComponentTypeEnum.EARNING).map(formatComponent);
      const deductions = employeeData.componentKeys.filter((component) => component.type === ComponentTypeEnum.DEDUCTION).map(formatComponent);

      const totalEarningsObj = employeeData.componentKeys.find(
        item => "Total Earnings" in item // ✅ Only check for key existence, ignore type
      );

      const totalDeductionsObj = employeeData.componentKeys.find(
        item => "Total Deductions" in item // ✅ Only check for key existence, ignore type
      );

      const totalNetPayableObj = employeeData.componentKeys.find(
        item => "Net Payable" in item // ✅ Only check for key existence, ignore type
      );

      const totalEarningsValue = totalEarningsObj ? Number(totalEarningsObj["Total Earnings"]) : 0;
      const totalDeductionsValue = totalDeductionsObj ? Number(totalDeductionsObj["Total Deductions"]) : 0;
      const netPayableValue = totalNetPayableObj ? Number(totalNetPayableObj["Net Payable"]) : 0;
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


  const handleView = (record) => {
    setModalVisible(true);
    setEmpId(record.empId);
    setPayrollMonth(record.payrollMonth);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDownload = async (record) => {
    getDataForPdf(record)
    setEmpId(record.empId);
    setPayrollMonth(record.payrollMonth);
    setSelectedData(record);
    setShowPdfLink(true);
    setTimeout(() => {
      const link = document.querySelector('a[download]') as HTMLAnchorElement;
      if (link) {
        link.click();
        setShowPdfLink(false);
      }
    }, 2000);
  };

  const save = (value) => {
    const selectedYear = value.format('YYYY');
    getData(selectedYear);
  };

  const columns = [
    {
      title: 'Month',
      dataIndex: 'payrollMonth',
      key: 'payrollMonth',
      render: (payrollMonth) =>
        moment(payrollMonth, 'YYYYMM').format('MMMM YYYY'),
    },
    {
      title: 'Payslips',
      key: 'payslips',
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '20px',
          }}
        >
          <FaEye
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => handleView(record)}
            title="View Payslip"
          />
          <FaDownload
            style={{ cursor: 'pointer', color: '#52c41a' }}
            onClick={() => handleDownload(record)}
            title="Download Payslip"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="payslip-container">
      <ProCard title={'Payslips'} bordered>
        <ProFormDatePicker.Year
          name="dateYear"
          label="Year"
          fieldProps={{
            onChange: save,
            defaultValue: dayjs(),
          }}
        />
        <Table dataSource={data} columns={columns} pagination={false} bordered />
      </ProCard>

      <Modal
        open={modalVisible}
        onCancel={closeModal}
        width={'60%'}
        footer={false}
      >
        <Payslip empId={empId} payrollMonth={payrollMonth} />
      </Modal>

      {showPdfLink && empId && payrollMonth && (
        <div style={{ display: 'none' }}>
          <PDFDownloadLink
            document={<PayslipPDF employeePdfData={employeePdfData} earningsData={earningsData} deductionsData={deductionsData} totalEarnings={totalEarnings} totalDeductions={totalDeductions} netPayable={netPayable} wordAmount={wordAmount} />}
            fileName={`Payslip-${selectedData?.empCode}-${selectedData?.monthYear}.pdf`}
          >
            {/* {({ loading }) => (loading ? '' : '')} */}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default SelfServicePaySlip;