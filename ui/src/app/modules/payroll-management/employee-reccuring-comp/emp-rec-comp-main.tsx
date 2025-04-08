
import { Tabs } from 'antd';
import EmployeeRecurringComponent from './employee-recurring-component';
import EmpRecCompExcel from './emp-rec-comp-excel';
import { EmpRecComponentsSharedDto } from '@hrexpert/shared-models';

const { TabPane } = Tabs;

const EmpRecComponentTabs = () => {
  
  return (
    <Tabs defaultActiveKey="1" type="card" >
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Manual Entry</span>} key="1">
        <EmployeeRecurringComponent empRecCompData={undefined} isUpdate={false} updateDetails={function (hrms: EmpRecComponentsSharedDto): void {
                  throw new Error('Function not implemented.');
              } }/>
      </TabPane>
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Excel Upload</span>} key="2">
        <EmpRecCompExcel />
      </TabPane>
      
    </Tabs>
  );
};

export default EmpRecComponentTabs;