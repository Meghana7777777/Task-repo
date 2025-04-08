import { Button, Card, Col, DatePicker, Form, message, Row, Select, Space, Table, TableColumnsType } from 'antd';
import React, { Children, useEffect, useState } from 'react';
import { Excel } from 'antd-table-saveas-excel';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import moment from 'moment';
import dayjs, { Dayjs } from 'dayjs';
import { UndoOutlined } from '@ant-design/icons';
import { AttendanceServices, DepartmentService, BranchesService, DesignationsService, DivisionService, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { ColumnsType } from 'antd/es/table';
import { BranchReq } from '@hrexpert/shared-models';


/* eslint-disable-next-line */


export function PayrollEmployeeReports() {
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
 
  const generateColumns = () => {
    const dynamicColumns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: 'Branch',
            dataIndex: 'branches',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Employee Name',
            dataIndex: 'empName',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Employee Code',
            dataIndex: 'empCode',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Division',
            dataIndex: 'divisionName',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Present Status',
            dataIndex: 'attnStatus',
            render: (text) => (text ? text : '-'),
        },
        {
            title: 'Date',
            dataIndex: 'attendanceDate',
            render: (text: any) => (text ? text : '-'),
            width: 150,
        },
        {
            title: 'In Time',
            dataIndex: 'inTime',
            render: (text) => (text ? dayjs(text).format('HH:mm:ss') : '-'),
        },
        {
            title: 'Out Time',
            dataIndex: 'outTime',
            render: (text) => (text ? dayjs(text).format('HH:mm:ss') : '-'),
        },
    ];
    return dynamicColumns;
};


const disableFutureDates = (current: Dayjs) => {
  return current && current.isAfter(dayjs().endOf('day'));
};

