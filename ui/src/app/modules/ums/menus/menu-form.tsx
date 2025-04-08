import * as antdIcons from '@ant-design/icons';
import { MenusDto } from '@hrexpert/shared-models';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import { ClassValidator } from '../../../common/utils';
import { IconType } from '../../../../../../libs/shared-models/src/lib/ums/ums-common';
  


interface IMenuFormProps {
    submitHandler: (req: MenusDto) => void;
    initialValues?: MenusDto
}

const { Option } = Select;
export const  MenuForm = (props: IMenuFormProps) => {
    const { t } = useTranslation();
    const classValidator = new ClassValidator();
    const { IAMClientAuthContext } = useIAMClientState();
    const [formRef] = Form.useForm();
    const { submitHandler, initialValues } = props;
    const [iconType, setIconType] = useState(IconType.SYS_LIB);

    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new MenusDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, values.menuId, values.menuName, values.order, values.iconType, values.iconName, values.path, values.component, true, values.versionFlag, values.moduleId, undefined, values.applicationId, undefined);
            submitHandler(req);
        }).catch(err => {
            console.log(err.message, 'error msg')
        })
    }
    const onIconTypeChange = (iconType: IconType) => {
        setIconType(iconType);
        formRef.setFieldValue('iconName', '');
    };

    return (
        <div>
            <Form layout='vertical'
                form={formRef} initialValues={initialValues}>
                <Row>
                    <Col>
                        <Form.Item style={{ display: 'none' }} name='moduleId'>
                            <Input type='hidden' />
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} name='menuId'>
                            <Input type='hidden' />
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} name='applicationId'>
                            <Input type='hidden' />
                        </Form.Item>
                        <Form.Item style={{ display: 'none' }} name='versionFlag'>
                            <Input type='hidden' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={11} lg={11} xl={11} xxl={11}>
                        <Form.Item name='menuName' label={t("menu.common.menuName", { defaultValue: 'Menu Name' })}
                            rules={[{ required: true, message: t('menu.form.rules.menuNameRequired', { defaultValue: 'Please give Menu Name' }) }, ...classValidator.alphaSpaces()]}>
                            <Input placeholder={t("menu.common.menuName", { defaultValue: 'Menu Name' })} /></Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11} offset={2}>
                        <Form.Item name='order' label={t("menu.common.order", { defaultValue: 'Order' })}
                            rules={[{ required: true, message: t('menu.form.rules.orderRequired', { defaultValue: 'Please give Order' }) }, { pattern: new RegExp(/^[0-9]*$/), message: t('menu.form.rules.orderPattern', { defaultValue: 'Order should contain numbers' }) }]}>
                            <Input placeholder={t("menu.common.order", { defaultValue: 'Order' })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11}>
                        <Form.Item
                            label={t("menu.common.iconType", { defaultValue: "Icon Type" })}
                            name="iconType"
                            rules={[{ required: true, message: t('menu.form.rules.iconTypeRequired', { defaultValue: 'Please select Icon Type' }) },]}>
                                 
                            <Select placeholder={t("submenus.common.iconType", { defaultValue: 'Icon Type' })}
                             onChange={onIconTypeChange}>
                                {
                                    Object.keys(IconType).map(rec => {
                                        return <Option value={IconType[rec]}>{IconType[rec]}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11} offset={2}>
                        <Form.Item name='iconName' label={t("submenus.common.iconName", { defaultValue: 'Icon Name' })}
                            rules={[{ required: true, message: t('submenus.form.iconNameRequired', { defaultValue: ' Icon Name is required' }) }, { pattern: new RegExp(/^[A-Za-z]+$/) }]}>
                            {
                                iconType === IconType.SYS_LIB ?
                                    <Select placeholder={t("submenus.common.iconName", { defaultValue: 'Icon Name' })} filterOption={(input, option) => (option!.value as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '100%' }}>
                                        {
                                            Object.keys(antdIcons).map(rec => {
                                                const SpecificIcon = antdIcons[rec];
                                                if (typeof SpecificIcon !=='function') {
                                                    return <Option value={rec}><SpecificIcon />&nbsp; - &nbsp;{rec}</Option>
                                                }else{
                                                    return <Option value={rec} disabled>{rec}</Option>;
                                                }
                                            })
                                        }
                                    </Select> :
                                    <Input placeholder={t("submenus.common.iconName", { defaultValue: 'Icon Name' })} />
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11}>
                        <Form.Item name='path' label={t("submenus.common.path", { defaultValue: 'Path' })}
                            rules={[
                                { required: false, message: t('submenus.form.pathRequired', { defaultValue: 'path  is required' }) }
                            ]}>
                            <Input placeholder={t("submenus.common.path", { defaultValue: 'Enter Path' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11} offset={2}>
                        <Form.Item name='component' label={t("submenus.common.component", { defaultValue: 'Component' })}
                            rules={[
                                { required: false, message: t('submenus.form.componentRequired', { defaultValue: 'component is required' }) },
                                { pattern: new RegExp(/^[A-Za-z]+$/) }
                            ]}>
                            <Input placeholder='component' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='end'>
                    <Col>
                        <Button type='primary' onClick={onSubmit} >Submit</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}