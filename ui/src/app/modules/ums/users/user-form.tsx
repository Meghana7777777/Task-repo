
import { UploadOutlined } from '@ant-design/icons';
import { GetAllUsersDto, GenderEnum, BranchesReqDto, AlertMessages } from '@hrexpert/shared-models';
import { Button, Card, Col, Form, Input, Row, Select, Upload } from 'antd';
import { IdentityTypeEnum, UsersCreateDto } from '../../../../../../libs/shared-models/src/lib/ums/ums-common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIAMClientState } from '../../../common/iam-client-react';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { DefaultOptionType } from 'antd/es/select';
import { CreateUserChildDTO } from '../../../../../../libs/shared-models/src/lib/ums/ums-common/users/create-user-child.dto';

const { Option } = Select;


interface IUserFormProps {
    submitHandler?: (req: UsersCreateDto) => void;
    initialValues?: GetAllUsersDto;
    unitsData: any;
    selectedClients: number;



}

export const UserForm = (props: IUserFormProps) => {
    const [formRef] = Form.useForm();
    const { submitHandler, selectedClients, initialValues, unitsData } = props;
    const [fileList, setFileList] = useState<any>()
    const { IAMClientAuthContext } = useIAMClientState();
    const { t } = useTranslation();
    const [employeeData, setEmployeeData] = useState<any[]>([]);
    const [emplo, setEmplo] = useState<any>([])

    interface CustomOptionType extends DefaultOptionType {
        employeeCode?: string;
      }

    const services = new EmployeeOnboardingService
useEffect(() => {
       
    getBranchAgaintEmployess()
    }, []);

    // const getBranchAgaintEmployess = (unitId) => {
    //     const req = new BranchesReqDto(unitId)

    //     services.getBranchAgaintEmployess(req).then((res) => { 
    //         if (res.status) {
    //             setEmployeeData(res.data)
    //         } else {
    //             AlertMessages.getErrorMessage(res.internalMessage)
    //         }
    //     })
    // }
    const getBranchAgaintEmployess = () => {
       

        services.getActiveEmployeeList().then((res) => { 
            if (res.status) {
                setEmployeeData(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        })
    }
    const getBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    console.log(emplo, "22222222222222222222")
    const handleSelectEmployeeCode = (value, value2) => {
        setEmplo(value2)
    }

   
    
    const onSubmit = async () => {
        formRef.validateFields().then(async (values: UsersCreateDto) => {
            const f = formRef.getFieldValue('filesData');
            let filesData: any = [];
            if (f) {
                const base = await getBase64(f.file.originFileObj);
                filesData = [{
                    ...f.file,
                    base64Url: base,
                    fileDescription: 'User Profile'
                }];
            }
    
            const children: CreateUserChildDTO[] = (values.unitIds || []).map((unitId: number) => ({
                unitIds: [unitId.toString()], 
                userId: values.userId,
            }));
    
            
            const req = new UsersCreateDto(
                values.firstName,
                values.mobileNo,
                values.unitId,
                selectedClients,
                values.userName,
                values.email,
                values.password,
                values.salt,
                IAMClientAuthContext.user.userName,
                filesData?.length ? filesData : [],
                values.userId,
                values.authenticationId,
                values.versionFlag,
                children,
                values.employeeCode,emplo
                
            );
    
            submitHandler(req); 
        }).catch(err => {
            console.log(err.message, 'error msg');
        });
    };
    
    
    const allowClear = () => {
        formRef.resetFields();
    };


    return (
        <div>

            <Form layout='vertical'
                form={formRef} initialValues={initialValues} autoComplete='off'>
                <Card title='Personal Details' >
                    <Row>
                        <Form.Item name='userId' hidden={true}></Form.Item>
                        <Form.Item name='authenticationId' hidden={true}></Form.Item>
                        <Form.Item name='versionFlag' hidden={true}></Form.Item>
                        <Form.Item name='clientId' hidden={true}></Form.Item>

                       
                    </Row>
                    <br />

                    <Row>
                        <Col xs={24} sm={24} md={7} lg={7} xl={5} xxl={7}  >
                            <Form.Item
                                name='unitId'
                                label={t('user.form.unitId', { defaultValue: 'Branch' })}
                                rules={[{ required: true, message: t('user.form.unitIdRequired', { defaultValue: 'Unit id is required' }) },

                                ]}>
                                <Select
                                 allowClear
                                 showSearch
                                 //mode='multiple'
                                  style={{ width: '100%' }} placeholder=' Select Unit' //onChange={getBranchAgaintEmployess}
                                  optionFilterProp="children">
                                    {unitsData.map((rec: any) => {
                                        return <Option value={rec.unitId}>{rec.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={7} lg={7} xl={5} xxl={7} offset={1}>
                            
                            <Form.Item
                                name='employeeCode'
                                label={t('user.common.employees', { defaultValue: 'Employees' })}
                                rules={[{ required: true, message: t('user.form.genderRequired', { defaultValue: 'Employees is required' }) },
                                ]}>
                                <Select
                                    placeholder="Employees"
                                    allowClear
                                    showSearch
                                    onChange={(value, option) => {
                                        const customOption = option as CustomOptionType;
                                        handleSelectEmployeeCode(value, customOption?.employeeCode);
                                    }}
                                    optionFilterProp="children"
                                >
                                    {employeeData.map((rec: any) => (
                                        <Option key={rec.employeeId} value={rec.employeeId} employeeCode={rec.employeeCode}>
                                            {rec.employeeName}-{rec.employeeCode}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={7} lg={7} xl={5} xxl={7} offset={1}>
                            <Form.Item
                                name='mobileNo'
                                label={t('user.common.mobileNo', { defaultValue: 'Mobile Number' })}
                                rules={[{ required: true, message: t('user.form.mobileNoRequired', { defaultValue: 'Mobile number is required' }) },]}>
                                <Input placeholder={t('user.common.mobileNo', { defaultValue: 'Mobile Number' })} />
                            </Form.Item>
                        </Col> 
                        <Col xs={24} sm={24} md={7} lg={7} xl={5} xxl={7}  >
                            <Form.Item
                                name='unitIds'
                                label={t('user.form.unitId', { defaultValue: 'Branch Permsion' })}
                                rules={[{ required: true, message: t('user.form.unitIdRequired', { defaultValue: 'Unit id is required' }) },

                                ]}>
                                <Select
                                 allowClear
                                 showSearch
                                 mode='multiple'
                                  style={{ width: '100%' }} placeholder=' Select Unit' //onChange={getBranchAgaintEmployess}
                                  optionFilterProp="children">
                                    {unitsData.map((rec: any) => {
                                        return <Option value={rec.unitId}>{rec.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>

                      
                    </Row>
                    
                </Card>

                <br />
                <Card title='Authentication'>

                    <Row>
                        <Col xs={24} sm={24} md={5} lg={7} xl={5} xxl={7} >
                            <Form.Item
                                name='userName'
                                label={t('user.form.userName', { defaultValue: 'User Name' })}
                                rules={[{ required: true, message: t('user.form.userNameRequired', { defaultValue: 'User Name id required' }) },]}>
                                <Input placeholder={t('user.form.userName', { defaultValue: 'User Name' })} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={5} lg={7} xl={5} xxl={7} offset={1}>
                            <Form.Item
                                name="email"
                                label={t('user.form.email', { defaultValue: 'Email' })}
                                rules={[{ type: 'email', message: t('user.form.emailInvalid', { defaultValue: 'Email is invalid' }) },
                                { required: true, message: t('user.form.emailRequired', { defaultValue: 'Email is required' }) },]}
                            >
                                <Input placeholder={t('user.form.email', { defaultValue: 'Email' })} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={5} lg={7} xl={5} xxl={7} offset={1}>
                            <Form.Item
                                name="password"
                                label={t('user.form.password', { defaultValue: 'Password' })}
                                hasFeedback
                                rules={[
                                    { required: true, message: t('user.form.passwordRequired', { defaultValue: 'Password is required' }) },
                                ]}

                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={5} lg={7} xl={5} xxl={7} offset={1}>
                            <Form.Item
                                name="confirmPassword"
                                label={t('user.form.confirmPassword', { defaultValue: 'Confirm Password' })}
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: t('user.form.confirmPasswordRequired', { defaultValue: 'confirm password is required' }) },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('user.form.passwordNotMatch', { defaultValue: 'Entered password doesnot match' })));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col xs={24} sm={24} md={7} lg={7} xl={5} xxl={7} >
                            <Form.Item name={'filesData'}>
                                <Upload

                                    multiple={false}
                                    maxCount={1}
                                    showUploadList={true}
                                    customRequest={(data) => setFileList([data.file])}
                                    onRemove={() => setFileList([])}
                                    fileList={fileList}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>

                            </Form.Item>

                        </Col>
                    </Row>
                </Card>


                <Row  >
                    <Col xs={24} sm={24} md={7} lg={7} xl={2} xxl={7} offset={18}>
                        <Button onClick={allowClear} type='primary' danger>{t('user.form.clear', { defaultValue: 'Clear' })}</Button>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={7} xl={3} xxl={7} >
                        <Button type='primary' onClick={onSubmit} >{t("common.submitButton", { defaultValue: 'Submit' })}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}