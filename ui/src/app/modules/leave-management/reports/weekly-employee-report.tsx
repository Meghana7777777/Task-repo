import { UndoOutlined } from "@ant-design/icons";
import { EmpDataReq } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DivisionService, LeaveAllocationService, MonthWIseEmpReportReq } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, message, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useEffect, useState } from "react";
import { configVariables } from '../../../../../../libs/shared-services/src/lib/config';
import { useIAMClientState } from '../../../common/iam-client-react';
dayjs.extend(isBetween);
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const WeekWiseEmpReport = () => {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState<ColumnsType<any>>([]); // Dynamic columns
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
    const defaultDateRange = [dayjs().startOf('month'), dayjs()];
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [empData, setEmpData] = useState<any>([]);
    const role = IAMClientAuthContext.user.roles;



    // useEffect(() => {
    //     if (IAMClientAuthContext.user.roles === "SuperAdmin") {
    //         form.setFieldsValue({ branches: "ALL" });
    //     } else {
    //         form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId });
    //     }
    // }, []);

    const handlePageChange = (page: number, pageSize: number) => {
        // console.log('Page:', page, 'PageSize:', pageSize); 
        const formData = form.getFieldsValue() || {};
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
        }));
        // console.log("Fetching data for page:", page, "Page size:", pageSize);

        getAllEmpWeekWiseData({ ...formData }, page, pageSize);
    };


    useEffect(() => {
        getDepartmentList()
        getAllDivision()
        getAllBranches()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: 'ALL' });
            handleBranchChange(null);
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId });
            handleBranchChange(IAMClientAuthContext.user.unitId);
        }
        //getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId )
        // if (IAMClientAuthContext.user.roles === "SuperAdmin") {
        //     getAllActiveEmpDropDown(undefined)
        // }
        // else {
        //     getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        // }
        handlePageChange
    }, []);
    const handleBranchChange = (branchId) => {

        if (branchId === "ALL") {
            form.setFieldsValue({ branches: null });
        } else if (branchId === null) {
            form.setFieldsValue({ branches: "ALL" });
        } else if (branchId === '') {
            form.setFieldsValue({ branches: "ALL" });
        } else {
            form.setFieldsValue({ branches: branchId });
        }
    }
    const clearForm = () => {
        // form.resetFields();
        const currentBranch = form.getFieldValue('branches');
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })

        setColumns([]);
        setData([]);
    };


    const getDaysAndDates = (fromDate: string, toDate: string) => {
        const startDate = dayjs(fromDate);
        const endDate = dayjs(toDate);
        const result = [];
    
        let currentDate = startDate;
    
        while (currentDate.isSameOrBefore(endDate)) {
            result.push({
                day: currentDate.format("dddd"),
                date: currentDate.format("YYYY-MM-DD"),
            });
            currentDate = currentDate.add(1, "day");
        }
    
        return result;
    };
    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
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
                width: 73,
            },
            {
                title: "Employee Name",
                dataIndex: "empName",
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 185,
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
        ];

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
                render: (text) => text || "-",
                align: "center",
                width: 100,
            });
        });

        dynamicColumns.push(
            {
                title: "P",
                dataIndex: "totalDays",
                align: 'center',
                width: 40,
                fixed: "right",
            },
            {
                title: "W / WP",
                dataIndex: "W / WP",
                align: 'center',
                width: 45,
                fixed: "right",
            },
            {
                title: "H / HP",
                dataIndex: "PH / PHP",
                align: 'center',
                width: 45,
                fixed: "right",
            },
            {
                title: "OD",
                dataIndex: "od",
                align: 'center',
                width: 40,
                fixed: "right",
            },
            {
                title: "L",
                dataIndex: "l",
                align: 'center',
                width: 40,
                fixed: "right",
            },
            {
                title: "CO",
                dataIndex: "co",
                align: 'center',
                width: 40,
                fixed: "right",
            },
            {
                title: "NOP",
                dataIndex: "nop",
                align: 'center',
                width: 40,
                fixed: "right",
            },
            {
                title: "LOP",
                dataIndex: "lop",
                align: 'center',
                width: 40,
                fixed: "right",
            },
            {
                title: "Total Days",
                dataIndex: "totalDays",
                align: "center",
                width: 65,
                fixed: "right",
            },
            {
                title: "Total Payable Days",
                dataIndex: "totalPayableDays",
                align: 'center',
                width: 70,
                fixed: "right",
            },
            {
                title: 'Allowance Days',
                dataIndex: 'totalAllowanceDays',
                key: 'totalAllowanceDays',
                width: 70,
                fixed: "right",
            },
        );

        return dynamicColumns;
    };

    const getAllEmpWeekWiseData = async (values: any, page?: number, pageSize?: number) => {
        try {
            setLoading(true);

            const yearAndMonth = values.yearAndMonth;
            const branch = values.branches === 'ALL' || !values.branches ? null : values.branches;
            const department = values.department;
            const division = values.division;
            const employeeId = values.employeeId
            const year = dayjs(yearAndMonth).format("YYYY");
            const month = dayjs(yearAndMonth).format("MM");
            const attendanceMonth = dayjs(yearAndMonth).format("YYYYMM");
            const attnFromDate = values.attendanceDate[0]?.format('YYYY-MM-DD');
            const attnToDate = values.attendanceDate[1]?.format('YYYY-MM-DD');
            const daysAndDates = getDaysAndDates(attnFromDate, attnToDate);
            const generatedColumns = generateColumns(daysAndDates);
            
            setColumns(generatedColumns);
            console.log(employeeId, "-------------------")
            const req: MonthWIseEmpReportReq = {
                // year,
                // month,
                branch,
                department,
                division,
                employeeId,
                attendanceMonth,
                page: page || pagination.current,
                pageSize: pageSize || pagination.pageSize,
                attnFromDate,
                attnToDate,
            };

            const res = await attService.getAllEmpWeekWiseData(req);

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

    const exportExcel = async (daysAndDates: any) => {
        message.loading({ content: 'Excel is being downloaded...', key: 'excelDownload', duration: 0 });
        try {
            const formData = form.getFieldsValue();
            const year = formData.yearAndMonth?.format('YYYY');
            const month = formData.yearAndMonth?.format('MM');
            const branch = formData.branches === 'ALL' ? 0 : formData.branches;
            const department = formData.department;
            const division = formData.division;

            const req = {
                year,
                month,
                branch,
                department,
                division,
                attendanceMonth: `${year}${month}`,
            };

            const response = await axios.post(
                `${configVariables.APP_LMS_SERVICE_URL}/attendance/excelDownload`,
                req,
                { responseType: 'arraybuffer' } // Required to handle binary data
            );

            // Convert the response data into a downloadable Excel file
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Attendance_Report_${year}_${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            message.success({ content: 'Excel downloaded successfully!', key: 'excelDownload', duration: 2 });
        } catch (error) {
            console.error('Error downloading Excel:', error);
            message.error({ content: 'Failed to download Excel.', key: 'excelDownload', duration: 2 });
        }
    };


    const handleFreezeStatus = async (status: 'Y' | 'N') => {
        try {
            const yearAndMonth = form.getFieldValue("attendanceDate");
            if (!yearAndMonth) {
                return console.error("Please select a date before freezing/unfreezing.");
            }
            console.log(yearAndMonth)
            const branch = form.getFieldValue("branches") === '' ? null : form.getFieldValue("branches")
            //const formattedDate = dayjs(yearAndMonth).format("YYYYMM"); // Format date as YYYYMM
            const attnFromDate = dayjs(yearAndMonth[0]).format("YYYY-MM-DD")
            const attnToDate = dayjs(yearAndMonth[1]).format("YYYY-MM-DD")
            const department = form.getFieldValue("department");
            const division = form.getFieldValue("division");
            const employeeId = form.getFieldValue("employeeId")
            const req = { attnFromDate: attnFromDate, attnToDate: attnToDate,  status, branch, department, division, employeeId};

            setLoading(true);
            const res = await attService.updateFreezeStatusForWeeklyWorker(req);
            if (res.status) {
                message.success(res.internalMessage);
                // console.log(res.internalMessage); // Handle success (show notification if needed)
            } else {
                message.error(res.internalMessage);
                console.error("Freeze/Unfreeze operation failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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

    const getAllDivision = () => {
        try {
            divService.getAllDivision().then((res) => {
                if (res.status) {
                    setDivision(res.data);
                } else {
                    console.error("failed to fetch");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getAllBranches = async () => {
        const res = await brService.getAllBranches();
        if (res.status) {
            setBranches(res.data);
        }
        else {
            console.error("failed to fetch");
        }
    };
    const getAllActiveEmpDropDown = async (branchId) => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branches: null }); // Map "ALL" to null
        } else if (branchId === null) {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
        } else if (branchId === '') {
            form.setFieldsValue({ branches: "ALL" }); // Map "ALL" to null
        } else {
            form.setFieldsValue({ branches: branchId }); // Set selected branch ID
        }
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmpData(res?.status ? res.data : []);
        setBranches
    };

    return (
        <Card>
            <Form
                layout="vertical"
                form={form}
                onFinish={getAllEmpWeekWiseData}
            >
                <Row gutter={[24, 4]}>
                    {/* <Col xs={24} sm={12} md={8} lg={3} xl={3}>
                        <Form.Item
                            name="yearAndMonth"
                            label="Year & Month"
                            rules={[{ required: true, message: "Please select a year and month!" }]}
                        >
                            <DatePicker picker="month" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label="Date" name="attendanceDate">
                            <RangePicker disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name="branches" label="Branch"
                        >

                            <Select placeholder="Select Branch" showSearch allowClear
                                dropdownMatchSelectWidth={false}
                                disabled={role === 'SuperAdmin' ? false : true}
                                optionFilterProp="children"
                                onChange={(value) => getAllActiveEmpDropDown(value)}>
                                <Option value={''}> ALL </Option>
                                {branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item
                            name="division"
                            label="Division"
                        >
                            <Select placeholder="Select Division" showSearch allowClear>
                                {division.map((div) => (
                                    <Option key={div.id} value={div.divisionName}>
                                        {div.divisionName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    
                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
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

                    <Col xs={24} sm={12} md={8} lg={5}>
                        <Form.Item name="employeeId" label="Employee Code">
                            <Select allowClear placeholder="Select Employee Code" showSearch optionFilterProp="children">
                                {empData?.map((emp) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
                                    </Option>
                                ))}
                            </Select>
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
                    <Col style={{ margin: "23px" }}>
                        {isDataFetched && (
                            <Row>
                                <Button type="primary" style={{ backgroundColor: '#3cc943', width: 80 }} onClick={() => handleFreezeStatus('Y')}>
                                    Freeze
                                </Button>

                                <Button type="primary" style={{ backgroundColor: '#db5e30', width: 80, color: 'white', marginLeft: "10px" }} onClick={() => handleFreezeStatus('N')}>
                                    Un-Freeze
                                </Button>
                                <Button
                                    style={{ border: '1px dashed #22f534', color: 'green', fontWeight: 'bold', marginLeft: '10px' }}
                                    type="dashed"
                                    onClick={() => {
                                        const year = form.getFieldValue('yearAndMonth')?.format('YYYY');
                                        const month = form.getFieldValue('yearAndMonth')?.format('MM');
                                        if (year && month) {
                                            exportExcel({ year, month });
                                        } else {
                                            console.error('Year and month are required to generate Excel.');
                                        }
                                    }}
                                >
                                    Get Excel
                                </Button>
                            </Row>)}
                    </Col>
                </Row>
            </Form>

<br></br>
                <Table
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
                />

        </Card>
    );
};

export default WeekWiseEmpReport;
