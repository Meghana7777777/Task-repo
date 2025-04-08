import { UndoOutlined } from "@ant-design/icons";
import { BranchesService, TypesOfLeavesService, WeekOffLeavesService } from '@hrexpert/shared-services';
import { BranchesDto, TypeOfLeavesDto, WeekOffLeavesUpDateDto, WeeksEnum } from '@hrexpert/shared-models';
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
    leavesData: TypeOfLeavesDto;
    updateDetails: (style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    WeekOffLeavesModel?: FormInstance<any>;
    getAllWeekOffLeaves: () => void
}

const WeekOffLeavesModel = (props: Props) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate();
    const service = new WeekOffLeavesService();

    useEffect(() => {
        if (props.leavesData) {
            form.setFieldsValue(props.leavesData);
        }
    }, [props.leavesData, form]);

    const onReset = () => {
        form.resetFields();
    };

   

    const saveData = (val:any) => {
        if (props.isUpdate) {
            props.updateDetails({ ...val, id: props.leavesData?.id });
        }
       
    }



    return (
        <Card>
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.leavesData}>
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="weekName"
                            label="Week Name"
                            rules={[
                                { required: true, message: "Please Enter WeekName" },

                            ]}
                        >
                            <Select placeholder="Select Week Type">
                                {(Object.keys(WeeksEnum) as Array<keyof typeof WeeksEnum>).map(week => (
                                    <Option value={WeeksEnum[week]} key={WeeksEnum[week]}>
                                        {WeeksEnum[week]}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Employee Code"
                            name="employeeCode"
                           
                        >
                             <Input disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            label="Employee Name"
                            name="employeeName"
                           
                        >
                             <Input disabled/>
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
                                Update
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

export default WeekOffLeavesModel;
