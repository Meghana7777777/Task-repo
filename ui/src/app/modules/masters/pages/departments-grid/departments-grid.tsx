import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined, RightSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { DepartmentActivateDeactivateReq, DepartmentReq, ScopesEnum } from '@hrexpert/shared-models';
import { ApplForLeavesSharedService, DepartmentService } from '@hrexpert/shared-services';
import { Button, Checkbox, Divider, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import DepartmentsForm from '../departments-from/departments-form';
import { SequenceUtils } from "../../../../../app/common/utils";
import { Excel } from 'antd-table-saveas-excel';



interface DepartmentsGridIProps {
    scopes: ScopesEnum[]
}

const DepartmentsGrid=(props:DepartmentsGridIProps) =>{
    const {scopes} =props
    const [open, setOpen] = useState(false);
    const [page, setPage] = React.useState(1); 
    const [pageSize, setPageSize] = useState(50);
    const [departmentData, setDepartmentData] = useState<any>([])
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isUpdate, setisUpdate] = useState(false)
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const service = new DepartmentService()
    const services = new ApplForLeavesSharedService()
    const [selectedEmployee, setSelectedEmployee] = useState<any>([])

    useEffect(() => {
        getAllDepartments()
        getActiveEmployeesById()
    }, [])

    const getAllDepartments = () => {
        setLoading(true)
        try {
            service.getAllDepartments().then((res) => {
                if (res.status) {
                    setDepartmentData(res.data)
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

    const getActiveEmployeesById = () => {
        try {
            services.getActiveEmployeesByIds().then((res) => {
                if (res.status) {
                    setSelectedEmployee(res.data.data);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };



    const activateDeactivateDepartment = async (rowData: any) => {
        const newIsActive = !rowData.isActive;
        const req = new DepartmentActivateDeactivateReq(
            rowData.id,
            newIsActive,
            rowData.versionFlag
        );
        try {
            service.activateDeactivateDepartment(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage);
                    getAllDepartments();
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
        getAllDepartments()
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

    let i = 1;
    const departments = [
        { title: "Department", dataIndex: "name"},
        { title: 'Department Code', dataIndex: 'code' },
        { title: 'HOD', dataIndex: 'hodName' },
    ];

    const preprocessData = (data) => {
        // Filter out records where isActive is 0
        const filteredData = data.filter(record => record.isActive !== 0);
        
        return filteredData.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            departments.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };
  
  const exportExcel = () => {
  const excel = new Excel();
  const processedData = preprocessData(departmentData); 
   excel
      .addSheet('departments')
      .addColumns(departments)
      .addDataSource(processedData, { str2num: false }) 
      .saveAs('Departments.xlsx');
  };

    const columns: ColumnsType<any> = [

        {
            title: 'S No',
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center"
        },
        {
            title: 'Department',
            dataIndex: "name",
            ...getColumnSearchProps('name'),
            align: "center",
            sorter: (a, b) => a.name?.localeCompare(b.name),
        },
        {
            title: 'Department Code',
            dataIndex: "code",
            ...getColumnSearchProps('code'),
            align: "center",
            sorter: (a, b) => a.code?.localeCompare(b.code),
        },
        {
            title: 'HOD',
            dataIndex: "hod",
            ...getColumnSearchProps('hod'),
            align: "center",
            sorter: (a, b) => a.hod?.localeCompare(b.hod),
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
                            style={{ color: "#1890ff", fontSize: "14px" ,display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
                        />
                    ) : (
                        ""
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <Popconfirm
                        onConfirm={(e) => {
                            activateDeactivateDepartment(rowData);
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
            <PageContainer title='Departments' breadcrumbRender={false}
                extra={
                    <Space>
                        {/* <Button >Filter</Button> */}
                        {/* <Button icon={<ExportOutlined />} /> */}
                        <Button
                            type="primary"
                            disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)}
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button  style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                        Get Excel
                        </Button>
                    </Space >
                }>
                <Table
                    loading={loading}
                    dataSource={departmentData}
                    columns={columns}
                    size={"small"}
                    pagination={{
                        pageSize:20,
                        onChange(current,pageSize) {
                            setPage(current);
                            setPageSize(pageSize);
                        },
                    }}
                    rowKey="id" />
            </PageContainer >

            <Modal
                key={departmentData.id}
                title={isUpdate ? "Update Department" : "Create Department"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width="60%"
            >
                <DepartmentsForm
                    key={Date.now()}
                    isUpdate={isUpdate}
                    departmentData={selectedData}
                    closeForm={closeModal}
                    employeeData={selectedEmployee}
                />
            </Modal>
        </>
    )
}
export default DepartmentsGrid