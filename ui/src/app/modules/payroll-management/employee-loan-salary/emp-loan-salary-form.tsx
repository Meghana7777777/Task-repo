import { UndoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { AlertMessages, EmpLoanSalarySharedDto, LoanSalaryTypeEnum } from "@hrexpert/shared-models";
import { BranchesService, EmpLoanSalarySharedService, EmployeeOnboardingService, ReasonsTypeService } from "@hrexpert/shared-services";
import { Button, Col, DatePicker, Form, FormInstance, Input, message, Modal, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";

export interface Props {
  empLoanSalaryData?: EmpLoanSalarySharedDto;
  updateDetails: (style: EmpLoanSalarySharedDto) => void;
  isUpdate: boolean;
  closeForm: () => void;
  empLoanSalary?: FormInstance<any>;
 // getEmpLoanSalary: () => void
  form: any
  getPreviousLoans:()=> void
}
export default function EmployeeLoanForm(props: Props) {
  const [form] = Form.useForm();
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [branches, setBranches] = useState<any>([]);
  const [purposeOptions, setPurposeOptions] = useState([]);
  const { Option } = Select
  const [filteredEmployeeList, setFilteredEmployeeList] = useState<any[]>([]);
  const [selectReason , setSelectedReason] = useState<any>([]);
  const [amountOutstanding, setAmountOutstanding] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState(0);

  const reasonsService = new ReasonsTypeService()
  const branchService = new BranchesService();
  const empLoanSalaryService = new EmpLoanSalarySharedService();
  const service = new EmployeeOnboardingService()

  useEffect(() => {
    getAllEmpData();
    getAllReasonsTypes();
    getAllBranches();
  }, []);

  useEffect(() => {
    if (props.empLoanSalaryData && props.isUpdate) {
      form.setFieldsValue({
        ...props.empLoanSalaryData,
        dateOfJoining: props.empLoanSalaryData.dateOfJoining ? dayjs(props.empLoanSalaryData.dateOfJoining, 'YYYY-MM-DD') : "-",
        effectiveFrom: props.empLoanSalaryData.effectiveFrom ? dayjs(props.empLoanSalaryData.effectiveFrom, 'YYYY-MM-DD') : "-",
        dateOfApplying: props.empLoanSalaryData.dateOfApplying ? dayjs(props.empLoanSalaryData.dateOfApplying, 'YYYY-MM-DD') : "-",
      });
    }
  }, [props.empLoanSalaryData, props.isUpdate, form]);

  const getAllEmpData = () => {
    service.getAllEmpData().then(res => {
      if (res.status) {
        setEmployeeList(res.data);
      } else {
          setEmployeeList([]);
          AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      console.error("Error fetching employee list: ", err);
      setEmployeeList([]);
      AlertMessages.getErrorMessage(err.message);
    })
  }

  const getAllReasonsTypes = () => {
    reasonsService.getAllReasonsTypes().then(res => {
      console.log(res,'qqqqqqqqqqqqqqqqqq')
      if (res.status) {
        setPurposeOptions(res.data);
      } else {
          setPurposeOptions([]);
          AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      console.error("Error fetching employee list: ", err);
      setPurposeOptions([]);
      AlertMessages.getErrorMessage(err.message);
    })
  }

  const getAllBranches = () => {
    try {
      branchService.getAllBranches().then((res) => {
        if (res.status) {
          setBranches(res.data);
        } else {
          console.log("Failed to fetch branches");
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const createEmployeeLoanSalary = async (val: EmpLoanSalarySharedDto) => {
    console.log(val,"feeeeeeeeeeeeeeeeeeeeee")
    try {
      console.log(val,"")
      empLoanSalaryService.createEmployeeLoanSalary(val).then((res) => { 
        if (res.status) {
          message.success('Created successfully');
          props.closeForm()
          window.location.reload()
        } else {
          message.error(res.internalMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  const onReset = () => {
    form.resetFields(['employeeId','employeeCode', 'firstName', 'designation', 'dateOfJoining', 'type', 'advanceAmount', 'installments', 'effectiveFrom', 'purpose', 'reason', 'amountOutstanding', 'dateOfApplying', 'hodMail'])
  }

  const saveData = (val: any) => {
    console.log(val,'-===-=-=-=-=-=-')
    const formattedValue = {
      ...val,
      dateOfJoining: dayjs(props?.empLoanSalaryData?.dateOfJoining).format('YYYY-MM-DD'),
      effectiveFrom: dayjs(props?.empLoanSalaryData?.effectiveFrom).format('YYYY-MM-DD'),
      dateOfApplying: dayjs(props?.empLoanSalaryData?.dateOfApplying).startOf('day').format('YYYY-MM-DD'),
    }
    console.log(formattedValue,'0000000')
    if (props.isUpdate) {
      console.log('kkkkkkkkk')
      props.updateDetails({ ...formattedValue, id: props.empLoanSalaryData?.id });
    }
    else {
      const format ={ 
        ...val, 
        dateOfApplying: dayjs(val.dateOfApplying).format('YYYY-MM-DD'),
        dateOfJoining: dayjs(val.dateOfJoining).format('YYYY-MM-DD'),
        effectiveFrom: dayjs(val.effectiveFrom).format('YYYY-MM-DD'),
      }
      createEmployeeLoanSalary(format)
    }
  }

  const fetchOutstandingAmount = () => {
    const outstandingAmount = 0; 
    setAmountOutstanding(outstandingAmount);
  };

  useEffect(() => {
    if (selectedEmployee) {
      fetchOutstandingAmount();
    }
  }, [selectedEmployee]);

  const handleBranchChange = (branchId) => {
    const filteredEmployees = employeeList.filter(emp => emp.branchId === branchId);
    setFilteredEmployeeList(filteredEmployees);
  form.resetFields(['employeeId','employeeCode','firstName', 'designation', 'dateOfJoining', 'type', 'advanceAmount', 'installments', 'effectiveFrom', 'purpose', 'reason', 'amountOutstanding', 'dateOfApplying', 'hodMail'])
  };

  const handleReasonChange = (value: any) => {
    setSelectedReason(value);
  };

  const handleEmployeeChange = (value: any) => {
    const selectedEmployee = filteredEmployeeList.find(emp => emp.employeeCode === value);
    if (selectedEmployee) {
      form.setFieldsValue({
        employeeCode: selectedEmployee.employeeCode,
        employeeId: selectedEmployee.employeeId,
        firstName: selectedEmployee.firstName,
        designation: selectedEmployee.designation,
        dateOfJoining: selectedEmployee.dateOfJoining
          ? moment(selectedEmployee.dateOfJoining)
          : '-',
      });
    }
  };


  return (
    <PageContainer title='Salary Advance Form' breadcrumbRender={false}
    >
      <Form form={form} layout="vertical" onFinish={saveData} initialValues={props.empLoanSalaryData}>
        <Row gutter={24}>
        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
        <Form.Item label="Branch" name="branchId" rules={[{ required: true }]}>
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Branch"
                  dropdownMatchSelectWidth={false}
                  optionFilterProp="children"
                  onChange={handleBranchChange}
                >
                  {branches.map((rec: any) => (
                    <Option value={rec.id} key={rec.id}>
                      {rec.branchName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
        </Col>
        </Row>
        <Row gutter={24}>
          <Form.Item name="id" label="Id" hidden>
            <Input hidden />
          </Form.Item>

          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Employee Code"
              name="employeeCode"
              rules={[{ required: true }]}
            >
              <Select onChange={handleEmployeeChange} placeholder="Select Employee Code" >
                {filteredEmployeeList.map(emp => (
                  <Select.Option key={emp.employeeCode} value={emp.employeeCode}>
                    {emp.employeeCode}  - {emp.firstName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col hidden>
            <Form.Item label="Employee ID" name="employeeId">
              <Input value={form.getFieldValue('employeeId')} placeholder="Employee ID" style={{ fontWeight: "bolder" }} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Employee Name"
              name="firstName"
            >
              <Input value={form.getFieldValue('firstName')} placeholder="Employee Name" style={{fontWeight:"bolder"}} disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Designation"
              name="designation"
            >
              <Input value={form.getFieldValue('designation')} placeholder="Designation" disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Date of Joining"
              name="dateOfJoining">
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                {Object.values(LoanSalaryTypeEnum).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Advance Amount"
              name="advanceAmount"
              rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter Advance Amount" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Installments"
              name="installments"
              rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter Number of Installments" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Effective From"
              name="effectiveFrom"
              rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} picker= "month" format="MM-YYYY" 
                    disabledDate={(current) => {
                        return current && current < moment().startOf('month');
                    }}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Reason"
              name="purpose"
              rules={[{ required: true }]}>
              <Select placeholder="Select Purpose" onChange={handleReasonChange}>
                {purposeOptions.map((option) => (
                  <Select.Option key={option.id} value={option.reasonsType}>
                    {option.reasonsType}
                  </Select.Option>
                ))}
              </Select>            
            </Form.Item>
          </Col>
          {selectReason === 'Others' && (
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item label="Other Reason" name="reason" rules={[{ required: true }]}>
              <TextArea placeholder="Enter Other Reason" />
            </Form.Item>
          </Col>
        )}
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item
              label="Date of Applying"
              name="dateOfApplying" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"  
                disabledDate={(current) => current && current > dayjs().endOf('day')} 
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} xl={4}>
            <Form.Item label="CC Mail" name="hodMail" rules={[{ required: true }]}>
              <Input placeholder="Enter HOD Mail" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={2}>
            <Form.Item>
              <Button
                color="primary" variant="outlined"
                htmlType="submit"
                style={{ marginLeft: 20, marginTop: 23 }}
              >
                {props.isUpdate ? "Update" : "Submit"}
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
              >
                Reset
              </Button>
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </PageContainer>
  );
}
