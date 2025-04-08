import { UndoOutlined } from "@ant-design/icons";
import { EmpDataReq } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DivisionService, LeaveAllocationService, MonthWIseEmpReportReq } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, message, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from 'axios';
import dayjs from "dayjs"; // Ensure this package is installed.
import { useEffect, useState } from "react";
import { configVariables } from '../../../../../../libs/shared-services/src/lib/config';
import { useIAMClientState } from '../../../common/iam-client-react';

const SelfServiceViewAttedance = () => {
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState<ColumnsType<any>>([]); // Dynamic columns
    const [expandColumns, setExpandColumns] = useState<ColumnsType<any>>([]); // Dynamic columns
    const attService = new AttendanceServices();
    const brService = new BranchesService()
    const { Option } = Select;
    const [departments, setDepartments] = useState([]);
    const dpService = new DepartmentService()
    const divService = new DivisionService()
    const [division, setDivision] = useState([]);
    const [branches, setBranches] = useState<any>([]);
    const leaveAllocationService = new LeaveAllocationService();
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [empData, setEmpData] = useState<any>([]);
    const role = IAMClientAuthContext.user.roles;
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);



    const handlePageChange = (page: number, pageSize: number) => {
        // console.log('Page:', page, 'PageSize:', pageSize); 
        const formData = form.getFieldsValue() || {};
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
        }));
        // console.log("Fetching data for page:", page, "Page size:", pageSize);

        getAllEmpMonthWiseData({ ...formData }, page, pageSize);
    };


    useEffect(() => {
        handlePageChange
    }, []);

    const clearForm = () => {
        // form.resetFields();
        const currentBranch = form.getFieldValue('branches'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })

        setColumns([]);
        setData([]);
    };



    const getDaysAndDates = (year: string, month: string) => {
        const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
        const result = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = dayjs(`${year}-${month}-${day.toString().padStart(2, "0")}`);
            result.push({
                day: date.format("dddd"),
                date: date.format("YYYY-MM-DD"),
            });
        }

        return result;
    };

    const generateColumns = (daysAndDates: Array<{ day: string; date: string }>) => {
        const dynamicColumns: ColumnsType<any> = [
            {
                title: "S No",
                render: (_: any, __: any, index: number) =>
                    (pagination.current - 1) * pagination.pageSize + index + 1,
                align: "center",
                fixed: "left",
                width: 35,
            },
            {
                title: "Employee Code",
                dataIndex: "empCode",
                fixed: "left",
                width: 60,
            },
            {
                title: "Employee Name",
                dataIndex: "empName",
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 120,
            },
            {
                title: "Department",
                dataIndex: "department",
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 90,
            },
            {
                title: "Divison",
                dataIndex: "divisionName",
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 75,
            },
            {
                title: "Branch",
                dataIndex: "branches",
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 75,
            },

            {
                title: "P",
                dataIndex: "P",
                align: 'center',
                width: 25,
                fixed: "right",
            },
            {
                title: "A",
                dataIndex: "A",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "W / WP",
                dataIndex: "W / WP",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "H / HP",
                dataIndex: "PH / PHP",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "OD",
                dataIndex: "od",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "L",
                dataIndex: "l",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "CO",
                dataIndex: "co",
                align: 'center',
                width: 30,
                fixed: "right",
            },

            {
                title: "Total Days",
                dataIndex: "totalDays",
                align: "center",
                width: 40,
                fixed: "right",
            },
            {
                title: "Total Payable Days",
                dataIndex: "totalPayableDays",
                align: 'center',
                width: 60,
                fixed: "right",
            },
            // {
            //     title: 'Allowance Days',
            //     dataIndex: 'totalAllowanceDays',
            //     key: 'totalAllowanceDays',
            //     width: 80,
            //     fixed: "right",
            // },
        ]

        return dynamicColumns;
    };

    const generateColumns2 = (daysAndDates: Array<{ day: string; date: string }>) => {
        const dynamicColumns: ColumnsType<any> = [];

        daysAndDates.forEach((dateInfo, index) => {
            const formattedKey = `${dateInfo.day} ${dateInfo.date.split('-')[2]}`;
            dynamicColumns.push({
                title: (
                    <div
                        style={{
                            writingMode: 'vertical-lr',
                            textOrientation: 'sideways',
                            whiteSpace: "nowrap",
                            transform: "rotate(180deg)"
                        }}
                    >
                        {/* {`${dateInfo.day} ${index + 1}`}  */}
                        {formattedKey}
                    </div>
                ),
                // dataIndex:  `${dateInfo.day} ${index + 1}`, 
                dataIndex: formattedKey,
                render: (text) => {
                    let color = "black"; // Default color
                    if (text === "P") {
                        color = "green";
                    } else if (text === "A") {
                        color = "red";
                    }
                    return <span style={{ color }}>{text || "-"}</span>;
                },
                align: "center",
                width: 30,
            });
        });
        return dynamicColumns;
    };

    const toggleExpandedRow = (key: React.Key) => {
        setExpandedRowKeys((prevExpandedRowKeys) =>
            prevExpandedRowKeys.includes(key)
                ? prevExpandedRowKeys.filter((k) => k !== key)
                : [...prevExpandedRowKeys, key]
        );
    };

    const expandedRowRender = (record: any) => {
        const daysAndDates = record.daysAndDates || {};
        const expandedData = Object.entries(daysAndDates).map(([day, status]) => ({
            day,
            status: status || "-",
        }));

        return (
            <Table
                columns={[
                    {
                        title: 'Day',
                        dataIndex: 'day',
                        key: 'day',
                        render: (text) => <span>{text}</span>,
                        align: 'left',
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        render: (text) => {
                            let color = "black"; 
                            if (text === "P") {
                                color = "green";
                            } else if (text === "A") {
                                color = "red";
                            }
                            return <span style={{ color }}>{text}</span>;
                        },
                        align: 'left',
                    }
                ]}
                dataSource={expandedData} 
                pagination={false}
                showHeader={false} 
                rowKey="day"
            />
        );
    };


    const getAllEmpMonthWiseData = async (values: any, page?: number, pageSize?: number) => {
        try {
            setLoading(true);

            const yearAndMonth = values.yearAndMonth;
            const employeeId = IAMClientAuthContext.user.employeeId
            const year = dayjs(yearAndMonth).format("YYYY");
            const month = dayjs(yearAndMonth).format("MM");
            const attendanceMonth = dayjs(yearAndMonth).format("YYYYMM");
            const daysAndDates = getDaysAndDates(year, month);
            const generatedColumns = generateColumns(daysAndDates);
            const generatedExpandColumns = generateColumns2(daysAndDates);
            setColumns(generatedColumns);
            setExpandColumns(generatedExpandColumns)
            const req: MonthWIseEmpReportReq = {
                year,
                month,
                employeeId,
                attendanceMonth,
                page: page || pagination.current,
                pageSize: pageSize || pagination.pageSize,
            };

            const res = await attService.getAllEmpMonthWiseData(req);

            if (res.status) {
                const processedData = res.data.map((employee: any) => ({
                    ...employee,
                    ...Object.entries(employee.daysAndDates || {}).reduce(
                        (acc, [key, value]) => {
                            acc[key] = value || "-";
                            return acc;
                        },
                        {}
                    ),
                }));
                // console.log(processedData,'processedData+++')
                setData(processedData);
                setIsDataFetched(true)
                setPagination((prev) => ({
                    ...prev,
                    total: res.data1,
                }));
            } else {
                console.error("Failed to fetch data:", res.internalMessage);
                setData([]);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card title={'Monthly Attendance Report'}>
            <Form
                layout="vertical"
                form={form}
                onFinish={getAllEmpMonthWiseData}
            >
                <Row gutter={[24, 4]}>
                    <Col xs={24} sm={12} md={8} lg={3} xl={3}>
                        <Form.Item
                            name="yearAndMonth"
                            label="Year & Month"
                            rules={[{ required: true, message: "Please select a year and month!" }]}
                        >
                            <DatePicker picker="month" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginTop: "23px" }}>
                        <Button type="primary" htmlType="submit">
                            Get Report
                        </Button>
                        <Button
                            type="dashed"
                            icon={<UndoOutlined />}
                            danger
                            onClick={clearForm}
                            style={{ marginLeft: "10px" }}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* <Table
                bordered
                columns={columns}
                size="small"
                dataSource={data}
                rowKey="empCode"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: handlePageChange,
                }}
                onChange={(pagination) => setPage(pagination.current)}

                scroll={{ x: "max-content" }}
                sticky
            /> */}

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="empCode" // Ensure this matches with the key used for toggling expanded rows
                expandedRowRender={expandedRowRender}
                expandedRowKeys={expandedRowKeys}
                onExpand={(expanded, record) => {
                    // Make sure you're passing the right key to toggle expanded rows
                    toggleExpandedRow(record.empCode); // Use empCode here, since it's the key
                }}
            //pagination={pagination}
            />

        </Card>
    );
};

export default SelfServiceViewAttedance;
