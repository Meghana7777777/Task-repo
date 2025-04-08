import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { AlertMessages, DashboardReq, ScopesEnum, TypeOfLeavesDto, WeekOffLeavesActivateDeactivateDto } from "@hrexpert/shared-models";
import { BranchesService, WeekOffLeavesService } from "@hrexpert/shared-services";
import { Button, Card, Checkbox, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Switch, Table, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import WeekOffLeavesForm from "../week-off-leaves-form/week-off-leaves-form";
import WeekOffLeavesModel from "./week-off-leaves-model";
import { PageContainer } from "@ant-design/pro-layout";
import { SequenceUtils } from "../../../../../app/common/utils";
import { useIAMClientState } from '../../../../common/iam-client-react';

interface WeekOffLeavesGridIProps {
    scopes: ScopesEnum[]
}

const WeekOffLeavesGrid = (props: WeekOffLeavesGridIProps) => {
    const { scopes } = props
    const [data, setData] = useState<any>([]);
    const { Option } = Select
    const [modalVisible, setModalVisible] = useState(false);
    const [modelVisible, setModelVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [selectStyleData, setSelectStyleData] = useState<any>(null);
    const [isUpdate, setisUpdate] = useState(false)
    const [update, setUpdate] = useState(false)
    let navigate = useNavigate();
    const service = new WeekOffLeavesService();
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const [branchesData, setBranchesData] = useState([]);
    const branchservice = new BranchesService()
    const [branchId, setBranchId] = useState<any | null>(null);

    useEffect(() => {
        getAllWeekOffLeaves();
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchName: "ALL" })
        } else {
            form.setFieldsValue({ branchName: IAMClientAuthContext.user.unitId })
        }
    }, [branchId]);
    
    

    const getAllWeekOffLeaves = () => {
        try {
            const req = new DashboardReq
            if (role === 'SuperAdmin') {
                if (form.getFieldValue('branchId') !== undefined) {
                  req.branchId = form.getFieldValue('branchId');
                }
              } else {
                // For non-CentralTeam, set plantId based on user’s unitId
                req.branchId = IAMClientAuthContext.user?.unitId || null;
              }
            service.getAllWeekOffLeaves(req).then((res) => {
                if (res.status) {
                    setData(res.data)
                }
                else {
                    message.error("Failed to retrieve WeekOffLeaves");
                }
            })
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    };

    const handleUnit = (value: number | string) => {
        form.setFieldsValue({ branchId: value });
        getAllWeekOffLeaves(); // Fetch data based on the selected unit
      };
    
    const getAllBranches = () => {
        
       
        branchservice.getAllBranches().then((res) => {

            if (res.status) {
                setBranchesData([{ id: 'All', branchName: 'All' }, ...res.data]);
            } else {
                setBranchesData([]);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            setBranchesData([]);
        });
    }
    const updateWeekOffLeavesDetails = (data: TypeOfLeavesDto) => {
        console.log(data, 'data');

        service.updateWeekOffLeaves(data)
            .then((res) => {
                if (res.status) {
                    message.success("WeekOffLeaves updated successfully");
                    setModelVisible(false);
                    getAllWeekOffLeaves();
                    setUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating WeekOffLeavesDetails:", error);
            });
    };

    const deleteWeekOffLeaves = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new WeekOffLeavesActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateWeekOffLeave(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllWeekOffLeaves();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {

        setSelectedStyleData(null);
        setModalVisible(true);
    };

    const editWeekOffLeaves = (rowData: any) => {

        setSelectStyleData(rowData);
        setModelVisible(true);
        setUpdate(true);
    };

    const closedModal = () => {
        setModelVisible(false);
        setUpdate(false);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
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
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: "Branch",
            dataIndex: "branchName",
            // sorter: (a, b) => a.branchName.localeCompare(b.branchName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("branchName"),
            align: "center"
        },
        {
            title: "Week Name",
            dataIndex: "weekName",
            sorter: (a, b) => a.weekName.localeCompare(b.weekName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("weekName"),
            align: "center"
        },
        {
            title: "Employee Code",
            dataIndex: "employeeCode",
            ...getColumnSearchProps("employeeCode"),
        },
        {
            title: "Employee Name",
            dataIndex: "employeeName",
            ...getColumnSearchProps("employeeName"),
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
                                    editWeekOffLeaves(rowData); // Call editBranch with selected row data
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    <Divider type="vertical" />
                    <Popconfirm
                        onConfirm={(e) => {
                            deleteWeekOffLeaves(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate WeekOffLeaves ?"
                                : "Are you sure to Activate WeekOffLeaves?"
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
            <PageContainer
                title="Week Of Leaves"
                breadcrumbRender={false}
                extra={
                    <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                        icon={<PlusOutlined />} onClick={openForm}>
                        Add
                    </Button>
                }
                
            >
                <Form layout="vertical" form={form} >
                {IAMClientAuthContext.user.roles === 'SuperAdmin' && (<Row>
                    <Col span={8}>
                        <Form.Item
                            name="branchName"
                            label=" Filter By Branch Name"
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={role === 'SuperAdmin' ? false : true}
                                optionFilterProp='children'
                                placeholder="Select Branch"
                                // onChange={handleBranchChange} // Trigger branch selection change
                                onChange={handleUnit}
                            >
                                {branchesData.map(branch => (
                                    <Option key={branch.id} value={branch.id}>
                                        {branch.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>)}</Form>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                    }}
                    rowKey="id"
                />
            </PageContainer>

            <Modal
                title={isUpdate ? "Update WeekOffLeaves" : "Create WeekOffLeaves"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
                key={data.id}
            >
                <WeekOffLeavesForm
                    // key={Date.now()}
                    closeForm={closeModal}
                    getAllWeekOffLeaves={getAllWeekOffLeaves}
                />

            </Modal>
            <Modal title={"Update WeekOffLeaves"}
                open={modelVisible}
                onCancel={closedModal}
                footer={null}
                width="60%"
                key={data.id}>


                <WeekOffLeavesModel
                    key={Date.now()}

                    updateDetails={updateWeekOffLeavesDetails}
                    isUpdate={update}
                    leavesData={selectStyleData}
                    closeForm={closedModal}
                    getAllWeekOffLeaves={getAllWeekOffLeaves}
                />
            </Modal>

        </>
    );
};

export default WeekOffLeavesGrid;
