import { BloodGroups, EmployeeDetailsDto, EmployeeStatus } from "@hrexpert/shared-models";
import dayjs from "dayjs";
import { Branches } from "../../branches/branches.entity";
import { DepartmentsEntity } from "../../departments/entites/departments-entity";
import { DesignationsEntity } from "../../designations/entites/designations.entity";
import { Division } from "../../division/division.entity";
import { Employee } from "../entities/employee-details.entity";
import { EmployeeEduDetails } from "../entities/employee-education.entity";
import { EmployeeExperienceDetails } from "../entities/employee-experience.entity";
import { EmployeeFamilyDetails } from "../entities/employee-family.entity";
import { EmployeeIdProofs } from "../entities/employee-idproof";
import { EmployeeType } from "../../employee-type/dto/employee-type-entity";

export class CreateEmployeeAdapter {
    convertDtoToEntity(dto: EmployeeDetailsDto): Employee {
        const employeeEntityObj: Employee = new Employee();
        if (dto.id) {
            employeeEntityObj.id = dto.id
        }
        employeeEntityObj.salutation = dto.salutation;
        employeeEntityObj.aadhaarNo = dto.aadhaarNo;
        employeeEntityObj.firstName = dto.firstName;
        employeeEntityObj.lastName = dto.lastName;
        employeeEntityObj.employeeCode = dto.employeeCode;
        employeeEntityObj.dateOfBirth = dto.dateOfBirth ? dayjs(dto.dateOfBirth).toDate() : null;
        employeeEntityObj.employeeStatus = dto.employeeCode == null ? EmployeeStatus.LessAgeLimit : EmployeeStatus.OnRollEmployee;
        employeeEntityObj.gender = dto.gender;
        const department = new DepartmentsEntity()
        department.id = dto.departmentId
        employeeEntityObj.departmentId = department
        const designation = new DesignationsEntity()
        designation.id = dto.designationId
        employeeEntityObj.designationId = designation
        const branch = new Branches()
        branch.id = dto.branchId
        employeeEntityObj.branchId = branch;
        employeeEntityObj.shift = dto.shift;
        const division = new Division()
        division.id = dto.divisionId
        employeeEntityObj.divisionId = division
        employeeEntityObj.mobileNo = dto.mobileNo;
        employeeEntityObj.emailId = dto.emailId;
        employeeEntityObj.currentVillage = dto.currentVillage
        employeeEntityObj.currentDistrict = dto.currentDistrict;
        employeeEntityObj.currentAddress = dto.currentAddress;
        employeeEntityObj.currentState = dto.currentState;
        employeeEntityObj.currentPincode = dto.currentPincode;
        employeeEntityObj.currentCountry = dto.currentCountry;
        employeeEntityObj.permanentVillage = dto.permanentVillage;
        employeeEntityObj.permanentDistrict = dto.permanentDistrict;
        employeeEntityObj.permanentAddress = dto.permanentAddress;
        employeeEntityObj.permanentState = dto.permanentState;
        employeeEntityObj.permanentPincode = dto.permanentPincode;
        employeeEntityObj.permanentCountry = dto.permanentCountry;
        employeeEntityObj.reportingManager = dto.reportingManager;
        employeeEntityObj.joiningStatus = dto.joiningStatus
        employeeEntityObj.referanceEmployeeName = dto.referanceEmployeeName
        employeeEntityObj.referanceMobileNumber = dto.referanceMobileNumber
        employeeEntityObj.referanceName = dto.referanceName
        employeeEntityObj.employeeReferance = dto.employeeReferance
        employeeEntityObj.createdUser = dto.createdUser
        employeeEntityObj.role = dto.role
        employeeEntityObj.oldEmployeeCode = dto.oldEmployeeCode
        employeeEntityObj.attendanceAllowance = dto.attendanceAllowance
        employeeEntityObj.travellingAllowance = dto.travellingAllowance
        employeeEntityObj.timeRestrictions = dto.timeRestrictions
        employeeEntityObj.accomdation = dto.accomdation
        employeeEntityObj.probationPeriodMonths = dto.probationPeriodMonths
        employeeEntityObj.probationPeriodDays = dto.probationPeriodDays
        employeeEntityObj.probFromDate = dto.probationPeriod ?  dayjs(dto.probationPeriod[0]).format("YYYY-MM-DD") : null
        employeeEntityObj.probToDate =  dto.probationPeriod ? dayjs(dto.probationPeriod[1]).format("YYYY-MM-DD") : null

        employeeEntityObj.pfEffFromDate = dto.pfEffFromDate? dayjs(dto.pfEffFromDate).format('YYYY-MM-DD'): null
        employeeEntityObj.esicEffFromDate = dto.esicEffFromDate? dayjs(dto.esicEffFromDate).format('YYYY-MM-DD'): null

        employeeEntityObj.maxAbsentDays = dto.maxAbsentDays;
        employeeEntityObj.incentiveDays = dto.incentiveDays;
        employeeEntityObj.bankEffDate = dto.bankEffDate ? dayjs(dto.bankEffDate).format("YYYY-MM-DD") : null
        employeeEntityObj.cashEffDate = dto.cashEffDate ? dayjs(dto.cashEffDate).format("YYYY-MM-DD") : null
        employeeEntityObj.messAllowance = dto.messAllowance;
        employeeEntityObj.payMode = dto.payMode
        employeeEntityObj.tripCost = dto.tripCost
        employeeEntityObj.uan = dto.uan

        employeeEntityObj.updatedUser = dto.updatedUser
        employeeEntityObj.salary = dto.salary? dto.salary : 0
        employeeEntityObj.pfNo = dto.pfNo;
        employeeEntityObj.esicNo = dto.esicNo;
        employeeEntityObj.isPfEligible = dto.isPfEligible;
        employeeEntityObj.isEsicEligible = dto.isEsicEligible;

        employeeEntityObj.wcf = dto.wcf;
        employeeEntityObj.nssf = dto.nssf;
        employeeEntityObj.leaveGroup= dto.leaveGroup

        employeeEntityObj.bankName = dto.bankName;
        employeeEntityObj.bankBranch = dto.bankBranch;
        employeeEntityObj.bankAcNo = dto.bankAcNo;
        employeeEntityObj.bankIfscCode = dto.bankIfscCode;
        employeeEntityObj.nominee = dto.nominee;
        employeeEntityObj.dateOfJoining = dto.dateOfJoining? dayjs(dto.dateOfJoining).format('YYYY-MM-DD') : null
        employeeEntityObj.dateOfReliving = dto.dateOfReliving? dayjs(dto.dateOfReliving).format('YYYY-MM-DD'): null
        employeeEntityObj.dateOfRejoining = dto.dateOfRejoining? dayjs(dto.dateOfRejoining).format('YYYY-MM-DD'): null
        employeeEntityObj.reasonOfReliving = dto.reasonOfReliving;
        employeeEntityObj.bloodGroup = BloodGroups[dto.bloodGroup];
        employeeEntityObj.maritualStatus = dto.maritualStatus;
        employeeEntityObj.emergencyContactNo = dto.emergencyContactNo;
        // employeeEntityObj.employeeTypeId = dto.employeeTypeId
        const employeeType = new EmployeeType()
        employeeType.id = dto.employeeTypeId
        employeeEntityObj.employeeTypeId = employeeType;
        employeeEntityObj.isActive = dto.isActive
        employeeEntityObj.employeeRemarks = dto.employeeRemarks
        const employeeFamilyDetailsArr: EmployeeFamilyDetails[] = []
        for (const empFamObj of dto.employeeFamilyDetails) {
            const employeeFamEntityObj = new EmployeeFamilyDetails()
            if (dto.id) {
                employeeFamEntityObj.id = empFamObj.id
                const empId = new Employee
                empId.id = dto.id
                employeeFamEntityObj.employee = empId
            }
            employeeFamEntityObj.familyMemName = empFamObj.familyMemName
            employeeFamEntityObj.relation = empFamObj.relation
            employeeFamEntityObj.contactNo = empFamObj.contactNo
            employeeFamEntityObj.familyIdType = empFamObj.familyIdType
            employeeFamEntityObj.aadhaarNo = empFamObj.aadhaarNo
            employeeFamilyDetailsArr.push(employeeFamEntityObj)
        }
        employeeEntityObj.employeeFamilyDetails = employeeFamilyDetailsArr

        const employeeEduDetailsArr: EmployeeEduDetails[] = []
        for (const empEduObj of dto.employeeEduDetails) {
            const employeeEduEnitytObj = new EmployeeEduDetails()
            if (dto.id) {
                employeeEduEnitytObj.id = empEduObj.id
                const empId = new Employee
                empId.id = dto.id
                employeeEduEnitytObj.employee = empId
            }
            employeeEduEnitytObj.empQualification = empEduObj.empQualification

            employeeEduEnitytObj.university = empEduObj.university
            employeeEduEnitytObj.collegeName = empEduObj.collegeName

            employeeEduEnitytObj.specialization = empEduObj.specialization
            employeeEduEnitytObj.yearOfPass = empEduObj.yearOfPass? dayjs(empEduObj.yearOfPass).format('YYYY-MM-DD') : null
            employeeEduEnitytObj.percentage = empEduObj.percentage
            employeeEduDetailsArr.push(employeeEduEnitytObj)
        }
        employeeEntityObj.employeeEduDetails = employeeEduDetailsArr

        const employeeExperienceDetailsArr: EmployeeExperienceDetails[] = []
        for (const empExpObj of dto.employeeExperienceDetails) {
            const employeeExpEntityObj = new EmployeeExperienceDetails()
            if (dto.id) {
                employeeExpEntityObj.id = empExpObj.id
                const empId = new Employee
                empId.id = dto.id
                employeeExpEntityObj.employee = empId
            }
            employeeExpEntityObj.organisation = empExpObj.organisation
            employeeExpEntityObj.fromDate = empExpObj.fromDate? dayjs(empExpObj.fromDate).format('YYYY-MM-DD'):null
            employeeExpEntityObj.toDate = empExpObj.toDate? dayjs(empExpObj.toDate).format('YYYY-MM-DD'):null
            employeeExpEntityObj.yearOfExp = empExpObj.yearOfExp
            employeeExperienceDetailsArr.push(employeeExpEntityObj)
        }
        employeeEntityObj.employeeExperienceDetails = employeeExperienceDetailsArr

        const employeeIdProofDetailsArr: EmployeeIdProofs[] = []
        for (const empIdProofObj of dto.employeeIdProofs) {
            const employeeIdProofObj = new EmployeeIdProofs()
            if (dto.id) {
                employeeIdProofObj.id = empIdProofObj.id
                const empId = new Employee
                empId.id = dto.id
                employeeIdProofObj.employee = empId
            }
            employeeIdProofObj.idType = empIdProofObj.idType
            employeeIdProofObj.idNumber = empIdProofObj.idNumber
            employeeIdProofDetailsArr.push(employeeIdProofObj)
        }
        employeeEntityObj.employeeIdProofs = employeeIdProofDetailsArr



        return employeeEntityObj;
    }
}