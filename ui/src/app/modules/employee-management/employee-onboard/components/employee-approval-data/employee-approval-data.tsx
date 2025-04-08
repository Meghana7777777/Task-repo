import { SearchOutlined } from "@ant-design/icons"
import { EmployeeDetailsDto, EmployeeStatus } from "@hrexpert/shared-models"
import { EmployeeOnboardingService } from "@hrexpert/shared-services"
import { Button, Card, Input, message, Space } from "antd"
import Table, { ColumnsType, ColumnType } from "antd/es/table"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import Highlighter from "react-highlight-words"

const EmployeeApprovalData =()=>{
    const service = new EmployeeOnboardingService()
    const [data,setData] = useState<any>([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const[approveData,setApproveData]=useState<any>([])
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
     
useEffect(()=>{
    getAllEmployeeApprovalData()
    getUpdateEmployeeApprovalData
},[])
    
    
    const getAllEmployeeApprovalData = () => {
        try {
            service.getAllEmployeeApprovalData().then((res) => {
                if (res.status) {
                    // Auto-generate employee codes if missing
                    const updatedData = res.data.map((employee: any) => {
                        if (!employee.employeeCode) {
                            // Generate a default employee code here, based on your logic
                            const employeeCode = generateEmployeeCode(employee);
                            return { ...employee, employeeCode };
                        }
                        return employee;
                    });
                    setData(updatedData); // Update state with new data
                } else {
                    message.error("Failed to retrieve ApprovalData");
                }
            })
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    
    // Function to generate employee code (update based on your requirements)
    const generateEmployeeCode = (employee: any) => {
        const currentYear = new Date().getFullYear();
        const prefix = `${employee.employeeType.substring(0, 1)}${currentYear}`;

        const id = employee.id; // You can use employee ID or any other logic
        return `${prefix}-${id}`;
    };
    

   
    const getUpdateEmployeeApprovalData = async (record: any) => {
        if (!record.employeeCode) {
            message.error("Employee Code is mandatory. Please fill it.");
            return; // Prevent further execution if employeeCode is missing
        }
    
        setLoading(true);
        try {
            // Determine the new employee status based on the current status
            const newStatus = record.approval === EmployeeStatus.LessAgeLimit
                ? EmployeeStatus.LessAgeLimit
                : EmployeeStatus.OnRollEmployee;
    
            // Prepare the request payload
            const req: EmployeeDetailsDto = {
                id: record.id,
                employeeStatus: newStatus,
                employeeCode: record.employeeCode,
            };
    
            // Call the service to update the approval data
            const res = await service.getUpdateEmployeeApprovalData(req);
            if (res.status) {
                message.success("Approval status Created successfully");
                getAllEmployeeApprovalData(); // Refresh data after update
            } else {
                message.error("Failed to update approval status");
            }
        } catch (error) {
            console.error("Error while updating approval data:", error);
            message.error("An error occurred while updating approval data");
        } finally {
            setLoading(false);
        }
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
            title: "EmployeeId",
            dataIndex: "id",
            sorter: (a, b) => a.id.localeCompare(b.id),
            sortDirections: ["ascend", "descend"],
            align: "center",
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
            align: "center",
            ...getColumnSearchProps('employeeCode'),
            render: (text: string | null, record: any) => (
                <Input
                    defaultValue={text}
                    onChange={(e) => {
                        const updatedData = data.map((item: any) =>
                            item.id === record.id
                                ? { ...item, employeeCode: e.target.value }
                                : item
                        );
                        setData(updatedData); 
                    }}
                />
            ),
            width: 150,
        },
        
        {
            title: "EmployeeName",
            dataIndex: "firstName",
            align: "center",
            ...getColumnSearchProps('firstName')
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
        {
            title: "Status",
            dataIndex: "approval",
            align: "center",
            render: (text: string, record: any) => (
                <button
                    onClick={() => getUpdateEmployeeApprovalData(record)}
                    style={{
                        backgroundColor:
                            record.approval === EmployeeStatus.LessAgeLimit
                                ? "#4CAF50"
                                : record.approval === EmployeeStatus.OnRollEmployee
                                ? "#FF5722"
                                : "#1677ff", // Default color for other statuses
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                    }}
                >
                    {record.approval === EmployeeStatus.LessAgeLimit
                        ? "Approve"
                        : record.approval === EmployeeStatus.OnRollEmployee
                        ? "Working"
                        : "Approve"}
                </button>
            ),
        },
    ];

    return(
          <Card><Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    size="small"
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                    }}
                    rowKey="id"
                /></Card>
    )
}

export default EmployeeApprovalData