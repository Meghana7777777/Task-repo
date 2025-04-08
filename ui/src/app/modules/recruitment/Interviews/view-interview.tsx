import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RightSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  CandidateNameReq,
  interviewStatus,
  InterViewType,
} from '@hrexpert/shared-models';
import {
  CompanySharedService,
  DesignationsService,
  EmployeeOnboardingService,
  InterviewServiceSharedService,
  RecruitmentServiceSharedService,
} from '@hrexpert/shared-services';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
} from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import './view-interview.css';
import Highlighter from 'react-highlight-words';

const { Search } = Input;
const { Option } = Select;

const ViewInterview = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});

  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');

  // Modal and form state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  // Added states for view modal
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewInterviewData, setViewInterviewData] = useState<any>(null);

  // Data state
  const [interviews, setInterviews] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);

  // Loading state for toggle action
  const [loadingId, setLoadingId] = useState(null);

  // Service instances
  const service = new InterviewServiceSharedService();
  const interviewServiceSharedService = new InterviewServiceSharedService();

  // Dropdown data state
  const [companyRecords, setCompanyRecords] = useState<any>([]);
  const companyService = new CompanySharedService();
  const recruitmentSharedservice = new RecruitmentServiceSharedService();
  const [jobRatesData, setJobRateData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState<any>([]);
  const empService = new EmployeeOnboardingService();
  const [profileData, setProfileData] = useState<any>([]);
  const [loadingReferrer, setLoadingReferrer] = useState(false);
  const designationsService = new DesignationsService();
  const [designations, setDesginations] = useState<any>([]);
  
  

  // Handle table pagination and filtering
  const handleChange = (pagination: any, filters: any) => {
    setFilteredInfo(filters);
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Utility function to safely convert values to lowercase
  const safeToLowerCase = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
  };

  // Initial data fetch on component mount
  useEffect(() => {
    getAllRecruitmentInterviews();
    getActiveCompany();
    getRecruitment();
    getOnlyEmployeeType();
    getRecruitmentProfilesDropDown();
    getDesignations()
  }, []);

  // Fetch active companies for dropdown
  const getActiveCompany = () => {
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

  const getDesignations = () => {
    designationsService.getActiveDesignations().then((res) => {
      if (res.status) {
        setDesginations(res.data);
      } else {
        setDesginations('No Data Found');
      }
    });
  };
 
  // Fetch recruitment data for job roles
  const getRecruitment = () => {
    setLoading(true);
    try {
      recruitmentSharedservice.getRecruitment().then((res) => {
        if (res.status) {
          setJobRateData(res.data);
          setLoading(false);
        } else {
          message.error(res.internalMessage);
        }
      });
    } catch (err) {
      console.log(err); 
    }
  };

  // Fetch employee data for interviewer dropdown
  const getOnlyEmployeeType = () => {
    try {
      empService.getOnlyEmployeeType().then((res) => {
        if (res.status) {
          setEmpData(res.data);
        } else {
          message.error('Failed to retrieve company');
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Fetch candidate profiles for dropdown
  const getRecruitmentProfilesDropDown = () => {
    try {
      recruitmentSharedservice.getRecruitmentProfilesDropDown().then((res) => {
        if (res.status) {
          setProfileData(res.data);
        } else {
          message.error('Failed to retrieve company');
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Show modal for creating new interview
  const showModal = () => {
    setIsEditing(false);
    setSelectedInterview(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Show modal for editing existing interview
  const showEditModal = (record: any) => {
    console.log(record, '11111111111111');
    setIsEditing(true);
    setSelectedInterview(record);
    form.setFieldsValue({
      interviewDate: record.interviewDate ? dayjs(record.interviewDate) : null,
      interviewType: record.interviewType,
      interviewer: record.interviewer,
      interviewerMobNo: record.interviewerMobNo,
      client: record.companyId,
      jobRole: record.jobRole,
      candidateName: record.candidateName,
      referredBy: record.referredBy,
      status: record.status,
      remarks: record.remarks,
    });
    setIsModalVisible(true);
  };

  // Added showViewInterview function
  const showViewInterview = (record: any) => {
    setViewInterviewData(record);
    setIsViewModalVisible(true);
  };

  // Handle form submission (create or update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const interviewData = {
        interviewDate: values.interviewDate.format('YYYY-MM-DD'),
        interviewType: values.interviewType,
        interviewer: values.interviewer,
        interviewerMobNo: values.interviewerMobNo,
        client: values.client,
        jobRole: values.jobRole,
        candidateName: values.candidateName,
        referredBy: values.referredBy,
        status: values.status,
        remarks: values.remarks,
      };
      console.log(interviewData);
      let response;
      if (isEditing && selectedInterview) {
        // Update existing interview
        response =
          await interviewServiceSharedService.updateRecruitmentInterviews({
            id: selectedInterview.id,
            ...interviewData,
          });
      } else {
        // Create new interview
        response =
          await interviewServiceSharedService.createRecruitmentInterviews(
            interviewData
          );
      }

      if (response?.status === true) {
        if (isEditing) {
          message.success('Interview updated successfully');
        } else {
          message.success('Interview scheduled successfully');
          setInterviews([
            ...interviews,
            { id: interviews.length + 1, ...interviewData },
          ]);
        }
        form.resetFields();
        setIsModalVisible(false);
        setIsEditing(false);
        setSelectedInterview(null);
        await getAllRecruitmentInterviews();
      } else {
        console.error(
          'API Error:',
          response?.internalMessage || 'Unknown error'
        );
        message.error(response?.internalMessage || 'Operation failed');
      }
    } catch (error) {
      console.error('Validation or API Failed:', error);
      message.error('Failed to process interview');
    }
  };

  // Handle modal cancellation
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditing(false);
    setSelectedInterview(null);
  };

  // Added handleViewCancel function
  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewInterviewData(null);
  };

  console.log(data, 'vuhhfgghjkgthjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');

  // Fetch all interviews
  const getAllRecruitmentInterviews = () => {
    setLoading(true);
    service
      .getAllRecruitmentInterviews()
      .then((res) => {
        if (res.status) {
          const formattedData = res.data.map((item) => ({
            ...item,
            interviewDate: dayjs(item.interviewDate).format('DD MMM YYYY'),
            // Format as needed
          }));
          setData(formattedData);
        } else {
          console.log(':::::::');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch interviews:', error);
        setLoading(false);
      });
  };

  // Handle candidate selection change to fetch referrer
  const handleCandidateChange = async (value, option) => {
    if (!value) {
      form.setFieldsValue({ referredBy: '' });
      return;
    }

    setLoadingReferrer(true);

    try {
      const reqModel = new CandidateNameReq(option.children); // candidateName string
      const response =
        await recruitmentSharedservice.getReferenceNamewithCandidateName(
          reqModel
        );
      console.log(response, '............');
      const referredBy = response?.data?.referredByName || '';
      form.setFieldsValue({ referredBy });
    } catch (error) {
      console.error('Failed to fetch referredBy:', error);
      form.setFieldsValue({ referredBy: '' });
    } finally {
      setLoadingReferrer(false);
    }
  };

  // Function to toggle interview active status
  const toggleInterviewActiveStatus = async (interviewId, currentStatus) => {
    setLoadingId(interviewId); // Set loading state for specific interview
    try {
      const interviewData = {
        is_active: !currentStatus, // Toggle the current status
      };

      // Update existing interview
      const response =
        await interviewServiceSharedService.updateRecruitmentInterviews({
          id: interviewId,
          ...interviewData,
        });

      if (response?.status === true) {
        message.success('Interview status updated successfully');
        // Update the local state
        setInterviews((prevInterviews) =>
          prevInterviews.map((interview) =>
            interview.id === interviewId
              ? { ...interview, is_active: !currentStatus }
              : interview
          )
        );
        await getAllRecruitmentInterviews(); // Refresh the data
      } else {
        console.error(
          'API Error:',
          response?.internalMessage || 'Unknown error'
        );
        message.error(response?.internalMessage || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update Failed:', error);
      message.error('Failed to update interview status');
    } finally {
      setLoadingId(null); // Clear loading state
    }
  };

  const getColumnSearchProps = (
    dataIndex: any,
    title: any
  ): ColumnType<any> => ({
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

  // Table columns definition
  const columns: ColumnsType<any> = [
    {
      title: 'S No',
      render: (text, object, index) => (page - 1) * pageSize + (index + 1),
      align: 'center',
      fixed: 'left',
      width: 80,
    },
    {
      title: 'Interview Date',
      dataIndex: 'interviewDate',
      ...getColumnSearchProps('interviewDate', 'Interview Date'),
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Company',
      dataIndex: 'CompanyName',
      ...getColumnSearchProps('CompanyName', 'Company'),
      align: 'center',
      width: 200,
    },
    {
      title: 'Job Description',
      dataIndex: 'jobDescription',
      ...getColumnSearchProps('jobDescription', 'Job Description'),
      align: 'center',
      width: 250,
    },
    {
      title: 'Candidate Name',
      dataIndex: 'candName',
      ...getColumnSearchProps('candName', 'Candidate Name'),
      align: 'center',
      width: 180,
    },
    {
      title: 'Client Interviewer',
      dataIndex: 'interviewerName',
      ...getColumnSearchProps('interviewerName', 'Client Interviewer'),
      align: 'center',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ...getColumnSearchProps('status', 'Status'),
      align: 'center',
      width: 120,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      align: 'center',
      width: 120,
    },
    {
      title: 'Action',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, rowData) => (
        <span>
          {rowData.isActive && (
            <EditOutlined
              className="editSamplTypeIcon"
              style={{ color: '#1890ff', fontSize: '14px', marginRight: 8 }}
              onClick={() => showEditModal(rowData)}
            />
          )}
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showViewInterview(rowData)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Interviews"
        breadcrumbRender={false}
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Schedule Interview
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          size="middle"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (current, pageSize) => {
              setPage(current);
              setPageSize(pageSize);
            },
          }}
          onChange={handleChange}
          rowKey="id"
          loading={loading}
        />
      </PageContainer>
      <Modal
        title={isEditing ? 'Edit Interview' : 'Schedule Interview'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditing ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={1000}
        style={{ height: 500 }}
      >
        <Form
          form={form}
          layout="vertical"
          name="schedule_interview_form"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          <Form.Item
            name="interviewDate"
            label="Interview Date"
            rules={[
              { required: true, message: 'Please select interview date' },
            ]}
            style={{ gridColumn: 'span 1' }}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select Date ..."
            />
          </Form.Item>

          <Form.Item
            name="interviewType"
            label="Interview Type"
            rules={[
              { required: true, message: 'Please select interview type' },
            ]}
            style={{ gridColumn: 'span 1' }}
          >
            <Select
              showSearch
              allowClear
              dropdownMatchSelectWidth={false}
              optionFilterProp="children"
              placeholder="Select Interview Type"
            >
              {Object.entries(InterViewType).map(([key, value]) => (
                <Select.Option value={value} key={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="interviewer"
            label="Interviewer"
            rules={[{ required: true, message: 'Please select interviewer' }]}
            style={{ gridColumn: 'span 1' }}
          >
            <Select
              showSearch
              placeholder="Select Interviewer"
              allowClear
              filterOption={(input, option) =>
                (option?.children ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {empData.map((comp) => (
                <Option key={comp.id} value={comp.id}>
                  {comp.employeeName}-{comp.employeeCode}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="interviewerMobNo"
            label="Interviewer Mob No"
            rules={[
              { required: true, message: 'Please enter mobile number' },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit mobile number',
              },
            ]}
            style={{ gridColumn: 'span 1' }}
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>

          <Form.Item
            name="client"
            label="Company"
            rules={[{ required: true, message: 'Please select client' }]}
            style={{ gridColumn: 'span 1' }}
          >
            <Select
              showSearch
              placeholder="Select Company"
              allowClear
              filterOption={(input, option) =>
                (option?.children ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {companyRecords.map((comp) => (
                <Option key={comp.id} value={comp.id}>
                  {comp.companyName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="jobRole"
            label="Job Role"
            rules={[{ required: true, message: 'Please select job role' }]}
            style={{ gridColumn: 'span 1' }}
          >
            <Select
              showSearch
              placeholder="Select JobRole"
              allowClear
              filterOption={(input, option) =>
                (option?.children ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {designations.map((comp) => (
                <Option key={comp.id} value={comp.id}>
                  {comp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="candidateName"
            label="Candidate Name"
            rules={[{ required: true, message: 'Please select candidate' }]}
            style={{ gridColumn: 'span 1' }}
          >
            <Select
              showSearch
              placeholder="Select Candidate Name"
              allowClear
              onChange={handleCandidateChange}
              filterOption={(input, option) =>
                (option?.children ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {profileData.map((comp) => (
                <Option key={comp.id} value={comp.id}>
                  {comp.candidateName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="referredBy"
            label="Referred By"
            rules={[{ required: true, message: 'Please enter referred by' }]}
            style={{ gridColumn: 'span 1' }}
          >
            <Input placeholder="Enter referrer" disabled />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
            style={{ gridColumn: 'span 1' }}
          >
            <Select
              showSearch
              allowClear
              dropdownMatchSelectWidth={false}
              optionFilterProp="children"
              placeholder="Select status"
            >
              {Object.entries(interviewStatus).map(([key, value]) => (
                <Select.Option value={value} key={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="remarks"
            label="Remarks"
            style={{ gridColumn: 'span 3' }}
          >
            <Input.TextArea rows={3} placeholder="Enter remarks" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Added View Modal */}
      <Modal
        title="View Interview Details"
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewInterviewData && (
          <div className="view-interview-details" style={{ padding: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              <div>
                <strong>Interview Date:</strong>{' '}
                {viewInterviewData.interviewDate}
              </div>
              <div>
                <strong>Company:</strong> {viewInterviewData.CompanyName}
              </div>
              <div>
                <strong>Job Description:</strong>{' '}
                {viewInterviewData.jobDescription}
              </div>
              <div>
                <strong>Candidate Name:</strong> {viewInterviewData.candName}
              </div>
              <div>
                <strong>Interviewer:</strong>{' '}
                {viewInterviewData.interviewerName}
              </div>
              <div>
                <strong>Interviewer Mobile:</strong>{' '}
                {viewInterviewData.interviewerMobNo}
              </div>
              <div>
                <strong>Interview Type:</strong>{' '}
                {viewInterviewData.interviewType}
              </div>
              <div>
                <strong>Status:</strong> {viewInterviewData.status}
              </div>
              <div>
                <strong>Referred By:</strong>{' '}
                {viewInterviewData.referredBy || 'N/A'}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Remarks:</strong> {viewInterviewData.remarks || 'N/A'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewInterview;
