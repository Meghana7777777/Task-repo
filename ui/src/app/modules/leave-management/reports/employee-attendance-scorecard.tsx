import { RestOutlined, UndoOutlined } from "@ant-design/icons";
import { AttendanceServices, BranchesService, DepartmentService, EmpAttendanceSrcCardReq, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, Row, Select, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from "react";
// import { EmpAttendanceSrcCard } from '../../../../../../services/leave-management/src/app/attendance/dto/emp-attedance-score-card';

const EmpAttendenceScoreCard = () => {
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [departments, setDepartments] = useState([]);
    const [empData, setEmpData] = useState<any[]>([]);
    const [brData, setBrData] = useState<any[]>([]);
    const [data, setData] = useState<any>([]);
    const emService = new EmployeeOnboardingService()
    const dpService = new DepartmentService()
    const brService = new BranchesService()
    const atService = new AttendanceServices()
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        getActiveEmployeeList()
        getDepartmentList()
        getAllBranches()
        getEmpAttendenceScoreData();
    }, []);

    const getActiveEmployeeList = () => {
        try {
            emService.getActiveEmployeeList().then(res => {
                if (res.status) {
                    setEmpData(res.data)
                } else {
                    setEmpData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

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

    const getAllBranches = () => {
        try {
            brService.getAllBranches().then((res) => {
                if (res.status) {
                    setBrData(res.data);
                } else {
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getEmpAttendenceScoreData = () => {
        const req = new EmpAttendanceSrcCardReq();
        const formValues = form.getFieldsValue();

        if (formValues.branch && formValues.branch !== "all") {
            req.branch = formValues.branch;
        }
        if (formValues.attendanceDate) {
            req.attnFromDate = formValues.attendanceDate[0]?.format('YYYY-MM-DD');
            req.attnToDate = formValues.attendanceDate[1]?.format('YYYY-MM-DD');
        }
        if (formValues.empName) {
            req.empName = formValues.empName;
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId;
        }

        try {
            atService.getEmpAttendenceScoreData(req).then((res) => {
                if (res.status) {
                    setData(res.data);
                } else {
                    console.log("Failed to fetch attendance data");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    let i = 1;
    const employeeAttendanceScorecard = [
        { title: 'Branch', dataIndex: 'branch' },
        { title: 'Employee Name', dataIndex: 'empName' },
        { title: 'Employee Code', dataIndex: 'empCode' },
        { title: 'Date', dataIndex: 'attendanceDate' },
        { title: 'Attendance Status', dataIndex: 'attnStatus' },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Designation', dataIndex: 'designation'},
        { title: 'Reporting Manager', dataIndex: 'reportingManager'},
        { title: 'Shift', dataIndex: 'shiftType' },
        { title: ' In Time', dataIndex: 'inTime' },
        { title: 'Out Time',dataIndex: 'outTime' },
        { title: 'Working Hours', dataIndex: 'wokingHours'},
  
        ];
    
        const preprocessData = (data) => {
            return data.map((record) => {
              const updatedRecord = {};
              for (const key in record) {
                if (key === "inTime" || key === "outTime") {
                  updatedRecord[key] = record[key]
                    ? new Date(record[key]).toISOString().split("T")[1].split("Z")[0]
                    : ""; 
                } else {
                  updatedRecord[key] =
                    record[key] === null || record[key] === undefined ? "" : record[key];
                }
              }
              return updatedRecord;
            });
          };
      
      const exportExcel = () => {
      const excel = new Excel();
      const processedData = preprocessData(data); 
       excel
          .addSheet('employee-attendance-scorecard')
          .addColumns(employeeAttendanceScorecard)
          .addDataSource(processedData, { str2num: false }) 
          .saveAs('employee-attendance-scorecard.xlsx');
      };


    const columns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Branch",
            dataIndex: "branch",
        },
        {
            title: "Employee Name",
            dataIndex: "empName",
        },
        {
            title: "Employee Code",
            dataIndex: "empCode",
        },
        {
            title: "Date",
            dataIndex: "attendanceDate",
            render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
        },
        {
            title: "Attendance Status",
            dataIndex: "attnStatus",
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
            title: "Reporting Manager",
            dataIndex: "reportingManager",
        },
        {
            title: "Shift",
            dataIndex: "shift",
        },
        {
            title: "In Time",
            dataIndex: "inTime",
            render: (time: string | null) => (time ? dayjs(time).format("HH:mm:ss") : '-'),
        },
        {
            title: "Out Time",
            dataIndex: "outTime",
            render: (time: string | null) => (time ? dayjs(time).format("HH:mm:ss") : '-'),
        },
        {
            title: "Working Hours",
            dataIndex: "wokingHours",
        },
    ];

    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const clearForm = () => {
        form.resetFields();
    }

    return (
        <Card>
            <Form layout="vertical" form={form}>
                <Row gutter={24}>
                    <Col span={5}>
                        <Form.Item name="branch" label="Branch">
                            <Select placeholder="Select Branch" showSearch allowClear>
                                <Option value="all">All</Option>
                                {brData.map((br) => (
                                    <Option key={br.id} value={br.branchName}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item label='Date' name='attendanceDate'>
                            <RangePicker disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item name={'empName'} label={'Employee'}>
                            <Select placeholder="Select Employee" showSearch allowClear>
                                {empData.map((emp) => (
                                    <Option key={emp.employeeId} value={emp.employeeName}>
                                        {emp.employeeName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item name={'department'} label={'Department'}>
                            <Select placeholder="Select Department" showSearch allowClear>
                                {departments.map((dept) => (
                                    <Option key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={4} style={{ marginTop: '23px' }}>
                        <Button type="primary" onClick={getEmpAttendenceScoreData}>
                            Get Report
                        </Button>
                        <span style={{ marginLeft: '8px' }}></span>
                        <Button type="default" icon={<UndoOutlined />} danger onClick={clearForm}>
                            Reset
                        </Button>
                    </Col>

                </Row>
            </Form>
            <div style={{ marginBottom: '16px', textAlign: 'right', marginRight:"23px"}}>
                <Button
                style={{
                    border: "1px dashed #22f534",
                    color: "green",
                    fontWeight: "bold",
                }}
                type="dashed"
                onClick={() => exportExcel()}
                >
                Get Excel
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{ current: page, pageSize: 10 }}
                onChange={(pagination) => setPage(pagination.current)}
            />
        </Card>
    );

};
export default EmpAttendenceScoreCard;

