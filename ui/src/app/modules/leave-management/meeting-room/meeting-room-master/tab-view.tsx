import { MettingRoomService } from "@hrexpert/shared-services";
import { Badge, Card, Col, Layout, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './tabviewstyle/tabview.css';

const { Text, Title } = Typography;


interface MeetingData {
    id: number;
    purpose: string;
    startTime: string;
    endTime: string;
    approveStatus: string;
    createdBy: string;
    timeSlot: string;
    status: string;
}

const TabView = () => {
    const service = new MettingRoomService();
    const [meetingData, setMeetingData] = useState<MeetingData[]>([]);
    const { id: roomId, meetingRoom } = useParams<{ id: any, meetingRoom: any }>();
    const [currentTime, setCurrentTime] = useState(dayjs().tz('Asia/Kolkata'));
    const [nextMeeting, setNextMeeting] = useState<MeetingData | null>(null);
    const [isOngoingMeeting, setIsOngoingMeeting] = useState(false);
    const [ongoingMeeting, setOngoingMeeting] = useState<MeetingData | null>(null);
    const [nextAvailableSlot, setNextAvailableSlot] = useState<MeetingData | null>(null);
    const [nextPending, setNextPendingSlot] = useState<MeetingData | null>(null);

    useEffect(() => {
        if (roomId) {
            getData(parseInt(roomId));
        }
    }, [roomId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().tz('Asia/Kolkata'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getData = (roomId: number) => {
        const currentDate = dayjs().format('YYYY-MM-DD');
        const requestPayload = { roomId, date: currentDate };

        service.getScheduleDataWithDate(requestPayload).then((res) => {
            if (res.status) {
                const data = Array.isArray(res.data) ? res.data : [];
                const mergedData = mergeMeetingData(data);
                setMeetingData(mergedData);
                console.log('merged data:', mergedData);
                handleMeetingStatus(mergedData);

            } else {
                console.error('Failed to fetch meeting schedules:', res.internalMessage);
            }
        }).catch((error) => {
            console.error('Error fetching meeting schedules:', error);
        });
    };

    const mergeMeetingData = (data: MeetingData[]) => {
        const mergedData: MeetingData[] = [];
        const groupedById: { [key: number]: MeetingData } = {};
        data.forEach((slot) => {
            if (slot.id) {
                if (groupedById[slot.id]) {
                    const existingSlot = groupedById[slot.id];
                    const existingEnd = dayjs(existingSlot.timeSlot.split(' - ')[1]);
                    const currentStart = dayjs(slot.timeSlot.split(' - ')[0]);
                    if (currentStart.isBefore(existingEnd) || currentStart.isSame(existingEnd)) {
                        existingSlot.timeSlot = `${existingSlot.timeSlot.split(' - ')[0]} - ${slot.timeSlot.split(' - ')[1]}`;
                        const existingPurposes = new Set(existingSlot.purpose ? existingSlot.purpose.split(' / ') : []);
                        if (slot.purpose) {
                            slot.purpose.split(' / ').forEach(p => existingPurposes.add(p));
                        }
                        existingSlot.purpose = Array.from(existingPurposes).join(' / ');
                        const existingCreators = new Set(existingSlot.createdBy ? existingSlot.createdBy.split(' / ') : []);
                        if (slot.createdBy) {
                            slot.createdBy.split(' / ').forEach(c => existingCreators.add(c));
                        }
                        existingSlot.createdBy = Array.from(existingCreators).join(' / ');
                    } else {
                        groupedById[slot.id] = { ...slot };
                    }
                } else {
                    groupedById[slot.id] = { ...slot };
                }
            } else {
                mergedData.push(slot);
            }
        });
        Object.values(groupedById).forEach((groupedSlot) => {
            mergedData.push(groupedSlot);
        });
        mergedData.sort((a, b) => dayjs(a.timeSlot.split(' - ')[0]).isBefore(dayjs(b.timeSlot.split(' - ')[0])) ? -1 : 1);
        return mergedData;
    };

    const handleMeetingStatus = (data: MeetingData[]) => {
        const now = dayjs();

        // Find the next approved meeting
        const next = data
            .filter((item) => {
                const meetingStart = dayjs(item.timeSlot.split(' - ')[0]);
                return meetingStart.isAfter(now) && item.status === 'Approved';
            })
            .sort((a, b) => dayjs(a.timeSlot.split(' - ')[0]).isBefore(dayjs(b.timeSlot.split(' - ')[0])) ? -1 : 1)[0];

        // Find the ongoing meeting
        const ongoing = data.find((item) => {
            const meetingStart = dayjs(item.timeSlot.split(' - ')[0]);
            const meetingEnd = dayjs(item.timeSlot.split(' - ')[1]);
            return meetingStart.isBefore(now) && meetingEnd.isAfter(now) && item.status === 'Approved';
        });

        // Find the next available slot (change from 'Open' to 'Available')
        const nextAvailable = data
            .filter((item) => {
                const meetingStart = dayjs(item.timeSlot.split(' - ')[0]);
                return meetingStart.isAfter(now) && item.status === 'Available'; // Change here
            })
            .sort((a, b) => dayjs(a.timeSlot.split(' - ')[0]).isBefore(dayjs(b.timeSlot.split(' - ')[0])) ? -1 : 1)[0];

        // Find the next pending slot
        const nextPending = data.find((item) => {
            const meetingStart = dayjs(item.timeSlot.split(' - ')[0]);
            return meetingStart.isAfter(now) && item.status === 'Open';
        });

        // Set the state with the found values
        setNextMeeting(next || null);
        setOngoingMeeting(ongoing || null);
        setNextAvailableSlot(nextAvailable || null);
        setIsOngoingMeeting(!!ongoing);
        setNextPendingSlot(nextPending || null);
    };
    console.log(nextAvailableSlot, 'nextAvailableSlot')

    return (
        <Layout style={{ height: '97vh' }}>
            <Layout.Header style={{ backgroundColor: '#123456', color: 'white' }}>
                <Title level={2}>
                    <Text style={{ color: '#fff', float: 'right', textAlign: 'right', fontSize: 14, margin: '5px', marginTop: '-17px' }}>
                        {currentTime.format('h:mm:ss A')}
                        <br />
                        {currentTime.format('MMM D ddd YYYY')}
                    </Text>
                </Title>
            </Layout.Header>
            <Layout.Content style={{ padding: '20px', backgroundColor: '#f8f8ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
                    <Col span={8}>
                        <Card style={{ width: "100%", borderRadius: "8px", height: "211px" }}>
                            {ongoingMeeting ? (
                                <Card
                                    style={{
                                        textAlign: "center",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        backgroundColor: "rgb(42, 78, 111)",
                                        color: "#fff",
                                        height: "176px",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: "22px", color: "#fff" }}>Ongoing Meeting</Text>
                                    <div style={{ fontSize: "16px", color: "#d1d1d1" }}>
                                        <b>Agenda:</b> {ongoingMeeting.purpose}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#d1d1d1" }}>
                                        {dayjs(ongoingMeeting.timeSlot.split(" - ")[0]).format("HH:mm")} - {dayjs(ongoingMeeting.timeSlot.split(" - ")[1]).format("HH:mm")}
                                    </div>
                                </Card>
                            ) : nextMeeting ? (
                                <Card
                                    style={{
                                        textAlign: "center",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        backgroundColor: "rgb(42, 78, 111)",
                                        color: "#fff",
                                        height: "176px",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: "22px", color: "#fff" }}>Next Meeting</Text>
                                    <div style={{ fontSize: "16px", color: "#d1d1d1" }}>
                                        <b>Agenda:</b> {nextMeeting.purpose}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#d1d1d1" }}>
                                        {dayjs(nextMeeting.timeSlot.split(" - ")[0]).format("HH:mm")} - {dayjs(nextMeeting.timeSlot.split(" - ")[1]).format("HH:mm")}
                                    </div>
                                </Card>
                            ) : nextPending ? (
                                <Card
                                    style={{
                                        textAlign: "center",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        backgroundColor: "rgb(42, 78, 111)",
                                        color: "#fff",
                                        height: "176px",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: "22px", color: "#fff" }}>
                                        <Badge status="warning" style={{ marginRight: "8px" }} /> Pending
                                    </Text>
                                    <div style={{ fontSize: "16px", color: "#d1d1d1" }}>
                                        <b>Agenda:</b> {nextPending.purpose}
                                    </div>
                                    <div style={{ fontSize: "16px", color: "#d1d1d1" }}>
                                        {dayjs(nextPending.timeSlot.split(" - ")[0]).format("HH:mm")} - {dayjs(nextPending.timeSlot.split(" - ")[1]).format("HH:mm")}
                                    </div>
                                </Card>
                            ) : nextAvailableSlot ? (
                                <Card
                                    style={{
                                        textAlign: "center",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        backgroundColor: "rgb(42, 78, 111)",
                                        color: "#fff",
                                        height: "176px",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: "22px", color: "#fff" }}>
                                        <Badge status="success" style={{ marginRight: "8px" }} /> Available
                                        <div style={{ fontSize: "16px", color: "#d1d1d1" }}>
                                            {dayjs(nextAvailableSlot.timeSlot.split(" - ")[0]).format("HH:mm")} - {dayjs(nextAvailableSlot.timeSlot.split(" - ")[1]).format("HH:mm")}
                                        </div>
                                    </Text>
                                </Card>
                            ) : (
                                <Card
                                    style={{
                                        textAlign: "center",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        backgroundColor: "rgb(42, 78, 111)",
                                        color: "#fff",
                                        height: "176px",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: "22px", color: "#fff" }}>
                                        No Upcoming Meetings
                                    </Text>
                                </Card>
                            )}
                        </Card>
                    </Col>
                    <Col span={24} style={{ maxWidth: '900px', width: '100%' }}>
                        <div className="scroll-container">
                            {meetingData.map((slot, index) => {
                                const startTime = slot.timeSlot.split(' - ')[0];
                                const endTime = slot.timeSlot.split(' - ')[1];

                                let badgeColor = '';
                                let timeSlotColor = '';
                                let fontSize = '32px';

                                if (slot.status === 'Available') {
                                    badgeColor = 'green';
                                    timeSlotColor = '#4CAF50';
                                    fontSize = '32px';
                                } else if (slot.status === 'Approved') {
                                    badgeColor = 'blue';
                                    timeSlotColor = '#2196F3';
                                    fontSize = '32px';
                                } else if (slot.status === 'Open') {
                                    badgeColor = 'orange';
                                    timeSlotColor = '#FF9800';
                                    fontSize = '32px';
                                }
                                else if (slot.status === 'No Show') {
                                    badgeColor = 'red';
                                    timeSlotColor = '#ff6347';
                                    fontSize = '32px';
                                }

                                return (
                                    <Card
                                        key={index}
                                        size="default"
                                        style={{
                                            marginBottom: '10px',
                                            backgroundColor: '#2a4e6f',
                                            borderRadius: '8px',
                                            height: '160px',
                                        }}
                                        bordered
                                        hoverable
                                    >
                                        <Row gutter={16} style={{ color: '#fff', alignItems: 'center' }}>
                                            <Col>
                                                {slot.status === 'Available' && (
                                                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Badge status="success" />
                                                        <h1 style={{ marginLeft: '8px' }}>{slot.status}</h1>
                                                    </Row>
                                                )}
                                                {slot.status === 'Approved' && (
                                                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Badge status="processing" />
                                                        <h1 style={{ marginLeft: '8px' }}>{slot.status}</h1>
                                                    </Row>
                                                )}
                                                {slot.status === 'Open' && (
                                                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Badge status="warning" />
                                                        <h1 style={{ marginLeft: '8px' }}>Pending</h1>
                                                    </Row>
                                                )}
                                                {slot.status === 'No Show' && (
                                                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Badge status="error" />
                                                        <h1 style={{ marginLeft: '8px' }}>{slot.status}</h1>
                                                    </Row>
                                                )}
                                            </Col>
                                        </Row>

                                        <Row gutter={16} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Col style={{ color: '#fff', marginTop: '-12px', fontSize: '24px', marginLeft: '30px' }}>
                                                {slot.purpose && (
                                                    <Row style={{ marginBottom: '5px', fontSize: 20 }}>
                                                        <strong style={{ fontWeight: 'bold' }}>Agenda: </strong>
                                                        <span style={{ marginLeft: '8px' }}> {slot.purpose}</span>
                                                    </Row>
                                                )}
                                                {slot.createdBy && (
                                                    <Row style={{ marginBottom: '5px', fontSize: 20 }}>
                                                        <strong style={{ fontWeight: 'bold' }}>Created By: </strong>
                                                        <span style={{ marginLeft: '8px' }}> {slot.createdBy}</span>
                                                    </Row>
                                                )}
                                            </Col>

                                            <Col>
                                                <Tag
                                                    color="default"
                                                    style={{
                                                        backgroundColor: timeSlotColor,
                                                        borderRadius: '50px',
                                                        padding: '30px 30px',
                                                        margin: '0px',
                                                        fontSize: '20px',
                                                        marginTop: '-45px'
                                                    }}
                                                >
                                                    {dayjs(startTime).format('HH:mm')} - {dayjs(endTime).format('HH:mm')}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    </Card>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            </Layout.Content>
        </Layout>
    );
};
export default TabView;