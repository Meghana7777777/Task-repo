import { Card, Col, Form, Input, Row } from 'antd'
import form from 'antd/es/form'


export interface OrdersFormProps {
    edit?: boolean;
    data?: any;
    update?: (route: any) => void;
    isUpdate?: boolean;
    closeForm?: () => void;
}

const DesginationsForm : React.FC<OrdersFormProps> = (props)  => {
    const [form] = Form.useForm();

    return (
        <Card title="Desgiantions Form">
            <Form layout="vertical" form={form} initialValues={props.data}>
                <Row gutter={[24, 4]}>
                    <Form.Item name={'id'} hidden></Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                        <Form.Item label="Designation" name="designation" rules={[{ required: true, message: 'Please enter Designation' }]}>
                            <Input placeholder="Enter Designation" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card >
    )
}
export default DesginationsForm