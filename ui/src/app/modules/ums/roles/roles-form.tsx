
import { GetAllRolesDto, GetAllUnitDropDownDto, UnitIdDto, CreateRolesDto, AlertMessages } from '@hrexpert/shared-models';
import { RolesService, UnitsService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';
import { useTranslation } from 'react-i18next';



interface IRolesFormProps {
    initialValues: GetAllRolesDto;
    // getAllRoles: () => void;
    closeButtonHandler: () => void;
    SelectedUnitsData: any[];
}

export const  RolesForm = (props: IRolesFormProps) => {
    const [formRef] = Form.useForm();
    const { IAMClientAuthContext } = useIAMClientState();
    const { Option } = Select;
    const rolesService = new RolesService();
    const { initialValues, closeButtonHandler, SelectedUnitsData } = props;
    const [unitsData, setUnitsData] = useState<GetAllUnitDropDownDto[]>([])
    const unitService = new UnitsService();
    const { t } = useTranslation();

    useEffect(() => {
        const req = new UnitIdDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, IAMClientAuthContext.user.userId);
        getUnitsForDropDown(req)
    }, [])

    const onSubmit = () => {
        formRef.validateFields().then((values: CreateRolesDto) => {
            console.log(values, 'values')
            const req = new CreateRolesDto(values.roleName, Number(values.unitId), values.description, values.rolesId, values.versionFlag);
            rolesService.createRoles(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    // getAllRoles();
                    closeButtonHandler();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                };
            });
        }).catch(err => {
            console.log(err.message, 'error msg')
        });
    };

    const getUnitsForDropDown = (req: UnitIdDto) => {
        unitService.getAllUnitsDropDown(req).then((res) => {
            if (res.status) {
                setUnitsData(res.data)
            } else {
                setUnitsData([]);
            }
        }).catch(err => console.log(err.message, 'err message'));

    }

    return (
        <div>
            <Form layout='vertical' form={formRef} initialValues={initialValues} >
                <Row>
                    <Form.Item hidden name={'rolesId'}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item hidden name={'versionFlag'}>
                        <InputNumber />
                    </Form.Item>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} >
                        <Form.Item name='roleName' label={t("roles.common.name", { defaultValue: 'Name' })}
                            // rules={[
                            //     { required: true, message: t("common.fillTheName", { defaultValue: 'Please fill the name' }) },
                            //     { pattern: new RegExp(/^[A-Za-z]*$/), message: t("common.lettersOnly", { defaultValue: 'Name contain letters only' }) }
                            // ]}
                            >
                            <Input placeholder={t("roles.common.name", { defaultValue: 'Name' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={1}>
                        <Form.Item name='description' label={t("roles.common.description", { defaultValue: 'Description' })}
                            rules={[
                                { required: true, message: t('roles.form.descriptionRequired', { defaultValue: 'Description is required' }) }
                            ]}>
                            <Input placeholder={t("roles.common.description", { defaultValue: 'Description' })} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={1}>
                        <Form.Item name='unitId' label={t("roles.common.unit", { defaultValue: 'Unit' })}
                            rules={[
                                { required: true, message: t('roles.form.unitRequired', { defaultValue: 'unit  is required' }) }
                            ]}>
                            <Select
                             allowClear
                             showSearch
                              placeholder='Select Unit'
                              optionFilterProp="children">
                                {SelectedUnitsData.map((rec) => {
                                    return <Option value={rec.unitId}>{rec.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col offset={20}>
                        <Button type='primary' onClick={onSubmit}>{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}