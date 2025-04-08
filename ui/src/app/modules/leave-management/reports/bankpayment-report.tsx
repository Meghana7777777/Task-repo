import React, { useState, useEffect } from "react";
import { Table, DatePicker,Row, Col,Card, Form, Button} from "antd";
import { EmployeeOnboardingService } from "@hrexpert/shared-services";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { AlertMessages, BankPaySharedDto } from "@hrexpert/shared-models";
import { CloseOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BankPaymentReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employeeData, setEmployeeData] = useState<any>();
  const [selectedBank, setSelectedBank] = useState(null);
  const [isEmployeePage, setIsEmployeePage] = useState(false);
  const [month, setMonth] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const service = new EmployeeOnboardingService()
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const result = await  service.getBankPaymentReport();
      const processedData = result.data.map(item => ({
        ...item,
        totalSalary: Number(item.totalSalary) || 0,
      }));
      setData(processedData);
      setFilteredData(processedData);
      calculateTotalAmount(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const  getFetchEmployeeData = (val?: any)  => {
  const req = new BankPaySharedDto(undefined,undefined,undefined,undefined,val?.bankName, undefined,undefined, undefined)
  service.getBankPaymentChildReport(req).then((res) => {
    if(res.status) {
      setEmployeeData(res.data);
      setSelectedBank(val.bankName);
      setIsEmployeePage(true);
      AlertMessages.getSuccessMessage(res.internalMessage);
    }
      else {
        AlertMessages.getErrorMessage(res.internalMessage)
     
     }
  })

}

  const calculateTotalAmount = (data) => {
    const total = data.reduce((acc, item) => acc + item.totalSalary, 0);
    setTotalAmount(total);
  };

  const handleMonthChange = (date) => {
    setMonth(date);
    applyFilters(date);
  };

  const applyFilters = (monthFilter) => {
    let filtered = data;

    if (monthFilter) {
      const monthStr = monthFilter.format("YYYY-MM");
      filtered = filtered.filter(item => item.date.startsWith(monthStr));
    }
    setFilteredData(filtered);
    calculateTotalAmount(filtered);
  };

  const exportToExcel = (data: any[], columns: any[], fileName: string) => {
    const validColumns = columns.filter((col): col is ColumnType<any> => !!col.dataIndex);
    const worksheetData = [
      columns.map((col) => col.title), 
      ...data.map((item, index) => 
        columns.map((col) => {
          if (col.key === 'sno') {
            return index + 1;
          }
          return col.dataIndex ? item[col.dataIndex] : ""; 
        })
      ),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleExportMainReport = () => {
    exportToExcel(filteredData, columns, "Bank_Payment_Report");
  };

  const handleExportChildReport = () => {
    if (!employeeData || !selectedBank) return;
    exportToExcel(
      employeeData,
      employeeColumns,
      `${selectedBank}_Bank_Employee_Data`
    );
  };
  


  const columns : ColumnsType<any> =  [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    { 
        title: "Bank Name", 
        dataIndex: "bankName", 
        key: "bankName" ,
        align: 'center',
        render: (text,record) => (
          <span 
          style={{
            color: "blue",
            cursor: "pointer",
          }}
          onClick={() => getFetchEmployeeData(record)}>
            {text}
          </span>
        ),
    },
    { 
        title: "Employee Account Count", 
        dataIndex: "totalCount", 
        key: "totalCount" ,
        align: 'center'
    },
    { 
        title: "Salaries Total", 
        dataIndex: "totalSalary", 
        key: "totalSalary" ,
        align: 'center',
        render: (text: any) => {
          const number = Number(text);
          return isNaN(number) ? '-' : `₹${number.toFixed(2)} `;
          
        },
    },
  ];

  const employeeColumns: ColumnsType<any> = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title : "Emp Code",
      dataIndex: "empCode",
      key: "empCode",
    },
    {    
      title: "Name Of Employee",
      dataIndex: "empName",
      key: "empName"
    },
    {    
      title: "Mobile No",
      dataIndex: "mobNo",
      key: "mobNo"
    },
    {    
      title: "Department",
      dataIndex: "deptName",
      key: "deptName"
    },
    {    
      title: "Salary",
      dataIndex: "salary",
      key: "salary"
    },
    {    
      title: "Account No",
      dataIndex: "bankAccNo",
      key: "bankAccNo"
    },
    {    
      title: "IFSC NO",
      dataIndex: "bankIfscNo",
      key: "bankIfscNo"
    }
  ]

return (
  <Card
    title={
      isEmployeePage ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
              type="primary"
              style={{
                backgroundColor: "white",
                color: "black",
                height: "30px",
                width:"60px",
                border: "2px solid black",
                fontWeight: "bold",
              }}
              onClick={() => setIsEmployeePage(false)}
            >
           <span style={{ fontSize: "20px", marginRight: "5px" }}>&larr;</span> Back  
          </Button>
        <span style={{ fontWeight: "bold" }}>{selectedBank} Bank</span>
        <Button type="primary" onClick={handleExportChildReport}>
          Download
        </Button>
      </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Bank Payment Report</span>
          <Button type="primary" onClick={handleExportMainReport}>
            Download
          </Button>
        </div>
      )
  }
>
    {isEmployeePage ? (
      <>
      {/* <div style={{ color:"gray",textAlign: "right", marginBottom: "10px" }}>
        <Button type="primary" onClick={handleExportChildReport}>
          Download
        </Button>
      </div> */}
        <Table
          dataSource={employeeData}
          columns={employeeColumns}
          rowKey="empCode"
          pagination={false}
        />
      </>
    ) : (
      <>
        <Form form={form} layout="vertical" onFinish={fetchReportData}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Select Month"
                name="month"
                rules={[
                  {
                    required: false,
                    message: "Please select a month!",
                  },
                ]}
              >
                <DatePicker
                  picker="month"
                  placeholder="Select Month"
                  onChange={handleMonthChange}
                  value={month}
                  style={{ width: "60%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={false}
          footer={() => (
            <div
            style={{
              display: "flex",
              justifyContent: "space-between", 
              fontWeight: "bold",
            }}
          >
            <div style={{ flex: 1 }} /> 
            <div style={{ flex: 1 }} />
      
            <div style={{ flex: 15, textAlign: "center" }}>Total Amount:</div>
      
            <div style={{ flex: 1, textAlign: "right" }}>₹{totalAmount.toFixed(2)}</div>
          </div>
          )}
        />
      </>
    )}
  </Card>
);
};

export default BankPaymentReport;