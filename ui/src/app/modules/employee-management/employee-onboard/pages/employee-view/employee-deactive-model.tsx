import { UndoOutlined, UploadOutlined } from "@ant-design/icons";
import { EmployeeDetailsDto, EmpResignationProofsDto } from '@hrexpert/shared-models';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, Row, Upload, UploadFile, UploadProps, message, notification } from "antd";
import { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
  employeeData?: any;
  closeForm: () => void;
  EmployeeDeactiveForm?: FormInstance<any>;
  getAllEmployeeData: (employeeId: number) => void; 
}

const EmployeeDeactiveForm = (props: Props) => {
  const [form] = Form.useForm();
  const [disable, setDisable] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [ uploading, setUploading ] = useState(false);
  // const [employeeList, setEmployeeList] = useState<any[]>([]);
  const navigate = useNavigate();

  const service = new EmployeeOnboardingService();

  useEffect(() => {
    if (props.employeeData) {
      form.setFieldsValue({
        ...props.employeeData,
        dateOfReliving: props?.employeeData?.dateOfReliving ? dayjs(props?.employeeData?.dateOfReliving) : null
      });
    }
  }, [props.employeeData, form]);

  const onReset = () => {
    form.resetFields();
  };

const handleRemove = (file) => {
  const updatedFileList = fileList.filter(item => item.uid !== file.uid);
  setFileList(updatedFileList);
};

const handleBeforeUpload = async (file) => {
  setUploading(true)
  const fileTypes = /\.(jpg|png|jpeg|JPG|JPEG|PNG)$/; 
  if (!file.name.match(fileTypes)) {
    message.error("Only images (jpg, png, jpeg).");
    setUploading(false);
    return false;
}
  try {

    if (fileList.length == 3) {
      notification.info({
        message: 'You Cannot Upload More Than One File At A Time',
      });
      return true;
    } else {
      setUploading(false)
      setFileList([...fileList, file]);
      return false;
    }
  } catch (error) {
    return true; // Returning true to prevent uploading if an error occurs
  }
};

const uploadFieldProps = {
  multiple: true,
  onRemove: handleRemove,
  beforeUpload: handleBeforeUpload,
  progress: {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
  },
  fileList: fileList,
};
  
  const updateDeactiveEmployee = async (val: EmpResignationProofsDto) => {
    try {
      const resProofs: EmpResignationProofsDto = {
        id: val.id,
        employeeId: val.employeeId,
        employeeCode: val.employeeCode,
        firstName: val.firstName,
        dateOfReliving: val.dateOfReliving,
        employeeRemarks: val.employeeRemarks,
        fileName: '',
        originalFileName: '',
        filePath: ''
      };
      const response = await service.empResignationProofs(resProofs);
      if (response.status) {
        if (fileList.length > 0) {
          const formData = new FormData();
          for(const file of fileList){
            formData.append('file',file)
          }
          formData.append('resignationId', `${response.data.id}`);
        const res = await service.updatePath(formData);
        if (res.status) {
          message.success("Created successfully");
          // setEmployeeList((prev)=>[...prev, {...val, filePath: res.data.filePath}]);
          props.closeForm();
          if (val.id) {
            props.getAllEmployeeData(val.id);
          }
        } else {
          message.error(response.internalMessage);
        }
      } else {
        props.closeForm();
      }
    
  }}catch (error) {
      message.error('An error occurred');
      console.error(error);
    } finally {
      setDisable(false);
    }
  };

  return (
    <Card>
      <Form
        layout="vertical"
        form={form}
        onFinish={updateDeactiveEmployee}
        //initialValues={props.employeeData}
      >
        <Row gutter={8}>
          <Form.Item name="id" label="Id" hidden>
            <Input hidden />
          </Form.Item>
            <Form.Item name="employeeId"hidden>
              <Input hidden />
            </Form.Item>
            <Form.Item name="firstName"  hidden>
              <Input hidden />
            </Form.Item>
          <Col xs={24} sm={12} md={8} lg={4} xl={8}>
            <Form.Item name="branch" label="Branch">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={8}>
            <Form.Item name="employeeCode" label="Employee Code">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={8}>
            <Form.Item name="employeeType" label="Employee Type">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col xs={24} sm={12} md={8} lg={4} xl={8}>
            <Form.Item
              label="Date of Relieving"
              name="dateOfReliving"
              rules={[{ required: true, message: "Please enter employee relieving date" }]}
            >
              <DatePicker
                placeholder="Enter Date of Relieving"
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={8}>
            <Form.Item
              name="employeeRemarks"
              label="Employee Remarks"
            // rules={[{ required: true, message: "Please enter employee remarks" }]}
            >
              <Input placeholder="Enter employee remarks" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={8}>
          <Form.Item
          name={[ 'file']}
          label="Document Upload"                     
          >
            <Upload
            {...uploadFieldProps}
            style={{ width: "100%" }} 
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24} sm={12} md={8} lg={6} xl={2}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="ant-submit-btn"
                style={{ marginLeft: 20, marginTop: 23 }}
                disabled={disable}
                // onClick = {() =>navigate('/employee-resignation-view')}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={2}>
            <Form.Item>
              <Button
                type="default"
                danger
                icon={<UndoOutlined />}
                onClick={onReset}
                style={{ marginLeft: 20, marginTop: 23 }}
                disabled={disable}
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

export default EmployeeDeactiveForm;
