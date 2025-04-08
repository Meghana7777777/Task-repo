import { PageContainer } from "@ant-design/pro-layout";
import { ApplyLeavesReq } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, message, Row, Select, Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useEffect, useState } from "react";

export const ApplyForLeavesGrid = () => {
    const Option = Select;
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>([]); 
    const [loading, setLoading] = useState(false); 
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<any>([]); 
    const service = new ApplForLeavesSharedService();
    const employeeDetails = new EmployeeOnboardingService();

    useEffect(() => {
        getAllEmployeesTable();
    }, []);

    const getAllEmployeesTable = () => {
        setLoading(true);
        try {
            employeeDetails.getAllEmployeesTable().then((res) => {
                if (res.status) {
                    setEmployees(res.data);
                } else {
                    message.warning("No Employee Data Found");
                }
            });
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    const getAppliedForLeaves = () => {
        const req = new ApplyLeavesReq();
        const formValues = form.getFieldsValue();

        if (formValues.selectedMonth) {
            const selectedDate = formValues.selectedMonth;
            req.selectedMonth = selectedDate.month() + 1;
            req.selectedYear = selectedDate.year();
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName;
        }

        setLoading(true);
        try {
            service.getAppliedForLeaves(req).then((res) => {
                if (res.status) {
                    setData(res.data);
                } else {
                    message.error("Failed to retrieve data");
                }
            });
        } catch (error) {
            console.error(error);
            message.error("Error fetching leave data");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        form.resetFields();
        setData([]);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    
    let i = 1;
    const monthWiseEmpReport = [
        { title: 'Employee Code ', dataIndex: 'employeeCode' },
        { title: 'Employee Name', dataIndex: 'employeeName' },
        { title: 'Type of leave', dataIndex: 'leaveTypeName' },
        { title: 'From Date', dataIndex: 'fromDate'},
        { title: 'To Date', dataIndex: 'toDate' },
        { title: 'Leave Reason', dataIndex: 'leaveReason' },
        { title: 'No of Days',dataIndex: 'noOfDays' },
 
        ];
        
        const preprocessData = (data) => {
            return data.map((record, index) => {
                const updatedRecord = { key: index + 1 }; 
                monthWiseEmpReport.forEach((column) => {
                    let value = record[column.dataIndex];
                    if (['fromDate', 'toDate'].includes(column.dataIndex) && value) {
                        value = moment(value).format('YYYY-MM-DD');
                    }
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
          .addSheet('apply-for-leaves-report')
          .addColumns(monthWiseEmpReport)
          .addDataSource(processedData, { str2num: false }) 
          .saveAs('apply-for-leaves-report.xlsx');
      };

    const columnsSkelton: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            width: '70px',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            align: "center",
            width: '150px',
            sorter: (a, b) => a.employeeCode?.localeCompare(b.employeeCode),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            align: "center",
            sorter: (a, b) => a.employeeName?.localeCompare(b.employeeName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Type of leave',
            dataIndex: 'leaveTypeName',
            align: "center",
            sorter: (a, b) => a.leaveTypeName?.localeCompare(b.leaveTypeName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'From Date',
            dataIndex: 'fromDate',
            align: "center",
            sorter: (a, b) => a.fromDate.localeCompare(b.fromDate),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'To Date',
            width: 100,
            dataIndex: 'toDate',
            align: "center",
            sorter: (a, b) => a.toDate.localeCompare(b.toDate),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: "Leave Reason",
            dataIndex: "leaveReason",
            align: "center",
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            align: "center",
            sorter: (a, b) => a.noOfDays.localeCompare(b.noOfDays),
            sortDirections: ['descend', 'ascend'],
        },
    ];

    return (
        <PageContainer title='Applied Leaves' breadcrumbRender={false}>
            <Form form={form} layout='vertical'>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label='Employee Name' name="employeeName">
                            <Select placeholder="Select Employee Name" allowClear >
                                {employees.map((rec: any) => (
                                    <Select.Option value={rec.id} key={rec.id}>{rec.firstName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label='Month' name="selectedMonth">
                            <DatePicker picker="month" placeholder="Select Month" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ marginTop: "23px", textAlign: "center" }}>
                        <Button type="primary" onClick={getAppliedForLeaves} style={{ marginRight: "25px" }}>
                            Get Report
                        </Button>
                        <Button type="dashed" danger onClick={handleReset} style={{ marginRight: "25px" }}>
                            Reset
                        </Button>
                        <Button
                            style={{
                                border: "1px dashed #22f534",
                                color: "green",
                                fontWeight: "bold",
                            }}
                            type="dashed"
                            onClick={exportExcel}
                        >
                            Get Excel
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table
                rowKey={record => record.holidayId}
                columns={columnsSkelton}
                loading={loading}
                size="small"
                dataSource={data}
                scroll={{ x: true }}
                pagination={{
                    onChange(current) {
                        setPage(current);
                    }
                }}
                onChange={onChange}
                bordered />
        </PageContainer>
    );
};

export default ApplyForLeavesGrid;
