
import { GetAllOrganizations, OrganizationCreateDto, AlertMessages } from '@hrexpert/shared-models';
import { OrganizationService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd'; 
import { useTranslation } from 'react-i18next';




interface IOrganizationFormProps {
    initialValues: GetAllOrganizations | undefined;
    getAllOrganizations: () => void;
    closeButtonHandler: () => void;
}

export const  OrganizationForm = (props: IOrganizationFormProps) => {
    const [formRef] = Form.useForm();
    const { initialValues, getAllOrganizations, closeButtonHandler } = props;
    const orgService = new OrganizationService();
    const { t } = useTranslation();
    

    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new OrganizationCreateDto(values.name, values.description, values.organizationId, values.versionFlag);
            orgService.createOrganization(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    getAllOrganizations();
                    closeButtonHandler();
                    formRef.resetFields();
                } else {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                }
            });
        }).catch(err => {
            console.log(err.message, 'error msg')
        })
    };

    return (
        
        <div>
            <Form layout='vertical' form={formRef} initialValues={initialValues}>
                <Row>
                    <Form.Item name='organizationId' hidden>
                        <InputNumber placeholder="organizationId" />
                    </Form.Item>
                    <Form.Item hidden name='versionFlag'>
                        <InputNumber placeholder="versionFlag" />
                    </Form.Item>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }} xxl={{ span: 10, offset: 0 }}>
                        <Form.Item name='name' label={t("organization.common.name", {defaultValue:'Name'})}
                            rules={[
                                { required: true, message: t('organization.form.rules.moduleNameRequired', { defaultValue: 'Please fill the name' }) },
                                { pattern: new RegExp(/^[A-Za-z]*$/), message: t('organization.form.rules.moduleNamePattern', { defaultValue: 'Name should contain letters only' }) },
                            ]}>
                            <Input placeholder={t("organization.common.name", {defaultValue:'Name'})} />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }} xl={{ span: 10, offset: 1 }} xxl={{ span: 10, offset: 1 }}>
                        <Form.Item name='description' label={t("organization.common.description", {defaultValue:'Description'})}
                            rules={[
                                { required: true, message: t('organization.form.rules.descriptionRequired', { defaultValue: 'Description is required' }) },
                            ]}>
                            <Input placeholder={t("organization.common.description", {defaultValue:'Description'})} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row >
                    <Col offset={18}>
                        <Button type='primary' onClick={onSubmit}>{t("common.submitButton", {defaultValue:'Submit'})}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
