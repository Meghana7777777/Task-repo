import { BookOutlined, CheckCircleTwoTone, IdcardOutlined, SolutionOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { TypeOfJoiningEnum } from "@hrexpert/shared-models";
import { EmployeeOnboardingService, RecruitmentServiceSharedService } from "@hrexpert/shared-services";
import { Button, Card, Form, message, Result, Space, Spin, Steps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sakkuLogo from '../../../../assets/images/sakku-logo-1979.jpg';
import RecruitmentEmpDetailsForm from "./emp-details";
import EmpEducationDetailsForm from "./emp-edu";
import EmpExperienceDetailsForm from "./emp-exp";
import EmpIdProofsDetailsForm from "./emp-idproofs";
import EmpFamilyDetailsForm from "./empFamily";


interface RecruitmentEmployeeJoiningFormProps {
    profileId: number
}

const RecruitmentEmployeeJoiningForm: React.FC<any> = (props: RecruitmentEmployeeJoiningFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [newEmpOrRejoin, setNewEmpOrRejoin] = useState<TypeOfJoiningEnum>(TypeOfJoiningEnum.NEW_EMPLOYEE);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [formRef] = Form.useForm();
    const [idValidForm] = Form.useForm();
    const navigate = useNavigate()
    const service = new EmployeeOnboardingService()
    const [registrationDone, setRegistrationDone] = useState<boolean>(false)
    const [isRegistrationDone, setIsRegistrationDone] = useState<number>(0)
    const [registrationId, setRegistrationId] = useState<number>(12345)
    const recruitmentServiceSharedService = new RecruitmentServiceSharedService()


    useEffect(() => {
        getProfileData()
    }, [])

    const getProfileData = () => {
        try {
            recruitmentServiceSharedService.getProfile({ uuid: props.profileId }).then((res) => {
                if (res.status) {
                    formRef.setFieldsValue(res.data[0])
                    setIsRegistrationDone(res.data[0].isRegistered)
                }
            })
        } catch (err) {
            message.error("Please fill out all required fields before proceeding.");
        }
    }


    const handleNext = async () => {
        try {
            await formRef.validateFields();
            const currentData = formRef.getFieldsValue();

            setFormData((prevData) => ({
                ...prevData,
                ...currentData,
            }));
            if (currentStep < 4) setCurrentStep(currentStep + 1);
        } catch (err) {
            message.error("Please fill out all required fields before proceeding.");
        }
    };

    function getChangedValues(oldData: Record<string, any>, newData: Record<string, any>): Record<string, any> {
        const changedValues: Record<string, any> = {};
        Object.keys(newData).forEach((key) => {
            if (oldData[key] !== newData[key]) {
                changedValues[key] = { oldValue: oldData[key], newValue: newData[key] };
            }
        });
        return changedValues;
    }

    const handleSubmit = async () => {
        await formRef.validateFields();
        const finalData = { ...formData, ...formRef.getFieldsValue(), joiningStatus: newEmpOrRejoin }
        setLoading(true);

        try {
            let response;
            // Handle NEW_EMPLOYEE case
            response = await service.createEmployee(finalData);
            if (response.status) {
                if (response.data.employeeIdProofs.length > 0) {
                    const formData = new FormData();
                    formData.append('empId', response.data.id);
                    const idProofsArray = []
                    let idIndex = 0
                    for (const typeid of finalData.employeeIdProofs) {
                        if (typeid.file && typeof typeid.file === 'object') {
                            idProofsArray.push({ id: response?.data?.employeeIdProofs[idIndex].id })
                            formData.append('files', typeid.file.file);
                        }
                        idIndex += 1
                    }
                    formData.append('idProofs', JSON.stringify(idProofsArray));
                    await service.employeeDocumentUpload(formData);
                }

                // Handle Experience Proof uploads if applicable
                if (response.data.employeeExperienceDetails?.length > 0) {
                    const formData = new FormData();
                    formData.append('empId', response.data.id);
                    const expProofsArray = []
                    let expIndex = 0
                    for (const typeid of finalData.employeeExperienceDetails) {
                        if (typeid.file && typeof typeid.file === 'object') {
                            expProofsArray.push({ id: response?.data?.employeeExperienceDetails[expIndex].id })
                            formData.append('files', typeid.file.file);
                        }
                        expIndex += 1
                    }
                    formData.append('expProofs', JSON.stringify(expProofsArray));
                    await service.employeeExperienceDocumentUpload(formData);
                }
                await recruitmentServiceSharedService.updateIsProfileRegistered({ id: props.profileId })
                handleReset();
                setRegistrationId(response.data.id)
                setRegistrationDone(true)
            } else {
                message.error(response.internalMessage);
            }
        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({});
        formRef.resetFields();
        setCurrentStep(0);
        setNewEmpOrRejoin(TypeOfJoiningEnum.NEW_EMPLOYEE)
    };

    const handleStepChange = (step: number) => setCurrentStep(step);

    const steps = [
        { title: "General Information", icon: <UserOutlined /> },
        { title: "Family Details", icon: <TeamOutlined /> },
        { title: "Education Details", icon: <BookOutlined /> },
        { title: "Experience Details", icon: <SolutionOutlined /> },
        { title: "ID Proof Details", icon: <IdcardOutlined /> },
    ];


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Card
                style={{ width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e4e2e2' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <img src={sakkuLogo} alt="Sakku Logo" style={{ height: '70px', marginRight: '10px', width: '200px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <h1 style={{ color: '#032555' }}>Employee Registration Form</h1>
                </div>
                {isRegistrationDone === 1 ? <>
                    <Result
                        icon={<CheckCircleTwoTone twoToneColor="#032555" />}
                        title="You Already Registered!"
                    /></> :
                    registrationDone ? <Result
                        icon={<CheckCircleTwoTone twoToneColor="#032555" />}
                        title="Successfully Registered!"
                        subTitle={
                            <>
                                <div>Registration ID: {registrationId}</div>
                                <div>Please keep this ID safe for reference during joining.</div>
                            </>
                        } /> :
                        <PageContainer backIcon>
                            <Spin spinning={loading}>
                                <Steps current={currentStep} onChange={handleStepChange} items={steps} />
                                <div className="steps-content">
                                    <Form layout="vertical" form={formRef} >
                                        <Card>
                                            {currentStep === 0 && <RecruitmentEmpDetailsForm form={formRef} idValidForm={idValidForm}  />}
                                            {currentStep === 1 && <EmpFamilyDetailsForm form={formRef} />}
                                            {currentStep === 2 && <EmpEducationDetailsForm form={formRef} />}
                                            {currentStep === 3 && <EmpExperienceDetailsForm form={formRef} />}
                                            {currentStep === 4 && <EmpIdProofsDetailsForm form={formRef} />}

                                            <div style={{ marginTop: "20px", textAlign: "right" }}>
                                                <Space>
                                                    {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>}
                                                    {currentStep < 4 && <Button type="primary" onClick={handleNext}>Next</Button>}
                                                    {/* {(currentStep === 0 || currentStep === 4) && (
                                                        <Button type="primary" onClick={handleSubmit}>Submit</Button>
                                                    )} */}
                                                    {(currentStep === 4) && (
                                                        <Button type="primary" onClick={handleSubmit}>
                                                            {"Submit"}
                                                        </Button>
                                                    )}
                                                </Space>
                                            </div>
                                        </Card>
                                    </Form>
                                </div>
                            </Spin>


                        </PageContainer>
                }

            </Card>
        </div>
    );
};

export default RecruitmentEmployeeJoiningForm;
