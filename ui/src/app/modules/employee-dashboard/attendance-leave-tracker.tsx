import { ProCard } from "@ant-design/pro-components";
import { AttendanceDto, EmpDataReq } from "@hrexpert/shared-models";
import { AttendanceServices, LeaveAllocationService } from "@hrexpert/shared-services";
import { Card, Col, DatePicker, Progress, Row, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useIAMClientState } from "../../common/iam-client-react";
import dayjs from "dayjs";
import { RiUserFollowFill, RiUserForbidFill, RiUserReceived2Fill, RiUserShared2Fill } from "react-icons/ri";
import { IoMdMan, IoMdWoman } from "react-icons/io";
import { ContactsFilled, FieldTimeOutlined, PhoneFilled } from "@ant-design/icons";

const AttendanceLeaveTracker = () => {
  const [leavesData, setLeavesData] = useState<any>([])
  const [attnData, setAttnData] = useState<any>([]);
  const [CurrentAttnData, setCurrentAttnData] = useState<any>([]);
  const data = JSON.parse(localStorage.getItem('currentUser'))
  const leaveAllocationService = new LeaveAllocationService()
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const service = new AttendanceServices;
  const [selectedDate, setSelectedDate] = useState<any>()


  useEffect(() => {
    getLeaveAllocationData()
    getAllAttendance()
  }, [])

  const getAllAttendance = (value? : string) => {
    const req = new AttendanceDto();
    req.attnFromDate = value? dayjs(value).format('YYYY-MM-DD') as any : dayjs().format('YYYY-MM-DD') as any;
    req.attnToDate = value? dayjs(value).format('YYYY-MM-DD') as any : dayjs().format('YYYY-MM-DD') as any;
    req.employeeCode = IAMClientAuthContext.user.employeeCode;
    try {
      service.getAllAttendance(req).then((res) => {
        if (res.status) {
          setAttnData(res.data);
          setCurrentAttnData(res.data)
          setSelectedDate(res.data.find((rec) => rec.attendanceDate === (value || dayjs().format('YYYY-MM-DD'))));
        }
      });
    } catch (err) {
      console.log(err);
      setAttnData([]);
    }
  };


  const getLeaveAllocationData = () => {
    const req = new EmpDataReq(Number(IAMClientAuthContext.user.employeeId), null, null, dayjs().format('YYYYMM'), null,
      IAMClientAuthContext.user.unitId, null, 1, null, IAMClientAuthContext.user.employeeCode
    );
    try {
      leaveAllocationService.getAllNewLeaveAllocationsLeaveTypes(req).then((res) => {
        if (res.status) {
          setLeavesData(res.data)
        } else {
          setLeavesData([])
        }
      })
    } catch (err) {
      console.log(err);
    }
  }



  const attendanceData = [
    {
      title: 'Checked In',
      count: selectedDate?.inTime ? dayjs(selectedDate?.inTime).format('DD-MM-YYYY HH:mm:ss') : '-',
      icon: (
        <RiUserReceived2Fill style={{ fontSize: '36px', color: '#20C997' }} />
      ),
      color: '#20C997',
    },
    {
      title: 'Checked Out',
      count: selectedDate?.outTime ? dayjs(selectedDate?.outTime).format('DD-MM-YYYY HH:mm:ss') : '-',
      icon: <RiUserShared2Fill style={{ fontSize: '36px', color: '#DC3545' }} />,
      color: '#DC3545',
    },
    {
      title: 'Late Minutes - Day',
      count: selectedDate?.lateMin,
      icon: <RiUserFollowFill style={{ fontSize: '36px', color: '#FF851B' }} />,
      color: '#FF851B',
    },
    {
      title: 'Total Late Minutes - Month',
      count: selectedDate?.cumLateMin,
      icon: <RiUserForbidFill style={{ fontSize: '36px', color: '#E83E8C' }} />,
      color: '#E83E8C',
    },
  ];

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'leaveCode',
      key: 'leaveCode',
    },
    {
      title: 'Total',
      dataIndex: 'leavesAlloted',
      key: 'leavesAlloted',
    },
    {
      title: 'Used',
      dataIndex: 'leavesUsed',
      key: 'leavesUsed',
    },
    {
      title: 'Available',
      dataIndex: 'available',
      key: 'available',
    },
  ];

  return (

    <>
      <ProCard gutter={20} split="vertical" style={{ background: 'transparent', boxShadow: 'none' }}>
        <ProCard colSpan="60%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }} >
          <ProCard
            style={{ marginBottom: '1rem' }}
            title={<><FieldTimeOutlined /> 
            <DatePicker defaultValue={dayjs()} allowClear={false} format={'YYYY-MM-DD'} onChange={(date)=> getAllAttendance(dayjs(date).format('YYYY-MM-DD')) } style={{marginLeft:'10px', marginRight:'10px'}}/>
            - {selectedDate?.attnStatus === 'P' ||  selectedDate?.attnStatus === 'WP' || selectedDate?.attnStatus === 'HP' ? 'Present' : selectedDate?.attnStatus === 'P/2' || selectedDate?.attnStatus === 'WP/2' || selectedDate?.attnStatus === 'HP/2' ? 'Half Day' : 'Absent'}</>}
            bordered
            headerBordered
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
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
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>

          </ProCard>

        </ProCard>


        <ProCard colSpan="40%" split="horizontal" style={{ background: 'transparent', boxShadow: 'none' }}>
          <ProCard
            style={{ marginBottom: '1rem' }}
            title={<><ContactsFilled /> Leaves </>}
            bordered
            headerBordered
          >
            <Table columns={columns} dataSource={leavesData} pagination={false} />
          </ProCard>
        </ProCard>
      </ProCard>



    </>
  );
};

export default AttendanceLeaveTracker;
