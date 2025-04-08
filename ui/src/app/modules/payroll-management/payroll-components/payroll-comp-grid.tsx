import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { PayrollComponentsActivateDeactivateReq, ScopesEnum } from '@hrexpert/shared-models';
import { PayrollComponentsSharedService } from '@hrexpert/shared-services';
import { Button, Checkbox, Input, message, Modal, Popconfirm, Space, Switch, Table, Tabs, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { SequenceUtils } from "../../../common/utils";
import PayrollComponentsForm from './payroll-comp-form';



interface PayrollComponentsGridIProps {
    scopes: ScopesEnum[]
}

const PayrollComponentsGrid = (props: PayrollComponentsGridIProps) => {
    const { scopes } = props
    const [page, setPage] = React.useState(1);
    const [payrollComponentsSrc, setPayrollComponetsSrc] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
    const service = new PayrollComponentsSharedService()

    useEffect(() => {
        getAllPayrollComponents()
    }, [])

    const getAllPayrollComponents = () => {
        try {
            service.getAllPayrollComponents().then((res) => {
                if (res.status) {
                    setPayrollComponetsSrc(res.data)
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const activateDeactivatePayrollComponents = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new PayrollComponentsActivateDeactivateReq(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateDeactivatePayrollComponents(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllPayrollComponents();
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

    const editPayrollComponents = (rowData: any) => {
        rowData.effDate = dayjs(rowData.effDate, 'DD-MM-YYYY');
        let isDerived;
        if (rowData.isDerived === 1) {
            isDerived = "Yes";
        } else if (rowData.isDerived === 0) {
            isDerived = "No";
        } else {
            isDerived = '-';
        }
        let isPfEarning;
        if (rowData.isPfEarning === 1) {
            isPfEarning = "Yes";
        } else if (rowData.isPfEarning === 0) {
            isPfEarning = "No";
        } else {
            isPfEarning = '-';
        }
        let isEsiEarning;
        if (rowData.isEsiEarning === 1) {
            isEsiEarning = "Yes";
        } else if (rowData.isEsiEarning === 0) {
            isEsiEarning = "No";
        } else {
            isEsiEarning = '-';
        }
        rowData.isDerived = isDerived;
        rowData.isPfEarning = isPfEarning;
        rowData.isEsiEarning = isEsiEarning;
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };


    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
        getAllPayrollComponents()
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
            align: "center",
            width: "40px",
        },
        {
            title: 'Employee Type',
            dataIndex: "employeeType",
            ...getColumnSearchProps('employeeType', 'Employee Type'),
            align: "center",
            render: (text, record) => {
                return record.employeeType ? record.employeeType : "-"
            },
            width: 130,
            fixed:"left"
        },
        {
            title: 'Branch',
            dataIndex: "branchName",
            ...getColumnSearchProps('branchName', 'Branch'),
            align: "center",
            render: (text, record) => {
                return record.branchName ? record.branchName : "-"
            },
            width: 130,
            fixed:"left"
        },
        {
            title: 'Component Name',
            dataIndex: "componentName",
            ...getColumnSearchProps('componentName', 'Component Name'),
            align: "center",
            width: 120
        },
        {
            title: 'Column Name',
            dataIndex: "columnName",
            ...getColumnSearchProps('columnName', 'Column Name'),
            align: "center",
            width: 120
        },
        {
            title: 'Column Order',
            dataIndex: "columnOrder",
            ...getColumnSearchProps('columnOrder', 'Column Order'),
            align: "center",
            render: (text, record) => {
                return record.columnOrder ? record.columnOrder : "-"
            },
            width: 80
        },
        {
            title: 'Is Derived',
            dataIndex: "isDerived",
            align: "center",
            render: (text, record) => {
                return record.isDerived === 1 ? "Yes" : record.isDerived === 0 ? "No" : ""
            },
            width: 80
        },
        {
            title: 'Derived Rule',
            dataIndex: "derivedRule",
            ...getColumnSearchProps('derivedRule', 'Derived Rule'),
            align: "center",
            render: (text, record) => {
                return record.derivedRule ? record.derivedRule : "-"
            },
            width: 130
        },
        {
            title: 'Cutoff Amount',
            dataIndex: "cutoffAmount",
            ...getColumnSearchProps('cutoffAmount', 'Derived Rule'),
            align: "center",
            render: (text, record) => {
                return record.cutoffAmount ? record.cutoffAmount : "-"
            },
            width: 80
        },
        {
            title: 'Calculated Amount',
            dataIndex: "amount",
            ...getColumnSearchProps('amount', 'Calculated Rule'),
            align: "center",
            render: (text, record) => {
                return record.amount ? record.amount : "-"
            },
            width: 150
        },
        {
            title: 'Round Strg',
            dataIndex: "roundStrg",
            ...getColumnSearchProps('roundStrg', 'Round Strg'),
            align: "center",
            width: 100
        },
        {
            title: 'Eff Date',
            dataIndex: "effDate",
            ...getColumnSearchProps('effDate', 'Eff Date'),
            align: "center",
            width: 90,
            render:(text)=>text?text:"-"
        },
        {
            title: 'Type',
            dataIndex: "type",
            ...getColumnSearchProps('type', 'Type'),
            align: "center",
            width: 120,
            render:(text)=>text?text:"-"
        },
        {
            title: 'Component Type',
            dataIndex: "componentType",
            ...getColumnSearchProps('componentType', 'Component Type'),
            align: "center",
            width: 110,
            render:(text)=>text?text:"-"
        },
        {
            title: 'Is Gross Derived',
            dataIndex: "isGrossDerived",
            align: "center",
            ...getColumnSearchProps('isGrossDerived', 'Is Gross Dervied'),
            render: (text, record) => {
                return record.isGrossDerived === 1 ? "Yes" : record.isGrossDerived === 0 ? "No" : "-"
            },
            width: 80
        },
        {
            title: 'Is PF Earning',
            dataIndex: "isPfEarning",
            align: "center",
            render: (text, record) => {
                return record.isPfEarning === 1 ? "Yes" : record.isPfEarning === 0 ? "No" : "-"
            },
            width: 100
        },
        {
            title: 'Is ESI Earning',
            dataIndex: "isEsiEarning",
            align: "center",
            render: (text, record) => {
                return record.isEsiEarning === 1 ? "Yes" : record.isEsiEarning === 0 ? "No" : "-"
            },
            width: 100
        },
        // {
        //     title: "Status",
        //     dataIndex: "isActive",
        //     align: "center",
        //     width:"70px",
        //     ...getColumnSearchProps("isActive", 'Is Active'),
        //     render: (isActive, rowData) => (
        //         <>
        //             {isActive ? (
        //                 <Tag icon={<CheckCircleOutlined />} color="#87d068">
        //                     Active
        //                 </Tag>
        //             ) : (
        //                 <Tag icon={<CloseCircleOutlined />} color="#f50">
        //                     Inactive
        //                 </Tag>
        //             )}
        //         </>
        //     ),
        //     filterIcon: (filtered: boolean) => (
        //         <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        //     ),
        //     filterDropdown: ({
        //         setSelectedKeys,
        //         selectedKeys,
        //         confirm,
        //         clearFilters,
        //     }: any) => (
        //         <div
        //             className="custom-filter-dropdown"
        //             style={{ flexDirection: "row", marginLeft: 10 }}
        //         >
        //             <Checkbox
        //                 checked={selectedKeys.includes('Active')}
        //                 onChange={() =>
        //                     setSelectedKeys(
        //                         selectedKeys.includes('Active') ? [] : ['Active']
        //                     )
        //                 }
        //             >
        //                 <span style={{ color: "green" }}>Active</span>
        //             </Checkbox>
        //             <Checkbox
        //                 checked={selectedKeys.includes('Inactive')}
        //                 onChange={() =>
        //                     setSelectedKeys(
        //                         selectedKeys.includes('Inactive') ? [] : ['Inactive']
        //                     )
        //                 }
        //             >
        //                 <span style={{ color: "red" }}>Inactive</span>
        //             </Checkbox>
        //             <div className="custom-filter-dropdown-btns">
        //                 <Button
        //                     onClick={() => {
        //                         handleReset(clearFilters);
        //                         confirm();
        //                     }}
        //                     className="custom-reset-button"
        //                 >
        //                     Reset
        //                 </Button>
        //                 <Button
        //                     type="primary"
        //                     style={{ margin: 10 }}
        //                     onClick={() => confirm()}
        //                     className="custom-ok-button"
        //                 >
        //                     OK
        //                 </Button>
        //             </div>
        //         </div>
        //     ),
        //     onFilter: (value, record) => {
        //         if (typeof value === 'string') {
        //             const status = record.isActive ? 'Active' : 'Inactive';
        //             return value === status;
        //         }
        //         return false;
        //     },
        // },
        // {
        //     title: 'Action',
        //     align: "center",
        //     width: 120,
        //     render: (text, rowData) => (
        //         <span>
        //             {rowData.isActive ? (
        //                 <EditOutlined
        //                     className={"editSamplTypeIcon"}
        //                     type="edit"
        //                     onClick={() => {
        //                         if (rowData.isActive) {
        //                             editPayrollComponents(rowData);
        //                         }
        //                     }}
        //                     style={{ fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
        //                 />
        //             ) : (
        //                 ""
        //             )}
        //             &nbsp; &nbsp; &nbsp;
        //             <Popconfirm
        //                 onConfirm={(e) => {
        //                     activateDeactivatePayrollComponents(rowData);
        //                 }}
        //                 title={
        //                     rowData.isActive
        //                         ? "Are you sure to Deactivate ?"
        //                         : "Are you sure to Activate ?"
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
        // }
    ]

    const groupedData = payrollComponentsSrc.reduce((acc, item) => {
        acc[item.payrollType] = acc[item.payrollType] || [];
        acc[item.payrollType].push(item);
        return acc;
    }, {});


    return (
        <>
            <PageContainer title='Payroll Components' breadcrumbRender={false}
                // extra={
                //     <Space>
                //         <Button
                //             type="primary"
                //             disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                //             icon={<PlusOutlined />}
                //             onClick={openForm}
                //         >
                //             Add
                //         </Button>
                //     </Space >
                // }
                >
                <Tabs>
                    {Object.keys(groupedData).map((type) => (
                        <Tabs.TabPane tab={type} key={type}>
                            <Table
                                pagination={{
                                    current: page,
                                    pageSize: 10,
                                    onChange: (pageNumber) => setPage(pageNumber),
                                }}
                                dataSource={groupedData[type]}
                                columns={columns}
                                size='small'
                                scroll={{ y: 'calc(70vh - 100px)' }}
                                rowKey="id"
                            />
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </PageContainer >

            <Modal
                key={payrollComponentsSrc.id}
                title={isUpdate ? "Update Payroll Component" : "Create Payroll Component"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <PayrollComponentsForm
                    key={Date.now()}
                    isUpdate={isUpdate}
                    payrollComponentsData={selectedData}
                    closeForm={closeModal}
                />
            </Modal>
        </>
    )
}
export default PayrollComponentsGrid