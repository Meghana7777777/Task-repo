import { UndoOutlined } from '@ant-design/icons';
import { ShiftDto, TeamCalenderDto } from '@hrexpert/shared-models';

import { ShiftService, TeamCalenderService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, FormInstance, Input, message, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ShiftGroupEnum } from '@hrexpert/shared-models'
import dayjs from 'dayjs';


export interface TeamCalenderFormProps {
    teamCalenderData?: TeamCalenderDto | any;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    TeamCalenderForm?: FormInstance<any>;
    getAllTeamCal: () => void
}

const TeamCalenderForm = (props: TeamCalenderFormProps) => {
    const [form] = Form.useForm();
    const [shiftMasterData, setShiftMasterData] = useState<any>([]);
    const service = new TeamCalenderService()
    const masterShifts = new ShiftService();
    const [disable, setDisable] = useState<boolean>(false)
    const Option = Select
    // console.log(props.teamCalenderData,'props.teamCalenderData')
    useEffect(() => {
        getAllShifts();
        if (props?.teamCalenderData) {
            form.setFieldsValue({
                id: props.teamCalenderData.id,
                shiftCode: props.teamCalenderData.shiftCode,
                fromDate: dayjs(props.teamCalenderData.fromDate),
                toDate: dayjs(props.teamCalenderData.toDate),
                shift: props.teamCalenderData.shift
            });
        }
        console.log(props.teamCalenderData, 'props.teamCalenderData')
    }, [props.teamCalenderData, form]);
    
   
    let id = null;
    if (props.isUpdate) {
        id = props.teamCalenderData.id;
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
    const createTeamCalender = async (data: TeamCalenderDto) => {
        try {
            setDisable(true);
            const res = await service.createTeamCalender(data);
            setDisable(false);
            if (res.status) {
                message.success('Team Calendar created successfully');
                props.closeForm();
                props.getAllTeamCal();
                onReset();
            } else {
                message.error(res.internalMessage || 'Failed to create team calendar');
            }
        } catch (error) {
            setDisable(false);
            message.error(error.message || 'An error occurred');
        }
    };

    const updateTeamCalenderData = async (data: TeamCalenderDto) => {
        try {
            const res = await service.updateTeamCalender(data);
            if (res.status) {
                message.success('Team Calendar updated successfully');
                props.closeForm();
            } else {
                message.error(res.internalMessage || 'Failed to update team calendar');
            }
        } catch (error) {
            message.error(error.message || 'An error occurred');
        }
    };


    const saveData = (val: any) => {
        const formattedData = {
            ...val,
            // fromDate: val.fromDate ? dayjs(val.fromDate).format('YYYY-MM-DD') : null,
            // toDate: val.toDate ? dayjs(val.toDate).format('YYYY-MM-DD') : null
        };
        console.log(val)
        if (props.isUpdate) {
            updateTeamCalenderData({ ...formattedData, id: props.teamCalenderData?.id });
        }
        else {
            createTeamCalender({...formattedData, id: id})
        }
    }

    const onReset = () => {
        form.resetFields()
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 4 }
        },
    };
    return (
        <Card>
            <Form layout='vertical' scrollToFirstError form={form} onFinish={saveData} >
                <Row gutter={[24, 24]}>

                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="id" style={{ display: "none" }} >
                            <Input hidden />
                        </Form.Item>
                        <Form.Item
                            name="shiftCode"
                            label="Shift Group Code"
                            // initialValue={props.teamCalenderData ? props.teamCalenderData.shiftCode : undefined}
                            rules={[
                                {
                                    required: true,
                                    message: "Select valid Shift Code"
                                },
                            ]}>
                            <Select
                                placeholder="Select Shift Group Code"
                                // onChange={}
                                disabled={props.isUpdate ? true : false}
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {Object.values(ShiftGroupEnum).map((shiftCode) => (
                                    <Option key={shiftCode} value={shiftCode}>
                                        {shiftCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name="fromDate" label="From Date" >
                            <DatePicker
                                style={{ width: '100%' }}

                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name="toDate" label="To Date" >
                            <DatePicker
                                style={{ width: '100%' }}

                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="shift"
                            label="Shift "
                            //   initialValue={props.teamcalenderData ? props.teamcalenderData.shift : undefined}
                            rules={[
                                {
                                    required: true,
                                    message: "Select valid Shift"
                                },
                            ]}>
                            <Select
                                placeholder="Select Shift"
                                // onChange={}
                                allowClear
                                style={{ width: '100%' }}
                            >
                                {shiftMasterData.map(dropData => {
                                    return <Option key={dropData.id} value={dropData.shiftType}>{dropData.shiftType}</Option>;
                                })}</Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={2}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-submit-btn"
                                style={{ marginLeft: 20, marginTop: 23 }}
                                disabled={disable}
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
                                disabled={disable}
                            >
                                Reset
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Card>
    )
}

export default TeamCalenderForm;
