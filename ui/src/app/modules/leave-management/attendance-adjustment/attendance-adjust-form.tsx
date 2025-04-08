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
    Data: any;
    updateDetails: (hrms: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
}
const { Option } = Select;
const AttendanceAdjusTForm = (props: AttendanceAdjustmentProps) => {
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
        getAllShifts();

    }, [])

    useEffect(() => {
        if (props.isUpdate) {
            form.setFieldsValue({
                employeeId: props?.Data?.employeeId,
                employeeCode: props?.Data?.empCode,
                employeeName: props?.Data?.empName,
                date: props?.Data?.attendanceDate ? dayjs(props?.Data?.attendanceDate) : null,
                //shift: props?.Data?.shift,
                presentStatus: props?.Data?.attnStatus,
                inTime: props?.Data?.inTime ? dayjs(props?.Data?.inTime) : null,
                outTime: props?.Data?.outTime ? dayjs(props?.Data?.outTime) : null,
                reason: props?.Data?.reason,
                remarks: props?.Data?.remarks,
                branchId: props?.Data?.branchesId
            })
            setSelectedDate(dayjs(props?.Data?.attendanceDate))
        }
        setSelectedStatus(props?.Data?.attnStatus)
        console.log(props?.Data, '0-------------dddddddddd----------')
    }, [props])




    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        form.setFieldsValue({ presentStatus: value })
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
                    form.setFieldsValue({
                        shift: props?.Data?.shift ? res.data.find((res) => res.shiftType === props?.Data?.shift).id : res.data.find((res) => res.shiftType === 'G').id
                    })
                }
                else {
                    message.error("Failed to retrieve Shift");
                }
            })
        } catch (error) {
            console.log(error);

        }

    };


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
                form.resetFields();
                setFileList([])
                onReset();
                form.setFieldsValue({
                    shift: props?.Data?.shift ? shiftMasterData.find((res) => res.shiftType === props?.Data?.shift).id : shiftMasterData.find((res) => res.shiftType === 'G').id
                })
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
        props.closeForm()
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
            //initialValues={props.Data}
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
                                disabled
                                showSearch
                                allowClear
                                placeholder="Select Employee Name"
                                optionFilterProp="children"
                            >
                                {employeeData.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.employeeCode} - {employee.employeeName}

                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="date" label="Date"  >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                                showToday={true}
                                disabled
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
                                <Option value='P/2' key='P/2'>Half Day</Option>
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
                            {props.isUpdate? 'Update': 'Submit'}
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
export default AttendanceAdjusTForm