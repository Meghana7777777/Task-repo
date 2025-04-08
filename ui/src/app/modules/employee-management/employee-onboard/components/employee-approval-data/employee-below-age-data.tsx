import { PageContainer } from '@ant-design/pro-layout';
import { Table, Tabs, Typography } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import EmployeeApprovalData from './employee-approval-data';
import EmployeeBelowAgeWorkingData from './employee-below-age-working-data';

const { Title } = Typography;

const EmployeeBelowAgeData = () => {
  
    
    return (
        <>

            <PageContainer title="Employees Approval" breadcrumbRender={false}>
                <Tabs defaultActiveKey="OPEN">
                  

                    <TabPane tab="APPROVE" key="APPROVE">
                      <EmployeeApprovalData />  
                    </TabPane>
                    <TabPane tab="WORKING" key="WORKING">
                   < EmployeeBelowAgeWorkingData />
                    </TabPane>
                </Tabs>
            </PageContainer>
        </>

    );
};

export default EmployeeBelowAgeData;
