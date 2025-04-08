import { AccomdationEnum, ApplyLeaveBrachDto, BloodGroups, DepartmentReq, DesignationsReq, EmployeeReferenceEnum, EmployeeStatus, GenderDisplayLabels, GenderEnum, PaymodeEnum, YesNoEnum } from '@hrexpert/shared-models'
import { ApplForLeavesSharedService, BranchesService, CommonUtitlityService, DepartmentService, DesignationsService, DivisionService, EmployeeOnboardingService, EmployeeTypeService, IdProofService, LeaveTypeService, ShiftService, TeamCalenderService } from '@hrexpert/shared-services'
import { Card, Checkbox, Col, DatePicker, Form, FormInstance, Input, InputNumber, message, Modal, notification, Radio, Row, Select, Space } from 'antd'
import dayjs from 'dayjs'
import { Moment } from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIAMClientState } from '../../../common/iam-client-react'

export interface EmployeeDetailsFormProps {
    form: FormInstance<any>
    idValidForm: FormInstance<any>
}
export default function RecruitmentEmpDetailsForm(props: EmployeeDetailsFormProps) {
    const { form } = props
    const [designations, setDesignations] = useState<{ label: string, value: any, code: string }[]>([])
    const [departments, setDepartments] = useState<{ label: string, value: any, code: string }[]>([])
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [prefixConfigData, setPrefixConfigData] = useState<any>()
    const [branches, setBranches] = useState<any>([])
    const [divisions, setDivisions] = useState<any>([])
    const [shiftGroup, setShiftGroup] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [formConfigData, setFormConfigData] = useState<any>([])
    const designationsService = new DesignationsService()
    const departmentsService = new DepartmentService()
    const employeeTypesService = new EmployeeTypeService()
    const employeeOnboardingService = new EmployeeOnboardingService()
    const divisionsService = new DivisionService()
    const branchesService = new BranchesService()
    const shiftGroupService = new TeamCalenderService()
    const pincodesService = new CommonUtitlityService()
    const [selectedEmployee, setSelectedEmployee] = useState<any>([]);
    const [shiftsData, setShiftsData] = useState<any[]>([]);
    const service = new EmployeeOnboardingService();
    const { IAMClientAuthContext } = useIAMClientState();
    const role = IAMClientAuthContext.user.roles;
    const services = new ApplForLeavesSharedService()
    const shiftServices = new ShiftService()
    const [reffEmp, setReffEmp] = useState<string>()
    const [reffMob, setReffMob] = useState<string>("")
    const [shiftsDropDown, setShiftsDropDown] = useState<any[]>([]);
    const [currLocalities, setCurrLocalities] = useState([]);
    const [perLocalities, setPerLocalities] = useState([]);
    const [selectedPaymode, setSelectedPaymode] = useState(PaymodeEnum.BANK);
    const [selectedAttendanceAllowance, setSelectedAttendanceAllowance] = useState(YesNoEnum.NO);
    const [selectedTravellingAllowance, setSelectedTravellingAllowance] = useState(YesNoEnum.NO);
    const [currLocalityInput, setCurrLocalityInput] = useState<boolean>(false)
    const [perLocalityInput, setPerLocalityInput] = useState<boolean>(false)
    const { Option } = Select
    const navigate = useNavigate()
    const [idProofs, setIdProofs] = useState([])
    const [idProofName, setIdProofsName] = useState<number>()
    const idProofService = new IdProofService()
    const [isPfEligibleData, setIsPfEligibleData] = useState(null);
    const [isEsicEligibleData, setIsEsicEligibleData] = useState(null);
    const [isEsicEligibleDisabled, setIsEsicEligibleDisabled] = useState(false);
    const [prevPfEffDate, setPrevPfEffDate] = useState(null);
    const [prevEsicEffDate, setPrevEsicEffDate] = useState(null);
    const [isIndiaSelected, setIsIndiaSelected] = useState(false);
    const [leaveGroup, setLeaveGroup] = useState([])
    const leaveGroupsService = new LeaveTypeService()

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setIsIndiaSelected(country === 'India');
    };
    useEffect(() => {
        setIsIndiaSelected(form.getFieldValue('currentCountry') === 'India');
    }, [form.getFieldValue('currentCountry')])

    useEffect(() => {
        // if (props.isUpdateDetailsForm) {
        if (isPfEligibleData === "No") {
            setPrevPfEffDate(form.getFieldValue("pfEffFromDate"))
            form.setFieldsValue({ pfEffFromDate: dayjs() });
        } else if (isPfEligibleData === "Yes" && prevPfEffDate) {
            form.setFieldsValue({ pfEffFromDate: prevPfEffDate })
        }

        if (isEsicEligibleData === "No") {
            setPrevEsicEffDate(form.getFieldValue("esicEffFromDate"))
            form.setFieldsValue({ esicEffFromDate: dayjs() });
        } else if (isEsicEligibleData === "Yes" && prevEsicEffDate) {
            form.setFieldsValue({ esicEffFromDate: prevEsicEffDate })
        }
        // }
    }, [isPfEligibleData, isEsicEligibleData, form]);

    useEffect(() => {
        const employeeTypeId = form.getFieldValue('employeeTypeId');
        if (employeeTypeId) {
            getConfiguration(employeeTypeId);
        }
        getPinCodeData()
    }, [form.getFieldValue('employeeTypeId')]);

    useEffect(() => {
        const attendanceAllowance = form.getFieldValue('attendanceAllowance');
        if (attendanceAllowance) {
            setSelectedAttendanceAllowance(attendanceAllowance)
        }
    }, [form.getFieldValue('attendanceAllowance')]);

    useEffect(() => {
        const travellingAllowance = form.getFieldValue('travellingAllowance');
        if (travellingAllowance) {
            setSelectedTravellingAllowance(travellingAllowance)
        }
    }, [form.getFieldValue('travellingAllowance')]);

    useEffect(() => {
        const employeeReferance = form.getFieldValue('employeeReferance');
        const referanceEmployeeName = form.getFieldValue('referanceEmployeeName');
        if (employeeReferance) {
            setReffEmp(employeeReferance)
        }
        if (referanceEmployeeName === 'Others') {
            setReffEmp(referanceEmployeeName)
        }
    }, [form.getFieldValue('employeeReferance')]);

    useEffect(() => {
        getDesignations()
        getDepartments()
        getEmployeeTypes()
        getBranches()
        getDivisions()
        getShiftGroups()
        getActiveEmployeesById()
        getActiveShifts()
        getIdProofs()
        getActiveLeaveGroups()
    }, [])

    const getActiveEmployeesById = () => {
        try {
            const req = new ApplyLeaveBrachDto();
            const formValues = form.getFieldsValue();

            // Check user role
            if (IAMClientAuthContext.user?.roles === "SuperAdmin") {
                req.branchId = null; // Fetch all employees
            } else {
                req.branchId = IAMClientAuthContext.user?.unitId || null; // Fetch employees by unit
            }

            services.getActiveEmployeesByIds(req).then((res) => {
                if (res.status) {
                    setSelectedEmployee(res.data.data);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getActiveLeaveGroups = () => {
        try {
            leaveGroupsService.getAllActiveLeaveGroup().then((res) => {
                if (res.status) {
                    setLeaveGroup(res.data);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getActiveShifts = () => {
        try {
            shiftServices.getActiveShifts().then((res) => {
                if (res.status) {
                    setShiftsData(res.data)
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    // const handleOnchangeShift = (value) => {
    //     const data = shiftsData.filter(item => item.branchName == value)
    //     // form.setFieldsValue({ shift: data.shiftType ? data.shiftType : "-" })
    //     setShiftsDropDown(data)
    // }

    function autoConfigureEmployeeCode(data?: any) {
        if (!data || data.length === 0) return
        const prefixDdata = data.length ? data[0] : prefixConfigData[0]
        const selectedFields = prefixDdata.selectedFields.split(','); // Assuming selectedFields is a comma-separated string
        const fieldPositions = prefixDdata.fieldPositions;
        const departmentId = form.getFieldValue("departmentId")  // Default if no value is found
        const designationId = form.getFieldValue("designationId")
        const branchId = form.getFieldValue("branchId")
        console.log(branchId, departmentId, 'iiiiiii')
        const fieldValuesMap = {
            branch: branchId ? branches.find(d => d.id === branchId).branchCode : "BR",
            department: departmentId ? departments.find(d => d.value === departmentId).code : "DES",
            designation: designationId ? designations.find(d => d.value === designationId).code : "DES",
            //year: new Date().getFullYear().toString(), // Current year
            customField: prefixDdata.customFieldText
        };
        const sortedFields = Object.keys(fieldPositions)
            .sort((a, b) => fieldPositions[a] - fieldPositions[b])
            .map((field) => fieldValuesMap[field] || '');

        // Generate the employee code
        // const employeeCode = sortedFields.join('').toUpperCase() + "-" + prefixDdata.autogeneratedId; // Add default suffix
        const employeeCode = sortedFields.join('').toUpperCase() + prefixDdata.autogeneratedId; // Add default suffix

        // Set the employee code in the form
        form.setFieldsValue({ employeeCode });
    }

    const getEmployeePrefixConfig = (value) => {
        const employeeTypeId = value
        employeeOnboardingService.getPrefixConfigForEmpType(employeeTypeId).then((res) => {
            if (res.status) {
                setPrefixConfigData(res.data)
                autoConfigureEmployeeCode(res.data)
            } else {
                Modal.info({
                    title: 'Employee prefix configuration not found',
                    content: (
                        <>
                            <div>
                                Click below to set up prefix configuration
                            </div>

                        </>
                    ),
                    onOk: () => navigate("/employee-form-settings"),
                    onCancel: () => setIsModalVisible(false),
                    onClose: () => setIsModalVisible(false),
                    okText: "Setup",
                    cancelText: "Do it later",
                    closable: true
                    // footer:false

                })

            }
        })
    }

    const getShiftGroups = () => {
        shiftGroupService.getAllTeamCalender().then((v) => {
            if (v.status) {
                setShiftGroup(v.data)
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const getBranches = () => {
        branchesService.getActiveBranches().then((res) => {
            if (res.status) {
                setBranches(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const getDivisions = () => {
        divisionsService.getAllActiveDivisions().then((res) => {
            if (res.status) {
                setDivisions(res.data)
            }
        })
    }
    const getDesignations = () => {
        designationsService.getActiveDesignations().then((res) => {
            if (res.status) {
                setDesignations(res.data && res.data.length && res.data.map((v: DesignationsReq) => { return { label: v.name, value: v.id, code: v.designationCode } }))
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const getDepartments = () => {
        departmentsService.getAllDepartments().then((res) => {
            if (res.status) {
                setDepartments(res.data && res.data.length && res.data.map((v: DepartmentReq) => { return { label: v.name, value: v.id, code: v.code } }))
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // const getPinCodeData = () => {
    //     const pincode = form.getFieldValue("currentPincode")
    //     if (pincode?.length === 6) {
    //         pincodesService.getAddressForPincode(pincode).then((res) => {
    //             if (res && res[0].Status === "Error") {
    //                 message.info("Pincode is not valid")
    //                 form.resetFields(['currentPincode'])
    //             } else {
    //                 const pincodedata = res[0].PostOffice
    //                 form.setFieldsValue({
    //                     currentDistrict: pincodedata[0].District,
    //                     currentState: pincodedata[0].State,
    //                     currentCountry: pincodedata[0].Country
    //                 })
    //                 setCurrLocalityInput(false)
    //                 setCurrLocalities(pincodedata);
    //             }
    //         })
    //     }
    // }

    const getPinCodeData = () => {
        const pincode = form.getFieldValue("currentPincode");
        if (pincode?.length === 5) {
            setCurrLocalityInput(true);
            setCurrLocalities([]);
            form.setFieldsValue({ currentVillage: '' });
        } else if (pincode?.length === 6) {
            pincodesService.getAddressForPincode(pincode).then((res) => {
                if (res && res[0].Status === "Error") {
                    message.info("Pincode is not valid");
                    form.resetFields(['currentPincode']);
                } else {
                    const pincodedata = res[0].PostOffice;
                    form.setFieldsValue({
                        currentDistrict: pincodedata[0].District,
                        currentState: pincodedata[0].State,
                        currentCountry: pincodedata[0].Country
                    });
                    setCurrLocalityInput(false);
                    setCurrLocalities(pincodedata);
                }
            });
        }
    };

    const getPinCodeData2 = () => {
        const pincode = form.getFieldValue("permanentPincode");
        if (pincode?.length === 5) {
            setPerLocalityInput(true);
            setPerLocalities([]);
            form.setFieldsValue({ permanentVillage: '' });
        } else if (pincode?.length === 6) {
            pincodesService.getAddressForPincode(pincode).then((res) => {
                if (res && res[0].Status === "Error") {
                    message.info("Pincode is not valid");
                    form.resetFields(['permanentPincode']);
                } else {
                    const pincodedata = res[0].PostOffice;
                    form.setFieldsValue({
                        permanentDistrict: pincodedata[0].District,
                        permanentState: pincodedata[0].State,
                        permanentCountry: pincodedata[0].Country
                    });
                    setPerLocalityInput(false);
                    setPerLocalities(pincodedata);
                }
            });
        }
    };

    // const getPinCodeData2 = () => {
    //     const pincode = form.getFieldValue("permanentPincode")
    //     if (pincode.length === 6) {
    //         pincodesService.getAddressForPincode(pincode).then((res) => {
    //             if (res && res[0].Status === "Error") {
    //                 message.info("Pincode is not valid")
    //                 form.resetFields(['permanentPincode'])
    //             } else {
    //                 const pincodedata = res[0].PostOffice
    //                 form.setFieldsValue({
    //                     permanentDistrict: pincodedata[0].District,
    //                     permanentState: pincodedata[0].State,
    //                     permanentCountry: pincodedata[0].Country
    //                 })
    //                 setPerLocalityInput(false)
    //                 setPerLocalities(pincodedata);
    //             }

    //         })
    //     }
    // }

    const onDepartmentsSubmit = () => {
        getDepartments()
    }

    const getEmployeeTypes = () => {

        employeeTypesService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeTypes(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function openModal() {
        setIsModalVisible(true)
    }

    function setCurrentAsPermanent(e) {
        if (e.target.checked) {
            const formValues = form.getFieldsValue()
            form.setFieldsValue({
                permanentAddress: formValues.currentAddress,
                permanentPincode: formValues.currentPincode,
                permanentDistrict: formValues.currentDistrict,
                permanentState: formValues.currentState,
                permanentCountry: formValues.currentCountry,
                permanentVillage: formValues.currentVillage
            })
        } else {
            form.setFieldsValue({
                permanentAddress: '',
                permanentPincode: '',
                permanentDistrict: '',
                permanentState: '',
                permanentCountry: '',
                permanentVillage: '',
            });
        }
    }

    const handleDateOfBirthChange = (date: Moment | null) => {
        if (!date) return; // Exit if no date is selected

        const currentYear = new Date().getFullYear();
        const dobYear = date.year();
        const age = currentYear - dobYear;

        // If employee is under 18, reset employeeCode to null
        if (age < 18) {
            notification.warning({
                message: 'Underage Employee',
                description: 'Employee is under 18. Status set to approval, and employee code has been reset.',
                placement: 'top'
            });
            form.setFieldsValue({ employeeStatus: EmployeeStatus.LessAgeLimit });
            form.setFieldsValue({ employeeCode: null }); // Reset employeeCode if under 18

        } else {
            form.setFieldsValue({ employeeStatus: EmployeeStatus.OnRollEmployee });
            //autoConfigureEmployeeCode(prefixConfigData); // Generate employeeCode for 18+
            notification.success({
                message: 'Employee Age Verified',
                description: 'Employee is 18 or older. Status set to working, and employee code has been generated.',
                placement: 'top'
            });

        }
    };

    const getConfiguration = async (value) => {
        try {
            setLoading(true);
            const res = await employeeOnboardingService.getConfigurations({ employeeType: value });
            if (res.status) {
                setFormConfigData(res.data)
                //message.success(res.internalMessage);
            } else {
                message.error(res.internalMessage);
            }
        } catch (error) {
            message.error("Failed to fetch configurations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchBankDetails = async (e) => {
        const code = e.target.value;
        const isBankIfscCodeData = form.getFieldValue("bankIfscCode");
        if (isBankIfscCodeData.length === 11) {
            const url = `https://ifsc.razorpay.com/${code}`;
            try {
                const response = await fetch(url);
                const data = await response.json()
                if (data.BANK) {
                    form.setFieldValue("bankName", data.BANK);
                    form.setFieldValue("bankBranch", data.BRANCH);
                } else {
                    form.setFieldValue("bankName", "");
                    form.setFieldValue("bankBranch", "");
                    message.warning("Bank Name Not Found");
                }
            } catch (err) {
                console.error(err, "Error fetching bank details");
            }
        } else {
            form.setFieldValue("bankName", "");
            form.setFieldValue("bankBranch", "");
        }
    };

    const handleLocality = (val, name) => {
        if (name === 'cur' && val === 'Others') {
            setCurrLocalityInput(true)
            form.setFieldValue("currentVillage", null);
        } else if (name === 'per' && val === 'Others') {
            setPerLocalityInput(true)
            form.setFieldValue("permanentVillage", null);
        }
    }

    const getIdProofs = () => {
        idProofService.getActiveIdProofs().then((idProofs) => {
            if (idProofs.status) {
                setIdProofs(idProofs.data)
            }
        })
    }

    const validateIDNumber = (_, value) => {
        const id = idProofs.find((rec) => rec.id === idProofName);
        if (id && id.regex) {
            const regex = new RegExp(id.regex.slice(1, -1))
            if (value && !regex.test(value)) {
                return Promise.reject(`Please Enter Valid ${id.name} Number`);
            }
        }
        return Promise.resolve();
    };



    const handleEmpCodeDuplicate = async (value: string) => {
        if (value) {
            const res = await service.handleEmpCodeDuplicate({ employeeCode: value })
            if (res.status) {
                message.error(res.internalMessage)
                form.setFieldsValue({ employeeCode: null })
                form.setFields([{ name: 'employeeCode', errors: ['Please fill employee code or generate'] },])
            }
        }
    };

    const handleProbationPeriodChange = () => {
        const dateOfJoining = form.getFieldValue("dateOfJoining");
        const months = form.getFieldValue('probationPeriodMonths');
        const days = form.getFieldValue('probationPeriodDays');
        if (months === null && days === null) {
            form.setFieldsValue({ probationPeriod: [] });
        }
        if (dateOfJoining && (months || days)) {
            const startDate = dayjs(dateOfJoining);
            const endDate = startDate.add(months, "month").add(days, "day");
            form.setFieldsValue({ probationPeriod: [startDate, endDate] });
        }
    };

    // const formValuesData = form.getFieldsValue();
    // const isIndiaSelected = formValuesData.currentCountry === 'India';

    useEffect(() => {
        form.setFieldsValue({ isEsicEligible: isEsicEligibleDisabled ? 'No' : undefined });
    }, [isEsicEligibleDisabled, form]);

    const handleSalaryChange = (e) => {
        const salary = parseInt(e.target.value, 10);
        if (salary > 21000) {
            setIsEsicEligibleDisabled(true);
            form.setFieldsValue({ isEsicEligible: 'No' });
        } else {
            setIsEsicEligibleDisabled(false);
        }
    };

    const handleEmployeeReferenceChange = (value) => {
        setReffEmp(value);
        form.resetFields(['referanceMobileNumber', 'referanceEmployeeName']);
    };

    return (
        <>

            <Row gutter={[24, 24]}>

                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                pattern: /^[A-Za-z\s]*$/,
                                message: `First Name is Required`,
                            },
                        ]}
                    >
                        <Input
                            placeholder={`Enter First Name`}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                                form.setFieldsValue({
                                    firstName: value.toUpperCase(),
                                });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Last name'} name='lastName'
                        rules={[
                            { required: true, pattern: /^[A-Za-z\s]*$/, message: "Last name is Required" },
                        ]}>
                        <Input placeholder='Enter Last Name'
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                form.setFieldsValue({
                                    lastName: value.toUpperCase(),
                                });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Date of birth'} name='dateOfBirth'
                        rules={[
                            { required: true, message: "Date of birth is required" },
                        ]}>
                        <DatePicker style={{ width: "100%" }} format={'DD/MM/YYYY'} onChange={handleDateOfBirthChange} />
                    </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Gender'} name='gender' initialValue={GenderEnum.M}
                        rules={[
                            { required: true, message: "Gender is required" },
                        ]}>
                        <Radio.Group
                            block
                            options={Object.keys(GenderEnum).map((key) => { return { value: key, label: GenderDisplayLabels[key], } })}
                            defaultValue={GenderEnum.M}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Designation'} name='designationId'
                        rules={[
                            { required: true, message: "Please select designation" },
                        ]}>
                        <Select
                            disabled
                            allowClear
                            showSearch
                            placeholder="Select  Designation"
                            options={designations}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />

                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item
                        label={'Mobile Number'}
                        name='mobileNo'
                        rules={[
                            { required: true, message: 'Please enter your mobile number' },
                            { pattern: /^\d{10}$/, message: 'Mobile number must be exactly 10 digits' },
                        ]}
                    >
                        <Input
                            placeholder='Enter 10 digit mobile number'
                            maxLength={10}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Email'} name='emailId'
                        rules={[
                            { required: true, message: 'Please enter your email address' },
                            { type: 'email', message: 'Please enter a valid email address' },
                        ]}>
                        <Input type='email' placeholder='abc@def.com' />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label="Marital Status" name="maritualStatus" initialValue="Single">
                        <Radio.Group buttonStyle="solid" style={{ width: "100%" }}>
                            <Radio.Button value="Single" style={{ width: "50%", textAlign: "center" }}>
                                Single
                            </Radio.Button>
                            <Radio.Button value="Married" style={{ width: "50%", textAlign: "center" }}>
                                Married
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Emergency Contact No'} name='emergencyContactNo'
                        rules={[
                            { message: 'Please enter your mobile number' },
                            { pattern: /^\d{10}$/, message: 'Mobile number must be exactly 10 digits' },
                        ]}
                    >
                        <Input placeholder='Enter Emergency Contact No'
                            maxLength={10}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Form.Item label={'Blood Group'} name='bloodGroup'>
                        <Select
                            placeholder={'Select Blood Group'}
                            onChange={() => { }}
                        >
                            {
                                Object.keys(BloodGroups).map((v: any) => { return <Option key={v} value={v}>{v}</Option> })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={124} md={24} lg={12} xl={12}>
                    <Card title="Current Address">
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item label={'Address'} name='currentAddress'>
                                    <Input.TextArea placeholder="Enter Current Address" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item label={'Pincode'} name='currentPincode' rules={[
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Pincode must be a number',
                                    },
                                ]}>
                                    <Input onChange={getPinCodeData} placeholder='Enter Current Pincode'
                                        maxLength={6}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'Locality'} name="currentVillage">
                                    {!currLocalityInput ? (
                                        <Select
                                            placeholder="Select Locality"
                                            filterOption
                                            allowClear
                                            showSearch
                                            onChange={(val) => handleLocality(val, 'cur')}
                                        >
                                            {currLocalities.map((locality) => (
                                                <Select.Option
                                                    key={locality.Name}
                                                    value={locality.Name + '-' + locality.Block}
                                                >
                                                    {locality.Name + ' - ' + locality.Block}
                                                </Select.Option>
                                            ))}
                                            <Select.Option key="others" value="Others">
                                                Others
                                            </Select.Option>
                                        </Select>
                                    ) : (
                                        <Input
                                            placeholder='Enter Locality'
                                            allowClear
                                            onChange={(e) => {
                                                if (e.target.value === '') {
                                                    setCurrLocalityInput(false);
                                                }
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'District'} name='currentDistrict'>
                                    <Input placeholder='Enter Current District' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'State'} name='currentState'>
                                    <Input placeholder='Enter Current State' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'Country'} name='currentCountry'>
                                    <Input placeholder='Enter Current Country' onChange={handleCountryChange} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} sm={124} md={24} lg={12} xl={12}>
                    <Card title="Permanent Address" extra={<Space><Checkbox onChange={setCurrentAsPermanent}>Same as Current Address</Checkbox></Space>}>
                        <Row gutter={24}>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item label={'Address'} name='permanentAddress'>
                                    <Input.TextArea placeholder="Enter Permanent Address" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item label={'Pincode'} name='permanentPincode' rules={[
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Pincode must be a number',
                                    },
                                ]}>
                                    <Input onChange={getPinCodeData2} placeholder='Enter Permanent Pincode'
                                        maxLength={6}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'Locality'} name="permanentVillage">
                                    {!perLocalityInput ? (
                                        <Select
                                            placeholder="Select Locality"
                                            filterOption
                                            allowClear
                                            showSearch
                                            onChange={(val) => handleLocality(val, 'cur')}
                                        >
                                            {currLocalities.map((locality) => (
                                                <Select.Option
                                                    key={locality.Name}
                                                    value={locality.Name + '-' + locality.Block}
                                                >
                                                    {locality.Name + ' - ' + locality.Block}
                                                </Select.Option>
                                            ))}
                                            <Select.Option key="others" value="Others">
                                                Others
                                            </Select.Option>
                                        </Select>
                                    ) : (
                                        <Input
                                            placeholder='Enter Locality'
                                            allowClear
                                            onChange={(e) => {
                                                if (e.target.value === '') {
                                                    setPerLocalityInput(false);
                                                }
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'District'} name='permanentDistrict'>
                                    <Input placeholder='Enter Permanent District' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'State'} name='permanentState'>
                                    <Input placeholder='Enter Permanent State' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Form.Item label={'Country'} name='permanentCountry'>
                                    <Input placeholder='Enter Permanent Country' />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ paddingTop: '20px' }}>
                <Col xs={24} sm={124} md={24} lg={12} xl={24}>
                    <Card title='Salary Pay Mode' extra={<Space>
                        {/* <Form.Item layout='horizontal' label={'Pay Mode'} name='payMode' initialValue={PaymodeEnum.BANK}>
                            <Radio.Group
                                block
                                options={Object.values(PaymodeEnum).map((key) => { return { value: key, label: key, } })}
                                defaultValue={PaymodeEnum.BANK}
                                onChange={(e) => setSelectedPaymode(e.target.value)}
                            />
                        </Form.Item> */}
                    </Space>}>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                <Form.Item label={'Bank Ac No'} name='bankAcNo'
                                    rules={[
                                        { required: selectedPaymode === PaymodeEnum.BANK ? true : false, message: 'ESIC Number is required' },
                                        { pattern: /^[0-9]+$/, message: 'Bank Account Number must only contain numbers' },
                                        { max: 16, message: 'Bank Account Number must be a maximum of 16 digits' },
                                        { min: 10, message: 'Bank Account Number must be at least 10 digits' }
                                    ]}
                                >
                                    <Input placeholder='Enter Bank Ac No'
                                        disabled={selectedPaymode === PaymodeEnum.CASH}
                                        maxLength={16}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^0-9]/g, '');
                                            form.setFieldsValue({
                                                bankAcNo: value,
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                <Form.Item
                                    label="Bank IFSC Code"
                                    name="bankIfscCode"
                                    rules={[{ required: selectedPaymode === PaymodeEnum.BANK ? true : false, message: 'ESIC Number is required' }, { pattern: /[A-Za-z]{4}0\d{6}/, message: 'Please enter a valid Bank IFSC Code' }]}
                                >
                                    <Input
                                        disabled={selectedPaymode === PaymodeEnum.CASH}
                                        placeholder="Enter Bank IFSC Code"
                                        maxLength={11}
                                        onChange={fetchBankDetails}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                <Form.Item
                                    label="Bank Name"
                                    name="bankName"
                                    rules={[{ required: selectedPaymode === PaymodeEnum.BANK ? true : false, message: 'ESIC Number is required' },]}
                                >
                                    <Input
                                        disabled={selectedPaymode === PaymodeEnum.CASH}
                                        placeholder="Bank Name"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                <Form.Item
                                    label="Bank Branch"
                                    name="bankBranch"
                                    rules={[{ required: selectedPaymode === PaymodeEnum.BANK ? false : false, message: 'ESIC Number is required' },]}
                                >
                                    <Input
                                        disabled={selectedPaymode === PaymodeEnum.CASH}
                                        placeholder="Bank Branch"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row gutter={24}>
            </Row>

        </>
    )
}
