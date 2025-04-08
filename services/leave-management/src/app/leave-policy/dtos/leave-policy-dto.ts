import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDate, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreditTypeEnum, LeaveTypeEnum, UOMEnum } from '@hrexpert/shared-models';
import { EntitlementDto } from './entitlement-dto';
import { LeaveTypeApplicabilityDto } from './leave-type-applicability-dto';

export class LeavePolicyDto {
    @ApiProperty()
    id?: number;
    @ApiProperty({
        // description: 'Leave code (unique identifier)',
        // example: 'LC001',
    })
    // @IsString()
    leaveCode: string;

    @ApiProperty({
        // description: 'Name of the leave policy',
        // example: 'Annual Leave',
    })
    // @IsString()
    leaveName: string;

    @ApiProperty({
        // description: 'Type of leave',
        // enum: LeaveTypeEnum,
        // example: LeaveTypeEnum.PAID,
    })
    // @IsEnum(LeaveTypeEnum)
    leaveType: LeaveTypeEnum;

    @ApiProperty({
        // description: 'Unit of measure for the leave (DAYS or HOURS)',
        // enum: UOMEnum,
        // example: UOMEnum.DAYS,
    })
    // @IsEnum(UOMEnum)
    uom: UOMEnum;

    @ApiProperty({
        // description: 'Start date from which the policy is valid',
        // example: '2023-01-01',
    })
    //@IsDate()
    // @Type(() => Date)
    validFrom: Date;

    @ApiProperty({
        // description: 'End date until which the policy is valid',
        // example: '2023-12-31',
    })
    // @IsDate()
    // @Type(() => Date)
    // @IsOptional()
    validTo: Date;

    @ApiProperty()
    minLimit: number

    @ApiProperty()
    maxLimit: number

    @ApiProperty()
    cutOffDate: number

    @ApiProperty()
    creditType: CreditTypeEnum

    @ApiProperty({
        // description: 'Entitlements associated with this leave policy',
        // type: [EntitlementDto],
        // example: [
        //     {
        //         effectiveFrom: 'DATE_OF_JOINING',
        //         effectiveFromUom: 'DAYS',
        //         effectiveFromCount: 30,
        //         isProrate: true,
        //         accrualLeaves: 10,
        //         accrualPeriod: 'MONTHLY',
        //         accrualOn: '1',
        //         resetPeriod: 'YEARLY',
        //         resetOn: '1',
        //         isCarryForward: false,
        //         carryForwardLimit: null,
        //         isEncashment: false,
        //         encashmentLimit: null,
        //     },
        // ],
    })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => EntitlementDto)
    entitlements: EntitlementDto[];

    
    @ApiProperty()
    isActive: boolean;
    
    createdAt: Date;

    @ApiProperty()
    createdUser: string;

    updatedAt: Date;
    
   

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    versionFlag: number;
}
