import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Select, Row, Col } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { TypeOfEntityEnum, TypeOfEntityDisplay } from '@hrexpert/shared-models';
import { LeavePolicyService } from '@hrexpert/shared-services';

const LeaveApplicability = () => {
  const [form] = useForm();
  const [groupData, setGroupData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<TypeOfEntityEnum | null>(null);
  const service = new LeavePolicyService();

  const getLeaveTypeData =async () => {
    try {
      const res = await service.getAllLeavePoliciesWithoutRelation();
      if (res.status) setTypeData(res.data);
      else setTypeData([]);
    } catch (error) {
      console.error('Error fetching leave type data:', error);
      setTypeData([]);
    }
  }
  // , [service]);

  const getLeaveGroupData = useCallback(async () => {
    try {
      const res = await service.getLeaveGroupData();
      if (res.status) setGroupData(res.data);
      else setGroupData([]);
    } catch (error) {
      console.error('Error fetching leave group data:', error);
      setGroupData([]);
    }
  }, [service]);

  useEffect(() => {
    console.log('---------------------------------------------------------------')
    getLeaveTypeData();
  }, []);

  // useEffect(() => {
  //   if (selectedEntity === TypeOfEntityEnum.LEAVE_GROUP) {
  //     getLeaveGroupData();
  //   } else if (selectedEntity === TypeOfEntityEnum.LEAVE_TYPE) {
  //     getLeaveTypeData();
  //   }
  // }, [selectedEntity, getLeaveGroupData, getLeaveTypeData]);

  // const handleEntityChange = (value: TypeOfEntityEnum) => {
  //   setSelectedEntity(value);
  //   form.setFieldsValue({ entityDetails: null });
  // };

  // const options = selectedEntity === TypeOfEntityEnum.LEAVE_TYPE
  //   ? typeData.map((item) => ({
  //       value: item.uuid,
  //       label: item.leaveName,
  //     }))
  //   : groupData.map((item) => ({
  //       value: item.uuid,
  //       label: item.name,
  //     }));

  return (
    <Card title="Leave Applicability">
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {/* <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              name="typeOfEntity"
              label="Type"
              rules={[{ required: true, message: 'Please select a type of entity' }]}
            >
              <Select placeholder="Select Type" onChange={handleEntityChange}>
                {Object.entries(TypeOfEntityEnum).map(([key, value]) => (
                  <Select.Option key={value} value={value}>
                    {TypeOfEntityDisplay[key as keyof typeof TypeOfEntityDisplay]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
          {/* {selectedEntity && ( */}
            <Col xs={24} sm={12} md={12} lg={8}>
              <Form.Item
                name="entityDetails"
                label={selectedEntity === TypeOfEntityEnum.LEAVE_TYPE ? "Leave Type" : "Leave Group"}
                rules={[{ required: true, message: 'Please select a detail' }]}
              >
                <Select
                  placeholder={`Select ${selectedEntity === TypeOfEntityEnum.LEAVE_TYPE ? "Leave Type" : "Leave Group"}`}
                  options={typeData.map((item) => ({
                    value: item.uuid,
                    label: item.leaveName,
                  }))}
                />
              </Form.Item>
            </Col>
          {/* )} */}
        </Row>
      </Form>
    </Card>
  );
};

export default LeaveApplicability;
