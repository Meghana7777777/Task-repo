import React, { useEffect } from 'react';
import { Button, Modal, Typography } from 'antd';
import Icon, { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

export enum SweatAlertTypeEnum {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error"
}
export interface SweatAlertProps {
    type: SweatAlertTypeEnum;
    message: string;
    onClose: () => void;
    duration?: number;
}

export const SweatAlert = (props: SweatAlertProps) => {
    const { type, message, duration = 3000, onClose } = props;

    
    useEffect(() => {
        let timer;
        if (duration) {
            timer = setTimeout(() => {
                onClose();
            }, duration);
        }
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const iconMap = {
        error: <ExclamationCircleOutlined style={{ color: 'red' }} className="confirmation-popup-icon" />,
        success: <CheckCircleOutlined style={{ color: 'green' }} className="confirmation-popup-icon" />,
        warning: <WarningOutlined style={{ color: 'orange' }} className="confirmation-popup-icon" />,
        info: <InfoCircleOutlined style={{ color: 'blue' }} className="confirmation-popup-icon" />,
    };

    const playSound = (soundUrl: string) => {
        const audio = new Audio(soundUrl);
        audio.play();
    };
    const soundUrls = {
        success: '/assets/sounds/success-1-6297.mp3',
        error: '/assets/sounds/error-3-125761.mp3',
    };

    useEffect(() => {
        if (type === SweatAlertTypeEnum.success) {
            playSound(soundUrls.success);
        } else if (type === SweatAlertTypeEnum.error) {
            playSound(soundUrls.error);
        }
    }, [type]);
    return (
        <Modal
            centered
            footer={null}
            open={true}
            onCancel={onClose}
            maskClosable={false}
        >
            <div style={{ textAlign: 'center' }}>
                {iconMap[type]}
                <Typography.Title level={4}>{message}</Typography.Title>
            </div>
        </Modal>
    );
}

export default SweatAlert;
