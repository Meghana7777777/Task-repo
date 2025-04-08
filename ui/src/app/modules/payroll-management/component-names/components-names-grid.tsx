import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { ComponentNamesActivateDeactivateDto, ScopesEnum } from '@hrexpert/shared-models';
import { ComponentNamesSharedService } from '@hrexpert/shared-services';
import { Button, Checkbox, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { SequenceUtils } from "../../../common/utils";
import ComponentNamesForm from './components-names-form';

interface ComponentNamesGridIProps {
    scopes: ScopesEnum[]
}

const ComponentNamesGrid = (props: ComponentNamesGridIProps) => {
    const { scopes } = props
    const [open, setOpen] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [componentNames, setcomponentNames] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const service = new ComponentNamesSharedService()

    useEffect(() => {
        getComponentsNames()
    }, [])

    const getComponentsNames = () => {
        setLoading(true)
        try {
            service.getComponentsNames().then((res) => {
                if (res.status) {
                    setcomponentNames(res.data)
                    setLoading(false)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }


    const activateOrDeactivateComponentsNames = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new ComponentNamesActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivateComponentsNames(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getComponentsNames();
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const openForm = () => {
        setSelectedData(null);
        setModalVisible(true);
    };

    const editDepartment = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
        getComponentsNames()
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
            title: 'S No',
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center",
            width: "40px",
        },
        {
            title: 'Component Name',
            dataIndex: "componentName",
            ...getColumnSearchProps('componentName'),
            align: "center",
            width: "170px",
        },
        {
            title: 'Component Code',
            dataIndex: "componentNameCode",
            ...getColumnSearchProps('componentNameCode'),
            align: "center",
            width: "140px",
        },
        {
            title: 'Type',
            dataIndex: "type",
            ...getColumnSearchProps('type'),
            align: "center",
            render: (text) => text ? text : '-',
            width: "70px",
        },
        {
            title: 'Round Strg',
            dataIndex: "roundStrg",
            ...getColumnSearchProps('roundStrg'),
            align: "center",
            render: (text) => text ? text : '-',
            width: "120px",
        },
        {
            title: 'Component Type',
            dataIndex: "componentType",
            ...getColumnSearchProps('componentType'),
            align: "center",
            render: (text) => text ? text : '-',
            width: "150px",
        },
        {
            title: 'Is Derived',
            dataIndex: "isDerived",
            ...getColumnSearchProps('isDerived'),
            align: "center",
            sorter: (a, b) => a.isDerived?.toString().localeCompare(b.isDerived.toString()),
            render: (value) => value === true || value === 1 ? <CheckCircleOutlined style={{ color: 'green', fontSize: "15px" }} /> : <CloseCircleOutlined style={{ color: 'red', fontSize: "15px" }} />
        },
        {
            title: 'Cut Off Amount',
            dataIndex: "cutOffAmount",
            ...getColumnSearchProps('cutOffAmount'),
            align: "center",
            width: "60px",
            sorter: (a, b) => a.cutOffAmount?.toString().localeCompare(b.cutOffAmount.toString()),
            render: (value) => value === true || value === 1 ? <CheckCircleOutlined style={{ color: 'green', fontSize: "15px" }} /> : <CloseCircleOutlined style={{ color: 'red', fontSize: "15px" }} />
        },
        {
            title: 'Fixed Amount',
            dataIndex: "calculatedRule",
            ...getColumnSearchProps('calculatedRule'),
            align: "center",
            width: "130px",
            sorter: (a, b) => a.calculatedRule?.toString().localeCompare(b.calculatedRule.toString()),
            render: (value) => value === true || value === 1 ? <CheckCircleOutlined style={{ color: 'green', fontSize: "15px" }} /> : <CloseCircleOutlined style={{ color: 'red', fontSize: "15px" }} />
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
            title: 'Action',
            align: "center",
            width: "130px",
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editDepartment(rowData);
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <Popconfirm
                        onConfirm={(e) => {
                            activateOrDeactivateComponentsNames(rowData);
                        }}
                        title={
                            rowData.isActive
                                ? "Are you sure to Deactivate ?"
                                : "Are you sure to Activate ?"
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
        }
    ]

    return (
        <>
            <PageContainer title='Component Name' breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                    </Space >
                }>
                <Table
                    loading={loading}
                    bordered
                    dataSource={componentNames}
                    columns={columns}
                    size={"small"}
                    pagination={{
                        pageSize: 20,
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="id" />
            </PageContainer >

            <Modal
                key={componentNames.id}
                title={isUpdate ? "Update Component Name" : "Create Component Name"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <ComponentNamesForm
                    key={Date.now()}
                    isUpdate={isUpdate}
                    componentNames={selectedData}
                    closeForm={closeModal}
                />
            </Modal>
        </>
    )
}
export default ComponentNamesGrid