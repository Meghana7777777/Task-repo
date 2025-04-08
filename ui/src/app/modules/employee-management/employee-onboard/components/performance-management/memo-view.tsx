import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ApplyLeaveBrachDto, MemoActivateDeactivateReq, ScopesEnum } from "@hrexpert/shared-models";
import { ApplForLeavesSharedService, MemoSharedService } from "@hrexpert/shared-services";
import { Button, Input, message, Modal, Space, Table } from "antd";
import { ColumnProps, ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useIAMClientState } from "../../../../../common/iam-client-react";
import { SequenceUtils } from "../../../../../common/utils";
import MemoForm from "./memo-form";
interface MemoGridProps {
  scopes: ScopesEnum[]
}

const MemoView = (props: MemoGridProps) => {
  const { scopes } = props
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(20);
  const [data, setData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false)
  const [isUpdate, setisUpdate] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null);
  const { IAMClientAuthContext } = useIAMClientState();
  const [selectedEmployee, setSelectedEmployee] = useState<any>([]);
  const services = new ApplForLeavesSharedService()
  const memoService = new MemoSharedService()

  useEffect(() => {
    getActiveEmployeesById()
    getAllMemo()
  }, []);

  const getActiveEmployeesById = () => {
    try {
      const req = new ApplyLeaveBrachDto();
      if (IAMClientAuthContext.user?.roles === "SuperAdmin") {
        req.branchId = null;
      } else {
        req.branchId = IAMClientAuthContext.user?.unitId || null;
      }

      services.getActiveEmployeesByIds(req).then((res) => {
        if (res.status) {
          setSelectedEmployee(res.data.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getAllMemo = () => {
    try {
      memoService.getAllMemo().then((res) => {
        if (res.status) {
          setData(res.data)
        }
        else {
          message.error(res.internalMessage)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const activateOrDeactivateMemo = async (rowData: any) => {
    const newIsActive = !rowData.isActive;
    const req = new MemoActivateDeactivateReq(
      rowData.id,
      newIsActive,
      rowData.versionFlag
    );
    try {
      memoService.activateOrDeactivateMemo(req).then((res) => {
        if (res.status) {
          message.success(res.internalMessage);
          getAllMemo();
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }
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

  const openForm = () => {
    setSelectedData(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setisUpdate(false);
    getAllMemo()
  };

  const editMemo = (rowData: any) => {
    setSelectedData(rowData);
    setModalVisible(true);
    setisUpdate(true);
  };

  const columns: ColumnProps<any>[] = [
    {
      title: "S.No",
      key: "sno",
      fixed: 'left',
      width: 40,
      align: "center",
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    // {
    //   title: "Employee Name",
    //   align: "center",
    //   dataIndex:"employeeName",
    //   width: 100,
    //   ...getColumnSearchProps("employeeName", "Employee Name"),
    // },
    {
      title: "Date",
      dataIndex: "date",
      align: "center",
      width: 70,
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("date", "date"),
      render: (text) => (text) ? dayjs(text).format("DD-MM-YYYY") : "-"
    },
    {
      title: "Type",
      align: "center",
      dataIndex: "type",
      width: 120,
      ...getColumnSearchProps("type", "Type"),
    },
    {
      title: "Feedback On",
      align: "center",
      dataIndex: "employeeName",
      width: 200,
      ...getColumnSearchProps("employeeName", "Feedback On"),
      render: (text, record) => `${record.employeeName} - ${record.employeeCode}`,
    },
    {
      title: "Description",
      align: "center",
      dataIndex: "description",
      width: 350,
      ...getColumnSearchProps("description", "Description"),
      render: (text) => (
        <div>
          {text.split("\n").map((item, index) => (
            <div key={index}>&bull; {item}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Impact On Bussiness",
      align: "center",
      dataIndex: "impactOnBussiness",
      width: 100,
      ...getColumnSearchProps("impactOnBussiness", "Impact On Bussiness"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "isActive",
    //   align: "center",
    //   width: 100,
    //   render: (isActive, rowData) => (
    //     <>
    //       {isActive ? (
    //         <Tag icon={<CheckCircleOutlined />} color="#87d068">
    //           Active
    //         </Tag>
    //       ) : (
    //         <Tag icon={<CloseCircleOutlined />} color="#f50">
    //           Inactive
    //         </Tag>
    //       )}
    //     </>
    //   ),
    //   filterIcon: (filtered: boolean) => (
    //     <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    //   ),
    //   filterDropdown: ({
    //     setSelectedKeys,
    //     selectedKeys,
    //     confirm,
    //     clearFilters,
    //   }: any) => (
    //     <div
    //       className="custom-filter-dropdown"
    //       style={{ flexDirection: "row", marginLeft: 10 }}
    //     >
    //       <Checkbox
    //         checked={selectedKeys.includes('Active')}
    //         onChange={() =>
    //           setSelectedKeys(
    //             selectedKeys.includes('Active') ? [] : ['Active']
    //           )
    //         }
    //       >
    //         <span style={{ color: "green" }}>Active</span>
    //       </Checkbox>
    //       <Checkbox
    //         checked={selectedKeys.includes('Inactive')}
    //         onChange={() =>
    //           setSelectedKeys(
    //             selectedKeys.includes('Inactive') ? [] : ['Inactive']
    //           )
    //         }
    //       >
    //         <span style={{ color: "red" }}>Inactive</span>
    //       </Checkbox>
    //       <div className="custom-filter-dropdown-btns">
    //         <Button
    //           onClick={() => {
    //             handleReset(clearFilters);
    //             confirm();
    //           }}
    //           className="custom-reset-button"
    //         >
    //           Reset
    //         </Button>
    //         <Button
    //           type="primary"
    //           style={{ margin: 10 }}
    //           onClick={() => confirm()}
    //           className="custom-ok-button"
    //         >
    //           OK
    //         </Button>
    //       </div>
    //     </div>
    //   ),
    //   onFilter: (value, record) => {
    //     if (typeof value === 'string') {
    //       const status = record.isActive ? 'Active' : 'Inactive';
    //       return value === status;
    //     }
    //     return false;
    //   },
    // },
    // {
    //   title: 'Action',
    //   align: "center",
    //   width: 100,
    //   render: (text, rowData) => (
    //     <span>
    //       {rowData.isActive ? (
    //         <EditOutlined
    //           className={"editSamplTypeIcon"}
    //           type="edit"
    //           onClick={() => {
    //             if (rowData.isActive) {
    //               editMemo(rowData);
    //             }
    //           }}
    //           style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
    //         />
    //       ) : (
    //         ""
    //       )}
    //       &nbsp; &nbsp; &nbsp;
    //       <Popconfirm
    //         onConfirm={(e) => {
    //           activateOrDeactivateMemo(rowData);
    //         }}
    //         title={
    //           rowData.isActive
    //             ? "Are you sure to Deactivate ?"
    //             : "Are you sure to Activate ?"
    //         }
    //       >
    //         <Switch
    //           size="default"
    //           disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Delete)}
    //           className={
    //             rowData.isActive ? "toggle-activated" : "toggle-deactivated"
    //           }
    //           checkedChildren={<RightSquareOutlined type="check" />}
    //           unCheckedChildren={<RightSquareOutlined type="close" />}
    //           checked={rowData.isActive}
    //         />
    //       </Popconfirm>
    //     </span>
    //   ),
    // }
  ];
  return (
    <>
      <PageContainer title='Performance Management' breadcrumbRender={false}
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
        }
      >
        <Table
          columns={columns}
          bordered
          size="small"
          dataSource={data}
          scroll={{ y: 'calc(70vh - 100px)' }}
          pagination={{
            current: page,
            pageSize: 20,
            onChange: (page) => setPage(page),
        }}
        />
        <Modal
          key={data.id}
          title={isUpdate ? "Update" : "Create"}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width="60%"
        >
          <MemoForm
            key={Date.now()}
            isUpdate={isUpdate}
            memoData={selectedData}
            closeForm={closeModal}
            empData={selectedEmployee}
          />
        </Modal>
      </PageContainer>
    </>
  )
}

export default MemoView