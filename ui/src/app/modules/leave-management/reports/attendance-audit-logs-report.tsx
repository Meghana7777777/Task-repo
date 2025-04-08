import { SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { OTBulkApprovalReq } from "@hrexpert/shared-models";
import { AttendanceServices } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Table } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from "dayjs";
import moment from "moment";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

export default function AttendanceCompilanceAuditLogs() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");


    const {Option} = Select
    const attendanceService = new AttendanceServices()

    const [form] = Form.useForm();


    const getAllForBulkOTApproval = (req) =>{
        attendanceService.getAllForBulkOTApproval(req).then(res =>{
            if(res.status){
                setData(res.data)
            }else{
                setData([])
            }
        })
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
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Employee",
            dataIndex:'employee',
            sorter: (a, b) => a.employee.localeCompare(b.employee),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("employee"),
            align: "center",
        },
        {
            title: "Code",
            dataIndex:'empCode',
            sorter: (a, b) => a.empCode.localeCompare(b.empCode),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("empCode"),
            align: "center",
        },
        {
            title: "Department",
            dataIndex:'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("department"),
            align: "center",
        },
        {
            title: "Shift",
            dataIndex:'shiftType',
            sorter: (a, b) => a.shiftType.localeCompare(b.shiftType),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftType"),
            align: "center",
        },
        {
            title: "Shift In Time",
            dataIndex:'shiftIn',
            sorter: (a, b) => a.shiftIn.localeCompare(b.shiftIn),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftIn"),
            align: "center",
        },
        {
            title: "Shift Out Time",
            dataIndex:'shiftOut',
            sorter: (a, b) => a.shiftOut.localeCompare(b.shiftOut),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("shiftOut"),
            align: "center",
        },
        {
            title: "In Time",
            dataIndex:'inTime',
            sorter: (a, b) => a.inTime.localeCompare(b.inTime),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("inTime"),
            align: "center",
        },
        {
            title: "Out Time",
            dataIndex:'outTime',
            sorter: (a, b) => a.outTime.localeCompare(b.outTime),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("outTime"),
            align: "center",
        },
        {
            title: "Manual Attendance",
            dataIndex:'manualEntry',
            sorter: (a, b) => a.manualEntry.localeCompare(b.manualEntry),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("manualEntry"),
            align: "center",
        },
        {
            title: "Attendance By",
            dataIndex:'createdUser',
            sorter: (a, b) => a.createdUser.localeCompare(b.createdUser),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("createdUser"),
            align: "center",
        },
        {
            title: "Created At",
            dataIndex:'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("createdUser"),
            align: "center",
            render:(_,record)=>{
                return <span>{record.createdAt?moment(record.createdAt).format('YYYY-MM-DD'):'-'}</span>
            }
        }
        
    ];


const getData = () =>{
    const date = form.getFieldValue('date')
    if(date != undefined){
        const req = new OTBulkApprovalReq(  )
        req.date=dayjs(date).format('YYYY-MM-DD')
        req.reportType = 'AUDIT LOGS'
        getAllForBulkOTApproval(req)

    }else{
        date ? '':form.setFields([{ name: 'date', errors: ['Please Select Attendance Date'] },])
    }
}

    const onReset = () =>{
        form.resetFields()
        setData([])
    }
    return (
        <PageContainer title='OT' breadcrumbRender={false}
    >
        <Form form={form} onFinish={getData} layout="vertical">
            <Row gutter={24}>
                <Col span={3} style={{width:'100%'}}>
                <Form.Item name={'date'} label={'Date'} rules={[{required:true,message:'Date is Required'}]}>
                  <DatePicker />
                </Form.Item>
                </Col>
                <Col span={6} style={{paddingTop:'23px' }}>
                <Button onClick={getData} style={{ marginRight: '8px' }}>Get Data</Button>
                <Button onClick={onReset} style={{ marginRight: '8px' }}>Reset</Button>
                </Col>
                
            </Row>
        <Table
            columns={columns}
            dataSource={data}
            // loading={loading}
            size="small"
            rowKey={(record) => record.employeeId}
            pagination={{
                onChange(current) {
                    setPage(current);
                },
            }}
        />
        </Form>
    </PageContainer>
    );
}
