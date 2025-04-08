import { Button, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';
export class UserPFormModel {
    id: number;
    permissionId: number;

    userId: number;
    constructor(id: number, permissionId: number, userId: number) {
        this.id = id;
        this.permissionId = permissionId;

        this.userId = userId;
    }
}
interface IUserPFormProps {
    submitHandler: (req: UserPFormModel) => void
}

export const  UserPForm = (props: IUserPFormProps) => {
    const [formUp] = Form.useForm();
    const { submitHandler } = props;
    const { t } = useTranslation();


    const onSubmit = () => {
        formUp.validateFields().then(values => {
            const req = new UserPFormModel(values.id, values.permissionId, values.userId);
            submitHandler(req);
        }).catch(err => {
            console.log(err.message, 'error msg')
        })
    }
    return (
        <div>

            <Form layout='vertical'
                form={formUp}>
                <Row>
                    <Col>
                        <Form.Item name='id' hidden={true}></Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7} offset={2} >
                        <Form.Item name='permissionId' label={t("userPermission.common.permissionId", { defaultValue: 'Permission ID' })}
                            rules={[{ required: true, message: t('userPermission.form.givePermissionId', { defaultValue: 'Please give Permission Id' }) }, { pattern: new RegExp(/^[0-9]*$/), message: 'permission Id contains only numbers' }]}>
                            <Input placeholder={t("userPermission.common.permissionId", { defaultValue: 'Permission ID' })} /></Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={2}>
                        <Form.Item name='userId' label={t("userPermission.common.userId", { defaultValue: 'User ID' })}
                            rules={[{ required: true, message: t('userPermission.form.userIdRequired', { defaultValue: 'User Id is required' }) }, { pattern: new RegExp(/^[0-9]*$/) }]}>
                            <Input placeholder={t("userPermission.common.userId", { defaultValue: 'User ID' })} /></Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={18}>
                        <Button  type='primary'onClick={onSubmit} >{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}