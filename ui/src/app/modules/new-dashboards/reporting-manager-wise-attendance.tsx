import React, { useEffect, useState } from 'react';
import { Card, Table, Spin, Empty, DatePicker, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { CommonDashboardProps, DashboardReq, ReportingManagerReq } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService } from '@hrexpert/shared-services';
import { useIAMClientState } from '../../common/iam-client-react';

const { Title } = Typography;

const ReportingManagerWiseAttn = (props: CommonDashboardProps) => {
  const [branchData, setBranchData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainData, setMainData] = useState<any[]>([]);
  
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const role = IAMClientAuthContext.user.roles;
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  const branchService = new BranchesService();
  const attnService = new AttendanceServices();

  const handleDateChange = (date: any, dateString: string) => {
    setSelectedDate(dateString);
  };

  const disabledFutureDates = (current: any) => {
    return current && current > dayjs().endOf('day');
  };

  useEffect(() => {
    fetchBranchData();
  }, [selectedDate, props.branchId, props.departmentId, props.divisionId, props.empTypeId]);

  const fetchBranchData = async () => {
    try {
      const reportingManagerId = IAMClientAuthContext.user.employeeId
     
      //const req = new DashboardReq(props.branchId, selectedDate, props.divisionId, props.departmentId, Number(reportingManagerId));
      const req = new ReportingManagerReq();
      req.reportingManagerId = reportingManagerId
      req.date = selectedDate
      setLoading(true);
      const [branchRes, attendanceRes] = await Promise.all([
        branchService.getActiveBranches(),
        attnService.getAllReportingManagerWiseAttnReport(req),
      ]);
      setBranchData(branchRes.status ? branchRes.data : []);
      setMainData(attendanceRes.status ? attendanceRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBranchData([]);
      setMainData([]);
    } finally {
      setLoading(false);
    }
  };

  const columnsData: ColumnsType<any> = [
    {
      title: <div style={{ textAlign: 'center' }}>S.No</div>,
      dataIndex: 'sno',
      render: (_: any, __: any, index: number) => index + 1,
      align: 'center',
      width: 50,
    },
    {
      title: 'Reporting Manager Name',
      dataIndex: 'reportingManagerName',
      key: 'reportingManagerName',
      render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      width: 300,
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      width: 300,
    },
    {
      title: 'Absent Count',
      dataIndex: 'absentCount',
      key: 'absentCount',
      render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      width: 150,
    },
    {
      title: 'Present Count',
      dataIndex: 'presentCount',
      key: 'presentCount',
      render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      width: 150,
    },
    {
      title: 'Leave Count',
      dataIndex: 'leaveCount',
      key: 'leaveCount',
      render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      width: 150,
    },
  ];

  const expandedRowRender = (record: any) => {
    const empColumns: ColumnsType<any> = [
      {
        title: 'Employee Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      },
      {
        title: 'Attendance Date',
        dataIndex: 'attendanceDate',
        key: 'attendanceDate',
        render: (text: string) => <div style={{ textAlign: 'center' }}>{text || '-'}</div>,
      },
      {
        title: 'Attendance Status',
        dataIndex: 'attendanceStatus',
        key: 'attendanceStatus',
        render: (text: string) => <div style={{ textAlign: 'center' }}>{text || '-'}</div>,
      },
      {
        title: 'Leave Status',
        dataIndex: 'leaveStatus',
        key: 'leaveStatus',
        render: (text: string) => (
          <div style={{ textAlign: 'center' }}>
            {text !== 'A' ? text : '-'}
          </div>
        ),
      },
      
    ];

    return (
      <Table
        bordered
        columns={empColumns}
        dataSource={record.employees.map((employee: any, index: number) => ({
          ...employee,
          key: index,
        }))}
        pagination={false}
      />
    );
  };

  return (
    <Card
      bordered={false}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            {`RM-Wise Attendance on ${dayjs(selectedDate).format('D MMM')}`}
          </Title>
          <DatePicker
            defaultValue={dayjs()}
            format="YYYY-MM-DD"
            onChange={handleDateChange}
            allowClear={false}
            disabledDate={disabledFutureDates}
          />
        </div>
      }
    >
      {loading ? (
        <Spin tip="Loading data..." style={{ display: 'block', margin: '50px auto' }} />
      ) : mainData.length > 0 ? (
        <Table
          columns={columnsData}
          dataSource={mainData.map((item: any, index: number) => ({
            ...item,
            key: index,
          }))}
          expandable={{ expandedRowRender }}
          pagination={false}
          bordered
          style={{ fontSize: '14px' }}
        />
      ) : (
        <Empty description="No data available" />
      )}
    </Card>
  );
};

export default ReportingManagerWiseAttn;
