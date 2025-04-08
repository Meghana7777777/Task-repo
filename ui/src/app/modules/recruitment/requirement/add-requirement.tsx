import { UndoOutlined } from "@ant-design/icons";
import { JobRatesReq } from '@hrexpert/shared-models';
import { DesignationsService, JobRatesSharedService, RecruitmentServiceSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";

export interface recruitmentProps {
  isUpdate?: boolean;
  jobRatesData?: any
  closeModal?: () => void
  getJobRates?: () => void
  updateDetails: (style: any) => void;
  closeForm?: any
  designations?: any
  jobsData?: any
  companyRecords?: any
}

const AddRequirement = (props: recruitmentProps) => {
  const [form] = Form.useForm();
  const recruitmentSharedservice = new RecruitmentServiceSharedService();
  const Option = Select

  console.log(props.jobRatesData)
  useEffect(() => {
    if (props.jobRatesData) {
      form.setFieldsValue({
        id: props.jobRatesData.id,
        company: props.jobRatesData.companyId,
        jobRole: props.jobRatesData.designationId,
        jobDescription: props.jobRatesData.jobDescription,
        notificationDate: props.jobRatesData.notificationDate ? dayjs(props.jobRatesData.notificationDate) : null,
        planningClosingDate: props.jobRatesData.planningClosingDate ? dayjs(props.jobRatesData.planningClosingDate) : null,
        resourceRequired: props.jobRatesData.resourceRequired,
        technology: props.jobRatesData.technology,
        billingRate: props.jobRatesData.billingRate,
        approxExperience: props.jobRatesData.approxExperience,
        minProjectDuration: props.jobRatesData.minProjectDuration,
        expensesPaidByClient: props.jobRatesData.expensesPaidByClient?.toString(), // Convert to string for Select
        status: props.jobRatesData.status,
        jobLocation: props.jobRatesData.jobLocation,
        remarks: props.jobRatesData.remarks
      });
    }
  }, [props.jobRatesData]);


  const onReset = () => {
    form.resetFields();  // Resets the form fields
    props.closeModal?.(); // Closes the modal if the function is provided
  };





  const createRecruitment = async (val: JobRatesReq) => {
    try {
      recruitmentSharedservice.createRecruitment(val).then((res) => {
        if (res.status) {
          message.success('Created SuccessFully');
          props.closeForm()
          props.getJobRates()
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  };



  const saveData = (val: any) => {
    if (props.isUpdate) {
      props.updateDetails({ ...val, id: props.jobRatesData?.id });

    }
    else {
      createRecruitment(val)
      props.closeModal?.()
    }
  }


  return (
    <Card>
      <Form layout="vertical" form={form} onFinish={saveData} initialValues={{
        ...props.jobRatesData,
        effFromDate: props.jobRatesData?.effFromDate ? dayjs(props.jobRatesData.effFromDate) : null,
        planningClosingDate: props.jobRatesData?.planningClosingDate ? dayjs(props.jobRatesData.planningClosingDate) : null,

      }}>
        <Row gutter={16}>

          <Col span={8}>
            <Form.Item label='Company' name='company'
              rules={[{ required: true, message: "Please Select Company" }]}
            >
              <Select
                showSearch
                placeholder='Select Company'
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                } >
                {props?.companyRecords.map((comp) => (
                  <Option key={comp.id} value={comp.id}>
                    {comp.companyName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="jobRole" label="Job Role" rules={[{ required: true, message: "Job Role is required" }]}>
              <Select showSearch allowClear placeholder="Select Roles" optionFilterProp="children">
                {props.designations.map((rec: any) => (
                  <Option value={rec.id} key={rec.id}>
                    {rec.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="jobDescription" label="Job Description" rules={[{ required: true, message: "Job Description is required" }]}>
              <Input.TextArea rows={2} placeholder="Enter Job Descriptions" />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={16}>

          <Col span={8}>
            <Form.Item name="notificationDate" label="Notification Date" rules={[{ required: true, message: "Notification Date is required" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="resourceRequired" label="Resource Required" rules={[{ required: true, message: "Resource count is required" }]}>
              <Input type="number" placeholder="Enter Resource Count" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="technology" label="Technology" rules={[{ required: true, message: "Technology is required" }]}>
              <Input placeholder="Enter Technology Stack" />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={16}>

          <Col span={8}>
            <Form.Item name="planningClosingDate" label="Planned Closing Date" rules={[{ required: true, message: "Planned Closing Date is required" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="billingRate" label="Billing Rate">
              <Input type="number" placeholder="Enter Billing Rate" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="approxExperience" label="Approx Experience">
              <Input type="number" placeholder="Enter Years of Experience" />
            </Form.Item>
          </Col>


        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="minProjectDuration" label="Min Duration">
              <Input placeholder="Enter Duration" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="expensesPaidByClient" label="Expenses Paid By Client">
              <Select placeholder="Select">
                <Option value="1">Yes</Option>
                <Option value="0">No</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select Status">
                <Option value="Open">Open</Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={16}>

          <Col span={8}>
            <Form.Item name="jobLocation" label="Job Location">
              <Select placeholder="Select Location">
                <Option value="Work From Home">Work From Home</Option>
                <Option value="Onsite">Onsite</Option>
                <Option value="Hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={2} placeholder="Enter Remarks" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
              {props.isUpdate ? "Update" : "Submit"}
            </Button>
            <Button type="default" danger onClick={onReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AddRequirement;
