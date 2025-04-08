import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, message } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { MettingRoomService } from "@hrexpert/shared-services";

const localizer = momentLocalizer(moment);

const ReactCalendar = () => {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const service = new MettingRoomService();

    useEffect(() => {
        getMeetingSchedules();
    }, []);

    const getMeetingSchedules = async () => {
        setLoading(true);
        try {
            const res = await service.getMeetingSchedules();
            if (res.status) {
                const formattedEvents = res.data.map((item: any) => ({
                    id: item.id,
                    title: `${item.room.meetingRoom} - ${item.roomStatus}`,
                    start: new Date(item.startTime),
                    end: new Date(item.endTime),
                    resource: item,
                }));
                setEvents(formattedEvents);
            } else {
                message.error(res.internalMessage);
            }
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch meeting schedules.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title={'Meeting Room Schedule'}>
            {/* <h2>Meeting Room Schedule</h2> */}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                style={{ height: 500, margin: "20px" }}
                defaultView="week"
                eventPropGetter={(event) => {
                    const backgroundColor = event.resource.roomStatus === "Booked" ? "#f56c6c" : "#67c23a";
                    return { style: { backgroundColor } };
                }}
            />
        </PageContainer>
    );
};

export default ReactCalendar;