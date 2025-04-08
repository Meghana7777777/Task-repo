import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  RightSquareOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  AccrualIntervalsDisplay,
  AccrualPeriodDisplay,
  EffectiveFromDisplay,
  LeavePolicyActivateDeactivateDto,
  LeavePolicyDto,
  LeavePolicyReq,
  LeavePolicyTypeEnum,
  LeaveTypeDisplay,
  ScopesEnum,
} from '@hrexpert/shared-models';
import { LeavePolicyService } from '@hrexpert/shared-services';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography
} from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import { SequenceUtils } from '../../../common/utils';
import { text } from 'stream/consumers';
import LeavePolicyMain from './leave-policy-conifgurations';

interface LeavePolicyViewIProps {
  scopes: ScopesEnum[];
}

const { Title, Text } = Typography;

const LeavePolicyView = (props: LeavePolicyViewIProps) => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicyTypeEnum>(
    LeavePolicyTypeEnum.FIXED_ENTITLEMENT
  );
  const navigate = useNavigate();
  const { scopes } = props;
  const service = new LeavePolicyService();
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    getAllLeavePolicies();
  }, []);

  const getAllLeavePolicies = () => {

    service.getAllLeavePolicies().then((res) => {
      if (res.status) {
        setLeaveData(res.data);
        message.success(res.internalMessage, 2);
      } else {
        setLeaveData([]);
        message.error(res.internalMessage, 2);
      }
    });
  };


   const editLeavePolicy = (rowData:LeavePolicyDto) => {
    getLeavePolicyDetails(rowData.id);
      setIsUpdate(true);
      setModalVisible(true);
  
    }


    const closeModal = () => {
      setModalVisible(false);
      setSelectedEmployeeData(null);
      setIsUpdate(false);
      // getEmployeeData()
    };


    const updateLeavePolicy = (data:LeavePolicyDto) => {
            console.log(data, 'data');
    
            service.updateLeavePolicy(data)
                .then((res) => {
                    if (res.status) {
                        message.success("Leave Policy updated successfully");
                        setModalVisible(false);
                        getAllLeavePolicies();
                        setIsUpdate(false);
                    } else {
                        message.error(res.internalMessage);
                    }
                })
                .catch((error) => {
                    console.error("Error updating branch details:", error);
                });
        };
  
