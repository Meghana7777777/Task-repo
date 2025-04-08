import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import { ScopesEnum, AttendanceStatsActivateDeactivateDto, AttendanceStatusDto } from "@hrexpert/shared-models";
import { AttendanceStatusService, BranchesService } from "@hrexpert/shared-services";
import { Button, Checkbox, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Switch, Table, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../../../../common/utils";
import AttendanceStatusForm from "../attendance-status-form/attendance-status-form";
import { Excel } from "antd-table-saveas-excel";



interface AttendanceStatusIProps {
    scopes: ScopesEnum[]
}

const AttendanceStatusView = (props?: AttendanceStatusIProps) => {

    const { scopes } = props
    const [data, setData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const service = new AttendanceStatusService();
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    let navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const Option = Select
    const brService = new BranchesService()
    const [brData, setBrData] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState<number>(1);

    useEffect(() => {
        getAllAttendanceStatus();
        getAllBranches()
    }, []);

    const getAllAttendanceStatus = () => {
        const req = new AttendanceStatusDto()
        const formValues = form.getFieldsValue();
        if (formValues.branchId) {
            req.branchId = formValues.branchId
        }
        try {
            service.getAllAttendanceStatus(req).then((res) => {
                if (res.status) {
                    console.log(res, "<<<<<<<")
                    setData(res.data)
                }
                else {
                    message.error("Failed to retrieve Attendance Status");
                }
            })
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    };

    const getAllBranches = async () => {
        console.log("Fetching active branches...");
        try {
            const res = await brService.getActiveBranches();
            if (res.status) {
                console.log("Branches fetched successfully:", res.data);
                setBrData(res.data);
            } else {
                console.error("Failed to fetch branches:", res.internalMessage);
            }
        } catch (err) {
            console.error("Error fetching branches:", err);
        }
    };

    const updateAttendanceStatus = (data: AttendanceStatusDto) => {
        console.log(data, 'data');

        service.updateAttendanceStatus(data)
            .then((res) => {
                if (res.status) {
                    message.success("AttendanceStatus updated successfully");
                    setModalVisible(false);
                    getAllAttendanceStatus();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Attendance Status details:", error);
            });
    };

    const deleteAttendanceStatus = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new AttendanceStatsActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateAttendanceStatus(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllAttendanceStatus();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        setSelectedStyleData(null); // Reset form for new entry
        setModalVisible(true);
    };

    const editAttendanceStatus = (rowData: any) => {
        console.log(rowData, "Selected row data for editing");
        setSelectedStyleData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
    };

    const getColumnSearchProps = (dataIndex: any): ColumnType<string> => ({
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


    const onReset = () => {
        form.resetFields()
        getAllAttendanceStatus()
    }

    let i = 1;
    const attendanceStatus = [
        { title: "Branch", dataIndex: "branchName"},
        { title: 'Status Type', dataIndex: 'attendanceStatus' },
        { title: 'Start Time', dataIndex: 'startTime' },
        { title: 'End Time', dataIndex: 'endTime' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 }; 
            attendanceStatus.forEach((column) => {
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
      .addSheet('attendanceStatus')
      .addColumns(attendanceStatus)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('Attendance Status.xlsx');
  };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            responsive: ["sm"],
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: "Branch",
            dataIndex: "branchName",
            ...getColumnSearchProps("branchName"),
            align: "center"
        },
        {
            title: "Attendance Status",
            dataIndex: "attendanceStatus",
            ...getColumnSearchProps("attendanceStatus"),
            align: "center"
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            ...getColumnSearchProps("startTime"),
            align: "center"
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            ...getColumnSearchProps("endTime"),
            align: "center"
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
                            className="custom-ok-button"
                        >
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
            title: `Action`,
            dataIndex: 'action',
            width: 200,
            align: 'center',
            render: (text, rowData) => (
                <span>
                    <EditOutlined className={'editSamplTypeIcon'} type="edit"
                        onClick={() => {
                            const { id, attendanceStatus, branchName, startTime, endTime, isActive, branchId } = rowData;

                            // Convert startTime and endTime to dayjs objects if they are not already
                            const startTimeDayjs = dayjs(startTime, 'HH:mm'); // Ensure the format matches your time string
                            const endTimeDayjs = dayjs(endTime, 'HH:mm');

                            // console.log({ id, attendanceStatus, startTime: startTimeDayjs, endTime: endTimeDayjs, isActive }, "EditOutlined<<<<<<<<,");

                            if (isActive) {
                                editAttendanceStatus({ id, attendanceStatus, branchName, startTime: startTimeDayjs, endTime: endTimeDayjs, isActive, branchId });
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px', display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }} />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { deleteAttendanceStatus(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Deactivate attendanceStatus ?'
                                : 'Are you sure to Activate attendanceStatus ?'
                        }
                    >
                        <Switch size="default"
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
                            className={rowData.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                            checkedChildren={<RightSquareOutlined type="check" />}
                            unCheckedChildren={<RightSquareOutlined type="close" />}
                            checked={rowData.isActive}
                        />
                    </Popconfirm>
                </span>
            )
        }
    ];

    return (
        <>
            <PageContainer title="Attendance Status" breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                    </Button>

                    </Space>
                }
            >
                <Form layout="vertical" form={form} onFinish={getAllAttendanceStatus}>
                    <Row gutter={[24, 4]}>
                        <Col span={4}>
                            <Form.Item label="Branch" name="branchId">
                                <Select
                                    placeholder="Select Branch"
                                    allowClear
                                    showSearch
                                    loading={loading}
                                    popupMatchSelectWidth={false}
                                    optionFilterProp="children"
                                >
                                    {brData.map((rec) => (
                                        <Option value={rec.id} key={rec.id}>
                                            {rec.branchName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Button htmlType="submit" style={{ marginTop: "23px" }} type="primary">
                                Submit
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={onReset} style={{ marginTop: "23px" }} danger>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    columns={columns}
                    dataSource={data}
                    size={"small"}
                    pagination={{
                        pageSize: 20,
                        onChange(current,pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="id"
                />
            </PageContainer>

            <Modal
                title={isUpdate ? "Update attendanceStatus" : "Create attendanceStatus"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <AttendanceStatusForm

                    key={isUpdate ? selectedStyleData?.id : 'new-Attendance Status'}
                    updateDetails={updateAttendanceStatus}
                    isUpdate={isUpdate}
                    attendanceStatusData={selectedStyleData || {}}
                    closeForm={closeModal}
                    getAllAttendanceStatus={getAllAttendanceStatus}
                />
            </Modal>
        </>
    );
};

export default AttendanceStatusView;
