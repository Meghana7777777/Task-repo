// leave-type-applicability.dto.ts
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { CriteriaEnum, TypeOfEntityEnum } from '@hrexpert/shared-models';

export class LeaveTypeApplicabilityDto {
    @IsEnum(TypeOfEntityEnum)
    typeOfEntity: TypeOfEntityEnum;

    @IsNumber()
    referenceId: number;

    @IsEnum(CriteriaEnum)
    criteria: CriteriaEnum;

    @IsOptional()
    @IsString()
    criteriaReference?: string;
}
