import { MettingRoomService } from '@hrexpert/shared-services'
import { Button, Card, Col, message, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'

export default function MeetingRoomCardView() {
    const [mettingRoomData, setMeetingRoomData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const service = new MettingRoomService()

    useEffect(() => { 
        getAllMeetingRooms()
    }, [])
    
    const getAllMeetingRooms = () => {
        setLoading(true)
        try {
            service.getAllMeetingRooms().then((res) => {
                if (res.status) {
                    setMeetingRoomData(res.data)
                    setLoading(false)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getStatusTag = (status: string) => {
        switch (status) {
          case "Available":
            return <Tag color="green">Available</Tag>;
          case "Occupied":
            return <Tag color="red">Occupied</Tag>;
          case "Under Maintenance":
            return <Tag color="orange">Under Maintenance</Tag>;
          default:
            return <Tag>Unknown</Tag>;
        }
      };

    return (
        <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          {mettingRoomData.map((room:any) => (
            <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={room.meetingRoom}
                extra={getStatusTag("Available")}
                style={{ borderRadius: "8px" }}
              >
               
                {room.status === "Available" && (
                  <Button type="primary" block>
                    Book Now
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
}
