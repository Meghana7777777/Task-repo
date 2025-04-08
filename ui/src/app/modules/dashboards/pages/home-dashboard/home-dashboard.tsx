import { CheckOutlined, UsergroupAddOutlined, WarningOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import { Col, Row, Typography } from 'antd'
import EmployeeTableView from '../../../employee-management/employee-onboard/components/employees-table-view/employee-table-view'
import AddEmployeeCard from '../../components/add-employee-card/add-employee-card'
import AttendanceStatisticCard from '../../components/attendance-statistic-card/attendance-statistic-card'
import OnTimeVsLateDashboard from '../../components/ontime-vs-late-dashboard/ontime-vs-late-dashboard'
import DeptWiseEmployeePieChart from './dept-wise-emp-chart'
const { Text } = Typography;

export default function HomeDashboard() {
    return (
        <PageContainer title={"Dashboard"}>
            <Row gutter={[24, 24]}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <AttendanceStatisticCard icon={<UsergroupAddOutlined />} iconColor={'#1890ff'} label='Total' bgColor={'#E6F7FF'} count={200} countColor={'#1890ff'} />

                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <AttendanceStatisticCard icon={<CheckOutlined />} iconColor={'#52C41A'} bgColor={'#E6FFEB'} label={'Checked-In'} count={1000} countColor={'#52C41A'} />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <AttendanceStatisticCard icon={<WarningOutlined />} iconColor={'#FF4D4F'} bgColor={'#FFEFEF'} label={'Not Checked-In'} count={200} countColor={'#FF4D4F'} />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
                            <AddEmployeeCard />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <OnTimeVsLateDashboard />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <DeptWiseEmployeePieChart />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <EmployeeTableView employeeData={[]} />
                </Col>

            </Row>
            <Row style={{ paddingTop: '20px' }} gutter={[24, 24]}>

            </Row>
        </PageContainer>
    )
}
