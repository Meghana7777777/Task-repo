import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { BranchesActivateDeactivateDto, BranchesDto, ScopesEnum } from "@hrexpert/shared-models";
import { BranchesService, CompanySharedService } from "@hrexpert/shared-services";
import { Button, Checkbox, Divider, Form, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import BranchForm from "../branches-form/branch-form";
import { SequenceUtils } from "../../../../../app/common/utils";
import { Excel } from "antd-table-saveas-excel";



interface BranchViewIProps {
    scopes: ScopesEnum[]
}


const BranchView = (props: BranchViewIProps) => {
    const { scopes } = props
    const [data, setData] = useState<any>([]);
    const [companyRecords, setCompanyRecords] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [isUpdate, setisUpdate] = useState(false)
    let navigate = useNavigate();
    const service = new BranchesService();
    const companyService = new CompanySharedService();
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        getAllBranches();
        getActiveCompany();
    }, []);

    const getAllBranches = () => {
        try {
            service.getAllBranches().then((res) => {
                if (res.status) {
                    setData(res.data)
                }
                else {
                    message.error("Failed to retrieve branches");
                }
            })
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    };

    const getActiveCompany = () => {
        try {
            companyService.getActiveCompany().then((res) => {
                if (res.status) {
                    setCompanyRecords(res.data)
                }
                else {
                    message.error("Failed to retrieve company");
                }
            })
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    };

    const updateBranchDetails = (data: BranchesDto) => {
        console.log(data, 'data');

        service.updateBranch(data)
            .then((res) => {
                if (res.status) {
                    message.success("Branch updated successfully");
                    setModalVisible(false);
                    getAllBranches();
                    setisUpdate(false);
                } else {
                    message.error(res.internalMessage);
                }
            })
            .catch((error) => {
                console.error("Error updating branch details:", error);
            });
    };

    const deleteBranch = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new BranchesActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateBranch(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllBranches();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        // Clear selected data when opening the form for adding a new branch
        setSelectedStyleData(null);
        setModalVisible(true);
    };

    const editBranch = (rowData: any) => {
        console.log(rowData,"jjj")
        // Set the selected data when editing a branch
        setSelectedStyleData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };


    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
    };

    const getColumnSearchProps = (dataIndex: any, title: any): ColumnType<any> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${title}`}
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

    let i = 1;
    const branches = [
        { title: "Branch Name", dataIndex: "branchName" },
        { title: 'Branch Code', dataIndex: 'branchCode' },
        { title: 'Address', dataIndex: 'address' },
        { title: 'Company', dataIndex: 'companyName' },
        // { title: 'PT Applicable', dataIndex: 'ptApplicable' },
    ];

    // const preprocessData = (data) => {
    //     return data.map((record, index) => {
    //         const updatedRecord = { key: index + 1 };
    //         branches.forEach((column) => {
    //             const value = record[column.dataIndex];
    //             updatedRecord[column.dataIndex] =
    //                 value === null || value === undefined ? "" : value;
    //         });
    //         return updatedRecord;
    //     });
    // };
    const preprocessData = (data) => {
        // Filter out records where isActive is 0
        const filteredData = data.filter(record => record.isActive !== 0);

        return filteredData.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            branches.forEach((column) => {
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
            .addSheet('Branches')
            .addColumns(branches)
            .addDataSource(processedData, { str2num: false })
            .saveAs('Branches.xlsx');
    };

    const columns: ColumnsType<any> = [
        {
            title: "S.No",
            key: "sno",
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: "Branch Name",
            dataIndex: "branchName",
            sorter: (a, b) => a.branchName.localeCompare(b.branchName),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("branchName", "Branch Name"),
            align: "center"
        },
        {
            title: "Branch Code",
            dataIndex: "branchCode",
            ...getColumnSearchProps("branchCode", "Branch Code"),
            align: "center"
        },
        {
            title: "State",
            dataIndex: "state",
            ...getColumnSearchProps("state", 'State'),
            align: "center"
        },
        {
            title: "Address",
            dataIndex: "address",
            ...getColumnSearchProps("address", 'Address'),
            align: "center"
        },
        {
            title: "Company",
            dataIndex: "companyName",
            ...getColumnSearchProps("companyName", "Company"),
            align: "center"
        },
        {
            title: "Unit Name",
            dataIndex: "unitName",
            ...getColumnSearchProps("unitName", "Unit Name"),
            align: "center"
        },
        // {
        //     title: "PT Applicable",
        //     dataIndex: "ptApplicable",
        //     align: "center"
        // },
        {
            title: "Is Employee",
            dataIndex: "isEmployee",
            ...getColumnSearchProps("isEmployee", "Is Employee"),
            align: "center",
            render: (text) => text === 1 ? "Yes" : text === 0 ? "No" : null
        },
        {
            title: "Is Worker",
            dataIndex: "isWorker",
            ...getColumnSearchProps("isWorker", "Is Worker"),
            align: "center",
            render: (text) => text === 1 ? "Yes" : text === 0 ? "No" : null
        },
        {
            title: "Status",
            dataIndex: "isActive",
            align: "center",
            ...getColumnSearchProps("isActive", 'Status'),
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
                                    editBranch(rowData);
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
                            deleteBranch(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate Branch ?"
                                : "Are you sure to Activate Branch?"
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
            <PageContainer title='Branches' breadcrumbRender={false}
                extra={
                    <>
                        <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} icon={<PlusOutlined />} onClick={openForm}>
                            Add
                        </Button>
                        <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                            Get Excel
                        </Button>
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
                    bordered
                />

                <Modal
                    title={isUpdate ? "Update Branch" : "Create Branch"}
                    open={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                    width="60%"
                    key={data.id}
                >
                    <BranchForm
                        key={Date.now()}
                        updateDetails={updateBranchDetails}
                        isUpdate={isUpdate}
                        branchData={selectedStyleData}
                        closeForm={closeModal}
                        getAllBranches={getAllBranches}
                        companyRecords={companyRecords}
                    />

                </Modal>

            </PageContainer>
        </>
    );
};

export default BranchView;
