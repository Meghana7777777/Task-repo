import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Space,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RecruitmentServiceSharedService } from '@hrexpert/shared-services';
import { CandidateType, SourceType } from '@hrexpert/shared-models';
import ViewProfile from './view-profile';
import { PageContainer } from '@ant-design/pro-layout';

// Assuming you have a service file where createProfile is defined

const { Option } = Select;
const { TextArea } = Input;

const AddProfile = ({ visible, onCancel, onUpdate, profileToEdit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const recruitmentServiceSharedService = new RecruitmentServiceSharedService();

  useEffect(() => {
    if (profileToEdit) {
      form.setFieldsValue({
        ...profileToEdit,
        profileDate: profileToEdit.profileDate
          ? moment(profileToEdit.profileDate)
          : null,
        resume: profileToEdit.resumePath
          ? [{ name: 'Resume', url: profileToEdit.resumePath }]
          : [],
      });
      setFileList(
        profileToEdit.resumePath
          ? [{ name: 'Resume', url: profileToEdit.resumePath }]
          : []
      );
    }
  }, [profileToEdit, form]);

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel(); // Call the parent's onCancel
  };

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (values.profileDate) {
        values.profileDate = values.profileDate.format('YYYY-MM-DD');
      }
      if (fileList.length > 0) {
        values.resume = fileList[0];
      }

      let response;
      if (profileToEdit) {
        response =
          await recruitmentServiceSharedService.updateProfileRecruitment({
            ...values,
            id: profileToEdit.id,
          });
      } else {
        response = await recruitmentServiceSharedService.createProfile(values);
      }

      if (response.status) {
        message.success(
          profileToEdit
            ? 'Profile updated successfully'
            : 'Profile created successfully'
        );
        onUpdate();
        form.resetFields();
        setFileList([]);
      } else {
        message.error('Operation failed');
      }
    } catch (error) {
      message.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload change
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <>
      <PageContainer
        title="Profiles"
        breadcrumbRender={false}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={showModal}
              style={{
                // Removed position: 'absolute' to align with Ant Design's layout conventions
                marginLeft: 8, // Optional: Adds spacing if needed
              }}
            >
              Add Profile
            </Button>
          </Space>
        }
        style={{ padding: 0 }} // Optional: Removes default padding if table needs full width
      >
        <ViewProfile />
      </PageContainer>
      <Modal
        title="Create Profile"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
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
          {/* Candidate Name */}
          <Form.Item
            name="candidateName"
            label="Candidate Name"
            rules={[
              { required: true, message: 'Please enter candidate name!' },
            ]}
          >
            <Input placeholder="Please Enter Candidate Name" />
          </Form.Item>

          {/* Job Role */}
          <Form.Item
            name="jobRole"
            label="Job Role"
            rules={[{ required: true, message: 'Please select job role!' }]}
          >
            <Select placeholder="Select Job Role">
              <Option value="developer">Developer</Option>
              <Option value="designer">Designer</Option>
              <Option value="manager">Manager</Option>
              {/* Add more options as needed */}
            </Select>
          </Form.Item>

          {/* Profile Date */}
          <Form.Item
            name="profileDate"
            label="Profile Date"
            rules={[{ required: true, message: 'Please select profile date!' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select Date" />
          </Form.Item>

          {/* Mobile Number */}
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[{ required: true, message: 'Please enter mobile number!' }]}
          >
            <Input placeholder="Please Enter Mobile Number" />
          </Form.Item>

          {/* Qualification */}
          <Form.Item
            name="qualification"
            label="Qualification"
            rules={[{ required: true, message: 'Please enter qualification!' }]}
          >
            <Input placeholder="Please Enter Qualification" />
          </Form.Item>

          {/* Technologies */}
          <Form.Item
            name="technologies"
            label="Technologies"
            rules={[{ required: true, message: 'Please enter technologies!' }]}
          >
            <Input placeholder="Please Enter Technologies" />
          </Form.Item>

          {/* Stack */}
          <Form.Item
            name="stack"
            label="Stack"
            rules={[{ required: true, message: 'Please enter stack!' }]}
          >
            <Input placeholder="Please Enter Stack" />
          </Form.Item>

          <Form.Item name="alternativeMobile" label="Alternative Mobile Number">
            <Input placeholder="Alternative Mobile Number" />
          </Form.Item>

          {/* Expected CTC */}
          <Form.Item
            name="expectedCTC"
            label="Expected CTC (In Lacs)"
            rules={[{ required: true, message: 'Enter expected CTC in lacs!' }]}
          >
            <Input placeholder="Enter Expected CTC In Lacs" type="number" />
          </Form.Item>

          {/* Candidate Type */}
          <Form.Item name="candidateType" label="Candidate Type">
            <Select placeholder="Experienced">
              <Select.Option value={CandidateType.EXPERIENCED}>
                {CandidateType.EXPERIENCED}
              </Select.Option>
              <Select.Option value={CandidateType.FRESHER}>
                {CandidateType.FRESHER}
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Current CTC */}
          <Form.Item
            name="currentCTC"
            label="Current CTC (In Lacs)"
            rules={[{ required: true, message: 'Enter current CTC in lacs!' }]}
          >
            <Input placeholder="Enter Current CTC In Lacs" type="number" />
          </Form.Item>

          {/* Notice Period */}
          <Form.Item
            name="noticePeriod"
            label="Notice Period (In Days)"
            rules={[
              { required: true, message: 'Enter notice period in days!' },
            ]}
          >
            <Input placeholder="Enter Notice Period In Days" type="number" />
          </Form.Item>

          {/* Experience */}
          <Form.Item
            name="experience"
            label="Experience (In Years)"
            rules={[{ required: true, message: 'Enter experience in years!' }]}
          >
            <Input placeholder="Enter Experience In Years" type="number" />
          </Form.Item>

          {/* Source Type */}
          <Form.Item name="sourceType" label="Source Type">
            <Select placeholder="Internal">
              <Select.Option value={SourceType.INTERNAL}>
                {SourceType.INTERNAL}
              </Select.Option>
              <Select.Option value={SourceType.CONSULTANCY}>
                {SourceType.CONSULTANCY}
              </Select.Option>
              <Select.Option value={SourceType.DIRECT}>
                {SourceType.DIRECT}
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Referred By */}
          <Form.Item name="referredBy" label="Referred By">
            <Select placeholder="Select Employee">
              <Option value="emp1">Employee 1</Option>
              <Option value="emp2">Employee 2</Option>
              {/* Add more employees as needed */}
            </Select>
          </Form.Item>

          {/* Upload Resume */}
          <Form.Item name="resume" label="Upload Resume">
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
          </Form.Item>

          {/* Remarks */}
          <Form.Item
            name="remarks"
            label="Remarks"
            style={{ gridColumn: 'span 4' }} // Span across all columns
          >
            <TextArea rows={4} placeholder="Remarks" />
          </Form.Item>
          <Form.Item style={{ gridColumn: 'span 4', textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {profileToEdit ? 'Update' : 'Create'}
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProfile;
