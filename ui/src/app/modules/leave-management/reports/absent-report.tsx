import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { AttendanceDto, BranchReq } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space } from "antd";
import { Excel } from "antd-table-saveas-excel";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import dayjs, { Dayjs } from 'dayjs';
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
const AbsentReport=()=>{
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

//   useEffect(()=>{
//     getAllAbsentReport()
//   },[])


useEffect(() => {
    // getAllAttendance();
    getAllDepartments();
    getDesignations();
    getAllDivision();
    getAllBranches();
    // getEmpDetailsByBranch();
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

const handleBranchChange = (branchId: number) => {
    if (!branchId) {
        setEmployees(''); // Clear employees if no branch is selected
        return;
    }

    // Create an instance of BranchReq
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
        const req = new AttendanceDto()
        const formValues = form.getFieldsValue();
        if (formValues.divisionName && formValues.divisionName) {
            req.divisionId = formValues.divisionName;
        }
        if (formValues.department && formValues.department) {
            req.departmentId = formValues.department;
        }
        if (formValues.designation && formValues.designation) {
            req.desginationid = formValues.designation;
        }
        if (formValues.branches && formValues.branches) {
            req.branch = formValues.branches;
        }
        if (formValues.attendanceDate) {
            req.attnFromDate = formValues.attendanceDate[0]?.format('YYYY-MM-DD');
            req.attnToDate = formValues.attendanceDate[1]?.format('YYYY-MM-DD');
        }
        if (formValues.employeeName && formValues.employeeName) {
            req.employeeCode = formValues.employeeName
        }
        try {
            setLoading(true)
        service.getAllAbsentsReport(req).then((res)=>{
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



const disableFutureDates = (current: Dayjs) => {
    return current && current.isAfter(dayjs().endOf('day'));
};

const handleReset = () => {
    form.resetFields()
    getAllAbsentReport()
    setFilteredEmployees([])
    setShowColumns(false);
    setData([]);
}

let i = 1;
const absent = [
    { title: "Branch", dataIndex: "branches"},
    { title: 'Employee Name', dataIndex: 'empName' },
    { title: 'Employee Code', dataIndex: 'empCode' },
    { title: 'Division', dataIndex: 'divisionName'},
    { title: 'Department', dataIndex: 'department' },
    { title: 'Designation', dataIndex: 'designation'},
    { title: 'Last Attendance Service', dataIndex: 'attendanceDate' },
    { title: ' Total Days Of Absent', dataIndex: 'absentCount' },
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

   

const generateColumns = () => {

const columns:ColumnsType<any> =[
    {
        title: 'S No',
        render: (text, object, index) => (page - 1) * 10 + (index + 1),
        align: "center"
    },
    {
        title: "Branch",
        dataIndex: "branches",
       
    },
    {
        title: "Employee Name",
        dataIndex: "empName",
        
        render: (text, record) => (
            `${record.salutation} ${record.empName}`
            
        )
    },
    {
        title: "Employee Code",
        dataIndex: "empCode",
       
    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        render: (text) => (text ? text : '-'),
    },
    {
        title: "Department",
        dataIndex: "department",
       
    },
    {
        title: "Designation",
        dataIndex: "designation",
        
    },
   
    {
        title: "Last Attendance Service",
        dataIndex: "attendanceDate",
        render: (text) => {
            const formattedDate = moment(text).format("DD-MM-YYYY"); // Formats to DD-MM-YYYY
            return formattedDate;
        },
        
    },
    
    
    
    
    
    {
        title: "Total Days Of Absent",
        dataIndex: "absentCount",
        
    },

]
return columns;
};



    return(
        <Card>
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
                                {branches.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Date" name="attendanceDate">
                            <RangePicker disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees.map((rec: any) => (
                                    <Option value={rec.employeeCode} key={rec.employeeCode}>
                                        {rec.employeeCode} {rec.employeeName}
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

                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: '23px' }}>
                        <Button type="primary" onClick={getAllAbsentReport}>
                            Get Report
                        </Button>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={handleReset} type='dashed' danger> Reset </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px", marginLeft:"50px" }}>
                    <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
                    </Col>

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
export default AbsentReport