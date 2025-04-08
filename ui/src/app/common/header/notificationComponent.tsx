import React, { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Modal, Card, Button, Tooltip, message } from "antd";
import { useIAMClientState } from "../iam-client-react";
import { NotificationsReqModel,NotificationStatusReqModal } from "@hrexpert/shared-models";


export const NotificationComponent = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(20);
    const { IAMClientAuthContext } = useIAMClientState();

    useEffect(() => {
        getAllNotifications();
    }, [IAMClientAuthContext.user.unitCode]);

    const getAllNotifications = () => {
        const req: NotificationsReqModel = new NotificationsReqModel(
            IAMClientAuthContext?.user?.userName,
            IAMClientAuthContext?.user?.roles
        );
        //TODO: need to have notification service
    };


    const showModal = () => {
        setIsModalVisible(true);
        const interval = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(interval);
                    handleCancel();
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setCountdown(20);
    };

    const handleSubmitRead = (notificationId, read) => {
        setData(currentData => currentData.filter(notification => notification.woId !== notificationId));
        const req = new NotificationStatusReqModal(notificationId, read,
            IAMClientAuthContext?.user?.userName,
            IAMClientAuthContext?.user?.roles
        );
         //TODO: need to have notification service
    };

    return (
        <><div style={{ position: 'relative' }}>
            {data.length > 0 ? (
                <>
                    <Tooltip title="see Notifications">
                        <Badge count={data.length} className="badge" style={{ backgroundColor: '#6ff707' }}>
                            <div onClick={showModal} style={{ cursor: 'pointer' }}>
                                <BellOutlined style={{ color: '#fff', fontSize: '20px' }} />
                            </div>
                        </Badge>
                    </Tooltip>
                    <Modal
                        title="Notifications"
                        open={isModalVisible}
                        footer={[
                            <Button key="back" danger onClick={handleCancel} style={{ borderRadius: '8px' }}>
                                Cancel
                            </Button>
                        ]}
                        width={"460px"}
                        onCancel={handleCancel}
                    >
                        <div>
                            <p style={{ color: "#b0170c" }}>This Modal will be Closed in <span style={{ color: "black" }}>{countdown}</span> seconds</p>
                        </div>

                        {data.map((notification, index) => (
                            <Card key={notification.woId || index} style={{ marginBottom: 10, borderRadius: '8px' }}>
                                <p>Work Order<strong> {notification.woNumber}</strong> is <strong>{notification.status}</strong></p>
                                
                                <Button size="small" style={{ marginLeft: "260px", borderRadius: '8px' }} onClick={() => handleSubmitRead(notification.woId, "read")}> Mark as Read</Button>
                            </Card>
                        ))}
                    </Modal>
                </>
            ) : (
                <BellOutlined style={{ color: '#fff', fontSize: '20px', paddingTop: '20px' }} />
            )}
            <style>{`
        .badge .ant-badge-count {
            color: black;
        }
      `}</style>
        </div></>
    );
};

export default NotificationComponent;
