import { RedoOutlined } from '@ant-design/icons';
import { AdjustEnum, EmpDataReq, LeaveAdjustmentDto } from '@hrexpert/shared-models';
import {
  LeaveAllocationService
} from '@hrexpert/shared-services';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';

const LeaveAdjustmentForm = () => {
  const [form] = Form.useForm();
  const [empData, setEmpData] = useState<any[]>([]);
  const [mainData, setMainData] = useState<any[]>([]);
  const leaveAllocationService = new LeaveAllocationService();
  const [disable, setDisable] = useState<boolean>(true)
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const unitId = IAMClientAuthContext.user.unitId;

  useEffect(() => {
    getAllActiveEmpDropDown();
  }, []);

  const getAllActiveEmpDropDown = async () => {
    const req = new EmpDataReq(undefined,form.getFieldValue('departmentId'),form.getFieldValue('designationId'));
    if (IAMClientAuthContext.user.roles != "SuperAdmin") {
      req.branchId = unitId
  }
    const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
    setEmpData(res?.status ? res.data : []);
  };

  const handleDeptChange = (value) => {
    if (value) {
      getAllActiveEmpDropDown();
    } else {
      form.setFieldsValue({ employeeId: undefined });
      setEmpData([]);
    }
  };

  const handleDesignChange = (value) => {
    if (value) {
      getAllActiveEmpDropDown();
    } else {
      form.setFieldsValue({ employeeId: undefined });
      setEmpData([]);
    }
  };

  const onEmpCodeChange = async (value) => {
    form.setFieldsValue({ leaveTypeId: undefined, available: undefined,adjustmentType: undefined, requestedBalance: undefined, revisedAvailable: undefined});
    const req = new EmpDataReq(form.getFieldValue('employeeId'));
    const res = await leaveAllocationService.getLeavesByEmpId(req);
    setMainData(res?.status ? res.data : []);
  };

  const onLeaveChange = (value, Option) => {
    form.setFieldsValue({ 
      available: Option?.available, 
      adjustmentType: undefined, 
      requestedBalance: undefined, 
      revisedAvailable: undefined,
      leavesAllotted: Option?.leavesAllotted
     });
  };

  const onReset = () => {
    form.resetFields();
    setEmpData([]);
  };

  const calculateRevisedBalance = () => {
    const available = parseFloat(form.getFieldValue('available')) || 0;
    const requestedQuantity = parseFloat(form.getFieldValue('requestedBalance')) || 0;
    const adjustmentType = form.getFieldValue('adjustmentType');

    if (adjustmentType === AdjustEnum.ADD) {
      return (available + requestedQuantity)
    } else if (adjustmentType === AdjustEnum.DEDUCT) {
      return (available - requestedQuantity)
    }
    return available
  };

  const onAdjustChange = (value)=>{
    if(value){
      setDisable(false)
    }else{
      setDisable(true)
    }
    form.setFieldsValue({requestedQuantity: undefined, revisedAvailable: undefined, requestedBalance: undefined})
  }

  const onFinish = ()=>{
    const req = new LeaveAdjustmentDto(form.getFieldValue('allocationId'),form.getFieldValue('requestedBalance'),form.getFieldValue('revisedAvailable'),form.getFieldValue('remarks'),form.getFieldValue('adjustmentType'))
    leaveAllocationService.createLeaveAdjustment(req).then(res=>{
      if(res.status){
        message.success(res.internalMessage,2)
        form.resetFields()
      }else{
        message.error(res.internalMessage,2)
      }
    })
  }

  return (
    <div>
      <Card title={'Employee Leave Adjustment'}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  label="Employee Code"
                  name="employeeId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select an employee!',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Employee"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={onEmpCodeChange}
                  >
                    {empData
                      .sort((a, b) => a.empCode?.localeCompare(b.empCode))
                      .map((emp) => (
                        <Select.Option key={emp.id} value={emp.id}>
                         
                          {emp.empCode} - {emp.fullName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  label="Leave Type"
                  name="allocationId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select an employee!',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Leave Type"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={onLeaveChange}
                  >
                    {mainData.map((emp) => (
                      <Select.Option
                        key={emp.allocationId}
                        value={emp.allocationId}
                        available={emp.available}
                        leavesAllotted={emp.leavesAllotted}
                      >
                        {emp.typeOfLeave} - {emp.leaveCode}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Leaves Allotted"
                  name="leavesAllotted"
                >
                  <Input style={{ fontWeight: 'bolder' }} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Available"
                  name="available"
                >
                  <Input style={{ fontWeight: 'bolder' }} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Adjustment Type"
                  name="adjustmentType"
                  rules={[
                    {
                      required: true,
                      message: 'Please select Type!',
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Leave Type"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={onAdjustChange}
                  >
                    {Object.entries(AdjustEnum).map(([key, value]) => (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Requested Balance"
                  name="requestedBalance"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter balance!',
                    },
                    {
                      validator: (_, value) => {
                        const leavesAllotted = form.getFieldValue('leavesAllotted');
                        if (value == null || value === '') {
                          return Promise.resolve();
                        }
                        if (value > leavesAllotted) {
                          return Promise.reject(new Error('Requested balance cannot exceed leaves allotted!'));
                        }
                        if (value < 0) {
                          return Promise.reject(new Error('Requested balance cannot be negative!'));
                        }
                        if (value === leavesAllotted) {
                          return Promise.reject(new Error('Requested balance cannot be equal to leaves allotted!'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Enter Balance"
                    onChange={() => {
                      const revisedAvailable = calculateRevisedBalance();
                      form.setFieldsValue({ revisedAvailable });
                    }}
                    disabled={disable}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Revised Balance"
                  name="revisedAvailable"
                >
                  <Input style={{ fontWeight: 'bolder' }} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Reason"
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a reason!',
                    },
                    {
                      validator: (_, value) => {
                        if (!value || value.trim().length < 10) {
                          return Promise.reject(
                            new Error('Reason must be at least 10 characters long and meaningful.')
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <TextArea rows={2} placeholder="Enter a valid reason (min 10 characters)" />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  style={{ marginTop: '23px', marginRight: '10px' }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
                <Button icon={<RedoOutlined />} onClick={onReset} danger>
                  Reset
                </Button>
              </Col>
            </Row>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default LeaveAdjustmentForm;
