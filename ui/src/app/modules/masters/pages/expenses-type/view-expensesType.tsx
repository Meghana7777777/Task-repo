import React, { useEffect, useRef, useState } from 'react';
import { Table, Card, Typography, Spin, message, Popconfirm, Form, Space, Button, Modal, Input } from 'antd';
import { ExpensesTypeService } from '@hrexpert/shared-services';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { SequenceUtils } from 'ui/src/app/common/utils';
import { Excel } from 'antd-table-saveas-excel';
import AddExpensesType from './add-expensesType';
import { ColumnType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';

const { Title } = Typography;

const ViewExpensesType = (props) => {
  const { scopes } = props
  const [expensesData, setExpensesData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const [selectedExpenseData, setSelectedExpenseData] = useState<any>(null);
  const expensesTypeService = new ExpensesTypeService();

  useEffect(() => {
    fetchExpensesType();
  }, []);

  const fetchExpensesType = async () => {
    setLoading(true);
    try {
      const response = await expensesTypeService.getExpensesType();
      if (response && response.status) {
        const activeExpenses = response.data.filter((expense: any) => expense.isActive);
        setExpensesData(activeExpenses || []);
      } else {
        message.error('Failed to fetch expenses data');
      }
    } catch (error) {
      message.error('Error fetching expenses data');
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

  const expensesType = [
    { title: "Expense Id", dataIndex: "expenseId" },
    { title: 'Expense Type', dataIndex: 'expenseType' },
  ];

  const preprocessData = (data) => {
    return data.map((record, index) => {
      const updatedRecord = { key: index + 1 };
      expensesType.forEach((column) => {
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
    expensesTypeService.updateExpensesType(data.expenseId, data).then((res) => {
      if (res.status) {
        message.success('Updated successfully');
        fetchExpensesType();
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
      .addSheet('expensesType')
      .addColumns(expensesType)
      .addDataSource(processedData, { str2num: false })
      .saveAs('expensesType.xlsx');
  };

  const handleDeactivate = async (expenseId: any) => {
    try {
      const response = await expensesTypeService.deactivateExpensesType(expenseId);
      if (response && response.status) {
        message.success('Expense type deactivated successfully');
        fetchExpensesType(); // Refresh data
      } else {
        message.error('Failed to deactivate expense type');
      }
    } catch (error) {
      message.error('Error deactivating expense type');
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
      dataIndex: 'expenseId',
      ...getColumnSearchProps("expenseId"),
    },
    {
      title: 'Expense Type',
      dataIndex: 'expenseType',
      ...getColumnSearchProps("expenseType"),
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'isActive',
    //   ...getColumnSearchProps("isActive"),
    //   render: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to deactivate this expense type?"
            onConfirm={() => handleDeactivate(record.expenseId)}
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
        title="Expenses Type"
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
          rowKey="expenseId"
          pagination={{ pageSize: 10 }}
        />
      </PageContainer>
      <Modal
        title={isUpdate ? "Update ExpenseType" : "Create Expenses Type"}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={window.innerWidth > 768 ? "60%" : "100%"}
      >
        <AddExpensesType
          key={isUpdate ? selectedStyleData?.expenseId : 'new Expenses Data'}
          updateDetails={updateExpenseType}
          isUpdate={isUpdate}
          closeForm={closeModal}
          expensesData={selectedStyleData || {}}
          getAllExpenses={fetchExpensesType}
        />
      </Modal>
    </>
  );
};

export default ViewExpensesType;
