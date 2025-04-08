import { EmpRecComponentsSharedDto } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DivisionService, EmployeeFilterReq, EmployeeOnboardingService, EmployeeTypeService, EmpRecCompSharedService, PayrollComponentsSharedService, PayrollRecordsSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space, Spin, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnType } from 'antd/es/table';

export interface EmpRecurringComponentProps {
  empRecCompData: EmpRecComponentsSharedDto;
  updateDetails: (hrms: EmpRecComponentsSharedDto) => void;
  isUpdate?: boolean;
  closeForm?: () => void;
  getEmpRecComponent?: () => void;
}

const EmployeeRecurringComponent = (props: EmpRecurringComponentProps) => {
  const recurringService = new EmpRecCompSharedService();
  const service = new EmployeeOnboardingService();
  const servicePayRoll = new PayrollComponentsSharedService();
  const payrollRecordsService = new PayrollRecordsSharedService();
  const branchService = new BranchesService();
  const deptService = new DepartmentService()
  const divisionService = new DivisionService()
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [page, setPage] = React.useState(1);
  const [componentData, setComponentData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<any>(null);
  const [amount, setAmount] = useState<string>('');
  const [amountsMap, setAmountsMap] = useState<{ [key: string]: string }>({});
  const [filteredComponents, setFilteredComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const { Option } = Select
  const [isPermanent, setIsPermanent] = useState(null);
  const [branches, setBranches] = useState<any>([]);
  const empTypeService = new EmployeeTypeService()
  const [employeeTypes, setEmployeeTypes] = useState([])
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  // const [employeeCodeInput, setEmployeeCodeInput] = useState('');
  const createdUser = IAMClientAuthContext.user.roles;
  const updatedUser = IAMClientAuthContext.user.employeeId;
  const navigate = useNavigate()
  const tempInput = useRef('');

  // console.log(componentData, 'componentData');

  useEffect(() => {
    getAllBranches();
    getEmployeeTypes();
  }, []);

  const handleComponentTypeChange = () => {
    form.resetFields(["componentId"]);
    const value = form.getFieldValue('componentType');
    const empTypeId = form.getFieldValue('employeeTypeId');
    const excludedComponents = ["SPL PAY", "GROSS", "BASIC", "HRA", "CHILD EDU", "CONVY ALLO", "PER DAY", "PT", "PF", "ESI"];
    if (value && empTypeId) {
      const filtered = componentData.filter(
        (comp) => comp.componentType === value && comp.employeeTypeId === empTypeId && !excludedComponents.some(keyword => comp.componentName.includes(keyword))
      );
      setFilteredComponents(filtered);
    } else {
      setFilteredComponents([]);
    }
  };

  const getEmployeeTypes = async () => {
    const res = await empTypeService.getActiveEmployeeType()
    setEmployeeTypes(res.data)
  }

  const getPayrollComponents = async (value) => {
    try {

      const res = await servicePayRoll.getPayrollComponentsByBranch({ branchId: value });
      if (res.status) {
        setComponentData(res.data);
      } else {
        message.error('Failed to fetch payroll components');
      }
    } catch (error) {
      console.error("Error fetching payroll components", error);
    }
  };

  const getActiveEmployeeList = async (employeeCodeInput = '') => {
    const req = new EmployeeFilterReq();
    const formValues = form.getFieldsValue();
    req.branchId = formValues?.branchId; // Assign branchId if it exists
    try {
      const res = await service.getAllEmpForRec(req);
      if (res.status) {
        let filteredData = res.data;
        // If employeeCodeInput is entered, filter the results
        if (typeof employeeCodeInput === 'string' && employeeCodeInput.trim()) {
          const employeeCodes = employeeCodeInput
            .split(',')
            .map(code => code.trim());

          filteredData = filteredData.filter(emp =>
            employeeCodes.includes(emp.employeeCode)
          );
        }
        setTableData(filteredData);
      } else {
        message.error('Failed to fetch payroll employee details');
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
      message.error('An error occurred while fetching employee details');
    }
  };

  const getAllBranches = () => {
    try {
      branchService.getAllBranches().then((res) => {
        if (res.status) {
          setBranches(res.data);
        } else {
          console.log("Failed to fetch branches");
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleRowSelection = (selectedKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedKeys);
    setAmountsMap((prev) => {
      const updatedMap = { ...prev };
      selectedRows.forEach((row) => {
        if (!updatedMap[String(row.id)]) {
          updatedMap[String(row.id)] = amount;
        }
      });
      Object.keys(prev).forEach((rowId) => {
        if (!selectedKeys.includes(Number(rowId))) {
          delete updatedMap[rowId];
        }
      });
      return updatedMap;
    });
  };

  const handleIsPermanentChange = (value) => {
    setIsPermanent(value);
  };

  const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
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

  const saveData = async () => {
    try {
      await form.validateFields(); // Validate standard form fields
    } catch (error) {
      message.error("Please fill required fields before submitting.");
      return;
    }
    const componentId = form.getFieldValue('componentId');
    const componentType = form.getFieldValue('componentType');
    const isPermanent = form.getFieldValue('isPermanent');
    const termCount = form.getFieldValue('termCount') ? form.getFieldValue('termCount') : 1;
    const totalTerms = form.getFieldValue('totalTerms') ? form.getFieldValue('totalTerms') : 1;
    const fromDate = form.getFieldValue('fromDate');
    const startDate = dayjs(fromDate).format('YYYYMM')
    const recordsForEmpRecCompAndNonRecTerms = selectedRowKeys.map(employeeId => {
      const amount = amountsMap[String(employeeId)] || '';
      return {
        employeeId, componentId, amount, isPermanent, startDate
      };
    });
    try {
      let totalAmount;
      if (componentType === "DEDUCTION" && isPermanent === "No") {
        console.log("Deductions No")
        const recordsForNonRecComponent = selectedRowKeys.map(employeeId => {
          const amount = amountsMap[String(employeeId)] || '';
          return {
            employeeId, componentId, amount, startDate, termCount, totalTerms, totalAmount, createdUser, updatedUser, isPermanent
          };
        });
        totalAmount = recordsForNonRecComponent.reduce((sum, record) => {
          return sum + parseFloat(record.amount || '-');
        }, 0);
        for (const record of recordsForNonRecComponent) {
          record.totalAmount = totalAmount
        }
        const response = await recurringService.createEmpNonRecComponent(recordsForNonRecComponent);
        if (!response.status) {
          throw new Error(response.internalMessage || 'Failed to Save ');
        } else {
          message.success(response.internalMessage);
        }
      } else if (componentType === 'DEDUCTION' && isPermanent === 'Yes') {
        console.log("Earning")
        const response = await recurringService.createEmpNonRecComponent(recordsForEmpRecCompAndNonRecTerms);
        if (!response.status) {
          throw new Error(response.internalMessage || 'Failed to save record');
        } else {
          message.success(response.internalMessage);
        }
      } else if (componentType === 'EARNING' && isPermanent === 'No') {
        console.log("Earning No")
        const recordsForNonRecComponent = selectedRowKeys.map(employeeId => {
          const amount = amountsMap[String(employeeId)] || '';
          return {
            employeeId, componentId, amount, startDate, termCount, totalTerms, totalAmount, createdUser, updatedUser, isPermanent
          };
        });
        totalAmount = recordsForNonRecComponent.reduce((sum, record) => {
          return sum + parseFloat(record.amount || '-');
        }, 0);
        for (const record of recordsForNonRecComponent) {
          record.totalAmount = totalAmount
        }
        const response = await recurringService.createEmpNonRecComponent(recordsForNonRecComponent);
        if (!response.status) {
          throw new Error(response.internalMessage || 'Failed to Save ');
        } else {
          message.success(response.internalMessage);
        }
      } else {
        console.log("Earning")
        const response = await recurringService.createEmpNonRecComponent(recordsForEmpRecCompAndNonRecTerms);
        if (!response.status) {
          throw new Error(response.internalMessage || 'Failed to save record');
        } else {
          message.success(response.internalMessage);
        }
      }
      //message.success('Records created successfully');
      props.closeForm?.();
      props.getEmpRecComponent?.();
      getActiveEmployeeList('');

      form.resetFields();
      setSelectedComponentId(null);
      setAmount('');
      setSelectedRowKeys([]);
      setAmountsMap({});
      setIsPermanent([]);
    } catch (error) {
      console.error("Error saving data", error);
      message.error(`Failed to create records: ${error.message}`);
    }
  };

  const onReset = () => {
    form.resetFields();
    setSelectedComponentId(null);
    setAmount('');
    setSelectedRowKeys([]);
    setAmountsMap({});
    setIsPermanent([]);
    setTableData([])
  }

  const handleViewNonRec = () => {
    navigate('/emp-non-rec-payable')
  }

  return (
    <Card title="Employee Earnings & Deductions" extra={<Button key='1' onClick={handleViewNonRec} color="primary" variant="outlined" type='default'>View</Button>}>
      <Form form={form} layout="vertical" onFinish={saveData}>
        <Row gutter={[24, 24]}>
          <Col span={5}>
            <Form.Item label="Branch" name="branchId"
              rules={[{ required: true }]}>
              <Select showSearch
                allowClear
                placeholder="Select Branch"
                optionFilterProp="children"
                onChange={(value) => {
                  getPayrollComponents(value);
                  getActiveEmployeeList();
                }}
              >
                {branches.map((rec: any) => (
                  <Option value={rec.id} key={rec.id}>
                    {rec.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='Employee Codes' name='employeeCode'>
              <Input
                placeholder="Enter Employee Codes (comma-separated)"
                // value={employeeCodeInput}
                onChange={(e) => (tempInput.current = e.target.value)} // Store input without triggering re-renders
                onBlur={() => {
                  // setEmployeeCodeInput(tempInput.current); // Update state only on blur
                  getActiveEmployeeList(tempInput.current); // Call API after input is updated
                }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label='Employee Type' name='employeeTypeId' rules={[{ required: true }]}>
              <Select placeholder='Select Employee Type' allowClear showSearch
                optionFilterProp="children"
                onChange={handleComponentTypeChange}
              >
                {employeeTypes?.map((rec: any) => {
                  return <Option value={rec.id} key={rec.id}>{rec.name}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="componentType" label="Component Type" rules={[{ required: true }]}>
              <Select
                showSearch
                allowClear
                placeholder="Select Component Type"
                onChange={handleComponentTypeChange}
              >
                {Array.from(
                  new Map(
                    componentData.map((comp) => [comp.componentType, comp])
                  ).values()
                ).map((comp) => (
                  <Select.Option key={comp.componentType} value={comp.componentType}>
                    {comp.componentType}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name="componentId" label="Component Name" rules={[{ required: true, message: 'Please select component name' }]}>
              <Select showSearch allowClear placeholder="Select Component Name">
                {filteredComponents.map((comp) => (
                  <Select.Option key={comp.id} value={comp.id}>
                    {comp.componentName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={isPermanent === 'No' ? 'Emi Amount' : 'Amount'} >
              <Input
                value={amount}
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="From Month" name="fromDate" rules={[{ required: true }]}>
              <DatePicker
                picker="month"
                style={{ width: '100%' }}
                placeholder='Select Month'
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Is Permanent" name="isPermanent" rules={[{ required: true }]}>
              <Select
                placeholder="Select Is Permanent"
                allowClear
                onChange={handleIsPermanentChange}
              >
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
          </Col>

          {(isPermanent === 'No') && (
            <>
              <Col span={3}>
                <Form.Item label="Start Count" name="termCount">
                  <Input placeholder="Enter Term Count" defaultValue={1} />
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item label="Total Terms" name="totalTerms">
                  <Input placeholder="Enter Total Terms" defaultValue={1} />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={5}>
            <Button
              type="primary"
              style={{ marginRight: '15px', marginTop: '21px' }}
              onClick={saveData}
              disabled={selectedRowKeys.length === 0}
              variant="outlined" color="primary"
            >
              Submit
            </Button>
            <Button
              type="default"
              danger
              onClick={onReset}
            >
              Reset
            </Button>
          </Col>
        </Row>

        <br></br>
        <Spin spinning={loading}>
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: handleRowSelection,
            }}
            rowKey={(record) => record.id}
            columns={[
              {
                title: 'S No',
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: "center",
              },
              {
                title: 'Employee Code', dataIndex: 'employeeCode', align: "center",
                ...getColumnSearchProps("employeeCode", 'Employee Code'),
                sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
                sortDirections: ['ascend', 'descend'],
              },
              {
                title: 'Employee Name', dataIndex: 'fullName', align: "center",
                ...getColumnSearchProps("fullName", 'Employee Name'),
                sorter: (a, b) => a.fullName.localeCompare(b.fullName),
                sortDirections: ['ascend', 'descend'],
              },
              {
                title: 'Department', dataIndex: 'department', align: "center",
                ...getColumnSearchProps("department", 'Department'),
              },
              {
                title: 'Division', dataIndex: 'division', align: "center",
                ...getColumnSearchProps("division", 'Division'),
              },
              {
                title: 'Branch', dataIndex: 'branch', align: "center",
                ...getColumnSearchProps("branch", 'Branch'),
              },
              {
                title: 'Amount',
                dataIndex: 'amount',
                render: (_, record) => (
                  <Input
                    disabled={isPermanent === 'No' && record.termCount >= record.totalTerms}
                    placeholder='Enter amount'
                    value={amountsMap[record.id] || ''}
                    onChange={(e) =>
                      setAmountsMap((prev) => ({ ...prev, [record.id]: e.target.value }))
                    }
                  />
                ),
              },
            ]}
            dataSource={tableData}
            pagination={false}
          />
        </Spin>
      </Form>
    </Card >
  )

};

export default EmployeeRecurringComponent;