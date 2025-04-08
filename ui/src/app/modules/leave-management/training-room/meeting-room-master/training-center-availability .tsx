import { DoubleLeftOutlined, DoubleRightOutlined, ExclamationOutlined, RobotOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, List, Result, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import isBetween from "dayjs/plugin/isBetween";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import RealEstateImage from 'packages/ui/src/assets/images/Real-Estate-Client-Meeting.png';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './meeting-room.css';
import { MettingRoomService, TrainingCenterSharedService } from '@hrexpert/shared-services';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
const { Text, Title } = Typography;
const { Header, Content } = Layout;
export interface MeetingDetailsProps {
    meetingRoom: any
}

const MeetingRoomDetailView = (props: MeetingDetailsProps) => {
    const service = new TrainingCenterSharedService();
    const [data, setData] = useState<any[]>([]);
    const [meetingRoomName, setMeetingRoomName] = useState<string>('N/A');
    const [nextMeeting, setNextMeeting] = useState<any | null>(null);
    const { id: roomId, meetingRoom } = useParams<{ id: any, meetingRoom: any }>();
    const [isOngoingMeeting, setIsOngoingMeeting] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState(dayjs().tz('Asia/Kolkata'));
    const [slots, setSlots] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (roomId) {
            getData(parseInt(roomId));
            generateDynamicTimeSlots();
        }
    }, [roomId]);

    useEffect(() => {
        if (meetingRoom) {
            console.log(meetingRoom, 'meetingRoom')
        }
    }, [meetingRoom]);

    const getData = (roomId: number) => {
        const currentDate = dayjs().format('YYYY-MM-DD');
        const requestPayload = { roomId, date: currentDate };

        service.getScheduleDataByDate(requestPayload).then((res) => {
            if (res.status) {
                console.log(res, 'res.data')
                const meetingData = Array.isArray(res.data) ? res.data : [];
                setData(
                    meetingData.map((item: any) => ({
                        id: item.id,
                        purpose: item.purpose,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        approveStatus: item.approveStatus,
                    }))
                );
                console.log('slots', slots)
                if (meetingData.length > 0) {
                    setMeetingRoomName(meetingData[0]?.room?.meetingRoom || 'Unknown Room');

                    meetingData.forEach((item: { startTime: any; endTime: any }) => {
                        // getAvailableTimes(item.startTime, item.endTime);
                    });
                    const now = dayjs();
                    const next = meetingData
                        .filter((item: any) => {
                            const meetingStart = dayjs(item.startTime);
                            const meetingEnd = dayjs(item.endTime);
                            return (
                                (meetingStart.isAfter(now) ||
                                    (meetingStart.isBefore(now) && meetingEnd.isAfter(now))) &&
                                item.approveStatus === 'Approved'
                            );
                        })
                        .sort((a: any, b: any) =>
                            dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1
                        )[0];

                    const ongoing = meetingData.find((item: any) => {
                        const meetingStart = dayjs(item.startTime);
                        const meetingEnd = dayjs(item.endTime);
                        return (
                            meetingStart.isBefore(now) &&
                            meetingEnd.isAfter(now) &&
                            item.approveStatus === 'Approved'
                        );
                    });

                    setNextMeeting(next || null);
                    setIsOngoingMeeting(!!ongoing);
                } else {
                    setMeetingRoomName('No meeting scheduled');
                    setNextMeeting(null);
                    setIsOngoingMeeting(false);
                }
            } else {
                console.error('Failed to fetch meeting schedules:', res.internalMessage);
            }
        }).catch((error) => {
            console.error('Error fetching meeting schedules:', error);
        });
    };

    const generateDynamicTimeSlots = () => {
        const currentDate = dayjs().format('YYYY-MM-DD');
        const req = { date: currentDate, roomId: roomId };
    
        service.getTodayAvailabilitySlots(req)
            .then((res) => {
                if (res.status) {
                    console.log(res, 'res.data...');
                    const { data } = res;
    
                    if (!data || data.length === 0) {
                        setSlots([]);
                        return;
                    }
    
                    const now = dayjs();
                    const startOfDay = dayjs(`${currentDate} 09:00`);
                    const endOfDay = dayjs(`${currentDate} 20:00`);
    
                    const slots: { start: string; end: string; status: string }[] = [];
                    let allApproved = true; // Flag to check if all slots are approved
    
                    let startLimit = startOfDay;
    
                    while (startLimit.isBefore(endOfDay)) {
                        const nextSlot = startLimit.add(30, 'minute'); // Change to 5 minutes
    
                        if (startLimit.isAfter(now)) {
                            const matchingSlot = data.find(
                                (slot: any) =>
                                    dayjs(slot.startTime).isSame(startLimit) &&
                                    dayjs(slot.endTime).isSame(nextSlot)
                            );
    
                            // Check if the slot is approved
                            if (matchingSlot && matchingSlot.status === 'Approved') {
                                // Slot is approved, mark it as unavailable
                                allApproved = true; // Still true, but we won't add it to available slots
                            } else {
                                // Slot is not approved, add it as available
                                slots.push({
                                    start: startLimit.format('HH:mm'),
                                    end: nextSlot.format('HH:mm'),
                                    status: 'Available', // Mark as available
                                });
                                allApproved = false; // Found at least one available slot
                            }
                        }
    
                        startLimit = nextSlot;
                    }
    
                    // If all slots are approved, set slots to empty
                    if (allApproved) {
                        setSlots([]);
                    } else {
                        setSlots(slots);
                    }
                } else {
                    console.error('Failed to fetch today availability slots:', res.internalMessage);
                    setSlots([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching today availability slots:', error);
                setSlots([]);
            });
    }; 

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().tz('Asia/Kolkata'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLeftScroll = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const handleRightScroll = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Layout style={{ height: '97vh' }}>
                <Header style={{ backgroundColor: '#23395d', padding: '16px' }}>
                    <Title level={3} style={{ color: '#fff', margin: 0 }}>
                        {meetingRoom}
                        <Text style={{ color: '#fff', float: 'right', textAlign: 'right', fontSize: 14, margin: '5px', marginTop: '-5px' }}>
                            {currentTime.format('h:mm:ss A')}
                            <br />
                            {currentTime.format('MMM D ddd YYYY')}
                        </Text>
                    </Title>
                </Header>
                <br />
                <Content style={{ paddingBottom: '0px', backgroundImage: `url(${RealEstateImage})`, backgroundSize: 'cover', backgroundColor: 'rgba(35, 57, 93, 0.8)', color: '#fff', padding: '24px', borderRadius: '8px', height: '98%', position: 'relative', zIndex: 2 }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(35, 57, 93, 0.89)', borderRadius: '8px', zIndex: 1, overflow: 'hidden'
                    }}></div>
                    <div style={{
                        position: 'relative',
                        zIndex: 3,
                    }}>
                        {/* ONGOING MEETING */}
                        <div>
                            <div style={{
                                padding: '16px', height: '100%', float: 'left', marginLeft: '250px',
                            }}>
                                {nextMeeting ? (
                                    <div
                                        style={{
                                            textAlign: 'center', marginTop: '200px', borderRadius: '12px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', width: '300px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px)', transition: 'transform 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: '22px', color: '#fff', marginBottom: '10px' }}>
                                            {isOngoingMeeting ? 'Ongoing Meeting' : 'Next Meeting'}
                                        </Text>
                                        <div style={{ fontSize: '16px', color: '#d1d1d1', marginBottom: '8px', textAlign: 'center' }}>
                                            <b>Agenda:</b> {nextMeeting.purpose}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#d1d1d1', marginBottom: '4px', textAlign: 'center' }}>
                                            {new Date(nextMeeting.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })} -
                                            {new Date(nextMeeting.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            textAlign: 'center', marginTop: '200px', borderRadius: '12px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', width: '300px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px)', transition: 'transform 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: '22px', color: '#fff', marginBottom: '10px' }}>
                                            <Badge className="custom-badge" status="success" style={{ marginRight: '8px' }}
                                            /> Available
                                        </Text>
                                    </div>
                                )}
                                {!nextMeeting && (
                                    <Row style={{ padding: '16px' }}>
                                        <div
                                            id="timeSlotsContainer"
                                            className="timeSlotsContainer"
                                            style={{
                                                pointerEvents: 'none', opacity: 0.5,
                                            }}
                                        >
                                        </div>
                                    </Row>
                                )}
                            </div>
                        </div>
                        {/* //meeting data */}
                        <div className="meetingData" >
                            {data.length > 0 ? (
                                <List
                                    dataSource={data}
                                    renderItem={(item) => (
                                        <List.Item
                                            key={item.id}
                                            style={{
                                                marginTop: '16px',
                                                borderLeft: '4px solid #d46B08',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                backgroundColor: '#f8f9fa',
                                            }}
                                        >
                                            <div>
                                                <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                    {item.purpose}
                                                </Text>
                                                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                    {dayjs(item.startTime).tz('Asia/Kolkata').format('HH:mm')} -{' '}
                                                    {dayjs(item.endTime).tz('Asia/Kolkata').format('HH:mm')}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        color: item.approveStatus === 'Approved' ? 'green' : 'red',
                                                    }}
                                                >
                                                    Status: {item.approveStatus}
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Result
                                    icon={<ScheduleOutlined style={{ fontSize: '48px', color: 'white' }} />}
                                    title="No meeting scheduled today"
                                />
                            )}
                        </div>
                        {/* TIME SLOTS */}
                        <div style={{ padding: '20px', marginTop: '13px' }}>
                            <h2>Available Time Slots</h2>
                            {slots.length === 0 ? (
                                <h1>No slots vacant today <ExclamationOutlined /></h1>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <DoubleLeftOutlined
                                        style={{ fontSize: '24px' }}
                                        onClick={handleLeftScroll}
                                    />
                                    <div
                                        className="timeSlotsContainer"
                                        ref={containerRef}
                                        style={{
                                            display: 'flex', overflowY: 'auto', gap: '10px', padding: '10px', whiteSpace: 'nowrap', scrollBehavior: 'smooth',
                                        }}
                                    >
                                        {slots.map((slot, index) => {
                                            let backgroundColor = 'gray'; // Default color

                                            // Apply color based on status
                                            if (slot.status === 'Available') {
                                                backgroundColor = 'green';
                                            } else if (slot.status === 'Open') {
                                                backgroundColor = 'orange'; // Yellowish color
                                            }
                                            return (
                                                <Button
                                                    key={index}
                                                    type="primary"
                                                    style={{
                                                        flexShrink: 0, padding: '10px 20px', borderRadius: '8px', backgroundColor: backgroundColor,
                                                    }}
                                                    disabled={slot.status.toLowerCase() === 'Approved'}
                                                >
                                                    {slot.start} - {slot.end}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <DoubleRightOutlined
                                        style={{ fontSize: '24px' }}
                                        onClick={handleRightScroll}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Content>
            </Layout>
        </>
    );
};

export default MeetingRoomDetailView;