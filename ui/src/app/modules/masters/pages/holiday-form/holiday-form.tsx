import { UndoOutlined } from "@ant-design/icons";
import { BranchesService, HolidayCalanderService } from '@hrexpert/shared-services';
import { Button, Card, Col, Form, Input, Row, DatePicker, message, Select, FormInstance } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { HolidayDto, HolidayType, HolidayTypeDisplay, TypeEnum } from "@hrexpert/shared-models";
import { useIAMClientState } from "../../../../common/iam-client-react";

export interface HolidayFormProps {
    holidayData?: HolidayDto ;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    HolidayForm?: FormInstance<any>;
    getAllHolidays: () => void;
    form : any
}

const HolidayForm = (props: HolidayFormProps) => {
    const Option = Select;
    const [form] = Form.useForm();
    const [disable, setDisable] = useState<boolean>(false);
    const [branches, setBranches] = useState<any>([]);
    const holidayService = new HolidayCalanderService();
    const branchService = new BranchesService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const Branch = IAMClientAuthContext.user.unitId;
    const holidayTypes = Object.entries(HolidayTypeDisplay).map(([value, label]) => ({
        value,
        label,
    }));

    useEffect(() => {
        getAllBranches();
    }, []); 

    const onReset = () => {
        form.resetFields();
    };

    const createHoliday = async (val: HolidayDto) => {
        try {
            setDisable(true);
            const response = await holidayService.createHoliday(val);
            if (response.status) {
                message.success('Holiday created successfully');
                props.closeForm();
                props.getAllHolidays();
                setDisable(false);
            } else {
                message.error(response.internalMessage);
            }
        } catch (error) {
            console.error(error);
        }
    };

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

    const saveData = (val: any) => {
        const formattedVal = {
            ...val,
            holidayDate: val.holidayDate ? dayjs(val.holidayDate).format('YYYY-MM-DD') : null,
          };
          if (props.isUpdate) {
            props.updateDetails({ ...formattedVal, id: props.holidayData.id });
          } else {
            createHoliday(formattedVal);
          }
    };

    return (
        <Card>
            <Form
                layout="vertical"
                form={form}
                onFinish={saveData}
                initialValues={props.holidayData || {}}
            >
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item label="Branch" name="branchId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a branch', // Custom error message
                                },
                            ]}>
                            <Select showSearch
                                allowClear
                                placeholder="Select Branch"
                                dropdownMatchSelectWidth={false}
                                disabled={role === 'SuperAdmin' ? false : true}
                                optionFilterProp="children">
                                {branches?.map((rec: any) => (
                                    <Option value={rec.id} key={rec.id}>
                                        {rec.branchName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: "Please select a holiday type" }]}>
                            <Select 
                            showSearch
                            allowClear
                            placeholder="Select Holiday Type"
                            dropdownMatchSelectWidth={false}
                            disabled={role === 'SuperAdmin' ? false : true}
                            optionFilterProp="children">
                                {holidayTypes.map((type) => (
                                    <Select.Option key={type.value} value={type.value}>
                                        {type.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                        <Form.Item
                            name="holidayName"
                            label="Name"
                            rules={[{ required: true, message: "Please enter holiday name" }]}>
                            <Input placeholder="Enter Holiday Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Form.Item
                            name="holidayDate"
                            label="Date"
                            rules={[{ required: true, message: "Please select holiday date" }]}>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={disable}
                            >
                                {props.isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button
                                type="default"
                                danger
                                icon={<UndoOutlined />}
                                onClick={onReset}
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

export default HolidayForm;
