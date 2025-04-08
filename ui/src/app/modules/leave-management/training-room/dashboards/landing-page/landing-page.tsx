import { orange } from '@ant-design/colors';
import { MeetingRoomIdReq } from '@hrexpert/shared-models';
import { MettingRoomService, TrainingCenterSharedService } from '@hrexpert/shared-services';
import { Descriptions, Modal, Skeleton, Tabs, Tag, Tooltip } from 'antd';
import moment from "moment";
import { useEffect, useState } from 'react';
import { Event as BigCalendarEvent, Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MeetingRoomSchedule from '../../training center schedule/training-center-schedule';

interface landingPageProps {
  meetingRoom: string;
  isActive: number;
  roomStatus: string;
  location: string | null;
  capacity: number | null;
  fileName: string;
}

const localizer = momentLocalizer(moment);

interface CustomEvent extends BigCalendarEvent {
  resource: string;
  title: string;
  start: Date;
  end: Date;
  createdUser: string;
  approveStatus: string;
}

export default function TrainingLandingPage(props: landingPageProps) {
  const [data, setData] = useState<any>();
  const [events, setEvents] = useState<CustomEvent[] | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [activeMeetingRooms, setActiveMeetingRooms] = useState<any[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<any | null>("0")
  const [selectedRoomData, setSelectedRoomData] = useState<any>()
  const [loading, setLoading] = useState(false);
  const service = new TrainingCenterSharedService();

  useEffect(() => {
    getActiveMeetingRooms()
  }, []);

  useEffect(() => {
    getMeetingEventsData();

  }, [selectedRoomId])

  const getMeetingEventsData = () => {
    setLoading(true);
    const req = new MeetingRoomIdReq(Number(selectedRoomId));
    service.getMeetingSchedules(req).then((res) => {
      if (res.status) {
        setData(res.data);
        if (res.data && res.data.length) {
          const filteredData = res.data.filter(
            (booking: any) =>
              (booking.roomStatus === "Booked" && booking.approveStatus === "Approved") ||
              (booking.roomStatus === "Pending" && booking.approveStatus === "Open")
          );
          const eventsTemp = transformDataToEvents(filteredData);
          setEvents(eventsTemp);
        } else {
          setEvents([]);
        }
      }
    }).finally(() => setLoading(false));
  };

  const getActiveMeetingRooms = () => {
    setLoading(true)
    service.getActiveMeetingRooms().then((res) => {
      if (res.status) {
        setActiveMeetingRooms(res.data)
        setSelectedRoomId(String(res.data[0].id));
      }
    }).finally(() => setLoading(false))
  }

  const transformDataToEvents = (data: any): CustomEvent[] => {
    return data.map((booking: any) => {
      return {
        id: booking.id,
        title: `${booking.purpose} `,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        resource: booking.roomStatus,
        createdUser: booking.createdUser || 'N/A',
        approveStatus: booking.approveStatus
      };
    });
  };

  const handleEventClick = (event: CustomEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDateClick = (slotInfo: { start: Date }) => {
    const currentTime = new Date();
    const currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    const slotDate = new Date(slotInfo.start.getFullYear(), slotInfo.start.getMonth(), slotInfo.start.getDate());
    if (currentDate.getTime() === slotDate.getTime()) {
      if (slotInfo.start > currentTime) {
        setSelectedDate(slotInfo.start);
      } else {

        Modal.warning({
          okButtonProps: { style: { background: orange[5] } },
          title: 'Invalid Time Selection',
          content: (
            <div>
              <p>You cannot select a time that has already passed. Please select a future time.</p>
            </div>
          ),
          onOk() { },
        });
      }
    } else {
      setSelectedDate(slotInfo.start);
    }
    // Find the selected room object by its ID
    console.log(selectedRoomId)
    const selectedRoomDataTemp = activeMeetingRooms.find(room => room.id === Number(selectedRoomId));
    // Log the full room details
    console.log("Currently in tab:", selectedRoomDataTemp);
    setSelectedRoomData(selectedRoomDataTemp.id)
    if (slotInfo.start > currentTime) {
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Approved":
        return <Tag color="green">{status}</Tag>;
      case "Canceled":
        return <Tag color="red">{status}</Tag>;
      case "Open":
        return <Tag color="orange">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getTabItems = () => {

    if (activeMeetingRooms.length) {
      return activeMeetingRooms.map((v, index) => {
        return {
          key: String(v.id),
          label: v.meetingRoom,
          children: <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            defaultView='day'
            onSelectSlot={handleDateClick}
            eventPropGetter={(event: any) => {
              let backgroundColor = "#3174ad";
              if (event.resource === "Available") backgroundColor = "green";
              if (event.resource === "Booked") backgroundColor = "#2E8BC0";
              if (event.resource === "Canceled") backgroundColor = "orange";
              if (event.approveStatus === "Open") backgroundColor = "#F0A04B";
              if (event.roomStatus === "Pending") backgroundColor = "#F0A04B";
              return { style: { backgroundColor } };
            }}
            components={{
              dateCellWrapper: ({ children, value }) => (
                <Tooltip title="Add New Schedule">
                  <div>{children}</div>
                </Tooltip>
              ),
            }}
            onSelectEvent={handleEventClick}
          />,
        }
      })
    }
  }

  const onTabChange = (key: any) => {
    setSelectedRoomId(key)
  }

  console.log(selectedRoomId, "selectedRoomIdselectedRoomId")
  return (
    <div style={{ height: "80vh", margin: "20px" }}>
      <h2>Booking Calendar</h2>
      <Skeleton loading={loading}>
        <Tabs activeKey={selectedRoomId || "default"} onChange={onTabChange} destroyInactiveTabPane items={getTabItems()} />
      </Skeleton>
      <Modal
        title="Event Details"
        open={isModalOpen}
        width={700}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedEvent && (
          <>
            <Descriptions column={2} bordered size='middle'>
              <Descriptions.Item label={<b>Room:</b>}><b>{selectedEvent.title}</b></Descriptions.Item>
              <Descriptions.Item label={<b>Created By</b>}><b>{selectedEvent.createdUser}</b></Descriptions.Item>
              <Descriptions.Item label={<b>Start</b>}><b>{moment(selectedEvent.start).format('YYYY-MM-DD HH:mm')}</b></Descriptions.Item>
              <Descriptions.Item label={<b>End</b>}><b>{moment(selectedEvent.end).format('YYYY-MM-DD HH:mm')}</b></Descriptions.Item>
              <Descriptions.Item label={<b>Status</b>}><b>{getStatusTag(selectedEvent.approveStatus)}</b></Descriptions.Item>
            </Descriptions>
            {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>
                <strong>Room:</strong> {selectedEvent.title}
              </span>
              <span>
                <strong>Created By:</strong> {selectedEvent.createdUser}
              </span>
            </div>
            <div >
              <span>
                <strong>Start timeselectedEvent:</strong> {moment(.start).format('YYYY-MM-DD HH:mm')}
              </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>
                <strong>End time:</strong> {moment(selectedEvent.end).format('YYYY-MM-DD HH:mm')}
              </span><br />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>
                <strong>Status:</strong> {getStatusTag(selectedEvent.approveStatus)}
              </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div> */}
          </>
        )}
      </Modal>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={'75%'}
      >
        <MeetingRoomSchedule selectedDate={selectedDate} closeModal={handleCancel} getData={null} selectedRoom={selectedRoomData} selectedTimeRange={null} />
      </Modal>

    </div>
  );
}
