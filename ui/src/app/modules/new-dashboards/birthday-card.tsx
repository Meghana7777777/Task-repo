import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Typography, Divider, message, Tooltip } from 'antd';
import { GiftOutlined, CalendarOutlined } from '@ant-design/icons';
import { FaBirthdayCake, FaWhatsapp } from 'react-icons/fa';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';

const { Title, Text } = Typography;


const BirthdayCard = (props: CommonDashboardProps) => {
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const service = new EmployeeOnboardingService();

  useEffect(() => {
    getDOBofEmp();
  },[props.branchId,props.departmentId,props.divisionId,props.empTypeId]);

  const getDOBofEmp = async () => {
    const req =  new DashboardReq(props.branchId,undefined,props.divisionId,props.departmentId, props.empTypeId)
    const res = await service.getDOBofEmp(req);
    res.status ? setBirthdays(res.data) : setBirthdays([]);
  };

  const sendBirthdayMessages = async () => {
    const req =  new DashboardReq(props.branchId,undefined,props.divisionId,props.departmentId, props.empTypeId)
    const res = await service.sendBirthdayMessages(req);
    message[res.status ? 'success': 'error'](res.internalMessage,2)
  };

  const today = (() => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  })();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  const todaysBirthdays = birthdays.filter((b) => formatDate(b.date) === today);
  const upcomingBirthdays = birthdays.filter((b) => formatDate(b.date) > today);

  const birthdayListStyle: React.CSSProperties = {
    maxHeight: '250px',
    overflowY: 'auto',
    paddingRight: '10px',
  };

  const sendMessage =()=>{
    sendBirthdayMessages()
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GiftOutlined style={{ fontSize: '1.5em', color: '#ff6f61' }} />
          <span> Birthdays</span>
        </div>
      }
      extra={
        <Tooltip title={'Send Birthday Wishes'}>
          <FaWhatsapp 
          style={{
            color: '#52c41a',
            fontSize: '30px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            paddingTop: '2px'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={sendMessage}
        />
        </Tooltip>
    }
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '350px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div style={{ flex: 1, paddingRight: '10px' }}>
          <span
            style={{
              color: '#52c41a',
              marginBottom: '8px',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <CalendarOutlined /> Today's Birthdays
            </div>
            {/* <FaWhatsapp style={{fontSize: '20px'}}/> */}
          </span>
          <div style={birthdayListStyle}>
            {todaysBirthdays.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={todaysBirthdays}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: '#f56a00',
                            verticalAlign: 'middle',
                          }}
                          icon={<FaBirthdayCake style={{ color: 'white' }} />}
                        />
                      }
                      title={<Text strong>{item.name}</Text>}
                      description={`Department: ${item.department} | Branch: ${item.branchName}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text>No birthdays today 🎂</Text>
            )}
          </div>
        </div>

        <Divider type="vertical" style={{ height: '100%' }} />

        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <span
            style={{ color: '#1890ff', marginBottom: '8px', fontSize: '16px' }}
          >
            <CalendarOutlined /> Upcoming Birthdays
          </span>
          <div style={birthdayListStyle}>
            {upcomingBirthdays.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={upcomingBirthdays}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: '#87d068',
                            verticalAlign: 'middle',
                          }}
                          icon={<FaBirthdayCake style={{ color: 'white' }} />}
                        />
                      }
                      title={<Text strong>{item.name}</Text>}
                      description={`Date: ${formatDate(item.date)} | Department: ${item.department} | Branch: ${item.branchName}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text>No upcoming birthdays 🎉</Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BirthdayCard;
