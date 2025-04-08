import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Matches, MaxLength } from "class-validator";
import { ApplyForLeaveStatusEnum } from "libs/shared-models/src/lib/enums";

export class ApplyLeavesDto {

    @ApiProperty()
    @IsOptional()
    applyForLeavesId: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    employeeCode: string;

    @ApiProperty()
    typeOfLeave: number;

    @ApiProperty()
    fromDate: Date;

    @ApiProperty()
    appliedDate: string;

    @ApiProperty()
    toDate: Date;

    @ApiProperty()
    leaveFromDay: string;

    @ApiProperty()
    leaveToDay: string;

    @ApiProperty()
    @IsNumber()
    noOfDays: number;

    @ApiProperty()
    leaveReason: string;

    @ApiProperty()
    leaveAddress: string;

    @ApiProperty()
    @IsEnum(ApplyForLeaveStatusEnum)
    status: ApplyForLeaveStatusEnum = ApplyForLeaveStatusEnum.OPEN;

    @ApiProperty()
    employeeName: string;

    @ApiProperty()
    remarks: Text;

    @ApiProperty()
    isActive: boolean;
    
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    updatedAt: Date;
    
    @ApiProperty()
    rejectionReason: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;
}
