import {
  CheckCircleOutlined,
  ExportOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';
import { AttendanceServices } from '@hrexpert/shared-services';
import { Card, Col, DatePicker, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IoMdMan, IoMdWoman } from 'react-icons/io';
import { RiUserFollowFill, RiUserForbidFill, RiUserReceived2Fill, RiUserShared2Fill } from "react-icons/ri";
const { Title } = Typography;


const AttendanceCard = (props: CommonDashboardProps) => {
  const attendanceService = new AttendanceServices();
  const [attdData, setAttdData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );

  useEffect(() => {
    dailyAttendance();
  }, [selectedDate, props.branchId,props.departmentId,props.divisionId,props.empTypeId]);

  const dailyAttendance = () => {
    const req = new DashboardReq(props.branchId, selectedDate,props.divisionId, props.departmentId,props.empTypeId);
    attendanceService.dailyAttendance(req).then((res) => {
      if (res.status) {
        setAttdData(res.data);
      } else {
        setAttdData([]);
      }
    });
  };

  const attendanceData = [
    {
      title: 'Checked In',
      count: attdData[0]?.totalCheckedIn,
      men: attdData[0]?.maleCheckedIn,
      women: attdData[0]?.femaleCheckedIn,
      icon: (
        <RiUserReceived2Fill style={{ fontSize: '36px', color: '#20C997' }} />
      ),
      color: '#20C997',
    },
    {
      title: 'Checked Out',
      count: attdData[0]?.totalCheckedOut,
      men: attdData[0]?.maleCheckedOut,
      women: attdData[0]?.femaleCheckedOut,
      icon: <RiUserShared2Fill style={{ fontSize: '36px', color: '#DC3545' }} />,
      color: '#DC3545',
    },
    {
      title: 'On Leave',
      count: attdData[0]?.totalLeaveCount,
      men: attdData[0]?.maleLeave,
      women: attdData[0]?.femaleLeave,
      icon: <RiUserFollowFill style={{ fontSize: '36px', color: '#FF851B' }} />,
      color: '#FF851B',
    },
    {
      title: 'Absent',
      count: attdData[0]?.totalAbsentCount,
      men: attdData[0]?.maleAbsent,
      women: attdData[0]?.femaleAbsent,
      icon: <RiUserForbidFill style={{ fontSize: '36px', color: '#E83E8C' }} />,
      color: '#E83E8C',
    },
  ];

  const handleDateChange = (date: any, dateString: string) => {
    setSelectedDate(dateString);
  };

  const disabledFutureDates = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <Card
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        height: '100%',
      }}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={4} style={{ margin: 0 }}>{`Attendance on ${dayjs(selectedDate).format('D MMM')}`}</Title>
          {/* <span>{`Attendance on ${dayjs(selectedDate).format('D MMM')}`}</span> */}
          <DatePicker
            defaultValue={dayjs()}
            format="YYYY-MM-DD"
            onChange={handleDateChange}
            allowClear={false}
            disabledDate={disabledFutureDates}
          />
        </div>
      }
    >
      <Row gutter={[16, 16]} justify="space-between">
        {attendanceData.map((card, index) => (
          <Col key={index} xs={12} sm={12} md={12}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
                height: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      color: '#000',
                      fontWeight: 'bold',
                    }}
                  >
                    {card.title}
                  </Typography.Title>
                  <Typography.Title
                    level={3}
                    style={{
                      margin: '8px 0 0',
                      color: card.color,
                      fontWeight: 'bold',
                    }}
                  >
                    {card.count}
                  </Typography.Title>
                </div>
                <div style={{ textAlign: 'right' }}>{card.icon}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                }}
              >
                <Typography.Text
                  style={{
                    color: card.color,
                    fontSize: '14px',
                  }}
                >
                  {card.men} Men
                  <IoMdMan/>
                </Typography.Text>
                <Typography.Text
                  style={{
                    color: card.color,
                    fontSize: '14px',
                  }}
                >
                  {card.women} Women
                  <IoMdWoman/>
                </Typography.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default AttendanceCard;
