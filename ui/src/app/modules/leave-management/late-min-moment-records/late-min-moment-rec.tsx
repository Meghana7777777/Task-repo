import { PageContainer } from '@ant-design/pro-layout';
import { EmpDataReq, LateMinMomentRecordsReq, lateMinReq, ScopesEnum } from '@hrexpert/shared-models';
import { ApplForLeavesSharedService, AttendanceServices, BranchesService, EmployeeOnboardingService, LeaveAllocationService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Col, DatePicker, Form, message, Row, Select, Table, TableColumnsType } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from 'react';
import { useIAMClientState } from "../../../common/iam-client-react";
import { FileExcelOutlined } from '@ant-design/icons';
import { Excel } from 'antd-table-saveas-excel';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
interface LateMinMomentsRecordsProps {
    scopes: ScopesEnum[],
}
interface DataType {
    records: any;
    key?: React.Key;
    type?: string;
    title?: string;
    fixed?: string;
    width?: number;
    dataIndex?: any
    align?: any
    render?: any
    filterDropdown?: any
    filterIcon?: any
    onFilter?: any
}
dayjs.extend(duration);

const LateMinMomentRecords = (props: LateMinMomentsRecordsProps) => {
    const [page, setPage] = useState(1);
    const [employeeData, setEmployeeData] = useState([])
    const attendanceService = new AttendanceServices()
    const service = new ApplForLeavesSharedService()
    const branchesService = new BranchesService();
    const [branches, setBranches] = useState<any>([]);
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [form] = Form.useForm()
    const Option = Select
    const [employees, setEmployees] = useState<any>([]);
    const employeeOnboardingService = new EmployeeOnboardingService();


    useEffect(() => {
        getAllBranches()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
            getAllActiveEmpDropDown(null)
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)

        }
        if (IAMClientAuthContext.user.roles !== "SuperAdmin") {
            getActiveEmployeesById()
        }
    }, [])

    const getAllActiveEmpDropDown = async (branchId) => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branchId: null });
        } else if (branchId === null) {
            form.setFieldsValue({ branchId: "ALL" });
        } else if (branchId === '') {
            form.setFieldsValue({ branchId: "ALL" });
        } else {
            form.setFieldsValue({ branchId: branchId });
        }
        const req = new lateMinReq(branchId);
        const res = await employeeOnboardingService.getEmpDataForLateMinCal(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getAllBranches = () => {
        try {
            branchesService.getActiveBranches().then((res) => {
                if (res.status) {
                    setBranches(res.data.filter((item) => item.branchName.includes("CORPORATE")));
                } else {
                    console.log("Failed to fetch branches");
                    setBranches([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getLateMinMomentRecordsData = () => {
        const req = new LateMinMomentRecordsReq()
        const formValues = form.getFieldsValue();
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null;
        } else {
            req.branchId = formValues.branchId;
        }
        if (formValues.employeeCode) {
            req.employeeCode = formValues.employeeCode
        }
        if (formValues.month) {
            req.month = dayjs(formValues.month).format("YYYY-MM")
        }
        req.status = 'APPROVED'
        attendanceService.getLateMinMomentRecordsData(req).then((res) => {
            if (res.status) {
                setEmployeeData(res.data);
            } else {
                message.error(res.internalMessage);
                setEmployeeData([])
            }
        })
    }

    const getActiveEmployeesById = (branchId?: number) => {
        try {
            const req = new LateMinMomentRecordsReq
            if (role === 'SuperAdmin') {
                if (form.getFieldValue('branches') !== undefined) {
                    req.branchId = form.getFieldValue('branches');
                }
            } else {
                req.branchId = IAMClientAuthContext.user?.unitId || null;
            }
            service.getActiveEmployeesByIds(req).then((res) => {
                if (res.status) {
                    setEmployeeData(res.data.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const employeeColumns: TableColumnsType<DataType> = [
        {
            title: 'S No',
            key: 'sno',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "Employee Name",
            align: "center",
            dataIndex: "fullName",
        },
        {
            title: "Employee Code",
            align: "center",
            dataIndex: "empCode",
        },
        {
            title: "Branch Name",
            align: "center",
            dataIndex: "branchName",
        },
    ];



    const lateMinRecordsColumns: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: "Date",
            align: "center",
            dataIndex: "date",
        },
        {
            title: "Swipe Out Time",
            align: "center",
            dataIndex: "swipeOutTime",
            render: (text) => text ? text : "-"
        },
        {
            title: "Swipe In Time",
            align: "center",
            dataIndex: "swipeInTime",
            render: (text) => text ? text : "-"
        },
        {
            title: "Late Minutes",
            align: "center",
            dataIndex: "actualLateMin",
        },
        {
            title: "Moments",
            align: "center",
            dataIndex: "swipesEnum",
            render: (text) => text === "REMAINING" ? "MIDDLE IN/OUT" : text
        },
        {
            title: "Remarks",
            align: "center",
            dataIndex: "remarks",
        },
    ]

    let i = 1
    const excelColumns = [
        { title: 'S No', dataIndex: 'sNo', render: (text, object, index) => { return i++; } },
        {
            title: "Employee Name",
            dataIndex: "fullName"
        },
        {
            title: "Employee Code",
            dataIndex: "empCode"
        },
        {
            title: "Branch Name",
            dataIndex: "branchName"
        },
        {
            title: "Date",
            dataIndex: "date"
        },
        {
            title: "Swipe Out Time",
            dataIndex: "swipeOutTime",
            render: (text) => text ? text : "-"
        },
        {
            title: "Swipe In Time",
            dataIndex: "swipeInTime",
            render: (text) => text ? text : "-"
        },
        {
            title: "Late Minutes",
            dataIndex: "actualLateMin",
        },
        {
            title: "Moments",
            dataIndex: "swipesEnum",
            render: (text) => text === "REMAINING" ? "MIDDLE IN/OUT" : text
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
        },

    ]



    const onReset = () => {
        form.resetFields()
        setEmployeeData([])
    }

    const groupedEmployeeData = employeeData.reduce((i, j) => {
        const existing = i.find((item) => item.empCode === j.empCode);
        if (existing) {
            existing.records.push(j);
        } else {
            i.push({ ...j, records: [j] })
        }
        return i
    }, [])

    const exportExcel = () => {
        const excel = new Excel()
        const calculateColumnWidths = (columns: IExcelColumn[], data: any[]) =>
            columns.map((col: any) => ({
                ...col,
                width: Math.max(
                    col.title.toString().length,
                    ...data.map((row) => row[col.dataIndex]?.toString().length || 0)
                ) * 12
            }));
        const adjustedColumns = calculateColumnWidths(excelColumns, employeeData);
        excel
            .addSheet('late-minute-report')
            .addColumns(adjustedColumns)
            .addDataSource(employeeData, { str2num: true })
            .saveAs('late-minute-report.xlsx');
    }

    return (
        <>
            <PageContainer title='Late Minutes Report' breadcrumbRender={false}>
                <Form layout='vertical' onFinish={getLateMinMomentRecordsData} form={form}>
                    <Row gutter={[24, 4]}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={3}>
                            <Form.Item
                                rules={[{ required: true, message: "Date is Required" }]}
                                label='Month' name="month">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder='Select Date'
                                    picker='month' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Form.Item
                                rules={[{ required: true, message: "Branch is Required" }]}
                                label={'Branch'} name='branchId'
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'ALL' : Number(IAMClientAuthContext.user.unitId)}
                            >
                                <Select disabled={role === 'SuperAdmin' ? false : true} placeholder="Select branch" showSearch allowClear optionFilterProp="children" dropdownMatchSelectWidth={false}
                                    onChange={(value) => getAllActiveEmpDropDown(value)}

                                >
                                    <Option value={''}> ALL </Option>
                                    {branches.map((br) => (
                                        <Option key={br.id} value={br.id}>
                                            {br.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                            <Form.Item label='Employee Name' name='employeeCode'
                                initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? '' : Number(IAMClientAuthContext.user.employeeCode)}
                            >
                                <Select disabled={role === 'SuperAdmin' ? false : true} showSearch allowClear dropdownMatchSelectWidth={false}
                                    optionFilterProp="children" placeholder="Select Employee Name">
                                    {employees?.map((emp: any) => (
                                        <Option key={emp.employeeCode} value={emp.employeeCode}>
                                            {emp.fullName}-{emp.employeeCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={3} xl={6} style={{ marginTop: "23px" }}>
                            <Button color="primary" variant="outlined" htmlType='submit' >Submit</Button>
                            <Button danger onClick={onReset} style={{ marginLeft: "10px" }}>Reset</Button>
                            {employeeData.length > 0 ? <>
                            <Button icon={<FileExcelOutlined />} style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold", marginLeft:'10px' }} type="dashed" onClick={exportExcel}>
                                Get Excel
                            </Button>
                        </> : <></>}
                        </Col>

                       
                    </Row>
                </Form >
                <Table
                    size="small"
                    columns={employeeColumns}
                    dataSource={groupedEmployeeData}
                    bordered
                    expandable={{
                        expandedRowRender: (employee) => {
                            return (
                                <Card style={{ backgroundColor: "white", color: "black" }}>
                                    <Table
                                        columns={lateMinRecordsColumns}
                                        dataSource={employee.records.map((record, ind) => ({
                                            key: ind,
                                            sno: ind + 1,
                                            lateMinId: record.lateMinId,
                                            swipeInTime: record.swipeInTime,
                                            swipeOutTime: record.swipeOutTime,
                                            actualLateMin: record.actualLateMin,
                                            finalLateMin: record.finalLateMin,
                                            swipesEnum: record.swipesEnum,
                                            status: record.status,
                                            remarks: record.remarks,
                                            date: record.date
                                        }))}
                                        bordered
                                        size="small"
                                        pagination={false}
                                    />
                                </Card>
                            );
                        }
                    }}
                    rowKey="empCode"
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                    }}
                />
            </PageContainer>

        </>
    );
}
export default LateMinMomentRecords