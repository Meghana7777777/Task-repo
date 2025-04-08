
import { GetAllUnitDto, OrganizationReqDto, DropdownOrganizationDto, UnitCreateDto, AlertMessages } from '@hrexpert/shared-models';
import { UnitsService, OrganizationService } from '@hrexpert/shared-services';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';



interface IUnitFormProps {
    initialValues: GetAllUnitDto | undefined;
    closeButtonHandler: () => void;
    getUnitsByClientId: (orgIdReq: OrganizationReqDto) => void
    selectedUnits: number

}

export const  UnitForm = (props: IUnitFormProps) => {
    const [formRef] = Form.useForm();
    const [organization, setOrganization] = useState<DropdownOrganizationDto[]>([]);
    const { initialValues, closeButtonHandler, getUnitsByClientId, selectedUnits } = props;
    const unitsService = new UnitsService();
    const organizationService = new OrganizationService();
    const { Option } = Select;
    const { t } = useTranslation();
    const { IAMClientAuthContext } = useIAMClientState();
    const orgIdReq: OrganizationReqDto = new OrganizationReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedUnits)


    useEffect(() => {
        getOrganizationDropDown();
    }, [])

    const getOrganizationDropDown = () => {
        organizationService.getAllOrganizationsDropdown().then(res => {
            if (res.status) {
                setOrganization(res.data)
            } else {
                setOrganization([]);
            }
        }).catch(err => console.log(err.message, 'err message'));
    }


    const onSubmit = () => {
        formRef.validateFields().then(values => {
            const req = new UnitCreateDto(values.unitId, values.name, values.description, values.organizationId, values.versionFlag);
            unitsService.createUnit(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    getUnitsByClientId(orgIdReq);
                    closeButtonHandler();
                    formRef.resetFields();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            });

        }).catch(err => { console.log(err.message) })
    };
    return (
        <div>

            <Form layout='vertical'
                form={formRef} initialValues={initialValues}>
                <Row justify={'space-around'}>
                    <Col>
                        <Form.Item name='unitId' hidden>
                            <InputNumber placeholder="unitId" />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name='versionFlag' hidden>
                            <InputNumber placeholder="versionFlag" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7} >
                        <Form.Item name='name' label={t("unit.common.name", { defaultValue: 'Name' })}
                            rules={[{ required: true, message: t('unit.form.giveFirstName', { defaultValue: 'Please give firstName' }) }, { pattern: /^(?!\s)(?!.*\s{2,}).*$/, message: 'Firstname contains letters and special characters also' }]}>
                            <Input placeholder={t("unit.common.name", { defaultValue: 'Name' })} /></Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                        <Form.Item name='description' label={t("unit.common.description", { defaultValue: 'Description' })}
                            rules={[{ required: true, message: t('unit.form.enterDescription', { defaultValue: 'Enter Description' }) }, { pattern: new RegExp(/^[A-Za-z]+$/) }]}>
                            <Input placeholder='Description ' /></Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                        <Form.Item name='organizationId' label={t("unit.common.organizationId", { defaultValue: 'OrganizationID' })}
                            rules={[{ required: true, message: t("unit.form.selectOrgId", { defaultValue: 'Select OrganizationId' }) }]}>
                            <Select placeholder='Select OrganizationId'>
                                {organization.map((rec) => {
                                    return <Option value={rec.organizationId}>{rec.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={7} xl={7} xxl={24} offset={21}>
                        <Button type='primary'  onClick={onSubmit} >{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
export default UnitForm;





