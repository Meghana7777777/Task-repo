import { FileExcelOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { EmpDataReq, LeavesAccumulationReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeTypeService, LeaveAllocationService, LeaveBalanceService, LeavePolicyService, LeaveTypeService, } from '@hrexpert/shared-services';
import { Badge, Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../common/iam-client-react';
import '../attendance-adjustment/attendance-info.css';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Excel } from 'antd-table-saveas-excel';
import { PageContainer } from '@ant-design/pro-layout';
import { IExcelColumn } from 'antd-table-saveas-excel/app';

const { Title } = Typography;
const { Option } = Select;

interface LeaveAllocationViewProps {
  scopes: ScopesEnum[];
}

const LeaveBalanceWorkerView = (props: LeaveAllocationViewProps) => {
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
  const [pageSize, setPageSize] = useState(50)
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editedRows, setEditedRows] = useState<any[]>([]);
  const [leaveGroup, setLeaveGroup] = useState<any[]>([]);
  const [branchCheckBox, setBranchCheckBox] = useState<boolean>(false);
  const [departmentCheckBox, setDepartmentCheckBox] = useState<boolean>(false);
  const [designationCheckBox, setDesignationCheckBox] = useState<boolean>(false);
  const [divisionCheckBox, setDivisionCheckBox] = useState<boolean>(false);
  const [empTypeCheckBox, setEmpTypeCheckBox] = useState<boolean>(false);
  const [employeeTypes, setEmployeeTypes] = useState([])
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const currentUrl: string = window.location.href;
  const params = currentUrl ? currentUrl.split('?')[1] : null
  const [employeeId, branchId] = params ? params.split('-').map(Number) : [null, null]

  const leaveAllocationService = new LeaveAllocationService();
  const leaveBalanceService = new LeaveBalanceService();
  const divisionService = new DivisionService();
  const deptService = new DepartmentService();
  const designService = new DesignationsService();
  const branchService = new BranchesService();
  const policyService = new LeavePolicyService();
  const leaveTypeService = new LeaveTypeService()
  const employeeTypesService = new EmployeeTypeService()


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
        const leaveGroupRes = await leaveTypeService.getAllActiveLeaveGroup()
        const empTypeRes = await employeeTypesService.getActiveEmployeeType()
        const leaveTypeRes = await leaveTypeService.getAllActiveLeaveType()

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
        if (!leaveGroupRes.status) {
          message.error(`${leaveGroupRes.internalMessage || 'Unknown error'}`);
        }
        if (!empTypeRes.status) {
          message.error(`${empTypeRes.internalMessage || 'Unknown error'}`);
        }
        if (!leaveTypeRes.status) {
          message.error(`${leaveTypeRes.internalMessage || 'Unknown error'}`);
        }

        setBranches(branchRes.status ? branchRes.data : []);
        setDivisions(divisionRes.status ? divisionRes.data : []);
        setDepartments(deptRes.status ? deptRes.data : []);
        setDesignations(designRes.status ? designRes.data : []);
        setLeaveGroup(leaveGroupRes.status ? leaveGroupRes.data : []);
        setEmployeeTypes(empTypeRes.status ? empTypeRes.data : []);
        setLeaveTypes(leaveTypeRes.status ? leaveTypeRes.data : [])

        if (IAMClientAuthContext.user.roles === 'SuperAdmin') {
          form.setFieldsValue({ branchId: 'ALL' });
          await getAllActiveEmpDropDown('ALL')
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

    if (employeeId && branchId) {
      getSelectedEmpLeaveData()
    }

    fetchInitialData();
  }, [IAMClientAuthContext.user.roles, IAMClientAuthContext.user.unitId, form]);


  const getSelectedEmpLeaveData = async () => {
    try {

      const req = new EmpDataReq(Number(employeeId), null, null, dayjs().format('YYYYMM'), null,
        branchId, null, 0,
      );

      const res = await leaveBalanceService.getAllLeaveBalanceAllocations(req);

      if (!res.status) {
        message.error(`${res.internalMessage || 'Unknown error'}`);
        setEmployees([]);
        return;
      }

      setEmployees(res.data || []);
      form.setFieldsValue({ branchId: branchId });
      form.setFieldsValue({ employeeId: employeeId });

      if (!res.data || res.data.length === 0) {
        message.info('No employees found for the selected criteria');
      }
    } catch (error) {
      console.error('Error in getEmpData:', error);
      message.error('Failed to load employee data. Please try again.');
      setEmployees([]);
    }
  };


  const getAllActiveEmpDropDown = async (branchId) => {
    try {
      const formValues = form.getFieldsValue();
      const req = new EmpDataReq(formValues.employeeId, formValues.departmentId, formValues.designationId, null, formValues.divisionId, branchId === 'ALL' ? null : branchId);
      const res = await leaveAllocationService.getAllActiveEmpDropDown(req);

      if (!res?.status) {
        message.error(`Failed to load employee dropdown: ${res?.internalMessage || 'Unknown error'}`);
        setEmpData([]);
        return;
      }

      setEmpData(res.data.filter((r) => r.employeeTypeId !== 1))
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

      if (!formValues.monthYear) {
        message.warning('Please select a month');
        return;
      }

      const req = new EmpDataReq(formValues.employeeId, null, null, dayjs(formValues.monthYear).format('YYYYMM'), null,
        formValues.branchId === 'ALL' ? null : formValues.branchId, null, 0,
      );

      const res = await leaveBalanceService.getAllLeaveBalanceAllocations(req);

      if (!res.status) {
        message.error(`${res.internalMessage || 'Unknown error'}`);
        setEmployees([]);
        return;
      }

      setEmployees(res.data || []);

      if (!res.data || res.data.length === 0) {
        message.info('No workers found for the selected criteria');
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

  const onReset = () => {
    try {
      form.resetFields();
      setEmployees([])
      setSelectedRows([])
      setSelectedRowKeys([])
      form.setFieldsValue({ 'monthYear': dayjs() })
    } catch (error) {
      console.error('Error in onReset:', error);
      message.error('Failed to reset form. Please try again.');
    }
  };

  const LeavesAccumulation = async () => {
    try {
      const formValues = form.getFieldsValue();

      if (!formValues.branchId) {
        message.warning('Please select a branch');
        return;
      }

      if (!formValues.monthYear) {
        message.warning('Please select a branch');
        return;
      }

      const req = new LeavesAccumulationReq(null, null, null, null,
        formValues.branchId === 'ALL' ? null : formValues.branchId, formValues.leaveGroupId, formValues.employeeTypeId, formValues.monthYear
      );
      const res = await leaveBalanceService.leavesAccumlation(req);

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
      const res = await leaveBalanceService.updateLeavesBalance(req);

      if (res.status) {
        message.success(res.internalMessage || 'Leaves balance updated successfully');
        setEmployees([])
        setEditedRows([])
        setSelectedRowKeys([])
        setSelectedRows([])
        getEmpData()
      } else {
        message.error(res.internalMessage || 'Failed to updated leave balance');
      }
    } catch (error) {
      console.error('Error in updated :', error);
      message.error('Failed to updated leave balance. Please try again.');
    }
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

  const transformedData = [];

  employees.forEach((employee) => {
    let existingEmployee = transformedData.find(emp => emp.employeeId === employee.employeeId);

    if (!existingEmployee) {
      existingEmployee = {
        serialNumber: transformedData.length + 1,
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        employeeCode: employee.employeeCode,
        branchName: employee.branchName || "-",
        department: employee.department || "-",
        division: employee.divisionName || "-",
        designation: employee.designation || "-",
      };

      leaveTypes.forEach((leave) => {
        existingEmployee[`${leave.leaveTypeCode}_carried`] = 0;
        existingEmployee[`${leave.leaveTypeCode}_allocated`] = 0;
        existingEmployee[`${leave.leaveTypeCode}_utilized`] = 0;
        existingEmployee[`${leave.leaveTypeCode}_balance`] = 0;
      });

      transformedData.push(existingEmployee);
    }

    if (employee.leaveTypeId) {
      const leaveType = leaveTypes.find((lt) => lt.leaveTypeId === employee.leaveTypeId);

      if (leaveType) {
        existingEmployee[`${leaveType.leaveTypeCode}_carried`] = employee.carried || 0;
        existingEmployee[`${leaveType.leaveTypeCode}_allocated`] = employee.accum || 0;
        existingEmployee[`${leaveType.leaveTypeCode}_utilized`] = employee.utilized || 0;
        existingEmployee[`${leaveType.leaveTypeCode}_balance`] = ((Number(employee.carried) + Number(employee.accum)) - Number(employee.utilized)).toFixed(1) || 0;
      }
    }
  });


  const leaveTypeColumns = leaveTypes.map((leave) => ({
    title: leave.leaveTypeName,
    children: [
      {
        title: "Carried",
        dataIndex: `${leave.leaveTypeCode}_carried`,
        key: `${leave.leaveTypeCode}_carried`,
        render: (text) => text === 0 ? '0.0' : text,
        align: 'center'
      },
      {
        title: "Allocated",
        dataIndex: `${leave.leaveTypeCode}_allocated`,
        key: `${leave.leaveTypeCode}_allocated`,
        render: (text) => text === 0 ? '0.0' : text,
        align: 'center'
      },
      {
        title: "Utilized",
        dataIndex: `${leave.leaveTypeCode}_utilized`,
        key: `${leave.leaveTypeCode}_utilized`,
        render: (text) => text === 0 ? '0.0' : text,
        align: 'center'
      },
      {
        title: "Balance",
        dataIndex: `${leave.leaveTypeCode}_balance`,
        key: `${leave.leaveTypeCode}_balance`,
        render: (text) => text === 0 ? '0.0' : text,
        align: 'center'
      }
    ]
  }));

  const columns: any = [
    {
      title: 'S.No.',
      dataIndex: 'serialNumber',
      key: 'sno',
      width: 35,
      render: (text, record) => ({
        children: text,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      fixed: 'left'
    },
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      // sorter: (a, b) => a.name.localeCompare(b.name),
      // sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("name", 'Employee Name'),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      fixed: 'left'
    },
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      width: 110,
      // sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
      // sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("employeeCode", 'Employee Code'),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      fixed: 'left'
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      // sorter: (a, b) => a.branchName.localeCompare(b.branchName),
      // sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("branchName", 'Branch'),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      hidden: branchCheckBox ? false : true,
      fixed: 'left',
      width: 110,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("department", 'Department'),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      hidden: departmentCheckBox ? false : true,
      fixed: 'left',
      width: 110,
    },
    {
      title: 'Division',
      dataIndex: 'division',
      key: 'division',
      sorter: (a, b) => a.division.localeCompare(b.division),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("division", 'Division'),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      hidden: divisionCheckBox ? false : true,
      fixed: 'left',
      width: 110,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      sorter: (a, b) => a.designation.localeCompare(b.designation),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("designation", 'Designation'),
      render: (text, record) => ({
        children: <div>{text}</div>,
        props: {
          rowSpan: record.rowSpan,
        },
      }),
      hidden: designationCheckBox ? false : true,
      fixed: 'left',
      width: 110,
    },
    ...leaveTypeColumns

  ];


  const exportToExcel = () => {
    const excel = new Excel();
    const calculateColumnWidths = (columns: IExcelColumn[], data: any[]) =>
      columns.map((col: any) => ({
        ...col,
        width: Math.max(
          col.title.toString().length,
          ...data.map((row) => row[col.dataIndex]?.toString().length || 0)
        ) * 12
      }));
    const adjustedColumns = calculateColumnWidths(columns, transformedData);
    excel
      .addSheet('Workers Leave Balance Report')
      .addColumns(adjustedColumns)
      .addDataSource(transformedData, { str2num: true })
      .saveAs('Leave Balance Report.xlsx');
  };



  return (
    <>
      <PageContainer title={'Workers Leave Balance'} >
        <Form form={form} layout="vertical" onFinish={getEmpData}>
          <Row gutter={16}>

            <Col xs={24} sm={12} md={8} lg={5} xl={5}>
              <Form.Item label="Month" name="monthYear" initialValue={dayjs()} rules={[{ required: true, message: 'Please Select Month!' }]}>
                <DatePicker
                  picker="month"
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const startOfYear = dayjs().startOf('year'); // Beginning of the current year
                    const endOfYear = dayjs().endOf('year'); // End of the current year
                    return current && (current < startOfYear || current > endOfYear);
                  }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={5} xl={5}>
              <Form.Item label="Branch" name="branchId" rules={[{ required: true, message: 'Please Select Branch!' }]}>
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
                  <Option value={'ALL'}> ALL </Option>
                  {branches.map((rec) => (
                    <Option key={rec.id} value={rec.id}>
                      {rec.branchName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={7} xl={7}>
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

            {/* <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item label='Employee Type' name='employeeTypeId'>
                            <Select placeholder={'Select Employee Type'} >
                                {
                                    employeeTypes.map((v: any) => { return <Option key={v.id} value={v?.id}>{v?.name}</Option> })
                                }
                            </Select>
                        </Form.Item>
                    </Col> */}


            {/* <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Leave Group" name="leaveGroupId" >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Leave Group"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                            >
                                {leaveGroup.map((rec) => (
                                    <Option key={rec.id} value={rec.id}>
                                        {rec.leaveGroupName} - {rec.leaveGroupCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}

          </Row>
          <Row gutter={16} style={{ marginBottom: '10px', marginTop: '10px' }}>
            <Col>
              <Button
                onClick={getEmpData}
                style={{ width: '100%' }} color="primary" variant="outlined"
              >
                Submit
              </Button>
            </Col>
            <Col>
              <Button icon={<RedoOutlined />} onClick={onReset} danger>
                Reset
              </Button>
            </Col>
            {/* {selectedRowKeys.length > 0 ? <>
            <Col>
              <Button icon={<RedoOutlined />} onClick={updateLeavesAccumulation} type="primary">
                Update Leave Balance
              </Button>
            </Col></> : <></>} */}

            {/* <Col>
            <Button
              icon={<RedoOutlined />}
              type="primary"
              onClick={LeavesAccumulation}
            >
              Process accumulation
            </Button>
          </Col> */}

            {transformedData.length > 0 ? <> <Col>
              <Button icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportToExcel()}>
                Get Excel
              </Button>
            </Col></> : <></>}

          </Row>
        </Form>
        <br></br>

        {employees.length > 0 ?
          <>
            <Row gutter={16} style={{ marginBottom: '10px', justifyContent: 'flex-end' }}>
              <Checkbox checked={branchCheckBox} onChange={() => branchCheckBox ? setBranchCheckBox(false) : setBranchCheckBox(true)} > Branch </Checkbox>
              <Checkbox checked={departmentCheckBox} onChange={() => departmentCheckBox ? setDepartmentCheckBox(false) : setDepartmentCheckBox(true)}  > Departments </Checkbox>
              <Checkbox checked={divisionCheckBox} onChange={() => divisionCheckBox ? setDivisionCheckBox(false) : setDivisionCheckBox(true)}  > Division </Checkbox>
              <Checkbox checked={designationCheckBox} onChange={() => designationCheckBox ? setDesignationCheckBox(false) : setDesignationCheckBox(true)}  > Designation </Checkbox>
            </Row>
            <Table
              className='small-table'
              //rowKey={(record) => record.leaveAllocationId}
              //rowSelection={rowSelection}
              bordered
              columns={columns}
              dataSource={transformedData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 1600 }}
              onChange={handleTableChange}
            />

          </> : <></>}
      </PageContainer>

    </>
  );
};

export default LeaveBalanceWorkerView;