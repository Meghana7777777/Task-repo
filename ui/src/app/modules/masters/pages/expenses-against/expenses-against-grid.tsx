import React, { useEffect, useRef, useState } from 'react';
import { Table, Card, Typography, Spin, message, Popconfirm, Form, Space, Button, Modal, Input } from 'antd';
import { ExpensesAganistService, ExpensesTypeService } from '@hrexpert/shared-services';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Excel } from 'antd-table-saveas-excel';
import AddExpensesAgainst from './expenses-against-form';
import Highlighter from 'react-highlight-words';
import { ColumnType } from 'antd/es/table';

const { Title } = Typography;

const ViewExpensesAgainst = (props) => {
    const { scopes } = props
    const [expensesData, setExpensesData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef(null);
    const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedExpenseData, setSelectedExpenseData] = useState<any>(null);
    const expensesAgainstService = new ExpensesAganistService();

    useEffect(() => {
        fetchExpensesAgainst();
    }, []);

    const fetchExpensesAgainst = async () => {
        setLoading(true);
        try {
            const response = await expensesAgainstService.getExpensesAgainst();
            if (response && response.status) {
                const activeExpenses = response.data.filter((expense: any) => expense.isActive);
                setExpensesData(activeExpenses || []);
            } else {
                message.error('Failed to fetch expenses Against data');
            }
        } catch (error) {
            message.error('Error fetching expenses Against data');
        } finally {
            setLoading(false);
        }
    };

    const openForm = () => {
        setSelectedStyleData(null);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setIsUpdate(false);
    };

    const expensesAgainst = [
        { title: "expense Against Id", dataIndex: "expenseAgainstId" },
        { title: 'Expense Against', dataIndex: 'expenseAgainst' },
    ];

    const preprocessData = (data) => {
        return data.map((record, index) => {
            const updatedRecord = { key: index + 1 };
            expensesAgainst.forEach((column) => {
                const value = record[column.dataIndex];
                updatedRecord[column.dataIndex] =
                    value === null || value === undefined ? "" : value;
            });
            return updatedRecord;
        });
    };

    const editExpenseType = (expense: any) => {
        setSelectedExpenseData(expense);
        setSelectedStyleData(expense);
        setIsUpdate(true);
        setModalVisible(true);
    };

    const updateExpenseType = (data: any) => {
        expensesAgainstService.updateExpensesAgainst(data.expenseAgainstId, data).then((res) => {
            if (res.status) {
                message.success('Updated successfully');
                fetchExpensesAgainst();
                setModalVisible(false);
            } else {
                message.error(res.internalMessage);
            }
        })
    }

    const exportExcel = () => {
        const excel = new Excel();
        const processedData = preprocessData(expensesData);
        excel
            .addSheet('expensesAgainst')
            .addColumns(expensesAgainst)
            .addDataSource(processedData, { str2num: false })
            .saveAs('expensesAgainst.xlsx');
    };

    const handleDeactivate = async (expenseAgainstId: any) => {
        try {
            const response = await expensesAgainstService.deactivateExpensesAgainst(expenseAgainstId);
            if (response && response.status) {
                message.success('Expense Against deactivated successfully');
                fetchExpensesAgainst();
            } else {
                message.error('Failed to deactivate expense Against');
            }
        } catch (error) {
            message.error('Error deactivating expense Against');
        }
    };

    function handleSearch(selectedKeys: any, confirm: any, dataIndex: any) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }

    function handleReset(clearFilters: any) {
        clearFilters();
        setSearchText("");
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'expenseAgainstId',
            key: 'expenseAgainstId',
            ...getColumnSearchProps('expenseAgainstId')
        },
        {
            title: 'Expense Against',
            dataIndex: 'expenseAgainst',
            ...getColumnSearchProps('expenseAgainst')

        },
        // {
        //     title: 'Status',
        //     dataIndex: 'isActive',
        //     key: 'isActive',
        //     ...getColumnSearchProps('isActive'),
        //     render: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
        // },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure you want to deactivate this expense Against?"
                        onConfirm={() => handleDeactivate(record.expenseAgainstId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer', fontSize: '16px' }} />
                    </Popconfirm>
                    <EditOutlined
                        style={{ color: "#1890ff", fontSize: "13px", cursor: 'pointer' }}
                        onClick={() => editExpenseType(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <PageContainer
                title="Expenses Against"
                breadcrumbRender={false}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openForm}
                        >
                            Add
                        </Button>
                        <Button style={{ border: "1px dashed #22f534", color: "green", fontWeight: "bold" }} type="dashed" onClick={() => exportExcel()}>
                            Get Excel
                        </Button>

                    </Space>
                }
            >
                <Table
                    dataSource={expensesData}
                    columns={columns}
                    rowKey="expenseAgainstId"
                    pagination={{ pageSize: 10 }}
                />
            </PageContainer>
            <Modal
                title={isUpdate ? "Update Expense Against" : "Create Expenses Against"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={window.innerWidth > 768 ? "60%" : "100%"}
            >
                <AddExpensesAgainst
                    key={isUpdate ? selectedStyleData?.expenseAgainstId : 'new Expenses Data'}
                    updateDetails={updateExpenseType}
                    isUpdate={isUpdate}
                    closeForm={closeModal}
                    data={selectedStyleData || {}}
                    getAllExpensesAgainst={fetchExpensesAgainst}
                />
            </Modal>
        </>
    );
};

export default ViewExpensesAgainst;
