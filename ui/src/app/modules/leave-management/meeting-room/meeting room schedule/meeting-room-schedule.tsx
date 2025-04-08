import { PlusOutlined, UndoOutlined } from "@ant-design/icons";
import { RoomBookingDto, ValidationDateReq } from "@hrexpert/shared-models";
import { MettingRoomService } from "@hrexpert/shared-services";
import { Button, Card, Col, Collapse, DatePicker, Form, notification, Row, Select, Switch, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";
import { useIAMClientState } from "../../../../common/iam-client-react";
import './../meeting-room-master/meeting-room.css';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(timezone);

export interface MeetingRoomScheduleProps {
    selectedDate: any;
    closeModal: any
    getData: any;
    selectedRoom: any;
    selectedTimeRange: { start: string; end: string } | null;
    roomsData?: any
}
interface Slot {
    [x: string]: any;
    start: string;
    end: string;
    status: string;
}

const MeetingRoomSchedule = (props: MeetingRoomScheduleProps) => {
    const { selectedDate, closeModal, getData, selectedRoom, selectedTimeRange } = props;
    const service = new MettingRoomService();
    const [form] = Form.useForm();
    const { Option } = Select;
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
    const [collapseDisabled, setCollapseDisabled] = useState(true);
    const [allDay, setAllDay] = useState(false);
    const [dateSelected, setDateSelected] = useState<any>(null)
    const [selectedRoomId, setSelectedRoomId] = useState<any>(null);
    const [blockedTimes, setBlockedTimes] = useState<any>({ hours: [], minutes: [] });
    const [showAllDay, setShowAllDay] = useState(false);
    const { IAMClientAuthContext } = useIAMClientState();
    const existing = JSON.parse(localStorage.getItem('currentUser') || "") || {}
    const [showCollapse, setShowCollapse] = useState(false);
    const [roomSlots, setRoomSlots] = useState([]);

    // useEffect(() => {
    //     getAllMeetingRooms();
    // }, []);

    let getRoomsData = props.roomsData
    useEffect(() => {
        if (selectedDate) {
            const startTime = dayjs(selectedDate);
            const endTime = startTime.add(30, 'minute');
            form.setFieldsValue({
                startDateTime: startTime,
                endDateTime: endTime,
            });
        }
    }, [selectedDate, form]);

    const getSlotsBythirtyMin = async (roomId: any, date: any) => {
        const MeetingRoomIdReq = { roomId, date };
        try {
            const res = await service.getTodayAvailabilitySlotsT(MeetingRoomIdReq);
            let slotsThirty = res.data;

            // Check if the selected date is today
            if (dayjs(date).isSame(dayjs(), 'day')) {
                const currentTime = dayjs();
                slotsThirty = slotsThirty.filter((slot: any) => dayjs(slot.startTime).isAfter(currentTime));
            }

            setSlots(slotsThirty);
        } catch (err) {
            console.error('Error fetching slots:', err);
        }
    };

    const getRoomSlots = async (startDate: any, endDate: any) => {
        const dateTime = { startDate, endDate }
        try {
            const res = await service.getRoomSlots(dateTime)
            console.log(res.data)
            setRoomSlots(res.data); // Set the room slots in the state
            setShowCollapse(true);
        } catch (err) {
            console.log('Error fetching slots:', err)
        }
    }

    const getSlotsForRoom = async (roomId: any, date: any) => {
        const MeetingRoomIdReq = { roomId, date };
        try {
            const res = await service.getTodayAvailabilitySlots(MeetingRoomIdReq);
            console.log('Response:', res);

            if (res.status) {
                const data = res.data;
                console.log('Data:', data);
                const filteredSlots = data.filter((slot: any) => slot.status === 'Approved');
                console.log('Filtered Slots:', filteredSlots);

                const timeSlots = filteredSlots.map((slot: any) => {
                    try {
                        const startTime = new Date(slot.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                        const endTime = new Date(slot.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                        return { startTime, endTime };
                    } catch (formatError) {
                        console.error('Error formatting time:', slot, formatError);
                        return null;
                    }
                }).filter(Boolean);
                console.log(timeSlots, 'Time Slots');

                // Update the blocked times
                const hours: number[] = [];
                const minutes: { [hour: number]: number[] } = {};

                timeSlots.forEach((slot: { startTime: string, endTime: string }) => {
                    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
                    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

                    hours.push(startHour);
                    if (!minutes[startHour]) {
                        minutes[startHour] = [];
                    }
                    for (let m = startMinute; m < endMinute; m++) {
                        minutes[startHour].push(m);
                    }
                });

                // setBlockedTimes({ hours, minutes });
                // console.log({ hours, minutes },'{ hours, minutes }')

            } else {
                console.error('Failed to fetch today slots:', res.internalMessage);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        if (selectedRoom) {
            form.setFieldsValue({
                roomId: selectedRoom,
            });
            setSelectedRoomId(selectedRoom);
        }
    }, [selectedRoom, form]);

    useEffect(() => {
        if (selectedRoomId && dateSelected) {
            form.setFieldsValue({
                roomId: selectedRoomId,
            });
            setCollapseDisabled(false);
            // getSlotsForRoom(selectedRoomId, dateSelected);
            getSlotsBythirtyMin(selectedRoomId, dateSelected)
        } else {
            setCollapseDisabled(true);
        }
    }, [selectedRoomId, dateSelected, form]);

    const handleRoomChange = (value: any) => {
        setSelectedRoomId(value);
        if (value && dateSelected) {
            // getSlotsForRoom(value, dateSelected);
            getSlotsBythirtyMin(value, dateSelected)
        }
    };

    const checkForOverlappingMeetings = (allDaySlots: any) => {
        for (let slot of slots) {
            if (slot.status !== 'Available' && allDaySlots.includes(slot.start)) {
                console.log('slots:', slots);
                console.log(allDaySlots, 'allDaySlots');
                return true;
            }
        }
        return false;
    };
    const openNotification = (message: string, description: string) => {
        notification.error({
            message,
            description,
        });
    };

    const handleAllDayToggle = (checked: boolean) => {
        if (checked) {
            const availableSlots = slots.filter(slot => slot.status === 'Available');

            if (availableSlots.length === 0) {
                openNotification('Time Slot Error', 'No available slots for the entire day.');
                setAllDay(false);
                setShowAllDay(false);
                form.resetFields(['startDateTime', 'endDateTime']);
                return;
            }

            const allDaySlots = availableSlots.map(slot => slot.start);
            const overlapping = checkForOverlappingMeetings(allDaySlots);

            if (overlapping) {
                openNotification('Time Slot Error', 'There is another meeting overlapping this time.');
                setAllDay(false);
                setShowAllDay(false);
                form.resetFields(['startDateTime', 'endDateTime']);
                return;
            }

            setSelectedSlots(availableSlots);

            if (availableSlots.length > 0) {
                const earliestStart = availableSlots[0].startTime;
                const latestEnd = availableSlots[availableSlots.length - 1].endTime;
                const startTime = dayjs(earliestStart).tz('Asia/Kolkata', true);
                const endTime = dayjs(latestEnd).tz('Asia/Kolkata', true);
                form.setFieldsValue({
                    startDateTime: startTime,
                    endDateTime: endTime,
                });
                setSelectedRange({ start: startTime.format('HH:mm'), end: endTime.format('HH:mm') });
            }
        } else {
            setSelectedSlots([]);
            setSelectedRange(null);
            form.resetFields(['startDateTime', 'endDateTime']);
        }
        setAllDay(checked);
    };

    useEffect(() => {
        if (selectedTimeRange) {
            const { start, end } = selectedTimeRange;
            form.setFieldsValue({
                startDateTime: dayjs(start, 'HH:mm'),
                endDateTime: dayjs(end, 'HH:mm'),
            });
        }
    }, [selectedTimeRange, form]);

    // const getAllMeetingRooms = async () => {
    //     const res = await service.getActiveMeetingRooms();
    //     if (res.status) {
    //         setData(res.data);
    //         return res.data;
    //     } else {
    //         console.error("Failed to fetch meeting rooms.");
    //         return [];
    //     }
    // };


    console.log(getRoomsData, "getRoomsDatagetRoomsData")
    const onFinish = async (values: any) => {
        const start = values.startDateTime;
        const end = values.endDateTime;
        const startTimeISO = dayjs(start).toISOString();
        const endTimeISO = dayjs(end).toISOString();
        const rooms = getRoomsData || props.getData
        const mappedRoomId = rooms.find((i) => i.id === values.roomId)
        let roomApprover = mappedRoomId.roomApprover
        const dto = new RoomBookingDto(
            values.roomId,
            startTimeISO,
            endTimeISO,
            values.purpose,
            "",
            existing.user.userName,
            roomApprover
        );
        service.bookMeetingRoom(dto).then((res) => {
            if (res.status) {
                onReset()
                notification.success({ message: res.internalMessage });
                form.resetFields();
                closeModal();
                getData();
            }
        }).catch((error) => {
            console.error("Error during booking:", error);
        });
    };

    const onReset = () => {
        form.resetFields();
        setCollapseDisabled(true);
        setSelectedSlots([]);
        setSelectedRange(null);
        setAllDay(false);
        setShowAllDay(false);
        setStartDate(null);
        setDateSelected(null);
        setShowCollapse(false)
    };

    const disabledDate = (currentDate: Dayjs) => {
        if (!currentDate) {
            return false;
        }
        const today = dayjs().startOf('day');
        return currentDate < today;
    };

    const disabledTime = (currentDate: Dayjs | null) => {
        if (!currentDate) {
            return {};
        }
        const currentHours = dayjs().hour();
        const currentMinutes = dayjs().minute();
        const isToday = currentDate.isSame(dayjs(), 'day');

        const disabledHours = () => {
            const hours = Array.from({ length: 24 }, (_, i) => i);
            if (isToday) {
                return hours.filter(hour => hour < currentHours || blockedTimes.hours.includes(hour));
            }
            return blockedTimes.hours;
        };
        const disabledMinutes = (selectedHour: number) => {
            const minutes = Array.from({ length: 60 }, (_, i) => i);
            if (isToday && selectedHour === currentHours) {
                return minutes.filter(minute => minute < currentMinutes || blockedTimes.minutes[selectedHour]?.includes(minute));
            }
            return blockedTimes.minutes[selectedHour] || [];
        };
        return {
            disabledHours,
            disabledMinutes,
        };
    };

    const handleCalendarChange = (date: any) => {
        if (date) {
            form.setFieldsValue({
                startDateTime: date,
            });
            setShowAllDay(true);
            console.log('Selected Date & Time:', date.format('YYYY-MM-DD HH:mm'));
            const selectedDate = date.format('YYYY-MM-DD');
            setStartDate(date)
            setDateSelected(selectedDate);
            console.log("Selected start date:", selectedDate);
            if (selectedRoomId) {
                getSlotsForRoom(selectedRoomId, selectedDate);
                getSlotsBythirtyMin(selectedRoomId, selectedDate);
            }
        }
    }
    const handleStartChange = (date: Dayjs | null) => {
        form.setFieldsValue({ startDateTime: date });
        setStartDate(date); // Update the selected date

        const selectedDate = date ? date.format('YYYY-MM-DD') : null;
        const roomId = form.getFieldValue('roomId'); // Get roomId from form

        setDateSelected(selectedDate);

        if (roomId && selectedDate) {
            // getSlotsForRoom(roomId, selectedDate);
            getSlotsBythirtyMin(roomId, selectedDate);
        }
        const endDate = form.getFieldValue('endDateTime');
        if (date && endDate) {
            getRoomSlots(date, endDate);
        }
    };

    const handleEndChange = (date: Dayjs | null) => {
        form.setFieldsValue({ endDateTime: date });

        const roomId = form.getFieldValue('roomId');
        const startDate = form.getFieldValue('startDateTime');

        // Trigger validate only when both times and roomId are present
        if (date && roomId) {
            // Only validate if the start date is already set
            if (startDate) {
                validateTimeSlots({
                    startDate: startDate.format('YYYY-MM-DD HH:mm'),
                    endDate: date.format('YYYY-MM-DD HH:mm'),
                    roomId,
                });
            }
        }
        if (startDate && date) {
            getRoomSlots(startDate, date);
        }
    };
    const handleEndCalendarChange = (date: any) => {
        const roomId = form.getFieldValue('roomId');
        const startDate = form.getFieldValue('startDateTime');

        // Trigger validate only when both times and roomId are present
        if (date && roomId) {
            // Only validate if the start date is already set
            if (startDate) {
                validateTimeSlots({
                    startDate: startDate.format('YYYY-MM-DD HH:mm'),
                    endDate: date.format('YYYY-MM-DD HH:mm'),
                    roomId,
                });
            }
        }
    };

    const validateTimeSlots = async (dto: ValidationDateReq) => {
        try {
            const res = await service.validateTimeSlots(dto);
            if (!res.status) {
                notification.error({
                    message: 'Time Slot Error',
                    description: res.internalMessage,
                });
                // Reset the DatePicker fields
                form.resetFields(['startDateTime', 'endDateTime']);
            }
        } catch (error) {
            console.error('Failed to validate time slots:', error);
        }
    };

    const handleSlotClick = (slot: any) => {
        const isSelected = selectedSlots.some(selected => selected.startTime === slot.startTime);
        if (isSelected) {
            setSelectedSlots(selectedSlots.filter(selected => selected.startTime !== slot.startTime));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
        if (isSelected) {
            if (selectedSlots.length === 1) {
                form.setFieldsValue({
                    startDateTime: null,
                    endDateTime: null,
                });
            } else {
                const startTimes = selectedSlots.map(s => dayjs(s.startTime));
                const endTimes = selectedSlots.map(s => dayjs(s.endTime));
                const overallStart = dayjs.min(startTimes);
                const overallEnd = dayjs.max(endTimes);
                form.setFieldsValue({
                    startDateTime: overallStart,
                    endDateTime: overallEnd,
                });
            }
        } else {
            const startTimes = [...selectedSlots, slot].map(s => dayjs(s.startTime));
            const endTimes = [...selectedSlots, slot].map(s => dayjs(s.endTime));
            const overallStart = dayjs.min(startTimes);
            const overallEnd = dayjs.max(endTimes);
            form.setFieldsValue({
                startDateTime: overallStart,
                endDateTime: overallEnd,
            });
        }
    };

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={24} wrap={true}>

                    <Col span={8}>
                        <Form.Item
                            name="roomId"
                            label="Room"
                            rules={[{ required: true, message: "Please select a meeting room." }]}
                        >
                            <Select
                                placeholder="Select Meeting Room"
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                onChange={handleRoomChange}
                            >
                                {getRoomsData?.length > 0 ? getRoomsData.map((item: any) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.meetingRoom}
                                    </Option>
                                )) : props.getData?.map((item: any) => (
                                    <Option key={item.room?.id} value={item.room?.id}>
                                        {item.room?.meetingRoom}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            name="startDateTime"
                            label="Start Date & Time"
                            rules={[{ required: true, message: "Please select a start date and time." }]}
                        >
                            <DatePicker
                                allowClear={true}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                minuteStep={5} hourStep={1}
                                disabledDate={disabledDate}
                                disabledTime={disabledTime}
                                onChange={handleStartChange}
                                onCalendarChange={handleCalendarChange}
                                popupClassName="custom-time-picker"
                            />
                        </Form.Item>
                    </Col>
                    {showAllDay && (
                        <Col span={3}>
                            <Form.Item
                                name="allDay"
                                label="All Day"
                                valuePropName="checked"
                            >
                                <Switch checked={allDay} onChange={handleAllDayToggle} />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={6}>
                        <Form.Item
                            name="endDateTime"
                            label="End Date & Time"
                            rules={[{ required: true, message: "Please select a end date and time." }]}
                        >
                            <DatePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                minuteStep={5} hourStep={1}
                                disabledDate={disabledDate}
                                disabledTime={disabledTime}
                                onChange={handleEndChange}
                                onCalendarChange={(date, dateString, info) => handleEndCalendarChange(date as Dayjs | null)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="purpose" label="Agenda">
                            <TextArea style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="start" gutter={16}>
                    <Col>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Schedule
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button htmlType="button" danger icon={<UndoOutlined />} onClick={onReset}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    {!collapseDisabled && (
                        <Collapse defaultActiveKey={[]} ghost>
                            <Collapse.Panel
                                header={
                                    <span style={{ color: "black" }}>
                                        <PlusOutlined style={{ marginRight: 8 }} /> Available Time Slots
                                    </span>
                                } key="1">
                                <Row gutter={[16, 16]}>
                                    {slots && slots.map((slot, index) => (
                                        <Col key={index} span={8} style={{ minWidth: '100px', textAlign: 'center' }}>
                                            <Tag
                                                color={
                                                    selectedSlots.some((selected: any) => selected.startTime === slot.startTime)
                                                        ? 'darkblue'
                                                        : slot.status === 'Approved'
                                                            ? 'red'
                                                            : 'blue'
                                                }
                                                onClick={() => slot.status === 'Available' && handleSlotClick(slot)} // Call the click handler
                                                style={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    padding: '10px 1px',
                                                    lineHeight: '16px',
                                                    borderRadius: '5px',
                                                    cursor: slot.status === 'Available' ? 'pointer' : 'not-allowed',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {`${dayjs(slot.startTime).format('HH:mm')} - ${dayjs(slot.endTime).format('HH:mm')}`}
                                            </Tag>
                                        </Col>
                                    ))}
                                </Row>
                                {selectedRange && (
                                    <p style={{ marginTop: '20px', textAlign: 'center' }}>
                                        Selected Range: {selectedRange.start} - {selectedRange.end}
                                    </p>
                                )}
                            </Collapse.Panel>
                        </Collapse>
                    )}
                    {showCollapse && (
                        <Collapse defaultActiveKey={['1']} ghost>
                            <Collapse.Panel header="Available Rooms" key="1">
                                <Row gutter={[16, 16]}>
                                    {roomSlots && roomSlots.map((room) => (
                                        <Col key={room.roomId} span={8} style={{ minWidth: '200px', textAlign: 'center' }}>
                                            <Tag
                                                color={selectedRoomId === room.roomId ? 'blue' : 'green'} // Change color when selected
                                                style={{
                                                    fontWeight: '500',
                                                    textAlign: 'center',
                                                    padding: '10px 17px',
                                                    lineHeight: '16px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer', // Make the tag appear clickable
                                                }}
                                                onClick={() => {
                                                    if (selectedRoomId !== room.roomId) { // If the room is not already selected
                                                        form.setFieldsValue({ roomId: room.roomId }); // Set the selected roomId in the form
                                                        setSelectedRoomId(room.roomId); // Update the selected room state
                                                    }
                                                }}
                                            >
                                                {room.roomName}
                                            </Tag>
                                        </Col>
                                    ))}
                                </Row>
                            </Collapse.Panel>
                        </Collapse>
                    )}
                </Row>
            </Form>
        </Card>
    );
};

export default MeetingRoomSchedule;