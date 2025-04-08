import { ModuleDto } from '@hrexpert/shared-models';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';;

interface IModuleFormProps {
    submitHandler: (req: ModuleDto) => void;
    initialValues?: ModuleDto;
}

export const ModuleForm = (props: IModuleFormProps) => {
    const { IAMClientAuthContext } = useIAMClientState();
    const [formRef] = Form.useForm();
    const { submitHandler, initialValues } = props;
    const { t } = useTranslation();

    const onSubmit = () => {
        formRef
            .validateFields()
            .then((values) => {
                const req = new ModuleDto(
                    IAMClientAuthContext.user.userName,
                    IAMClientAuthContext.user.userId,
                    values.moduleId,
                    values.moduleName,
                    values.moduleDescription,
                    values.applicationId,
                    values.applicationId,
                    true,
                    values.versionFlag
                );
                submitHandler(req);
            })
            .catch((err) => {
                console.log(err.message, 'error msg');
            });
    };

    return (
        <div>
            <Form
                layout="horizontal"
                form={formRef}
                initialValues={initialValues}
                labelCol={{ span: 6 }}  // Adjusted label width
                wrapperCol={{ span: 14 }} // Adjusted input field width
            >
                <Form.Item style={{ display: 'none' }} name="moduleId">
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item style={{ display: 'none' }} name="versionFlag">
                    <Input type="hidden" />
                </Form.Item>

                <Form.Item
                    name="moduleName"
                    label={t('module.common.moduleName', { defaultValue: 'Module Name' })}
                    rules={[
                        {
                            required: true,
                            message: t('module.form.rules.moduleNameRequired', {
                                defaultValue: 'Please fill the name',
                            }),
                        },
                        {
                            pattern: new RegExp(/^[A-Za-z]*$/),
                            message: t('module.form.rules.moduleNamePattern', {
                                defaultValue: 'Name should contain letters only',
                            }),
                        },
                    ]}
                >
                    <Input placeholder={t('module.common.moduleName', { defaultValue: 'Module Name' })} />
                </Form.Item>

                <Form.Item
                    name="moduleDescription"
                    label={t('module.common.description', { defaultValue: 'Description' })}
                    rules={[
                        {
                            required: true,
                            message: t('module.form.rules.descriptionRequired', {
                                defaultValue: 'Description is required',
                            }),
                        },
                    ]}
                >
                    <Input placeholder={t('module.common.description', { defaultValue: 'Description' })} />
                </Form.Item>

                <Form.Item
                    name="applicationId"
                    label={t('module.common.applicationId', { defaultValue: 'Application ID' })}
                    rules={[
                        {
                            required: true,
                            message: t('module.form.rules.applicationIdRequired', {
                                defaultValue: 'Application ID is required',
                            }),
                        },
                    ]}
                    style={{ display: 'none' }}
                >
                    <Input placeholder="Application Id" type="hidden" />
                </Form.Item>

                <Row>
                    <Col offset={17}>
                        <Button type="primary" onClick={onSubmit}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};
