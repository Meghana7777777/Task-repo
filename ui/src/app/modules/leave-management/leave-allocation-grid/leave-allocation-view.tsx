import { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, Input, Select, Table, Typography, Badge, Row, Col, message, Space } from 'antd';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { EmpDataReq, LeavesAccumulationReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, LeaveAllocationService, LeavePolicyService, } from '@hrexpert/shared-services';
import { useIAMClientState } from '../../../common/iam-client-react';
import { SequenceUtils } from '../../../common/utils';
import { ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { TableRowSelection } from 'antd/es/table/interface';
import { log } from 'console';

const { Title } = Typography;
const { Option } = Select;

interface LeaveAllocationViewProps {
  scopes: ScopesEnum[];
}

const LeaveAllocationView = (props: LeaveAllocationViewProps) => {
  const { scopes } = props;
  const { IAMClientAuthContext } = useIAMClientState();
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);
  const [empData, setEmpData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100)
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editedRows, setEditedRows] = useState<any[]>([]);


  const leaveAllocationService = new LeaveAllocationService();
  const divisionService = new DivisionService();
  const deptService = new DepartmentService();
  const designService = new DesignationsService();
  const branchService = new BranchesService();
  const policyService = new LeavePolicyService();

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const branchRes = await branchService.getAllBranches();
        const divisionRes = await divisionService.getAllActiveDivisions();
        const deptRes = await deptService.getActiveDepartments();
        const designRes = await designService.getDesignations();

        // Error handling for each service call
        if (!branchRes.status) {
          message.error(`${branchRes.internalMessage || 'Unknown error'}`);
        }
        if (!divisionRes.status) {
          message.error(`${divisionRes.internalMessage || 'Unknown error'}`);
        }
        if (!deptRes.status) {
          message.error(`${deptRes.internalMessage || 'Unknown error'}`);
        }
        if (!designRes.status) {
          message.error(`${designRes.internalMessage || 'Unknown error'}`);
        }

        setBranches(branchRes.status ? branchRes.data : []);
        setDivisions(divisionRes.status ? divisionRes.data : []);
        setDepartments(deptRes.status ? deptRes.data : []);
        setDesignations(designRes.status ? designRes.data : []);

        if (IAMClientAuthContext.user.roles === 'SuperAdmin') {
          // form.setFieldsValue({ branchId: 'ALL' });
        } else {
          form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId });
        }

        if (IAMClientAuthContext.user.roles !== 'SuperAdmin') {
          await getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId);
        }
      } catch (error) {
        console.error('Error in fetchInitialData:', error);
        message.error('Failed to load initial data. Please try again.');
      }
    };

    fetchInitialData();
  }, [IAMClientAuthContext.user.roles, IAMClientAuthContext.user.unitId, form]);


  const getAllActiveEmpDropDown = async (branchId) => {
    try {
      const formValues = form.getFieldsValue();
      const req = new EmpDataReq(formValues.employeeId, formValues.departmentId, formValues.designationId, null, formValues.divisionId, branchId);
      const res = await leaveAllocationService.getAllActiveEmpDropDown(req);

      if (!res?.status) {
        message.error(`Failed to load employee dropdown: ${res?.internalMessage || 'Unknown error'}`);
        setEmpData([]);
        return;
      }

      setEmpData(res.data || []);
    } catch (error) {
      console.error('Error in getAllActiveEmpDropDown:', error);
      message.error('Failed to load employee dropdown. Please try again.');
      setEmpData([]);
    }
  };

  const getEmpData = async () => {
    try {
      const formValues = form.getFieldsValue();

      if (!formValues.branchId) {
        message.warning('Please select a branch');
        return;
      }

      const req = new EmpDataReq(formValues.employeeId, formValues.departmentId, formValues.designationId, null, formValues.divisionId,
        formValues.branchId === 'ALL' ? null : formValues.branchId
      );

      const res = await leaveAllocationService.getLeaveAllocationData(req);

      if (!res.status) {
        message.error(`${res.internalMessage || 'Unknown error'}`);
        setEmployees([]);
        return;
      }

      setEmployees(res.data || []);

      if (!res.data || res.data.length === 0) {
        message.info('No employee data found for the selected criteria');
      }
    } catch (error) {
      console.error('Error in getEmpData:', error);
      message.error('Failed to load employee data. Please try again.');
      setEmployees([]);
    }
  };

  const getBadgeColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;

    if (percentage > 50) return "success";
    if (percentage > 20) return "warning";
    return "error";
  };


  const data = employees.flatMap((employee) =>
    employee.leaveTypes.map((leave, index) => ({
      key: `${employee.id}-${leave.type}`,
      serialNumber: index === 0 ? employees.indexOf(employee) + 1 : '',
      name: index === 0 ? employee.name : '',
      department: index === 0 ? employee.department : '',
      designation: index === 0 ? employee.designation : '',
      division: index === 0 ? employee.division : '',
      branchName: index === 0 ? employee.branchName : '',
      leaveAllocationId: leave.leaveAllocationId,
      type: leave.type,
      total: leave.total,
      used: leave.used,
      available: leave.available,
      rowSpan: index === 0 ? employee.leaveTypes.length : 0,
      employeeCode:index === 0 ? employee.employeeCode : '',
    }))
  );

  const onReset = () => {
    try {
      form.resetFields();
      setEmployees([])
    } catch (error) {
      console.error('Error in onReset:', error);
      message.error('Failed to reset form. Please try again.');
    }
  };

  const allocateLeavesToEmp = async () => {
    try {
      const formValues = form.getFieldsValue();

      if (!formValues.branchId) {
        message.warning('Please select a branch');
        return;
      }

      const req = new EmpDataReq(formValues.employeeId, formValues.departmentId, formValues.designationId, null, formValues.divisionId,
        formValues.branchId === 'ALL' ? null : formValues.branchId
      );

      const res = await policyService.allocateLeavesToEmp(req);

      if (res.status) {
        message.success(res.internalMessage || 'Leaves allocated successfully');
        setEmployees([])
      } else {
        message.error(res.internalMessage || 'Failed to allocate leaves');
      }
    } catch (error) {
      console.error('Error in allocateLeavesToEmp:', error);
      message.error('Failed to allocate leaves. Please try again.');
    }
  };

  const LeavesAccumulation = async () => {
    try {
      const formValues = form.getFieldsValue();

      if (!formValues.branchId) {
        message.warning('Please select a branch');
        return;
      }
      const req = new LeavesAccumulationReq(formValues.employeeId, formValues.departmentId, formValues.designationId, formValues.divisionId,
        formValues.branchId === 'ALL' ? null : formValues.branchId
      );
      const res = await policyService.leavesAccumlating(req);

      if (res.status) {
        message.success(res.internalMessage || 'Leaves accumulation successfully');
        setEmployees([])
      } else {
        message.error(res.internalMessage || 'Failed to accumulat leaves');
      }
    } catch (error) {
      console.error('Error in accumulateLeavesToEmp:', error);
      message.error('Failed to accumulat leaves. Please try again.');
    }
  };

  const updateLeavesAccumulation = async () => {
    try {
      const req = { rows: editedRows.filter((rec) => selectedRowKeys.includes(rec.leaveAllocationId)) }
      const res = await policyService.updateleavesAccumlation(req);

      if (res.status) {
        message.success(res.internalMessage || 'Leaves accumulation updated successfully');
        setEmployees([])
        setEditedRows([])
        setSelectedRowKeys([])
        setSelectedRows([])
      } else {
        message.error(res.internalMessage || 'Failed to updated accumulat leaves');
      }
    } catch (error) {
      console.error('Error in updated accumulateLeavesToEmp:', error);
      message.error('Failed to updated accumulat leaves. Please try again.');
    }
  };

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters);
              setSearchedColumn(dataIndex);
              confirm({ closeDropdown: true });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
        : false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  /**
   *
   * @param selectedKeys
   * @param confirm
   * @param dataIndex
   */
  function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters: any) {
    clearFilters();
    setSearchText("");
  }

  const handleTableValuesChange = (event: React.ChangeEvent<HTMLInputElement>, key: string, record: any) => {
    const value = event.target.value;
    const duplicateRecord = {
      "leaveAllocationId": record.leaveAllocationId,
      "type": record.type,
      "total": record.total,
      "used": record.used,
      "available": record.available
    }

    setEditedRows((prevRows) => {
      const existingIndex = prevRows.findIndex(
        (row) => row.leaveAllocationId === record.leaveAllocationId
      );

      if (existingIndex !== -1) {
        return prevRows.map((row, index) =>
          index === existingIndex ? { ...row, [key]: value } : row
        );
      } else {
        return [...prevRows, { ...duplicateRecord, [key]: value }];
      }
    });
  };

  const columns: any = [
    {
      title: 'S.No.',
      dataIndex: 'serialNumber',
      key: 'sno',
      render: (text, record) => ({
        children: text,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      // width: '5%',
    },
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("name"),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      width: '12%',
    },
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("employeeCode"),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      width: '12%',
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      sorter: (a, b) => a.branchName.localeCompare(b.branchName),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("branchName"),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      width: '11%',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("department"),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      width: '10%',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      sorter: (a, b) => a.designation.localeCompare(b.designation),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("designation"),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      width: '9%',
    },
    {
      title: 'Division',
      dataIndex: 'division',
      key: 'division',
      sorter: (a, b) => a.division.localeCompare(b.division),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("division"),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      width: '10%',
    },
    {
      title: 'Leave Type',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (text: number | null, record: any) => {
        if (selectedRowKeys.includes(record.leaveAllocationId)) {
          return <Input defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
            onChange={(e) => handleTableValuesChange(e, 'total', record)} />
        }
        return text;
      },
      width: '8%',
    },
    {
      title: 'Used',
      dataIndex: 'used',
      key: 'used',
      align: 'right',
      render: (text: number | null, record: any) => {
        if (selectedRowKeys.includes(record.leaveAllocationId)) {
          return <Input defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
            onChange={(e) => handleTableValuesChange(e, 'used', record)} />
        }
        return text;
      },
      width: '8%',
    },
    {
      title: 'Available',
      dataIndex: 'available',
      key: 'available',
      align: 'right',
      render: (text: number | null, record: any) => {
        if (selectedRowKeys.includes(record.leaveAllocationId)) {
          return <Input defaultValue={text} onKeyPress={(e) => { if (!/^[0-9.]$/.test(e.key)) { e.preventDefault(); } }}
            onChange={(e) => handleTableValuesChange(e, 'available', record)} />
        }
        return text;
      },
      width: '8%',
    },
    {
      title: 'Status',
      dataIndex: 'available',
      key: 'status',
      align: 'center',
      render: (available, record) => {
        const availableNumber = Number(available);
        const totalNumber = Number(record.total);
        if (availableNumber !== 0 && totalNumber !== 0) {
          return <Badge status={getBadgeColor(availableNumber, totalNumber)} text={`${((availableNumber / totalNumber) * 100).toFixed(0)}%`} />;
        }
        return '-';
      },
    }

  ];

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: any[]) => {
      setSelectedRowKeys(keys)
      setSelectedRows(rows)
    },
  };

  return (
    <Card
      title={'Leave Allocation'}
    >
      <Form form={form} layout="vertical" onFinish={getEmpData}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Form.Item label="Branch" name="branchId" rules={[{ required: true, message: 'Please Select Branch' }]}>
              <Select
                showSearch
                allowClear
                placeholder="Select Branch"
                dropdownMatchSelectWidth={false}
                disabled={IAMClientAuthContext.user.roles === 'SuperAdmin' ? false : true}
                optionFilterProp="children"
                onChange={(value) => getAllActiveEmpDropDown(value)}
              >
                {/* <Option value="ALL">ALL</Option> */}
                {branches.map((rec) => (
                  <Option key={rec.id} value={rec.id}>
                    {rec.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Form.Item label="Division" name="divisionId">
              <Select
                allowClear
                placeholder="Select Division"
                showSearch
                optionFilterProp="children"
              >
                {divisions.map((res) => (
                  <Option key={res.divisionId} value={res.divisionId}>
                    {res.divisionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Form.Item label="Department" name="departmentId">
              <Select
                allowClear
                placeholder="Select Department"
                showSearch
                optionFilterProp="children"
              >
                {departments.map((res) => (
                  <Option key={res.deptId} value={res.deptId}>
                    {res.deptName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Form.Item label="Designation" name="designationId">
              <Select
                allowClear
                placeholder="Select Designation"
                showSearch
                optionFilterProp="children"
              >
                {designations.map((rec) => (
                  <Option value={rec.id} key={rec.id}>
                    {rec.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Form.Item label="Employee Name" name="employeeId">
              <Select
                allowClear
                placeholder="Select Employee"
                showSearch
                optionFilterProp="children"
              >
                {empData.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.fullName}-{emp.empCode}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              onClick={getEmpData}
            >
              Search
            </Button>
          </Col>
          <Col>
            <Button icon={<RedoOutlined />} onClick={onReset} danger>
              Reset
            </Button>
          </Col>
          {selectedRowKeys.length > 0 ? <>
            <Col>
              <Button icon={<RedoOutlined />} onClick={updateLeavesAccumulation} type="primary">
                Update Leave Allocations
              </Button>
            </Col></> : <></>}
        </Row>
      </Form>
      <Card>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col>
            <Button
              icon={<RedoOutlined />}
              onClick={allocateLeavesToEmp}
              type="primary"
            >
              New Employees Allocations
            </Button>
          </Col>
          <Col>
            <Button
              icon={<RedoOutlined />}
              type="primary"
              onClick={LeavesAccumulation}
            >
              Leaves accumulation
            </Button>
          </Col>
        </Row>
      </Card>
      <Table
        rowKey={(record) => record.leaveAllocationId}
        rowSelection={rowSelection}
        bordered
        columns={columns}
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default LeaveAllocationView;