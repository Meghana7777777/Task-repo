import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { LeaveGroupsActivateDeactivateDto, ScopesEnum } from "@hrexpert/shared-models";
import { LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Checkbox, Divider, Form, Input, message, Modal, Popconfirm, Space, Switch, Tag } from "antd";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../../../../../app/common/utils";
import LeaveTypeForm from "./leave-type-master-form";
import { version } from "os";

interface LeaveTypeGridIProps {
    scopes: ScopesEnum[]
}

export default function LeaveTypeGrid(props: LeaveTypeGridIProps) {
    const { scopes } = props;
    const [data, setData] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [isUpdate, setisUpdate] = useState(false)
    let navigate = useNavigate();
    const service = new LeaveTypeService();
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(()=>{
        getAllLeaveType();
    },[])

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

    const editLeaveType = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    function getAllLeaveType() {
        setLoading(true);
        service.getAllLeaveType().then((res) => {
            if (res.status) {
                setData(res.data);
            } else {
                message.error(res.internalMessage);
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteLeaveType = async (rowData: any) => {
        console.log(rowData, 'rowData');
        const newIsActive = !rowData.isActive;
        const request = {
            leaveTypeId: rowData.leaveTypeId,
            isActive: newIsActive,
            versionFlag: rowData.versionFlag,
        }
        try {
            service.activateOrDeactivateLeaveType(request).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllLeaveType();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    function openForm() {
        setSelectedData(null);
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
    };

    const updateLeaveTypeDetails = (data: any) => {
        console.log(data, 'data');
        service.updateLeaveType(data)
            .then((res) => {
                if (res.status) {
                    message.success("Updated successfully");
                    setModalVisible(false);
                    getAllLeaveType();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Leave Type details:", error);
            });
    };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: "Leave Type Name",
            dataIndex: "leaveTypeName",
            sorter: (a, b) => a.leaveTypeName.localeCompare(b.leaveTypeName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("leaveTypeName"),
            align: "center"
        },
        {
            title: "Leave Type Code",
            dataIndex: "leaveTypeCode",
            ...getColumnSearchProps("leaveTypeCode"),
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
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editLeaveType(rowData);
                                }
                            }}

                        />
                    ) : (
                        ""
                    )}
                    <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={(e) => {
                            deleteLeaveType(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate Leave Type ?"
                                : "Are you sure to Activate Leave Type?"
                        }
                    >
                        <Switch
                            size="default"
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
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
        },
    ];
    return (
        <>
            <PageContainer title='Leave Type' breadcrumbRender={false}
                extra={
                    <>
                        <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} icon={<PlusOutlined />} onClick={openForm}>
                            Add
                        </Button>
                        {/* <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                    </Button> */}
                    </>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    size="small"
                    pagination={{
                        pageSize: 20,
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize)
                        },
                    }}
                    rowKey="id"
                />

                <Modal
                    title={isUpdate ? "Update LeaveGroups" : "Create LeaveGroups"}
                    open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                    width="60%"
                    key={data.leaveTypeId}
                >
                    <LeaveTypeForm
                        key={Date.now()}
                        updateDetails={updateLeaveTypeDetails}
                        isUpdate={isUpdate}
                        leaveTypeData={selectedData}
                        closeForm={closeModal}
                        getAllLeaveTypes={getAllLeaveType}
                    />

                </Modal>

            </PageContainer>
        </>
    )
}