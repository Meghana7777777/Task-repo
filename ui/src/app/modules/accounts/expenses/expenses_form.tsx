import { UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ExpensesFeatures,
  ExpensesModelDto,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@hrexpert/shared-models';
import {
  DesignationsService,
  EmployeeOnboardingService,
  ExpensesAganistService,
  ExpensesSharedService,
  ExpensesTypeService,
  ExpensesUploadSharedService,
} from '@hrexpert/shared-services';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  UploadProps,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const ExpensesForm: React.FC = () => {
  // const [expenseAgainst, setExpenseAgainst] = useState<string>('Employee');
  const [expenseType, setExpenseType] = useState<{ expenseId: number; expenseType: string }[]>([]);
  const [employeeNames, setEmployeeNames] = useState<{ id: number; fullName: string }[]>([]);
  // const [branchNames,setBranchNames] = useState<{branch_id:number;branch_name:string}[]>([]);
  const [branchNames, setBranchNames] = useState<any[]>();
  const [designations, setDesignations] = useState<{ id: number; name: string }[]>();
  const [expensesAgainst, setExpensesAgainst] = useState<{ expenseAgainstId: number; expenseAgainst: string }[]>([]);
  const [selectedExpenseAgainst, setSelectedExpenseAgainst] = useState<string>("Employee");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const expensesSharedService = new ExpensesSharedService();
  const expenseFileHandlingService = new ExpensesUploadSharedService();
  const expensesTypeSharedService = new ExpensesTypeService();
  const employeeOnboardingService = new EmployeeOnboardingService();
  const designationsService = new DesignationsService();
  const expensesAgainstService = new ExpensesAganistService();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    getAllExpensesTypes();
    getAllEmployeeNames();
    getAllBarnchList();
    getAllDesignations();
    fetchExpensesAgainst();
  }, []);

  const handleEmployeeChange = async (employeeName: string) => {
    try {
      const response = await employeeOnboardingService.getBranchAndRmByEmployee({ employeeName });
      if (Array.isArray(response) && response.length > 0) {
        const { branch_name, reportingManager } = response[0];
        form.setFieldsValue({
          branch: branch_name,
          branchManager: reportingManager,
        });
      } else {
        console.error("Error: Unexpected response format", response);
      }
    } catch (error) {
      console.error("Failed to fetch branch and reporting manager:", error);
    }
  };

  const fetchExpensesAgainst = async () => {
    try {
      const response = await expensesAgainstService.getExpensesAgainst();
      if (response && response.status) {
        const activeExpenses = response.data.filter((expense: any) => expense.isActive);
        setExpensesAgainst(activeExpenses || []);
      } else {
        message.error('Failed to fetch expenses Against data');
      }
    } catch (error) {
      message.error('Error fetching expenses Against data');
    }
  };

  const getAllDesignations = async () => {
    try {
      const response = await designationsService.getDesignations();
      console.log('Fetched Designations:', response.data);
      if (response?.status && Array.isArray(response.data)) {
        setDesignations(response.data);
      } else {
        console.error("Error: Unexpected response format", response);
      }
    } catch (error) {
      console.error("Failed to fetch Designations:", error);
    }
  }

  const getAllEmployeeNames = async () => {
    try {
      const response = await employeeOnboardingService.getEmployeeNamesList();
      console.log('Fetched Employee Names:', response.data);

      if (response && Array.isArray(response)) {
        setEmployeeNames(response);
      } else {
        console.error('Error: Invalid response data', response);
      }
    } catch (error) {
      console.error('Failed to fetch employee names:', error);
    }
  };

  const getAllBarnchList = async () => {
    try {
      const response = await employeeOnboardingService.getBranchNamesList();
      if (response && Array.isArray(response)) {
        setBranchNames(response)
      } else {
        console.error('Error: Invalid response data', response);
      }
    } catch (error) {
      console.error('Failed to fetch employee names:', error);
    }
  }

  const getAllExpensesTypes = async () => {
    try {
      const response = await expensesTypeSharedService.getExpensesType();
      console.log("Fetched Expense Types:", response.data);

      if (response?.data) {
        setExpenseType(response.data);
        console.log("Expense Types:", response.data);
      } else {
        console.error("Error: Invalid response data", response);
      }
    } catch (error) {
      console.error("Failed to fetch expense types:", error);
    }
  };

  const handleNavigate = () => {
    navigate('/expenses-view')
  }

  const handleReset = () => {
    form.resetFields();
  }

  const handleExpenseAgainstChange = (value: string) => {
    setSelectedExpenseAgainst(value);
    console.log('Selected Expense Against:', value);
  };

  const uploadImageProps: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      let files: any[] = fileList?.filter((f) => f.uid != file.uid);
      setFileList(files);
    },
    beforeUpload: (file: any, files: any) => {
      if (
        !file.name.match(
          /\.(pdf|xlsx|xls|png|jpeg|PNG|jpg|JPG|pjpeg|gif|tiff|x-tiff|x-png|ppt|pptx|doc|docx|csv|zip)$/
        )
      ) {
        message.error('Only pdf,xlsx,xls,png,jpeg,jpg files are allowed.');
        return false;
      }
      setFileList([...fileList, ...files]);
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

  const fileHandling = async (id: number, uploadedFiles: any) => {
    try {
      const formData = new FormData();
      if (uploadedFiles?.length) {
        formData.append('id', `${id}`);
        formData.append('featuresRefName', ExpensesFeatures.ER)
        for (let i = 0; i < uploadedFiles?.length; i++) {
          formData.append('file', uploadedFiles?.[i]);
        }
      }
      await expenseFileHandlingService.expensesFileUpload(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values: any) => {
    console.log('Received values of form: ', values);
    try {
      const documentData: ExpensesModelDto = {
        ...values,
        created_date: new Date().toISOString(),
        file:
          values.file && values.file[0]?.originFileObj
            ? values.file[0].originFileObj
            : null,
      };
      const documentResponse =
        await expensesSharedService.createExpenseDocument(documentData);
      if (documentResponse.status) {
        await fileHandling(documentResponse.data[0].expenses_id, fileList);
        setFileList([]);
        message.success('Document added successfully');
        form.resetFields();
        navigate('/expenses-view');
      } else {
        console.error('Error adding document:', documentResponse);
        message.error(
          documentResponse.status || 'Error occurred while adding document'
        );
      }
    } catch (error: any) {
      console.error('Error adding document:', error);
      message.error(error.message || 'Error occurred while adding document');
    }
  };

  const renderFields = () => {
    if (selectedExpenseAgainst === "Employee") {
      return (
        <>
          <Col span={8}>
            <Form.Item label="Employee Name" name="employeeName">
              <Select onChange={handleEmployeeChange} allowClear showSearch placeholder="Select Employee Name">
                {employeeNames.map((emp) => (
                  <Option key={emp.id} value={emp.fullName}>{emp.fullName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Branch" name="branch">
              <Select placeholder="Select Branch" allowClear showSearch disabled>
                {branchNames?.map((branch) => (
                  <Option key={branch.branch_id} value={branch.branch_name}>{branch.branch_name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Manager" name="branchManager">
              <Input placeholder="Enter Manager" disabled />
            </Form.Item>
          </Col>
        </>
      );
    } else if (selectedExpenseAgainst === "Branch") {
      return (
        <Col span={8}>
          <Form.Item label="Branch" name="branch">
            <Select placeholder="Select Branch" allowClear showSearch>
              {branchNames?.map((branch) => (
                <Option key={branch.branch_id} value={branch.branch_name}>{branch.branch_name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      );
    } else {
      return (
        <>
          <Col span={8}>
            <Form.Item label="Employee Name" name="employeeName">
              <Select onChange={handleEmployeeChange} allowClear showSearch placeholder="Select Employee Name">
                {employeeNames.map((emp) => (
                  <Option key={emp.id} value={emp.fullName}>{emp.fullName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Branch" name="branch">
              <Select placeholder="Select Branch" allowClear showSearch disabled>
                {branchNames?.map((branch) => (
                  <Option key={branch.branch_id} value={branch.branch_name}>{branch.branch_name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Manager" name="branchManager">
              <Input placeholder="Enter Manager" disabled />
            </Form.Item>
          </Col>
        </>
      );
    }
  };

  return (
    <>
      <PageContainer
        title="Add Expenses"
        extra={[
          <Button key="add" style={{ marginRight: 10, borderColor: '#1677ff', color: '#1677ff' }} onClick={handleNavigate}>
            View Expense
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={styles.container}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Date" name="date" initialValue={dayjs()}
                rules={[{ required: true, message: 'Date is required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Expenses Against"
                name="expensesAgainst"
                initialValue="Employee"
                rules={[{ required: true, message: 'Expenses Against is required' }]}
              >
                <Select
                  value={selectedExpenseAgainst}
                  onChange={handleExpenseAgainstChange}
                  placeholder="Select Expense Type"
                  allowClear
                  showSearch
                >
                  {expensesAgainst.map((expense) => (
                    <Select.Option key={expense.expenseAgainstId} value={expense.expenseAgainst}>
                      {expense.expenseAgainst}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Expense Type" name="expensesType"
                rules={[{ required: true, message: 'Expense Type is required' }]}
              >
                <Select style={{ width: '100%' }} placeholder="Select Expense Type"
                  allowClear
                  showSearch
                >
                  {expenseType.map((expense) => (
                    <Select.Option key={expense.expenseId} value={expense.expenseType}>
                      {expense.expenseType}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            {renderFields()}
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Amount" name="amount"
                rules={[{ required: true, message: 'Amount is required' }]}
              >
                <Input
                  type="number"
                  placeholder="Enter Amount"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Payment Mode" name="paymentMode"
                rules={[{ required: true, message: 'Payment Mode is required' }]}
              >
                <Select placeholder="Select Payment Mode">
                  {Object.values(PaymentTypeEnum).map((mode) => (
                    <Select.Option key={mode} value={mode}>
                      {mode}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ref Number" name="referenceNo"
                rules={[{ required: false, message: 'Ref Number is required' }, { pattern: /^[a-zA-Z0-9]+$/, message: 'Only letters and numbers are allowed' }]}
              >
                <Input
                  placeholder="Enter Ref Number"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Payment Status" name="paymentStatus"
                rules={[{ required: true, message: '"Payment Status is required' }]}
              >
                <Select placeholder="Select Payment Mode"
                  allowClear showSearch
                >
                  {Object.values(PaymentStatusEnum).map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tax Applicable" name="taxApplicable"
                rules={[{ required: true, message: 'Tax Applicable is required' }]}
              >
                <Select placeholder="Select Tax Applicable"
                  allowClear showSearch
                >
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Approved By" name="approvedBy"
                rules={[{ required: true, message: 'Approved By is required' }]}
              >
                <Select placeholder="Select Approved By"
                  allowClear showSearch
                >
                  {designations?.map((res) => (
                    <Option key={res.id} value={res.name}>
                      {res.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Remarks" name="remarks"
              >
                <Input placeholder="Enter Remarks" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Attach File" name="upload">
                <Upload {...uploadImageProps}>
                  <Button
                    icon={<UploadOutlined />}
                  >
                    Upload File
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} justify="start">
            <Col span={8}>
              <Form.Item>
                <Button htmlType="submit" style={{ borderColor: '#1677ff', color: '#1677ff' }}>
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item style={{ marginLeft: -300 }}>
                <Button onClick={handleReset}
                  icon={<UndoOutlined />}
                  style={{ borderColor: '#ff4d4f', width: '60px', borderStyle: 'dashed', color: '#FF4D50' }}>
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>


        </Form>
      </PageContainer>
    </>
  );
};

export default ExpensesForm;

const styles = {
  container: {
    padding: 20,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap' as 'wrap',
  },
  column: {
    flex: '1 1 30%',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
  },
};
