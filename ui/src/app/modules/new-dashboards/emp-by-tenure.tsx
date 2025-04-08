import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { Card } from 'antd';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';


const EmployeeTenureGenderChart = (props: CommonDashboardProps) => {

    const empService = new EmployeeOnboardingService();
    const [data, setData] = useState([]);

    useEffect(() => {
        getEmpTenureByGender();
    }, [props.branchId,props.departmentId,props.divisionId,props.empTypeId]);

    const getEmpTenureByGender = () => {
        const req = new DashboardReq(props.branchId, undefined, props.divisionId, props.departmentId, props.empTypeId);
        empService.getEmpTenureByGender(req).then((res) => {
            if (res.status) {
                setData(res.data);
            } else {
                setData([]);
            }
        });
    };

    const transformedData = data.flatMap(item => [
        {
            tenure: item.tenure,
            gender: 'Male',
            count: Number(item.male),
            color: '#1890ff'
        },
        {
            tenure: item.tenure,
            gender: 'Female',
            count: Number(item.female),
            color: '#f04864'
        },
        {
            tenure: item.tenure,
            gender: 'Others',
            count: Number(item.others),
            color: '#2db7f5'
        }
    ]);

    const config = {
        data: transformedData,
        xField: 'tenure',
        yField: 'count',
        colorField: 'gender',
        color: ['#1890ff', '#f04864', '#2db7f5'],
        label: {
            position: 'middle',
            style: {
                fill: '#fff',
                fontWeight: 600,
            },
            formatter: (datum) => datum.count.toString(),
        },
        tooltip: {
            title: 'Tenure & Gender',
            formatter: (datum) => ({
                name: datum.gender,
                value: `${datum.count} employees`,
            }),
        },
        interactions: [
            {
                type: 'element-highlight-by-color',
            },
            {
                type: 'tooltip',
            },
        ],
        stack: true,
        height: 300,
    };

    return (
        <Card
            title="Employee Tenure by Gender"
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

export default EmployeeTenureGenderChart;