const getLeavePolicyDetails = (leavePolicyTypeId: number) => {
    const req = new LeavePolicyReq(leavePolicyTypeId)
    service.getleavePolicyDetailsById(req).then((res) => {
      if (res.status) {
         setSelectedEmployeeData(res.data);
        
      } else {
        message.error(res.internalMessage);
      }
    })
  }
  const deleteLeavePolicy = async (rowData: any) => {
          const newIsActive = !rowData.isActive;
          const req = new LeavePolicyActivateDeactivateDto(
              rowData.id,
              newIsActive,
              rowData.versionFlag
          );
          try {
              service.activateOrDeactivateLeavePolicy(req).then((res) => {
                  if (res.status) {
                      message.success(res.internalMessage);
                      getAllLeavePolicies();
                  } else {
                      message.error(res.internalMessage);
                  }
              })
          } catch (error) {
              console.log(error);
          }
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
          style={{ marginBottom: 8, display: 'block' }}
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
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
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
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
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
    setSearchText('');
  }
  const columns: ColumnsType<any> = [
    {
      title: 'S No',
      render: (text, object, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: 'Leave Policy',
      dataIndex: 'leaveName',
      key: 'leaveName',
    },
    {
      title: 'Leave Code',
      dataIndex: 'leaveCode',
      key: 'leaveCode',
    },
    {
      title: 'Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (leaveType) => LeaveTypeDisplay[leaveType] || '-',
    },
    { title: 'Unit', dataIndex: 'uom', key: 'uom' },
    { title: 'Valid From', dataIndex: 'validFrom', key: 'validFrom' },
    { title: 'Valid To', dataIndex: 'validTo', key: 'validTo' },
    { title: 'Apply Max Limit', dataIndex: 'maxLimit', key: 'maxLimit' },
    { title: 'Apply Min Limit', dataIndex: 'minLimit', key: 'minLimit' },
    { title: 'Cutt Off Date', dataIndex: 'cutOffDate', key: 'cutOffDate' },
    // { title: 'CreditType', dataIndex: 'creditType', key: 'creditType' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      align: 'center',
      render: (isActive) => (
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
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (text, rowData) => (
          <span>
              {rowData.isActive ? (
                  <EditOutlined
                      className={"editSamplTypeIcon"}
                      type="edit"
                      onClick={() => {
                          if (rowData.isActive) {
                              editLeavePolicy(rowData);
                          }
                      }}
                      style={{ color: "#1890ff", fontSize: "14px", }}
                  />
              ) : (
                  ""
              )}
              <Divider type="vertical" />
              <Popconfirm
                  onConfirm={(e) => {
                      deleteLeavePolicy(rowData);
                  }}
                  title={
                      rowData.isActive
                          ? "Are you sure to Deactivate LeaveGroups ?"
                          : "Are you sure to Activate LeaveGroups?"
                  }
              >
                  <Switch
                      size="default"
                     
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
  },
  ];

  const expandedRowRender = (record) => {
    const entitlementColumns: ColumnsType<any> = [
      { title: 'Effective Days', dataIndex: 'effectiveFromCount', key: 'effectiveFromCount' },
      { title: 'Effective From', dataIndex: 'effectiveFrom', key: 'effectiveFrom', render: (effectiveFrom) => EffectiveFromDisplay[effectiveFrom] || '-', },
      { title: 'Effective From UOM', dataIndex: 'effectiveFromUom', key: 'effectiveFromUom' },
      { title: 'Prorate', dataIndex: 'isProrate', key: 'isProrate', render: (text) => (text ? 'Yes' : 'No')},
      { title: 'Accrual Leaves', dataIndex: 'accrualLeaves', key: 'accrualLeaves' },
      { title: 'Accrual Period', dataIndex: 'accrualPeriod', key: 'accrualPeriod', render:(text)=> AccrualPeriodDisplay[text] || '-' },
      { title: 'Reset Period', dataIndex: 'resetPeriod', key: 'resetPeriod', render:(text)=> AccrualPeriodDisplay[text] || '-' },
      { title: 'Carry Forward', dataIndex: 'isCarryForward', key: 'isCarryForward', render: (text) => (text ? 'Yes' : 'No')},
      { title: 'Carry Forward Limit', dataIndex: 'carryForwardLimit', key: 'carryForwardLimit' },
      { title: 'Encashment', dataIndex: 'isEncashment', key: 'isEncashment', render: (text) => (text ? 'Yes' : 'No')},
      { title: 'Encashment Limit', dataIndex: 'encashmentLimit', key: 'encashmentLimit', render: (text)=> text ||'0' },
    ];

    return (
      <Table
        columns={entitlementColumns}
        dataSource={record.entitlements.map((entitlement, index) => ({
          ...entitlement,
          key: index,
        }))}
        pagination={false}
      />
    );
  };


  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleNextClick = () => {
    if (selectedPolicy) {
      navigate('/leave-policy-configuration');
      setIsModalOpen(false);
    } else {
      Modal.error({
        title: 'Error',
        content: 'Please select a leave policy type.',
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPolicy(LeavePolicyTypeEnum.FIXED_ENTITLEMENT);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
      <Card
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        title={
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            Leave Policy
          </Title>
        }
        extra={
          <Button
            type="primary"
            disabled={SequenceUtils.fetchVisibleAccessScopes(
              scopes,
              ScopesEnum.Create
            )}
            icon={<PlusOutlined />}
            onClick={handleNextClick}
          >
            Add Leave Policy
          </Button>
        }
      >
        <Table
      columns={columns}
      dataSource={leaveData.map((item, index) => ({
        ...item,
        key: index,
      }))}
      expandable={{ expandedRowRender }}
      pagination={false}
    />
     <Modal
        open={modalVisible}
        title={isUpdate ? 'Edit leavePolicy' : 'Add leavePolicy'}
        footer={null}
        onCancel={closeModal}
        width={'90%'}
      >
        {selectedEmployeeData && (
          <LeavePolicyMain
            leavePolicyData={selectedEmployeeData}
            updateDetails={updateLeavePolicy}
            isUpdate={isUpdate}
            closeForm={closeModal}
          />
        )}
      </Modal>
      </Card>

      {/* <Modal
        title={
          <Title level={5} style={{ margin: 0, color: '#722ed1' }}>
            Add Leave Policy
          </Title>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="next"
            type="primary"
            onClick={handleNextClick}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
            }}
          >
            Next
          </Button>,
        ]}
        style={{
          borderRadius: '12px',
        }}
      >
        <Radio.Group
          onChange={(e) => setSelectedPolicy(e.target.value as LeavePolicyTypeEnum)}
          value={selectedPolicy}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Card hoverable>
            <Radio value={LeavePolicyTypeEnum.FIXED_ENTITLEMENT}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaRegCalendarAlt size={24} style={{ color: '#52c41a' }} />
                <div>
                  <Text strong style={{ fontSize: '16px' }}>
                    Fixed entitlement
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    A simple policy with a fixed amount of leaves, such as 12 days per year
                  </Text>
                </div>
              </div>
            </Radio>
          </Card>

          <Card hoverable>
            <Radio value={LeavePolicyTypeEnum.EXPERIENCE_BASED_ENTITLEMENT}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaUserGraduate size={24} style={{ color: '#722ed1' }} />
                <div>
                  <Text strong style={{ fontSize: '16px' }}>
                    Experience-based entitlement
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    An advanced policy with a variable amount of leave based on the employee's
                    years of experience
                  </Text>
                </div>
              </div>
            </Radio>
          </Card>

          <Card hoverable>
            <Radio value={LeavePolicyTypeEnum.GRANT_BASED_ENTITLEMENT}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaGift size={24} style={{ color: '#fa8c16' }} />
                <div>
                  <Text strong style={{ fontSize: '16px' }}>
                    Grant-based entitlement
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    A policy that credits special leave to specific employees based on a request,
                    such as maternity leave
                  </Text>
                </div>
              </div>
            </Radio>
          </Card>

          <Card hoverable>
            <Radio value={LeavePolicyTypeEnum.ATTENDANCE_BASED_ENTITLEMENT}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaChartBar size={24} style={{ color: '#eb2f96' }} />
                <div>
                  <Text strong style={{ fontSize: '16px' }}>
                    Attendance-based entitlement
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#8c8c8c' }}>
                    A policy that credits leave to employees based on their worked hours or days
                  </Text>
                </div>
              </div>
            </Radio>
          </Card>
        </Radio.Group>
      </Modal> */}
    </div>
  );
};

export default LeavePolicyView;
