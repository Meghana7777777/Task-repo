import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { AttendanceDto } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DesignationsService, DivisionService } from "@hrexpert/shared-services";
import { Button, Col, Form, Input, message, Row, Select, Space, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { ColumnType } from "antd/es/table";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

const ExtraWorkHours = () => {
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [data, setData] = useState<any>([]);
    const [form] = Form.useForm();
    const [branches, setBranches] = useState<any>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [divisions, setDivisions] = useState<any>([]);
    const [designations, setDesignations] = useState<any>([]);
    const searchInput = useRef(null);
    const service = new AttendanceServices();
    const departmentService = new DepartmentService();
    const branchService = new BranchesService();
    const designationsService = new DesignationsService();
    const divisionService = new DivisionService();

    useEffect(() => {
        getAllBranches();
        getAllDepartments();
        getDesignations();
        getAllDivisions();
        getAllWorkingHours();
    }, []);

    const getAllWorkingHours = async () => {
        const formValues = form.getFieldsValue();
        const req: AttendanceDto = {};

        if (formValues.divisionName) req.divisionId = formValues.divisionName;
        if (formValues.department) req.departmentId = formValues.department;
        if (formValues.designation) req.desginationid = formValues.designation;
        if (formValues.branches) req.branchId = formValues.branches;

        try {
            const res = await service.getWorkingHoursReportWithDetails(req);
            if (res.status) {
                setData(res.data);
            } else {
                message.error(res.internalMessage);
            }
        } catch (err) {
            console.error("Error fetching working hours report:", err);
        }
    };

    const getAllBranches = async () => {
        const res = await branchService.getAllBranches();
        if (res.status) {
            setBranches(res.data);
        }
    };

    const getAllDepartments = async () => {
        const res = await departmentService.getAllDepartments();
        if (res.status) {
            setDepartments(res.data);
        }
    };

    const getDesignations = async () => {
        const res = await designationsService.getDesignations();
        if (res.status) {
            setDesignations(res.data);
        }
    };

    const getAllDivisions = async () => {
        const res = await divisionService.getAllDivision();
        if (res.status) {
            setDivisions(res.data);
        }
    };

    const handleReset = () => {
        form.resetFields();
        setData([]);
        getAllWorkingHours();
    };

    let i = 1;
    const extraWorkHours = [
        { title: 'Employee Name', dataIndex: 'empName' },
        { title: 'ShiftGroup', dataIndex: 'shiftGroup' },
        { title: 'Shift', dataIndex: 'shiftType' },
        { title: 'Department', dataIndex: 'department' },
        { title: 'Division', dataIndex: 'divisionName'},
        { title: 'Branch', dataIndex: 'branchName' },
        { title: 'Designation', dataIndex: 'designation'},
        { title: 'Timinigs', dataIndex: 'shiftTime' },
        { title: ' In Time', dataIndex: 'inTime' },
        { title: 'Out Time',dataIndex: 'outTime' },
        { title: 'Total Work Hours', dataIndex: 'totalHours'},
        { title: 'Status', dataIndex: 'remarks'},
  
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
          .addSheet('extra-work-hours')
          .addColumns(extraWorkHours)
          .addDataSource(processedData, { str2num: false }) 
          .saveAs('extra-work-hours.xlsx');
      };

    const columns: any = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Employee Name",
            dataIndex: "empName",
        },
        {
            title: "ShiftGroup",
            dataIndex: "shiftGroup"

        },
        {
            title: "Shift",
            dataIndex: "shiftType",
        },
        {
            title: "Department",
            dataIndex: "department",
        },
        {
            title: "Division",
            dataIndex: "divisionName",
        },
        {
            title: "Branch",
            dataIndex: "branchName",
        },
        {
            title: "Designation",
            dataIndex: "designation",
        },
        {
            title: "Timinigs",
            dataIndex: "shiftTime"
        },
        {
            title: "In Time",
            dataIndex: "inTime",
            render: (inTime) => moment(inTime).utc().format("HH:mm")
        },
        {
            title: "Out Time",
            dataIndex: "outTime",
            render: (outTime) => moment(outTime).utc().format("HH:mm")
        },
        {
            title: "Total Work Hours",
            dataIndex: "totalHours"
        },
        {
            title: "Status",
            dataIndex: "remarks",
            render: (_, record) => {
                const inTime = moment(record.inTime);
                const outTime = moment(record.outTime);
                const duration = moment.duration(outTime.diff(inTime)).asHours();

                if (duration < 8) {
                    return "Less working hours";
                } else if (duration > 8.5) {
                    return "Extra working hours";
                } else {
                    return "Normal working hours";
                }
            }
        }
    ]

    return (
        <PageContainer title={"Extra Work Hours Report"}>
            <Form layout="vertical" form={form}>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Branch" name="branches">
                            <Select allowClear placeholder="Select Branch">
                                {branches.map((branch) => (
                                    <Select.Option key={branch.id} value={branch.id}>
                                        {branch.branchName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Division" name="divisionName">
                            <Select allowClear placeholder="Select Division">
                                {divisions.map((division) => (
                                    <Select.Option key={division.id} value={division.id}>
                                        {division.divisionName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Department" name="department">
                            <Select allowClear placeholder="Select Department">
                                {departments.map((dept) => (
                                    <Select.Option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Designation" name="designation">
                            <Select allowClear placeholder="Select Designation">
                                {designations.map((desg) => (
                                    <Select.Option key={desg.id} value={desg.id}>
                                        {desg.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={2} xl={2} style={{ marginTop: "23px" }}>
                        <Button type="primary" onClick={getAllWorkingHours}>
                            Get Report
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={handleReset} type="dashed" danger>
                            Reset
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={1} xl={1} style={{ marginTop: "23px" }}>
                    <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold", marginLeft:"45px"}} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                    </Button>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    onChange: (current) => setPage(current),
                }}
                scroll={{ x: true }}
                rowKey="empId"
                bordered
            />
        </PageContainer>
    );
};

export default ExtraWorkHours