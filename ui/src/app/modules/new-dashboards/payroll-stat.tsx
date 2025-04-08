import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { CommonDashboardProps, DashboardReq, PayRollComparisontReq } from '@hrexpert/shared-models';
import { PayrollProcessedLogsService } from '@hrexpert/shared-services';

const { Title } = Typography;

const PayrollStatistics = (props: CommonDashboardProps) => {
  const [data, setData] = useState<any[]>([]);
   const service = new PayrollProcessedLogsService();

  useEffect(() => {
    getPayrollHeadCountReportData()
  }, []);

   const getPayrollHeadCountReportData = () => {
          const req = new DashboardReq(props.branchId, undefined, props.divisionId, props.departmentId, props.empTypeId, '202412')
          //const formValues = form.getFieldsValue();
          //if (formValues.payrollMonth) {
          // }
          //   if (formValues.branchId) {
          //       req.branchId = formValues.branchId
          //   }
          try {
              service.getPayrollHeadCountReportData(req).then((res) => {
                  if (res.status) {
                      //setEmpDatawithAddDel(res.data1)
                      const transformedData = Object.entries(res.data).flatMap(([_, item]: any) => [
                        { month: item.monthName, category: 'Gross', value: item.grossTotal },
                        { month: item.monthName, category: 'Net ', value: item.netSalary },
                        { month: item.monthName, category: 'CTC ', value: item.ctcTotal },
                      ]);
                      setData(transformedData);
                  }
                  else {
                      setData([])
                  }
              })
          } catch (err) {
              console.log(err);
          }
      }

  const chartConfig = {
    data: data,
    xField: 'month',
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
            Payroll Statistics <span style={{ fontSize: '12px' }}>last 2 months</span>
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

export default PayrollStatistics;
