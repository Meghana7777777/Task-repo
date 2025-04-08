import * as antdIcons from '@ant-design/icons';
import { SubMenuDto } from '@hrexpert/shared-models';
import { Button, Col, Form, Input, Radio, RadioChangeEvent, Row, Select } from 'antd';
import { IconType } from '../../../../../../libs/shared-models/src/lib/ums/ums-common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import { ClassValidator } from '../../../common/utils';



interface ISubMenuFormProps {
    submitHandler: (req: SubMenuDto) => void
    initialValues: SubMenuDto;
    subMenuData: SubMenuDto[]
}

const { Option } = Select;
export const  SubMenuForm = (props: ISubMenuFormProps) => {
    const { t } = useTranslation();
    const classValidator = new ClassValidator();
    const { IAMClientAuthContext } = useIAMClientState();
    const [formRef] = Form.useForm();
    const { submitHandler, initialValues, subMenuData } = props;
    const [iconType, setIconType] = useState(IconType.SYS_LIB);
    const [value, setValue] = useState<boolean>();

    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new SubMenuDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, values.subMenuId, values.name, values.order, values.iconType, values.iconName, values.path, values.component, values.parentId, undefined, values.menuId, undefined, values.moduleId, undefined, values.applicationId, undefined, true, values.versionFlag, value);
            submitHandler(req);
        }).catch(err => {
            console.log(err.message, 'error msg');
        })
    }

    const onIconTypeChange = (iconType: IconType) => {
        setIconType(iconType);
        formRef.setFieldValue('iconName', '');
    };

    const radioOnchangeHandler = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    return (
        <div>

            <Form layout='vertical' form={formRef} initialValues={initialValues}>
                <Form.Item style={{ display: 'none' }} name='moduleId'>
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item style={{ display: 'none' }} name='menuId'>
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item style={{ display: 'none' }} name='applicationId'>
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item style={{ display: 'none' }} name='subMenuId'>
                    <Input type='hidden' />
                </Form.Item>
                <Form.Item style={{ display: 'none' }} name='versionFlag'>
                    <Input type='hidden' />
                </Form.Item>

                <Row>
                    <Col xs={24} sm={24} md={11} lg={11} xl={11} xxl={11}>
                        <Form.Item name='name' label={t("submenus.common.name", { defaultValue: 'Name' })}
                            rules={[{ required: true, message: t("common.fillTheName", { defaultValue: 'Please give name' }) }, 
                            // ...classValidator.alphaSpaces()
                            ]}>
                            <Input placeholder={t("submenus.common.name", { defaultValue: 'Name' })} /></Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11} offset={2}>
                        <Form.Item name='order' label={t("submenus.common.order", { defaultValue: 'Order' })}
                            rules={[{ required: true, message: t('submenus.form.giveOrder', { defaultValue: 'Please give Order' }) }, { pattern: new RegExp(/^[0-9]*$/), message: 'order  should contain numbers' }]}>
                            <Input placeholder={t("submenus.common.order", { defaultValue: 'Order' })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11}>
                        <Form.Item
                            label={t("submenus.common.iconType", { defaultValue: 'Icon Type' })}
                            name="iconType"
                            rules={[{ required: true, message: t('submenus.form.selectIcon', { defaultValue: 'Please select Icon Type' }) }]}>
                            <Select placeholder={t("submenus.common.iconType", { defaultValue: 'Icon Type' })}
                            onChange={onIconTypeChange} >
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
                                    <Select placeholder={t("submenus.common.iconName", { defaultValue: 'Icon Name' })} filterOption={(input, option) => (option!.value as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '100%' }} >
                                        {
                                            Object.keys(antdIcons).map(rec => {
                                                const SpecificIcon = antdIcons[rec];
                                                if (typeof SpecificIcon !== 'function') {
                                                    return <Option value={rec}><SpecificIcon />&nbsp; - &nbsp;{rec}</Option>
                                                } else {
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
                                { required: true, message: t('submenus.form.pathRequired', { defaultValue: 'path  is required' }) }
                            ]}>
                            <Input placeholder={t("submenus.common.path", { defaultValue: 'Enter Path' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11} offset={2}>
                        <Form.Item name='component' label={t("submenus.common.component", { defaultValue: 'Component' })}
                            rules={[
                                { required: true, message: t('submenus.form.componentRequired', { defaultValue: 'component is required' }) },
                                { pattern: new RegExp(/^[A-Za-z]+$/) }
                            ]}>
                            <Input placeholder='Component' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24} lg={11} xl={11} xxl={11}>
                        <Form.Item name='parentId' label={t("submenus.common.parentId", { defaultValue: 'ParentID' })}>
                            <Select placeholder={t("submenus.common.parentId", { defaultValue: 'ParentID' })}
                            >
                                {subMenuData.map(rec => {
                                    return <Option value={rec.subMenuId} key={rec.subMenuId + 'subMenu'}>{rec.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={11} xl={11} xxl={11} offset={2}>
                        <Form.Item label={"Is Route Only"}>
                            <Radio.Group onChange={radioOnchangeHandler} value={value}>
                                <Radio value={true} >YES</Radio>
                                <Radio value={false}>NO</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                </Row>
                <Row>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={21} >
                        <Button  type='primary'onClick={onSubmit} >{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}