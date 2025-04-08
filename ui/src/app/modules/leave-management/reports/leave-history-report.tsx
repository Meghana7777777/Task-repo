import React, { useEffect, useState } from 'react';
import { RedoOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import {
  DepartmentService,
  LeaveAllocationService,
} from '@hrexpert/shared-services';
import {Badge, Button,Card,Col,DatePicker,Form,message,Row,Select,Table,} from 'antd';
import moment from 'moment';
import { EmpDataReq } from '@hrexpert/shared-models';
import dayjs from 'dayjs';

const LeaveHistoryReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [empData, setEmpData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [mainData, setMainData] = useState<any[]>([]);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);
  const [form] = Form.useForm();
  const service = new LeaveAllocationService();
  const deptService = new DepartmentService();

  useEffect(() => {
    form.setFieldsValue({
      monthYear: undefined,
    });
    
    getLeaveHistoryReport();
    getDeptData();
    getAllActiveEmpDropDown();
  }, []);

  const getAllActiveEmpDropDown = async () => {
    const req = new EmpDataReq(undefined, form.getFieldValue('departmentId'),undefined,form.getFieldValue('monthYear'));
    const res = await service.getAllActiveEmpDropDown(req);
    setEmpData(res?.status ? res.data : []);
  };


  const getDeptData = async () => {
    const res = await deptService.getAllDepartments();
    setDeptData(res?.status ? res.data : []);
  };

  const getLeaveHistoryReport = async () => {
    try {
      const monthYear = form.getFieldValue('monthYear');
      const formattedMonthYear = monthYear ? dayjs(monthYear).format('YYYYMM') : undefined;
  
        const req = new EmpDataReq(form.getFieldValue('employeeId'), form.getFieldValue('departmentId'), undefined,formattedMonthYear);
      const response = await service.getLeaveHistoryReport(req);
      if (response.status) {
        if (response.data && response.data.length > 0) {
          setData(response.data);
          setFilteredData(response.data); 
          message.success('Data loaded successfully.', 2);
        } else {
          setData([]); 
          setFilteredData([]); 
          message.info('No data found for the selected filters.', 2);
        }
      } else {
        setData([]); 
        setFilteredData([]);
        message.error(response.internalMessage || 'Failed to fetch leave history report.', 2);
      }
    } catch (error) {
      setData([]); 
      setFilteredData([]); 
      console.error('Error fetching leave history report:', error); 
      message.error('Failed to load leave history report. Please try again.', 2);
    }
  };  const handleDeptChange = (value) => {
    getAllActiveEmpDropDown();
    setSelectedDepartment(value);
    form.setFieldValue('employeeId', undefined);
  };

  const onReset = () => {
    form.resetFields();
    getLeaveHistoryReport();
  };

  const handleEmpChange = (value) => {
    setSelectedEmployeeCode(value);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    { title: 'Employee Code', dataIndex: 'empCode', key: 'empCode' },
    { title: 'Employee Name', dataIndex: 'empName', key: 'empName' },
    { title: 'Department', dataIndex: 'deptName', key: 'deptName' },
    { title: 'Division', dataIndex: 'divName', key: 'divName' },
    { title: 'Branch', dataIndex: 'branchName', key: 'branchName' },
    { title: 'Entry Date', dataIndex: 'date', key: 'date',render: (date) => (date ? dayjs(date).format("YYYY-MM") : "N/A")},
    { title: 'Leave Allotted', dataIndex: 'leaveAlloted', key: 'leaveAlloted' },
    { title: 'Leave Used', dataIndex: 'leaveUsed', key: 'leaveUsed' },
    { title: 'Available Leaves', dataIndex: 'availableLeaves', key: 'availableLeaves'},
    { title: 'From Date', dataIndex: 'fromDate', key: 'fromDate' },
    { title: 'To Date', dataIndex: 'toDate', key: 'toDate' },
    { title: 'Leave Type', dataIndex: 'typeOfLeave', key: 'typeOfLeave' },
    { title: 'No. of Days', dataIndex: 'noOfDays', key: 'noOfDays' },
    { title: 'Day-To-Day', dataIndex: 'leaveDay', key: 'leaveDay' },
  ];

  return (
    <Card title="Leave History Report">
      <Form form={form} layout="vertical" onFinish={getLeaveHistoryReport} >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label={<span style={{ fontWeight: 'bold' }}>Departments</span>}
            name="departmentId"
          >
            <Select
              style={{ width: '250px' }}
              placeholder="Select Department"
              onChange={handleDeptChange}
              allowClear
            >
              {deptData.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
              label={<span style={{ fontWeight: 'bold' }}>Employees Names</span>}
              name="employeeId"
            >
              <Select
                showSearch
                style={{ width: '250px' }}
                placeholder="Select Employee"
                allowClear
                onChange={handleEmpChange}
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={empData.map((emp) => ({
                  label: emp.fullName,
                  value: emp.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            name="monthYear"
            label={<span style={{ fontWeight: 'bold' }}>Date</span>}
          >
            <DatePicker
              picker="month"
              // onChange={handleDateChange}
              format="YYYY-MM"
              allowClear
              style = {{width:'150px'}}
            />
          </Form.Item>
          </Col>
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              htmlType='submit'
              // onClick={onSearchClick}
              style={{ marginRight: '8px' }}
            >
              Search
            </Button>

            <Button icon={<RedoOutlined />} onClick={onReset} danger>
              Reset
            </Button>
          </div>
        </Row>
      </Form>
      <Table columns={columns} dataSource={filteredData} rowKey="empId" />
    </Card>
  );
};

export default LeaveHistoryReport;
