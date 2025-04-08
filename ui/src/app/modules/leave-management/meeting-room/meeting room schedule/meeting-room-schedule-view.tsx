import { CheckOutlined, CloseOutlined, PlusOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { RolesEnum, ScheduleStatus } from '@hrexpert/shared-models';
import { MettingRoomService } from '@hrexpert/shared-services';
import { Button, DatePicker, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import { FilterDropdownProps } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import MeetingRoomSchedule from './meeting-room-schedule';

export default function MeetingRoomScheduleView() {
    const [data, setData] = useState<any>();
    const [isModalVisible, setIsModalVisible] = useState(false); // state to control modal visibility
    const service = new MettingRoomService();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isApprover = currentUser.role === RolesEnum.Approver;
    const [page, setPage] = useState(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState<any>();
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null); // Track selected date

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        service.getMeetingSchedules().then((res) => {
            if (res.status) {
                setData(res.data);
            }
        });
    };

    const handleApprove = async (id: number) => {
        const scheduleToApprove = data.find((item) => item.id === id);
        const response = await service.updateScheduleStatus({
            id: id,
            approveStatus: ScheduleStatus.APPROVED,
        });
        if (response.status) {
            message.success("Schedule approved successfully");
            getData();
            updateLocalData(id, ScheduleStatus.APPROVED);
        } else {
            message.error("Failed to approve schedule");
        }
    };

    const handleReject = async (id: number) => {
        const response = await service.updateScheduleStatus({
            id: id,
            approveStatus: ScheduleStatus.CANCELED,
        });

        if (response.status) {
            message.success("Schedule rejected successfully");
            getData();
            updateLocalData(id, ScheduleStatus.CANCELED);
        } else {
            message.error("Failed to reject schedule");
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


    const getColumnSearchProps = (dataIndex: string | string[], title: string): ColumnType<any> => ({
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
        onFilter: (value, record) => {
            // Handle nested values
            const getNestedValue = (obj: any, path: string | string[]) => {
                return Array.isArray(path)
                    ? path.reduce((acc, key) => (acc ? acc[key] : undefined), obj)
                    : obj[path];
            };

            const nestedValue = getNestedValue(record, dataIndex);
            return nestedValue
                ? nestedValue.toString().toLowerCase().includes((value as string).toLowerCase())
                : false;
        },
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
            title: 'S No',
            key: 'sno',
            width: '70px',
            align: "center",
            render: (text, object, index) => (page - 1) * 10 + (index + 1)
        },
        // {
        //     title: 'Booking Number',
        //     align: 'center',
        //     dataIndex: 'id',
        //     // ...getColumnSearchProps('id','Booking Number'),
        // },
        {
            title: 'Room',
            align: 'center',
            dataIndex: ['room', 'meetingRoom'],
            ...getColumnSearchProps(['room', 'meetingRoom'], 'Room'),
        },
        {
            title: 'Start time',
            align: 'center',
            dataIndex: 'startTime',
            // render: (v: any) => dayjs(v).format('DD-MM-YYYY HH:mm'),
            ...getColumnSearchPropsDateOfBirth('startTime', "Start Time")
        },
        {
            title: 'End time',
            align: 'center',
            dataIndex: 'endTime',
            // render: (v: any) => dayjs(v).format('DD-MM-YYYY HH:mm'),
            ...getColumnSearchPropsDateOfBirth('endTime', "End time")
        },
        {
            title: 'Purpose',
            align: 'center',
            dataIndex: 'purpose',
            ...getColumnSearchProps('purpose', 'Purpose')
        },
        {
            title: 'Approval Status',
            dataIndex: 'approveStatus',
            align: 'center',
            render: (text: string) => {
                if (text === 'Open') {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Tooltip title="Pending">
                                <Tag style={{ fontSize: 12 }} color='orange' >
                                    Pending
                                </Tag>
                            </Tooltip>
                        </div>
                    );
                }

                if (text === 'Approved') {
                    return (
                        <Tag style={{ fontSize: 12 }} color="green" >
                            <CheckOutlined /> Approved
                        </Tag>
                    );
                }

                if (text === 'Canceled') {
                    return (
                        <Tag style={{ fontSize: 12 }} color="red" >
                            <CloseOutlined /> Rejected
                        </Tag>
                    );
                }

                if (text === 'No Show') {
                    return (
                        <Tag style={{ fontSize: 12 }} color="red">
                            <WarningOutlined /> No Show
                        </Tag>
                    );
                }

                return text;
            },
        },
        {
            title: 'Action',
            render: (v: any, record: any) => {
                const roomApprover = v.room.roomApprover; // Access the roomApprover for each schedule
                const currentUserRole = currentUser.role; // Get the current user's role
                // Check if the current user's role matches the room approver
                const hasApprovalAccess = roomApprover === currentUserRole || (roomApprover === RolesEnum.User && currentUserRole === RolesEnum.User);
                return (
                    <Space>
                        {hasApprovalAccess && (
                            <Button type='primary' onClick={() => handleApprove(record.id)} >Approve</Button>
                        )}
                        <Popconfirm
                            title="Are you sure to Cancel?"
                            onConfirm={() => handleReject(record.id)}
                            okText="Yes"
                            cancelText="No">
                            <Button color="danger" variant="outlined" >Cancel</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    // Function to open the modal
    const openModal = () => {
        setIsModalVisible(true);
    };

    // Function to handle closing the modal
    const handleCancel = () => {
        setIsModalVisible(false);
        getData();
    };

    return (
        <PageContainer title="Schedule" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
                Add
            </Button>
        }>
            <Table columns={columns} dataSource={data}
                pagination={{
                    onChange(current) {
                        setPage(current);
                    },
                    position: ['topRight'],
                }} />

            <Modal
                title={`Add New Schedule`}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            // key={Date.now()}
            >
                <MeetingRoomSchedule selectedDate={null} closeModal={handleCancel} getData={data} selectedRoom={undefined} selectedTimeRange={null} />
            </Modal>
        </PageContainer>
    );
}
