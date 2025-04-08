import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Table, Badge, Button, message, Form, Select, Col, Row, Popconfirm, Input, Space, Tag, Checkbox, Switch, Modal, Divider, Tooltip, Tabs } from 'antd';
import { ShiftChangeService, TeamCalenderService } from '@hrexpert/shared-services';
import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ColumnType } from 'antd/lib/table';
import Highlighter from 'react-highlight-words';
import TeamCalenderForm from '../team-calender-form/team-calender-form';
import { PageContainer } from '@ant-design/pro-layout';
import TabPane from 'antd/es/tabs/TabPane';
import { ApprovalStatusEnum, ShiftStatsUpdateReq } from '@hrexpert/shared-models';

const { Title } = Typography;

const ShiftChangeView = () => {
    const [shiftData, setShiftData] = useState<any>([]);
    const service = new ShiftChangeService();
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getAllTeamCalenderData();
    }, []);

    const getAllTeamCalenderData = () => {
        service.getAllOpenShiftChangeRequest().then(res => {
            if (res.status) {
                setShiftData(res.data);
            } else {
                if (res.errorCode) {
                    setShiftData([]);
                    message.error(res.internalMessage);
                } else {
                    message.error(res.internalMessage);
                }
            }
        }).catch(err => {
            setShiftData([]);
            message.error(err.message);
        })
    }

    const updateSelectedRowsStatus = (status: ApprovalStatusEnum) => {
        if (!selectedRowKeys.length) {
            message.warning("No rows selected!");
            return;
        }
    
        const payload: ShiftStatsUpdateReq = {
            id: selectedRowKeys.map((key) => key.toString()), // Convert keys to strings
            shiftStatus: status, // Use enum values
        };
    
        setLoading(true);
        console.log(payload)
        service.updateShiftStatusBySelectedEmp(payload).then((res) => {
                if (res.status) {
                    message.success(
                        `Selected rows ${status.toLowerCase()} successfully!`
                    );
                    setSelectedRowKeys([]);
                    getAllTeamCalenderData();
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((err) => {
                message.error(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
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

    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'employeeCode',
            key: 'name',
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            width: '20%',
        },
        {
            title: 'Name',
            dataIndex: 'employeeName',
            key: 'name',
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            width: '20%',
        },
        {
            title: 'From Date',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (value, record) => {
                return <span>
                    {record.fromDate ? moment(record.fromDate).format('YYYY-MM-DD') : '-'}
                </span>
            },
        },
        {
            title: 'ToDate',
            dataIndex: 'toDate',
            key: 'toDate',
            render: (value, record) => {
                return <span>
                    {record.toDate ? moment(record.toDate).format('YYYY-MM-DD') : '-'}
                </span>
            },
        },
        {
            title: 'From Shift',
            dataIndex: 'fromShift',
            key: 'fromShift',
        },
        {
            title: 'To Shift',
            dataIndex: 'toShift',
            key: 'ToShift',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Stats',
            dataIndex: 'requestStatus',
            key: 'requestStatus',
        },

    ];
    const columns1: any = [
        {
            title: 'Id',
            dataIndex: 'employeeCode',
            key: 'name',
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            width: '20%',
        },
        {
            title: 'Name',
            dataIndex: 'employeeName',
            key: 'name',
            render: (text, record) => ({
                children: <div>{text}</div>,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
            width: '20%',
        },
        {
            title: 'From Date',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (value, record) => {
                return <span>
                    {record.fromDate ? moment(record.fromDate).format('YYYY-MM-DD') : '-'}
                </span>
            },
        },
        {
            title: 'ToDate',
            dataIndex: 'toDate',
            key: 'toDate',
            render: (value, record) => {
                return <span>
                    {record.toDate ? moment(record.toDate).format('YYYY-MM-DD') : '-'}
                </span>
            },
        },
        {
            title: 'From Shift',
            dataIndex: 'fromShift',
            key: 'fromShift',
        },
        {
            title: 'To Shift',
            dataIndex: 'toShift',
            key: 'ToShift',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Stats',
            dataIndex: 'requestStatus',
            key: 'requestStatus',
        },

    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };
    const filterDataByStatus = (status: string) =>
        shiftData.filter((item: any) => item.requestStatus === status);
    return (
        <>

            <PageContainer title="Shift Approval" breadcrumbRender={false}>
                <Tabs defaultActiveKey="OPEN">
                    <TabPane tab="OPEN" key="OPEN">
                    <Space style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => updateSelectedRowsStatus(ApprovalStatusEnum.APPROVED)}
                            disabled={!selectedRowKeys.length}
                            loading={loading}
                        >
                            Approve 
                        </Button>
                        <Button
                            type="default"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => updateSelectedRowsStatus(ApprovalStatusEnum.REJECTED)}
                            disabled={!selectedRowKeys.length}
                            loading={loading}
                        >
                            Reject 
                        </Button>
                    </Space>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns1}
                            dataSource={filterDataByStatus("OPEN")}
                            pagination={false}
                            rowKey={(record) => record.id}
                            bordered
                        />
                    </TabPane>

                    <TabPane tab="APPROVED" key="APPROVED">
                        <Table
                            columns={columns}
                            dataSource={filterDataByStatus("APPROVED")}
                            pagination={false}
                            rowKey={(record) => record.id}
                            bordered
                        />
                    </TabPane>
                    <TabPane tab="REJECTED" key="REJECTED">
                        <Table
                            columns={columns}
                            dataSource={filterDataByStatus("REJECTED")}
                            pagination={false}
                            rowKey={(record) => record.id}
                            bordered
                        />
                    </TabPane>
                </Tabs>
            </PageContainer>
        </>

    );
};

export default ShiftChangeView;
