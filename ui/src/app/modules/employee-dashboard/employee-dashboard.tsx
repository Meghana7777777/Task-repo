import { CustomerServiceOutlined, DollarOutlined, ExceptionOutlined, FileTextOutlined, PieChartOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { configVariables, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Badge, Image, Typography } from 'antd';
import { useEffect, useState } from 'react';
import PersonalInformation from './personal-information-card';
import EmployeeInformationCard from './employee-information-card';
import PayrollInformationCard from './payroll-information-card';
import EmployeeTickets from './tickets/employee-tickets';
import AttendanceLeaveTracker from './attendance-leave-tracker';

const EmployeeDashboard = () => {
    const [activeTabKey, setActiveTabKey] = useState('1')
    const [empData, setEmpData] = useState<any>([])
    const [RMData, setRMData] = useState<any>([])
    const empservice = new EmployeeOnboardingService()
    const data = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(() => {
        getAllEmployeesPersonalImformationManagement()
    }, [])

    const getAllEmployeesPersonalImformationManagement = () => {
        try {
            const req = { employeeCode: data.user.employeeCode }
            //const req = { employeeId: 1 }
            empservice.getAllEmployeesPersonalImformationManagement(req).then((res) => {
                if (res.status) {
                    setEmpData(res.data[0])
                    setRMData(res.data1[0])
                } else {
                    setEmpData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const renderTabContent = () => {
        switch (activeTabKey) {
            case '1':
                return <PersonalInformation empData={empData} />
            case '2':
                return <EmployeeInformationCard empData={empData} RMData={RMData} />
            case '3':
                return <PayrollInformationCard />
            case '4':
                return <AttendanceLeaveTracker />
            case '5':
                return <EmployeeTickets />
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                background: '#F5F7FA',
            }}
        >
            <PageContainer
                fixedHeader
                header={{
                    title: (
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'left', margin: '10px', padding: '10px', height: '100%', }}>
                            <Image
                                src={empData?.fileName ? configVariables.IMAGE_UPLOAD_URL + empData?.fileName : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png'}
                                alt="Employee"
                                width={100}
                                height={100}
                                style={{
                                    borderRadius: '50%',
                                }}
                                preview={true}
                            />
                            <div style={{ marginLeft: '2rem' }}>
                                <h3>{empData?.employeeName} - {empData?.employeeCode}</h3>
                                <Badge
                                    count={empData.isActive ? '• Active' : '• In Active'}
                                    style={{
                                        backgroundColor: empData.isActive ? '#52c41a' : '#f5222d',
                                        borderRadius: '8px',
                                        padding: '0 8px',
                                        marginTop: '-30px',
                                    }}
                                />
                            </div>
                        </div>
                    ),
                }}
                tabList={[
                    {
                        tab: (
                            <span>
                                <UserOutlined /> Personal Information
                            </span>
                        ),
                        key: '1',
                    },
                    {
                        tab: (
                            <span>
                                <FileTextOutlined /> Employee Information
                            </span>
                        ),
                        key: '2',
                    },
                    // {
                    //     tab: (
                    //         <span>
                    //             <DollarOutlined /> Payroll
                    //         </span>
                    //     ),
                    //     key: '3',
                    // },
                    {
                        tab: (
                            <span>
                                <PieChartOutlined /> Attendance & Leave Tracker
                            </span>
                        ),
                        key: '4',
                    },
                    {
                        tab: (
                            <span>
                                <CustomerServiceOutlined /> Support
                            </span>
                        ),
                        key: '5',
                    },
                ]}
                onTabChange={setActiveTabKey}
            >
                <ProCard direction="column" ghost gutter={[0, 16]}>
                    {renderTabContent()}
                </ProCard>
            </PageContainer>
        </div>
    );
};

export default EmployeeDashboard;
