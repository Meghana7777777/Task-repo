import { LeavePolicyService } from '@hrexpert/shared-services';
import { Button, Card } from 'antd';
import Table, { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveMappingView = () => {
  const navigate = useNavigate();
  const service = new LeavePolicyService()
  const [ mainData, setMainData ] = useState<any>([])

  useEffect(()=>{
    getLeaveTypeGroupMapping()
  },[])

  const getLeaveTypeGroupMapping = ()=>{
    service.getLeaveTypeGroupMapping().then((res)=>{
      if(res.status){
        setMainData(res.data)
      }else{
        setMainData([])
      }
    })
  }

  const backToView = () => {
    navigate('/leave-mapping-form');
  };

  const columns: ColumnsType<any> = [
    { title: 'Leave Name', dataIndex: 'leaveName' },
    { title: 'Leave Group', dataIndex: 'leaveGroup' },
  ];

  return (
    <Card
      title={'Leave Mapping'}
      extra={
        <Button type="primary" onClick={backToView}>
          Add
        </Button>
      }
    >
      <Table columns={columns} dataSource={mainData}/>
    </Card>
  );
};

export default LeaveMappingView;
