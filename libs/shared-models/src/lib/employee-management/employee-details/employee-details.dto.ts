import { AccomdationEnum, BloodGroups, EmployeeReferenceEnum, EmployeeStatus, GenderEnum, PaymodeEnum, SalutationEnum, TypeOfJoiningEnum, YesNoEnum } from "../../enums";
import { EmployeeEduDetailsDto } from "./employee-education.dto";
import { EmployeeExperienceDetailsDto } from "./employee-experience.dto";
import { EmployeeFamilyDetailsDto } from "./employee-family-details.dto";
import { EmployeeIdProofsDto } from "./employee-idproof.dto";

export class EmployeeDetailsDto {
    id?: number;
    salutation?: SalutationEnum;
    empImage?: string;
    aadhaarNo?: string;
    firstName?: string;
    lastName?: string;
    employeeCode?: string
    dateOfBirth?: Date;
    gender?: GenderEnum;
    departmentId?: number;
    designationId?: number;
    branchId?: any;
    divisionId?: number;
    empGrade?: string;
    dateOfJoining?: Date;
    mobileNo?: string;
    emailId?: string;
    qualification?: string;
    currentAddress?: string;
    currentState?: string;
    currentVillage?: string
    currentPincode?: string;
    currentDistrict?: string;
    currentCountry?: string;
    permanentAddress?: string;
    permanentState?: string;
    permanentVillage?: string;
    permanentPincode?: string;
    permanentDistrict?: string;
    permanentCountry?: string;
    salary?: number;
    messAllowance?: number;
    payMode?: PaymodeEnum
    pfNo?: string;
    esicNo?: string;
    isPfEligible?: string;
    isEsicEligible?: string;
    bankName?: string;
    bankBranch?: string;
    bankAcNo?: string;
    bankIfscCode?: string;
    accommodation?: string;
    transportation?: string;
    nominee?: string;
    dateOfReliving?: Date;
    reasonOfReliving?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdUser?: string;
    updatedUser?: string;
    shift?: any;
    bloodGroup?: BloodGroups;
    maritualStatus?: string;
    emergencyContactNo?: string;
    filePath?: string;
    fileName?: string;
    originalName?: string;
    employeeFamilyDetails?: EmployeeFamilyDetailsDto[];
    employeeEduDetails?: EmployeeEduDetailsDto[];
    employeeExperienceDetails?: EmployeeExperienceDetailsDto[];
    employeeIdProofs?: EmployeeIdProofsDto[];
    employeeTypeId?: number
    travellingAllowance?: string;
    timeRestrictions?: YesNoEnum;
    attendanceAllowance?: string;
    accomdation?: AccomdationEnum;
    employeeStatus?: EmployeeStatus;
    page?: number;
    pageSize?: number;
    isExcel?: boolean;
    search?: string;
    searchEmpCode?: string;
    reportingManager?: number
    joiningStatus?: TypeOfJoiningEnum
    employeeReferance?: EmployeeReferenceEnum
    referanceEmployeeName?: number
    referanceMobileNumber?: string
    referanceName?: string
    employeeRemarks?: string
    role?: string
    oldEmployeeCode?: object;
    maxAbsentDays?: string;
    incentiveDays?: string;
    bankEffDate?: string;
    cashEffDate?: string;
    pfEffFromDate?: string;
    esicEffFromDate?: string;
    tripCost?: number;
    uan?: string;
    probationPeriod?: string;
    probFromDate?: string;
    probToDate?: string;
    probationPeriodMonths?: number;
    probationPeriodDays?: number;
    dateOfRejoining?: string;
    wcf?: string;
    nssf?: string;
    leaveGroup?: number


