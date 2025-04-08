import { CheckCircleOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { AlertMessages, ApplyForLeavesReqModel, ApplyForLeaveStatusEnum, ApprovalStatusEnum, AttnAdjustLogReq } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, AttendanceServices, LeaveAllocationService } from "@hrexpert/shared-services";
import { Button, Card, Divider, Form, Input, message, Modal, Space, Tabs, Tag } from "antd";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from "../../../common/iam-client-react";
import StatusTag from "../../payroll-management/employee-loan-salary/status-tag";
import SelfAttendanceAdjustment from "./self-attendance-adjustment-form";
import { PageContainer } from "@ant-design/pro-layout";

const SelfAttendanceAdjustmentView = () => {
    const [filteredData, setFilteredData] = useState<any>([]);
    const [data, setData] = useState<any>([]);
    const [form] = Form.useForm();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [page, setPage] = React.useState(1);
    const [status, setStatus] = useState<string>('OPEN')
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [leaveAllocations, setLeaveAllocations] = useState<any[]>([]);
    const leaveAllocationservice = new LeaveAllocationService()
    const attnService = new AttendanceServices()

    useEffect(() => {
        getAllAttnAdjustmentData();
    }, []);

    const getAllAttnAdjustmentData = () => {
        const req = { employeeId: Number(IAMClientAuthContext.user?.employeeId) }
        attnService.getAllAttnAdjustmentData(req).then((res) => {
            if (res.status) {
                setData(res.data);
                setFilteredData(res.data.filter((rec) => rec.status === 'OPEN'))
            } else {
                message.error(res.internalMessage);
            }
        });
    };

    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('year'));
    };


    const tabsOnchange = (value: string) => {
        const selectedYear = form.getFieldValue("month");
        if (selectedYear) {
            const filtered = data.filter((record) => {
                const recordYear = dayjs(record.month).year();
                return selectedYear ? recordYear === dayjs(selectedYear).year() : true;
            });
            setFilteredData(filtered.filter((rec) => rec.status === value))
        } else {
            setFilteredData(data.filter((rec) => rec.status === value))
        }
        setStatus(value)
    };


    const ResetHandel = () => {
        form.resetFields();
        setFilteredData(data.filter((rec) => rec.status === status))
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
            title: "Employee Code",
            dataIndex: "empCode",
        },
        {
            title: "Employee Name",
            dataIndex: "empName",
        },
        {
            title: "Date",
            dataIndex: "attnAdjstDate",
            sorter: (a, b) => a.attnAdjstDate.localeCompare(b.attnAdjstDate),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        // {
        //     title: "Shift",
        //     dataIndex: "shiftType",
        //     sorter: (a, b) => a.typeOfLeave.localeCompare(b.typeOfLeave),
        //     sortDirections: ['ascend', 'descend'],
        //     ...getColumnSearchProps("typeOfLeave"),
        // },
        {
            title: "Attendance Status",
            dataIndex: "presentStatus",
            sorter: (a, b) => a.typeOfLeave.localeCompare(b.typeOfLeave),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("typeOfLeave"),
        },
        {
            title: "In Time- old",
            dataIndex: "oldInTime",
            sorter: (a, b) => a.oldInTime.localeCompare(b.oldInTime),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: "In Time",
            dataIndex: "inTime",
            sorter: (a, b) => a.inTime.localeCompare(b.inTime),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: "Out Time- old",
            dataIndex: "oldOutTime",
            sorter: (a, b) => a.oldOutTime.localeCompare(b.oldOutTime),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: "Out Time",
            dataIndex: "outTime",
            sorter: (a, b) => a.outTime.localeCompare(b.outTime),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            sorter: (a, b) => a.remarks.localeCompare(b.remarks),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("remarks"),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            sortDirections: ['ascend', 'descend'],
            render: (value: ApplyForLeaveStatusEnum) => {
                return <StatusTag status={value} />
            }
        },
        {
            title: 'Action',
            align: "center",
            hidden: status === 'OPEN' ? false : true,
            render: (text, rowData) => (
                <>
                    <EditOutlined
                        className={"editSampleTypeIcon"}
                        type="edit"
                        onClick={() => { edit(rowData), setOpenModal(true) }}
                        style={{ color: "#1890ff", fontSize: "14px" }}
                    />
                    <Divider type="vertical" />
                    <Button color="danger" variant='dashed' onClick={() => { CancleSelfAttendanceAdjust(rowData) }}>Cancel</Button>
                </>
            ),
        }
    ];

    const CancleSelfAttendanceAdjust = (rowData) => {
        const req = new AttnAdjustLogReq();
        req.id = rowData.attnAdjstId
        req.status = ApprovalStatusEnum.CANCEL
        attnService.CancleSelfAttendanceAdjust(req).then((res) => {
            if (res.status) {
                AlertMessages.getErrorMessage(res.internalMessage)
                window.location.reload()
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }

    const edit = (rowData: any) => {
        console.log(rowData, '-------rowData----------')
        setSelectedData(rowData);
        setOpenModal(true);
        setIsUpdate(true);
    }


    const closeModal = () => {
        setOpenModal(false);
        setIsUpdate(false)
    };

    return (
        <>
            {data.length > 0 ?
                <>
                    <PageContainer title="Attendance Adjustment" >
                        {data.length > 0 && (
                            <Tabs defaultActiveKey={ApplyForLeaveStatusEnum.OPEN} onChange={tabsOnchange}>
                                {[
                                    { label: <><SyncOutlined spin /> {ApplyForLeaveStatusEnum.OPEN} <Tag color="blue">{data?.filter(item => item.status === 'OPEN').length}</Tag></>, key: ApplyForLeaveStatusEnum.OPEN },
                                    { label: <><CheckCircleOutlined /> {ApplyForLeaveStatusEnum.APPROVED} <Tag color="blue">{data?.filter(item => item.status === 'APPROVED').length}</Tag></>, key: ApplyForLeaveStatusEnum.APPROVED },
                                    { label: <><ExclamationCircleOutlined /> {ApplyForLeaveStatusEnum.REJECTED} <Tag color="blue">{data?.filter(item => item.status === 'REJECTED').length}</Tag></>, key: ApplyForLeaveStatusEnum.REJECTED },
                                    { label: <><ExclamationCircleOutlined /> {ApplyForLeaveStatusEnum.CANCEL} <Tag color="blue">{data?.filter(item => item.status === 'CANCEL').length}</Tag></>, key: ApplyForLeaveStatusEnum.CANCEL },
                                ].map((tab) => (
                                    <Tabs.TabPane tab={tab.label} key={tab.key}>
                                        {filteredData.length > 0 && (
                                            <Table
                                                dataSource={filteredData}
                                                columns={columns}
                                                pagination={{
                                                    onChange(current) {
                                                        setPage(current);
                                                    },
                                                    position: ['topRight'],
                                                }}
                                                scroll={{ x: true }}
                                                rowKey="id"
                                                bordered />

                                        )}
                                    </Tabs.TabPane>
                                ))}
                            </Tabs>)}


                        <Modal
                            width={1100}
                            open={openModal}
                            onCancel={() => setOpenModal(false)}
                            footer={null}
                        >
                            <SelfAttendanceAdjustment
                                Data={selectedData}
                                isUpdate={isUpdate}
                                closeForm={closeModal}
                            />
                        </Modal >


                    </PageContainer>
                </> : <></>}
        </>
    );
};

export default SelfAttendanceAdjustmentView;
