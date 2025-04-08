
import { PermissionsDto, ScopesDropDownDto } from '@hrexpert/shared-models';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import { ClassValidator } from '../../../common/utils';

interface IPermFormProps {
    submitHandler: (req: PermissionsDto) => void;
    initialValues: any;
    scopes: ScopesDropDownDto[]
}

const { Option } = Select;
export const  PermForm = (props: IPermFormProps) => {
    const { t } = useTranslation();
    const classValidator = new ClassValidator();
    const { IAMClientAuthContext } = useIAMClientState();
    const [formRef] = Form.useForm();
    const { submitHandler, initialValues, scopes } = props;



    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new PermissionsDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, values.permissionId, values.name, values.subMenuId, undefined, values.scopeId, undefined, values.versionFlag, true, values.moduleId, undefined, values.applicationId, undefined);
            submitHandler(req);
        }).catch(err => {
            console.log(err.message, 'error msg')
        })
    };

    return (
        <div>

            <Form layout='vertical' form={formRef} initialValues={initialValues}>
                <Form.Item hidden name='moduleId'>
                    <Input />
                </Form.Item>
                <Form.Item hidden name='menuId'>
                    <Input />
                </Form.Item>
                <Form.Item hidden name='applicationId'>
                    <Input />
                </Form.Item>
                <Form.Item hidden name='subMenuId'>
                    <Input />
                </Form.Item>
                <Form.Item hidden name='permissionId'>
                    <Input />
                </Form.Item>
                <Form.Item hidden name='versionFlag'>
                    <Input />
                </Form.Item>
                <Row>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={2}>
                        <Form.Item name='name' label={t("permissions.form.name", { defaultValue: 'Name' })}
                            rules={[{ required: true, message: t('permissions.form.rules.moduleNameRequired', { defaultValue: 'Please fill the name' }) },
                            { pattern: new RegExp(/^[A-Za-z]*$/), message: t('permissions.form.rules.moduleNamePattern', { defaultValue: 'Name should contain letters only' }) },
                            ]}>
                            <Input placeholder={t("permissions.form.name", { defaultValue: 'Name' })} /></Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7} offset={3}>
                        <Form.Item name='scopeId' label={t("permissions.form.scopeID", { defaultValue: 'ScopeID' })}
                            rules={[{ required: true, message: t('permissions.form.rules.giveScopeId', { defaultValue: 'Please give Scope Id' }) }]}>
                            <Select placeholder={t("permissions.form.scopeID", { defaultValue: 'ScopeID' })}>
                                {scopes.map(rec => {
                                    return <Option value={rec.id} key={rec.id + 'subMenu'}>{rec.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} style={{marginLeft:'500px'}}>
                        <Button  type='primary'onClick={onSubmit} >{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}