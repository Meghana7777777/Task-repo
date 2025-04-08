import { BranchReq, ComponentTypeEnum, DashboardReq, EmailRequest, PayrollProcessedLogReq } from '@hrexpert/shared-models';
import { BranchesService, configVariables, EmailSendingService, EmployeeOnboardingService, EmployeeTypeService, PayrollProcessedLogsService } from '@hrexpert/shared-services';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { amountToWords } from 'amount-to-words';
import { Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import PayslipPDF from './payslip-pdf';
import Payslip from './payslip-template';
import { useIAMClientState } from '../../../common/iam-client-react';
import { useForm } from 'antd/es/form/Form';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

const PayslipGeneration = () => {
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
  const [employeeTypes, setEmployeeTypes] = useState([])
  const empTypeService = new EmployeeTypeService()
  const [employeePdfData, setEmployeePdfData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState([]);
  const [deductionsData, setDeductionsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState<string>('₹0.00');
  const [totalDeductions, setTotalDeductions] = useState<string>('₹0.00');
  const [netPayable, setNetPayable] = useState<string>('₹0.00');
  const [wordAmount, setWordAmount] = useState(String);
  const [form] = useForm()
  const branchService = new BranchesService()
  const [branches, setBranches] = useState<any[]>([])
  const empService = new EmployeeOnboardingService()
  const [division, setDivision] = useState<any[]>([])
  const [department, setDepartment] = useState<any[]>([])
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const unitId = Number(IAMClientAuthContext.user.unitId);
  const role = IAMClientAuthContext.user.roles
  const Option = Select
  const employeeDetails = new EmployeeOnboardingService()
  const [employees, setEmployees] = useState<any>([]);
  const currentUrl: string = window.location.href;
  const params = currentUrl ? currentUrl.split('?')[1] : null
  const [employeeId, branchId] = params ? params.split('-').map(Number) : [null, null]
  const docUrl = configVariables.IMAGE_UPLOAD_URL

  useEffect(() => {
    getBranches()
    getDivision()
    getDepartment()
    getEmployeeTypes()
    if (IAMClientAuthContext.user.roles === "SuperAdmin") {
      form.setFieldsValue({ branches: "ALL" })
      handleBranchChange(null)
    } else {
      form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
      handleBranchChange(IAMClientAuthContext.user.unitId)
    }
    if (employeeId && branchId) {
      getSelectedEmployeeData()
    }
  }, [IAMClientAuthContext.user.unitId, employeePdfData, earningsData, deductionsData, totalEarnings, totalDeductions, netPayable, wordAmount])

  const getSelectedEmployeeData = async () => {
    const req = new PayrollProcessedLogReq();
    try {
      service.getPayrollMonth(req).then((res) => {
        if (res.status) {
          setEmployeeData(res.data.filter((res) => res.empId === Number(employeeId)));
          form.setFieldsValue({ employeeId: res.data.find((res) => res.empId === Number(employeeId)).empId })
          form.setFieldsValue({ branches: res.data.find((res) => res.branchId === Number(branchId)).branchId })
        } else {
          message.error('Failed to fetch employee data');
        }
      })
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };


  const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters);
              setSearchedColumn(dataIndex);
              confirm({ closeDropdown: true });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
        : false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  /**
   *
   * @param selectedKeys
   * @param confirm
   * @param dataIndex
   */
  function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters: any) {
    clearFilters();
    setSearchText("");
  }

  const getBranches = () => {
    branchService.getActiveBranches().then((res) => {
      if (res.status) {
        setBranches(res.data)
      } else {
        setBranches([])
      }
    }).catch((error) => {
      message.error('An error occurred while fetching data', 2);
      console.error('Error:', error);
    });
  }

  const getDivision = (branchId?: number) => {
    const req = new DashboardReq(branchId)
    empService.getDivisionByBranchId(req).then((res) => {
      if (res.status) {
        setDivision(res.data)
      } else {
        setDivision([])
      }
    }).catch((error) => {
      message.error('An error occurred while fetching data', 2);
      console.error('Error:', error);
    });
  }

  const getDepartment = (branchId?: number) => {
    const req = new DashboardReq(branchId)
    empService.getDepartmentByBranchId(req).then((res) => {
      if (res.status) {
        setDepartment(res.data)
      } else {
        setDepartment([])
      }
    }).catch((error) => {
      message.error('An error occurred while fetching data', 2);
      console.error('Error:', error);
    });
  }

  const getEmployeeTypes = async () => {
    const res = await empTypeService.getActiveEmployeeType()
    setEmployeeTypes(res.data)
  }

  const getData = async () => {
    await form.validateFields();

    const req = new PayrollProcessedLogReq();
    req.payrollMonth = Number(selectedYear)
    if (form.getFieldValue('branches') === 'ALL') {
      req.branchId = null
    } else {
      req.branchId = form.getFieldValue('branches')
    }
    req.employeeId = form.getFieldValue('employeeId')
    req.departmentId = form.getFieldValue('departmentId')
    req.divisionId = form.getFieldValue('divisionId')

    await service.getPayrollMonth(req).then((res) => {
      if (res.status) {
        setEmployeeData(res.data);
        message.success(res.internalMessage, 2);
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
          const req = new PayrollProcessedLogReq();
          req.payrollMonth = row.payrollMonth;
          req.employeeId = row.empId;
    
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
    
          const pdfPromise = new Promise<Blob>((resolve, reject) => {
            try {
              const pdfDoc = (
                <PayslipPDF
                  employeePdfData={res.data}
                  earningsData={earnings}
                  deductionsData={deductions}
                  totalEarnings={formatCurrency(totalEarningsValue)}
                  totalDeductions={formatCurrency(totalDeductionsValue)}
                  netPayable={formatCurrency(netPayableValue)}
                  wordAmount={numberInWords}
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

          const empCode = res.data[0]?.empCode ?? "Unknown";
          const payrollMonth = res.data[0]?.payrollMonth ?? "Unknown";
    
          const attachment = await uploadPDFAndGetPath(blob, empCode, payrollMonth);
    
          const req2 = new EmailRequest();
          req2.to = [res.data[0]?.emailId];
          req2.subject = `${res.data[0]?.monthYear} Payslip`;
          req2.body = `
            Hi ${res.data[0]?.empName},
            <br/>
            <br/>
            Please find the payslip attached for the month of ${res.data[0]?.monthYear}.
          `;
          req2.attachments = [attachment];
    
          const response = axios.post("https://alerts.schemaxtech.in/email/send", req2, {
            headers: {
                "Content-Type": "application/json",
            },
        });
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

      //const res = await emailService.sendEmail(req);
      const response = axios.post("https://alerts.schemaxtech.in/email/send", req, {
        headers: {
            "Content-Type": "application/json",
        },
    });
      // message[response.status ? "success" : "error"](
      //   `${employeePdfData[0]?.empName}: ${response.internalMessage}`,
      //   2
      // );
    } catch (error) {
      console.error("Error in email sending process:", error);
      message.error("An error occurred while sending emails", 2);
    }
  };

  

  const columns = [
    {
      title: 'SNo',
      dataIndex: 'key',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Employee Code', dataIndex: 'empCode',
      ...getColumnSearchProps("empCode", 'Employee Code'),
    },
    {
      title: 'Employee Name', dataIndex: 'empName',
      ...getColumnSearchProps("empName", 'Employee Name'),
    },
    {
      title: 'Email', dataIndex: 'emailId', render(text): string { return text ?? '-'; },
      ...getColumnSearchProps("emailId", 'Email'),
    },
    {
      title: 'Designation', dataIndex: 'designation',
      ...getColumnSearchProps("designation", 'Designation'),
    },
    {
      title: 'Department', dataIndex: 'department',
      ...getColumnSearchProps("department", 'Department'),
    },
    {
      title: 'Branch', dataIndex: 'branchName',
      ...getColumnSearchProps("branchName", 'Branch'),
    },
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
    setSelectedYear(formattedYearMonth);
    if (date === null) {
      setEmployeeData([]);
      setSelectedRows([]);
    } else {
      setSelectedRows([]);
    }
  };

  const handleBranchChange = (branchId: any) => {
    if (branchId === "ALL") {
      form.setFieldsValue({ branches: null });
    } else if (branchId === null) {
      form.setFieldsValue({ branches: "ALL" });
    } else if (branchId === '') {
      form.setFieldsValue({ branches: "ALL" });
    } else {
      form.setFieldsValue({ branches: branchId });
    }
    const branchRequest = new BranchReq(branchId);
    employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
      if (res.status) {
        setEmployees(res.data);
      } else {
        setEmployees('No Data Found');
      }
    });
  };

  const reset = () => {
    setEmployeeData([]);
    setSelectedRows([]);
    form.resetFields()
  }

  return (
    <Card title="Employee Payslips" bordered>
      <Form layout='vertical' form={form}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item label="Branch" name="branches" initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'ALL' : Number(IAMClientAuthContext.user.unitId)}
              rules={[{ required: true, message: 'Please select a branch' }]}
            >
              <Select showSearch
                disabled={role === 'SuperAdmin' ? false : true}
                allowClear
                placeholder="Select Branch"
                optionFilterProp="children"
                onChange={(value) => handleBranchChange(value)}>
                <Option value={'ALL'}> ALL </Option>
                {branches.map((rec: any) => (
                  <Option value={rec.id} key={rec.id}>
                    {rec.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={4} lg={6} md={12} sm={24} xs={24}>
            <Form.Item label="Month" name={'year'} rules={[{ required: true, message: 'Please select a month' }]}>
              <DatePicker.MonthPicker
                onChange={(date) => onDateChange(date)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xl={3} lg={6} md={12} sm={24} xs={24}>
            <Form.Item label="Division" name={'divisionId'}>
              <Select placeholder={'Select Division'} allowClear>
                {division.map((branch) => (
                  <Select.Option key={branch.id} value={branch.id}>
                    {branch.divisionName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={3} lg={6} md={12} sm={24} xs={24}>
            <Form.Item label='Employee Type' name='employeeTypeId'>
              <Select placeholder='Select Employee Type' allowClear showSearch
                optionFilterProp="children"
              >
                {employeeTypes?.map((rec: any) => {
                  return <Option value={rec.id} key={rec.id}>{rec.name}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item label='Employee Name' name='employeeId'>
              <Select showSearch allowClear
                optionFilterProp="children" placeholder="Select Employee Name"  >
                {employees.map((rec: any) => (
                  <Option value={rec.employeeId} key={rec.employeeId}>
                    {rec.employeeCode} {rec.employeeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={3} lg={6} md={12} sm={24} xs={24}>
            <Form.Item label="Department" name={'departmentId'}>
              <Select placeholder={'Select Department'} allowClear>
                {department.map((branch) => (
                  <Select.Option key={branch.id} value={branch.id}>
                    {branch.departmentName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ marginTop: '23px' }}>
            <Button
              type="primary"
              onClick={getData}
              htmlType='submit'
              variant="outlined" color="primary"
            >
              Submit
            </Button>
          </Col>
          <Col style={{ marginTop: '23px' }}>
            <Form.Item>
              <Button htmlType="reset" danger onClick={reset}>
                Reset
              </Button>
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
          onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRows(selectedRows);
            setSelectedEmpIds(selectedRows.map((row) => row.empId));
          },
        }}
        dataSource={employeeData}
        columns={columns}
        pagination={false}
        bordered
        rowKey="empId"
        scroll={{ x: 'max-content' }}
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

export default PayslipGeneration;