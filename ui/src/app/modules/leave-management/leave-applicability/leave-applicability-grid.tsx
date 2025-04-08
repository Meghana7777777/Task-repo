import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  CriteriaDisplay,
  CriteriaEnum,
  GenderEnum,
  MaritualStatusEnum,
  ScopesEnum,
  TypeOfEntityDisplay,
  TypeOfEntityEnum,
} from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, LeaveGroupsService, LeavePolicyService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, message, Modal, Row, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { SequenceUtils } from '../../../common/utils';

interface BranchViewIProps {
  scopes: ScopesEnum[];
}

const LeaveApplicabilityGrid = ({ scopes }: BranchViewIProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [lgData, setLgData] = useState<any[]>([]);
  const [branchData, setBranchData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [desData, setDesData] = useState<any[]>([]);
  const [mainData, setMainData] = useState<any[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaEnum | null | any>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [form] = useForm();

  const service = new LeavePolicyService();
  const branchService = new BranchesService();
  const deptService = new DepartmentService();
  const desService = new DesignationsService();
  const lgService = new LeaveGroupsService();

  useEffect(() => {
    form.setFieldsValue({ leaveApplicability: [{}] });
    fetchLeaveApplicabilityData();
  }, []);

  const fetchLeaveApplicabilityData = async () => {
    const res = await service.getLeaveApplicabilityData();
    setMainData(res.status ? res.data : []);
  };

  const fetchLeaveTypeData = async () => {
    const res = await service.getAllLeavePoliciesWithoutRelation();
    setTypeData(res.status ? res.data : []);
  };

  const fetchLeaveGroupData = async () => {
    const res = await lgService.getActiveLeaveGroups();
    setLgData(res.status ? res.data : []);
  };

  const fetchActiveData = async (criteria: CriteriaEnum) => {
    switch (criteria) {
      case CriteriaEnum.BRANCHES:
        const branches = await branchService.getActiveBranches();
        setBranchData(branches.status ? branches.data : []);
        break;
      case CriteriaEnum.DEPARTMENTS:
        const departments = await deptService.getActiveDepartments();
        setDeptData(departments.status ? departments.data : []);
        break;
      case CriteriaEnum.DESIGNATIONS:
        const designations = await desService.getActiveDesignations();
        setDesData(designations.status ? designations.data : []);
        break;
      default:
        break;
    }
  };

  const handleCriteriaChange = (value: CriteriaEnum) => {
    setSelectedCriteria(value);
    if ([CriteriaEnum.BRANCHES, CriteriaEnum.DEPARTMENTS, CriteriaEnum.DESIGNATIONS].includes(value)) {
      fetchActiveData(value);
    }
  };

  const handleChange = (values: string[]) => {
    if (values.includes('all')) {
      setIsAllSelected(true);
      setSelectedValues(['all']);
    } else {
      setIsAllSelected(false);
      setSelectedValues(values);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const transformedData = values.leaveApplicability.flatMap((item: any) => {
        if (item.criteria === "all") {
          return Object.values(CriteriaEnum).map((criteria) => ({
            ...item,
            criteria,
            reference: "all",
          }));
        }
        return item;
      });
      const requestData = { leaveApplicability: transformedData }
  
      const res = await service.createLeaveApplicability(requestData);
      if (res.status) {
        message.success(res.internalMessage, 2);
        setModalVisible(false);
        form.resetFields();
        fetchLeaveApplicabilityData();
      }else{
        message.warning(res.internalMessage,2)
        setModalVisible(true)
      }
    } catch (err) {
      message.error("Failed to submit data", 2);
    }
  };
  
  

  const handleEntityChange = (value: TypeOfEntityEnum) => {
    form.setFieldsValue({ typeOfEntity: value });

    if (value === TypeOfEntityEnum.LEAVE_TYPE) {
      fetchLeaveTypeData();
    } else if (value === TypeOfEntityEnum.LEAVE_GROUP) {
      fetchLeaveGroupData();
    }
  };

  const getOptions = () => {
    switch (selectedCriteria) {
      case CriteriaEnum.GENDERS:
        return Object.values(GenderEnum).map((value) => ({
          value,
          label: value === GenderEnum.M ? 'Male' : value === GenderEnum.F ? 'Female' : 'Others',
        }));
      case CriteriaEnum.MARITAL_STATUS:
        return Object.values(MaritualStatusEnum).map((value) => ({
          value,
          label: value === MaritualStatusEnum.M ? 'Married' : value === MaritualStatusEnum.U ? 'Unmarried' : 'Others',
        }));
      case CriteriaEnum.BRANCHES:
        return branchData.map((res) => ({ value: res.id, label: res.branchName }));
      case CriteriaEnum.DEPARTMENTS:
        return deptData.map((res) => ({ value: res.deptId, label: res.deptName }));
      case CriteriaEnum.DESIGNATIONS:
        return desData.map((item) => ({ value: item.id, label: item.name }));
      default:
        return [];
    }
  };

  const columns: ColumnsType<any> = [
    { title: 'S.No', key: 'sno', render: (_, __, index) => index + 1, align: 'center' },
    { title: 'Leave Type', dataIndex: 'leaveName' },
    { title: 'Applicable To', dataIndex: 'criteria', render: (text) => CriteriaDisplay[text] || '-' },
    { title: 'Applicable Criteria', dataIndex: 'criteriaValue' },
  ];

  const onModalClose = () =>{
    setModalVisible(false)
    form.setFieldsValue({ leaveApplicability: [{}] });
  }

  return (
    <div>
      <Card
        title="Leave Applicability"
        extra={
          <Button
            type="primary"
            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add
          </Button>
        }
      >
        <Table columns={columns} dataSource={mainData} pagination={false} />
      </Card>
      <Modal open={modalVisible} onCancel={onModalClose} footer={null} width="65%">
        <Card title="Leave Applicability">
          <Form form={form} layout="vertical" onFinish={onFinish} >
            <Form.List name="leaveApplicability">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle">
                      <Col xs={24} sm={12} md={12} lg={6}>
                        <Form.Item name={[name,"typeOfEntity"]} label="Type" rules={[{ required: true }]}>
                          <Select placeholder="Select Type" onChange={handleEntityChange}>
                            {Object.entries(TypeOfEntityEnum).map(([key, value]) => (
                              <Select.Option key={value} value={value}>
                                {TypeOfEntityDisplay[key as keyof typeof TypeOfEntityDisplay]}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      {form.getFieldValue('typeOfEntity') && (
                        <Col xs={24} sm={12} md={12} lg={5}>
                          <Form.Item
                            {...restField}
                            name={[name, form.getFieldValue('typeOfEntity') === TypeOfEntityEnum.LEAVE_TYPE ? 'leaveTypeId' : 'leaveGroupId']}
                            label={form.getFieldValue('typeOfEntity') === TypeOfEntityEnum.LEAVE_TYPE ? 'Leave Type' : 'Leave Group'}
                            rules={[{ required: true }]}
                          >
                            <Select
                              placeholder={`Select ${form.getFieldValue('typeOfEntity') === TypeOfEntityEnum.LEAVE_TYPE ? 'Leave Type' : 'Leave Group'}`}
                              options={(form.getFieldValue('typeOfEntity') === TypeOfEntityEnum.LEAVE_TYPE ? typeData : lgData).map((item) => ({
                                value: item.uuid,
                                label: item.leaveName || item.name,
                              }))}
                            />
                          </Form.Item>
                        </Col>
                      )}
                      <Col xs={24} sm={12} md={12} lg={5}>
                        <Form.Item {...restField} name={[name, 'criteria']} label="Criteria" rules={[{ required: true }]}>
                          <Select placeholder="Select Criteria" onChange={handleCriteriaChange}>
                            <Select.Option value="all">All</Select.Option>
                            {Object.entries(CriteriaEnum).map(([key, value]) => (
                              <Select.Option key={value} value={value}>
                                {CriteriaDisplay[key as keyof typeof CriteriaDisplay]}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      {selectedCriteria !== 'all' && (
                        <Col xs={24} sm={12} md={12} lg={6}>
                          <Form.Item {...restField} name={[name, 'reference']} label="Applicable To" rules={[{ required: true }]}>
                            <Select
                              placeholder="Select Applicable to"
                              mode={isAllSelected ? undefined : 'multiple'}
                              value={selectedValues}
                              onChange={handleChange}
                            >
                              <Select.Option value="all">All</Select.Option>
                              {getOptions().map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                  {option.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                      <Col xs={24} sm={12} md={12} lg={2}>
                        <Button type="text" icon={<MinusCircleOutlined />} danger onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Row justify="center" style={{ marginTop: '16px' }}>
                    <Col>
                      <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        Add
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
              <Col>
                <Button htmlType="button" onClick={() => form.setFieldsValue({ leaveApplicability: [{}] })}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default LeaveApplicabilityGrid;