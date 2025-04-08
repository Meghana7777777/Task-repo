import { MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeaveApprovalStatusEnum } from '@hrexpert/shared-models';

export class ApplyOtDTO {


    @ApiProperty()
    employeeName: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    inTime: Date;

    @ApiProperty()
    outTime: Date;

    @ApiProperty()
    workingHours: string;

    @ApiProperty()
    status: LeaveApprovalStatusEnum;


    @ApiProperty()
    @IsOptional()
    @MaxLength(40, { message: "Created User allows maximum 40 characters" })
    createdUser: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(40, { message: "Updated User allows maximum 40 characters" })
    updatedUser: string;
    
    @ApiProperty()
    id?: number;

    @ApiProperty()
    isActive?: boolean;

}