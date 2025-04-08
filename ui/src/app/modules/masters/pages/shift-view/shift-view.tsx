import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import { ScopesEnum, ShiftActivateDeactivateDto, ShiftDto } from "@hrexpert/shared-models";
import { BranchesService, ShiftService } from "@hrexpert/shared-services";
import { Button, Checkbox, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Switch, Table, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../../../../../app/common/utils";
import ShiftForm from "../shift-form/shift-form";
import { Excel } from "antd-table-saveas-excel";



interface ShiftIProps {
    scopes: ScopesEnum[]
}

const ShiftView = (props?: ShiftIProps) => {

    const { scopes } = props
    const [data, setData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const service = new ShiftService();
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    let navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const Option = Select
    const brService = new BranchesService()
    const [brData, setBrData] = useState<any[]>([]);

    useEffect(() => {
        getAllShifts();
        getAllBranches()
    }, []);

    const getAllShifts = () => {
        const req = new ShiftDto()
        const formValues = form.getFieldsValue();
        if (formValues.branchId) {
            req.branchId = formValues.branchId
        }
        try {
            service.getAllShifts(req).then((res) => {
                if (res.status) {
                    console.log(res, "<<<<<<<")
                    setData(res.data)
                }
                else {
                    message.error("Failed to retrieve shifts");
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

    const updateShiftDetails = (data: ShiftDto) => {
        console.log(data, 'data');

        service.updateShifts(data)
            .then((res) => {
                if (res.status) {
                    message.success("shift updated successfully");
                    setModalVisible(false);
                    getAllShifts();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating shift details:", error);
            });
    };

    const deleteShift = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new ShiftActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateShifts(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllShifts();
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

    const editShift = (rowData: any) => {
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
        getAllShifts()
    }

    
    let i = 1;
    const shifts = [
        { title: "Branch", dataIndex: "branchName"},
        { title: 'Shift Type', dataIndex: 'shiftType' },
        { title: 'Start Time', dataIndex: 'startTime' },
        { title: 'End Time', dataIndex: 'endTime' },
    ];

   
    const preprocessData = (data) => {
        // Filter out records where isActive is 0
        const filteredData = data.filter(record => record.isActive !== 0);
        
        return filteredData.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            shifts.forEach((column) => {
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
      .addSheet('shifts')
      .addColumns(shifts)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('Shifts.xlsx');
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
            title: "Shift Type",
            dataIndex: "shiftType",
            ...getColumnSearchProps("shiftType"),
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
                            const { id, shiftType, branchName, startTime, endTime, isActive, branchId } = rowData;

                            // Convert startTime and endTime to dayjs objects if they are not already
                            const startTimeDayjs = dayjs(startTime, 'HH:mm'); // Ensure the format matches your time string
                            const endTimeDayjs = dayjs(endTime, 'HH:mm');

                            // console.log({ id, shiftType, startTime: startTimeDayjs, endTime: endTimeDayjs, isActive }, "EditOutlined<<<<<<<<,");

                            if (isActive) {
                                editShift({ id, shiftType, branchName, startTime: startTimeDayjs, endTime: endTimeDayjs, isActive, branchId });
                            }
                        }}
                        style={{ color: '#1890ff', fontSize: '14px', display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }} />
                    <Divider type="vertical" />
                    <Popconfirm onConfirm={e => { deleteShift(rowData); }}
                        title={
                            rowData.isActive
                                ? 'Are you sure to Deactivate SHIFT ?'
                                : 'Are you sure to Activate SHIFT ?'
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
            <PageContainer title="Shifts" breadcrumbRender={false}
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
                <Form layout="vertical" form={form} onFinish={getAllShifts}>
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
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize)
                        },
                    }}
                    rowKey="id"
                />
            </PageContainer>

            <Modal
                title={isUpdate ? "Update Shift" : "Create Shift"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <ShiftForm

                    key={isUpdate ? selectedStyleData?.id : 'new-shift'}
                    updateDetails={updateShiftDetails}
                    isUpdate={isUpdate}
                    shiftData={selectedStyleData || {}}
                    closeForm={closeModal}
                    getAllShifts={getAllShifts}
                />
            </Modal>
        </>
    );
};

export default ShiftView;
