import { AlertMessages, ApplyForLeaveDto, ApplyLeaveBrachDto, AttendanceAdjustRequest, AttnAdjustLogReq, ShiftDto } from '@hrexpert/shared-models';
import { ApplForLeavesSharedService, AttendanceServices, ShiftService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';
import { UploadOutlined } from '@ant-design/icons';

export interface AttendanceAdjustmentProps {
  applyForLeavesData: ApplyForLeaveDto;
  updateDetails: (hrms: ApplyForLeaveDto) => void;
  isUpdate: boolean;
  closeForm: () => void;
}
const { Option } = Select;
const AttendanceAdjustment = (props: AttendanceAdjustmentProps) => {
  const service = new ApplForLeavesSharedService()
  const attnService = new AttendanceServices()
  const masterShifts = new ShiftService();
  const [shiftMasterData, setShiftMasterData] = useState<any>([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [presentStatusHidden, setPresentStatusHidden] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [emplo, setEmplo] = useState<any>([])
  const [reasonVisible, setReasonVisible] = useState(false);
  const [form] = Form.useForm();
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const role = IAMClientAuthContext.user.roles;
  const [fileList, setFileList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  useEffect(() => {
    getActiveEmployeesById()
    getAllShifts();

  }, [])


  const getActiveEmployeesById = () => {

    try {
      const req = new ApplyLeaveBrachDto
      const formValues = form.getFieldsValue();
      if (IAMClientAuthContext.user?.roles === "SuperAdmin") {
        req.branchId = null;
      } else {
        req.branchId = IAMClientAuthContext.user?.unitId || null;
      }
      service.getActiveEmployeesByIds(req).then((res) => {

        if (res.status) {
          setEmployeeData(res.data.data)
        }

      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    form.setFieldsValue({ presentStatus: value })
  };

  // Function to handle selection by employee name
  const handleSelectEmployeeName = (value) => {
    const data = employeeData && employeeData.find(item => item.id === value);
    console.log(data)
    form.setFieldsValue({
      employeeCode: data ? data.employeeCode : "-",
      employeeId: data ? data.id : "-",
      employeeName: data ? data.employeeName : "-",
      branchId: data ? data.branchId : "-"
    });
    getAdjustmentData();
  };

  // Function to handle selection by employee code
  const handleSelectEmployeeCode = (value, value2) => {
    const data = employeeData && employeeData.find(item => item.id === value);
    form.setFieldsValue({
      employeeCode: data ? data.id
        : "-",
      employeeName: data ? data.employeeName : "-"
    });
    getAdjustmentData();
    setEmplo(value2)
  }

  let createdUser = "";
  if (!props.isUpdate) {
    createdUser = localStorage.getItem("createdUser");
  }

  const getAllShifts = () => {
    const req = new ShiftDto()
    const formValues = form.getFieldsValue();
    if (formValues.branchId) {
      req.branchId = formValues.branchId
    }
    try {
      masterShifts.getAllShifts(req).then((res) => {
        if (res.status) {
          setShiftMasterData(res.data)
        }
        else {
          message.error("Failed to retrieve Shift");
        }
      })
    } catch (error) {
      console.log(error);

    }

  };

  const handleDateChange = (value) => {
    if (value) {
      const formattedDate = value.format('YYYY-MM-DD HH:mm:ss');
      console.log("Selected Date & Time:", formattedDate);
    }
  };

  const handleAttenDateChange = (date) => {
    setSelectedDate(date);
  };

  const disabledInDate = (current) => {
    return (
      current &&
      !(
        current.isSame(selectedDate, "day") 
      )
    );
  };

  const disabledOutDate = (current) => {
    return (
      current &&
      !(
        current.isSame(selectedDate, "day") ||
        current.isSame(selectedDate.add(1, "day"), "day")
      )
    );
  };


  const disabledDate = (current) => {

    return current && current > dayjs().endOf('day');
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const getAdjustmentData = () => {
    const empCode = form.getFieldValue('employeeCode');
    const currDate = new Date();
    const date = dayjs(form.getFieldValue('date')).format('YYYY-MM-DD') || dayjs(currDate).format('YYYY-MM-DD');
    const request = new AttendanceAdjustRequest(empCode, date);
    attnService.getAllAdjustments(request)
      .then(res => {
        if (res.status) {
          setSelectedStatus(res.data.attnStatus);

          if (res.data.freezeStatus === 'Y') {
            AlertMessages.getErrorMessage('Attendance adjustment is freezeStatus and cannot be updated.');

            return; // Stop further processing
          }
          setReasonVisible(!(res.data.attnStatus === 'P' || res.data.attnStatus === 'H'));

          //res.data.inTime = dayjs(res.data.inTime)
          form.setFieldsValue({
            inTime: res.data.inTime ? dayjs(res.data.inTime) : '',
            outTime: res.data.outTime ? dayjs(res.data.outTime) : '',
            presentStatus: res.data.attnStatus,
            shift: Number(res.data.shiftType),
            otHours: res.data.otHours,
            spclOThrs: res.data.spclOThrs,
            wkHrs: res.data.wkHrs,
            team: res.data.team,
            freezeStatus: res.data.freezeStatus,
            attendaceId: res.data.id,
            // employeeId: res.data.empId,
            reason: reasonVisible ? form.getFieldValue('reason') : undefined,
          });
          validateFutureDate();
          setDatePicker();
        } else {
          // Show error message if no data found
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch(err => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const validateFutureDate = () => {
    const selectedDate = dayjs(form.getFieldValue('date')).format('YYYY-MM-DD');
    if (dayjs(selectedDate).isAfter(dayjs(), 'day')) {
      setPresentStatusHidden(true);
    } else {
      setPresentStatusHidden(false);
    }
  }


  const setDatePicker = () => {
    dayjs(form.getFieldValue('date')).format('YYYY-MM-DD')
  }
  const saveData = (req: AttnAdjustLogReq) => {
    const formData = new FormData();
    formData.append('date', dayjs(form.getFieldValue('date')).format('YYYY-MM-DD'));
    formData.append('empId', form.getFieldValue('employeeId'));
    formData.append('employeeCode', form.getFieldValue('employeeCode'));
    formData.append('branchId', form.getFieldValue('branchId'));
    if (req.inTime) formData.append('inTime', dayjs(req.inTime).format('YYYY-MM-DD HH:mm:ss'));
    if (req.outTime) formData.append('outTime', dayjs(req.outTime).format('YYYY-MM-DD HH:mm:ss'));
    if (req.presentStatus) formData.append('presentStatus', req.presentStatus);
    if (req.reason) formData.append('reason', req.reason);
    if (req.remarks) formData.append('remarks', req.remarks);
    if (req.shift) formData.append('shift', req.shift);
    // if (req.branchId !== undefined) formData.append('branchId', req.branchId.toString());
    if (fileList.length > 0) {
      fileList.forEach(file => {
        formData.append('files', file); // Ensure 'files' matches backend field
      });
    }
    attnService.attendanceAdjustment(formData).then(res => {
      if (res.status) {
        onReset();
        AlertMessages.getSuccessMessage('Attendance Adjustment Applied Successfully');
      } else {
        AlertMessages.getErrorMessage(res.internalMessage || "Error");
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message);
    })
  };

  const onReset = () => {
    form.resetFields();
  }

  const uploadProps = {
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      if (!file.name.match(/\.(jpg|png|jpeg|JPG|JPEG|PNG|pdf|PDF)$/)) {
        message.error("Only jpg, png, jpeg, and pdf files are allowed.");
        return false;
      }
      setFileList([file])
      return false
    },
    onRemove: (file) => {
      setFileList([])
    },
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Card title={<span >Attendance Adjustment</span>}
      style={{ textAlign: 'center' }}
    >

      <Form
        form={form}
        name="control-hooks"
        layout="vertical"
        onFinish={saveData}
      >
        <Form.Item style={{ display: "none" }} name="createdUser" initialValue={createdUser}>
          <Input hidden />
        </Form.Item>



        <Row gutter={[16, 16]}>
          <Form.Item name={'attendaceId'} style={{ display: "none" }}><Input hidden /></Form.Item>
          <Form.Item name={'employeeId'} style={{ display: "none" }}><Input hidden /></Form.Item>
          <Form.Item name={'branchId'} style={{ display: "none" }}><Input hidden /></Form.Item>
          <Form.Item
            name="employeeCode"
            label="Employee Code"
            hidden
            rules={[{ required: true, message: "Employee Code is Required" }]}
          >
            <Select
              showSearch
              disabled={props.isUpdate ? true : false}
              allowClear
              placeholder="Select Employee Code"
              optionFilterProp="children"

              onChange={handleSelectEmployeeCode}

            >
              {employeeData.map((employee) => (
                <Option key={employee.id} value={employee.employeeCode}>
                  {employee.employeeCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="employeeName"
              label="Employee Name"
              rules={[{ required: true, message: "Employee Name is Required" }]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select Employee Name"
                optionFilterProp="children"
                onChange={handleSelectEmployeeName}
              >
                {employeeData.map((employee) => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.employeeCode} - {employee.employeeName}

                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            name="employeeCode"
            label="Employee Code"
            rules={[{ required: true, message: "Employee Code is Required" }]}
          >
            <Select
              showSearch
              disabled={props.isUpdate ? true : false}
              allowClear
              placeholder="Select Employee Code"
              optionFilterProp="children"
              onChange={handleSelectEmployeeCode}
            >
              {employeeData.map((employee) => (
                <Option key={employee.id} value={employee.id}>
                  {employee.employeeCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col> */}

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="date" label="Date" initialValue={dayjs()} >
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                showToday={true}
                onChange={(d) => {
                  handleAttenDateChange(d)
                  getAdjustmentData()
                  validateFutureDate(); setDatePicker();
                }}
              // disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="shift"
              label="Shift"
              rules={[{ required: true, message: "Shift is required" }]}
              initialValue="G shift"
            >
              <Select
                showSearch
                placeholder="Select Shift"
                optionFilterProp="children"
              >
                {shiftMasterData.map(dropData => (
                  <Option key={dropData.id} value={dropData.id}>
                    {dropData.shiftType}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="presentStatus"
              label="Attendance Status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select
                showSearch
                placeholder="Select Status"
                onChange={handleStatusChange}
                optionFilterProp="children"
                dropdownMatchSelectWidth={false}
              >
                <Option value='P' key='P'
                // hidden={presentStatusHidden}
                >Present</Option>
                <Option value='A' key='A'>Absent</Option>
                <Option value='OD' key='OD' >Out Door</Option>
                {/* <Option value='H' key='H'>Holiday</Option> */}
                {/* <Option value='L' key='L'>Leave</Option> */}
                <Option value='HD' key='HD'>Half Day</Option>
              </Select>
            </Form.Item>
          </Col>
          {selectedStatus !== 'A' && selectedStatus !== 'H' && selectedStatus !== 'L' && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}
              // style={{display:(selectedStatus == 'A' || selectedStatus == 'H' || selectedStatus == 'L')?'none':'block'}}
              >
                <Form.Item
                  name="inTime"
                  label="In Time"
                  rules={[{ required: true, message: "In Time is required" }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: '100%' }}
                    onChange={handleDateChange}
                    disabledDate={disabledInDate}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}
              //  style={{display:(selectedStatus == 'A' || selectedStatus == 'H' || selectedStatus == 'L')?'none':'block'}}
              >
                <Form.Item
                  name="outTime"
                  label="Out Time"
                  rules={[{ required: true, message: "Out Time is required" }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: '100%' }}
                    onChange={handleDateChange}
                    disabledDate={disabledOutDate}
                  />
                </Form.Item>
              </Col>
            </>)}

          {reasonVisible && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="reason"
                label="Reason"
                rules={[
                  { required: true, message: "Reason is required" },
                  { pattern: /^[a-zA-Z. ]*$/, message: "Should contain only alphabets." }
                ]}
              >
                <Select showSearch placeholder="Select Reason">
                  <Option value="Permission">Permission</Option>
                  <Option value="Not Registered">Not Registered</Option>
                  <Option value="OD">Out Door</Option>
                  <Option value="Others">Others</Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="file"
              label="Document Upload"
            //rules={[{ required: !props.isUpdate, message: 'Upload is required' }]}
            >
              <Upload {...uploadProps} showUploadList={true}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item
              name="remarks"
              label="Remarks"
              rules={[
                { required: true, message: "Remarks are required" },
                { pattern: /^[a-zA-Z. ]*$/, message: "Should contain only alphabets." }
              ]}
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" style={{ margin: '0 14px' }} onClick={onReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )

}
export default AttendanceAdjustment