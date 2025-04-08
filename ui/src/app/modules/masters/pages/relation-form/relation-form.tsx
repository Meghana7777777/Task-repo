import { ExportOutlined, PlusOutlined, UndoOutlined, } from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import { RelationsService, ShiftService } from "@hrexpert/shared-services";
import { RelationsDto, ShiftDto } from "@hrexpert/shared-models";
import { Button, Card, Col, ColorPicker, Form, Input, Row, Select, Space, TimePicker, message } from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';


export interface Props {
    relationsData: any;
    updateDetails: (Style: any) => void;
    isUpdate: boolean;
    closeForm: () => void;
    relationForm?: FormInstance<any>;
    getAllRelations: () => void
}
const RelationForm = (props: Props) => {

    const [form] = Form.useForm();
    const service = new RelationsService();
    const { Option } = Select;
    const [disable, setDisable] = useState<boolean>(false)
    let navigate = useNavigate();

   


    const onReset = () => {
        form.resetFields();

    };
    

    const createRelations = async (val: RelationsDto) => {
        try {
            service.createRelations(val).then((res) => {
                if (res.status) {
                    message.success('Created successfully');
                    props.closeForm()
                    props.getAllRelations()
                } else {
                    message.error(res.internalMessage);
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setDisable(false);
        }
    };

    
    const saveData = (values: RelationsDto) => {
        setDisable(false)
        if (props.isUpdate) {
          console.log(values)
          props.updateDetails(values);
        } else {
          setDisable(false)
          console.log(values)
          createRelations(values);
        }
    
      };

    return (
        <Card
        >
            <Form layout="vertical" form={form} onFinish={saveData} initialValues={props.relationsData} >
                <Row gutter={8}>
                    <Form.Item name="id" label="Id" hidden     >
                        <Input hidden />
                    </Form.Item>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Form.Item
                            name="relation"
                            label="Relation Name"
                            rules={[
                                { required: true, message: "Please Enter Relations" },

                            ]}
                        >
                            <Input placeholder="Enter Relation" />
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
    );
}
export default RelationForm

