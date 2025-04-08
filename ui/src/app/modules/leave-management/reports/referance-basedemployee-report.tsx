import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { AttendanceDto, BranchReq, EmpDataReq } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space } from "antd";
import { Excel } from "antd-table-saveas-excel";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import dayjs, { Dayjs } from 'dayjs';
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../common/iam-client-react';
const ReferenceBasedEmployeeReport=()=>{
    const [form] = Form.useForm();
    const Option = Select
    const { RangePicker } = DatePicker;
    const [data, setData] = useState<any>([])
    const [page, setPage] = React.useState(1);
    const [pageSize] = useState(50);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesginations] = useState<any>([]);
    const [branch, setUniqueBranch] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([]);
    const service = new AttendanceServices;
    const departmentService = new DepartmentService()
    const branchService = new BranchesService()
    const designationsService = new DesignationsService()
    const divisionService = new DivisionService()
    const employeeDetails = new EmployeeOnboardingService()
    const defaultDateRange = [dayjs().startOf('month'), dayjs().startOf('month').add(4, 'days')];
    const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
    const [showColumns, setShowColumns] = useState<boolean>(false);
      const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
//   useEffect(()=>{
//     getAllAbsentReport()
//   },[])


useEffect(() => {
    // getAllAttendance();
    getAllDepartments();
    getDesignations();
    getAllDivision();
    getAllBranches();
    if (IAMClientAuthContext.user.roles === "SuperAdmin") {
        form.setFieldsValue({ branches: "ALL" })
        //handleBranchChange(null)
    } else {
        form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
        handleBranchChange(IAMClientAuthContext.user.unitId)
    }
}, []);

useEffect(() => {
    setUniqueBranch(Array.from(new Map(data.filter((rec: any) => rec.branches != null).map((rec: any) => [rec.branches, rec])).values()));
}, [data]);
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

const handleBranchChange = (branchId) => {
    if (branchId === "ALL") {
        form.setFieldsValue({ branches: null }); // Map "ALL" to null
    } else if (branchId === null) {
        form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
    } else if (branchId === '') {
        form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
    } else {
        form.setFieldsValue({ branches: branchId }); // Set selected branch ID
    }

    const branchRequest = new BranchReq(branchId);

    employeeDetails.getEmpDetailsByBranch(branchRequest).then((res) => {
        if (res.status) {
            setEmployees(res.data);
        } else {
            setEmployees('No Data Found');
        }
    });
};

const getAllDepartments = () => {
    departmentService.getAllDepartments().then((res) => {
        if (res.status) {
            setDepartments(res.data)
        } else {
            setDepartments('No Data Found')
        }
    })
}

const getDesignations = () => {
    designationsService.getDesignations().then((res) => {
        if (res.status) {
            setDesginations(res.data)
        } else {
            setDesginations('No Data Found')
        }
    })
}

const getAllDivision = () => {
    divisionService.getAllDivision().then((res) => {
        if (res.status) {
            setDivisions(res.data)
        } else {
            setDivisions('No Data Found')
        }
    })
}

    const getAllAbsentReport=()=>{
        const req = new EmpDataReq()
        const formValues = form.getFieldsValue();
        console.log(formValues,"33333333333333333333333")
        if (formValues.divisionName && formValues.divisionName) {
            req.divisionId = formValues.divisionName;
        }
        if (formValues.department && formValues.department) {
            req.departmentId = formValues.department;
        }
        if (formValues.designation && formValues.designation) {
            req.designationId = formValues.designation;
        }
        // if (formValues.branches && formValues.branches) {
        //     req.branch = formValues.branches;
        // }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branches === "ALL") {
            req.branchId = null; // "ALL" translates to null
        } else {
            req.branchId = formValues.branches; // Send selected branch ID
        }
       
        if (formValues.employeeName && formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        try {
            setLoading(true)
            employeeDetails.referenceBasedEmployeeData(req).then((res)=>{
            if (res.status) {
                setData(res.data)
                setShowColumns(true);
                setLoading(false);
            } else {
                message.error(res.internalMessage);
                setShowColumns(false);
                setLoading(false);
                setData([])
            }
        });
    } catch (Err) {
        console.log(Err);
        setData([])
        setShowColumns(false);
        setLoading(false);
    }
}





