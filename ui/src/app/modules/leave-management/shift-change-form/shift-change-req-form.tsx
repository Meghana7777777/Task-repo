import { UndoOutlined } from '@ant-design/icons';
import { ShiftChangeRequest } from '@hrexpert/shared-models';

import { EmployeeOnboardingService, ShiftChangeService, ShiftService, TeamCalenderService } from '@hrexpert/shared-services';
import { Button, Card, Col, DatePicker, Form, FormInstance, Input, message, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ShiftGroupEnum } from '@hrexpert/shared-models'
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';


export interface TeamCalenderFormProps {
}

const ShiftChangeReq = (props: TeamCalenderFormProps) => {
    const [form] = Form.useForm();
    const [shiftMasterData, setShiftMasterData] = useState<any>([]);
    const [empData, setEmpData] = useState<any[]>([])
    const service = new ShiftChangeService();
    const masterShifts = new ShiftService();
    const emService = new EmployeeOnboardingService();
    const [disable, setDisable] = useState<boolean>(false);
    const [filteredFromShift, setFilteredFromShift] = useState(shiftMasterData);
    const [filteredToShift, setFilteredToShift] = useState(shiftMasterData);
    const Option = Select
    useEffect(() => {
        getAllShifts();
        getActiveEmployeeList();

    }, []);



    const getActiveEmployeeList = () => {
        emService.getActiveEmployeeList().then(res => {
            if (res.status) {
                setEmpData(res.data)
            } else {
                setEmpData([])
            }
        })
    }

    const getAllShifts = () => {
        try {
            masterShifts.getAllShifts().then((res) => {
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
    const createTeamCalender = async (data: ShiftChangeRequest) => {
        console.log(data, 'data')
        try {
            setDisable(true);
            const res = await service.createShiftChangeRequest(data);
            setDisable(false);
            if (res.status) {
                message.success('Team Calendar created successfully');

                onReset();
            } else {
                message.error(res.internalMessage || 'Failed to create team calendar');
            }
        } catch (error) {
            setDisable(false);
            message.error(error.message || 'An error occurred');
        }
    };


    const saveData = (val: any) => {
        const formattedData = {
            ...val,
            fromDate: val.fromDate ? dayjs(val.fromDate).format('YYYY-MM-DD') : null,
            toDate: val.toDate ? dayjs(val.toDate).format('YYYY-MM-DD') : null
        };
        console.log(val)
        createTeamCalender({ ...formattedData })
    }

    const onValuesChange = (changedValues, allValues) => {
        const { fromShift, toShift } = allValues;

        // Update the filtered options based on current selections
        if (fromShift) {
            setFilteredToShift(
                shiftMasterData.filter(shift => shift.id !== fromShift)
            );
        } else {
            setFilteredToShift(shiftMasterData);
        }

        if (toShift) {
            setFilteredFromShift(
                shiftMasterData.filter(shift => shift.id !== toShift)
            );
        } else {
            setFilteredFromShift(shiftMasterData);
        }
    };

    useEffect(() => {
        // Initialize both dropdowns with all options
        setFilteredFromShift(shiftMasterData);
        setFilteredToShift(shiftMasterData);
    }, [shiftMasterData]);

    const onReset = () => {
        form.resetFields()
        setFilteredFromShift(shiftMasterData);
        setFilteredToShift(shiftMasterData);
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
            <Form layout='vertical' scrollToFirstError form={form} onFinish={saveData} onValuesChange={onValuesChange} >
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name={'employeeId'} label={'Employee'}>
                            <Select showSearch allowClear>
                                {empData.map((emp) => {
                                    return <Option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}-{emp.employeeCode}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="id" style={{ display: "none" }} >
                            <Input hidden />
                        </Form.Item>

                        <Form.Item
                            name="shiftCode"
                            label="Shift Group Code"
                            rules={[
                                {
                                    required: true,
                                    message: "Select valid Shift Code"
                                },
                            ]}>
                            <Select
                                placeholder="Select Shift Group Code"
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
                        <Form.Item name="fromDate" label="From Date">
                            <DatePicker
                                style={{ width: '100%' }}
                                format={'YYYY-MM-DD'}
                                disabledDate={(current) => {
                                    // Disable past dates
                                    return current && current < moment().startOf('day');
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name="toDate" label="To Date">
                            <DatePicker
                                style={{ width: '100%' }}
                                format={'YYYY-MM-DD'}
                                disabledDate={(current) => {
                                    // Disable past dates
                                    return current && current < moment().startOf('day');
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="fromShift"
                            label="From Shift"
                            rules={[
                                {
                                    required: true,
                                    message: "Select valid Shift",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select Shift"
                                allowClear
                                style={{ width: "100%" }}
                                options={filteredFromShift.map(shift => ({
                                    label: shift.shiftType,
                                    value: shift.id,
                                }))}
                            />
                        </Form.Item>
                    </Col><Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            name="toShift"
                            label="To Shift"
                            rules={[
                                {
                                    required: true,
                                    message: "Select valid Shift",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select Shift"
                                allowClear
                                style={{ width: "100%" }}
                                options={filteredToShift.map(shift => ({
                                    label: shift.shiftType,
                                    value: shift.id,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item name="reason"
                            label="Reason"
                            rules={[
                                {
                                    required: true,
                                    message: " Reason is required", max: 25
                                },
                                {
                                    pattern: /^[^-\s\\0-9\[\]()*!@#$^&_\-+/%=`~{}:";'<>,.?|][a-zA-Z. ]*$/,
                                    message: `Should contain only alphabets.`
                                }
                            ]}
                        >
                            <TextArea />
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
    )
}

export default ShiftChangeReq;
