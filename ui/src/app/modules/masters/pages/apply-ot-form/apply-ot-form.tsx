import { UndoOutlined } from "@ant-design/icons";
import { EmployeeTypeService, OverTimeService } from "@hrexpert/shared-services";
import { Button, Card, Col, DatePicker, Form, FormInstance, Input, message, Row, Select } from "antd";
import { ApplyForOTDto } from "libs/shared-models/src/lib/masters/apply-ot/apply-ot-dto";
import { useEffect, useState } from "react";
import { Moment }  from "moment";
import moment from "moment";
import { AlertMessages } from "@hrexpert/shared-models";
import dayjs from 'dayjs';

export interface OverTimeFormProps {
    OverTimeData: ApplyForOTDto;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    overTimeForm?: FormInstance<any>;
    getAllOt: () => void
    
    

}

export default function OverTimeForm(props: OverTimeFormProps) {
    const [form] = Form.useForm();
    const service = new OverTimeService()
    const getService = new EmployeeTypeService()
    const [inTime, setInTime] = useState<Moment | null>(moment());
    const [outTime, setOutTime] = useState<Moment | null>(moment());
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [selectedInTime, setSelectedInTime] = useState(null);


    // useEffect(()=>{
    //     if(props.OverTimeData != undefined){
    //         console.log(props.OverTimeData,'ffffffff`')

    //     }
    // },[props.OverTimeData])

    useEffect(() => {
        if (props?.OverTimeData) {
            form.setFieldsValue({employeeName : props.OverTimeData.employeeName,
                date:dayjs(props.OverTimeData.date),
                inTime:dayjs(props.OverTimeData.inTime),
                outTime:dayjs(props.OverTimeData.outTime),
                workingHours : props.OverTimeData.workingHours
            });
        }
    }, [props.OverTimeData, form]);

    const createOt = (req: ApplyForOTDto) => {
        try {
            service.createOt(req).then((res) => {
                if (res.status) {
                    message.success(res.internalMessage)
                    props.getAllOt()
                    props.closeForm()
                }
                else {
                    message.error(res.internalMessage)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllEmployeeTypes();
      }, []);

    const getAllEmployeeTypes = () => {
        getService.getAllEmployeeTypes().then(res => {
          if (res.status) {
            setEmployeeList(res.data);
          } else {
            if (res.internalMessage) {
              setEmployeeList([]);
              AlertMessages.getErrorMessage(res.internalMessage);
            } else {
              AlertMessages.getErrorMessage(res.internalMessage);
            }
          }
        }).catch(err => {
          setEmployeeList([]);
          AlertMessages.getErrorMessage(err.message);
        })
      }

      const handleInTimeChange = (value: Moment | null) => {
        setInTime(value);
        setSelectedInTime(value)
        calculateWorkingHours(value, outTime);
    };
    
    const handleOutTimeChange = (value: Moment | null) => {
        setOutTime(value);
        calculateWorkingHours(inTime, value);
    };
    
    const calculateWorkingHours = (startTime: Moment | null, endTime: Moment | null) => {
        if (startTime && endTime) {
            const diff = moment.duration(endTime.diff(startTime));
            const hours = Math.floor(diff.asHours());
            const minutes = diff.minutes();
            const formattedTime = `${hours}: ${minutes}`;
            form.setFieldsValue({
                workingHours: formattedTime,
            });
        }
    };
    
    
    const saveData = (val: any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.OverTimeData?.id });
        }
        else {
            createOt(val)
        }
    }

    const handleEmployeeChange = (value: string) => {
        const selectedEmployee = employeeList.find(emp => emp.employeeName === value);
        if (selectedEmployee) {
          form.setFieldsValue({
            employeeCode: selectedEmployee.employeeCode,
          });
          form.setFieldsValue({
            id: selectedEmployee.id,
          });
        }
      };



    const onReset = () => {
        form.resetFields()
    }

    const formItemLayout = {
        labelCol: { xs: { span: 24 },sm: { span: 4 },lg: { span: 4 }},
        wrapperCol: {xs: { span: 24 },sm: { span: 4 },lg: { span: 4 }},
    };

    const disabledFutureDates = (current) => {
        return current && current > dayjs().endOf('day');
      };
    return (
        <Card>
            <Form layout='vertical' scrollToFirstError form={form} onFinish={saveData} >
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label='Employee Name' name='employeeName'
                        >
                            <Select onChange={handleEmployeeChange} placeholder="Select Employee Name">
                                {employeeList.map(emp => (
                                <Select.Option key={emp.empType_id} value={emp.empType_name}>
                                {emp.empType_name}
                                </Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                                label="Date"
                                name="date"
                                rules={[{ required: true, message: 'Please select a start date' }]}>
                            <DatePicker style={{ width: '100%' }} format= "YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name="inTime" label="In Time" rules={[
                            {
                                required: true,
                                message: " In Time are required",
                            },]}>
                            <DatePicker
                                showTime={{ format: "HH:mm:ss" }}
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                showToday={true}
                                onChange={handleInTimeChange} 
                                disabledDate={disabledFutureDates}/>
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Form.Item name="outTime" label="Out Time" rules={[
                                    {
                                        required: true,
                                        message: " Out Time are required",
                                    },]} >
                                <DatePicker 
                                    showTime={{ format: "HH:mm:ss" }} 
                                    style={{ width: '100%' }} 
                                    format="YYYY-MM-DD HH:mm:ss"
                                    //disabledDate={disabledFutureDate}
                                    showToday={true}
                                    onChange={handleOutTimeChange} 
                                    disabledDate={disabledFutureDates}
                                    />
                                    
                            </Form.Item>
                    </Col>
                    </Row>
                    <Row gutter={[24, 24]}>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="No Of Hours(HH:MM)" name="workingHours">
                            <Input placeholder="No. of Hours" readOnly/>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row gutter={[24, 24]}justify="center">
                    <Col xs={24} sm={12} md={8} lg={6} xl={2} style={{ marginLeft: 20, marginTop: 23 }}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                
                            >
                                {props.isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}  style={{ marginLeft: 20, marginTop: 23 }}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
                               
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col></Row>
            </Form>
        </Card>
    )
}
