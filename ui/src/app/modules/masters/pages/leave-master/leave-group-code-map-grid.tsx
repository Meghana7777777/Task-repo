import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { LeaveGroupsActivateDeactivateDto, ScopesEnum } from "@hrexpert/shared-models";
import { BranchesService, EmployeeTypeService, LeaveTypeService } from "@hrexpert/shared-services";
import { Button, Checkbox, Divider, Form, Input, message, Modal, Popconfirm, Space, Switch, Tag } from "antd";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../../../../../app/common/utils";
import { version } from "os";
import LeaveMasterForm from "./leave-master-form";
import LeaveGroupCodeMapForm from "./leave-group-code-map";
import LeaveCodeGeneration from "./leave-code-generation";
import dayjs from "dayjs";

interface LeavesGridIProps {
    scopes: ScopesEnum[]
}

export default function LeaveGroupCodeGrid(props: LeavesGridIProps) {
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
    const branchService = new BranchesService();
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [leaveGroupCodeList, setLeaveGroupCodeList] = useState<any[]>([]);
    const [leaveGroupList, setLeaveGroupList] = useState<any[]>([]);
    const [branchList, setBranchList] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCodeDefineData,setSelectedCodeDefineData] = useState([])
    const [generatedId,setGeneratedId] = useState(0)
    const [employeType, setEmployeType] = useState<any>([]);
    const empTypeService = new EmployeeTypeService()

    useEffect(() => {
        getAllLeaveGroupData();
        getAllActiveGeneratedCode()
        getAllActiveLeaveGroup()
        getAllBranches();
        getActiveEmployeeType()
    }, []);

    const getActiveEmployeeType = () => {
        try {
            empTypeService.getActiveEmployeeType().then((res) => {
                if (res.status) {
                    setEmployeType(res.data);
                } else {
                    console.error("failed to fetch designations");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    function getAllBranches() {
        try {
            branchService.getAllBranches().then((res) => {
                if (res.status) {
                    setBranchList(res.data);
                } else {
                    setBranchList([])
                    console.log("Failed to fetch branches");
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    function getAllActiveGeneratedCode() {
        service.getAllActiveGeneratedCode()
            .then((res) => {
                if (res.status) {
                    setLeaveGroupCodeList(res.data);
                } else {
                    setLeaveGroupCodeList([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching leave types:", error);
            });
    };

    function getAllActiveLeaveGroup() {
        service.getAllActiveLeaveGroup().then((res) => {
            if (res.status) {
                setLeaveGroupList(res.data);
            } else {
                setLeaveGroupList([])
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

    function getAllLeaveGroupData() {
        setLoading(true);
        service.getAllGroupCodeMapData().then((res) => {
            if (res.status) {
                setData(res.data);
            } else {
                message.error(res.internalMessage);
            }
        }).finally(() => {
            setLoading(false);
        })
    }
    console.log(data)
    const deleteLeave = async (rowData: any) => {
        console.log(rowData, 'rowData');
        const newIsActive = !rowData.isActive;
        const request = {
            id: rowData.id,
            isActive: newIsActive,
            versionFlag: rowData.versionFlag,
        }
        try {
            service.activateOrDeactivateLeaveGroupCode(request).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllLeaveGroupData();
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

    
    const editLeaveType = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const updateLeaveDetails = (data: any) => {
        console.log(data, 'data');
        service.updateLeaveGroupCodeMapping(data)
            .then((res) => {
                if (res.status) {
                    message.success("Updated successfully");
                    setModalVisible(false);
                    getAllLeaveGroupData();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating Leave  details:", error);
            });
    };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        // {
        //     title: "Leave Group",
        //     dataIndex: "leaveGroupName",
        //     align: "center",
        //     ...getColumnSearchProps("leaveGroupName"),
        // },
        {
            title: 'Leave Group Code',
            dataIndex: 'generatedCode',
            align: 'center',
            render:(val,rec)=>{
                return val ? `${rec.state +'/'+rec.generatedCode}` : '-'
            }
            // render: (text, record) => (
            //     <Button type="link" onClick={() => handleOpenModal(record)}>
            //         {text}
            //     </Button>
            // ),
        },
        {
            title: 'Branch Name',
            dataIndex: 'branchName',
            align: 'center',
            ...getColumnSearchProps('branchName')
        },
        {
            title:'Employee Type',
            dataIndex:'employeeType'
        },
        {
            title:'Effective Date',
            dataIndex:'createdAt',
            render:(value, record)=> {
                return value? dayjs(value).format('YYYY-MM-DD'): '-'
            }
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
        // {
        //     title: "Action",
        //     dataIndex: "action",
        //     align: "center",
        //     render: (text, rowData) => (
        //         <span>
        //             {rowData.isActive ? (
        //                 <EditOutlined
        //                     className={"editSamplTypeIcon"}
        //                     type="edit"
        //                     onClick={() => {
        //                         if (rowData.isActive) {
        //                             editLeaveType(rowData);
        //                         }
        //                     }}

        //                 />
        //             ) : (
        //                 ""
        //             )}
        //             <Divider type="vertical" />
        //             <Popconfirm
        //                 onConfirm={(e) => {
        //                     deleteLeave(rowData);
        //                 }}
        //                 title={
        //                     rowData.isActive
        //                         ? "Are you sure to Deactivate Leave Group Code  ?"
        //                         : "Are you sure to Activate Leave Group Code ?"
        //                 }
        //             >
        //                 <Switch
        //                     size="default"
        //                     disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
        //                     className={
        //                         rowData.isActive ? "toggle-activated" : "toggle-deactivated"
        //                     }
        //                     checkedChildren={<RightSquareOutlined type="check" />}
        //                     unCheckedChildren={<RightSquareOutlined type="close" />}
        //                     checked={rowData.isActive}
        //                 />
        //             </Popconfirm>
        //         </span>
        //     ),
        // },
    ];
    return (
        <>
            <PageContainer title='Leave Group Mapping' breadcrumbRender={false}
                extra={
                    <>
                        <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} icon={<PlusOutlined />} onClick={openForm}>
                            Map Branch
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
                    title={isUpdate ? "Update Leave" : "Create Leave"}
                    open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                    width="80%"
                // key={data.leaveId}
                >
                    <LeaveGroupCodeMapForm
                        key={Date.now()}
                        updateDetails={updateLeaveDetails}
                        isUpdate={isUpdate}
                        leaveCodeMapData={selectedData}
                        closeForm={closeModal}
                        getAllLeavesCodeMapData={getAllLeaveGroupData}
                        leaveGroupCodeList={leaveGroupCodeList}
                        branchList={branchList}
                        leaveGroupList={leaveGroupList}
                        employeType={employeType}
                    />
                </Modal>
            </PageContainer>
        </>
    )
}