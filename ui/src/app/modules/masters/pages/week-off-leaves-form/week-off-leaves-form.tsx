import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { AlertMessages, WeeksEnum } from '@hrexpert/shared-models';
import { BranchesService, EmployeeFilterReq, EmployeeOnboardingService, WeekOffLeavesService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, message, Pagination, Row, Select, Space, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { useIAMClientState } from '../../../../common/iam-client-react';


interface Props {
    closeForm: () => void;
    getAllWeekOffLeaves: () => void;
}



export default function WeekOffLeavesForm(props: Props) {
    const [searchedColumn, setSearchedColumn] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const searchInput = useRef(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);
    const [form] = Form.useForm();
    const service = new WeekOffLeavesService();
    const [disable, setDisable] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const empService: EmployeeOnboardingService = new EmployeeOnboardingService()
    const branchservice = new BranchesService()
    const [branchesData, setBranchesData] = useState([]);
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;



    const [branchId, setBranchId] = useState<any | null>(null);
    const { Option } = Select
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0, // Add total for pagination control
    });

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
        }));
        getEmployeeData({ page, pageSize });
    };


    useEffect(() => {
        
        getAllBranches();
        if (IAMClientAuthContext.user.roles === "SuperAdmin") {
            form.setFieldsValue({ branchName: "ALL" })
        } else {
            form.setFieldsValue({ branchName: IAMClientAuthContext.user.unitId })
        }
        getEmployeeData();
    }, [branchId]);


    

    const getEmployeeData = (filters?: {
        department?: string;
        designation?: string;
        page?: number;
        pageSize?: number;
        branchId?: string; // Include branchId as an optional filter
    }) => {
        setLoading(true); // Start loading indicator

        // Default pagination state
        const { current, pageSize } = pagination;
        const requestPayload: EmployeeFilterReq = {
            ...filters,
            page: filters?.page || current, // Use provided page or current page
            pageSize: filters?.pageSize || pageSize, // Use provided page size or default
            branchId: filters?.branchId ? Number(filters.branchId) : branchId,
        };
        const formValues = form.getFieldsValue();
        if (IAMClientAuthContext.user.roles === "SuperAdmin" && formValues.branchName === "ALL") {
            requestPayload.branchId = null; // "ALL" translates to null
        } else {
            requestPayload.branchId = formValues.branchName; // Send selected branch ID
        }
        empService.getAllWeekEmployees(requestPayload)
            .then((res) => {
                if (res.status) {
                    setData(res.data || []); // Update data state
                    setPagination((prev) => ({
                        ...prev,
                        total: res.totalCount || prev.total, // Update total count if available
                    }));
                } else {
                    message.error("No data found"); // Handle no data case
                }
            })
            .catch((err) => {
                console.error(err);
                message.error("An error occurred while fetching data"); // Handle errors
            })
            .finally(() => {
                setLoading(false); // Stop loading indicator
            });
    };




    const getAllBranches = () => {
        if (branchId === "ALL") {
            form.setFieldsValue({ branchName: null }); // Map "ALL" to null
        } else {
            form.setFieldsValue({ branchName: branchId }); // Set selected branch ID
        }

        branchservice.getAllBranches().then((res) => {

            if (res.status) {
                setBranchesData(res.data);
            } else {
                setBranchesData([]);
            }
        }).catch((err) => {
            AlertMessages.getErrorMessage(err.message);
            setBranchesData([]);
        });
    }



    const createWeekOffLeaves = async (val: any) => {
        if (!selectedRows || selectedRows.length === 0) {
            message.error('Please select at least one employee before submitting.');
            return;
        }

        try {
            setDisable(true);
            const weekOffLeavesData = {
                ...val,
                employee: selectedRows,
            };
            const res = await service.createWeekOffLeaves(weekOffLeavesData);
            if (res.status) {
                message.success('Created successfully');
                onReset()
                props.closeForm();
                props.getAllWeekOffLeaves();
            } else {
                message.error(res.internalMessage + `${res.data ? selectedRows.find((rec) => rec.employeeId === res.data).firstName : ''}` || 'Something went wrong');
            }
        } catch (error) {
            message.error(error?.internalMessage || 'An unexpected error occurred');
            console.error('Error creating week off leave:', error);
        } finally {
            setDisable(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    const handleBranchChange = (value) => {
        setBranchId(value); // Set selected branch ID
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        const selectedRowsData = data.filter(row => newSelectedRowKeys.includes(row.employeeId));
        setSelectedRows(selectedRowsData);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
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
            title: 'S.No',
            key: 'sno',
            render: (text, object, index) => (page - 1) * 10 + (index + 1),
        },
        {
            title: 'Employee Code',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            ...getColumnSearchProps("employeeCode"),
        },
        {
            title: 'Employee Name',
            dataIndex: 'firstName',
            key: 'firstName',
            ...getColumnSearchProps("firstName"),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            sorter: (a, b) => a.department.localeCompare(b.department),
            ...getColumnSearchProps("department"),
        },
    ];

    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={createWeekOffLeaves}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="weekName"
                            label="Week Name"
                            rules={[{ required: true, message: 'Please Select WeekName' }]}
                        >
                            <Select placeholder="Select Week Type">
                                {(Object.keys(WeeksEnum) as Array<keyof typeof WeeksEnum>).map(week => (
                                    <Select.Option value={WeeksEnum[week]} key={WeeksEnum[week]}>
                                        {WeeksEnum[week]}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>


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
                                onChange={handleBranchChange} // Trigger branch selection change
                            >
                                {branchesData.map(branch => (
                                    <Option key={branch.id} value={branch.id}>
                                        {branch.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}



                            rowKey="employeeId"
                        />
                    </Col>

                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            style={{ marginTop: "20px", float: "right" }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                                disabled={disable}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                                style={{ marginLeft: 20, marginTop: 23 }}
                                disabled={disable}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Card>
    );
}
