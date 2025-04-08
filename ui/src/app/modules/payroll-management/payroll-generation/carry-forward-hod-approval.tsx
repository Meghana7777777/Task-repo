import { SearchOutlined } from '@ant-design/icons'
import { AlertMessages, EmpDataReq, PayrollProcessedLogReq } from '@hrexpert/shared-models'
import { BranchesService, DivisionService, LeaveAllocationService, PayrollAttendanceSharedService, PayrollComponentsSharedService, PayrollProcessedLogsService } from '@hrexpert/shared-services'
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Tabs } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import { ColumnType } from 'antd/es/table'
import TabPane from 'antd/es/tabs/TabPane'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useIAMClientState } from '../../../common/iam-client-react';
const Option = Select
const CarryForwardHodApproval = () => {
    const service = new PayrollProcessedLogsService()
    const payAttendanceService = new PayrollAttendanceSharedService()
    const [payData, setPayData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const [branches, setBranches] = useState<any>([]);
    const branchesService = new BranchesService();
    const [page] = React.useState(1);
    const [form] = Form.useForm()
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const [componentData, setComponentData] = useState<any>([])
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [divisions, setDivisions] = useState<any>([]);
    const divisionService = new DivisionService()
    const leaveAllocationService = new LeaveAllocationService();
    const [employees, setEmployees] = useState<any>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [activeKey, setActiveKey] = useState("1");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        getBranches();
        getAllPayrollComponents()
        getAllDivision();

        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchId: "ALL" })
        } else {
            form.setFieldsValue({ branchId: IAMClientAuthContext.user.unitId })
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            //getAllActiveEmpDropDown(undefined)
        }
        else {
            getAllActiveEmpDropDown(IAMClientAuthContext.user.unitId)
        }

    }, []);

    const getAllPayrollComponents = () => {
        try {
            payrollComponentsSharedService.getAllPayrollComponents().then((res) => {
                if (res.status) {
                    setComponentData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
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
    const getAllActiveEmpDropDown = async (branchId) => {

        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getPayrollProcessedLog = (values) => {
        const req = new PayrollProcessedLogReq()
        const formValues = form.getFieldsValue();
        if (values.payrollMonth) {
            const startMonthYear = values.payrollMonth?.format('YYYYMM');
            req.payrollMonth = Number(startMonthYear);
        }
        // if (values.branchId) {
        //     req.branchId = values.branchId
        // }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null; // "ALL" translates to null
        } else {
            req.branchId = formValues.branchId; // Send selected branch ID
        }
        if (values.employeeName) {
            req.employeeId = values.employeeName
        }
        if (values.divisionId) {
            req.divisionId = values.divisionId
        }
        setLoading(true)
        try {
            console.log(req, "req")
            service.getPayrollProcessedLogForHodApproval(req).then((res) => {
                if (res.status) {
                    setPayData(res.data)
                    setShowColumns(true);
                    setLoading(false)
                } else {
                    setPayData([])
                    setLoading(false)
                    setShowColumns(false);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

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

    const generateColumns = (data: any) => {
        const baseColumns = [
            {
                title: 'S No',
                render: (text, object, index) => (page - 1) * 10 + (index + 1),
                align: "center",
                fixed: 'left',
            },
            {
                title: "Employee Code",
                dataIndex: "employeeCode",
                fixed: 'left',
                sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("employeeCode"),
            },
            {
                title: "Employee Name",
                dataIndex: "employeeName",
                fixed: 'left',
                sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("employeeName"),
            },
            {
                title: "Branch",
                dataIndex: "branchName",
                sorter: (a, b) => a.branchName.localeCompare(b.branchName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("branchName"),
            },
            {
                title: "Department",
                dataIndex: "departmentName",
                sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("departmentName"),
            },
            {
                title: "Division",
                dataIndex: "divisionName",
                sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("divisionName"),
            },
            {
                title: "Designation",
                dataIndex: "designationName",
                sorter: (a, b) => a.designationName.localeCompare(b.designationName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("designationName"),
            },
            {
                title: "Bank Name",
                dataIndex: "bankName",
                sorter: (a, b) => a.bankName.localeCompare(b.bankName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("bankName"),
            },
            {
                title: "Bank A/c No.",
                bankAcNo: "designationName",
                sorter: (a, b) => a.designationName.localeCompare(b.designationName),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("designationName"),
            },
            {
                title: "IFSC",
                dataIndex: "bankIfscCode",
                sorter: (a, b) => a.bankIfscCode.localeCompare(b.bankIfscCode),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("bankIfscCode"),
            },
            {
                title: "Pay Days",
                dataIndex: "payDays",
                sorter: (a, b) => a.payDays - b.payDays,
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: "Present",
                dataIndex: "presentCount",
                sorter: (a, b) => a.presentCount - b.presentCount,
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: "Absent",
                dataIndex: "absentCount",
                sorter: (a, b) => a.absentCount - b.absentCount,
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: "Leave",
                dataIndex: "leaveCount",
                sorter: (a, b) => a.leaveCount - b.leaveCount,
                sortDirections: ['ascend', 'descend'],
            },
        ];

        // Collect all unique component keys across all data entries
        const allComponentKeys = Array.from(new Set(data.flatMap(item =>
            item.componentKeys.map(component => Object.keys(component)[0])
        )));

        // Helper function to get columns for a given component type (Earning/Deduction)
        const getComponentColumns = (type) => {
            return allComponentKeys.map(key => {
                const componentType = componentData.find(rec => rec.columnName === key)?.componentType;
                if (componentType === type) {
                    return {
                        title: key,
                        dataIndex: key,
                        key,
                        render: (text) => text ? text : '-' // Show "-" if value is missing
                    };
                }
                return null;
            }).filter(Boolean);
        };

        // Earnings and Deductions columns
        const earningColumns = getComponentColumns('EARNING');
        const deductionColumns = getComponentColumns('DEDUCTION');

        // Special columns to be added individually (Gross, Total Earnings, Total Deductions, Net Payable)
        const grossColumn = allComponentKeys.includes('Gross') ? [{
            title: 'Gross',
            dataIndex: 'Gross',
            key: 'Gross',
        }] : [];

        const TotalEarningsColumn = allComponentKeys.includes('Total Earnings') ? [{
            title: 'Total Earnings',
            dataIndex: 'Total Earnings',
            key: 'Total Earnings',
        }] : [];

        const TotalDeductionColumn = allComponentKeys.filter(key => key === 'Total Deductions' || key === 'Net Payable').map(key => ({
            title: key,
            dataIndex: key,
            key,
        }));

        // Grouped columns for Earning and Deduction
        const groupedEarningColumns = earningColumns.length > 0 ? [{
            title: 'Earnings',
            dataIndex: 'earnings',
            children: earningColumns,
        }] : [];

        const groupedDeductionColumns = deductionColumns.length > 0 ? [{
            title: 'Deductions',
            dataIndex: 'deductions',
            children: deductionColumns,
        }] : [];

        return [...baseColumns, ...grossColumn, ...groupedEarningColumns, ...TotalEarningsColumn, ...groupedDeductionColumns, ...TotalDeductionColumn];
    };

    const generateDataSource = (data) => {
        // Collect all unique keys from componentKeys across all items
        const allKeys = new Set();
        data.forEach(item => {
            item.componentKeys?.forEach(component => {
                Object.keys(component).forEach(key => {
                    allKeys.add(key);
                });
            });
        });

        // Convert Set to Array
        const expectedKeys = Array.from(allKeys);

        return data.map(item => {
            const components = item.componentKeys?.reduce((acc, component) => {
                const key = Object.keys(component)[0];
                acc[key] = component[key];
                return acc;
            }, {}) || {};

            // Ensure all expected keys are present
            expectedKeys.forEach((key: any) => {
                if (!(key in components)) {
                    components[key] = null; // Default value for missing keys
                }
            });

            return {
                key: item.id,
                ...item,
                ...components,
            };
        });
    };

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet('Payroll-Processed-report')
            .addColumns(columns)
            .addDataSource(activeKey === "1" ? positiveNetPayable : negativeOrZeroNetPayable, { str2num: false })
            .saveAs('Payroll-Processed-report.xlsx');
    };

    const getBranches = async () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                // Set branches to the received data
                setBranches(res.data);
            } else {
                // Handle failure response
                message.error(res.internalMessage || 'Failed to fetch branches.');
            }
        }).catch((err) => {
            // Log and handle error
            console.error('Error:', err);
            message.error('An error occurred while fetching branches.');
        });
    }

    const columns: any = generateColumns(payData);

    const dataSource = generateDataSource(payData);

    const positiveData = payData.filter(record => Number(record.netPayable) > 0);
    const negativeData = payData.filter(record => Number(record.netPayable) <= 0)

    const positiveNetPayable = generateDataSource(positiveData);
    const negativeOrZeroNetPayable = generateDataSource(negativeData);

    const onReset = () => {
        const currentBranch = form.getFieldValue('branchId'); // Save the current branch value
        form.resetFields();
        form.setFieldsValue({ branchId: currentBranch })

        setPayData([])
        setShowColumns(false);
    }

    const handleSelectionChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const handleSubmit = () => {
        const selectedData = negativeOrZeroNetPayable.filter(record => selectedRowKeys.includes(record.id));
        console.log("Selected Employee Data:", selectedData);
        message.success('Selected employee data submitted successfully!');
        // Add your submission logic here
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleSelectionChange,
    };

    return (
        <Card title={'Carry Forward Hod Approval'}
            extra={<Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>}>
            <Form layout='vertical' onFinish={getPayrollProcessedLog} form={form}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8} lg={2} xl={4}>
                        <Form.Item
                            name="branchId"
                            label="Branch"
                            rules={[{ required: true, message: 'Please select a branch!' }]}

                        >
                            <Select allowClear showSearch placeholder="Select a Branch"
                                filterOption={(input, option) =>
                                    (option?.children as any).toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => getAllActiveEmpDropDown(value)}
                            >
                                {branches.map((branch) => (
                                    <Select.Option key={branch.id} value={branch.id}>{branch.branchName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label='Month' name='payrollMonth' rules={[{ required: true, message: 'Please select a month!' }]}>
                            <DatePicker picker="month" style={{ width: "100%" }} placeholder='Select Month' />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label="Division" name="divisionId">
                            <Select showSearch allowClear placeholder="Select Division" optionFilterProp="children" dropdownMatchSelectWidth={false}>
                                {divisions.map((rec: any) => (
                                    <Select.Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='Employee Name' name='employeeName'>
                            <Select showSearch allowClear dropdownMatchSelectWidth={false}
                                optionFilterProp="children" placeholder="Select Employee Name"  >
                                {employees?.map((emp: any) => (
                                    <Option key={emp.id} value={emp.id}>
                                        {emp.fullName}-{emp.empCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Row gutter={[24, 16]}>
                        <Col >
                            <Button type='primary' htmlType='submit' style={{ marginTop: "23px" }}>Submit</Button>
                        </Col>
                        <Col span={5}>
                            <Button danger onClick={onReset} style={{ marginTop: "23px" }}>Reset</Button>
                        </Col>
                    </Row>
                </Row>
            </Form>



            {showColumns && (
                <>
                    <Table
                        style={{ marginTop: '1rem' }}
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        loading={loading}
                        scroll={{ x: 'max-content' }} />
                </>
            )}
        </Card>
    )
}

export default CarryForwardHodApproval