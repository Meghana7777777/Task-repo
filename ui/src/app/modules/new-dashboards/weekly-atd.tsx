import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { AttendanceServices } from '@hrexpert/shared-services';
import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';

const { Title } = Typography;

const WeeklyAttendance = (props: CommonDashboardProps) => {
  const attdService = new AttendanceServices();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    weeklyAttendance();
  }, [props.branchId, props.divisionId, props.departmentId,props.empTypeId]);

  const weeklyAttendance = async () => {
    try {
      const req = new DashboardReq(props.branchId,undefined,props.divisionId, props.departmentId, props.empTypeId)
      const res = await attdService.weeklyAttendance(req);
      if (res.status) {
        const transformedData = res.data.flatMap((item: any) => [
          { date: item.formattedDate, category: 'Absent', value: Number(item.absentCount) },
          { date: item.formattedDate, category: 'Present', value: Number(item.presentCount) },
          { date: item.formattedDate, category: 'Leave', value: Number(item.leaveCount) },
        ]);
        console.log('Transformed data:', transformedData);
        setData(transformedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching weekly attendance data:', error);
      setData([]);
    }
  };
  

  const chartConfig = {
    data: data,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    colorField: 'category',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 500,
      },
    },
    height: 300,
  };

  return (
    <Card
    style={{
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: '350px',
      overflow: 'hidden',
    }}
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LineChartOutlined style={{ fontSize: 20, marginRight: 8 }} />
          <Title level={4} style={{ margin: 0 }}>
            Weekly Attendance <span style={{ fontSize: '12px' }}>last 7 days</span>
          </Title>
        </div>
      }
      bordered
    >
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>No data available</div>
      ) : (
        <Line {...chartConfig} />
      )}
    </Card>
  );
};

export default WeeklyAttendance;
