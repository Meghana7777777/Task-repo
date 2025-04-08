import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { ScopesEnum } from "@hrexpert/shared-models";
import { AssignProfileServiceSharedService, BranchesService, CompanySharedService, RecruitmentServiceSharedService } from "@hrexpert/shared-services";
import { Button, Divider, Form, Input, message, Modal, Space, Table } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { SequenceUtils } from "../../../common/utils";
import AddAssignProfile from "./add-assign-profile";

interface ViewAssignProfileIProps {
  scopes: ScopesEnum[]
}

const ViewAssignProfile = (props: ViewAssignProfileIProps) => {
  const { scopes } = props
  const [data, setData] = useState<any>([]);
  const [companyRecords, setCompanyRecords] = useState<any[]>([]);
  const [requirementRecords, setRequirementRecords] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [selectedStyleData, setSelectedStyleData] = useState<any>(null);
  const [isUpdate, setisUpdate] = useState(false)
  let navigate = useNavigate();
  const service = new RecruitmentServiceSharedService();
  const companyService = new CompanySharedService();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const Service = new AssignProfileServiceSharedService();
  

  useEffect(() => {
    getAllRequirements()
    getAllCompanys()
    assignProfiles()

  }, []);

  const openForm = () => {
    setSelectedStyleData(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getAllCompanys = () => {
    try {
      companyService.getActiveCompany().then((res) => {
        if (res.status) {
          setCompanyRecords(res.data);
        } else {
          message.error('Failed to retrieve company');
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getAllRequirements = () => {
    try {
      service.getRecruitment().then((res) => {
        if (res.status) {
          setRequirementRecords(res.data)
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

  const assignProfiles = async () => {
    try {
      Service.getAssignedProfiles().then((res) => {
        if (res.status) {
          setData(res.data)
          message.success(res.internalMessage);
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.error(error);
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
      title: "S.No",
      key: "sno",
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
      align: "center"
    },
    {
      title: "Candidate Name",
      dataIndex: "candidateName",
      sorter: (a, b) => a.candidateName.localeCompare(b.candidateName),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps("candidateName", "Candidate Name"),
      align: "center"
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      ...getColumnSearchProps("mobileNumber", "Mobile Number"),
      align: "center"
    },
    {
      title: "Job Role",
      dataIndex: "name",
      ...getColumnSearchProps("name", 'Job Role'),
      align: "center"
    },
    {
      title: "Technologies",
      dataIndex: "technologies",
      ...getColumnSearchProps("technologies", 'Technologies'),
      align: "center"
    },
    {
      title: "Stack",
      dataIndex: "stack",
      ...getColumnSearchProps("stack", "Stack"),
      align: "center"
    },
    {
      title: "Source Type",
      dataIndex: "sourceType",
      ...getColumnSearchProps("sourceType", "Source Type"),
      align: "center"
    },
    {
      title: "Referred by",
      dataIndex: "fullName",
      ...getColumnSearchProps("fullName", "Referred by"),
      align: "center",
    },
    // {
    //   title: "Vendor Name",
    //   dataIndex: "vendorName",
    //   ...getColumnSearchProps("vendorName", "Vendor Name"),
    //   align: "center",
    // },
    {
      title: "Experience",
      dataIndex: "experience",
      ...getColumnSearchProps("experience", "Experience"),
      align: "center",
    },
    {
      title: "Interview Status",
      dataIndex: "interviewStatus",
      ...getColumnSearchProps("interviewStatus", "Interview Status"),
      align: "center",
    },
    // {
    //   title: "Status",
    //   dataIndex: "isActive",
    //   align: "center",
    //   ...getColumnSearchProps("isActive", 'Status'),
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
    //   title: "Action",
    //   dataIndex: "action",
    //   align: "center",
    //   render: (text, rowData) => (
    //     <span>
    //       {/* {rowData.isActive ? (
    //         <EditOutlined
    //           className={"editSamplTypeIcon"}
    //           type="edit"
    //           onClick={() => {
    //             if (rowData.isActive) {
    //               editBranch(rowData);
    //             }
    //           }}
    //           style={{ color: "#1890ff", fontSize: "14px", display: SequenceUtils.fetchViewAccessScopes(scopes, ScopesEnum.Update) }}
    //         />
    //       ) : (
    //         ""
    //       )} */}
    //       <Divider type="vertical" />
         
    //     </span>
    //   ),
    // },
  ];

  return (
    <>
      <PageContainer title='Assigned Profiles' breadcrumbRender={false}
        extra={
          <>
            <Button type="primary" disabled={SequenceUtils.fetchVisibleAccessScopes(scopes, ScopesEnum.Create)} icon={<PlusOutlined />} onClick={openForm}>
              Assign Profile
            </Button>
          </>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
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
          title={'Assign Profile'}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width="80%"
        >
          <AddAssignProfile
            data={selectedStyleData}
            closeForm={closeModal}
            getAllCompanys={getAllCompanys}
            requirementRecords = {requirementRecords}
            getAllRequirements={getAllRequirements} 
            companyRecords={companyRecords} 
            assignProfiles={assignProfiles}
            />

        </Modal>



      </PageContainer>
    </>
  );
};

export default ViewAssignProfile;