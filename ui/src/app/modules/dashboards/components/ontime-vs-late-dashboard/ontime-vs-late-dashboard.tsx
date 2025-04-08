import React from 'react'
import { Column } from '@ant-design/plots';
import { Card } from 'antd';

export default function OnTimeVsLateDashboard() {

    const transformedData = [
        { date: '01-10-2024', type: 'Present', count: 200 },
        { date: '01-10-2024', type: 'Absent', count: 20 },

        { date: '02-10-2024', type: 'Present', count: 180 },
        { date: '02-10-2024', type: 'Absent', count: 40 },

        { date: '04-10-2024', type: 'Present', count: 210 },
        { date: '04-10-2024', type: 'Absent', count: 10 },

        { date: '05-10-2024', type: 'Present', count: 190 },
        { date: '05-10-2024', type: 'Absent', count: 30 },

        { date: '06-10-2024', type: 'Present', count: 220 },
        { date: '06-10-2024', type: 'Absent', count: 15 },

        { date: '07-10-2024', type: 'Present', count: 205 },
        { date: '07-10-2024', type: 'Absent', count: 25 },

        { date: '08-10-2024', type: 'Present', count: 230 },
        { date: '08-10-2024', type: 'Absent', count: 5 },

        { date: '09-10-2024', type: 'Present', count: 215 },
        { date: '09-10-2024', type: 'Absent', count: 15 },

        { date: '10-10-2024', type: 'Present', count: 210 },
        { date: '10-10-2024', type: 'Absent', count: 20 },

        { date: '11-10-2024', type: 'Present', count: 200 },
        { date: '11-10-2024', type: 'Absent', count: 30 },

        { date: '12-10-2024', type: 'Present', count: 195 },
        { date: '12-10-2024', type: 'Absent', count: 25 },
    ];



    const config = {
        data: transformedData,
        xField: 'date',
        yField: 'count',
        seriesField: 'type', // Differentiate between 'Present' and 'Absent'
        isStack: true, // Enable stacked chart
        label: {
            position: 'middle', // Position of the label
            style: {
                fill: '#fff',
                fontWeight: 600,
            },
        },
        tooltip: {
            title: 'Date',
            formatter: (datum:any) => ({
                name: datum.type,
                value: datum.count,
            }),
        },
        colorField: 'type',
        color: [ '#F44336','#4CAF50'], // Green for Present, Red for Absent
        style: {
            radiusTopLeft: 10,
            radiusTopRight: 10,
        },
    };

    return (
        <Card>
            <Column {...config} />
        </Card>
    )
}
