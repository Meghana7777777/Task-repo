
import { Button, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';

export class UserToAttributesModel {
    id: number;
    attribute: string;
    value: string;
    userId: number;
    constructor(id: number, attribute: string, value: string, userId: number) {
        this.id = id;
        this.attribute = attribute;
        this.value = value;
        this.userId = userId;
    }
}


interface IUserToAttributesFormProps {
    submitHandler: (req: UserToAttributesModel) => void
}

export const  UserToAttributesForm = (props: IUserToAttributesFormProps) => {
    const [formRef] = Form.useForm();
    const { submitHandler } = props;
    const { t } = useTranslation();



    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new UserToAttributesModel(values.id, values.name, values.description, values.unitId);
            submitHandler(req);
        }).catch(err => {
            console.log(err.message, 'error msg')
        })

    }


    return (
        <div>
            <Form layout='vertical' form={formRef}>
                <Row>
                    <Form.Item style={{ display: 'none' }} name='id'>
                        <Input placeholder="id" type='hidden' />
                    </Form.Item>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }} xxl={{ span: 10, offset: 0 }}>
                        <Form.Item name='attribute' label={t('userToAttribute.form.attribute', { defaultValue: 'Attribute' })}
                            rules={[
                                { required: true, message: t('userToAttributes.form.rules.attributeRequired', { defaultValue: 'Please fill the attribute' }) },
                                { pattern: new RegExp(/^[A-Za-z]*$/), message: t('userToAttributes.form.rules.attributePattern', { defaultValue: 'Attribute should contain letters only' }) },
                            ]}>
                            <Input placeholder={t('userToAttribute.form.attribute', { defaultValue: 'Attribute' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }} xl={{ span: 10, offset: 1 }} xxl={{ span: 10, offset: 1 }}>
                        <Form.Item name='value' label={t('userToAttribute.form.value', { defaultValue: 'Value' })}
                            rules={[
                                { required: true, message: t('userToAttributes.form.rules.valueRequired', { defaultValue: 'Value is required' }) },
                            ]}>
                            <Input placeholder={t('userToAttribute.form.value', { defaultValue: 'Value' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }} xl={{ span: 10, offset: 1 }} xxl={{ span: 10, offset: 1 }}>
                        <Form.Item name='userId' label={t('userToAttribute.form.userId', { defaultValue: 'User ID' })}
                            rules={[
                                { required: true, message: t('userToAttributes.form.rules.userIdRequired', { defaultValue: 'Userid is required' }) },
                            ]}>
                            <Input placeholder={t('userToAttribute.form.userId', { defaultValue: 'User ID' })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='end'>
                    <Col>
                        <Button onClick={onSubmit}>{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}