import React, { useEffect, useState } from 'react';
import { Card, Button, message, Typography, Row, Col, Space, Spin } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LeavePolicyService } from '@hrexpert/shared-services';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const LeaveMapping = () => {
  const service = new LeavePolicyService();
  const [groupData, setGroupData] = useState<any[]>([]);
  const [leavePolicyData, setLeavePolicyData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<{ [key: string]: any[] }>({});
  const [groupMappingData, setGroupMappingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          getLeaveGroupData(),
          getAllLeavePolicies(),
          getLeaveTypeGroupMapping(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (groupData.length && leavePolicyData.length && groupMappingData.length) {
      initializeMappings();
    }
  }, [groupData, leavePolicyData, groupMappingData]);

  const initializeMappings = () => {
    const initialMappings = groupData.reduce((acc: any, group: any) => {
      acc[group.uuid] = [];
      return acc;
    }, {});

    const groupedMappings = groupMappingData.reduce(
      (acc: any, mapping: any) => {
        if (!acc[mapping.lgUUID]) {
          acc[mapping.lgUUID] = [];
        }

        const matchingPolicy = leavePolicyData.find(
          (policy) => policy.uuid === mapping.ltUUID
        );

        if (matchingPolicy) {
          acc[mapping.lgUUID].push(matchingPolicy);
        }

        return acc;
      },
      {}
    );

    setMappings({ ...initialMappings, ...groupedMappings });
  };

  const getLeaveGroupData = () => {
    return service.getLeaveGroupData().then((res) => {
      if (res.status) {
        setGroupData(res.data);
      } else {
        setGroupData([]);
      }
    });
  };

  const getLeaveTypeGroupMapping = () => {
    return service.getLeaveTypeGroupMapping().then((res) => {
      if (res.status) {
        setGroupMappingData(res.data);
      } else {
        setGroupMappingData([]);
      }
    });
  };

  const getAllLeavePolicies = () => {
    return service.getAllLeavePoliciesWithoutRelation().then((res) => {
      if (res.status) {
        setLeavePolicyData(res.data);
      } else {
        setLeavePolicyData([]);
      }
    });
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // Drop outside the droppable area
    if (!destination) return;

    // Same droppable area
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId !== 'leavePolicyData') {
        const groupUuid = source.droppableId.replace('group-', '');
        const items = Array.from(mappings[groupUuid]);
        const [removed] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);

        setMappings({
          ...mappings,
          [groupUuid]: items,
        });
      }
      return;
    }

    // From leave policy list to group
    if (source.droppableId === 'leavePolicyData') {
      const groupUuid = destination.droppableId.replace('group-', '');
      const policy = leavePolicyData[source.index];

      // Check if policy already exists in the group
      const existingIndex = mappings[groupUuid].findIndex(
        (item) => item.uuid === policy.uuid
      );

      if (existingIndex !== -1) {
        message.warning('This policy is already assigned to this group');
        return;
      }

      const destItems = Array.from(mappings[groupUuid] || []);
      destItems.splice(destination.index, 0, policy);

      setMappings({
        ...mappings,
        [groupUuid]: destItems,
      });
    }

    // Between groups
    if (
      source.droppableId.startsWith('group-') &&
      destination.droppableId.startsWith('group-')
    ) {
      const sourceGroupId = source.droppableId.replace('group-', '');
      const destGroupId = destination.droppableId.replace('group-', '');

      const sourceItems = Array.from(mappings[sourceGroupId]);
      const destItems = Array.from(mappings[destGroupId]);

      const [removed] = sourceItems.splice(source.index, 1);

      // Check if policy already exists in destination group
      const existingIndex = destItems.findIndex(
        (item) => item.uuid === removed.uuid
      );

      if (existingIndex !== -1) {
        message.warning('This policy is already assigned to this group');
        return;
      }

      destItems.splice(destination.index, 0, removed);

      setMappings({
        ...mappings,
        [sourceGroupId]: sourceItems,
        [destGroupId]: destItems,
      });
    }
  };

  const handleRemoveFromGroup = (groupUuid: string, index: number) => {
    const updatedItems = Array.from(mappings[groupUuid]);
    updatedItems.splice(index, 1);
    setMappings({
      ...mappings,
      [groupUuid]: updatedItems,
    });
  };

  const handleSubmit = () => {
    const leaveGroupIds = Object.entries(mappings).reduce(
      (acc: any, [groupUuid, items]) => {
        if (items.length > 0) {
          acc[groupUuid] = items.map((item) => item.uuid);
        }
        return acc;
      },
      {}
    );

    if (Object.keys(leaveGroupIds).length === 0) {
      message.error('Please map at least one leave type before submitting');
      return;
    }

    service.mapTypeAndGroup({ leaveGroupIds }).then((res) => {
      if (res.status) {
        message.success(res.internalMessage);
      } else {
        message.error(res.internalMessage);
      }
    });
  };

  const handleReset = () => {
    initializeMappings();
  };

  const backToView = () => {
    navigate('/leave-mapping');
  };

  return (
    <Spin spinning={loading}>
      <Card bordered={false} style={{ margin: '24px' }}>
        {/* Header */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Leave Type Mapping
          </Title>
          <Button icon={<ArrowLeftOutlined />} onClick={backToView}>
            Back
          </Button>
        </Row>

        <DragDropContext onDragEnd={onDragEnd}>
          <Row gutter={[24, 24]}>
            {/* Leave Types Section */}
            <Col xs={24} lg={6}>
              <Droppable droppableId="leavePolicyData">
                {(provided) => (
                  <Card
                    title="Available Leave Types"
                    style={{ height: '100%', minHeight: 400 }}
                  >
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ height: '100%', overflow: 'visible' }}
                    >
                      {leavePolicyData.map((item, index) => (
                        <Draggable
                          key={item.uuid}
                          draggableId={item.uuid}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: '12px',
                                marginBottom: '8px',
                                background: snapshot.isDragging
                                  ? '#f5f5f5'
                                  : '#fff',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                ...provided.draggableProps.style,
                              }}
                            >
                              {item.leaveName}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </Card>
                )}
              </Droppable>
            </Col>

            {/* Groups Section */}
            <Col xs={24} lg={18}>
              <Row gutter={[16, 16]}>
                {groupData.map((group) => (
                  <Col xs={24} md={12} key={group.uuid}>
                    <Droppable droppableId={`group-${group.uuid}`}>
                      {(provided, snapshot) => (
                        <Card
                          title={group.name}
                          style={{
                            height: '100%',
                            minHeight: 200,
                            background: snapshot.isDraggingOver
                              ? '#fafafa'
                              : '#fff',
                          }}
                        >
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ height: '100%', overflow: 'visible' }}
                          >
                            {mappings[group.uuid]?.map((item, index) => (
                              <Draggable
                                key={`${group.uuid}-${item.uuid}`}
                                draggableId={`${group.uuid}-${item.uuid}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: '12px',
                                      marginBottom: '8px',
                                      background: snapshot.isDragging
                                        ? '#f5f5f5'
                                        : '#fff',
                                      border: '1px solid #d9d9d9',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <span>{item.leaveName}</span>
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<DeleteOutlined />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFromGroup(
                                          group.uuid,
                                          index
                                        );
                                      }}
                                      style={{ color: '#ff4d4f' }}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {(!mappings[group.uuid] ||
                              mappings[group.uuid].length === 0) && (
                              <div
                                style={{
                                  padding: '24px',
                                  textAlign: 'center',
                                  color: '#bfbfbf',
                                  background: '#fafafa',
                                  border: '1px dashed #d9d9d9',
                                  borderRadius: '6px',
                                }}
                              >
                                Drag leave types here
                              </div>
                            )}
                          </div>
                        </Card>
                      )}
                    </Droppable>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Footer Actions */}
          <Row justify="end" style={{ marginTop: 24 }}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                Save Mappings
              </Button>
            </Space>
          </Row>
        </DragDropContext>
      </Card>
    </Spin>
  );
};

export default LeaveMapping;
