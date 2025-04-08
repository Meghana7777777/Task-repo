import { BloodGroups, EmployeeEduDetailsDto, EmployeeExperienceDetailsDto, EmployeeFamilyDetailsDto, EmployeeIdProofsDto, GenderEnum, SalutationEnum, ShiftGroupEnum } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";
export class EmployeeDetailsDTO {

    @ApiProperty()
    id: number;

    @ApiProperty()
    salutation: SalutationEnum;

    @ApiProperty()
    prefix: string;

    @ApiProperty()
    empImage: string;

    @ApiProperty()
    aadhaarNo: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    employeeCode: string

    @ApiProperty()
    dateOfBirth: Date;

    @ApiProperty()
    gender: GenderEnum;

    @ApiProperty()
    departmentId: number;

    @ApiProperty()
    designationId: number;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    divisionId: number;

    @ApiProperty()
    empGrade: string;

    @ApiProperty()
    dateOfJoining: Date;

    @ApiProperty()
    mobileNo: string;

    @ApiProperty()
    emailId: string;

    @ApiProperty()
    qualification: string;

    @ApiProperty()
    currentAddress: string;

    @ApiProperty()
    currentState: string;

    @ApiProperty()
    currentPincode: string;

    @ApiProperty()
    permanentAddress: string;

    @ApiProperty()
    permanentState: string;

    @ApiProperty()
    permanentPincode: string;

    @ApiProperty()
    salary: number;

    @ApiProperty()
    pfNo: string;

    @ApiProperty()
    esicNo: string;

    @ApiProperty()
    bankName: string;

    @ApiProperty()
    bankAcNo: string;

    @ApiProperty()
    bankIfscCode: string;

    @ApiProperty()
    accommodation: string;

    @ApiProperty()
    transportation: string;

    @ApiProperty()
    nominee: string;

    @ApiProperty()
    dateOfReliving: Date;

    @ApiProperty()
    reasonOfReliving: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    createdUser: number;

    @ApiProperty()
    updatedUser: number;

    @ApiProperty()
    shiftGroup: ShiftGroupEnum;

    @ApiProperty()
    bloodGroup: BloodGroups;

    @ApiProperty()
    maritualStatus: string;

    @ApiProperty()
    emergencyContactNo: string;

    @ApiProperty()
    employeeFamilyDetails: EmployeeFamilyDetailsDto[];

    @ApiProperty()
    employeeEduDetails: EmployeeEduDetailsDto[];

    @ApiProperty()
    employeeExperienceDetails: EmployeeExperienceDetailsDto[];

    @ApiProperty()
    employeeIdProofs: EmployeeIdProofsDto[];


}