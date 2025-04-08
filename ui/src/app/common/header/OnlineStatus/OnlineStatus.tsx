import React, { useState, useEffect } from 'react';
import { Badge, Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, CloudFilled, DashboardFilled, SignalFilled } from '@ant-design/icons';
import { AlertMessages } from '../../notifications';

export const OnlineStatus = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnlineStatus = () => {
            if (navigator.onLine) {
                AlertMessages.getCustomMessage('success','You are online');
            } else {
                AlertMessages.getCustomMessage('warning','You are offline');
            }
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    return (
        <>
            {/* <Badge.Ribbon text={isOnline ? 'Online' : 'Offline'} color={isOnline ? 'green' : 'red'}>
                {children}
            </Badge.Ribbon> */}
            <Tooltip placement="topRight" title={isOnline ? 'Online' : 'Offline'}>
                <Badge count={<CloudFilled style={{ color: isOnline ? '#4bf14b' : 'red' }} />}>
                    {children}
                </Badge>
            </Tooltip>
            {/* 
            <Tag color={isOnline ? 'green' : 'red'}>
                {isOnline ? 'Online' : 'Offline'}
            </Tag> */}
        </>
    );
};

export default OnlineStatus;
