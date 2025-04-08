import {
  RedoOutlined,
  SaveOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { EmpDataReq, LeaveAllocationDto } from '@hrexpert/shared-models';
import {
  DepartmentService,
  DesignationsService,
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
  Space,
  Table
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIAMClientState } from '../../../common/iam-client-react';

const LeaveAllocation = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const leaveAllocationService = new LeaveAllocationService();
  const deptService = new DepartmentService();
  const designService = new DesignationsService();

  const [typeData, setTypeData] = useState<any[]>([]);
  const [empData, setEmpData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [designData, setDesignData] = useState<any[]>([]);
  const [mainData, setMainData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const role = IAMClientAuthContext.user.roles;
  const unitId = IAMClientAuthContext.user.unitId;

  const paginatedData = mainData.slice(
    (currentPage - 1) * pageSize, 
    currentPage * pageSize
  );

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };


  useEffect(() => {
    const initialValues = mainData.reduce((acc, record) => {
      acc[record.id] = typeData.reduce((innerAcc, type) => {
        innerAcc[type.id] = type.defaultLeaves;
        return innerAcc;
      }, {});
      return acc;
    }, {});
    setInputValues(initialValues);
  }, [mainData, typeData]);

  useEffect(() => {
    getLeaveTypes();
    getDeptData();
    getDesignData();
    if (IAMClientAuthContext.user.roles != "SuperAdmin") {
      getAllActiveEmpDropDown()
    }
  }, []);

  useEffect(() => {
    if (mainData.length > 0 && typeData.length > 0) {
      const initialValues = { ...inputValues };

      mainData.forEach((record) => {
        if (!initialValues[record.id]) {
          initialValues[record.id] = {};
        }
        typeData.forEach((type) => {
          if (initialValues[record.id][type.id] === undefined) {
            initialValues[record.id][type.id] =
              type.typeOfLeave === 'Maternity' && record.gender === 'M'
                ? '0'
                : type.defaultLeaves;
          }
        });
      });

      setInputValues(initialValues);
    }
  }, [mainData, typeData]);

  const getLeaveTypes = async () => {
    const res = await leaveAllocationService.getAllActiveLeaveTypes();
    setTypeData(res.status ? res.data : []);
  };

  const getDeptData = async () => {
    const res = await deptService.getAllDepartments();
    setDeptData(res?.status ? res.data : []);
  };

  const getDesignData = async () => {
    const res = await designService.getActiveDesignations();
    setDesignData(res.status ? res.data : []);
  };

  const getAllActiveEmpDropDown = async () => {
    const req = new EmpDataReq(undefined,form.getFieldValue('departmentId'),form.getFieldValue('designationId'));
    if (IAMClientAuthContext.user.roles != "SuperAdmin") {
        req.branchId = unitId
    }
    const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
    setEmpData(res?.status ? res.data : []);
  };

  const getEmpData = async () => {
    const employeeId = form.getFieldValue('employeeId');
    const departmentId = form.getFieldValue('departmentId');
    const designationId = form.getFieldValue('designationId');

    if (!departmentId && !designationId) {
      message.error('Please select either Department or Designation.', 2);
      return;
    }

    const req = new EmpDataReq(employeeId, departmentId, designationId);
    try {
      const res = await leaveAllocationService.getAllActiveEmp(req);
      setMainData(res?.status ? res.data : []);
      message[res.status ? 'success' : 'error'](res.internalMessage, 2);
    } catch (error) {
      message.error(
        'Failed to fetch employee data. Please try again later.',
        2
      );
    }
  };

  const handleInputChange = (id, leaveTypeId, value, record) => {
    const isDisabled =
      typeData.find((type) => type.id === leaveTypeId)?.typeOfLeave ===
        'Maternity' && record.gender === 'M';

    console.log('Entered value:', value);
    console.log('Employee ID:', id);
    console.log('Leave Type ID:', leaveTypeId);

    if (isDisabled || value === '' || value === '0') {
      console.log(
        `Disabling or setting to 0 for ID: ${id}, Leave Type ID: ${leaveTypeId}`
      );
      setInputValues((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          [leaveTypeId]: '0',
        },
      }));
    } else {
      console.log(
        `Setting new value: ${value} for ID: ${id}, Leave Type ID: ${leaveTypeId}`
      );
      setInputValues((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          [leaveTypeId]: value,
        },
      }));
    }

    setTimeout(() => {
      console.log('Updated inputValues state:', inputValues);
    }, 0);
  };

  const handleDeptChange = (value) => {
    if (value) {
      setSelectedRowKeys([]);
      getAllActiveEmpDropDown();
    } else {
      setMainData([]);
      setEmpData([]);
      setSelectedRowKeys([]);
    }
  };

  const handleDesignChange = (value) => {
    if (value) {
      setSelectedRowKeys([]);
      getAllActiveEmpDropDown();
    } else {
      setMainData([]);
      setEmpData([]);
      setSelectedRowKeys([]);
    }
  };

  const handleSubmit = async () => {
    const requests = selectedRowsData.map((row) => {
      return new LeaveAllocationDto(
        row.id,
        row.leaveTypeId,
        undefined,
        row.leavesAlloted,
        0,
        row.leavesAlloted,
        undefined
      );
    });

    try {
      const res = await leaveAllocationService.allocateLeave(requests);

      if (res.status) {
        navigate('/leave-allocation-view');
        message.success('Leave allocations saved successfully');
      } else {
        message.error('Failed to allocate leaves');
      }
    } catch (error) {
      console.error('Error during leave allocation:', error);
      message.error('An error occurred while saving leave allocations');
    }
  };

  const onReset = () => {
    form.resetFields();
    setMainData([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);

      const transformedRows = selectedRows.flatMap((row) => {
        const rowLeaveEntries = inputValues[row.id] || {};

        return Object.keys(rowLeaveEntries)
          .map((leaveTypeId) => {
            const leavesAlloted = rowLeaveEntries[leaveTypeId];

            if (leavesAlloted === '0') {
              return null;
            }

            return {
              id: row.id,
              empCode: row.empCode,
              fullName: row.fullName,
              gender: row.gender,
              deptId: row.deptId,
              department: row.department,
              designId: row.designId,
              designation: row.designation,
              leaveTypeId: parseInt(leaveTypeId, 10),
              leavesAlloted: leavesAlloted,
            };
          })
          .filter((item) => item !== null);
      });

      setSelectedRowsData(transformedRows);
    },
  };

  const columns: any = [
    {
      title: 'S.No.',
      key: 'sno',
      render: (_, __, index) => 
        (currentPage - 1) * pageSize + index + 1,
      width: 70,
      fixed: 'left',
    },
    {
      title: 'Employee',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Employee Code',
      dataIndex: 'empCode',
      key: 'empCode',
      width: 120,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      width: 150,
    },
    ...typeData.map((type) => ({
      title: (
        <div>
          {type.typeOfLeave}
          <div style={{ fontSize: '12px', color: '#666' }}>
            (Max: {type.defaultLeaves})
          </div>
        </div>
      ),
      key: `leave_${type.id}`,
      width: 120,  // Add fixed width
      render: (_, record) => {
        const isDisabled =
          type.typeOfLeave === 'Maternity' && record.gender === 'M';
        const value =
          inputValues[record.id]?.[type.id] ??
          (isDisabled ? '0' : type.defaultLeaves);

        return (
          <Input
            type="number"
            min={0}
            max={type.defaultLeaves}
            value={value}
            style={{ width: '80px' }}
            disabled={isDisabled}
            onChange={(e) =>
              handleInputChange(record.id, type.id, e.target.value, record)
            }
          />
        );
      },
    })),
    {
      title: 'Total Leaves',  // New Total column
      key: 'totalLeaves',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        let total = 0;
        typeData.forEach((type) => {
          const isDisabled = type.typeOfLeave === 'Maternity' && record.gender === 'M';
          const value = inputValues[record.id]?.[type.id] ?? 
            (isDisabled ? 0 : type.defaultLeaves);
          total += Number(value);
        });
        return <span>{total}</span>;
      },
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   width: 80,  // Add fixed width
    //   fixed: 'right', // Fix the Actions column to the right
    //   render: (_, record) => (
    //     <Button type="text" icon={<DeleteOutlined />} danger />
    //   ),
    // },
  ];

  return (
    <div>
      <Card
        title="Leave Allocation"
        extra={
          <Link to="/leave-allocation-view">
            <Button type="primary">View</Button>
          </Link>
        }
      >
        <Form form={form} layout="vertical">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Department" name="departmentId">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Department"
                    onChange={handleDeptChange}
                    allowClear
                    showSearch
                    optionFilterProp='children'
                  >
                    {deptData.map((dept) => (
                      <Select.Option key={dept.id} value={dept.id}>
                        {dept.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Designation" name="designationId">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Designation"
                    allowClear
                    onChange={handleDesignChange}
                    showSearch
                    optionFilterProp='children'
                  >
                    {designData.map((design) => (
                      <Select.Option key={design.id} value={design.id}>
                        {design.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8} lg={6}>
                <Form.Item label="Employees" name="employeeId">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Employee"
                    allowClear
                    showSearch
                    optionFilterProp='children'
                  >
                    {empData.map((emp) => (
                      <Select.Option key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Button
                  icon={<SearchOutlined />}
                  style={{ marginTop: '23px', marginRight: '10px' }}
                  type="primary"
                  onClick={getEmpData}
                >
                  Search
                </Button>
                <Button icon={<RedoOutlined />} onClick={onReset} danger>
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  style={{ marginLeft: '10px' }}
                  onClick={handleSubmit}
                  disabled={selectedRowKeys.length === 0}
                >
                  Save {selectedRowKeys.length}
                </Button>
              </Col>
            </Row>

            {mainData.length > 0 ?(
              <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={paginatedData}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: mainData.length,
                showSizeChanger: true,
                pageSizeOptions: [50, 100, 200],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}
              onChange={handleTableChange}
              scroll={{ 
                x: 'max-content',
                y: 'calc(100vh - 300px)'
              }}
              sticky
            />
            ): (<></>)}
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default LeaveAllocation;
