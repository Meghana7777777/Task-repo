import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { AttendanceDeviceService } from '@hrexpert/shared-services';
import { Button, message, Modal, Popconfirm, Space, Table, Tag, Switch, Input, Checkbox } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import AttendanceDeviceForm from '../attendance-device-form/attendance-device-form';
import { AttendanceDevActiveDeacticveReq } from '@hrexpert/shared-models';
import Highlighter from 'react-highlight-words';

export default function AttendanceDeviceGrid() {
    const [page, setPage] = useState(1);
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const service = new AttendanceDeviceService();

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const res = await service.getAttendanceDevice();
            if (res.status) {
                setAttendanceData(res.data);
            } else {
                message.error(res.internalMessage);
            }
        } catch (err) {
            console.error('Error fetching attendance data:', err);
        }
    };

    const updateAttendance = async (data: any) => {
        try {
            const res = await service.CreateAttendanceDevice(data);
            if (res.status) {
                message.success(res.internalMessage);
                setModalVisible(false);
                fetchAttendanceData();
                setIsUpdate(false);
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    const toggleActiveStatus = async (rowData: any) => {
        const newIsActive = !rowData.is_active;
        const req = new AttendanceDevActiveDeacticveReq(
            rowData.id, 
            // rowData.is_active,
            newIsActive,
            rowData.versionFlag,
            )
        try {
            const res = await service.activateDeactivateAttandenceDev(req);
            if (res.status) {
                message.success(res.internalMessage);
                fetchAttendanceData();
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            console.log('Error updating active status:', error);
        }
    };

    const openForm = () => {
        setSelectedData(null);
        setModalVisible(true);
        setIsUpdate(false);
    };

    const editAttendance = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setIsUpdate(true);
    }

    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
    };

    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
        setSearchText('');
    };

    const columns: ColumnsType<any> = [
        {
            title: 'S No',
            render: (_, __, index) => (page - 1) * 10 + (index + 1),
            align: 'center',
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
            sorter: (a, b) => a.branch?.localeCompare(b.branch),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('branch'),
        },
        {
            title: 'Device Type',
            dataIndex: 'deviceType',
            sorter: (a, b) => a.deviceType?.localeCompare(b.deviceType),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            align: 'center',
            render: (isActive) =>
                isActive ? (
                    <Tag icon={<CheckCircleOutlined />} color="#87d068">
                        Active
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="#f50">
                        Inactive
                    </Tag>
                ),
        },
     

        {
            title: 'Action',
            align: "center",
            render: (text, rowData) => (
                <span>
                    {rowData.is_active ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.is_active) {
                                    editAttendance(rowData);
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px" }}
                        />
                    ) : (
                        ""
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <Popconfirm
                        onConfirm={(e) => {
                            toggleActiveStatus(rowData);
                        }}
                        title={
                            rowData.is_active
                                ? "Are you sure to Deactivate Branch ?"
                                : "Are you sure to Activate Branch?"
                        }
                    >
                        <Switch
                            size="default"
                            className={
                                rowData.is_active ? "toggle-activated" : "toggle-deactivated"
                            }
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.is_active}
                        />
                    </Popconfirm>
                </span>
            ),
        }
    ];

    return (
        <PageContainer
            title="Attendance Device"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={openForm}>
                    Add
                </Button>
            }
        >
            <Table
                dataSource={attendanceData}
                columns={columns}
                rowKey="id"
                pagination={{ current: page, pageSize: 10, onChange: setPage }}
            />
            <Modal
                title={isUpdate ? 'Update Attendance' : 'Attendance Form'}
                visible={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="50%"
            >
                <AttendanceDeviceForm
                    updateDetails={updateAttendance}
                    isUpdate={isUpdate}
                    AttendanceDeviceData={selectedData}
                    closeForm={closeModal}
                    getAttendanceDevice={fetchAttendanceData} 
                />
            </Modal>
        </PageContainer>
    );
}
