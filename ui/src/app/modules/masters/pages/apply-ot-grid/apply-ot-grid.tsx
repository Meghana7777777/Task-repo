import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ApplyForOTDto, ApplyOtActivateDeactivateReq} from '@hrexpert/shared-models';
import {  OverTimeService } from '@hrexpert/shared-services';
import { Button, Card, Checkbox, Divider, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import OverTimeForm from '../apply-ot-form/apply-ot-form';
import moment from 'moment';
import dayjs from 'dayjs'


export default function OverTimeGrid() {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [overTimeData, setOverTimeData] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const service = new OverTimeService()

    useEffect(() => {
        getAllOt()
    }, [])

    const getAllOt = () => {
        try {
            service.getAllOt().then((res) => {
                if (res.status) {
                    setOverTimeData(res.data)
                    message.success(res.internalMessage,2)
                }else {
                    message.error(res.internalMessage,2)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updateOt = (data: ApplyForOTDto) => {
        console.log(data,"gggggggggggggggg")
        service.updateOt(data)
            .then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    setModalVisible(false);
                    getAllOt();
                    setIsUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating branch details:", error);
            });
    };

    const deleteBranch = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new ApplyOtActivateDeactivateReq(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateDeactivateOt(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllOt();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        setSelectedData(null);
        setModalVisible(true);
    };

    
    const editBranch = (rowData) => {
        console.log(rowData,"oooo")
        setSelectedData(rowData);
        setModalVisible(true);
        setIsUpdate(true);
    };
    // useEffect(()=>{
    //     console.log(selectedData,'====')
    // },[selectedData])

    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
        
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
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align:"center"
        },
          {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            // responsive: ['lg'],
            sorter: (a, b) => a.employeeName?.localeCompare(b.employeeName),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('employeeName')
          },
          {
            title: 'Date',
            dataIndex: 'DATE',
            sorter: (a, b) => a.DATE.localeCompare(b.DATE),
            sortDirections: ['descend', 'ascend'],
      
          },
          {
            title: 'In Time',
            dataIndex: 'inTime',
            sorter: (a, b) => a.inTime.localeCompare(b.inTime),
            sortDirections: ['descend', 'ascend'],
            render: (text, record) => { return dayjs(record.inTime).format('YYYY-MM-DD HH:mm:ss') },

      
          },
      
          {
            title: 'out Time',
            dataIndex: 'outTime',
            render: (text, record) => { return dayjs(record.outTime).format('YYYY-MM-DD HH:mm:ss') },
            sorter: (a, b) => a.outTime.localeCompare(b.outTime),
            sortDirections: ['descend', 'ascend'],
      
          },
          {

            title: 'Total Hours(HH:MM)',
            dataIndex: 'workingHours',
            render: (text, record) => { return record.workingHours },
            sorter: (a, b) => 
                {
                    const [hoursA, minutesA] = a.workingHours.split(' H: ').map(Number);
                    const [hoursB, minutesB] = b.workingHours.split(' H: ').map(Number);
                    return hoursA !== hoursB ? hoursA - hoursB : minutesA - minutesB;
                },
            sortDirections: ['descend', 'ascend'],
          },
      
        {
            title: "Status",
            dataIndex: "isActive",
            align: "center",
            ...getColumnSearchProps("isActive"),
            render: (isActive, rowData) => (
                <>
                    {isActive ? (
                        <Tag icon={<CheckCircleOutlined />} color="#87d068">
                            Active
                        </Tag>
                    ) : (
                        <Tag icon={<CloseCircleOutlined />} color="#f50">
                            Inactive
                        </Tag>
                    )}
                </>
            ),
            filterIcon: (filtered: boolean) => (
                <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
            ),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }: any) => (
                <div
                    className="custom-filter-dropdown"
                    style={{ flexDirection: "row", marginLeft: 10 }}
                >
                    <Checkbox
                        checked={selectedKeys.includes('Active')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Active') ? [] : ['Active']
                            )
                        }
                    >
                        <span style={{ color: "green" }}>Active</span>
                    </Checkbox>
                    <Checkbox
                        checked={selectedKeys.includes('Inactive')}
                        onChange={() =>
                            setSelectedKeys(
                                selectedKeys.includes('Inactive') ? [] : ['Inactive']
                            )
                        }
                    >
                        <span style={{ color: "red" }}>Inactive</span>
                    </Checkbox>
                    <div className="custom-filter-dropdown-btns">
                        <Button
                            onClick={() => {
                                handleReset(clearFilters);
                                confirm();
                            }}
                            className="custom-reset-button"
                        >
                            Reset
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: 10 }}
                            onClick={() => confirm()}
                            className="custom-ok-button">
                            OK
                        </Button>
                    </div>
                </div>
            ),
            onFilter: (value, record) => {
                if (typeof value === 'string') {
                    const status = record.isActive ? 'Active' : 'Inactive';
                    return value === status;
                }
                return false;
            },
        },
        {
            title: 'Action',
            align:"center",
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSampleTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editBranch(rowData);
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
                            deleteBranch(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate Branch ?"
                                : "Are you sure to Activate Branch?"
                        }
                    >
                        <Switch
                            size="default"
                            className={
                                rowData.isActive ? "toggle-activated" : "toggle-deactivated"
                            }
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />
                    </Popconfirm>
                </span>
            ),
        }
    ]


    return (
        <Card  title={<span style={{color:'white'}}>Over Time</span>}
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openForm}
                    >
                        Add
                    </Button>
                </Space>
            }
        >
            <Table
                columns={columns}
                className="custom-table-wrapper"
                dataSource={overTimeData}
                size={"small"}
                pagination={{
                    onChange(current) {
                        setPage(current);
                    },
                }}
                scroll={{ x: 'max-content' }}
                rowKey={(rec) => rec.styleId}
            />

            <Modal
                title={isUpdate ? "Update Relations" : "Create Relations"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <OverTimeForm
                    // key={isUpdate ? selectedStyleData?.id : 'new-Relations'}
                    updateDetails={updateOt}
                    isUpdate={isUpdate}
                    OverTimeData={selectedData || {}}
                    closeForm={closeModal}
                    getAllOt={getAllOt}
                />
            </Modal>
        </Card>
    );
}
