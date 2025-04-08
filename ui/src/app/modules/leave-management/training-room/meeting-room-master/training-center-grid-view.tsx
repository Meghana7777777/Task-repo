import { AppstoreOutlined, EditOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined, TableOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { meetingRoomActivateDeactivateReq, RoomStatusEnum } from '@hrexpert/shared-models';
import { TrainingCenterSharedService } from '@hrexpert/shared-services';
import { Button, Col, Input, message, Modal, Popconfirm, Row, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import CardView from './card-view';
import MeetingRoomMaster from './training-center-master';

interface MeetingRoomGridIProps { }

const TrainingGrid = (props: MeetingRoomGridIProps) => {
    const [viewMode, setViewMode] = useState<'table' | 'card'>('card'); // Default view is 'card'
    const [open, setOpen] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [mettingRoomData, setMeetingRoomData] = useState<any>([]);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState('');
    const service = new TrainingCenterSharedService();

    const changeviewType = () => {
        setViewMode(viewMode === 'card' ? 'table' : 'card'); // Toggle view mode between 'card' and 'table'
    };

    useEffect(() => {
        getAllMeetingRooms();
    }, []);

    const getAllMeetingRooms = () => {
        setLoading(true);
        try {
            service.getAllMeetingRooms().then((res) => {
                if (res.status) {
                    setMeetingRoomData(res.data);
                    setLoading(false);
                } else {
                    message.error(res.internalMessage);
                }
            });
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const activateOrDeactivateMeetingRoom = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new meetingRoomActivateDeactivateReq(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateMeetingRoom(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllMeetingRooms();
                } else {
                    message.error(res.internalMessage);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        setSelectedData(null);
        setModalVisible(true);
    };

    const editDepartment = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setIsUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
        getAllMeetingRooms();
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

    const getStatusTag = (status: RoomStatusEnum): JSX.Element => {
        switch (status) {
            case RoomStatusEnum.AVAILABLE:
                return <Tag color="green">{RoomStatusEnum.AVAILABLE}</Tag>;
            case RoomStatusEnum.BOOKED:
                return <Tag color="red">{RoomStatusEnum.BOOKED}</Tag>;
            case RoomStatusEnum.Cancelled:
                return <Tag color="orange">{RoomStatusEnum.Cancelled}</Tag>;
            default:
                return <Tag>{status}</Tag>; // Fallback for unexpected status
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: 'Meeting Room',
            dataIndex: 'meetingRoom',
            ...getColumnSearchProps('meetingRoom', "Meeting Room"),
            align: 'center',
            sorter: (a, b) => a.meetingRoom?.localeCompare(b.meetingRoom),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            ...getColumnSearchProps('location', 'Location'),
            align: 'center',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            ...getColumnSearchProps('capacity', 'Capacity'),
            align: 'center',
        },
        {
            title: 'Room Approver',
            dataIndex: 'roomApprover',
            ...getColumnSearchProps('roomApprover', 'Room Approver'),
            align: 'center',
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'roomStatus',
        //     align: 'center',
        //     render: (status, rowData) => {
        //         return getStatusTag(status);
        //     },
        // },
        {
            title: 'Action',
            align: 'center',
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={'editSamplTypeIcon'}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editDepartment(rowData);
                                }
                            }}
                            style={{ color: '#1890ff', fontSize: '14px' }}
                        />
                    ) : (
                        ''
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <Popconfirm
                        onConfirm={(e) => {
                            activateOrDeactivateMeetingRoom(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Deactivate ?'
                                : 'Are you sure to Activate ?'
                        }
                    >
                        <Switch
                            size="default"
                            className={
                                rowData.isActive
                                    ? 'toggle-activated'
                                    : 'toggle-deactivated'
                            }
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />
                    </Popconfirm>
                </span>
            ),
        },
    ];
    const serverUrl = 'http://your-server/uploaded_images';
    return (
        <>
            <PageContainer
                title="Training Center"
                breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            onClick={changeviewType}
                            icon={viewMode === 'card' ? <TableOutlined /> : <AppstoreOutlined />}
                        >
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openForm}>
                            Add
                        </Button>
                    </Space>
                }
            >
                {viewMode === 'table' ? (
                    <Table
                        // loading={loading}
                        dataSource={mettingRoomData}
                        columns={columns}
                        size={'small'}
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                        }}
                        rowKey="id"
                    />
                ) : (
                    <div className="card-view">
                        <Row gutter={[24, 24]}>
                            {mettingRoomData.map((room: any) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={room.id}>
                                    <CardView
                                        meetingRoom={room.meetingRoom}
                                        isActive={room.isActive}
                                        roomStatus={room.roomStatus}
                                        location={room.location}
                                        capacity={room.capacity}
                                        fileName={room.fileName} id={room.id} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </PageContainer>
            <Modal
                key={mettingRoomData.id}
                title={isUpdate ? 'Update Training Center' : 'Create Training Center'}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <MeetingRoomMaster
                    key={Date.now()}
                    isUpdate={isUpdate}
                    meetingRoomData={selectedData}
                    closeForm={closeModal}
                />
            </Modal>
        </>
    );
};

export default TrainingGrid;
