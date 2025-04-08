import { BookOutlined, FormOutlined, IdcardOutlined, SettingFilled, SolutionOutlined, TeamOutlined, UserAddOutlined, UserOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { EmployeeDetailsDto, TypeOfJoiningEnum } from "@hrexpert/shared-models";
import { EmployeeLogsService, EmployeeOnboardingService } from "@hrexpert/shared-services";
import { Button, Card, Descriptions, Form, message, Modal, Radio, RadioChangeEvent, Row, Space, Spin, Steps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIAMClientState } from '../../../../../common/iam-client-react';
import EmployeeDetailsForm from "../../components/employee-details-form/employee-details-form";
import EmployeeEducationDetailsForm from "../../components/employee-edu-form/employee-edu-details-form";
import EmployeeExperienceDetailsForm from "../../components/employee-experience-form/employee-experience-details-from";
import EmployeeFamilyDetailsForm from "../../components/employee-family-form/employee-family-details-form";
import EmployeeIdProofsDetailsForm from "../../components/employee-id-proofs-form/employee-id-proofs-details-form";
import EmpPayrollForm from "../../components/employee-payroll-view/emp-payroll-form";
import EmployeeSettings from "../../components/employee-settings.tsx/employee-settings";
import EmployeeFormConfig from "../employee-configuration/employee-configuration";
import EmployeeRejoinModal from "../employee-rejoin/employee-rejoin";
import "./employee-form.css";

interface EmployeeFormProps {
    employeeData?: Partial<EmployeeDetailsDto>;
    isUpdate?: boolean;
    closeForm: () => void;
    isUpdateFamilyDetails?: boolean
    isUpdateEduDetails?: boolean
    onCloseModal?: boolean
    getAllEmployeeData?: any
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employeeData, isUpdate, closeForm }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [newEmpOrRejoin, setNewEmpOrRejoin] = useState<TypeOfJoiningEnum>(TypeOfJoiningEnum.NEW_EMPLOYEE);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [rejoinModalOpen, setRejoinModalOpen] = useState<boolean>(false);
    const [empConfigModalOpen, setEmpConfigModalOpen] = useState<boolean>(false);
    const [formRef] = Form.useForm();
    const [idValidForm] = Form.useForm();
    const navigate = useNavigate()
    const service = new EmployeeOnboardingService();
    const empLogService = new EmployeeLogsService();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const user = IAMClientAuthContext.user.userName;
    const role = IAMClientAuthContext.user.roles;
    const [ModalOpen, setModalOpen] = useState(false);
    const [aadharEmpData, setAadharEmpData] = useState<any>({})
    const [aadharId, setAadharId] = useState<any>()
    const [rejoinStateChange, setRejoinStateChange] = useState<boolean>()
    const [openModal, setOpenModal] = useState(false);
    const [employeeRecords, setEmployeeRecord] = useState<{ id: number, employeeTypeId: number }>()

    console.log(employeeData, "employeeDataemployeeDatagg")
    useEffect(() => {
        if (isUpdate && employeeData) {
            const formattedData = {
                ...employeeData,
                reportingManager: employeeData.reportingManager,
                updatedUser: user,
                createdUser: user,
                role: role,
                shift: employeeData?.shift,
                dateOfJoining: employeeData?.dateOfJoining ? dayjs(employeeData?.dateOfJoining) : null,
                dateOfBirth: employeeData?.dateOfBirth ? dayjs(employeeData?.dateOfBirth) : null,
                dateOfRejoining: dayjs(employeeData?.dateOfRejoining),
                dateOfReliving: employeeData?.dateOfReliving ? dayjs(employeeData?.dateOfReliving) : null,
                employeeEduDetails: employeeData?.employeeEduDetails.map((edu) => ({
                    ...edu,
                    yearOfPass: dayjs(edu?.yearOfPass), // Format to a compatible dayjs object
                })),
                employeeExperienceDetails: employeeData?.employeeExperienceDetails.map((exp) => ({
                    ...exp,
                    fromDate: exp?.fromDate ? dayjs(exp?.fromDate) : null, // Format to a compatible dayjs object
                    toDate: exp?.toDate ? dayjs(exp?.toDate) : null, // Format to a compatible dayjs object
                })),
                bankEffDate: employeeData?.bankEffDate ? dayjs(employeeData?.bankEffDate) : null,
                cashEffDate: employeeData?.cashEffDate ? dayjs(employeeData?.cashEffDate) : null,
                pfEffFromDate: employeeData?.pfEffFromDate ? dayjs(employeeData?.pfEffFromDate) : null,
                esicEffFromDate: employeeData?.esicEffFromDate ? dayjs(employeeData?.esicEffFromDate) : null,
                probationPeriod: [employeeData?.probFromDate ? dayjs(employeeData?.probFromDate) : null, employeeData?.probToDate ? dayjs(employeeData?.probToDate) : null],
            };
            setFormData(formattedData);
            formRef.setFieldsValue(formattedData);
            handleCloseModal()
        }
    }, [employeeData, isUpdate]);

    const handleNewEmpOrRejoinChange = (e: RadioChangeEvent) => {
        const value = e.target.value;
        setNewEmpOrRejoin(value);
        if (value === TypeOfJoiningEnum.REJOIN) {
            setRejoinModalOpen(true);
            setRejoinStateChange(true)
        } else {
            setRejoinStateChange(false)
        }
    };

    const fetchRejoinEmployeeDetails = async (employeeId: number) => {
        try {
            const response = await service.getEmpById({ employeeId }); // Adjust API endpoint
            if (response.status) {
                const data = {
                    ...response.data,
                    shift: response?.data?.shift,
                    dateOfJoining: response?.data.dateOfJoining ? dayjs(response?.data.dateOfJoining) : null,
                    dateOfBirth: response?.data.dateOfBirth ? dayjs(response?.data.dateOfBirth) : null,
                    dateOfRejoining: response?.data.dateOfRejoining ? dayjs(response?.data.dateOfRejoining) : null,
                    dateOfReliving: response?.data.dateOfReliving ? dayjs(response.data.dateOfReliving) : null,
                    employeeEduDetails: response?.data?.employeeEduDetails?.map((edu) => ({
                        ...edu,
                        yearOfPass: dayjs(edu?.yearOfPass), // Format to a compatible dayjs object
                    })),
                    employeeExperienceDetails: response?.data?.employeeExperienceDetails?.map((exp) => ({
                        ...exp,
                        fromDate: exp?.fromDate ? dayjs(exp?.fromDate) : null, // Format to a compatible dayjs object
                        toDate: exp?.toDate ? dayjs(exp?.toDate) : null, // Format to a compatible dayjs object
                    })),
                    bankEffDate: response?.data?.bankEffDate ? dayjs(response?.data?.bankEffDate) : null,
                    cashEffDate: response?.data?.cashEffDate ? dayjs(response?.data?.cashEffDate) : null,
                    pfEffFromDate: response?.data?.pfEffFromDate ? dayjs(response?.data?.pfEffFromDate) : null,
                    esicEffFromDate: response?.data?.esicEffFromDate ? dayjs(response?.data?.esicEffFromDate) : null,
                    probationPeriod: [response?.data?.probFromDate ? dayjs(response?.data?.probFromDate) : null, response?.data?.probToDate ? dayjs(response?.data?.probToDate) : null],
                };
                setFormData(data);
                formRef.setFieldsValue(data);
                message.success(response.internalMessage);
            } else {
                message.error(response.internalMessage);
            }
        } catch (error) {
            message.error('Failed to fetch employee details.');
        }
    };

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
        const finalData = { ...formData, ...formRef.getFieldsValue(), joiningStatus: newEmpOrRejoin }; // Include joiningStatus in the payload
        setLoading(true);

        try {
            let response;

            if (newEmpOrRejoin === TypeOfJoiningEnum.REJOIN || isUpdate) {
                // Handle the REJOIN case
                response = await service.updateEmployee({
                    ...finalData,
                    employeeId: finalData.employeeId,
                });
                closeForm()
            } else {
                // Handle NEW_EMPLOYEE case
                response = await service.createEmployee(finalData);
            }

            if (response.status) {
                message.success(response.internalMessage);
                // setEmployeeRecord(response.data.id)
                setEmployeeRecord({
                    id: response.data.id,
                    employeeTypeId: response.data.employeeTypeId.id
                });
                // Handle ID Proof uploads if applicable
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

                // Reset the form and navigate to the desired page
                // isUpdate??closeForm();
                handleReset();
                //navigate('/employee-payroll-components');
                // navigate('/employee-view');
                setOpenModal(true)
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
        setAadharEmpData({});
        setFormData({});
        formRef.resetFields();
        setCurrentStep(0);
        setRejoinStateChange(false)
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

    const handleInputChange = async (value: string, idtypeId: any) => {
        if (idtypeId === 12) {
            formRef.resetFields();
            const res = await service.checkEmpIdDuplicates({ idNumber: value }) 
            if (res.status) {
                message.success(res.internalMessage);
                setAadharEmpData(res.data)
                setModalOpen(true)
            }
        } else if (value.length) {
            formRef.resetFields();
            const res = value.length > 5 ? await service.checkAadharPanDuplicates({ idNumber: value }) : null
            if (res.status) {
                message.success(res.internalMessage);
                setAadharEmpData(res.data)
                setModalOpen(true)
            } else {
                setAadharId(value)
                const data = {
                    employeeIdProofs: [{ idNumber: value, idType: idValidForm.getFieldValue('idType') }]
                }
                formRef.setFieldsValue(data);
            }
        }
    };

    const fetchEmpDetails = async (empDetails: any) => {
        try {
            if (empDetails) {
                const data = {
                    ...empDetails,
                    shift: empDetails?.shift,
                    dateOfJoining: empDetails?.dateOfJoining ? dayjs(empDetails?.dateOfJoining) : null,
                    dateOfBirth: empDetails?.dateOfBirth ? dayjs(empDetails?.dateOfBirth) : null,
                    dateOfRejoining: empDetails?.dateOfRejoining ? dayjs(empDetails?.dateOfRejoining) : null,
                    dateOfReliving: empDetails?.dateOfReliving ? dayjs(empDetails?.dateOfReliving) : null,
                    employeeEduDetails: empDetails?.employeeEduDetails?.map((edu) => ({
                        ...edu,
                        yearOfPass: edu?.yearOfPass ? dayjs(edu?.yearOfPass) : null,
                    })),
                    employeeExperienceDetails: empDetails?.employeeExperienceDetails?.map((exp) => ({
                        ...exp,
                        fromDate: exp.fromDate ? dayjs(exp.fromDate) : null,
                        toDate: exp.toDate ? dayjs(exp.toDate) : null,
                    })),
                    // employeeFamilyDetails: employeeData.employeeFamilyDetails.map((fam) => ({
                    //     ...fam,
                    //     familyIdType: Number(fam.familyIdType)
                    // })),
                    bankEffDate: employeeData?.bankEffDate ? dayjs(employeeData?.bankEffDate) : null,
                    cashEffDate: employeeData?.cashEffDate ? dayjs(employeeData?.cashEffDate) : null,
                    pfEffFromDate: employeeData?.pfEffFromDate ? dayjs(employeeData?.pfEffFromDate) : null,
                    esicEffFromDate: employeeData?.esicEffFromDate ? dayjs(employeeData?.esicEffFromDate) : null,
                    probationPeriod: [employeeData?.probFromDate ? dayjs(employeeData?.probFromDate) : null, employeeData?.probToDate ? dayjs(employeeData?.probToDate) : null],
                };
                setFormData(data);
                formRef.setFieldsValue(data);
            }
        } catch (error) {
            message.error('Failed to fetch employee details.');
        }
    };

    const RejoinStateHandel = () => {
        setRejoinStateChange(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <PageContainer
            backIcon
            title={
                <span>
                    <UserAddOutlined style={{ fontSize: "30px" }} /> {isUpdate ? 'Edit Employee' : 'Add Employee'}
                </span>
            }
            extra={
                isUpdate ? <></> :
                    <Space>
                        <Radio.Group onChange={handleNewEmpOrRejoinChange} value={newEmpOrRejoin}>
                            <Radio value={TypeOfJoiningEnum.NEW_EMPLOYEE}>New Employee</Radio>
                            <Radio value={TypeOfJoiningEnum.REJOIN}>Re-join</Radio>
                        </Radio.Group>
                        <Button onClick={() => setSettingsModalOpen(true)} icon={<SettingFilled />} />
                        <Button onClick={() => setEmpConfigModalOpen(true)} icon={<FormOutlined />} />
                        <Button danger onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
            }
        >
            <Spin spinning={loading}>
                <Steps current={currentStep} onChange={handleStepChange} items={steps} />
                <div className="steps-content">
                    <Form layout="vertical" form={formRef}>
                        <Card>
                            {currentStep === 0 && <EmployeeDetailsForm form={formRef} idValidForm={idValidForm} rejoinStateChange={rejoinStateChange} onInputChange={handleInputChange} isUpdateDetailsForm={isUpdate} />}
                            {currentStep === 1 && <EmployeeFamilyDetailsForm form={formRef} isUpdateFamilyDetails={isUpdate} rejoinStateChange={rejoinStateChange} />}
                            {currentStep === 2 && <EmployeeEducationDetailsForm form={formRef} isUpdateEduDetails={isUpdate} rejoinStateChange={rejoinStateChange} />}
                            {currentStep === 3 && <EmployeeExperienceDetailsForm form={formRef} isUpdate={isUpdate} employeeData={employeeData?.employeeExperienceDetails} />}
                            {currentStep === 4 && <EmployeeIdProofsDetailsForm form={formRef} isUpdate={isUpdate} employeeData={employeeData?.employeeIdProofs} />}

                            <div style={{ marginTop: "20px", textAlign: "right" }}>
                                <Space>
                                    {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>}
                                    {currentStep < 4 && <Button type="primary" onClick={handleNext}>Next</Button>}
                                    {/* {(currentStep === 0 || currentStep === 4) && (
                                        <Button type="primary" onClick={handleSubmit}>Submit</Button>
                                    )} */}
                                    {((currentStep === 0 && isUpdate) || currentStep === 4) && (
                                        <Button type="primary" onClick={handleSubmit}>
                                            {currentStep === 0 ? "Submit" : "Submit"}
                                        </Button>
                                    )}
                                </Space>
                            </div>
                        </Card>
                    </Form>
                </div>
            </Spin>

            <Modal
                open={settingsModalOpen}
                footer={null}
                onCancel={() => setSettingsModalOpen(false)}
                width="80%"
            >
                <EmployeeSettings />
            </Modal>
            <EmployeeRejoinModal
                open={rejoinModalOpen}
                onClose={() => setRejoinModalOpen(false)}
                onSelectEmployee={fetchRejoinEmployeeDetails}
                OnRejoinState={RejoinStateHandel}
            />
            <EmployeeFormConfig
                open={empConfigModalOpen}
                onClose={() => setEmpConfigModalOpen(false)}
            // onSelectEmployee={fetchRejoinEmployeeDetails}
            />

            <Modal
                open={ModalOpen}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={() => { fetchEmpDetails(aadharEmpData); setModalOpen(false) }}>Fetch</Button>
                        <Button style={{ margin: 10 }} onClick={() => { setModalOpen(false); formRef.setFieldsValue({ employeeAadhar: null }); }}>Cancel</Button>
                    </div>
                }
                width="50%"
            >
                <Card>
                    <b>Already Employee exists for the given Aadhar Number!</b>
                    <Row style={{ marginTop: 20 }}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Employee Code">{aadharEmpData?.employeeCode}</Descriptions.Item>
                            <Descriptions.Item label="Employee Type">{aadharEmpData?.employeeType}</Descriptions.Item>
                            <Descriptions.Item label="Employee Name">{aadharEmpData?.firstName}</Descriptions.Item>
                            <Descriptions.Item label="Employee Branch">{aadharEmpData?.branch}</Descriptions.Item>
                            <Descriptions.Item label="Employee Department">{aadharEmpData?.department}</Descriptions.Item>
                            <Descriptions.Item label="Employee Division">{aadharEmpData?.division}</Descriptions.Item>
                            <Descriptions.Item label="Employee Designation">{aadharEmpData?.designation}</Descriptions.Item>
                        </Descriptions>
                    </Row>
                    <br />
                    <b>Do you want to fetch Employee Details? Click Ok</b>
                </Card>
            </Modal>

            {!isUpdate && (
                <Modal
                    open={openModal}
                    footer={null}
                    width='600px'
                    onCancel={() => setOpenModal(false)}
                >
                    <EmpPayrollForm record={employeeRecords} onCloseModal={handleCloseModal} />
                </Modal>
            )}

        </PageContainer>

    );
};

export default EmployeeForm;
