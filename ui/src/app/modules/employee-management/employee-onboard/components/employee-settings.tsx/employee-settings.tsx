import { Card, Col, Form, Row, Tabs, TabsProps } from 'antd'
import React from 'react'
import PrefixConfigurationForm from '../prefix-configuration-from/prefix-configuration-form'

export default function EmployeeSettings() {
    const [employeeSettingsForm] = Form.useForm()
    const items: TabsProps['items'] = [
        // {
        //     key: '1',
        //     label: 'Fields configuration',
        //     children: 'Yet to develop',
        // },
        {
            key: '2',
            label: 'Prefix configuration',
            children: <PrefixConfigurationForm />,
        },

    ];

    const onChange = (key: string) => {
        console.log(key);
    };
    return (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    )
}
