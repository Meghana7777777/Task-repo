import { UploadOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Radio,
  Row,
  Col,
  Card,
} from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

const JoiningForm = () => {
  const [form] = Form.useForm();
  const [experienceType, setExperienceType] = useState('fresher'); // Default selection

  const onFinish = (values) => {
    console.log('Form Submitted:', values);
  };

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Personal Information */}
        <h2>Personal Details</h2>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="mobileNumber"
              label="Mobile Number"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="Enter your mobile number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="currentLocation"
              label="Current Location"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your current city" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="aadhaarAddress"
              label="Aadhaar Card Address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter address as per Aadhaar Card" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="Address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input.TextArea placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>

        {/* Experience Type Selection */}
        <h2>Experience Details</h2>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="experienceType"
              label="Are you a Fresher or Experienced?"
              rules={[{ required: true }]}
            >
              <Radio.Group
                onChange={(e) => setExperienceType(e.target.value)}
                value={experienceType}
              >
                <Radio value="fresher">Fresher</Radio>
                <Radio value="experienced">Experienced</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Experience Details (Only for Experienced) */}
        {experienceType === 'experienced' && (
          <>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="totalExperience"
                  label="Total Experience (Years)"
                  rules={[{ required: true }]}
                >
                  <Input
                    type="number"
                    placeholder="Enter total years of experience"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="currentCompany"
                  label="Current Company"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="designation"
                  label="Current Designation"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your designation" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="currentSalary"
                  label="Current Salary (Annual)"
                  rules={[{ required: true }]}
                >
                  <Input type="number" placeholder="Enter current salary" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="salaryBreakdown"
                  label="Salary Breakdown"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter breakdown (Basic, HRA, Bonus, etc.)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="noticePeriod"
                  label="Notice Period (Days)"
                  rules={[{ required: true }]}
                >
                  <Input
                    type="number"
                    placeholder="Enter notice period in days"
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Upload Resume */}
        <h2>Upload Documents</h2>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="resume"
              label="Upload Resume"
              rules={[{ required: true }]}
            >
              <Upload beforeUpload={() => false} listType="text">
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Application
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default JoiningForm;