const handleReset = () => {
  form.resetFields()
  // getAllAttendance()
  setFilteredEmployees([])
  setShowColumns(false);
  setData([]);
}
  

  const columns: TableColumnsType<any> = [
    {
      title: 'S No',
      key: 'sNo',
      responsive: ['sm'],
      width: 70,
      fixed: "left",
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
    },
    {
      title: 'Branch',
      dataIndex: 'unitName',
      width: 90,
      fixed: "left",
      render: (text: any, record: any) => {
        return record.unitName ? record.unitName : '-';
      },

    },
    {
      title: 'Employee Names',
      dataIndex: 'employeeName',
      fixed: "left",
      width: 100,
      render: (text: any, record: any) => {
        return record.employeeName ? record.employeeName : '-';
      },

    },
    {
      title: 'Employee Number',
      dataIndex: 'employeeCode',
      fixed: "left",
      width: 100,
      render: (text: any, record: any) => {
        return record.employeeCode ? record.employeeCode : '-';
      },

    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (text: any, record: any) => {
        return record.department ? record.department : '-';
      },
    },
    {
      title: 'Factory Working Days',
      dataIndex: 'factoryWorkingDays',
      render: (text: any, record: any) => {
        return record.factoryWorkingDays ? record.factoryWorkingDays : '-';
      },
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      render: (text: any, record: any) => {
        return record.attendance ? record.attendance : '-';
      },
    },


    {
      title: 'Earnings',
      children: [
        {
          title: 'Basic Salary',
          dataIndex: 'calBasic',
          align:'right',
          render: (text: any, record: any) => {
            return record.calBasic ? record.calBasic : '-';
          },
        },
        {
          title: 'D A',
          dataIndex: 'calDa',
          align:'right',
          render: (text: any, record: any) => {
            return record.calDa ? record.calDa : '-';
          },
        },
        {
          title: 'House Rent Allowance',
          dataIndex: 'calHra',
          align:'right',
          render: (text: any, record: any) => {
            return record.calHra ? record.calHra : '-';
          },
        },
        // {
        //   title: 'Education Allowance',
        //   dataIndex: 'calEdu',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calEdu ? record.calEdu : '-';
        //   },
        // },
        // {
        //   title: 'Medical Allowance',
        //   dataIndex: 'calMedical',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calMedical ? record.calMedical : '-';
        //   },
        // },
    
        // {
        //   title: 'Special Allowance',
        //   dataIndex: 'calSpl',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calSpl ? record.calSpl : '-';
        //   },
        // },
    
        {
          title: 'Conveyance Allowance',
          dataIndex: 'calConveyance',
          align:'right',
          render: (text: any, record: any) => {
            return record.calConveyance ? record.calConveyance : '-';
          },
        },

        {
          title: 'Conveyance Allowance',
          dataIndex: 'calConveyance',
          align:'right',
          render: (text: any, record: any) => {
            return record.calConveyance ? record.calConveyance : '-';
          },
        },
        {
          title: 'Other Allowance',
          dataIndex: 'calOtherAllowance',
          render: (text: any, record: any) => {
            return record.calOtherAllowance ? record.calOtherAllowance : '-';
          },
        },
        // {
        //   title: 'Petrol Allowance',
        //   dataIndex: 'calPetrol',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calPetrol ? record.calPetrol : '-';
        //   },
        // },
        // {
        //   title: 'Shoe Allowance',
        //   dataIndex: 'calShoe',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calShoe ? record.calShoe : '-';
        //   },
        // },
        // {
        //   title: 'Washing Allowance',
        //   dataIndex: 'calWashing',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calWashing ? record.calWashing : '-';
        //   },
        // },
        // {
        //   title: 'Uniform Allowance',
        //   dataIndex: 'calUniform',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calUniform ? record.calUniform : '-';
        //   },
        // },
        // {
        //   title: 'Helper Allowance',
        //   dataIndex: 'calHelper',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.calHelper ? record.calHelper : '-';
        //   },
        // },

        // {
        //   title: 'Other Earnings',
        //   dataIndex: 'otherEarnings',
        //   align:'right',
        //   render: (text: any, record: any) => {
        //     return record.otherEarnings ? record.otherEarnings : '-';
        //   },
        // },

      ]
    },

    {
      title: 'Total Earnings',
      dataIndex: 'totalEarnings',
      align:'right',
      render: (text: any, record: any) => {
        return record.totalEarnings ? record.totalEarnings : '-';
      },
    },

    {
      title: 'Deductions',
      children:[
        {
          title: 'EPF @ 12%',
          dataIndex: 'epfAmount',
          align:'right',
          render: (text: any, record: any) => {
            return record.epfAmount ? record.epfAmount : '-';
          },
        },
    
        {
          title: 'ESIC @ 0.75%',
          dataIndex: 'esicAmount',
          align:'right',
          render: (text: any, record: any) => {
            return record.esicAmount ? record.esicAmount : '-';
          },
        },
    
        {
          title: 'Mess Deductions',
          dataIndex: 'messAmount',
          align:'right',
          render: (text: any, record: any) => {
            return record.messAmount ? record.messAmount : '-';
          },
        },
        {
          title: 'Other Deductions',
          dataIndex: 'othersAmount',
          align:'right',
          render: (text: any, record: any) => {
            return record.othersAmount ? record.othersAmount : '-';
          },
        },
        
        {
          title: 'Professional Tax',
          dataIndex: 'ProfessionalTax',
          align:'right',
          render: (text: any, record: any) => {
            return record.ProfessionalTax ? record.ProfessionalTax : '-';
          },
        },
        {
          title: 'TDS',
          dataIndex: 'tds',
          align:'right',
          render: (text: any, record: any) => {
            return record.tds ? record.tds : '-';
          },
        },
        {
          title: 'Total Deductions',
          dataIndex: 'totalDeductions',
          align:'right',
          render: (text: any, record: any) => {
            return record.totalDeductions ? record.totalDeductions : '-';
          },
        },
    
      
      ]
    },

    {
      title: 'Net Amount',
      dataIndex: 'netSalary',
      align:'right',
      render: (text: any, record: any) => {
        return record.netSalary ? record.netSalary : '-';
      },
    },
  ]

  //let i = 1;
  const exceldata: IExcelColumn[] =[
    {
      title: 'S No',
      dataIndex: 'sNo',
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
    },

    {
      title: 'Employee Names',
      dataIndex: 'employeeName',
      render: (text: any, record: any) => {
        return record.employeeName ? record.employeeName : '-';
      },

    },
    {
      title: 'Employee Number',
      dataIndex: 'employeeCode',
      render: (text: any, record: any) => {
        return record.employeeCode ? record.employeeCode : '-';
      },

    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (text: any, record: any) => {
        return record.department ? record.department : '-';
      },
    },
    {
      title: 'Factory Working Days',
      dataIndex: 'factoryWorkingDays',
      render: (text: any, record: any) => {
        return record.factoryWorkingDays ? record.factoryWorkingDays : '-';
      },
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      render: (text: any, record: any) => {
        return record.attendance ? record.attendance : '-';
      },
    },


    {
      title: 'Earnings',
      dataIndex:'',
      children: [
        {
          title: 'Basic Salary',
          dataIndex: 'calBasic',
          render: (text: any, record: any) => {
            return record.calBasic ? record.calBasic : '-';
          },
        },
        {
          title: 'D A',
          dataIndex: 'calDa',
          render: (text: any, record: any) => {
            return record.calDa ? record.calDa : '-';
          },
        },
        {
          title: 'House Rent Allowance',
          dataIndex: 'calHra',
          render: (text: any, record: any) => {
            return record.calHra ? record.calHra : '-';
          },
        },
        // {
        //   title: 'Education Allowance',
        //   dataIndex: 'calEdu',
        //   render: (text: any, record: any) => {
        //     return record.calEdu ? record.calEdu : '-';
        //   },
        // },
        // {
        //   title: 'Medical Allowance',
        //   dataIndex: 'calMedical',
        //   render: (text: any, record: any) => {
        //     return record.calMedical ? record.calMedical : '-';
        //   },
        // },
    
        // {
        //   title: 'Special Allowance',
        //   dataIndex: 'calSpl',
        //   render: (text: any, record: any) => {
        //     return record.calSpl ? record.calSpl : '-';
        //   },
        // },
    
        {
          title: 'Conveyance Allowance',
          dataIndex: 'calConveyance',
          render: (text: any, record: any) => {
            return record.calConveyance ? record.calConveyance : '-';
          },
        },
        {
          title: 'other Allowance',
          dataIndex: 'calOtherAllowance',
          render: (text: any, record: any) => {
            return record.calOtherAllowance ? record.calOtherAllowance : '-';
          },
        },
        // {
        //   title: 'Petrol Allowance',
        //   dataIndex: 'calPetrol',
        //   render: (text: any, record: any) => {
        //     return record.calPetrol ? record.calPetrol : '-';
        //   },
        // },
        // {
        //   title: 'Shoe Allowance',
        //   dataIndex: 'calShoe',
        //   render: (text: any, record: any) => {
        //     return record.calShoe ? record.calShoe : '-';
        //   },
        // },
        // {
        //   title: 'Washing Allowance',
        //   dataIndex: 'calWashing',
        //   render: (text: any, record: any) => {
        //     return record.calWashing ? record.calWashing : '-';
        //   },
        // },
        // {
        //   title: 'Uniform Allowance',
        //   dataIndex: 'calUniform',
        //   render: (text: any, record: any) => {
        //     return record.calUniform ? record.calUniform : '-';
        //   },
        // },
        // {
        //   title: 'Helper Allowance',
        //   dataIndex: 'calHelper',
        //   render: (text: any, record: any) => {
        //     return record.calHelper ? record.calHelper : '-';
        //   },
        // },

        // {
        //   title: 'Other Earnings',
        //   dataIndex: 'otherEarnings',
        //   render: (text: any, record: any) => {
        //     return record.otherEarnings ? record.otherEarnings : '-';
        //   },
        // },

      ]
    },

    {
      title: 'Total Earnings',
      dataIndex: 'totalEarnings',
      render: (text: any, record: any) => {
        return record.totalEarnings ? record.totalEarnings : '-';
      },
    },

    {
      title: 'Deductions',
      dataIndex:'',
      children:[
        {
          title: 'EPF @ 12%',
          dataIndex: 'epfAmount',
          render: (text: any, record: any) => {
            return record.epfAmount ? record.epfAmount : '-';
          },
        },
    
        {
          title: 'ESIC @ 0.75%',
          dataIndex: 'esicAmount',
          render: (text: any, record: any) => {
            return record.esicAmount ? record.esicAmount : '-';
          },
        },
    
        {
          title: 'Mess Deductions',
          dataIndex: 'messAmount',
          render: (text: any, record: any) => {
            return record.messAmount ? record.messAmount : '-';
          },
        },
        {
          title: 'Other Deductions',
          dataIndex: 'othersAmount',
          render: (text: any, record: any) => {
            return record.othersAmount ? record.othersAmount : '-';
          },
        },
        {
          title: 'Professional Tax',
          dataIndex: 'ProfessionalTax',
          render: (text: any, record: any) => {
            return record.ProfessionalTax ? record.ProfessionalTax : '-';
          },
        },
        {
          title: 'TDS',
          dataIndex: 'tds',
          render: (text: any, record: any) => {
            return record.tds ? record.tds : '-';
          },
        },
        {
          title: 'Total Deductions',
          dataIndex: 'totalDeductions',
          render: (text: any, record: any) => {
            return record.totalDeductions ? record.totalDeductions : '-';
          },
        },
      ]
    },

    {
      title: 'Net Amount',
      dataIndex: 'netSalary',
      render: (text: any, record: any) => {
        return record.netSalary ? record.netSalary : '-';
      },
    },
  ]

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet('Employee Report Excel')
      .addColumns(exceldata)
      .addDataSource(data, { str2num: true })
      .saveAs('emp-Report-hrs.xlsx');
  };

 
 
  return (
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
                            {/* <RangePicker disabledDate={disableFutureDates} /> */}
                            <DatePicker picker="month" style={{width:"100%"}}/>
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
                        <Button type="primary" 
                        // onClick={getAllAttendance}
                        >
                            Get Report
                        </Button>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={handleReset} type='dashed' danger> Reset </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" , marginLeft:"40px"}}>
                    <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
                    </Col>

                </Row>
            </Form>
            {/* {showColumns && ( */}
                <Table
                    columns={columns}
                    dataSource={data}
                    // loading={loading}
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
            {/* )} */}

        </Card>
  );
}

export default PayrollEmployeeReports;
