import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

interface AttendanceStatisticCardProps {
    icon: any;
    iconColor: string;
    bgColor: string;
    label: string;
    count: number | string;
    countColor: string;
}

const AttendanceStatisticCard: React.FC<AttendanceStatisticCardProps> = ({ icon, iconColor, bgColor, label, count, countColor }) => {
    return (
        <Card
            styles={{body:{ padding: '20px 24px'}}}
            style={{
                textAlign: 'center',
                borderRadius: 8,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div
                style={{
                    fontSize: 30,
                    color: iconColor,
                    backgroundColor: bgColor,
                    padding: 10,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </div>
            <Text
                style={{
                    display: 'block',
                    marginTop: 16,
                    fontSize: '1em',
                    color: '#8C8C8C',
                }}
            >
                {label}
            </Text>
            <Text
                style={{
                    fontSize: 26,
                    color: countColor,
                }}
            >
                {count}
            </Text>
        </Card>
    );
};

export default AttendanceStatisticCard;