const handleReset = () => {
    form.resetFields()
    getAllAbsentReport()
    setFilteredEmployees([])
    setShowColumns(false);
    setData([]);
}

let i = 1;
const absent = [
    { title: "Branch", dataIndex: "branchName"},
    { title: 'Employee Name', dataIndex: 'firstName' },
    { title: 'Employee Code', dataIndex: 'employeeCode' },
    { title: 'Reporting Manager', dataIndex: 'reportingManagerName' },

    { title: 'EmployeeReferance', dataIndex: 'employeeReferance'},
    { title: 'ReferanceMobileNumber', dataIndex: 'referanceMobileNumber' },
    { title: 'ReferanceName', dataIndex: 'referanceName'},
   
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 }; 
            absent.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };
  
  const exportExcel = () => {
  const excel = new Excel();
  const processedData = preprocessData(data); 
   excel
      .addSheet('absent-report')
      .addColumns(absent)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('absent-report.xlsx');
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
              handleResets(clearFilters);
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
    onFilter: (value, record) => {
      const keys = dataIndex.split(".");
      let nestedValue = record;
      keys.forEach((key) => {
        nestedValue = nestedValue ? nestedValue[key] : null;
      });
      return nestedValue
        ? nestedValue.toString().toLowerCase().includes((value as string).toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
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
  
  function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }
function handleResets(clearFilters: any) {
    clearFilters();
    setSearchText("");
  }

const generateColumns = () => {

const columns:ColumnsType<any> =[
    {
        title: 'S No',
        render: (text, object, index) => (page - 1) * 10 + (index + 1),
        align: "center"
    },
    {
        title: "Branch",
        dataIndex: "branchName",
        render: (text) => (text ? text : '-')
       
    },
    {
        title: "Employee Name",
        dataIndex: "firstName",
        render: (text) => (text ? text : '-')
        
      
    },
    {
        title: "Employee Code",
        dataIndex: "employeeCode",
        render: (text) => (text ? text : '-')
       
    },
    {
        title: "Employee Type",
        dataIndex: "employeeType",
        ...getColumnSearchProps('employeeType'),
        render: (text) => (text ? text : '-')
       
    },
    {
        title: "Reporting Manager Name",
        dataIndex: "reportingManagerName",
        render: (text) => (text ? text : '-')
        
    },
    {
        title: "Department",
        dataIndex: "departmentName",
        render: (text) => (text ? text : '-')
        
    },
    {
        title: "Designation",
        dataIndex: "designationName",
        render: (text) => (text ? text : '-')
        
    },
    {
        title: 'Employee Referance',
        dataIndex: 'employeeReferance',
        render: (text) => (text ? text : '-'),
    },
    {
        title: "Reference Details",
        render: (record) => {
            if (record.employeeReferance === "Internal") {
                return record.referanceEmployeeName ? record.referanceEmployeeName : '-';
            } else if (record.employeeReferance === "External") {
                return record.referanceMobileNumber && record.referanceName
                    ? `${record.referanceName} (${record.referanceMobileNumber})`
                    : '-';
            }
            return '-';
        },
    },
 

]
return columns;
};


    return(
        <Card title='Reference Employees Data'>
            <Form layout='vertical' form={form} initialValues={{ attendanceDate: defaultDateRange }}>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branches"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch', // Custom error message
                                },
                            ]}>
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                optionFilterProp="children"
                                onChange={(value) => handleBranchChange(value)}>
                                     <Option value={''}> ALL </Option>
                                {branches.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                   
                    
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Department" name="department">
                            <Select showSearch allowClear placeholder="Select Department"optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {departments.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Designation" name="designation">
                            <Select showSearch allowClear placeholder="Select Designation" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {designations.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees.map((rec: any) => (
                                    <Option value={rec.employeeId} key={rec.employeeCode}>
                                        {rec.employeeCode} {rec.employeeName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                        <Button type="primary" onClick={getAllAbsentReport}>
                            Get Report
                        </Button>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={handleReset} type='dashed' danger> Reset </Button>
                    </Col>
                    {/* <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px", marginLeft:"50px" }}>
                    <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
                    </Col> */}

                </Row>
            </Form>
            {showColumns && (
                <Table
                    columns={generateColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                    }}
                    scroll={{ x: true }}
                    rowKey="id"
                    bordered
                />
            )}

        </Card>)
}
export default ReferenceBasedEmployeeReport