import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { PayrollTypesActivateDeactivateReq, ScopesEnum } from '@hrexpert/shared-models';
import { PayrollTypesSharedService } from '@hrexpert/shared-services';
import { Button, Checkbox, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import PayrollTypesForm from '../payroll-types-from/payroll-types-form';
import { SequenceUtils } from "../../../common/utils";



interface PayrollTypesGridIProps {
    scopes: ScopesEnum[]
}

const PayrollTypesGrid=(props:PayrollTypesGridIProps) =>{
    const {scopes} = props
    const [page, setPage] = React.useState(1);
    const [payrollTypesSrc, setPayrollTypesSrc] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
    const service = new PayrollTypesSharedService()

    useEffect(() => {
        getAllPayrollTypes()
    }, [])

    const getAllPayrollTypes = () => {
        try {
            service.getAllPayrollTypes().then((res) => {
                if (res.status) {
                    setPayrollTypesSrc(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const activateDeactivatePayrollTypes = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new PayrollTypesActivateDeactivateReq(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateDeactivatePayrollTypes(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllPayrollTypes();
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

    const editPayrollTypes = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
        getAllPayrollTypes()
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
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
            align: "center"
        },
        {
            title: 'Name',
            dataIndex: "name",
            ...getColumnSearchProps('name', 'Name'),
            align: "center"
        },
        {
            title: 'Description',
            dataIndex: "description",
            ...getColumnSearchProps('description', 'Description'),
            align: "center"
        },
        {
            title: "Status",
            dataIndex: "isActive",
            align: "center",
            ...getColumnSearchProps("isActive", 'Is Active'),
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
            render: (text, rowData) => (
                <span>
                    {rowData.isActive ? (
                        <EditOutlined
                            className={"editSamplTypeIcon"}
                            type="edit"
                            onClick={() => {
                                if (rowData.isActive) {
                                    editPayrollTypes(rowData);
                                }
                            }}
                            style={{ color: "#1890ff", fontSize: "14px",display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <Popconfirm
                        onConfirm={(e) => {
                            activateDeactivatePayrollTypes(rowData);
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
            <PageContainer title='Payroll Types' breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            type="primary"  disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                    </Space >
                }>
                <Table
                    dataSource={payrollTypesSrc}
                    columns={columns}
                    size={"small"}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                    }}
                    rowKey="id" />
            </PageContainer >

            <Modal
                key={payrollTypesSrc.id}
                title={isUpdate ? "Update Payroll Type" : "Create Payroll Type"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <PayrollTypesForm
                    key={Date.now()}
                    isUpdate={isUpdate}
                    payrollTypesData={selectedData}
                    closeForm={closeModal}
                />
            </Modal>
        </>
    )
}
export default PayrollTypesGrid
