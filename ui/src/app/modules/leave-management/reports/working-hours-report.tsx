import { AttendanceServices } from "@hrexpert/shared-services"
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Space, Table } from "antd"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import dayjs, { Dayjs } from 'dayjs';
import { SearchOutlined, UndoOutlined } from "@ant-design/icons"
import { ColumnType } from "antd/es/table"
import Highlighter from "react-highlight-words"
import moment from "moment"
import { Excel } from "antd-table-saveas-excel"
import { OTBulkApprovalReq } from "@hrexpert/shared-models";

const WorkingHoursReports = () => {
    const [data, setData] = useState<any>([])
    const [page, setPage] = React.useState(1);
    const service = new AttendanceServices
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [filteredData, setFilteredData] = useState<any>([]);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {

        getAllWorkingHours()
    }, [])

    const getAllWorkingHours = () => {
        const req = new OTBulkApprovalReq()
        service.getWorkingHoursReport(req).then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                message.error(res.internalMessage)
            }
        })

    }

    useEffect(() => {
        form.setFieldsValue({ date: defaultDateRange });
        applyFilters();
    }, [data]);


    const defaultDateRange = [dayjs().startOf('month'), dayjs()];
    const disableFutureDates = (current: Dayjs) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };


    const applyFilters = () => {
        const date = form.getFieldValue("date");

        const filtered = data.filter((record) => {
            const recordDate = dayjs(record.date).format('YYYY-MM-DD');
            const withinDateRange = date
                ? dayjs(recordDate).isBetween(
                    dayjs(date[0]).format('YYYY-MM-DD'),
                    dayjs(date[1]).format('YYYY-MM-DD'),
                    null,
                    '[]'
                )
                : true;

            return withinDateRange;
        });

        setFilteredData(filtered);
    };


    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | any) => {
        if (dates && dates[0] && dates[1]) {
            form.setFieldsValue({ date: dates });
            applyFilters();
        } else {
            form.resetFields(['date']);
            applyFilters();
        }
    };
    const handleReset = () => {
        form.resetFields()
        applyFilters()
    }


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
                            handleResets(clearFilters);
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

    function handleResets(clearFilters: any) {
        clearFilters();
        setSearchText("");
    }


    let i = 1;
    const workingHours = [
        { title: "Employee Name", dataIndex: "empName" },
        { title: 'Date', dataIndex: 'date' },
        { title: 'ShiftGroup', dataIndex: 'shiftGroup' },
        { title: 'Shift', dataIndex: 'shiftType' },
        { title: 'Timinigs', dataIndex: 'shiftTime' },
        { title: 'In Time', dataIndex: 'inTime' },
        { title: 'Out Time', dataIndex: 'outTime' },
        { title: 'Total Working Hours', dataIndex: 'totalHours' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            workingHours.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(data);
        excel
            .addSheet('working-hours-report')
            .addColumns(workingHours)
            .addDataSource(processedData, { str2num: false })
            .saveAs('working-hours-report.xlsx');
    };



    const columns: any = [
        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Employee Name",
            dataIndex: "empName",
            ...getColumnSearchProps("empName"),

        },
        {
            title: "Date",
            dataIndex: "date",
            render: (date) => new Date(date).toLocaleDateString('en-GB') // Format as DD/MM/YYYY
        },

        {
            title: "ShiftGroup",
            dataIndex: "shiftGroup"

        },
        {
            title: "Shift",
            dataIndex: "shiftType",
            ...getColumnSearchProps("shiftType"),
        },
        {
            title: "Timinigs",
            dataIndex: "shiftTime"
        },
        {
            title: "In Time",
            dataIndex: "inTime",
            render: (inTime) => moment(inTime).utc().format("HH:mm")
        },
        {
            title: "Out Time",
            dataIndex: "outTime",
            render: (outTime) => moment(outTime).utc().format("HH:mm")
        },
        {
            title: "Total Work Hours",
            dataIndex: "totalHours"
        },
        {
            title: "Status",
            dataIndex: "remarks",
            render: (_, record) => {
                const inTime = moment(record.inTime);
                const outTime = moment(record.outTime);
                const duration = moment.duration(outTime.diff(inTime)).asHours();

                if (duration < 8) {
                    return "Less working hours";
                } else if (duration > 8.5) {
                    return "Extra working hours";
                } else {
                    return "Normal working hours";
                }
            }
        }
    ]
    return (
        <Card>
            <Form layout="vertical" form={form}>
                <Row gutter={[24, 4]}>
                    <Col xs={24} sm={12} md={8} lg={5} xl={5}>
                        <Form.Item label='Date' name='date' >
                            <RangePicker onChange={handleDateChange} disabledDate={disableFutureDates} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5} xl={5} style={{ marginTop: "23px" }}>
                        <Button icon={<UndoOutlined />} onClick={handleReset} type='dashed' danger> Reset </Button>
                        <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold", marginLeft: "23px" }} type="dashed" onClick={() => exportExcel()}>Get Excel</Button>
                    </Col>

                </Row></Form>
            <Table columns={columns} dataSource={filteredData}
                pagination={{
                    onChange(current) {
                        setPage(current);
                    },
                }}
                scroll={{ x: true }}
                rowKey="id"
                bordered
            /></Card>
    )
}
export default WorkingHoursReports