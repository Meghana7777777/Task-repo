import { Column } from '@ant-design/plots';
import { PerformanceManagementShareService } from '@hrexpert/shared-services';
import { Card } from 'antd';
import { useEffect, useState } from 'react';

const PerformanceDashBoard = () => {
    const service = new PerformanceManagementShareService();
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        getStatusFromPeformance();
    }, []);

    const getStatusFromPeformance = async () => {
        try {
            const res = await service.getStatusFromPeformance();
            if (res.status && res.data) {
                const { statusCounts, totalEmployeeCount, openCount } = res.data;
                const statusMap = Object.fromEntries(
                    statusCounts.map(item => [item.status, Number(item.count)])
                );
                const transformed = [
                    { label: 'Total Employees', count: totalEmployeeCount },
                    { label: 'Open', count: openCount },
                    { label: 'Self Saved', count: statusMap['Employee Saved'] || 0 },
                    { label: 'Ready For RM Review', count: statusMap['Employee Confirmed'] || 0 },
                    { label: 'RM Saved', count: statusMap['RM Saved'] || 0 },
                    { label: 'RM Closed', count: statusMap['RM Confirmed'] || 0 },
                ];

                setChartData(transformed);
            } else {
                setChartData([]);
            }
        } catch (err) {
            console.log(err);
            setChartData([]);
        }
    };

    const config = {
        data: chartData,
        xField: 'label',
        yField: 'count',
        label: {
            position: 'top',
            style: {
                fill: '#000',
                fontWeight: 600,
            },
        },
        color: ({ label }) => {
            const colorMap = {
                'Open': '#f04864',
                'Employee Saved': '#1890ff',
                'Employee Confirmed': '#2db7f5',
                'RM Saved': '#ffb800',
                'RM Confirmed': '#52c41a',
                'Total Employees': '#595959'
            };
            return colorMap[label] || '#888';
        },
        height: 300,
    };

    return (
        <Card
            title="Performance Overview"
            bordered={false}
            style={{
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: '400px',
                overflow: 'hidden',
            }}
        >
            <Column {...config} />
        </Card>
    );
};

export default PerformanceDashBoard;
