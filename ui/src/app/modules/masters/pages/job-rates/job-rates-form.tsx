import { UndoOutlined } from "@ant-design/icons";
import { JobRatesReq } from '@hrexpert/shared-models';
import { JobRatesSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect } from "react";

export interface JobRateProps {
  isUpdate?: boolean;
  jobRatesData?: any
  closeModal?: () => void
  getJobRates?: () => void
  updateDetails: (style: any) => void;
  closeForm?: any
  branchData?: any
  jobsData?: any
}

const JobRatesForm = (props: JobRateProps) => {
  const [form] = Form.useForm();
  const jobRatesSharedservice = new JobRatesSharedService();
  const Option = Select

  useEffect(() => {
    if (props.jobRatesData) {
      form.setFieldsValue({
        id: props.jobRatesData.id,
        jobId: props.jobRatesData.jobId,
        branchId: props.jobRatesData.branchId,
        rate: props.jobRatesData.rate,
        effFromDate: dayjs(props.jobRatesData.effFromDate)
      });
    }
  }, [props.jobRatesData]);

  const onReset = () => form.resetFields();

  const createJobRates = async (val: JobRatesReq) => {
    try {
      jobRatesSharedservice.createJobRates(val).then((res) => {
        if (res.status) {
          message.success('Created SuccessFully');
          props.closeModal()
          props.getJobRates()
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  const updateJobRates = (formData: any) => {
    try {
      jobRatesSharedservice.updateJobRates(formData)
        .then((res) => {
          if (res.status) {
            message.success("Updated SuccessFully");
            props.closeForm()
            props.getJobRates()
          } else {
            message.error(res.internalMessage);
          }
        })
    } catch (error) {
      console.error("Error Updating Job Rate Details:", error);
    }
  };

  const saveData = (val: any) => {
    if (props.isUpdate) {
      props.updateDetails({ ...val, id: props.jobRatesData?.id });
    }
    else {
      createJobRates(val)
    }
  }


  return (
    <Card>
      <Form layout="vertical" form={form} onFinish={saveData} initialValues={{
        ...props.jobRatesData,
        effFromDate: props.jobRatesData?.effFromDate ? dayjs(props.jobRatesData.effFromDate) : null,
      }}>
        <Row gutter={8}>
          <Form.Item name="id" hidden>
            <Input hidden />
          </Form.Item>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item
              key={Date.now()}
              name="jobId"
              label="Job Code"
            >
              <Select
                allowClear
                showSearch
                placeholder="Select Job Code"
                optionFilterProp="children"
              >
                {props?.jobsData.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {`${type.jobCode}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
            <Form.Item
              name="branchId"
              label="Branch">
              <Select allowClear placeholder="Select Branch" showSearch optionFilterProp="children">
                {props?.branchData.map((rec) => (
                  <Option value={rec.id} key={rec.id}>
                    {rec.branchName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="rate"
              label="Rate"
              rules={[{ required: true, message: "Please Enter Rate" }]}
            >
              <Input placeholder="Enter Rate" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item
              name="effFromDate"
              label="Eff From Date"
              rules={[{ required: true, message: "Please Enter Eff From Date" }]}
            >
              <DatePicker format={'DD-MM-YYYY'} placeholder="Enter Eff From Date" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={2} xl={2}>

            <Button
              type="primary"
              htmlType="submit"
              className="ant-submit-btn"
              style={{ marginTop: 23 }}
            >
              {props.isUpdate ? "Update" : "Submit"}
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={2} xl={2}>
            <Form.Item>
              <Button
                type="default"
                danger
                icon={<UndoOutlined />}
                onClick={onReset}
                style={{ marginTop: 23 }}
              >
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default JobRatesForm;
