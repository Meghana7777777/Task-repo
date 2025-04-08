import { FileExcelOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { EmpDataReq } from "@hrexpert/shared-models";
import { AttendanceServices, BranchesService, DepartmentService, DivisionService, EmployeeTypeService, LeaveAllocationService, MonthWIseEmpReportReq } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import axios from 'axios';
import dayjs from "dayjs"; // Ensure this package is installed.
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { configVariables } from '../../../../../../libs/shared-services/src/lib/config';
import { useIAMClientState } from '../../../common/iam-client-react';

const MonthWiseEmpReport = () => {
    const [form] = Form.useForm();
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
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [empData, setEmpData] = useState<any>([]);
    const role = IAMClientAuthContext.user.roles;
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
    const [employeeTypes, setEmployeeTypes] = useState([])
    const employeeTypesService = new EmployeeTypeService()
    
    



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

        getAllEmpMonthWiseData({ ...formData }, page, pageSize);
    };


    useEffect(() => {
        getDepartmentList()
        getAllDivision()
        getAllBranches()
        getEmployeeTypes()
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
        // handlePageChange
    }, []);
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
    }
    const clearForm = () => {
        // form.resetFields();
        const currentBranch = form.getFieldValue('branches'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branches: currentBranch })

        setColumns([]);
        setData([]);
    };

    const getEmployeeTypes = () => {
        employeeTypesService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeTypes(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }




    // const exportExcel = (daysAndDates) => {
    //     const excel = new Excel();

    //     const startingColumns = [
    //         { title: 'Employee Code', dataIndex: 'empCode' },
    //         { title: 'Employee Name', dataIndex: 'empName' },
    //         { title: 'Department', dataIndex: 'department' },
    //         { title: 'Division', dataIndex: 'division' },
    //         { title: 'Branch', dataIndex: 'branches' },
    //     ]

    //     const endingColumns = [
    //         { title: 'P', dataIndex: 'totalDays' },
    //         { title: 'W / WP', dataIndex: 'W / WP' },
    //         { title: 'PH / PHP', dataIndex: 'PH / PHP' },
    //         { title: 'OD', dataIndex: 'od' },
    //         { title: 'L', dataIndex: 'l' },
    //         { title: 'CO', dataIndex: 'co' },
    //         { title: 'NOP', dataIndex: 'nop' },
    //         { title: 'LOP', dataIndex: 'lop' },
    //         { title: 'Total Days', dataIndex: 'totalDays' },
    //         { title: 'Total Payable Days', dataIndex: 'totalPayableDays' },
    //     ]

    //     const dynamicColumns = daysAndDates.map((dateInfo) => {
    //         const formattedKey = `${dateInfo.day} ${dateInfo.date.split('-')[2]}`;
    //         return { title: formattedKey, dataIndex: formattedKey };
    //     });

    //     const allColumns = [...startingColumns, ...dynamicColumns,...endingColumns];

    //     const processedData = data.map((record, index) => {
    //         const updatedRecord = { key: index + 1 }; 
    //         allColumns.forEach((column) => {
    //             const value = record[column.dataIndex];
    //             updatedRecord[column.dataIndex] = value === null || value === undefined ? "-" : value;
    //         });
    //         return updatedRecord;
    //     });

    //     excel
    //         .addSheet('month-wise-employee-report')
    //         .addColumns(allColumns)
    //         .addDataSource(processedData, { str2num: false }) 
    //         .saveAs('month-wise-employee-report.xlsx');
    // };



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
    const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<string> => ({
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

    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    const generateColumns = (daysAndDates: Array<{ day: string; date: string }>, currentPage: number) => {
        const dynamicColumns: ColumnsType<any> = [
            {
                title: "S No",
                render: (_: any, __: any, index: number) =>
                    (Number(currentPage) - 1) * pagination.pageSize + index + 1,
                align: "center",
                fixed: "left",
                width: 35,
            },
            {
                title: "Employee Name",
                dataIndex: "empName",
                ...getColumnSearchProps("empName", "Employee Name"),
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 120,
            },
            {
                title: "Employee Code",
                dataIndex: "empCode",
                ...getColumnSearchProps("empCode", "Employee Code"),
                render: (text) => (text ? text : '-'),
                fixed: "left",
                width: 120,
            },
            {
                title: "Employee Type",
                dataIndex: "employeeType",
                ...getColumnSearchProps("employeeType", "Employee Type"),
                render: (text) => (text ? text : '-'),
                //fixed: "left",
                width: 120,
            },
            {
                title: "Branch",
                dataIndex: "branches",
                ...getColumnSearchProps("branches", "Branch"),
                render: (text) => (text ? text : '-'),
                // fixed: "left",
                width: 75,
            },
            {
                title: "Divison",
                dataIndex: "divisionName",
                ...getColumnSearchProps("divisionName", "Divison"),
                render: (text) => (text ? text : '-'),
                // fixed: "left",
                width: 75,
            },
            {
                title: "Department",
                dataIndex: "department",
                ...getColumnSearchProps("department", "Department"),
                render: (text) => (text ? text : '-'),
                //fixed: "left",
                width: 90,
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

        dynamicColumns.push(
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
                title: "WO",
                dataIndex: "WO",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "WP",
                dataIndex: "WP",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "H",
                dataIndex: "H",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "HP",
                dataIndex: "HP",
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
                title: "Late Mins",
                dataIndex: "totalLateMins",
                align: 'center',
                width: 55,
                fixed: "right",
                render: (text) => text ? text : '0',
            },
            {
                title: "Exempt Mins",
                dataIndex: "exemptionMins",
                align: 'center',
                width: 60,
                fixed: "right",
            },
            {
                title: "Post Deduct Mins",
                dataIndex: "afterDeductionMins",
                align: 'center',
                width: 60,
                fixed: "right",
            },
            {
                title: "Deduct Days",
                dataIndex: "deductionInDays",
                align: 'center',
                width: 50,
                fixed: "right",
            },
            {
                title: "CL",
                dataIndex: "clAvailable",
                align: 'center',
                width: 30,
                fixed: "right",
            },
            {
                title: "Final Deduct Days",
                dataIndex: "finalDeductionInDays",
                align: 'center',
                width: 60,
                fixed: "right",
            },
            // {
            //     title: "CO",
            //     dataIndex: "co",
            //     align: 'center',
            //     width: 30,
            //     fixed: "right",
            // },

            {
                title: "Total Days",
                dataIndex: "totalDays",
                align: "center",
                width: 40,
                fixed: "right",
            },
            {
                title: "Payable Days",
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
        );

        return dynamicColumns;
    };

    const getAllEmpMonthWiseData = async (values: any, page?: number, pageSize?: number) => {
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
            const employeeTypeId = values.employeeTypeId
            const daysAndDates = getDaysAndDates(year, month);
            const generatedColumns = generateColumns(daysAndDates, page ? page : 1);
            setColumns(generatedColumns);
            const req: MonthWIseEmpReportReq = {
                year,
                month,
                branch,
                department,
                division,
                employeeId,

                attendanceMonth,
                page: page || pagination.current,
                pageSize: pageSize || pagination.pageSize,
                employeeTypeId
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

    const exportExcel = async (daysAndDates: any) => {
        message.loading({ content: 'Excel is being downloaded...', key: 'excelDownload', duration: 0 });
        try {
            const formData = form.getFieldsValue();
            const year = formData.yearAndMonth?.format('YYYY');
            const month = formData.yearAndMonth?.format('MM');
            const branch = formData.branches === 'ALL' ? 0 : formData.branches;
            const department = formData.department;
            const division = formData.division;
            const employeeId = formData.employeeId;
            const req = { year, month, branch, department, division, attendanceMonth: `${year}${month}`, employeeId }
            const response = await axios.post(`${configVariables.APP_LMS_SERVICE_URL}/attendance/excelDownload`, req, { responseType: 'arraybuffer' })
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
            const yearAndMonth = form.getFieldValue("yearAndMonth");
            if (!yearAndMonth) {
                return console.error("Please select a date before freezing/unfreezing.");
            }
            const branch = form.getFieldValue("branches") === "All" ? null : form.getFieldValue("branches")
            const formattedDate = dayjs(yearAndMonth).format("YYYYMM"); // Format date as YYYYMM
            const req = { date: formattedDate, status, branch };

            setLoading(true);
            const res = await attService.updateFreezeStatus(req);
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
        <PageContainer title={'Monthly Attendance Report'}>
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

                    <Col xs={24} sm={12} md={8} lg={5}>
                        <Form.Item name="employeeId" label="Employee Code">
                            <Select allowClear placeholder="Select Employee Code" showSearch optionFilterProp="children"  dropdownMatchSelectWidth={false}>
                                {empData?.map((emp) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
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

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item label='Employee Type' name='employeeTypeId'>
                            <Select placeholder={'Select Employee Type'} >
                                {
                                    employeeTypes.map((v: any) => { return <Option key={v.id} value={v?.id}>{v?.name}</Option> })
                                }
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginTop: "23px" }}>
                        <Button type="primary" htmlType="submit" variant="outlined" color="primary">
                            Submit
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
                                    icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold", marginLeft: "10px" }} type="dashed"
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

            {data.length > 0 ? <>
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
                    // onChange={(pagination) => setPage(pagination.current)}

                    scroll={{ x: "max-content" }}
                    sticky
                />
            </> : <></>}


        </PageContainer>
    );
};

export default MonthWiseEmpReport;
