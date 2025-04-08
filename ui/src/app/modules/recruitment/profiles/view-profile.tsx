import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { CandidateType, SourceType } from '@hrexpert/shared-models';
import {
  configVariables,
  DesignationsService,
  EmployeeOnboardingService,
  RecruitmentServiceSharedService,
} from '@hrexpert/shared-services';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Upload,
} from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, ColumnType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const { Option } = Select;
const { TextArea } = Input;

interface RecruitmentProfile {
  id: number;
  candidateName: string;
  jobRole: string;
  profileDate: string;
  qualification: string;
  technologies: string;
  stack: string;
  candidateType: string;
  sourceType: string;
  referredBy: string;
  expectedCTC: string;
  currentCTC: string;
  experience: number;
  noticePeriod: number;
  mobileNumber: string;
  alternativeMobile: string | null;
  email: string;
  remarks: string;
  resumePath: string | null;
}

const ViewProfile = () => {
  const [profiles, setProfiles] = useState<RecruitmentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<RecruitmentProfile | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const recruitmentServiceSharedService = new RecruitmentServiceSharedService();
  const [empData, setEmpData] = useState<any>([]);
  const empService = new EmployeeOnboardingService();
  const [jobRatesData, setJobRateData] = useState<any>([]);
  const [designations, setDesginations] = useState<any>([]);
  const designationsService = new DesignationsService();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isViewModalVisible, setisViewModalVisible] = useState(false);
  const [previewResumeFile, setPreviewResumeProfile] = useState(null);
  const config = configVariables;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (record) => {
    console.log(record, 'record');
    setSelectedProject(record);
    setisViewModalVisible(true);
  };

  const handleClose = () => {
    setisViewModalVisible(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    fetchProfiles();
  }, [page, pageSize]);

  useEffect(() => {
    getOnlyEmployeeType();
    getRecruitment();
    getDesignations();
  }, []);
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const req = { page, pageSize };
      const response =
        await recruitmentServiceSharedService.getRecruitmentProfiles(req);
      if (response.status && response.data) {
        setProfiles(response.data || []);
        setTotal(response.data.length || 0);
      }
    } catch (error) {
      // console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = () => {
    setSelectedProfile(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProfile(null);
    form.resetFields();
    setFileList([]);
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

  const getRecruitment = () => {
    setLoading(true);
    try {
      recruitmentServiceSharedService.getRecruitment().then((res) => {
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

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: keyof RecruitmentProfile
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const editProfile = (record: any) => {
    // console.log(record, 'record');
    setSelectedProfile(record);
    console.log(record, '------dsdsdssss--------');
    form.setFieldsValue({
      ...record,
      profileDate: record.profileDate ? moment(record.profileDate) : null,
      jobRole: record.jobRole,
      referredBy: record.referredBy,
    });
    setIsModalVisible(true);
  };

  const columns: ColumnsType<RecruitmentProfile> = [
    {
      title: 'S.No',
      key: 'sno',
      render: (_, __, index) => (page - 1) * pageSize + (index + 1),
      align: 'center',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Candidate Name',
      dataIndex: 'candidateName',
      align: 'center',
      width: 150,
      fixed: 'left',
      ...getColumnSearchProps('candidateName', 'Candidate Name'),
    },
    {
      title: 'Job Role',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      ...getColumnSearchProps('name', 'Job Role'),
    },

    {
      title: 'Profile Date',
      dataIndex: 'profileDate',
      align: 'center',
      width: 120,
      render: (text) => (text ? new Date(text).toLocaleDateString() : '-'),
      ...getColumnSearchProps('profileDate', 'Profile Date'),
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      align: 'center',
      width: 120,
      ...getColumnSearchProps('qualification', 'Qualification'),
    },
    {
      title: 'Technologies',
      dataIndex: 'technologies',
      align: 'center',
      width: 120,
      ...getColumnSearchProps('technologies', 'Technologies'),
    },
    {
      title: 'Stack',
      dataIndex: 'stack',
      align: 'center',
      width: 100,
      ...getColumnSearchProps('stack', 'Stack'),
    },
    {
      title: 'Candidate Type',
      dataIndex: 'candidateType',
      align: 'center',
      width: 120,
      ...getColumnSearchProps('candidateType', 'Candidate Type'),
    },
    {
      title: 'Source Type',
      dataIndex: 'sourceType',
      align: 'center',
      width: 120,
      ...getColumnSearchProps('sourceType', 'Source Type'),
    },
    {
      title: 'Referred By',
      dataIndex: 'fullName',
      align: 'center',
      width: 120,
      ...getColumnSearchProps('fullName', 'Referred By'),
    },
    {
      title: 'Expected CTC',
      dataIndex: 'expectedCTC',
      align: 'center',
      width: 120,
      render: (text) => (text ? `₹${Number(text).toLocaleString()}` : '-'),
    },
    {
      title: 'Current CTC',
      dataIndex: 'currentCTC',
      align: 'center',
      width: 120,
      render: (text) => (text ? `₹${Number(text).toLocaleString()}` : '-'),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      align: 'center',
      width: 100,
      render: (text) => (text ? `${text} years` : '-'),
      ...getColumnSearchProps('experience', 'Experience'),
    },
    {
      title: 'Notice Period',
      dataIndex: 'noticePeriod',
      align: 'center',
      width: 120,
      render: (text) => (text ? `${text} days` : '-'),
      ...getColumnSearchProps('noticePeriod', 'Notice Period'),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      align: 'center',
      width: 150,
      ...getColumnSearchProps('mobileNumber', 'Mobile Number'),
    },
    {
      title: 'Alt. Mobile',
      dataIndex: 'alternativeMobile',
      align: 'center',
      width: 150,
      ...getColumnSearchProps('alternativeMobile', 'Alt. Mobile'),
    },

    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      width: 200,
      ...getColumnSearchProps('email', 'Email'),
    },
    { title: 'Remarks', dataIndex: 'remarks', align: 'center', width: 200 },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: 100,
      render: (_, rowData) => (
        <span>
          <EditOutlined
            onClick={() => editProfile(rowData)}
            style={{ color: '#1890ff', fontSize: '14px' }}
          />
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModal(rowData)}
          />
          {/* </span> */}
          {/* </span> */}
        </span>
      ),
    },
  ];

  const uploadProps = {
    multiple: false,
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      event.preventDefault();
      if (
        !file.name.match(
          /\.(xlsx|xls|pdf|jpg|png|jpeg|doc|PDF|ppt|pptx|doc|docx|csv|zip|gif)$/
        )
      ) {
        message.error('Only specific file types are allowed.');
        return false;
      }
      setFileList([file]);
      return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList,
    showUploadList: true,
  };

  const fileHandling = (res, values) => {
    try {
      const fileList = values.resumeFilePath?.fileList;
      if (!Array.isArray(fileList) || fileList.length === 0) {
        message.error('No files selected.');
        return;
      }
      const formData = new FormData();
      formData.append('id', `${res.id}`);
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
        } else {
          console.warn('File object is missing');
        }
      });
      console.log(formData, 'formData');
      recruitmentServiceSharedService.createRecImageProfile(formData);
      message.success('Files uploaded successfully');
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const onFinish = (values: any) => {
    console.log(values, 'sknsdjd');
    setFormLoading(true);
    try {
      if (values.profileDate) {
        values.profileDate = values.profileDate.format('YYYY-MM-DD');
      }
      if (selectedProfile) {
        recruitmentServiceSharedService
          .updateProfileRecruitment({
            ...values,
            id: selectedProfile.id,
          })
          .then((res) => {
            if (res.status) {
              message.success('Profile updated successfully');
              fetchProfiles();
              setIsModalVisible(false);
            }
          });
      } else {
        recruitmentServiceSharedService.createProfile(values).then((res) => {
          if (res.status) {
            fileHandling(res.data, values);
            fetchProfiles();
            handleCancel();
            message.success('Profile created successfully');
          } else {
            message.success(res.internalMessage);
          }
        });
      }
    } catch (error) {
      message.error('An error occurred');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };
  const preprocessData = (data) => {
    return data.map((record, index) => {
      const updatedRecord = { key: index + 1 };
      recruitmentProfiles.forEach((column) => {
        const value = record[column.dataIndex];
        updatedRecord[column.dataIndex] =
          value === null || value === undefined ? '' : value;
      });
      return updatedRecord;
    });
  };

  const recruitmentProfiles = [
    { title: 'Candidate Name', dataIndex: 'candidateName' },
    { title: 'Job Role', dataIndex: 'name' },
    { title: 'Profile Date', dataIndex: 'profileDate' },
    { title: 'Qualification', dataIndex: 'qualification' },
    { title: 'Technologies', dataIndex: 'technologies' },
    { title: 'Stack', dataIndex: 'stack' },
    { title: 'Candidate Type', dataIndex: 'candidateType' },
    { title: 'Source Type', dataIndex: 'sourceType' },
    { title: 'Referred By', dataIndex: 'fullName' },
    { title: 'Expected CTC', dataIndex: 'expectedCTC' },
    { title: 'Current CTC', dataIndex: 'currentCTC' },
    { title: 'Experience (Years)', dataIndex: 'experience' },
    { title: 'Notice Period (Days)', dataIndex: 'noticePeriod' },
    { title: 'Mobile Number', dataIndex: 'mobileNumber' },
    { title: 'Alternative Mobile', dataIndex: 'alternativeMobile' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Remarks', dataIndex: 'remarks' },
  ];

  const exportExcel = () => {
    const excel = new Excel();
    const processedData = preprocessData(profiles);
    excel
      .addSheet('Requirement')
      .addColumns(recruitmentProfiles)
      .addDataSource(processedData, { str2num: false })
      .saveAs('RequirementProfiles.xlsx');
  };

  console.log(selectedProject, 'selectedProject');
  const file = selectedProject?.resumeName;
  console.log(file, 'file');
  const resumeFileURL = file
    ? file instanceof File
      ? URL.createObjectURL(file)
      : `${config.RESUME_URL}/${encodeURIComponent(file)}`
    : null;

  const handleDownloadResumeFile = async (filePath) => {
    if (!filePath) {
      console.error('Download failed: No file path provided.');
      return;
    }
    const baseUrl = config.RESUME_URL;
    const paths = filePath.split(',');
    for (const res of paths) {
      if (!res) continue;
      try {
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const cleanRes = res.replace(/^\/+/, '');
        const encodedFileName = encodeURIComponent(cleanRes);
        const fileUrl = `${cleanBaseUrl}/${encodedFileName}`;
        const headResponse = await fetch(fileUrl, { method: 'HEAD' });
        if (!headResponse.ok) {
          console.error(`🚨 File not found at URL: ${fileUrl}`);
          continue;
        }
        const response = await fetch(fileUrl);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const blob = await response.blob();
        const fileType = blob.type || 'application/octet-stream';
        const fileExtension =
          cleanRes.split('.').pop().toLowerCase() ||
          (fileType.includes('pdf') ? 'pdf' : 'jpg');
        const finalFileName = cleanRes.includes('.')
          ? cleanRes
          : `${cleanRes}.${fileExtension}`;
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = finalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        console.log(`✅ Download successful: ${finalFileName}`);
      } catch (error) {
        console.error(`❌ Download failed for ${res}:`, error);
      }
    }
  };

  return (
    <>
      <PageContainer
        title="Profiles"
        breadcrumb={{ routes: [] }}
        extra={
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '10px',
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddProfile}
            >
              Add Profile
            </Button>
            <Button
              style={{
                marginLeft: '10px',
                border: '1px dashed #22f534',
                color: 'green',
                fontWeight: 'bold',
              }}
              type="dashed"
              onClick={() => exportExcel()}
            >
              Get Excel
            </Button>
          </div>
        }
      >
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={profiles}
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              },
            }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </PageContainer>
      <Modal
        title={selectedProfile ? 'Edit Profile' : 'Create Profile'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1100}
      >
        <Form
          form={form}
          name="add_profile"
          onFinish={onFinish}
          layout="vertical"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '16px',
          }}
        >
          <Form.Item name="id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item
            name="candidateName"
            label="Candidate Name"
            rules={[
              { required: true, message: 'Please enter candidate name!' },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Only alphabets are allowed!',
              },
            ]}
          >
            <Input placeholder="Please Enter Candidate Name" />
          </Form.Item>
          <Form.Item
            name="jobRole"
            label="Job Role"
            rules={[{ required: true, message: 'Please select job role!' }]}
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
            name="profileDate"
            label="Profile Date"
            rules={[{ required: true, message: 'Please select profile date!' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select Date" />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              { required: true, message: 'Please enter your mobile number' },
              {
                pattern: /^\d{10}$/,
                message: 'Mobile number must be exactly 10 digits',
              },
            ]}
          >
            <Input placeholder="Please Enter Mobile Number" maxLength={10} />
          </Form.Item>
          <Form.Item
            name="qualification"
            label="Qualification"
            rules={[
              { required: true, message: 'Please enter qualification!' },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Only alphabets are allowed!',
              },
            ]}
          >
            <Input placeholder="Please Enter Qualification" />
          </Form.Item>
          <Form.Item
            name="technologies"
            label="Technologies"
            rules={[{ required: true, message: 'Please enter technologies!' }]}
          >
            <Input placeholder="Please Enter Technologies" />
          </Form.Item>
          <Form.Item
            name="stack"
            label="Stack"
            rules={[
              { required: true, message: 'Please enter Stack' },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Only alphabets are allowed!',
              },
            ]}
          >
            <Input placeholder="Please Enter Stack" />
          </Form.Item>
          <Form.Item
            name="alternativeMobile"
            label="Alternative Mobile Number"
            rules={[
              { required: true, message: 'Please enter Mobile Number!' },
              {
                pattern: /^\d{10}$/,
                message: 'Mobile number must be exactly 10 digits',
              },
            ]}
          >
            <Input placeholder="Alternative Mobile Number" maxLength={10} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="expectedCTC"
            label="Expected CTC (In Lacs)"
            rules={[
              { required: true, message: 'Enter expected CTC in lacs!' },
              { pattern: /^\d{1,3}$/, message: 'Enter up to 3 digits only!' },
            ]}
          >
            <Input
              placeholder="Enter Expected CTC In Lacs"
              type="number"
              maxLength={3}
            />
          </Form.Item>
          <Form.Item
            name="candidateType"
            label="Candidate Type"
            rules={[
              { required: true, message: 'Please enter Candidate Type!' },
            ]}
          >
            <Select placeholder="Experienced">
              <Option value={CandidateType.EXPERIENCED}>
                {CandidateType.EXPERIENCED}
              </Option>
              <Option value={CandidateType.FRESHER}>
                {CandidateType.FRESHER}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="currentCTC"
            label="Current CTC (In Lacs)"
            rules={[
              { required: true, message: 'Enter current CTC in lacs!' },
              { pattern: /^\d{1,3}$/, message: 'Enter up to 3 digits only!' },
            ]}
          >
            <Input
              placeholder="Enter Current CTC In Lacs"
              type="number"
              maxLength={3}
            />
          </Form.Item>
          <Form.Item
            name="noticePeriod"
            label="Notice Period (In Days)"
            rules={[
              { required: true, message: 'Enter notice period in days!' },
              { pattern: /^\d{1,3}$/, message: 'Enter up to 3 digits only!' },
            ]}
          >
            <Input
              placeholder="Enter Notice Period In Days"
              type="number"
              maxLength={3}
            />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience (In Years)"
            rules={[
              { required: true, message: 'Enter experience in years!' },
              { pattern: /^\d{1,3}$/, message: 'Enter up to 3 digits only!' },
            ]}
          >
            <Input
              placeholder="Enter Experience In Years"
              type="number"
              maxLength={3}
            />
          </Form.Item>

          <Form.Item
            name="sourceType"
            label="Source Type"
            rules={[{ required: true, message: 'Please enter Source Type' }]}
          >
            <Select placeholder="Internal">
              <Option value={SourceType.INTERNAL}>{SourceType.INTERNAL}</Option>
              <Option value={SourceType.CONSULTANCY}>
                {SourceType.CONSULTANCY}
              </Option>
              <Option value={SourceType.DIRECT}>{SourceType.DIRECT}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="referredBy"
            label="Referred By"
            rules={[{ required: true, message: 'Please enter Referred By' }]}
          >
            <Select
              showSearch
              placeholder="Select Referred By"
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
          <Col xs={24} sm={12} md={8} lg={5} xl={5}>
            <Form.Item
              label={<span style={{ fontWeight: 'bold' }}>Upload Files</span>}
              name="resumeFilePath"
            >
              <Upload {...uploadProps} style={{ width: '100%' }}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Form.Item
            name="remarks"
            label="Remarks"
            style={{ gridColumn: 'span 4' }}
          >
            <TextArea rows={4} placeholder="Remarks" />
          </Form.Item>
          <Form.Item style={{ gridColumn: 'span 4', textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" loading={formLoading}>
              {selectedProfile ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title=" Profile Details"
        visible={isViewModalVisible}
        onCancel={handleClose}
        footer={null}
        width="50%"
      >
        {selectedProject && (
          <Row gutter={16}>
            <Col span={12}>
              <p>
                <strong>Candidate Name:</strong> {selectedProject.candidateName}
              </p>
              <p>
                <strong>Job Role:</strong> {selectedProject.name}
              </p>
              <p>
                <strong>Profile Date:</strong> {selectedProject.profileDate}
              </p>
              <p>
                <strong>Qualification:</strong> {selectedProject.qualification}
              </p>
              <p>
                <strong>Technologies:</strong> {selectedProject.technologies}
              </p>
              <p>
                <strong>Stack:</strong> {selectedProject.stack}
              </p>
              <p>
                <strong>Candidate Type:</strong> {selectedProject.candidateType}
              </p>
              <p>
                <strong>Source Type:</strong> {selectedProject.sourceType}
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Referred By:</strong> {selectedProject.fullName}
              </p>
              <p>
                <strong>Expected CTC:</strong> {selectedProject.expectedCTC}
              </p>
              <p>
                <strong>Current CTC:</strong> {selectedProject.currentCTC}
              </p>
              <p>
                <strong>Experience:</strong> {selectedProject.experience} years
              </p>
              <p>
                <strong>Notice Period:</strong> {selectedProject.noticePeriod}{' '}
                days
              </p>
              <p>
                <strong>Mobile Number:</strong> {selectedProject.mobileNumber}
              </p>
              <p>
                <strong>Alternative Mobile:</strong>{' '}
                {selectedProject.alternativeMobile || 'N/A'}
              </p>
              <p>
                <strong>Email:</strong> {selectedProject.email}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedProject.remarks || 'N/A'}
              </p>
              <Button
                type="primary"
                onClick={() => {
                  if (resumeFileURL) {
                    setPreviewResumeProfile(resumeFileURL);
                    setIsModalOpen(true);
                  } else {
                    message.error('No file found');
                  }
                }}
              >
                View File
              </Button>
            </Col>
          </Row>
        )}
      </Modal>
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        width={800}
      >
        {previewResumeFile ? (
          <>
            {previewResumeFile.match(/\.(pdf)$/i) ? (
              <iframe
                title="PDF Preview"
                src={previewResumeFile}
                style={{ width: '100%', height: '80vh' }}
              />
            ) : (
              <img
                alt="File"
                src={previewResumeFile}
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            )}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <Button
                type="primary"
                onClick={() => {
                  if (selectedProject?.resumeName) {
                    handleDownloadResumeFile(selectedProject.resumeName);
                  } else {
                    message.error('No file found');
                  }
                }}
              >
                Download
              </Button>
            </div>
          </>
        ) : (
          <p>No file found for preview.</p>
        )}
      </Modal>
    </>
  );
};

export default ViewProfile;
