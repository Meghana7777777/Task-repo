import { CheckOutlined, CloseOutlined, SearchOutlined, WarningOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ScheduleStatus } from "@hrexpert/shared-models";
import { MettingRoomService } from "@hrexpert/shared-services";
import { Button, DatePicker, Input, message, Space, Table, Tabs, Tag } from "antd";
import { ColumnType } from "antd/es/table";
import { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

const ApprovalScreen = () => {
    const [data, setData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<ScheduleStatus>(ScheduleStatus.OPEN);
    const existing = JSON.parse(localStorage.getItem('currentUser') || "{}") || {}
    const service = new MettingRoomService();
    const [page, setPage] = useState(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        service.getMeetingSchedules().then((res) => {
            console.log('Response from backend:', res);
            if (res.status) {
                setData(res.data || []);
            } else {
                console.error('Failed to fetch data:', res);
            }
        }).catch((error) => {
            console.error('Error fetching schedules:', error);
        });
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
                    style={{ marginBottom: 8, display: 'block' }}
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
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
                : false,
    });

    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText('');
    }
    const getColumnSearchPropsDateOfBirth = (dataIndex, title) => {

        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
                <>
                    <div style={{ padding: 5 }} onKeyDown={(e) => e.stopPropagation()}>
                        <DatePicker
                            value={selectedDate}
                            placeholder={`Search ${title}`}
                            style={{ width: 180 }}
                            format="DD/MM/YYYY"
                            onChange={(date) => {
                                setSelectedDate(date)
                                setSelectedKeys(date ? [dayjs(date).format('YYYY-MM-DD')] : []);
                            }}
                        />
                    </div>
                    <div style={{ padding: 5 }}>
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                                icon={<SearchOutlined />}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Search
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedDate(null)
                                    setSelectedKeys([])
                                    clearFilters && clearFilters()
                                    confirm({ closeDropdown: true })
                                    setSearchedColumn(null)
                                    setSearchText('')
                                }}
                                size="small"
                                style={{ width: 90 }}
                            >
                                Reset
                            </Button>
                        </Space>
                    </div>
                </>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                dayjs(record[dataIndex]).isValid() && dayjs(record[dataIndex]).format('YYYY-MM-DD') === value,
            render: (text, record) =>
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={dayjs(record[dataIndex]).isValid() ? dayjs(record[dataIndex]).format('DD/MM/YYYY HH:mm') : '-'}
                    />
                ) : (
                    dayjs(record[dataIndex]).isValid() ? dayjs(record[dataIndex]).format('DD/MM/YYYY HH:mm') : '-'
                ),
        }
    }



    const columns: any = [
        {
            title: "Room",
            align: "center",
            dataIndex: ["room", "meetingRoom"],
            ...getColumnSearchProps('room', 'Room'),
        },
        {
            title: "Start time",
            align: "center",
            dataIndex: "startTime",
            ...getColumnSearchPropsDateOfBirth('startTime', "Start Time")
        },
        {
            title: "End time",
            align: "center",
            dataIndex: "endTime",
            ...getColumnSearchPropsDateOfBirth('endTime', "End time")
        },
        {
            title: "Purpose",
            align: "center",
            dataIndex: "purpose",
            ...getColumnSearchProps('purpose', 'Purpose')
        },
        {
            title: "Action",
            align: "center",
            key: "action",
            render: (text: any, record: any) => {
                const isOpen = record.approveStatus === ScheduleStatus.OPEN;
                const isApproved = record.approveStatus === ScheduleStatus.APPROVED;
                const isRejected = record.approveStatus === ScheduleStatus.CANCELED;

                return (
                    <span>
                        {activeTab === ScheduleStatus.OPEN && isOpen && (
                            <>
                                <Tag
                                    color="green"
                                    onClick={() => handleApprove(record.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <CheckOutlined /> Approve
                                </Tag>
                                <Tag
                                    color="red"
                                    onClick={() => handleReject(record.id)}
                                    style={{ cursor: "pointer", marginLeft: 8 }}
                                >
                                    <CloseOutlined /> Reject
                                </Tag>
                            </>
                        )}

                        {activeTab === ScheduleStatus.APPROVED && isApproved && (
                            <>
                                <Tag
                                    color="blue"
                                    onClick={() => handleOpen(record.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    Open
                                </Tag>
                                <Tag
                                    color="red"
                                    onClick={() => handleReject(record.id)}
                                    style={{ cursor: "pointer", marginLeft: 8 }}
                                >
                                    <CloseOutlined /> Cancel
                                </Tag>
                                <Tag
                                    color="orange"
                                    onClick={() => handleNoShow(record.id)}
                                    style={{ cursor: "pointer", marginLeft: 8 }}
                                >
                                    <WarningOutlined /> No Show
                                </Tag>
                            </>
                        )}

                        {activeTab === ScheduleStatus.CANCELED && isRejected && (
                            <Tag
                                color="blue"
                                onClick={() => handleOpen(record.id)}
                                style={{ cursor: "pointer" }}
                            >
                                Open
                            </Tag>
                        )}
                    </span>
                );
            },
        },
    ];

    const filterDataByStatus = (status: ScheduleStatus) => {
        return data.filter(
            (item) => item.approveStatus?.toLowerCase() === status.toLowerCase()
        ) || [];
    };

    const handleApprove = async (id: number) => {
        const scheduleToApprove = data.find((item) => item.id === id);
        const response = await service.updateScheduleStatus({
            id: id,
            approveStatus: ScheduleStatus.APPROVED,
        });
        if (response.status) {
            message.success("Schedule Approved Successfully");
            getData();
            updateLocalData(id, ScheduleStatus.APPROVED);
            setActiveTab(ScheduleStatus.APPROVED); // Navigate to "Approved" tab after approving
        } else {
            message.error("Failed to approve schedule");
        }
    };

    const handleNoShow = async (id: number) => {
        const response = await service.updateScheduleStatus({
            id: id,
            approveStatus: ScheduleStatus.NOSHOW,
        });

        if (response.status) {
            message.success("Schedule No Show Updated");
            getData();
            updateLocalData(id, ScheduleStatus.NOSHOW);
            setActiveTab(ScheduleStatus.NOSHOW);
        } else {
            message.error("Failed to Reject Schedule");
        }
    };

    const handleReject = async (id: number) => {
        const response = await service.updateScheduleStatus({
            id: id,
            approveStatus: ScheduleStatus.CANCELED,
        });

        if (response.status) {
            message.success("Schedule Rejected Successfully");
            getData();
            updateLocalData(id, ScheduleStatus.CANCELED);
            setActiveTab(ScheduleStatus.CANCELED);
        } else {
            message.error("Failed to Reject schedule");
        }
    };

    const handleOpen = async (id: number) => {
        const response = await service.updateScheduleStatus({
            id: id,
            approveStatus: ScheduleStatus.OPEN,
            createdUser: existing.user.userName
        });

        if (response.status) {
            message.success("Schedule Re-Opened Successfully");
            getData();
            updateLocalData(id, ScheduleStatus.OPEN);
            setActiveTab(ScheduleStatus.OPEN); // Navigate to "Open" tab after opening
        } else {
            message.error("Failed to Re-Opened schedule");
        }
    };

    const updateLocalData = (id: number, newStatus: ScheduleStatus) => {
        const updatedData = data.map((item) => {
            if (item.id === id) {
                return { ...item, approveStatus: newStatus };
            }
            return item;
        });
        setData(updatedData);
    };

    return (
        <PageContainer title="Approve Rooms">
            <Tabs
                defaultActiveKey={ScheduleStatus.OPEN}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as ScheduleStatus)}
            >
                <Tabs.TabPane tab={<span>OPEN :  <Tag color="Blue">{filterDataByStatus(ScheduleStatus.OPEN).length}</Tag></span>} key={ScheduleStatus.OPEN}>
                    <Table
                        columns={columns}
                        dataSource={filterDataByStatus(ScheduleStatus.OPEN)}
                        rowKey="id"
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>APPROVED :  <Tag color="Green">{filterDataByStatus(ScheduleStatus.APPROVED).length}</Tag></span>} key={ScheduleStatus.APPROVED}>
                    <Table
                        columns={columns}
                        dataSource={filterDataByStatus(ScheduleStatus.APPROVED)}
                        rowKey="id"
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>REJECTED :  <Tag color="Red">{filterDataByStatus(ScheduleStatus.CANCELED).length}</Tag></span>} key={ScheduleStatus.CANCELED}>
                    <Table
                        columns={columns}
                        dataSource={filterDataByStatus(ScheduleStatus.CANCELED)}

                        rowKey="id"
                    />
                </Tabs.TabPane>
            </Tabs>
        </PageContainer>
    );
};

export default ApprovalScreen;
