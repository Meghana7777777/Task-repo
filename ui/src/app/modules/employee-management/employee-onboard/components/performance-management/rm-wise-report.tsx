import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ScopesEnum } from '@hrexpert/shared-models';
import { EmployeeOnboardingService, PerformanceManagementShareService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, message, Space, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

interface EmployeeRMUpdateProps {
    scopes: ScopesEnum[]
}

const PerformanceRMWiseReport = (props: EmployeeRMUpdateProps) => {
    const [page, setPage] = useState<number>(1);
    const service = new PerformanceManagementShareService();
    const empService: EmployeeOnboardingService = new EmployeeOnboardingService()
    const [data, setData] = useState<any>([]);
    const [form] = Form.useForm();
    const [reportingManagerData, setReportingManagerData] = useState<any>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        getAllReportManager();
        getAllRMData();
    }, []);

    const getAllRMData = async () => {
        try {
            const res = await empService.getAllRMData();
            if (res.status) {
                setReportingManagerData(res.data);
            } else {
                console.error("Failed to fetch reporting managers");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getAllReportManager = async () => {
        try {
            const res = await service.getAllReportingManager();
            if (res.status) {
                setData(res.data);
            } else {
                message.error('Failed to fetch employee data');
            }
        } catch (error) {
            console.error(error);
        }
    };

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
        {
            title: 'S.No',
            key: 'sno',
            render: (_text, _object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: 'Manager ID',
            dataIndex: 'reportingManagerCode',
            ...getColumnSearchProps('reportingManagerCode', 'Manager ID'),
        },
        {
            title: 'Reporting Manager',
            dataIndex: 'reportingManagerName',
            ...getColumnSearchProps('reportingManagerName', 'Reporting Manager')
        },
        {
            title: 'No Of Employees',
            dataIndex: 'employeeCount',
        },
        {
            title: 'Open',
            dataIndex: ['statusCounts', 'openCount'],
        },
        {
            title: 'Self Saved',
            dataIndex: ['statusCounts', 'employeeSavedCount'],
        },
        {
            title: 'Ready for RM Review',
            dataIndex: ['statusCounts', 'employeeConfirmedCount'],
        },
        {
            title: 'RM Saved',
            dataIndex: ['statusCounts', 'rmsSavedCount'],
        },
        {
            title: 'RM Closed',
            dataIndex: ['statusCounts', 'rmsConfirmedCount'],

        },
    ];

    const exceldata = [
        {
            title: 'Manager ID',
            dataIndex: 'reportingManagerCode',
            render: (text: any, record: any) => { return record.reportingManagerCode ? record.reportingManagerCode : '-' }
        },
        {
            title: 'Reporting Manager',
            dataIndex: 'reportingManagerName',
        },
        {
            title: 'No Of Employees',
            dataIndex: 'employeeCount',
        },
        {
            title: 'Open',
            dataIndex: ['statusCounts', 'openCount'],
        },
        {
            title: 'Self Saved',
            dataIndex: ['statusCounts', 'employeeSavedCount'],
        },
        {
            title: 'Ready for RM Review',
            dataIndex: ['statusCounts', 'employeeConfirmedCount'],
        },
        {
            title: 'RM Saved',
            dataIndex: ['statusCounts', 'rmsSavedCount'],
        },
        {
            title: 'RM Closed',
            dataIndex: ['statusCounts', 'rmsConfirmedCount'],
        },
    ];

    const exportExcel = () => {
        const excel = new Excel();
        const calculateColumnWidths = (columns: IExcelColumn[], data: any[]) =>
            columns.map((col: any) => ({
                ...col,
                width: Math.max(
                    col.title.toString().length,
                    ...data.map((row) => row[col.dataIndex]?.toString().length || 0)
                ) * 10
            }));
        const adjustedColumns = calculateColumnWidths(exceldata, reportingManagerData);
        excel
            .addSheet('RM Status')
            .addColumns(adjustedColumns)
            .addDataSource(reportingManagerData, { str2num: false })
            .saveAs('RM Status Report.xlsx');
    };



    return (
        <PageContainer title="RM Status Report" breadcrumbRender={false}>
            <Form layout="vertical" form={form}>
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
                    >
                        Get Excel
                    </Button>
                </Col>
                <Table
                    columns={columns}
                    dataSource={reportingManagerData}
                    bordered
                    size="small"
                    rowKey="reportingManagerCode"
                    pagination={false}
                />
            </Form>
        </PageContainer>
    );
};

export default PerformanceRMWiseReport;
