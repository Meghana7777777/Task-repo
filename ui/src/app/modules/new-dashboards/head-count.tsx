import {
  FrownOutlined,
  SmileOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { CommonDashboardProps, DashboardReq } from '@hrexpert/shared-models';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Card, Col, Row, Typography, Spin, message, Tooltip } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { IoMdMan, IoMdWoman } from 'react-icons/io';
import { MdGroup, MdPersonPin } from 'react-icons/md';

const HeadCountAndAttendance = (props: CommonDashboardProps) => {
  const empService = new EmployeeOnboardingService();
  const [mainData, setMainData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getHeadCount = useCallback(() => {
    setLoading(true);
    const req = new DashboardReq(props.branchId,undefined,props.divisionId,props.departmentId,props.empTypeId);
    empService.getHeadCount(req).then((res) => {
        if (res.status) {
          setMainData(res.data);
        } else {
          setMainData([]);
        }
      }).catch((error) => {
        message.error('Failed to fetch headcount data.');
        console.log('Failed to fetch headcount data:', error);
      }).finally(() => {
        setLoading(false);
      });
  }, [props.branchId, props.departmentId, props.divisionId, props.empTypeId]);

  useEffect(() => {
    getHeadCount();
  }, [getHeadCount]);

  const headCountData = [
    {
      title: 'Total Employees',
      count: mainData[0]?.totalEmp,
      men: mainData[0]?.totalMaleCount,
      women: mainData[0]?.totalFemaleCount,
      icon: <MdGroup style={{ fontSize: '36px', color: '#1E90FF' }} />,
      color: '#1E90FF',
    },
    {
      title: 'Active',
      count: mainData[0]?.totalActiveEmp,
      men: mainData[0]?.totalActiveMaleCount,
      women: mainData[0]?.totalActiveFemaleCount,
      icon: <SmileOutlined style={{ fontSize: '36px', color: '#28A745' }} />,
      color: '#28A745',
    },
    {
      title: 'Inactive',
      count: mainData[0]?.totalInActiveEmp,
      men: mainData[0]?.totalInActiveMaleCount,
      women: mainData[0]?.totalInActiveFemaleCount,
      icon: <FrownOutlined style={{ fontSize: '36px', color: '#6C757D' }} />,
      color: '#6C757D',
    },
    {
      title: (
        <>
          New Joins{' '}
          <Tooltip title="In last 2 months">
            <Typography.Text
              style={{
                marginLeft: '4px',
                color: '#FFC107',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ℹ️
            </Typography.Text>
          </Tooltip>
        </>
      ),
      count: mainData[0]?.totalNewEmp,
      men: mainData[0]?.totalNewMale,
      women: mainData[0]?.totalNewFemale,
      icon: <UserAddOutlined style={{ fontSize: '36px', color: '#FFC107' }} />,
      color: '#FFC107',
    },
    {
      title: (
        <>
          ReJoin{' '}
          <Tooltip title="In last 2 months">
            <Typography.Text
              style={{
                marginLeft: '4px',
                color: '#FFC107',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ℹ️
            </Typography.Text>
          </Tooltip>
        </>
      ),
      count: mainData[0]?.totalRejoinEmp,
      men: mainData[0]?.totalRejoinMale,
      women: mainData[0]?.totalRejoinFemale,
      icon: <MdPersonPin style={{ fontSize: '36px', color: '#17A2B8' }} />,
      color: '#17A2B8',
    },
  ];

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} justify="space-between">
        {headCountData.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={4}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                height: '100%',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
                <Typography.Title
                  level={5}
                  style={{
                    color: '#000',
                    margin: '0 0 0 8px',
                    fontWeight: 'bold',
                  }}
                >
                  {card.title}
                </Typography.Title>
              </div>
              <Typography.Title
                level={2}
                style={{
                  fontSize: '32px',
                  margin: '8px 0',
                  color: card.color,
                }}
              >
                {card.count}
              </Typography.Title>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                }}
              >
                <Typography.Text
                  style={{
                    display: 'block',
                    color: card.color,
                    fontSize: '14px',
                  }}
                >
                  <IoMdMan style={{ marginRight: '4px' }} />
                  {card.men} Men
                </Typography.Text>
                <Typography.Text
                  style={{
                    display: 'block',
                    color: card.color,
                    fontSize: '14px',
                  }}
                >
                  <IoMdWoman style={{ marginRight: '4px' }} />
                  {card.women} Women
                </Typography.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

export default HeadCountAndAttendance;
