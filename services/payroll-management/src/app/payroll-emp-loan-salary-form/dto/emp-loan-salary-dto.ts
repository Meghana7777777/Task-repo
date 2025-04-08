import { ApiProperty } from "@nestjs/swagger";
import { LoanSalaryStatusEnum, LoanSalaryTypeEnum } from "libs/shared-models/src/lib/enums";

export class LoanSalaryDto {
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeCode: string; 

    @ApiProperty()
    firstName: string; 

    @ApiProperty()
    designation: string; 

    @ApiProperty()
    dateOfJoining: Date; 

    @ApiProperty()
    type: LoanSalaryTypeEnum; 

    @ApiProperty()
    advanceAmount: number; 
    
    @ApiProperty()
    installments: number;

    @ApiProperty()
    effectiveFrom: Date; 

    @ApiProperty()
    purpose: string; 

    @ApiProperty()
    reason: string;

    @ApiProperty()
    amountOutstanding: number; 

    @ApiProperty()
    dateOfApplying: Date; 

    @ApiProperty()
    status: LoanSalaryStatusEnum;

    @ApiProperty()
    hodMail: string;

    @ApiProperty()
    months: Date[];

    @ApiProperty()
    numberOfTotalTerms: number;

    @ApiProperty()
    permissionDate: Date;

    @ApiProperty()
    employeeId: number;
}