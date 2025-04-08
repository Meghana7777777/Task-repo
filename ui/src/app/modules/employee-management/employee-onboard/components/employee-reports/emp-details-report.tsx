import { ManOutlined, SearchOutlined, WomanOutlined } from '@ant-design/icons';
import { EmpDataReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, EmployeeOnboardingService, LeaveAllocationService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, message, Row, Select, Space, Table, Tag } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import { ColumnProps, ColumnType } from 'antd/es/table';
import { default as dayjs, default as daysjs } from 'dayjs';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../../../common/iam-client-react';
interface EmployeeTableViewProps {
    scopes: ScopesEnum[]
}
const EmployeeDetailsReport = (props: EmployeeTableViewProps) => {
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState<number>(1);
    const [employeeData, setEmployeeData] = useState([])
    const service = new EmployeeOnboardingService()
    const dpService = new DepartmentService()
    const desService = new DesignationsService();
    const branchesService = new BranchesService();
    const [branches, setBranches] = useState<any>([]);
    const leaveAllocationService = new LeaveAllocationService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [form] = Form.useForm()
    const [designations, setDesignations] = useState([]);
    const Option = Select
    const [employees, setEmployees] = useState<any>([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        getDesignationList()
        getDepartmentList()
        getBranches()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            getAllActiveEmpDropDown(undefined)
        }
        else {
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        }
    }, [])

    const getAllActiveEmpDropDown = async (branchId) => {
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getBranches = () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
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

    const getDesignationList = () => {
        try {
            desService.getDesignations().then((res) => {
                if (res.status) {
                    setDesignations(res.data);
                } else {
                    console.error("failed to fetch designations");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getEmployeeDetails = () => {
        const req = new EmpDataReq()
        const formValues = form.getFieldsValue();
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null;
        } else {
            req.branchId = formValues.branchId;
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId
        }
        if (formValues.designationId) {
            req.designationId = formValues.designationId
        }
        service.getEmpDetailsReport(req).then((res) => {
            if (res.status) {
                setEmployeeData(res.data);
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    console.log(employeeData, "ruryrh")
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
    /**
     *
     * @param selectedKeys
     * @param confirm
     * @param dataIndex
     */
    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }

    let i = 1;
    const employee = [
        { title: "Employee Name", dataIndex: "fullName" },
        { title: "Employee Code", dataIndex: "employeeCode" },
        { title: "Branch Name", dataIndex: "branchName" },
        { title: "Department", dataIndex: "departmentName" },
        { title: "Designation", dataIndex: "designationName" },
        { title: "Mobile Number", dataIndex: "mobileNo" },
        { title: "Date of Birth", dataIndex: "dateOfBirth" },
        { title: "Date of Joining", dataIndex: "dateOfJoining" },
        { title: "Email ID", dataIndex: "emailId" },
        { title: "Current Address", dataIndex: "currentAddress" },
        { title: "Current State", dataIndex: "currentState" },
        { title: "Current Pincode", dataIndex: "currentPincode" },
        { title: "Permanent Address", dataIndex: "permanentAddress" },
        { title: "Permanent State", dataIndex: "permanentState" },
        { title: "Permanent Pincode", dataIndex: "permanentPincode" },
        { title: "Salary", dataIndex: "salary" },
        { title: "Provident Fund No.", dataIndex: "pfNo" },
        { title: "ESIC Number", dataIndex: "esicNo" },
        { title: "Bank Name", dataIndex: "bankName" },
        { title: "Bank Account No.", dataIndex: "bankAcNo" },
        { title: "Bank IFSC Code", dataIndex: "bankIfscCode" },
        { title: "Nominee", dataIndex: "nominee" },
        { title: "Reporting Manager", dataIndex: "reportingManagerName" },
        { title: "Date Of Reliving", dataIndex: "dateOfReliving" },
        { title: "Reason Of Reliving", dataIndex: "reasonOfReliving" },
        { title: "Gender", dataIndex: "gender" },
    ];

    const columns: ColumnProps<any>[] = [
        {
            title: "S.No",
            key: "sno",
            fixed: 'left',
            width: 40,
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: "Employee Name",
            fixed: 'left',
            align: "center",
            width: 150,
            ...getColumnSearchProps("firstName"),
            render: (v, obj) => `${obj.firstName} ${obj.lastName || ""}`.trim(),
        },
        {
            title: "Employee Code",
            fixed: 'left',
            align: "center",
            dataIndex: "employeeCode",
            width: 130,
            ...getColumnSearchProps("employeeCode")
        },
        {
            title: "Branch Name",
            dataIndex: "branchName",
            width: 100,
            ...getColumnSearchProps("branchName")
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            width: 100,
            ...getColumnSearchProps("departmentName")
        },
        {
            title: "Designation",
            dataIndex: "designationName",
            width: 100,
            ...getColumnSearchProps("designationName")
        },
        {
            title: "Mobile Number",
            dataIndex: "mobileNo",
            align: "center",
            width: 100,
            ...getColumnSearchProps("mobileNo")
        },
        {
            title: "Date of Birth",
            width: 100,
            render: (v, obj) => daysjs(obj.dateOfBirth).format('DD/MM/YYYY')
        },
        {
            title: "Date of Joining",
            dataIndex: "dateOfJoining",
            width: 100,
            render: (date: string) => (date ? daysjs(date).format("DD/MM/YYYY") : ""),
        },
        {
            title: "Email ID",
            width: 100,
            dataIndex: "emailId"
        },
        {
            title: "Current Address",
            width: 100,
            dataIndex: "currentAddress"
        },
        {
            title: "Current State",
            width: 100,
            dataIndex: "currentState"
        },
        {
            title: "Current Pincode",
            width: 100,
            dataIndex: "currentPincode"
        },
        {
            title: "Permanent Address",
            width: 100,
            dataIndex: "permanentAddress"
        },
        {
            title: "Permanent State",
            width: 100,
            dataIndex: "permanentState"
        },
        {
            title: "Permanent Pincode",
            width: 100,
            dataIndex: "permanentPincode"
        },
        {
            title: "Salary",
            width: 100,
            dataIndex: "salary"
        },
        {
            title: "Provident Fund No.",
            width: 100,
            dataIndex: "pfNo"
        },
        {
            title: "ESIC Number",
            width: 100,
            dataIndex: "esicNo"
        },
        {
            title: "Bank Name",
            width: 100,
            dataIndex: "bankName"
        },
        {
            title: "Bank Account No.",
            width: 100,
            dataIndex: "bankAcNo"
        },
        {
            title: "Bank IFSC Code",
            width: 100,
            dataIndex: "bankIfscCode"
        },
        {
            title: "Nominee",
            width: 100,
            dataIndex: "nominee"
        },
        {
            title: "Reporting Manager",
            width: 100,
            dataIndex: "reportingManagerName"
        },
        {
            title: "Date Of Reliving",
            dataIndex: "dateOfReliving",
            width: 100,
            render: (date: string) => (date ? daysjs(date).format("DD/MM/YYYY") : ""),
        },
        {
            title: "Reason Of Reliving",
            width: 100,
            dataIndex: "reasonOfReliving"
        },
        {
            title: "Gender",
            dataIndex: "gender",
            ...getColumnSearchProps("gender"),
            align: "center",
            width: 100,
            render: (v, obj) => {
                if (obj.gender === "M") {
                    return <Tag style={{ fontSize: 13 }} icon={<ManOutlined />} color="cyan">Male</Tag>;
                }
                if (obj.gender === "F") {
                    return <Tag style={{ fontSize: 13 }} icon={<WomanOutlined />} color="magenta">Female</Tag>;
                }
                if (obj.gender === "Other") {
                    return <Tag color='red'>Others</Tag>
                }
                return obj.gender;
            },
        },
        {
            title: "Created Date & Time",
            width: 150,
            dataIndex: "createdAt",
            fixed: "right",
            align: "center",
            render: (text, record) =>
                `${dayjs(record.createdAt).format("DD-MM-YYYY")} - ${moment.utc(record.createdAt).format("HH:mm")}`,
        },
    ]

    const onReset = () => {
        form.resetFields();
    }

    const handleExport = (e: any) => {
        e.preventDefault();
        const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("/");

        let exportingColumns: IExcelColumn[] = []
        exportingColumns = [
            { title: "Employee Name", dataIndex: "fullName" },
            { title: "Employee Code", dataIndex: "employeeCode" },
            { title: "Branch Name", dataIndex: "branchName" },
            { title: "Department", dataIndex: "departmentName" },
            { title: "Designation", dataIndex: "designationName" },
            { title: "Mobile Number", dataIndex: "mobileNo" },
            { title: "Date of Birth", dataIndex: "dateOfBirth" },
            { title: "Date of Joining", dataIndex: "dateOfJoining" },
            { title: "Email ID", dataIndex: "emailId" },
            { title: "Current Address", dataIndex: "currentAddress" },
            { title: "Current State", dataIndex: "currentState" },
            { title: "Current Pincode", dataIndex: "currentPincode" },
            { title: "Permanent Address", dataIndex: "permanentAddress" },
            { title: "Permanent State", dataIndex: "permanentState" },
            { title: "Permanent Pincode", dataIndex: "permanentPincode" },
            { title: "Salary", dataIndex: "salary" },
            { title: "Provident Fund No.", dataIndex: "pfNo" },
            { title: "ESIC Number", dataIndex: "esicNo" },
            { title: "Bank Name", dataIndex: "bankName" },
            { title: "Bank Account No.", dataIndex: "bankAcNo" },
            { title: "Bank IFSC Code", dataIndex: "bankIfscCode" },
            { title: "Nominee", dataIndex: "nominee" },
            { title: "Reporting Manager", dataIndex: "reportingManagerName" },
            { title: "Date Of Reliving", dataIndex: "dateOfReliving" },
            { title: "Reason Of Reliving", dataIndex: "reasonOfReliving" },
            { title: "Gender", dataIndex: "gender" },
        ]

        const excel = new Excel();
        excel.addSheet("Sheet1");
        excel.addRow();
        excel.addColumns(exportingColumns);
        excel.addDataSource(employeeData);
        excel.saveAs(`Employee Details-${currentDate}.xlsx`);
    }
    // const exportExcel = async () => {
    //     try {
    //         const values = form.getFieldsValue();
    //         console.log(values, "hhh");
    //         message.loading({ content: 'Excel is being downloaded...', key: 'excelDownload', duration: 0 });
    //         const response = await axios.post(
    //             `${configVariables.APP_EMS_SERVICE_URL}/employee-onboarding/excelDownload`,
    //             values,  // Sending values directly
    //             { responseType: 'arraybuffer' }
    //         );

    //         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    //         if (response.headers['content-type'] !== fileType) {
    //             throw new Error('The file is not in Excel format.');
    //         }

    //         const blob = new Blob([response.data], { type: fileType });
    //         const link = document.createElement('a');
    //         link.href = window.URL.createObjectURL(blob);
    //         link.download = 'EmployeeData.xlsx';
    //         link.click();

    //         message.success({ content: 'Excel Download Successful', key: 'excelDownload' });
    //     } catch (error) {
    //         console.error('Error exporting data:', error);
    //         message.error({ content: 'Error exporting data. Please try again.', key: 'excelDownload' });
    //     }
    // };


    return (
        <><Card>
            <Form layout='vertical' onFinish={getEmployeeDetails} form={form}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label={'Branch'} name='branchId' initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : Number(IAMClientAuthContext.user.unitId)} >
                            <Select disabled={role === 'SuperAdmin' ? false : true} placeholder="Select branch" showSearch allowClear optionFilterProp="children" dropdownMatchSelectWidth={false}
                                onChange={(value) => getAllActiveEmpDropDown(value)}

                            >
                                {branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name='departmentId' label={'Department'}>
                            <Select placeholder="Select Department" showSearch allowClear>
                                {departments.map((dept) => (
                                    <Option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col >
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name={'designationId'} label={'Designation'}>
                            <Select placeholder="Select Designation" showSearch allowClear>
                                {designations.map((des) => (
                                    <Option key={des.id} value={des.id}>
                                        {des.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name">
                                {employees?.map((emp: any) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={2}>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                    </Col>
                    <Col span={2}>
                        <Button danger onClick={onReset}>Reset</Button>
                    </Col>
                    <Col span={2}>
                        <Button
                            style={{
                                border: "1px dashed #22f534",
                                color: "green",
                                fontWeight: "bold",
                            }}
                            type="dashed"
                            onClick={handleExport}
                        >
                            Get Excel
                        </Button>
                    </Col>
                </Row>
            </Form >
        </Card >
            <Table
                columns={columns}
                bordered
                size="small"
                dataSource={employeeData}
                scroll={{ y: 'calc(70vh - 100px)' }} />
        </>
    );
}
export default EmployeeDetailsReport