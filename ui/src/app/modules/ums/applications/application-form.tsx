

import { GetAllApplicationsDto, ApplicationsCreateDto, AlertMessages } from '@hrexpert/shared-models';
import { ApplicationService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd'
import { useTranslation } from 'react-i18next';


interface IApplicationFormProps {
    initialValues?: GetAllApplicationsDto
    closeButtonHandler: () => void;
    getAllApplicationsData: () => void;
}
export const ApplicationForm = (props: IApplicationFormProps) => {
    const { t } = useTranslation();
    const [formRef] = Form.useForm();
    const { initialValues, closeButtonHandler, getAllApplicationsData } = props;
    const service = new ApplicationService();


    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new ApplicationsCreateDto(values.applicationName, values.applicationId, values.description, values.versionFlag)
            service.create(req).then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    getAllApplicationsData();
                    formRef.resetFields();
                    closeButtonHandler();
                }
            })
        }).catch(err => {
            console.log(err.message, 'error msg')
        })
    }
    return (
        <div>
            <Form layout='vertical' form={formRef} autoComplete='off' initialValues={initialValues}>
                <Row>
                    <Form.Item name='applicationId' hidden>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name='versionFlag' hidden>
                        <InputNumber />
                    </Form.Item>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }} xxl={{ span: 10, offset: 0 }}  >
                        <Form.Item name='applicationName' label={t("application.common.name", { defaultValue: 'Name' })}
                            rules={[
                                { required: true, message: t('application.form.rules.nameRequired', { defaultValue: 'Please fill the name' }) },
                                { pattern: new RegExp(/^[A-Za-z]*$/), message: t('application.form.rules.namePattern', { defaultValue: 'Name should contain letters only' }) },
                            ]}>
                            <Input placeholder={t("application.common.name", { defaultValue: 'Name' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }} xl={{ span: 10, offset: 1 }} xxl={{ span: 10, offset: 1 }}>
                        <Form.Item name='description' label={t("application.common.description", { defaultValue: 'Description' })}
                            rules={[
                                { required: true, message: t('application.form.rules.descriptionRequired', { defaultValue: 'Description is required' }) },
                            ]}>
                            <Input placeholder={t("application.common.description", { defaultValue: 'Description' })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col offset={18}>
                        <Button 
                         type='primary' onClick={onSubmit}>{t("common.submitButton", { defaultValue: 'Submit' })} </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}