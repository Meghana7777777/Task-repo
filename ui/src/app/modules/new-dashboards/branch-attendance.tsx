import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';
import { AttendanceServices, BranchesService } from '@hrexpert/shared-services';
import { Card, Table, Spin, Empty, DatePicker, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
const { Title } = Typography;

const BranchAttendance = (props: CommonDashboardProps) => {
  const [branchData, setBranchData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [mainData, setMainData] = useState<any[]>([]);
  const branchService = new BranchesService();
  const attnService = new AttendanceServices();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  
  const handleDateChange = (date: any, dateString: string) => {
    setSelectedDate(dateString);
  };

  const disabledFutureDates = (current) => {
    return current && current > dayjs().endOf('day');
  };


  useEffect(() => {
    fetchBranchData();
  }, [selectedDate,props.branchId,props.departmentId,props.divisionId,props.empTypeId]);

  const fetchBranchData = async () => {
    try {
      const req = new DashboardReq(props.branchId,selectedDate,props.divisionId,props.departmentId,props.empTypeId);
      setLoading(true);
      const [branchRes, attendanceRes] = await Promise.all([
        branchService.getActiveBranches(),
        attnService.getBranchWiseAttendance(req),
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

  const columnsData: any = [
    {
      title: <div style={{ textAlign: 'center' }}>S.No</div>,
      dataIndex: 'sno',
      render: (_: any, __: any, index: number) => index + 1,
      align: 'center',
      width: 50
    },
    {
      title: 'Branch',
      dataIndex: 'branches',
      key: 'branches',
      render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
      width: 300
    },
    {
      title: 'Head Count',
      dataIndex: 'totalCount',
      key: 'totalCount',
      align: 'center',
      render: (count: number) => count || '-',
    },
    {
      title: 'Present',
      children: [
        {
          title: 'Count',
          dataIndex: 'presentCount',
          key: 'presentCount',
          align: 'center',
          render: (count: number) => count || '-',
        },
        {
          title: 'Percentage',
          dataIndex: 'presentPercentage',
          key: 'presentPercentage',
          align: 'center',
          render: (percentage: number) => `${percentage}%` || '-',
        },
      ],
    },
    {
      title: 'Leave',
      children: [
        {
          title: 'Count',
          dataIndex: 'leaveCount',
          key: 'leaveCount',
          align: 'center',
          render: (count: number) => count || '-',
        },
        {
          title: 'Percentage',
          dataIndex: 'leavePercentage',
          key: 'leavePercentage',
          align: 'center',
          render: (percentage: number) => `${percentage}%` || '-',
        },
      ],
    },
    {
      title: 'Absent',
      children: [
        {
          title: 'Count',
          dataIndex: 'absentCount',
          key: 'absentCount',
          align: 'center',
          render: (count: number) => count || '-',
        },
        {
          title: 'Percentage',
          dataIndex: 'absentPercentage',
          key: 'absentPercentage',
          align: 'center',
          render: (percentage: number) => `${percentage}%` || '-',
        },
      ],
    },
  ];

    const expandedRowRender = (record) => {
      const empTypeColData: any = [
        {
          title: '',
          dataIndex: '',
          width: 50
        },
        {
          title: 'Employee Type',
          dataIndex: 'empTypeName',
          key: 'empTypeName',
          render: (text: string) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{text || '-'}</div>,
          width: 300
        },
        {
          title: 'Head Count',
          dataIndex: 'totalCount',
          key: 'totalCount',
          align: 'center',
          render: (count: number) => count || '-',
        },
        {
          title: 'Present',
          children: [
            {
              title: 'Count',
              dataIndex: 'presentCount',
              key: 'presentCount',
              align: 'center',
              render: (count: number) => count || '-',
            },
            {
              title: 'Percentage',
              dataIndex: 'presentPercentage',
              key: 'presentPercentage',
              align: 'center',
              render: (percentage: number) => `${percentage}%` || '-',
            },
          ],
        },
        {
          title: 'Leave',
          children: [
            {
              title: 'Count',
              dataIndex: 'leaveCount',
              key: 'leaveCount',
              align: 'center',
              render: (count: number) => count || '-',
            },
            {
              title: 'Percentage',
              dataIndex: 'leavePercentage',
              key: 'leavePercentage',
              align: 'center',
              render: (percentage: number) => `${percentage}%` || '-',
            },
          ],
        },
        {
          title: 'Absent',
          children: [
            {
              title: 'Count',
              dataIndex: 'absentCount',
              key: 'absentCount',
              align: 'center',
              render: (count: number) => count || '-',
            },
            {
              title: 'Percentage',
              dataIndex: 'absentPercentage',
              key: 'absentPercentage',
              align: 'center',
              render: (percentage: number) => `${percentage}%` || '-',
            },
          ],
        },
      ];
  
      return (
        <Table
          bordered
          columns={empTypeColData}
          dataSource={record.empTypeData.map((empTypeData, index) => ({
            ...empTypeData,
            key: index,
          }))}
          pagination={false}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    lineHeight: '16px',
                    background: '#f5f5f5',
                  }}
                />
              ),
            },
          }}
        />
      );
    };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={4} style={{ margin: 0 }}>{`BranchWise Attendance on ${dayjs(selectedDate).format('D MMM')}`}</Title>
          {/* <span>{`Attendance on ${dayjs(selectedDate).format('D MMM')}`}</span> */}
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
          dataSource={mainData.map((item, index) => ({
            ...item,
            key: index,
          }))}
          expandable={{ expandedRowRender }}
          pagination={false}
          bordered
          scroll={{ y: 300 }}
          rowKey="branches"
          style={{ fontSize: '14px' }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    lineHeight: '16px',
                    background: '#f5f5f5',
                  }}
                />
              ),
            },
          }}
        />
      ) : (
        <Empty description="No data available" />
      )}
    </Card>
  );
};

export default BranchAttendance;
