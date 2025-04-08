import { Button, Card, Divider, Form, Input, Tabs, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { AlertMessages, AttendanceUpdateRequest, LeaveApprovalStatusEnum, UnitIdReq } from '@hrexpert/shared-models';
import { AttendanceServices } from '@hrexpert/shared-services';



export function AttendanceAdjustmentApproval() {
    const [page, setPage] = React.useState(1);
    const [attendanceAdjustmentData, setAttendanceAdjustmentData] = useState<any[]>([]);
    const [approvalData, setApprovalData] = useState<any[]>([]);
    const service = new AttendanceServices();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [filtersData, setFiltersData] = useState<any[]>([]);
    const { TabPane } = Tabs;


    useEffect(() => {
        getAttnAdjustTableData();
    }, [])

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) { setTimeout(() => searchInput.current.select()); }
        },
        render: (text: { toString: () => any; }) =>
            text ? (
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()}
                    />
                ) : text
            )
                : null
    });

    /**
     * 
     * @param selectedKeys 
     * @param confirm 
     * @param dataIndex 
     */
    function handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    function handleReset(clearFilters) {
        clearFilters();
        setSearchText('');
    };

    const getAttnAdjustTableData = () => {
        const req = new UnitIdReq
        service.getAttnAdjustTableData(req).then((res) => {
            if (res.status) {
                setAttendanceAdjustmentData(res.data)
                setFiltersData(res.data);
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })

    }

    const attendanceAdjustmentApproval = (values) => {
        // const date = moment(values.inTime).format('YYYY-MM-DD');
        const req = new AttendanceUpdateRequest(values.employeeCode, values.employeeName, values.date, values.inTime, values.outTime, values.presentStatus, LeaveApprovalStatusEnum.APPROVED, null, localStorage.getItem('username'),values?.empId,values?.employeeId);
        service.updateAttendance(req).then((res) => {
            if (res.status) {
                getAttnAdjustTableData();
                AlertMessages.getSuccessMessage('Attendance Approved and Updated sucessfully')
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        })
    }

    const attendanceAdjustmentRejection = (values) => {
        console.log(values);
        const date = moment(values.inTime).format('YYYY-MM-DD');
        const req = new AttendanceUpdateRequest(values.employeeCode, values.employeeName, date, values.inTime, values.outTime, values.presentStatus, LeaveApprovalStatusEnum.REJECTED,null,null,values?.empId,values?.employeeId);
        service.updateAttendance(req).then((res) => {
            if (res.status) {
                getAttnAdjustTableData();
                AlertMessages.getSuccessMessage('Attendance Adjustment Rejected sucessfully')
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        })
    }

    const onReset = () => {
        form.resetFields();
        setAttendanceAdjustmentData([])
    }

    const tableColumns = (key) => {
        const columns: ColumnProps<any>[] = [
            {
                title: 'S.No',
                key: 'sno',
                width: '30px',
                responsive: ['sm'],
                render: (text, object, index) => (page - 1) * 10 + (index + 1)
            },
            {
                title: 'Employee Code',
                dataIndex: 'employeeCode',
                // width: 100,
                align: 'center',
                sorter: (a, b) => a.employeeCode?.localeCompare(b.employeeCode),
                sortDirections: ['descend', 'ascend'],
                // ...getColumnSearchProps('employeeCode')
            },
            {
                title: 'Employee Name',
                dataIndex: 'employeeName',
                sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
                sortDirections: ['descend', 'ascend'],
                // ...getColumnSearchProps('employeeName')
            },
            {
                title: 'Applied Date',
                dataIndex: 'appliedDate',
                // width: 150,
                align: 'center',
                sortDirections: ['descend', 'ascend'],
                sorter: (a, b) => moment(a.appliedDate).unix() - moment(b.appliedDate).unix(),
                render: (value, record) => {
                    return <>{record.appliedDate ? moment(record.appliedDate).format('YYYY-MM-DD') : '-'}</>
                }
            },
            {
                title: 'Old In Time',
                dataIndex: 'oldInTime',
                render: (value, record) => {
                    return <>{record.oldInTime ? moment(record.oldInTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</>
                }
            },
            {
                title: 'New In Time',
                dataIndex: 'inTime',
                render: (value, record) => {
                    return <>{record.inTime ? moment(record.inTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</>
                }
            },
            {
                title: 'Old Out Time',
                dataIndex: 'oldOutTime',
                render: (value, record) => {
                    return <>{record.oldOutTime ? moment(record.oldOutTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</>
                }
            },
            {
                title: 'New Out Time',
                dataIndex: 'outTime',
                render: (value, record) => {
                    return <>{record.outTime ? moment(record.outTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</>
                }
            },
            {
                title: 'Remarks',
                dataIndex: 'remarks',
                render: (value, record) => (
                    <Tooltip title={record.remarks}>
                        <div style={{ 
                            maxWidth: '150px', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                        }}>
                            {record.remarks ? record.remarks : '-'}
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: 'Attendance Status',
                dataIndex: 'presentStatus',
                width: 130,
                align: 'center',
                filters: [
                    { text: 'PRESENT', value: 'P' },
                    // { text: 'WORKFROMHOME', value: 'WFH' },
                    { text: 'ABSENT', value: 'A' },
                    { text: 'LEAVE', value: 'L' },
                ],
                filterMultiple: true,
                onFilter: (value, record) => {
                    // === is not work
                    return record.presentStatus === value;
                },
                sorter: (a, b) => a.presentStatus.localeCompare(b.presentStatus),
                sortDirections: ['descend', 'ascend']
            }
        ];

        const actionColumns: ColumnProps<any>[] = [
            {
                title: 'Action',
                dataIndex: 'status',
                align: 'center',
                width: 150,
                render: (status, rowData) => (
                    <span>
                        {rowData.status ?
                            <span>
                                <Button type="primary" shape="round" size="small" onClick={() => attendanceAdjustmentApproval(rowData)}>
                                    Approve
                                </Button>
                                <Divider type="vertical" />
                                <Button type="primary" shape="round" size="small" danger onClick={() => {
                                    attendanceAdjustmentRejection(rowData)
                                }}>
                                    Reject
                                </Button>
                            </span> :
                            <span> </span>
                        }
                    </span>
                ),
            },
        ];

        if (key === "1") {
            return [...columns, ...actionColumns];
        } else {
            return [...columns]
        }
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }

    return (
        <Card title={<span style={{ color: 'white' }}>Attendance Adjustment Approval</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#69c0ff', border: 0 }}  >
            <div className="card-container">
                <Tabs type={'card'} tabPosition={'top'}>
                    <TabPane
                        key="1"
                        tab={<span style={{ color: "#f5222d" }}>{'Open: ' + (attendanceAdjustmentData.filter(rec => rec.status == LeaveApprovalStatusEnum.OPEN).length)}</span>}
                    >
                        <Table
                            rowKey={record => record.applyForLeavesId}
                            columns={tableColumns("1")}
                            dataSource={attendanceAdjustmentData.filter(rec => rec.status == LeaveApprovalStatusEnum.OPEN)}
                            scroll={{ x: true }}
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                }
                            }}
                            onChange={onChange}
                            bordered />
                    </TabPane>

                    <TabPane
                        key="2"
                        tab={<span style={{ color: "#f5222d" }}>{'Approved: ' + (attendanceAdjustmentData.filter(el => el.status == LeaveApprovalStatusEnum.APPROVED).length)}</span>}
                    >
                        <Table
                            rowKey={record => record.applyForLeavesId}
                            columns={tableColumns("2")}
                            dataSource={attendanceAdjustmentData.filter(rec => rec.status == LeaveApprovalStatusEnum.APPROVED)}
                            scroll={{ x: true }}
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                }
                            }}
                            onChange={onChange}
                            bordered />
                    </TabPane>

                    <TabPane
                        key="3"
                        tab={<span style={{ color: "#f5222d" }}>{'Rejected: ' + (attendanceAdjustmentData.filter(rec => rec.status == LeaveApprovalStatusEnum.REJECTED).length)}</span>}
                    >
                        <Table
                            rowKey={record => record.id}
                            columns={tableColumns("2")}
                            dataSource={attendanceAdjustmentData.filter(rec => rec.status == LeaveApprovalStatusEnum.REJECTED)}
                            scroll={{ x: true }}
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                }
                            }}
                            onChange={onChange}
                            bordered />
                    </TabPane>
                </Tabs>
            </div>
        </Card>

    );
}
export default AttendanceAdjustmentApproval;