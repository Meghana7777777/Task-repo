import { SearchOutlined } from '@ant-design/icons'
import { AlertMessages, EmpDataReq, PayrollProcessedLogReq } from '@hrexpert/shared-models'
import { BranchesMappingSharedService, BranchesService, DivisionService, EmployeeTypeService, LeaveAllocationService, PayrollAttendanceSharedService, PayrollComponentsSharedService, PayrollProcessedLogsService } from '@hrexpert/shared-services'
import { Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Tabs } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import { ColumnType } from 'antd/es/table'
import TabPane from 'antd/es/tabs/TabPane'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useIAMClientState } from '../../../common/iam-client-react'
const Option = Select

interface PayrollProcessedLogReportProps {
    branchId: number
    payrollMonth: any
    employeeTypeId: number
    divisionId: []
}

const PayrollProcessedLogReport = (props: PayrollProcessedLogReportProps) => {
    const service = new PayrollProcessedLogsService()
    const payAttendanceService = new PayrollAttendanceSharedService()
    const [payData, setPayData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const [branches, setBranches] = useState<any>([]);
    const branchesService = new BranchesService();
    const [form] = Form.useForm()
    const payrollComponentsSharedService = new PayrollComponentsSharedService()
    const branchesMappingService = new BranchesMappingSharedService()
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
    const empTypeService = new EmployeeTypeService()
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [branchesMappingData, setBranchesMappingData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [filteredDivisions, setFilteredDivisions] = useState<{ id: number; divisionName: string }[]>([]);
    const [payrollComponents, setPayrollComponents] = useState([])
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    useEffect(() => {
        getBranches();
        getAllPayrollComponents()
        getAllDivision();
        getEmployeeTypes();
        getBranchMapping();

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

    }, []);

    useEffect(() => {
        console.log(props);
        if (!props.branchId || !props.payrollMonth) return;
        fetchPayrollData();
    }, [props.branchId, props.payrollMonth, props.divisionId, props.employeeTypeId]); // ? Improved dependencies

    const fetchPayrollData = async () => {
        const req = new PayrollProcessedLogReq();
        if (props.payrollMonth) {
            form.setFieldValue('payrollMonth', props.payrollMonth);
            req.payrollMonth = Number(props.payrollMonth.format('YYYYMM'));
        }
        if (props.branchId) {
            form.setFieldValue('branchId', props.branchId);
            handleBranchChange(props.branchId);
            req.branchId = props.branchId;
        }
        if (props.divisionId) {
            form.setFieldValue('divisionId', props.divisionId);
            req.divisionId = props.divisionId;
        }
        if (props.employeeTypeId) {
            form.setFieldValue('employeeTypeId', props.employeeTypeId);
            req.employeeTypeId = props.employeeTypeId;
        }

        setLoading(true);
        try {
            const res = await service.getPayrollProcessedLog(req);
            if (res.status) {
                setPayData(res.data);
                setShowColumns(true);
            } else {
                setPayData([]);
                setShowColumns(false);
            }
        } catch (err) {
            console.error("Error fetching payroll data:", err);
        } finally {
            setLoading(false);
        }
    };

    const onReset = () => {
        // const currentBranch = form.getFieldValue('branchId');
        form.resetFields();
        form.setFieldsValue({ branchId: "ALL" })
        setPayData([])
        setShowColumns(false);
    }

    const handleSelectionChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const handleHold = () => {
        const selectedData = bankData.filter(record => selectedRowKeys.includes(record.id));
        const formValues = form.getFieldsValue();
        let payrollMonth
        if (formValues.payrollMonth) {
            payrollMonth = formValues.payrollMonth?.format('YYYYMM');
        }
        try {
            service.updatePayrollHoldAndReleaseStatus({ employeeId: selectedRowKeys, payrollMonth: Number(payrollMonth), holdStatus: 1 }).then((res) => {
                if (res.status) {
                    setSelectedRowKeys([])
                    getPayrollProcessedLog()
                    message.success('Payroll hold successfully!');
                }
            })
        } catch (err) {
            console.log(err);
        }
    };

    const handleRelease = () => {
        const selectedData = negativeNetPayable.filter(record => selectedRowKeys.includes(record.id));
        const formValues = form.getFieldsValue();
        let payrollMonth
        if (formValues.payrollMonth) {
            payrollMonth = formValues.payrollMonth?.format('YYYYMM');
        }
        try {
            service.updatePayrollHoldAndReleaseStatus({ employeeId: selectedRowKeys, payrollMonth: Number(payrollMonth), holdStatus: 0 }).then((res) => {
                if (res.status) {
                    setSelectedRowKeys([])
                    getPayrollProcessedLog()
                    message.success('Payroll hold successfully!');
                }
            })
        } catch (err) {
            console.log(err);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleSelectionChange,
    };

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

    const getBranchMapping = () => {
        try {
            branchesMappingService.getBranchMapping().then((res) => {
                if (res.status) {
                    setBranchesMappingData(res.data)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleBranchChange = (branchId: number) => {
        setSelectedBranch(branchId);
        const uniqueDivisions = Array.from(
            new Map(
                branchesMappingData
                    .filter(branch => branch.branchId === branchId)
                    .map(branch => [branch.divisionId, { id: branch.divisionId, divisionName: branch.divisionName }])
            ).values()
        );

        setFilteredDivisions(uniqueDivisions);
    };

    const getAllDivision = () => {
        divisionService.getAllDivision().then((res) => {
            if (res.status) {
                setDivisions(res.data)
            } else {
                setDivisions('No Data Found')
            }
        })
    }

    const getEmployeeTypes = async () => {
        const res = await empTypeService.getActiveEmployeeType()
        setEmployeeTypes(res.data)
    }

    const getAllActiveEmpDropDown = async (branchId) => {
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
        setBranches
    };

    const getPayrollProcessedLog = () => {
        const req = new PayrollProcessedLogReq()
        const formValues = form.getFieldsValue();
        if (formValues.payrollMonth) {
            const startMonthYear = formValues.payrollMonth?.format('YYYYMM');
            req.payrollMonth = Number(startMonthYear);
        }
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchId === "ALL") {
            req.branchId = null;
        } else {
            req.branchId = formValues.branchId;
        }
        if (formValues.employeeName) {
            req.employeeId = formValues.employeeName
        }
        if (formValues.divisionId) {
            req.divisionId = formValues.divisionId
        }
        if (formValues.employeeTypeId) {
            req.employeeTypeId = formValues.employeeTypeId
        }
        setLoading(true)
        try {
            service.getPayrollProcessedLog(req).then((res) => {
                if (res.status) {
                    setPayData(res.data)
                    setShowColumns(true);
                    setLoading(false)
                    // message.success(res.internalMessage);
                } else {
                    setPayData([])
                    setLoading(false)
                    setShowColumns(false);
                    message.error(res.internalMessage);
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

    const getPayrollComponentsByOrder = async () => {
        const res = await payrollComponentsSharedService.getPayrollComponentsByOrder()
        setPayrollComponents(res.data)
    }

    const orderMap = payrollComponents?.reduce((acc, item) => {
        acc[item.columnName] = item.columnOrder;
        return acc;
    }, {});

    const generateColumns = (data: any) => {

        const baseColumns = [
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
                dataIndex: "bankAcNo",
                sorter: (a, b) => a.bankAcNo.localeCompare(b.bankAcNo),
                sortDirections: ['ascend', 'descend'],
                ...getColumnSearchProps("bankAcNo"),
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
                align: "center",
            },
            {
                title: "Present",
                dataIndex: "presentCount",
                sorter: (a, b) => a.presentCount - b.presentCount,
                sortDirections: ['ascend', 'descend'],
                align: "center",
            },
            {
                title: "Absent",
                dataIndex: "absentCount",
                sorter: (a, b) => a.absentCount - b.absentCount,
                sortDirections: ['ascend', 'descend'],
                align: "center",
            },
            {
                title: "Leave",
                dataIndex: "leaveCount",
                sorter: (a, b) => a.leaveCount - b.leaveCount,
                sortDirections: ['ascend', 'descend'],
                align: "center",
            },
        ];
        const allComponentKeys = Array.from(new Set(data.flatMap(item =>
            item.componentKeys.map(component => Object.keys(component)[0])
        )));
        const getComponentColumns = (type) => {
            return allComponentKeys.map(key => {
                const componentType = componentData.find(rec => rec.columnName === key)?.componentType;
                if (componentType === type) {
                    return {
                        title: key,
                        dataIndex: key,
                        key,
                        align: "center",
                        render: (text) => text ? text : '-'
                    };
                }
                return null;
            }).filter(Boolean);
        };
        const earningColumns = getComponentColumns('EARNING');
        const deductionColumns = getComponentColumns('DEDUCTION');
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

        // const TotalDeductionColumn = allComponentKeys.filter(key => key === 'Total Deductions' || key === 'Net Payable').map(key => ({
        //     title: key,
        //     dataIndex: key,
        //     key,
        // }));
        const TotalDeductionColumn = allComponentKeys
            .filter(key => key === 'Total Deductions' || key === 'Net Payable')
            .map(key => ({
                title: key,
                dataIndex: key,
                key,
                render: (value) => (isNaN(value) || value === null || value === undefined ? '-' : value)
            }));
        const groupedEarningColumns = earningColumns.length > 0 ? [{
            title: 'Earnings',
            children: earningColumns,
            align: "center",
        }] : [];
        // const groupedDeductionColumns = deductionColumns.length > 0 ? [{
        //     title: 'Deductions',
        //     children: deductionColumns,
        //     align: "center",
        // }] : [];
        const groupedDeductionColumns = deductionColumns.length > 0 ? [{
            title: 'Deductions',
            align: "center",
            children: deductionColumns.map(column => ({
                ...column,
                render: (value) => (isNaN(value) || value === null || value === undefined ? '-' : value)
            }))
        }] : [];
        return [
            ...baseColumns,
            ...grossColumn,
            ...groupedEarningColumns,
            ...TotalEarningsColumn,
            ...groupedDeductionColumns,
            ...TotalDeductionColumn
        ];
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
        const dataSource = activeKey === "1" ? bankNetPayable : activeKey === "2" ? cashNetPayable : negativeNetPayable;
        const firstTab = orginalSumPostivie;
        const columnKeys = columns.flatMap(col =>
            col.children ? col.children.map(child => child.dataIndex || child.title) : col.dataIndex || col.title
        ).filter(Boolean);
        const summaryRow = columnKeys.reduce((acc, key) => {
            let value = "-";
            if (["payDays", "presentCount", "absentCount", "leaveCount"].includes(key)) {
                const formattedKey = `total${key.charAt(0).toUpperCase() + key.slice(1)}`;
                value = firstTab?.[formattedKey] || "-";
            } else if (firstTab?.componentSum?.[key] !== undefined) {
                value = firstTab.componentSum[key];
            }
            return { ...acc, [key]: value };
        }, {});
        const finalDataSource = [...dataSource, summaryRow];
        const excel = new Excel();
        excel
            .addSheet('Payroll-Processed-Report')
            .addColumns(columns)
            .addDataSource(finalDataSource, { str2num: false })
            .saveAs('Payroll-Processed-report.xlsx');
    };

    const getBranches = async () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data);
            } else {
                message.error(res.internalMessage || 'Failed to fetch branches.');
            }
        }).catch((err) => {
            console.error('Error:', err);
            message.error('An error occurred while fetching branches.');
        });
    }

    const handleFreezeStatus = async (freezeStatus: 0 | 1) => {
        try {
            const yearAndMonth = form.getFieldValue("payrollMonth");
            if (!yearAndMonth) {
                return console.error("Please select a date before freezing/unfreezing.");
            }
            const formattedDate = dayjs(yearAndMonth).format("YYYYMM");
            const req = { month: formattedDate, freezeStatus };
            setLoading(true);
            const res = await payAttendanceService.updatePayRollFreezeStatus(req);
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage)
                console.log(res.internalMessage)
            } else {
                console.error("Freeze/Unfreeze operation failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns: any = generateColumns(payData);
    const dataSource = generateDataSource(payData);
    const bankData = payData.filter(record => record.holdStatus == 0 && record.payMode == 'Bank');
    const cashData = payData.filter(record => record.holdStatus == 0 && record.payMode == 'Cash');
    const holdData = payData.filter(record => record.holdStatus == 1);

    const countOfPositiveData = payData.filter(record => (record.holdStatus == 0));
    let totalPayDays = 0; let totalPresentCount = 0; let totalAbsentCount = 0; let totalLeaveCount = 0; let componentSum = {};

    countOfPositiveData.forEach(record => {
        totalPayDays += Number(record.payDays) || 0
        totalPresentCount += Number(record.presentCount) || 0
        totalAbsentCount += Number(record.absentCount) || 0
        totalLeaveCount += Number(record.leaveCount) || 0
        record.componentKeys.forEach(component => {
            Object.entries(component).forEach(([key, value]) => {
                if (!isNaN(Number(value))) {
                    componentSum[key] = (componentSum[key] || 0) + Number(value);
                }
            })
        })
    })
    const orginalSumPostivie = { totalPayDays, totalPresentCount, totalAbsentCount, totalLeaveCount, componentSum }
    const bankNetPayable = generateDataSource(bankData);
    const cashNetPayable = generateDataSource(cashData);
    const negativeNetPayable = generateDataSource(holdData);

    const handleFreezeConfirmation = () => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you really want to freeze the payroll?",
            okText: "OK",
            cancelText: "Cancel",
            onOk: () => handleFreezeStatus(1), // Calls function on confirmation
            onCancel: () => console.log("Action cancelled"),
        });
    };

    const handleUnFreezeConfirmation = () => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you really want to un-freeze the payroll?",
            okText: "OK",
            cancelText: "Cancel",
            onOk: () => handleFreezeStatus(0), // Calls function on confirmation
            onCancel: () => console.log("Action cancelled"),
        });
    };

    return (
        <Card title={'Payroll Processed Log Report'}
            extra={<Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>}>
            <Form layout='vertical' form={form} onFinish={getPayrollProcessedLog}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8} lg={2} xl={5}>
                        <Form.Item
                            name="branchId"
                            label="Branch"
                            rules={[{ required: true, message: 'Please select a branch!' }]}
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={role === 'SuperAdmin' ? false : true}
                                placeholder="Select a Branch"
                                filterOption={(input, option) =>
                                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={handleBranchChange}
                                options={branchesMappingData
                                    .reduce((acc, branch) => {
                                        if (!acc.some((b) => b.value === branch.branchId)) {
                                            acc.push({ label: branch.branchName, value: branch.branchId });
                                        }
                                        return acc;
                                    }, [] as { label: string; value: number }[])
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label='Month' name='payrollMonth' rules={[{ required: true, message: 'Please Select Month!' }]}>
                            <DatePicker picker="month" style={{ width: "100%" }} placeholder='Select Month' />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label="Division" name="divisionId">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select Division"
                                optionFilterProp="children"
                                mode='multiple'
                            >
                                {filteredDivisions.map((rec) => (
                                    <Select.Option value={rec.id} key={rec.id}>
                                        {rec.divisionName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='Employee Type' name='employeeTypeId'>
                            <Select placeholder='Select Employee Type' allowClear showSearch
                                optionFilterProp="children"
                            >
                                {employeeTypes?.map((rec: any) => {
                                    return <Option value={rec.id} key={rec.id}>{rec.name}</Option>
                                })}
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
                </Row>
                <Row gutter={8}>
                    <Col span={2}>
                        <Button type='primary' htmlType='submit' onClick={getPayrollProcessedLog} variant="outlined" color="primary">Submit</Button>
                    </Col>
                    <Col span={2}>
                        <Button danger onClick={onReset}>Reset</Button>
                    </Col>
                    {showColumns && (
                        <>
                            <Col span={2}>
                                <Button type="primary" style={{ backgroundColor: '#3cc943', width: 80 }} onClick={handleFreezeConfirmation}>Freeze</Button>&nbsp;
                            </Col>
                            &nbsp;&nbsp;
                            <Col span={2}>
                                <Button type="primary" style={{ backgroundColor: '#db5e30', width: 80 }} onClick={handleUnFreezeConfirmation}>Un-Freeze</Button>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>

            {showColumns && (
                <>
                    <br />
                    <Card>
                        <Tabs defaultActiveKey="1" onChange={key => setActiveKey(key)}>
                            <TabPane tab="Bank Payroll" key="1">
                                <Table
                                    dataSource={bankNetPayable}
                                    columns={columns}
                                    rowKey="id"
                                    bordered
                                    className="custom-table-wrapper"
                                    scroll={{ x: 2800, y: 450 }}
                                    size="small"
                                    pagination={false}
                                    rowSelection={rowSelection}
                                    summary={() => {
                                        const firstTab = orginalSumPostivie;
                                        const columnKeys = columns.flatMap(col =>
                                            col.children ? col.children.map(child => child.dataIndex || child.title) : col.dataIndex || col.title
                                        ).filter(Boolean);
                                        return (
                                            <Table.Summary.Row className="tableFooter" style={{ backgroundColor: "#f0f2f5", fontWeight: "bold" }}>
                                                <Table.Summary.Cell key="selectionCell" index={1} />
                                                {columnKeys.map((key, index) => {
                                                    let value = "-";
                                                    if (["payDays", "presentCount", "absentCount", "leaveCount"].includes(key)) {
                                                        const formattedKey = `total${key.charAt(0).toUpperCase() + key.slice(1)}`;
                                                        value = firstTab?.[formattedKey];
                                                    } else if (firstTab?.componentSum?.[key] !== undefined) {
                                                        value = firstTab.componentSum[key];
                                                    }
                                                    return (
                                                        <Table.Summary.Cell
                                                            key={key}
                                                            index={index}
                                                            align="center"
                                                        >
                                                            {value}
                                                        </Table.Summary.Cell>
                                                    );
                                                })}
                                            </Table.Summary.Row>
                                        );
                                    }}
                                />
                                <Button
                                    type="primary"
                                    onClick={handleHold}
                                    style={{ marginTop: 16 }}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Hold Payroll
                                </Button>
                            </TabPane>
                            <TabPane tab="Cash Payroll" key="2">
                                <Table
                                    dataSource={cashNetPayable}
                                    columns={columns}
                                    rowKey="id"
                                    bordered
                                    className="custom-table-wrapper"
                                    scroll={{ x: 2800, y: 450 }}
                                    size="small"
                                    pagination={false}
                                    rowSelection={rowSelection}
                                // summary={() => {
                                //     const firstTab = {
                                //         totalPayDays: totalPayDays,  // You can derive this value from cashNetPayable or use the aggregated data
                                //         totalPresentCount: totalPresentCount,
                                //         totalAbsentCount: totalAbsentCount,
                                //         totalLeaveCount: totalLeaveCount,
                                //         componentSum: componentSum // Assuming componentSum is calculated separately for cash payroll
                                //     };;
                                //     const columnKeys = columns.flatMap(col =>
                                //         col.children ? col.children.map(child => child.dataIndex || child.title) : col.dataIndex || col.title
                                //     ).filter(Boolean);
                                //     return (
                                //         <Table.Summary.Row className="tableFooter" style={{ backgroundColor: "#f0f2f5", fontWeight: "bold" }}>
                                //             <Table.Summary.Cell key="selectionCell" index={1} />
                                //             {columnKeys.map((key, index) => {
                                //                 let value = "-";
                                //                 if (["payDays", "presentCount", "absentCount", "leaveCount"].includes(key)) {
                                //                     const formattedKey = `total${key.charAt(0).toUpperCase() + key.slice(1)}`;
                                //                     value = firstTab?.[formattedKey];
                                //                 } else if (firstTab?.componentSum?.[key] !== undefined) {
                                //                     value = firstTab.componentSum[key];
                                //                 }
                                //                 return (
                                //                     <Table.Summary.Cell
                                //                         key={key}
                                //                         index={index}
                                //                         align="center"
                                //                     >
                                //                         {value}
                                //                     </Table.Summary.Cell>
                                //                 );
                                //             })}
                                //         </Table.Summary.Row>
                                //     );
                                // }}
                                />
                                <Button
                                    type="primary"
                                    onClick={handleHold}
                                    style={{ marginTop: 16 }}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Hold Payroll
                                </Button>
                            </TabPane>
                            <TabPane tab="On Hold Payroll" key="3">
                                <Table dataSource={negativeNetPayable} columns={columns} rowKey="id" scroll={{ x: 'max-content' }} rowSelection={rowSelection} />
                                <Button
                                    type="primary"
                                    onClick={handleRelease}
                                    style={{ marginTop: 16 }}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Release Payroll
                                </Button>
                            </TabPane>
                        </Tabs>
                    </Card>
                </>
            )}
        </Card>
    )
}

export default PayrollProcessedLogReport