    constructor(
        id?: number,
        salutation?: SalutationEnum,
        empImage?: string,
        aadhaarNo?: string,
        firstName?: string,
        lastName?: string,
        employeeCode?: string,
        dateOfBirth?: Date,
        gender?: GenderEnum,
        departmentId?: number,
        designationId?: number,
        branchId?: any,
        divisionId?: number,
        empGrade?: string,
        dateOfJoining?: Date,
        mobileNo?: string,
        emailId?: string,
        qualification?: string,
        currentAddress?: string,
        currentState?: string,
        currentVillage?: string,
        currentPincode?: string,
        currentDistrict?: string,
        currentCountry?: string,
        permanentAddress?: string,
        permanentState?: string,
        permanentVillage?: string,
        permanentPincode?: string,
        permanentDistrict?: string,
        permanentCountry?: string,
        salary?: number,
        messAllowance?: number,
        payMode?: PaymodeEnum,
        pfNo?: string,
        esicNo?: string,
        isPfEligible?: string,
        isEsicEligible?: string,
        bankName?: string,
        bankBranch?: string,
        bankAcNo?: string,
        bankIfscCode?: string,
        accommodation?: string,
        transportation?: string,
        nominee?: string,
        dateOfReliving?: Date,
        reasonOfReliving?: string,
        isActive?: boolean,
        createdAt?: Date,
        updatedAt?: Date,
        createdUser?: string,
        updatedUser?: string,
        shift?: any,
        bloodGroup?: BloodGroups,
        maritualStatus?: string,
        emergencyContactNo?: string,
        filePath?: string,
        fileName?: string,
        originalName?: string,
        employeeFamilyDetails?: EmployeeFamilyDetailsDto[],
        employeeEduDetails?: EmployeeEduDetailsDto[],
        employeeExperienceDetails?: EmployeeExperienceDetailsDto[],
        employeeIdProofs?: EmployeeIdProofsDto[],
        employeeTypeId?: number,
        travellingAllowance?: string,
        timeRestrictions?: YesNoEnum,
        attendanceAllowance?: string,
        accomdation?: AccomdationEnum,
        employeeStatus?: EmployeeStatus,
        page?: number,
        pageSize?: number,
        isExcel?: boolean,
        search?: string,
        searchEmpCode?: string,
        reportingManager?: number,
        joiningStatus?: TypeOfJoiningEnum,
        employeeReferance?: EmployeeReferenceEnum,
        referanceEmployeeName?: number,
        referanceMobileNumber?: string,
        referanceName?: string,
        employeeRemarks?: string,
        role?: string,
        oldEmployeeCode?: object,
        maxAbsentDays?: string,
        incentiveDays?: string,
        bankEffDate?: string,
        cashEffDate?: string,
        pfEffFromDate?: string,
        esicEffFromDate?: string,
        tripCost?: number,
        uan?: string,
        probationPeriod?: string,
        probFromDate?: string,
        probToDate?: string,
        probationPeriodMonths?: number,
        probationPeriodDays?: number,
        dateOfRejoining?: string,
        wcf?: string,
        nssf?: string,
        leaveGroup?: number
    ) {

        this.id = id
        this.salutation = salutation
        this.empImage = empImage
        this.aadhaarNo = aadhaarNo
        this.firstName = firstName
        this.lastName = lastName
        this.employeeCode = employeeCode
        this.dateOfBirth = dateOfBirth
        this.gender = gender
        this.departmentId = departmentId
        this.designationId = designationId
        this.branchId = branchId
        this.divisionId = divisionId
        this.empGrade = empGrade
        this.dateOfJoining = dateOfJoining
        this.mobileNo = mobileNo
        this.emailId = emailId
        this.qualification = qualification
        this.currentAddress = currentAddress
        this.currentState = currentState
        this.currentVillage = currentVillage
        this.currentPincode = currentPincode
        this.currentDistrict = currentDistrict
        this.currentCountry = currentCountry
        this.permanentAddress = permanentAddress
        this.permanentState = permanentState
        this.permanentVillage = permanentVillage
        this.permanentPincode = permanentPincode
        this.permanentDistrict = permanentDistrict
        this.permanentCountry = permanentCountry
        this.salary = salary
        this.messAllowance = messAllowance
        this.payMode = payMode
        this.pfNo = pfNo
        this.esicNo = esicNo
        this.isPfEligible = isPfEligible
        this.isEsicEligible = isEsicEligible
        this.bankName = bankName
        this.bankBranch = bankBranch
        this.bankAcNo = bankAcNo
        this.bankIfscCode = bankIfscCode
        this.accommodation = accommodation
        this.transportation = transportation
        this.nominee = nominee
        this.dateOfReliving = dateOfReliving
        this.reasonOfReliving = reasonOfReliving
        this.isActive = isActive
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.createdUser = createdUser
        this.updatedUser = updatedUser
        this.shift = shift
        this.bloodGroup = bloodGroup
        this.maritualStatus = maritualStatus
        this.emergencyContactNo = emergencyContactNo
        this.filePath = filePath
        this.fileName = fileName
        this.originalName = originalName
        this.employeeFamilyDetails = employeeFamilyDetails
        this.employeeEduDetails = employeeEduDetails
        this.employeeExperienceDetails = employeeExperienceDetails
        this.employeeIdProofs = employeeIdProofs
        this.employeeTypeId = employeeTypeId
        this.travellingAllowance = travellingAllowance
        this.timeRestrictions = timeRestrictions
        this.attendanceAllowance = attendanceAllowance
        this.accomdation = accomdation
        this.employeeStatus = employeeStatus
        this.employeeStatus = employeeStatus
        this.page = page
        this.pageSize = pageSize
        this.isExcel = isExcel
        this.search = search
        this.searchEmpCode = searchEmpCode
        this.reportingManager = reportingManager
        this.joiningStatus = joiningStatus
        this.employeeReferance = employeeReferance
        this.referanceEmployeeName = referanceEmployeeName
        this.referanceMobileNumber = referanceMobileNumber
        this.referanceName = referanceName
        this.employeeRemarks = employeeRemarks
        this.role = role
        this.oldEmployeeCode = oldEmployeeCode
        this.maxAbsentDays = maxAbsentDays
        this.incentiveDays = incentiveDays
        this.bankEffDate = bankEffDate
        this.cashEffDate = cashEffDate
        this.pfEffFromDate = pfEffFromDate
        this.esicEffFromDate = esicEffFromDate
        this.tripCost = tripCost
        this.uan = uan
        this.probationPeriod = probationPeriod
        this.probFromDate = probFromDate
        this.probToDate = probToDate
        this.probationPeriodMonths = probationPeriodMonths
        this.probationPeriodDays = probationPeriodDays
        this.dateOfRejoining = dateOfRejoining
        this.wcf = wcf
        this.nssf = nssf
        this.leaveGroup = leaveGroup


    }


}