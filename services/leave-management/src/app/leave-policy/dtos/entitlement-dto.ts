// entitlement.dto.ts
import { IsEnum, IsNumber, IsBoolean, IsOptional, isNumber, isString, IsString } from 'class-validator';
import { 
    AccrualOnEnum, 
    AccrualPeriodEnum, 
    EffectiveFromEnum, 
    EffectiveFromUomEnum 
} from '@hrexpert/shared-models';
import { ApiProperty } from '@nestjs/swagger';

export class EntitlementDto {
    @ApiProperty()
    effectiveFrom: EffectiveFromEnum;

    @ApiProperty()
    effectiveFromUom: EffectiveFromUomEnum;

    @ApiProperty()
    effectiveFromCount?: number;

    @ApiProperty()
    isProrate: boolean;

    @ApiProperty()
    accrualLeaves: number;

    @ApiProperty()
    accrualPeriod: AccrualPeriodEnum;

    @ApiProperty()
    accrualOn: string;

    @ApiProperty()
    accrualOnDate: number;

    @ApiProperty()
    resetPeriod: AccrualPeriodEnum;

    @ApiProperty()
    resetOn: string;

    @ApiProperty()
    resetOnDate: number;

    @ApiProperty()
    isCarryForward: boolean;

    @ApiProperty()
    carryForwardLimit?: number;

    @ApiProperty()
    isEncashment: boolean;

    @ApiProperty()
    encashmentLimit?: number;
    @ApiProperty()
    leavePolicyTypeId?: number;
}
