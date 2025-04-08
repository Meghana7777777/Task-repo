
import { message, Tabs } from 'antd';

import AttendanceExcel from './attendance-excel';
import AttendanceAdjustment from './attendance-adjustment-form';
import AttendanceAdjustmentForBulk from './attendance-adjustment-bulk-applay';
import { ScopesEnum } from '@hrexpert/shared-models';
import LateMinutescalculationInterface from '../reports/late-minutes-cal-interface';

interface AttendanceAdjustmentIProps {
    scopes?: ScopesEnum[]
}

const { TabPane } = Tabs;

const AttendanceTabs = (props: AttendanceAdjustmentIProps) => {
  

  

  return (
    <Tabs defaultActiveKey="1" type="card" >
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Manual Entry</span>} key="1">
        <AttendanceAdjustment isUpdate={false} applyForLeavesData={undefined} updateDetails={undefined} closeForm={() => { }}/>
      </TabPane>
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Excel Upload</span>} key="2">
        <AttendanceExcel />
      </TabPane>
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Bulk Entry</span>} key="3">
        <AttendanceAdjustmentForBulk PropsScopes={props.scopes} />
      </TabPane>
      <TabPane tab={<span style={{fontWeight:'bolder'}}>Late Minutes Calculations</span>} key="4">
        <LateMinutescalculationInterface  PropsScopes={props.scopes}/>
      </TabPane>
      
      {/* <TabPane tab={<span style={{fontWeight:'bolder'}}>Update Attendance</span>} key="3">
        <Card 
        title={<span style={{ color: 'white' }}>Update Attendance</span>}
        headStyle={{ backgroundColor: '#69c0ff', border: 0 }}
        style={{ textAlign: 'center' }}
        >
           <Space size="middle" style={{ width: '100%', justifyContent: 'center'}}>
           <Popconfirm title={'Are you Adjusting previous attendance status updating Are you sure about updating?'} onConfirm={updateAttendanceStatus} placement="bottomRight">
            <Button style={{fontWeight:'bold'}} block>
              <RetweetOutlined /> Attendance Adjustment
            </Button>
          </Popconfirm>
           <Popconfirm title={'Are you updating Week off status "WO" to "A" if employee not present before and after 2 days Not Present'} onConfirm={updateWOAttendanceStatus} placement="bottom">
            <Button style={{fontWeight:'bold'}} block>
              <RetweetOutlined /> WeekOff's Adjustment
            </Button>
          </Popconfirm> 
           <Popconfirm title={'Are you updating Week off status "PH" to "A" if employee not present before and after 2 days Not Present '} onConfirm={updatePHAttendanceStatus} placement="bottomLeft">
            <Button style={{fontWeight:'bold'}} block>
              <RetweetOutlined /> Public Holiday's Adjustment
            </Button>
          </Popconfirm>
          </Space>
        </Card>
      </TabPane> */}
    </Tabs>
  );
};

export default AttendanceTabs;