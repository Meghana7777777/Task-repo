import { ApplForLeavesSharedService, LeaveAllocationService } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Space, Tabs, Tag } from "antd";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { CheckCircleOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined, UndoOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import { useIAMClientState } from "../../../common/iam-client-react";
import { AlertMessages, ApplyForLeavesReqModel, ApplyForLeaveStatusEnum } from "@hrexpert/shared-models";
import StatusTag from "../../payroll-management/employee-loan-salary/status-tag";
import React from "react";
import { SelfLeaveApplyForm } from "../self-service-leave-apply/self-leave-apply-form";
import Highlighter from "react-highlight-words";
import { PageContainer } from "@ant-design/pro-layout";

const LeaveBalanceHistory = () => {
    const [filteredData, setFilteredData] = useState<any>([]);
    const [data, setData] = useState<any>([]);
    const [form] = Form.useForm();
    const service = new ApplForLeavesSharedService();
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

    useEffect(() => {
        getLeaveHistory();
    }, []);

    const getLeaveHistory = () => {
        service.getLeaveHistory({ employeeId: Number(IAMClientAuthContext.user.employeeId) }).then((res) => {
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

    const applyFilters = () => {
        const selectedYear = form.getFieldValue("month");

        const filtered = data.filter((record) => {
            const recordYear = dayjs(record.month).year();
            return selectedYear ? recordYear === dayjs(selectedYear).year() : true;
        });

        setFilteredData(filtered.filter((rec) => rec.status === status))
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

    const handleDateChange = (date: Dayjs | null) => {
        form.setFieldsValue({ month: date });
        applyFilters();
    };

    const ResetHandel = () => {
        form.resetFields();
        setFilteredData(data.filter((rec) => rec.status === status))
    };

    let i = 1;
    const leaveBalance = [
        { title: "Employee Code", dataIndex: "employeeCode" },
        { title: "Employee Name", dataIndex: "firstName" },
        { title: 'Leave Type', dataIndex: 'typeOfLeave' },
        { title: 'From Date', dataIndex: 'fromDate' },
        { title: 'To Date', dataIndex: 'toDate' },
        { title: 'Number Of Days', dataIndex: 'noOfDays' },
        { title: 'Entry Data', dataIndex: 'month' },
    ];

    const preprocessData = (data) => {
        return data.map((record) => {
            const updatedRecord = {};
            for (const key in record) {
                if (key === "month") {
                    updatedRecord[key] = record[key]
                        ? `${new Date(record[key]).getFullYear()}-${String(new Date(record[key]).getMonth() + 1).padStart(2, "0")}`
                        : "";
                } else {
                    updatedRecord[key] =
                        record[key] === null || record[key] === undefined ? "" : record[key];
                }
            }
            return updatedRecord;
        });
    };

    const getDetails = (id) => {
        try {
            const EditData = data.find((rec) => rec.id === id)
            //setDetailData(JSON.parse(EditData.TermDetails))
            // setSelectedEditData(EditData)
        } catch (err) {
            console.log(err);
        }

    }


    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(data);
        excel
            .addSheet('leave-balance-report')
            .addColumns(leaveBalance)
            .addDataSource(processedData, { str2num: false })
            .saveAs('leave-balance-report.xlsx');
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
            dataIndex: "employeeCode",
        },
        {
            title: "Employee Name",
            dataIndex: "firstName",
        },
        {
            title: "Leave Type",
            dataIndex: "typeOfLeave",
            sorter: (a, b) => a.typeOfLeave.localeCompare(b.typeOfLeave),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("typeOfLeave"),
        },
        {
            title: "From Date",
            dataIndex: "fromDate",
            sorter: (a, b) => a.fromDate.localeCompare(b.fromDate),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? text : '-'),
        },
        {
            title: "To Date",
            dataIndex: "toDate",
            sorter: (a, b) => a.toDate.localeCompare(b.toDate),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? text : '-'),
        },
        {
            title: "Number Of Days",
            dataIndex: "noOfDays",
            sorter: (a, b) => a.noOfDays.localeCompare(b.noOfDays),
            sortDirections: ['ascend', 'descend'],
            render: (text) => (text ? text : '-'),
        },
        {
            title: "Entry Data",
            dataIndex: "month",
            sorter: (a, b) => a.month.localeCompare(b.month),
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
                        onClick={() => { editSelfLeave(rowData), setOpenModal(true) }}
                        style={{ color: "#1890ff", fontSize: "14px" }}
                    />
                    <Divider type="vertical" />
                    <Button color="danger" variant='dashed' onClick={() => { CancleManualLeave(rowData) }}>Cancel</Button>
                </>
            ),
        }
    ];

    const updateLeaveAllocations = (req: any) => {
        leaveAllocationservice.updateLeaveAllocations(req).then((res) => {
            if (res.status) {
            }
        })
    }

    const CancleManualLeave = (rowData) => {
        const req = new ApplyForLeavesReqModel();
        req.applyForLeavesId = rowData.applyForLeavesId
        req.status = ApplyForLeaveStatusEnum.CANCEL
        service.CancleManualLeave(req).then((res) => {
            if (res.status) {
                const updateReq = {
                    employeeId: rowData.employeeId,
                    noOfDays: rowData.noOfDays - 1,
                    typeOfLeave: rowData.typeOfLeave,
                };
                if (updateReq) {
                    updateLeaveAllocations(updateReq);
                }
                window.location.reload()
            } else {
                if (res.status) {
                    AlertMessages.getErrorMessage(res.internalMessage);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })
    }

    const editSelfLeave = (rowData: any) => {
        rowData.fromDate = dayjs(rowData.fromDate)
        rowData.toDate = dayjs(rowData.toDate)
        setSelectedData(rowData);
        setOpenModal(true);
        setIsUpdate(true);
        service.getAllLeaveAllocationsData().then((res) => {
            if (res.status) {
                const allocation = res.data.find((rec) =>
                    rec.employeeId === Number(rowData.employeeId) &&
                    rec.leaveTypeId === Number(rowData.typeOfLeaveId)
                );
                setLeaveAllocations(allocation ? allocation.available : 0);
            }
        })
    }


    const closeModal = () => {
        setOpenModal(false);
        setIsUpdate(false)
    };


    return (
        <PageContainer title="Leaves History">
            <Form layout="vertical" form={form}>
                <Row gutter={[24, 4]}>
                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item label='Year' name='month'>
                            <DatePicker
                                picker="year"
                                onChange={handleDateChange}
                                disabledDate={disableFutureDates}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5} xl={5} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={ResetHandel} type='dashed' danger>
                            Reset
                        </Button>
                        <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold", marginLeft: "23px" }} type="dashed" onClick={() => exportExcel()}>
                            Get Excel
                        </Button>

                    </Col>
                </Row>
            </Form>

            {data.length > 0 && (
                <Tabs defaultActiveKey={ApplyForLeaveStatusEnum.OPEN} onChange={tabsOnchange}>
                    {[
                        { label: <><SyncOutlined spin /> {ApplyForLeaveStatusEnum.OPEN} <Tag color="blue">{data?.filter(item => item.status === 'OPEN').length}</Tag> </>, key: ApplyForLeaveStatusEnum.OPEN },
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
                <SelfLeaveApplyForm
                    applyForLeavesData={selectedData}
                    isUpdate={isUpdate}
                    closeForm={closeModal}
                    leaveAllocations={leaveAllocations}
                />
            </Modal >


        </PageContainer>
    );
};

export default LeaveBalanceHistory;
