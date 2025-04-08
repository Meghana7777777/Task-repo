import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ApplForLeavesSharedService } from "@hrexpert/shared-services";
import { Button, Input, message, Space, Table } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

export const ExceededLeavesGrid = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const service = new ApplForLeavesSharedService();
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        getExceededData()
    }, []);

    const getExceededData = () => {
        setLoading(true);
        try {
            service.getExceededData().then((res) => {
                if (res.status) {
                    setData(res.data);
                } else {
                    message.error("Failed to retrieve data");
                }
            });
        } catch (error) {
            console.error(error);
            message.error("Error fetching leave data");
        } finally {
            setLoading(false);
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


    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const columnsSkelton: ColumnsType<any> = [
        {
            title: 'S No',
            key: 'sno',
            width: '70px',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        {
            title: 'Employee Code',
            dataIndex: 'empCode',
            align: "center",
            width: '150px',
            sorter: (a, b) => a.empCode?.localeCompare(b.empCode),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("empCode", "Employee Code"),
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            align: "center",
            sorter: (a, b) => a.employeeName?.localeCompare(b.employeeName),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps("employeeName", "Employee Name"),
        },
        {
            title: 'No Of Days',
            dataIndex: 'noOfDays',
            align: "center",
            sorter: (a, b) => a.noOfDays?.localeCompare(b.noOfDays),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Leave Name',
            dataIndex: 'leaveName',
            align: "center",
            ...getColumnSearchProps("leaveName", "Leave Name"),
        },
        {
            title: 'Leave Reason',
            dataIndex: 'leaveReason',
            align: "center",
        },
        {
            title: 'Available Leaves',
            dataIndex: 'availableLeaves',
            align: "center",
            ...getColumnSearchProps("availableLeaves", "Available Leaves"),
        },
        {
            title: 'Leave Address',
            dataIndex: 'leaveAddress',
            align: "center",
        },
    ];

    return (
        <PageContainer title='Exceeded Leaves' breadcrumbRender={false} extra={
            <Link to="/apply-for-leaves-excel-upload">
                <Button className="panel_button" style={{ color: "black", fontWeight: "bold", borderColor: "black" }}  type="dashed">Apply Leaves</Button>
            </Link>
        }>
            <Table
                columns={columnsSkelton}
                loading={loading}
                size="small"
                dataSource={data}
                scroll={{ x: true }}
                pagination={{
                    onChange(current) {
                        setPage(current);
                    }
                }}
                onChange={onChange}
                bordered />
        </PageContainer>
    );
};

export default ExceededLeavesGrid;
