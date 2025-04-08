import { CheckOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, EmployeeFilterReq, EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, message, Row, Select, Space, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../../../common/iam-client-react';
import { SequenceUtils } from '../../../../../common/utils';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
interface EmployeeRMUpdateProps {
    scopes: ScopesEnum[]
}

const EmployeeRMUpdate = (props: EmployeeRMUpdateProps) => {
    const { scopes } = props
    const [page, setPage] = useState<number>(1);
    const service = new EmployeeOnboardingService();
    const [data, setData] = useState<any>([]);
    const [filteredData, setFilteredData] = useState<any>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    // const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [uniqueReportingManagers, setUniqueReportingManagers] = useState<any>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [assignedManagers, setAssignedManagers] = useState<any[]>([]);
    const [selectedManager, setSelectedManager] = useState<string | undefined>(undefined);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [empData, setEmpData] = useState<any[]>([])
    const [reportingData, setReportingData] = useState<any[]>([])
    const { Option } = Select
    const brService = new BranchesService()
    const [branches, setBranches] = useState<any>([]);
    const { IAMClientAuthContext } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const currentUrl: string = window.location.href;
    const params = currentUrl ? currentUrl.split('?')[1] : null
    const [employeeId, branchId] = params ? params.split('-').map(Number) : [null, null]

    useEffect(() => {
        // const branchId = IAMClientAuthContext.user.unitId;
        getAllReportManager()
        // getActiveEmployeeList();
        // getAssignedReportingManagers();
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
        }
        if (employeeId && branchId) {
            getSelectedEmployeeData()
        } else {
            getAllEmployee();
        }
    }, [IAMClientAuthContext.user.unitId]);

    const getSelectedEmployeeData = async () => {
        const req = new EmployeeFilterReq();

        try {
            service.getAllEmployeesData(req).then((res) => {
                if (res.status) {
                    setFilteredData(res.data.filter((res) => res.id === Number(employeeId)));
                    setEmpData(res.data.filter((employee) => employee.employeeTypeId === 1))
                    form.setFieldsValue({ employee: res.data.find((res) => res.id === Number(employeeId)).reportingManager === null ? 'noManager' : res.data.find((res) => res.id === Number(employeeId)).reportingManager })
                    form.setFieldsValue({ branchId: res.data.find((res) => res.id === Number(employeeId)).branchId })
                } else {
                    message.error('Failed to fetch employee data');
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };

    const getAllEmployee = async () => {
        // setLoading(true);
        const req = new EmployeeFilterReq();
        const formValues = form.getFieldsValue();
        if (formValues.branchId) {
            req.branchId = formValues.branchId === 'All' ? 0 : formValues.branchId;
        }
        // if (formValues.employee) {
        //     req.employeeId =  formValues.employee;
        // }
        try {
            service.getAllEmployeesData(req).then((res) => {
                if (res.status) {
                    setData(res.data);
                    setFilteredData(res.data);
                    //res.data.find((rec) => rec.branchId === IAMClientAuthContext.user.unitId)
                    setEmpData(res.data.filter((employee) => employee.employeeTypeId === 1))
                    if (formValues.employee) {
                        setSelectedEmployee(formValues.employee);
                        const filtered = formValues.employee
                            ? res.data.filter((employee) => employee.reportingManager === (formValues.employee === 'noManager' ? null : Number(formValues.employee))) // Compare IDs
                            : data;
                        setFilteredData(filtered);
                        setSelectedRowKeys([]); // Clear row selections
                        form.resetFields(['reportManager']); // Reset the reporting manager select field
                    }
                    const uniqueManagers = Array.from(new Map(res.data.map((rec: any) => [rec.reportingManagerName, rec])).values());
                    setUniqueReportingManagers(uniqueManagers);
                } else {
                    message.error('Failed to fetch employee data');
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };
    // const getActiveEmployeeList = () => {
    //     service.getActiveEmployeeList().then(res => {
    //         if (res.status) {
    //             //empData.find((rec)=>rec.)
    //             setEmpData(res.data)
    //         } else {
    //             setEmpData([])
    //         }
    //     })
    // }

    const getAllReportManager = async () => {
        // setLoading(true);
        const req = new EmployeeFilterReq();
        const formValues = form.getFieldsValue();
        // if (formValues.branchId) {
        //     req.branchId = formValues.branchId === 'All' ? 0 : formValues.branchId;
        // }
        try {
            service.getAllReportManagerData(req).then((res) => {
                if (res.status) {
                    setData(res.data);
                    setFilteredData(res.data);
                    res.data.find((rec) => rec.branchId === IAMClientAuthContext.user.unitId)
                    setReportingData(res.data)
                    const uniqueManagers = Array.from(new Map(res.data.map((rec: any) => [rec.reportingManagerName, rec])).values());
                    setUniqueReportingManagers(uniqueManagers);
                } else {
                    message.error('Failed to fetch employee data');
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };
    const getAssignedReportingManagers = async () => {
        try {
            const res = await service.getEmployeeWithReportingManager();
            if (res.status) {
                setAssignedManagers(res.data);
            } else {
                message.error(res.internalMessage || 'Failed to fetch assigned managers');
            }
        } catch (error) {
            message.error('An error occurred while loading assigned managers');
        }
    };

    const handleEmployeeSelect = (value: string) => {
        setSelectedEmployee(value);
        const filtered = value
            ? data.filter((employee) => employee.reportingManager === (value === 'noManager' ? null : Number(value))) // Compare IDs
            : data;
        setFilteredData(filtered);
        setSelectedRowKeys([]); // Clear row selections
        form.resetFields(['reportManager']); // Reset the reporting manager select field
    };

    const handleReportingManagerUpdate = async () => {
        const newReportingManagerId = form.getFieldValue('reportManager');

        if (!newReportingManagerId) {
            message.warning('Please select a valid reporting manager.');
            return;
        }

        const requestPayload = {
            id: selectedRowKeys,
            reportingManager: newReportingManagerId,
        };

        try {
            const response = await service.updateEmployeeReportingManager(requestPayload);
            if (response.status) {
                message.success('Reporting manager updated successfully.');
                getAllEmployee();
                setSelectedRowKeys([]);
                form.resetFields();
                onReset()
            } else {
                message.error('Failed to update reporting manager.');
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred while updating the reporting manager.');
        }
    };

    const handleSelectAllAcrossPages = () => {
        setSelectAllChecked((prev) => !prev); // Toggle checkbox state
        if (!selectAllChecked) {
            pageCount(); // Select all rows across all pages
        } else {
            setSelectedRowKeys([]); // Deselect all rows
        }
    };

    const getColumnSearchProps = (dataIndex: any,title:any): ColumnType<any> => ({
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



    const columns: ColumnsType<any> = [
        // {
        //     title: (
        //         <input
        //             type="checkbox"
        //             checked={selectAllChecked}
        //         />
        //     ),
        //     key: 'selectAll',
        //     render: () => null,
        // },
        {
            title: 'S.No',
            key: 'sno',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: 'Employee Name',
            dataIndex: 'fullName',
            ...getColumnSearchProps("fullName","Employee Name"),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            ...getColumnSearchProps("employeeCode","Employee Code"),
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            ...getColumnSearchProps("branchName","Branch"),
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            ...getColumnSearchProps("departmentName","Department"),
        },
        {
            title: 'Designation',
            dataIndex: 'designationName',
            ...getColumnSearchProps("designationName","Designation"),
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobileNo',
            ...getColumnSearchProps("mobileNo","Mobile Number"),
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            ...getColumnSearchProps("dateOfBirth","Date Of Birth"),
            render: (v, obj) => dayjs(v).format('DD/MM/YYYY'),
        },
        // {
        //     title: 'Gender',
        //     dataIndex: 'gender', 
        //     ...getColumnSearchProps("gender"),
        //     align: 'center',
        //     render: (v, obj) => {
        //         if (obj.gender === 'M') {
        //             return <Tag icon={<ManOutlined />} color="cyan">Male</Tag>;
        //         }
        //         if (obj.gender === 'F') {
        //             return <Tag icon={<WomanOutlined />} color="magenta">Female</Tag>;
        //         }
        //         return <Tag color="red">Others</Tag>;
        //     },
        // },
        {
            title: 'Reporting Manager',
            dataIndex: 'reportingManagerName',
            ...getColumnSearchProps("reportingManagerName","Reporting Manager"),
        },
    ];

    const exceldata = [
        { title: 'Employee Name', dataIndex: 'fullName', width: 120, render: (text: any, record: any) => { return record.fullName ? record.fullName : '-' } },
        { title: 'Employee Code', dataIndex: 'employeeCode', width: 120, render: (text: any, record: any) => { return record.employeeCode ? record.employeeCode : '-' } },
        { title: 'Branch', dataIndex: 'branchName', width: 120, render: (text: any, record: any) => { return record.branchName ? record.branchName : '-' } },
        { title: 'Department', dataIndex: 'departmentName', width: 120, render: (text: any, record: any) => { return record.departmentName ? record.departmentName : '-' } },
        { title: 'Designation', dataIndex: 'designationName', width: 120, render: (text: any, record: any) => { return record.designationName ? record.designationName : '-' } },
        { title: 'Mobile Number', dataIndex: 'mobileNo', width: 120, render: (text: any, record: any) => { return record.mobileNo ? record.mobileNo : '-' } },
        { title: 'Date of Birth', dataIndex: 'dateOfBirth', width: 120, render: (text: any, record: any) => { return record.dateOfBirth ? dayjs(record.dateOfBirth).format('YYYY-MM-DD') : '-' } },
        { title: 'Gender', dataIndex: 'gender', width: 120, render: (text: any, record: any) => { return record.gender ? record.gender : '-' } },
        { title: 'Reporting Manager', dataIndex: 'reportingManagerName', width: 120, render: (text: any, record: any) => { return record.reportingManagerName ? record.reportingManagerName : '-' } },
    ];

    const exportExcel = () => {
        const excel = new Excel();
        const calculateColumnWidths = (columns: IExcelColumn[], data: any[]) =>
            columns.map((col: any) => ({
                ...col,
                width: Math.max(
                    col.title.toString().length,
                    ...data.map((row) => row[col.dataIndex]?.toString().length || 0)
                ) * 12
            }));
        const adjustedColumns = calculateColumnWidths(exceldata, filteredData);
        excel
            .addSheet('Excel Master')
            .addColumns(adjustedColumns)
            .addDataSource(filteredData, { str2num: false })
            .saveAs('employees_RMs Data.xlsx');
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            setSelectedRowKeys(keys); // Update selected row keys on individual row selection
        },
        onSelect: (record: any, selected: boolean) => {
            const newSelectedKeys = selected
                ? [...selectedRowKeys, record.id] // Add the record id if selected
                : selectedRowKeys.filter((key) => key !== record.id); // Remove the record id if deselected

            setSelectedRowKeys(newSelectedKeys);
        },
        onSelectAll: (selected: boolean, selectedRows: any[]) => {
            if (selected) {
                // Select all rows across all pages
                const allSelectedKeys = filteredData.map((row) => row.id);
                setSelectedRowKeys(allSelectedKeys); // Update selected row keys with all rows' ids
            } else {
                // Deselect all rows across all pages
                setSelectedRowKeys([]); // Clear selected row keys
            }
        },
        getCheckboxProps: (record: any) => ({
            disabled: false, // Enable checkbox
        }),
    };

    // Handle manager select logic to update selected row keys across all pages
    const handleManagerSelect = (value: string | undefined) => {
        setSelectedManager(value);
        setSelectedRowKeys([]);
    };

    const pageCount = () => {
        // Calculate total number of pages
        const totalPages = Math.ceil(filteredData.length / 10); // Assuming 10 rows per page
        console.log(`Total number of pages: ${totalPages}`);

        // Gather data from all pages
        let allRows: any[] = [];
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const startIndex = pageIndex * 10;
            const endIndex = (pageIndex + 1) * 10;
            allRows = [...allRows, ...filteredData.slice(startIndex, endIndex)];
        }

        // Set all rows as selected
        setSelectedRowKeys(allRows.map((row) => row.id)); // Assuming `id` is the unique key for the rows

        console.log(`Total rows across all pages: ${allRows.length}`);
    }

    const onReset = () => {
        form.resetFields();
        const branchId = IAMClientAuthContext.user.unitId;
        getAllEmployee();
        setFilteredData(data);
        setSelectedRowKeys([])
        setSelectedEmployee(undefined);
        setSelectedManager(undefined);
    };

    const getAllBranches = async () => {
        const res = await brService.getAllBranches();
        if (res.status) {
            setBranches(res.data);
        }
        else {
            console.error("failed to fetch");
        }
    };

    return (
        <PageContainer title="Update Reporting Manager" breadcrumbRender={false}>
            <Form layout="vertical" form={form}>
                <Row gutter={[24, 6]}>

                    <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                        <Form.Item name="branchId" label="Branch"
                        // initialValue={IAMClientAuthContext.user.roles === "SuperAdmin" ? 'All' : IAMClientAuthContext.user.unitId}
                        >
                            <Select placeholder="Select Branch" disabled={role === 'SuperAdmin' ? false : true} showSearch allowClear onChange={getAllEmployee} optionFilterProp="children" >
                                <Option value={''}> ALL </Option>
                                {branches.map((br) => (
                                    <Option key={br.id} value={br.id}>
                                        {br.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>


                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item name="employee" label="Current Reporting Manager">
                            <Select
                                showSearch
                                allowClear
                                onChange={handleEmployeeSelect}
                                optionFilterProp="children"
                            >
                                <Select.Option key="noManager" value="noManager">
                                    No Reporting Manager
                                </Select.Option>
                                {reportingData.map((employee) => (
                                    <Select.Option key={employee.reportingManager} value={employee.reportingManager}>
                                        {employee.reportingManagerName}-{employee.employeeCode}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* {selectedEmployee && ( */}
                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item name={'reportManager'} label={'Assign New Reporting Manager'}>
                            <Select
                                showSearch
                                allowClear
                                // disabled={!selectedEmployee} // Enable if Previous Reporting Manager is selected
                                onChange={(value) => setSelectedManager(value)}
                                optionFilterProp="children"
                            >
                                {empData.map((manager) => (
                                    <Select.Option showSearch allowClear key={manager.id} value={manager.id}>
                                        {manager.fullName}-{manager.employeeCode}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* )} */}

                </Row>
                <Row gutter={16}>
                    <Col >

                        <Button
                            type="primary"
                            onClick={handleReportingManagerUpdate}
                            style={{ marginTop: '23px' }}
                            disabled={
                                !selectedRowKeys.length ||
                                !form.getFieldValue('reportManager') ||
                                SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Update)}>
                            Update
                        </Button>
                    </Col>
                    <Col >
                        <Button
                            style={{ marginTop: '23px' }}
                            type="dashed"
                            danger
                            icon={<UndoOutlined />}
                            onClick={onReset}>
                            Reset
                        </Button>
                    </Col>
                    <Col >
                        <Button
                            onClick={exportExcel}
                            style={{
                                border: "1px dashed #22f534",
                                color: "green",
                                fontWeight: "bold",
                                marginTop: '23px'
                            }}
                            type="dashed"
                        // style={{ marginTop: '23px', backgroundColor: "#06b844", color: "white" }}
                        >
                            Get Excel
                        </Button>
                    </Col>
                </Row>
            </Form>
            <br />
            <div style={{ position: 'relative' }}>
                {selectedManager && (
                    <Button
                        type="primary"
                        onClick={handleSelectAllAcrossPages}
                        style={{
                            width: 20,
                            height: 20,
                            position: 'absolute',
                            right: '97.8%',
                            top: 11,
                            zIndex: 10,
                        }}
                        className="overlay"
                        icon={<CheckOutlined />}
                    />
                )}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    bordered
                    size="small"
                    rowSelection={rowSelection}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        position: ['topRight'],
                        onShowSizeChange(current, size) {
                            const totalPages = Math.ceil(filteredData.length / size);
                        },
                        total: filteredData.length,
                        showSizeChanger: true,
                    }}
                    rowKey="id"
                />
            </div>
        </PageContainer>
    );
};

export default EmployeeRMUpdate;
