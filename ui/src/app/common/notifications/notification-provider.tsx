import { createContext, useContext, useEffect, useState } from 'react';
import SweatAlert, { SweatAlertTypeEnum } from './sweat-alert';

const NotificationContext = createContext({
    showNotification: (message, type = SweatAlertTypeEnum.error, duration = 2000, onClose?: () => void) => { },
});

export const NotificationProvider = ({ children }) => {
    const [notificationQueue, setNotificationQueue] = useState([]);


    const showNotification = (message, type = SweatAlertTypeEnum.error, duration = 2000, onClose?: () => void) => {
        setNotificationQueue(prevQueue => [...prevQueue, { message, type, duration, onClose }]);
    };


    const dismissNotification = () => {
        setNotificationQueue(prevQueue => {
            if (prevQueue.length > 0 && prevQueue[prevQueue.length - 1].onClose) {
                prevQueue[prevQueue.length - 1].onClose();
            }
            return prevQueue.slice(1)
        });
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            if (notificationQueue.length > 0) {
                dismissNotification();
            }
        }, notificationQueue[0]?.duration || 0);

        return () => clearTimeout(timer);
    }, [notificationQueue]);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notificationQueue.map((notification, index) => (
                <SweatAlert
                    key={index}
                    type={notification.type}
                    message={notification.message}
                    onClose={dismissNotification}
                />
            ))}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
