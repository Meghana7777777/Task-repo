import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { Card } from 'antd';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';


const EmployeeGenderAgeChart = (props:CommonDashboardProps) => {
  const empService = new EmployeeOnboardingService();
  const [data, setData] = useState([]);

  useEffect(() => {
    getEmpGenderAge();
  }, [props.branchId,props.departmentId,props.divisionId,props.empTypeId]);

  const getEmpGenderAge = () => {
    const req =  new DashboardReq(props.branchId,undefined,props.divisionId,props.departmentId, props.empTypeId)
    empService.getEmpGenderAge(req).then((res) => {
      if (res.status) {
        setData(res.data);
      } else {
        setData([]);
      }
    });
  };

  const defaultData = [
    { ageGroup: '18-25', gender: 'M', count: 0 },
    { ageGroup: '18-25', gender: 'F', count: 0 },
    { ageGroup: '26-35', gender: 'M', count: 0 },
    { ageGroup: '26-35', gender: 'F', count: 0 },
    { ageGroup: '36-45', gender: 'M', count: 0 },
    { ageGroup: '36-45', gender: 'F', count: 0 },
    { ageGroup: '46-55', gender: 'M', count: 0 },
    { ageGroup: '46-55', gender: 'F', count: 0 },
    { ageGroup: '55+', gender: 'M', count: 0 },
    { ageGroup: '55+', gender: 'F', count: 0 },
  ];

  const genderColors = {
    M: '#1890ff',
    F: '#f759ab',
    Other: '#52c41a',
  };

  const config = {
    data: data.length > 0 ? data : defaultData,
    xField: 'ageGroup',
    yField: 'count',
    colorField: 'gender',
    group: true,
    yAxis: {
      type: 'log',
      label: {
        formatter: (value) => `${value}`,
      },
    },
    height: 300,
  };
  

  return (
    <Card
      title="Employee by Gender and Age"
      bordered={false}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '350px',
        overflow: 'hidden',
      }}
    >
      <Column {...config} />
    </Card>
  );
};

export default EmployeeGenderAgeChart;

