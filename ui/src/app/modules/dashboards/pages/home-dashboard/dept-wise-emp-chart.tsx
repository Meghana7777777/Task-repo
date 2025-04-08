import { Pie } from "@ant-design/plots";
import { EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Card } from "antd";
import { useEffect, useState } from "react";

export default function DeptWiseEmployeePieChart() {
    const [data, setData] = useState<any[]>([]);

    const service = new EmployeeOnboardingService();

    useEffect(() => {
        getDeptWiseEmp();
    }, []);

    const getDeptWiseEmp = () => {
        service.getAllEmpAginstDepartment().then(res => {
            if (res.status) {
                setData(res.data);
            } else {
                setData([]);
            }
        });
    };

    const chartData = data.map(value => ({
        type: value.department,       
        value: Number(value.employeeCount),
    }));

    const config = {
        data: chartData,
        angleField: 'value',
        colorField: 'type',
        label: {
            type: 'outer',
            content: ({ type, value }: { type: string; value: number }) => `${type} ${value}`,
            // content: '{name} ({percentage})', // Show department name and percentage
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            position: 'right',
        },
    };

    return (
        <Card>
            <Pie {...config} />
        </Card>
    );
}
