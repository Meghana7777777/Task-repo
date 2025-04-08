
import { Tabs } from 'antd';
import LeaveAllocation from './leave-allocation';
import LeaveAllocationExcel from './leave-allocation-excel';
import LeaveAllocationView from '../leave-allocation-grid/leave-allocation-view';

const { TabPane } = Tabs;

const AllocationTabs = () => {

  return (
    <Tabs defaultActiveKey="1" type="card" >
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Manual Entry</span>} key="1">
        <LeaveAllocationView scopes={[]} />
      </TabPane>
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Excel Upload</span>} key="2">
      <LeaveAllocationExcel/>
      </TabPane>
    </Tabs>
  );
};

export default AllocationTabs;