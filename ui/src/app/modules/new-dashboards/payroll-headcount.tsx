import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { Card } from 'antd';
import { EmployeeOnboardingService, PayrollProcessedLogsService } from '@hrexpert/shared-services';
import { CommonDashboardProps, DashboardReq, PayRollComparisontReq } from '@hrexpert/shared-models';
import { AlertMessages } from '../../common/notifications';

const PayrollHeadcount = (props: CommonDashboardProps) => {
    const service = new PayrollProcessedLogsService();
    const [data, setData] = useState([]);

    useEffect(() => {
        getPayrollHeadCountReportData();
    }, [props.branchId, props.departmentId, props.divisionId, props.empTypeId]);

    const getPayrollHeadCountReportData = () => {
        const req = new DashboardReq(props.branchId, undefined, props.divisionId, props.departmentId, props.empTypeId, '202412')
        //const formValues = form.getFieldsValue();
        //if (formValues.payrollMonth) {
        // req.payrollMonth = '202412'
        // }
        //   if (formValues.branchId) {
        //       req.branchId = formValues.branchId
        //   }
        try {
            service.getPayrollHeadCountReportData(req).then((res) => {
                if (res.status) {
                    setData(res.data)
                    const transformedData = Object.entries(res.data).map(([key, value]: any) => ({
                        month: value.monthName,
                        headCount: value.headCount,
                    }));
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

    const defaultData = [
        { month: 'January', headCount: 0 },
        { month: 'February', headCount: 0 },
        { month: 'March', headCount: 0 },
        { month: 'April', headCount: 0 },
        { month: 'May', headCount: 0 },
        { month: 'June', headCount: 0 },
        { month: 'June', headCount: 0 },
        { month: 'June', headCount: 0 },
        { month: 'June', headCount: 0 },
        { month: 'June', headCount: 0 },
        { month: 'June', headCount: 0 },
        { month: 'June', headCount: 0 },
    ];

    const config = {
        data: data.length > 0 ? data : defaultData,
        xField: 'month',
        yField: 'headCount',
        color: '#1890ff',
        label: {
            position: 'middle',
            style: {
                fill: '#fff',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoRotate: true,
                formatter: (text) => text.slice(0, 3),
            },
        },
        yAxis: {
            label: {
                formatter: (value) => `${value}`,
            },
        },
        height: 300,
    };

    return (
        <Card
            title={
                <>
                    Payroll Head Count<span style={{ fontSize: '12px' }}> last 2 months</span>
                </>
            }
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

export default PayrollHeadcount;
