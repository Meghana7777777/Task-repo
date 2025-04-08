import { SearchOutlined } from '@ant-design/icons';
import { EmpDataReq, PayrollProcessedLogReq, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesMappingSharedService, BranchesService, LeaveAllocationService, PayrollProcessedLogsService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIAMClientState } from '../../../common/iam-client-react';
const Option = Select
interface PFReport {
    scopes: ScopesEnum[]
}
const PayrollPFReport = (props: PFReport) => {
    const service = new PayrollProcessedLogsService()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [showColumns, setShowColumns] = useState<boolean>(false);
    const [branches, setBranches] = useState<any>([]);
    const branchesService = new BranchesService();
    const [page, setPage] = React.useState(1);
    const [form] = Form.useForm()
    const branchesMappingService = new BranchesMappingSharedService()
    const leaveAllocationService = new LeaveAllocationService();
    const [employees, setEmployees] = useState<any>([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [branchesMappingData, setBranchesMappingData] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [filteredDivisions, setFilteredDivisions] = useState<{ id: number; divisionName: string }[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);


    useEffect(() => {
        getBranches()
        getBranchMapping()
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branches: "ALL" })
        } else {
            form.setFieldsValue({ branches: IAMClientAuthContext.user.unitId })
        }
    }, [props.scopes])

    const getAllActiveEmpDropDown = async (branchId) => {
        const req = new EmpDataReq(undefined, undefined, undefined, undefined, undefined, branchId);
        const res = await leaveAllocationService.getAllActiveEmpDropDown(req);
        setEmployees(res?.status ? res.data : []);
    };

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
        getAllActiveEmpDropDown(branchId);
        const uniqueDivisions = Array.from(
            new Map(
                branchesMappingData
                    .filter(branch => branch.branchId === branchId)
                    .map(branch => [branch.divisionId, { id: branch.divisionId, divisionName: branch.divisionName }])
            ).values()
        );
        setFilteredDivisions(uniqueDivisions);
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
        });
    }

    const getPayrollEsiReport = () => {
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
        if (formValues.departmentId) {
            req.departmentId = formValues.departmentId
        }
        if (formValues.employeeTypeId) {
            req.employeeTypeId = formValues.employeeTypeId
        }
        setLoading(true)
        try {
            service.getPayrollEsiReport(req).then((res) => {
                if (res.status) {
                    setData(res.data)
                    setShowColumns(true);
                    setLoading(false)
                } else {
                    setData([])
                    setLoading(false)
                    setShowColumns(false);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<any> => ({
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
        onFilter: (value, record) => {
            const keys = dataIndex.split(".");
            let nestedValue = record;
            keys.forEach((key) => {
                nestedValue = nestedValue ? nestedValue[key] : null;
            });
            return nestedValue
                ? nestedValue.toString().toLowerCase().includes((value as string).toLowerCase())
                : false;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
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
    })
    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }
    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }


    const columns: any = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: 'Emp ID',
            dataIndex: 'employeeCode',
            render: (text) => (text ? text : '-'),
            align: "center",
            ...getColumnSearchProps('employeeCode', 'Emp ID')
        },
        {
            title: 'UAN',
            dataIndex: 'uan',
            render: (text) => (text ? text : '-'),
            align: "center",
            ...getColumnSearchProps('uan', 'UAN')
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            render: (text) => (text ? text : '-'),
            align: "center",
            ...getColumnSearchProps('employeeName', 'Employee Name')
        },
        {
            title: 'Pay Days',
            dataIndex: 'payDays',
            render: (text) => (text ? text : '-'),
            align: "center",
            ...getColumnSearchProps('payDays', 'Pay Days')
        },
        {
            title: 'Employee Contributions',
            children: [
                {
                    title: 'PF Earnings',
                    dataIndex: 'pfEarnings',
                    render: (text, record) => {
                        const componentData = JSON.parse(record.componentRecords || '{}');
                        const basicSalary = componentData['BASIC'] || componentData['Basic'] || 0;
                        const pfEarnings = (basicSalary * 12) / 100;
                        return pfEarnings || '-';
                    },
                    align: "center",
                },
                {
                    title: 'Contribution EPF',
                    dataIndex: 'componentRecords',
                    render: (text, record) => {
                        const componentData = JSON.parse(record.componentRecords || '{}')
                        return componentData['PF-Employee'] || '-'
                    },
                    align: "center",
                }
            ]
        },
        {
            title: 'Employer Contributions',
            children: [
                {
                    title: 'EPF Diff',
                    dataIndex: 'epfDiff',
                    render: (text, record) => {
                        const componentData = JSON.parse(record.componentRecords || '{}');
                        const pfEmp = componentData['PF-Employee'] || 0;
                        const finalPfEmp = (pfEmp * 8.33) / 100;
                        const epfDiff = pfEmp - finalPfEmp
                        return (epfDiff).toFixed(2) || '-';
                    },
                    align: "center",
                },
                {
                    title: 'Pension Fund 8.33%',
                    dataIndex: 'pensionFund',
                    render: (text, record) => {
                        const componentData = JSON.parse(record.componentRecords || '{}');
                        const pfEmp = componentData['PF-Employee'] || 0;
                        const pensionFund = (pfEmp * 8.33) / 100;
                        return (pensionFund).toFixed(2) || '-';
                    },
                    align: "center",
                }
            ]
        }
    ];

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({ branchId: 'ALL' })
        setData([])
    }

    const totalPfEarnings = data.reduce((sum, record) => {
        const componentData = JSON.parse(record.componentRecords || '{}');
        const basicSalary = componentData['BASIC'] || componentData['Basic'] || 0;
        return sum + (basicSalary * 12) / 100;
    }, 0);

    const totalContributionEpf = data.reduce((sum, record) => {
        const componentData = JSON.parse(record.componentRecords || '{}');
        return sum + (parseFloat(componentData['PF-Employee']) || 0);
    }, 0);

    const totalEpfDiff = data.reduce((sum, record) => {
        const componentData = JSON.parse(record.componentRecords || '{}');
        const pfEmp = componentData['PF-Employee'] || 0;
        const finalPfEmp = (pfEmp * 8.33) / 100;
        return sum + (pfEmp - finalPfEmp);
    }, 0);

    const totalPensionFund = data.reduce((sum, record) => {
        const componentData = JSON.parse(record.componentRecords || '{}');
        const pfEmp = componentData['PF-Employee'] || 0;
        return sum + (pfEmp * 8.33) / 100;
    }, 0);

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("PF Report");
        const table = document.querySelector(".ant-table-content table") as HTMLTableElement;
        if (!table) {
            console.error("Table not found!");
            return;
        }
        const rows = table.getElementsByTagName("tr");
        let maxCols = 0;
        const mergeCells = [];
        let headerProcessed = false;
        let headerRowCount = 0;

        for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
            const htmlRow = rows[rowIdx];
            const headerCells = htmlRow.getElementsByTagName("th");

            if (headerCells.length > 0 && !headerProcessed) {
                const row = worksheet.addRow([]);
                let colIndex = 1;
                headerRowCount++;
                for (let cellIdx = 0; cellIdx < headerCells.length; cellIdx++) {
                    const cell = headerCells[cellIdx];
                    const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
                    const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
                    let cellValue = cell.innerText.trim();

                    const excelCell = row.getCell(colIndex);
                    excelCell.value = cellValue;
                    excelCell.font = { bold: true, color: { argb: "FFFFFF" } };
                    excelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "006400" } };
                    excelCell.alignment = { vertical: "middle", horizontal: "center" };
                    excelCell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };

                    if (rowspan > 1 || colspan > 1) {
                        mergeCells.push({ row: rowIdx + 1, col: colIndex, rowspan, colspan });
                    }
                    colIndex += colspan;
                }
                maxCols = Math.max(maxCols, colIndex - 1);
                headerProcessed = true;

                const headerRow2 = worksheet.addRow([
                    "", "", "", "", "",
                    "PF Earnings", "Contribution EPF",
                    "EPF Diff", "Pension Fund 8.33%",
                ]);

                headerRow2.eachCell((cell) => {
                    cell.font = { bold: true, color: { argb: "FFFFFF" } };
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "006400" } };
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            }
        }

        for (let rowIdx = headerRowCount; rowIdx < rows.length - 1; rowIdx++) {
            const htmlRow = rows[rowIdx];
            const cells = htmlRow.getElementsByTagName("td");
            const rowData = Array.from(cells).map(cell => cell.innerText.trim());
            if (rowData.every(value => value === "")) {
                continue;
            }
            const row = worksheet.addRow(rowData);
            for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
                const cell = cells[cellIdx];
                const excelCell = row.getCell(cellIdx + 1);
                excelCell.value = cell.innerText.trim();
                excelCell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }; excelCell.alignment = { vertical: "middle", horizontal: "center" };
                const bgColor = window.getComputedStyle(cell).backgroundColor;
                if (bgColor !== "rgba(0, 0, 0, 0)") {
                    const rgb = bgColor.match(/\d+/g);
                    if (rgb) {
                        const hexColor = rgb
                            .map((x) => parseInt(x).toString(16).padStart(2, "0"))
                            .join("")
                            .toUpperCase();

                        excelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: hexColor } };
                    }
                }
                const cellValue = parseFloat(cell.innerText);
                if (!isNaN(cellValue)) {
                    if (cellValue > 0) {
                        excelCell.font = { color: { argb: "000000" } }
                    } else if (cellValue < 0) {
                        excelCell.font = { color: { argb: "000000" } }
                    }
                }
            }
        }
        const totalRow = worksheet.addRow([]);
        const totalCell = totalRow.getCell(1);
        totalCell.value = "Grand Total";
        totalCell.font = { bold: true };
        totalCell.alignment = { vertical: "middle", horizontal: "center" };
        totalCell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        worksheet.mergeCells(totalRow.number, 1, totalRow.number, 5);
        const pfTotalEarnings = totalRow.getCell(6);
        pfTotalEarnings.value = (totalPfEarnings).toFixed(2)
        pfTotalEarnings.font = { bold: true };
        pfTotalEarnings.alignment = { vertical: "middle", horizontal: "center" };

        const pfTotalContributionEpf = totalRow.getCell(7);
        pfTotalContributionEpf.value = (totalContributionEpf).toFixed(2)
        pfTotalContributionEpf.font = { bold: true };
        pfTotalContributionEpf.alignment = { vertical: "middle", horizontal: "center" };

        const pfTotalEpfDiff = totalRow.getCell(8);
        pfTotalEpfDiff.value = (totalEpfDiff).toFixed(2)
        pfTotalEpfDiff.font = { bold: true };
        pfTotalEpfDiff.alignment = { vertical: "middle", horizontal: "center" };

        const pfTotalPensionFund = totalRow.getCell(9);
        pfTotalPensionFund.value = (totalPensionFund).toFixed(2)
        pfTotalPensionFund.font = { bold: true };
        pfTotalPensionFund.alignment = { vertical: "middle", horizontal: "center" };

        mergeCells.forEach(({ row, col, rowspan, colspan }) => {
            worksheet.mergeCells(row, col, row + rowspan - 1, col + colspan - 1);
        });
        for (let i = 1; i <= maxCols; i++) {
            worksheet.getColumn(i).width = 15;
        }
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "PF_Report.xlsx");

    };


    return (
        <Card title={'PF Report'}
            extra={
                <Button style={{
                    border: "1px dashed #22f534",
                    color: "green",
                    fontWeight: "bold",
                }}
                    type="dashed"
                    onClick={handleExportExcel}>Get Excel</Button>
            }
        >
            <Form layout='vertical' onFinish={getPayrollEsiReport} form={form}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8} lg={2} xl={6}>
                        <Form.Item
                            name="branchId"
                            label="Branch"
                            rules={[{ required: true, message: 'Select Branch' }]}
                        >
                            <Select
                                allowClear
                                showSearch
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

                    <Col span={4}>
                        <Form.Item label='Date' name='payrollMonth'
                            rules={[{ required: true, message: 'Select Date' }]}>
                            <DatePicker picker="month" style={{ width: "100%" }} placeholder='Select Month' />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
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
                    <Col span={4}>
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

                </Row>
                <Row gutter={8}>
                    <Col span={2}>
                        <Button type='primary' htmlType='submit' variant="outlined" color="primary">Submit</Button>
                    </Col>
                    <Col span={2}>
                        <Button danger onClick={onReset}>Reset</Button>
                    </Col>
                </Row>
            </Form>

            {showColumns && (
                <>
                    <br />
                    {data.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={data}
                            size="small"
                            bordered
                            scroll={{ x: 'max-content' }}
                            pagination={false}
                            summary={() => (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={5} align="center">
                                        <strong style={{ float: "left" }}>Grand Total</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="center">
                                        <strong>{(totalPfEarnings).toFixed(2)}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="center">
                                        <strong>{totalContributionEpf}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="center">
                                        <strong>{(totalEpfDiff).toFixed(2)}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="center">
                                        <strong>{(totalPensionFund).toFixed(2)}</strong>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    ) : null}
                </>
            )}
        </Card>
    )
}

export default PayrollPFReport