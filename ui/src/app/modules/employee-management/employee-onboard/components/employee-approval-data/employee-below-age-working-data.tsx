import { SearchOutlined } from '@ant-design/icons';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Input, message, Table, Typography } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { Space } from 'antd/lib';
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import Highlighter from 'react-highlight-words';

const { Title } = Typography;

const EmployeeBelowAgeWorkingData = () => {
    const service = new EmployeeOnboardingService();
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);

    useEffect(() => {
        getAllEmpBelowAgeWorkingData();
    }, []);

    const getAllEmpBelowAgeWorkingData = () => {
        try {
            service.getAllEmpBelowAgeWorkingData().then((res) => {
                if (res.status) {
                    // Filter employees below 18 years old
                    const filteredData = res.data.filter((employee: any) => {
                        const birthDate = moment(employee.dateOfBirth);
                        const currentDate = moment(); // Current date/time
                        const age = currentDate.diff(birthDate, 'years'); // Difference in years
                        return age < 18; // Return only employees below 18 years old
                    });
                    setData(filteredData); // Set the filtered data
                } else {
                    message.error("Failed to retrieve Employee Data");
                }
            });
        } catch (error) {
            console.log(error);
            message.error("An error occurred while fetching employee data.");
        }
        setLoading(false); // Stop loading
    };

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

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center",
        },
        {
            title: "Employee Type",
            dataIndex: "employeeType",
            align: "center",
            ...getColumnSearchProps('employeeType')
        },
        {
            title: "Employee Id",
            dataIndex: "id",
            sorter: (a, b) => a.id.localeCompare(b.id),
            sortDirections: ["ascend", "descend"],
            align: "center",
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
            align: "center",
            ...getColumnSearchProps('employeeType')
        },
        {
            title: "Employee Name",
            dataIndex: "firstName",
            align: "center",
            ...getColumnSearchProps('firstName'),
            render: (text: string, record: any) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: "Date of Birth",
            dataIndex: "dateOfBirth",
            align: "center",
            render: (date: string) => {
                if (!date) return "N/A";
        
                // Format the date
                const formattedDate = moment(date).format("DD/MM/YYYY");
        
                // Calculate the detailed age
                const birthDate = moment(date);
                const now = moment();
                const years = now.diff(birthDate, "years"); // Get years
                birthDate.add(years, "years"); // Add years back to the birthDate
                const months = now.diff(birthDate, "months"); // Get months
                birthDate.add(months, "months"); // Add months back to the birthDate
                const days = now.diff(birthDate, "days"); // Get remaining days
        
                return `${formattedDate} (${years}Y${months}M${days}D)`;
            },
        },
        
        {
            title: "Branch Name",
            dataIndex: "branch",
            align: "center",
            ...getColumnSearchProps('branch')
        },
        {
            title: "Department",
            dataIndex: "department",
            align: "center",
            ...getColumnSearchProps('department')
        },
        {
            title: "Designation",
            dataIndex: "designation",
            align: "center",
            ...getColumnSearchProps('designation')
        },
    ];

    return (
        <div>
            <Title level={5}>Employees Below 18 Years</Title>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: 10,
                    onChange: (page) => setPage(page),
                }}
            />
        </div>
    );
};

export default EmployeeBelowAgeWorkingData;
