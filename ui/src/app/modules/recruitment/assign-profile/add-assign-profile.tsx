import { UndoOutlined } from "@ant-design/icons";
import { AssignProfileServiceSharedService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, Select, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";

export interface Props {
  data?: any;
  closeForm: () => void;
  getAllCompanys: () => void
  getAllRequirements: () => void
  companyRecords?: any
  requirementRecords?: any
  assignProfiles: () => void

}

const AddAssignProfile = (props: Props) => {
  const [form] = Form.useForm();
  const Service = new AssignProfileServiceSharedService();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any>([]);
  const Option = Select
  const [profileData, setProfileData] = useState<any[]>([])


  const onReset = () => {
    form.resetFields();
  };


  const getProfiles = () => {
    const jobRole = form.getFieldValue('jobRole')
    Service.getProfilesToAssign({ jobRole: jobRole }).then((res) => {
      if (res.status) {
        message.success(res.internalMessage);
        setProfileData(res.data)
      } else {
        message.error(res.internalMessage);
      }
    }).catch((err) => {
      console.log(err);
    })
  };

  const assignProfiles = async () => {
    try {
      const req = [...selectedRows, { requirement: form.getFieldValue('requirement') }]
      Service.assignProfiles(req).then((res) => {
        if (res.status) {
          message.success(res.internalMessage);
          props.closeForm()
          props.getAllCompanys()
          props.getAllRequirements()
          props.assignProfiles()
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

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
      align: "center"
    },
    {
      title: "Quailification",
      dataIndex: "qualification",
      align: "center"
    },
    {
      title: "Technologies",
      dataIndex: "technologies",
      align: "center"
    },
    {
      title: "Experiance",
      dataIndex: "experience",
      align: "center"
    },

  ];

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: any[]) => {
      setSelectedRowKeys(keys)
      setSelectedRows(rows)
    },
  };

  const onChangeCompany = () => {
    const x = form.getFieldValue('company')
    const y = props?.requirementRecords?.filter((res) => res.Company == x)
    setRequirements(y)
  }

  const onChangeRequirement = (val) => {
    form.setFieldsValue({ jobRole: props?.requirementRecords?.find((res) => res.id === val) }.jobRole)
  }


  return (
    <Card>
      <Form layout="vertical" form={form}
        onFinish={getProfiles}
      >
        <Row gutter={8}>
          <Form.Item name="id" label="Id" hidden>
            <Input hidden />
          </Form.Item>

          <Col xs={24} sm={12} md={8} lg={6} xl={8}>
            <Form.Item
              label="Company Name"
              name="company"
              rules={[{ required: true, message: "Please select a company" }]}
            >
              <Select showSearch allowClear dropdownMatchSelectWidth={false} onChange={onChangeCompany}
                optionFilterProp="children" placeholder="Select company"  >
                {props.companyRecords.map((rec: any) => (
                  <Option value={rec.id} key={rec.id}>
                    {rec.companyName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6} xl={8}>
            <Form.Item
              label="Requirement"
              name="requirement"
              rules={[{ required: true, message: "Please select a requirement" }]}
            >
              <Select showSearch allowClear dropdownMatchSelectWidth={false} onChange={onChangeRequirement}
                optionFilterProp="children" placeholder="Select Requirement"  >
                {requirements?.map((rec: any) => (
                  <Option value={rec?.id} key={rec?.id}>
                    {rec?.name} - {rec?.jobDescription}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Form.Item
            label="job Role"
            name="jobRole" hidden
          >
            <Select showSearch allowClear dropdownMatchSelectWidth={false}
              optionFilterProp="children" placeholder="Select job role"  >
              {requirements?.map((rec: any) => (
                <Option value={rec?.jobRole} key={rec?.jobRole}>
                  {rec?.name} - {rec?.jobDescription}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Col xs={24} sm={12} md={8} lg={6} xl={2}>
            <Button
              type="primary"
              htmlType="submit"
              className="ant-submit-btn"
              style={{ marginTop: 23 }}
            >
              Get Candidates
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={1}>
            <Form.Item>
              <Button
                type="default"
                danger
                icon={<UndoOutlined />}
                onClick={onReset}
                style={{ marginLeft: 20, marginTop: 23 }}
              >
                Reset
              </Button>
            </Form.Item>
          </Col>

        </Row>
      </Form>

      {profileData?.length > 0 ? <>
        <Table
          rowKey={(record) => record.candidateName}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={profileData}
          size="small"
          pagination={{
            pageSize: 20,
            onChange(current, pageSize) {
              setPage(current);
              setPageSize(pageSize)
            },
          }}
          bordered
        />

        <Col xs={24} sm={12} md={8} lg={6} xl={1}>
          <Form.Item>
            <Button
              type="primary"
              className="ant-submit-btn"
              style={{ marginTop: 23 }}
              onClick={assignProfiles}
            >
              Submit
            </Button>
          </Form.Item>
        </Col>
      </> : <></>}

    </Card>
  );
};

export default AddAssignProfile;
