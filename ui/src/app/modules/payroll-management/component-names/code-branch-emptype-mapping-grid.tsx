import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { PayrollCodeBranchMappingActivateDeactivateDto, ScopesEnum } from '@hrexpert/shared-models';
import { BranchesService, EmployeeTypeService, PayrollCodeBranchMappingSharedService, PayrollComponentsSharedService } from '@hrexpert/shared-services';
import { Button, Checkbox, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { SequenceUtils } from "../../../common/utils";
import CodeBranchEmpTypeForm from './code-branch-emptype-mapping-form';

interface CodeBranchEmpTypeGridIProps {
    scopes: ScopesEnum[]
    branches?: any
    employeType?: any
    data?: any
}

const CodeBranchEmpTypeGrid = (props: CodeBranchEmpTypeGridIProps) => {
    const { scopes } = props
    const [open, setOpen] = useState(false);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [payrollCodeBranch, setPayrollCodeBranch] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const service = new PayrollCodeBranchMappingSharedService()
    const branchesService = new BranchesService()
    const [branches, setBranches] = useState<any>([])
    const empTypeService = new EmployeeTypeService()
    const [employeType, setEmployeType] = useState<any>([]);
    const payrollService = new PayrollComponentsSharedService();
    const [data, setData] = useState([]);
    useEffect(() => {
        getPayrollCodeBranchMapping()
        getBranches()
        getActiveEmployeeType()
        getAllPayrollCodesData()
    }, [])

    const getBranches = () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

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

    const getAllPayrollCodesData = () => {
        payrollService.getAllPayrollCodesData().then((res) => {
            if (res.status) {
                setData(res.data)
            } else {
                setData([])
            }
        })
    }

    const getPayrollCodeBranchMapping = () => {
        setLoading(true)
        try {
            service.getPayrollCodeBranchMapping().then((res) => {
                if (res.status) {
                    setPayrollCodeBranch(res.data)
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


    const activateOrDeactivatePayrollCodeBranchMapping = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new PayrollCodeBranchMappingActivateDeactivateDto(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateOrDeactivatePayrollCodeBranchMapping(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getPayrollCodeBranchMapping();
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

    const editPayrollCodeBranchMapping = (rowData: any) => {
        setSelectedData(rowData);
        setModalVisible(true);
        setisUpdate(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setisUpdate(false);
        getPayrollCodeBranchMapping()
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
            width: "40px"
        },
        {
            title: 'Payroll Code',
            dataIndex: "payrollCode",
            ...getColumnSearchProps('payrollCode'),
            align: "center",
            sorter: (a, b) => a.payrollCode?.localeCompare(b.payrollCode),
            width: "500px"
        },
        {
            title: 'Branch',
            dataIndex: "branchName",
            ...getColumnSearchProps('branchName'),
            align: "center",
            sorter: (a, b) => a.branchName?.localeCompare(b.branchName),
            width: "240px"
        },
        {
            title: 'Employee Type',
            dataIndex: "employeeTypeName",
            ...getColumnSearchProps('employeeTypeName'),
            align: "center",
            sorter: (a, b) => a.employeeTypeName?.localeCompare(b.employeeTypeName),
            width: "150px"
        },
    ]


    return (
        <>
            <PageContainer title='Payroll Code Mapping' breadcrumbRender={false}
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
                    dataSource={payrollCodeBranch}
                    columns={columns}
                    size={"small"}
                    bordered
                    pagination={{
                        pageSize: 20,
                        onChange(current, pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    scroll={{ y: 'calc(70vh-80px)' }}
                    rowKey="id" />
            </PageContainer >

            <Modal
                key={payrollCodeBranch.id}
                title={isUpdate ? "Update Payroll Code Mapping" : "Create Payroll Code Mapping"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <CodeBranchEmpTypeForm
                    key={Date.now()}
                    isUpdate={isUpdate}
                    payrollCodeBranch={selectedData}
                    closeForm={closeModal}
                    branches={branches}
                    employeType={employeType}
                    data={data}
                />
            </Modal>
        </>
    )
}
export default CodeBranchEmpTypeGrid