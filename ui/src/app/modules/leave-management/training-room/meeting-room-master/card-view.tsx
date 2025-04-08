import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { MettingRoomService, TrainingCenterSharedService } from '@hrexpert/shared-services';
import { Badge, Button, Card, Col, Modal, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { configVariables } from '../../../../../../../libs/shared-services/src/lib/config';
import MeetingRoomSchedule from '../training center schedule/training-center-schedule';
const { Title, Text } = Typography;

interface CardViewProps {
    meetingRoom: string;
    isActive: number;
    roomStatus: string;
    location: string | null;
    capacity: number | null;
    fileName: string;
    id: number;
}



const CardView: React.FC<CardViewProps> = ({ id, meetingRoom, isActive, roomStatus, location, capacity, fileName }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const service = new TrainingCenterSharedService()
    const navigate = useNavigate();
    const [roomsData, setRoomsData] = useState<any>([])

    useEffect(() => {
        getAllMeetingRooms()
    }, [])

    const showModal = (selectedRoomData: any) => {
        console.log(selectedRoomData, 'meeting room')
        setSelectedRoom(selectedRoomData.id);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        getData();
    };

    const imageUrl = `${configVariables.MEETING_ROOM_URL}${fileName}`;

    const getData = () => {
        console.log('Fetching data for room:', selectedRoom);
    };

    const onClickCard = () => {
        navigate(`/meeting-room-availability/${id}/${encodeURIComponent(meetingRoom)}`);
    };

    const getAllMeetingRooms = async () => {
        const res = await service.getActiveMeetingRooms();
        if (res.status) {
            setRoomsData(res.data);
            return res.data;
        } else {
            console.error("Failed to fetch meeting rooms.");
            return [];
        }
    };

    return (
        <>
            <Space size="large">
                <Badge
                    dot={true}
                    status={isActive ? "success" : "error"}
                    className="custom-badge"
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 2,
                        zIndex: 2,
                    }}
                >
                    <Card
                        hoverable
                        // onClick={onClickCard}
                        style={{
                            width: 270,
                            height: 350,
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: 0,
                                paddingBottom: '73.95%',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                alt={meetingRoom}
                                src={imageUrl}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />

                        </div>
                        <div
                            style={{
                                padding: '10px',
                                flex: 1,
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '144px'
                            }}
                        >
                            <Title level={4} style={{ marginTop: 3, marginBottom: 8, textAlign: 'center' }}>
                                {meetingRoom}
                            </Title>
                            <Row gutter={[16, 8]}>
                                {/* <Col span={12}>
                                    <Text strong>
                                        <Tag color={roomStatus === 'Booked' ? 'red' : 'green'}>
                                            {roomStatus === 'Booked' ? 'Booked' : 'Available'}
                                        </Tag>
                                    </Text>
                                </Col> */}
                                <Col span={12}>
                                    <Text strong><EnvironmentOutlined />{`: ${location || 'N/A'}`}</Text>
                                </Col>
                            </Row>
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong><TeamOutlined />{`: ${capacity || 'N/A'}`}</Text>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        className="view-more"
                                        disabled={isActive ===0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showModal({ id, meetingRoom, isActive, roomStatus, location, capacity, fileName });
                                        }}
                                    >
                                        Schedule
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Badge>
            </Space>
            <Modal
                title={`Schedule for ${meetingRoom}`}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                // key={Date.now()}
            >
                <MeetingRoomSchedule selectedDate={null} roomsData={roomsData} closeModal={handleCancel} getData={getData} selectedRoom={selectedRoom} selectedTimeRange={null} />
            </Modal>
        </>
    );
};

export default CardView;
