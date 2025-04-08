import { AppstoreOutlined, FileExcelOutlined, PlusOutlined, TableOutlined, UndoOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import { BranchReq, EmployeeViewModel, ScopesEnum } from '@hrexpert/shared-models'
import { BranchesService, DepartmentService, DesignationsService, EmployeeOnboardingService, EmployeeTypeService } from '@hrexpert/shared-services'
import { Button, Col, Form, message, Pagination, Row, Select, Space } from 'antd'
import axios from 'axios'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIAMClientState } from '../../../../../common/iam-client-react'
import EmployeeCardView from '../../components/employees-card-view/employees-card-view'
import EmployeeTableView from '../../components/employees-table-view/employee-table-view'
import { configVariables } from './../../../../../../../../libs/shared-services/src/lib/config'

interface EmployeeViewIProps {
  scopes: ScopesEnum[]
}


const EmployeeView = (props: EmployeeViewIProps) => {
  const { scopes } = props
  const [viewType, setViewType] = useState<"card" | "table">("card")
  const [employeeData, setEmployeeData] = useState<EmployeeViewModel[]>([])
  // const [transformedPdfData, setTransformedPdfData] = useState<EmployeeViewResponseModel[]>([])
  const [employeeFileData, setEmployeeFileData] = useState([]);
  const empService: EmployeeOnboardingService = new EmployeeOnboardingService()
  const [loading, setLoading] = useState<boolean>(false)
  const [departments, setDepartments] = useState([]);
  const [designatioin, setDesignatioin] = useState([]);
  const dpService = new DepartmentService()
  const { Option } = Select;
  const desService = new DesignationsService();
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalActive: 0,
    totalInactive: 0,
    employeesTypeCount: 0,
    workersTypeCount: 0,
  });
  const [searchBranchQuery, setSearchBranchQuery] = useState<number>(null);
  const [searchDesignationQuery, setSearchDesignationQuery] = useState<number>(null);
  const [searchDepartmentQuery, setSearchDepartmentQuery] = useState<number>(null);
  const [searchRepoManagertQuery, setSearchRepoManagertQuery] = useState<number>(null);
  const [searchEmpNameQuery, setSearchEmpNameQuery] = useState<string>("");
  const branchesService = new BranchesService()
  const empTypeService = new EmployeeTypeService()
  const [branches, setBranches] = useState<any>([])
  const [searchEmpCode, setSearchEmpCode] = useState<string>('');
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const role = IAMClientAuthContext.user.roles;
  const [employees, setEmployees] = useState<any>([]);
  const [employeType, setEmployeType] = useState<any>([]);
  const [reportingManagerData, setReportingManagerData] = useState<any>([]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => {
      return (
        {
          ...prev,
          current: page,
          pageSize,
        })
    });
    getEmployeeData({
      page,
      pageSize,
      branchId: form.getFieldValue('branchId'),
      departmentId: form.getFieldValue('departmentId'),
      designationId: form.getFieldValue('designationId'),
      employeeType: props.scopes.includes(ScopesEnum.Employee) ? 1 : props.scopes.includes(ScopesEnum.Worker) ? 0 : null,
      activeInactive: form.getFieldValue('activeInactive'),
      reportingManagerId: form.getFieldValue('reportingManagerId'),
    });
  };

  useEffect(() => {
    getDesignationList()
    getDepartmentList()
    getBranches()
    getActiveEmployeeType()
    getAllReportingManagerAndCode()
    if (IAMClientAuthContext.user.roles === "SuperAdmin") {
      form.setFieldsValue({ branches: "ALL" })
      handleBranchChange(null)
    } else {
      form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
      handleBranchChange(IAMClientAuthContext.user.unitId)
    }
  }, [props.scopes])

  useEffect(() => {
    console.log('Search query reset. Fetching all data...');
    if (!searchEmpNameQuery && !searchEmpCode) {
      getEmployeeData({ page: 1, branchId: IAMClientAuthContext.user.roles !== "SuperAdmin" ? Number(IAMClientAuthContext.user.unitId) : null, employeeType: props.scopes.includes(ScopesEnum.Employee) ? 1 : props.scopes.includes(ScopesEnum.Worker) ? 0 : null });
      // setPagination((prev) => ({ ...prev, current: 1 }));
    }
  }, [searchEmpNameQuery, searchEmpCode, props.scopes,]);

  function changeviewType() {
    setViewType(prev => prev == "card" ? "table" : "card")
  }
  const handleBranchChange = (branchId) => {
    if (branchId === "ALL") {
      form.setFieldsValue({ branches: 'ALL' }); // Map "ALL" to null
    } else if (branchId === null) {
      form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
    } else if (branchId === '') {
      form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
    } else {
      form.setFieldsValue({ branches: branchId }); // Set selected branch ID
    }
    const branchRequest = new BranchReq(branchId);
    empService.getEmpDetailsByBranch(branchRequest).then((res) => {
      if (res.status) {
        if (scopes.includes(ScopesEnum.Employee)) {
          setEmployees(res.data.filter((r) => r.employeeTypeId === 1))
        } else if (scopes.includes(ScopesEnum.Worker)) {
          setEmployees(res.data.filter((w) => w.employeeTypeId != 1))
        } else {
          setEmployees(res.data);
        }
      } else {
        setEmployees('No Data Found');
      }
    });
  };

  const getEmployeeData = (filters?: { searchEmpCode?: string; searchEmpName?: string; departmentId?: number; designationId?: number; page?: number; pageSize?: number; isExcel?: boolean, branchId?: number, employeeType?: number, activeInactive?: any, reportingManagerId?: any }) => {
    try {
      const { current, pageSize } = pagination;
      const searchCode = filters?.searchEmpCode ?? searchEmpCode;
      const searchName = filters?.searchEmpName ?? searchEmpNameQuery;
      const searchBranch = filters?.branchId ?? searchBranchQuery;
      const searchDesignation = filters?.designationId ?? searchDesignationQuery;
      const searchDepartment = filters?.departmentId ?? searchDepartmentQuery;
      const searchRepoManager = filters?.reportingManagerId ?? searchRepoManagertQuery;

      empService
        .getAllEmployees({
          ...filters,
          searchEmpCode: searchCode || '',
          search: searchName || '',
          page: filters?.page || current,
          pageSize: filters?.pageSize || pageSize,
          isExcel: false,
          branchId: searchBranch,
          designationId: searchDesignation,
          departmentId: searchDepartment,
          reportingManagerId: searchRepoManager,
          employeeType: scopes.includes(ScopesEnum.Employee) ? 1 : scopes.includes(ScopesEnum.Worker) ? 0 : null
        })
        .then((res) => {
          if (res.status) {
            setEmployeeData(res.data);
            setEmployeeFileData(res.employeeData);
            setPagination((prev) => ({
              ...prev,
              total: res.totalCount,
              totalActive: res.totalActive,
              totalInactive: res.totalInactive,
              employeesTypeCount: res.employeesTypeCount,
              workersTypeCount: res.workersTypeCount,
            }));
            // message.success(res.internalMessage, 1)
          } else {
            message.info(res.internalMessage, 1)
            setEmployeeData([])
            console.error("Failed to Fetch Employees");
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const onSearch = (values: {
    departmentId?: number;
    designationId?: number;
    branchId?: number;
    searchEmpCode: string;
    employeeType: number;
    activeInactive: any;
    reportingManagerId: any;
  }) => {
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    getEmployeeData({
      departmentId: values.departmentId,
      designationId: values.designationId,
      branchId: values.branchId,
      searchEmpCode: values.searchEmpCode,
      employeeType: props.scopes.includes(ScopesEnum.Employee) ? 1
        : props.scopes.includes(ScopesEnum.Worker) ? 0
          : null,
      activeInactive: values.activeInactive,
      reportingManagerId: values.reportingManagerId,
      page: 1,
      pageSize: pagination.pageSize
    });
  };


  const getDepartmentList = () => {
    try {
      dpService.getAllDepartments().then((res) => {
        if (res.status) {
          setDepartments(res.data);
        } else {
          console.error("Failed to fetch departments");
        }
      })
    } catch (err) {
      console.log(err);
    }
  };

  const getAllReportingManagerAndCode = () => {
    try {
      empService.getAllReportingManagerAndCode().then((res) => {
        if (res.status) {
          setReportingManagerData(res.data);
        } else {
          console.error("Failed to fetch reporting managers");
        }
      })
    } catch (err) {
      console.log(err);
    }
  };

  const getDesignationList = () => {
    try {
      desService.getDesignations().then((res) => {
        if (res.status) {
          setDesignatioin(res.data);
        } else {
          console.error("failed to fetch designations");
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const getActiveEmployeeType = () => {
    try {
      empTypeService.getActiveEmployeeType().then((res) => {
        if (res.status) {
          setEmployeType(res.data);
        } else {
          console.error("failed to fetch designations");
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const clearForm = () => {
    form.resetFields();

    debouncedSearchEmployee.cancel();
    debouncedSearchEmployeeCode.cancel();
    debouncedSearchBranch.cancel()
    debouncedSearchDesignation.cancel()
    debouncedSearchDepartment.cancel()
    debouncedSearchRepoManager.cancel()

    setSearchEmpNameQuery('');
    setSearchEmpCode('');
    setSearchBranchQuery(null)
    setSearchDesignationQuery(null)
    setSearchDepartmentQuery(null)
    setSearchRepoManagertQuery(null)


    getEmployeeData({ branchId: null, designationId: null, departmentId: null, reportingManagerId: null, searchEmpCode: '', searchEmpName: '', page: 1, employeeType: props.scopes.includes(ScopesEnum.Employee) ? 1 : props.scopes.includes(ScopesEnum.Worker) ? 0 : null })
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }))

  };

  const debouncedSearchBranch = useCallback(
    debounce((value: number) => {
      setSearchBranchQuery(value);
      form.setFieldsValue({ branchId: null });
      getEmployeeData({ branchId: value });
    }, 500),
    [form]
  );

  const debouncedSearchDesignation = useCallback(
    debounce((value: number) => {
      setSearchDesignationQuery(value);
      form.setFieldsValue({ designationId: null });
      getEmployeeData({ designationId: value });
    }, 500),
    [form]
  );
  const debouncedSearchDepartment = useCallback(
    debounce((value: number) => {
      setSearchDepartmentQuery(value);
      form.setFieldsValue({ departmentId: null });
      getEmployeeData({ departmentId: value });
    }, 500),
    [form]
  );

  const debouncedSearchEmployee = useCallback(
    debounce((value: string) => {
      setSearchEmpNameQuery(value);
      setSearchEmpCode('');
      form.setFieldsValue({ employeeCode: '' });
      getEmployeeData({ searchEmpName: value });
    }, 500),
    [form]
  );

  const debouncedSearchEmployeeCode = useCallback(
    debounce((value: string) => {
      setSearchEmpCode(value);
      setSearchEmpNameQuery('');
      form.setFieldsValue({ employee: '' });
      getEmployeeData({ searchEmpCode: value });
    }, 500),
    [form]
  );

  const debouncedSearchRepoManager = useCallback(
    debounce((value: number) => {
      setSearchRepoManagertQuery(value);
      form.setFieldsValue({ reportingManagerId: null });
      getEmployeeData({ reportingManagerId: value });
    }, 500),
    [form]
  );

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   debouncedSearchEmployee(value);
  // };

  // const handleSearchChangeEmpCode = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   debouncedSearchEmployeeCode(value);
  // };

  const getBranches = () => {
    branchesService.getActiveBranches().then((res) => {
      if (res.status) {
        setBranches(res.data)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const exportExcel = async () => {
    try {
      const values = form.getFieldsValue();
      message.loading({ content: 'Excel is being downloaded...', key: 'excelDownload', duration: 0 });
      const response = await axios.post(`${configVariables.APP_EMS_SERVICE_URL}/employee-onboarding/excelDownload`,
        {
          departmentId: values.departmentId,
          designationId: values.designationId,
          branchId: values.branchId,
          // employee: values.employee,
          searchEmpCode: values.searchEmpCode,
          employeeType: props.scopes.includes(ScopesEnum.Employee) ? 1
            : props.scopes.includes(ScopesEnum.Worker) ? 0
              : null,
        },
        {
          responseType: 'arraybuffer',
        }
      );
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (response.headers['content-type'] !== fileType) {
        throw new Error('The file is not in Excel format.');
      }
      const blob = new Blob([response.data], { type: fileType });
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `${props.scopes.includes(ScopesEnum.Employee) ? 'EmployeeData.xlsx' : 'WorkersData.xlsx'}`
      link.click();

      message.success({ content: 'Excel Download Successful', key: 'excelDownload' });
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error({ content: 'Error exporting data. Please try again.', key: 'excelDownload' });
    }
  };


  return (
    <PageContainer title={props.scopes.includes(ScopesEnum.Employee) ? "Employee Details" : props.scopes.includes(ScopesEnum.Worker) ? "Worker Details" : "Details"} breadcrumbRender={false} extra={<Space>

      <Button onClick={changeviewType} icon={viewType == "card" ? <TableOutlined /> : <AppstoreOutlined />}></Button>

      <Link to="/employee-form">
        <Button type="primary" icon={<PlusOutlined />}>Add</Button>
      </Link>

    </Space>}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onSearch}
      >
        <Row gutter={[24, 4]}>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label={'Branch'} name='branchId'
            // initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : Number(IAMClientAuthContext.user.unitId)}
            >
              <Select disabled={role === 'SuperAdmin' ? false : true} placeholder="Select Branch" showSearch allowClear optionFilterProp="children" dropdownMatchSelectWidth={false}
                onChange={(value) => handleBranchChange(value)}>
                <Option value={''}> ALL </Option>
                {branches.map((br) => (
                  <Option key={br.id} value={br.id}>
                    {br.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item label='Employee Name' name='searchEmpCode' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? null : IAMClientAuthContext.user.employeeCode}>
              <Select showSearch allowClear dropdownMatchSelectWidth={false}
                disabled={IAMClientAuthContext.user.roles === "SuperAdmin" ? false : true}
                optionFilterProp="children" placeholder="Select Employee Name"  >
                {employees.map((rec: any) => (
                  <Option value={rec.employeeCode} key={rec.employeeId}>
                    {rec.employeeName}-{rec.employeeCode}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={4}>
            <Form.Item name={'employeeType'} label={'Employee Type'}>
              <Select placeholder="Select Employee Type" showSearch allowClear>
                {employeType.map((empTy) => (
                  <Option key={empTy.id} value={empTy.id}>
                    {empTy.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={3}>
            <Form.Item name="activeInactive" label="Active / Inactive">
              <Select mode="multiple" placeholder="Select Status" showSearch allowClear>
                <Option key="yes" value="1">Active</Option>
                <Option key="no" value="0">In Active</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="reportingManagerId" label="Reporting Manager">
              <Select placeholder="Select Reporting Manager" showSearch allowClear>
                {reportingManagerData.map((rep) => (
                  <Option key={rep.reportingManager} value={rep.reportingManager}>
                    {rep.reportingManagerName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={'departmentId'} label={'Department'}>
              <Select placeholder="Select Department" showSearch allowClear>
                {departments.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={'designationId'} label={'Designation'}>
              <Select placeholder="Select Designation" showSearch allowClear >
                {designatioin.map((des) => (
                  <Option key={des.id} value={des.id}>
                    {des.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4} lg={2} xl={2}>
            <Button style={{ width: '100%' }} color="primary" variant="outlined" htmlType="submit">
              Submit
            </Button>
          </Col>&nbsp;
          <Col xs={24} sm={12} md={4} lg={2} xl={2}>
            <Button
              style={{ width: '100%' }}
              type="dashed"
              icon={<UndoOutlined />}
              danger
              onClick={clearForm}
            >
              Reset
            </Button>
          </Col>&nbsp;
          <Col xs={24} sm={12} md={4} lg={2} xl={2}>
            <Button
              style={{
                border: "1px dashed #22f534",
                color: "green",
                fontWeight: "bold",
              }}
              type="dashed"
              onClick={exportExcel}
              icon={<FileExcelOutlined />}
            >
              Get Excel
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4} lg={2} xl={16}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              style={{ float: "right" }}
            />
          </Col>
        </Row>

      </Form>
      <br />
      {(viewType === "table" ? <EmployeeCardView searchQuery={searchEmpNameQuery} loading={loading} employeeData={employeeData} pagination={pagination} onPageChange={handlePageChange} getEmployeeData={getEmployeeData} /> :
        <EmployeeTableView onPageChange={handlePageChange} pagination={pagination} setPagination={setPagination} loading={loading} employeeData={employeeData} employeeFileData={employeeFileData} getEmployeeData={getEmployeeData} totalCount={pagination.total} scopes={scopes} totalActive={pagination.totalActive} totalInactive={pagination.totalInactive} employeesTypeCount={pagination.employeesTypeCount} workersTypeCount={pagination.workersTypeCount} />)}
    </PageContainer>
  )
}
export default EmployeeView;