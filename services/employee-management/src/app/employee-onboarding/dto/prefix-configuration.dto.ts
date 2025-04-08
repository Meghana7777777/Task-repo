import { IsArray, IsString, IsInt, Min, Max, ValidateNested, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class FieldPositionDTO {
    @IsString()
    field: string;

    @IsInt()
    @Min(1)
    position: number;
}

export class PrefixConfigurationDTO {
    employeeTypeId: number;

    @IsArray()
    @IsString({ each: true })
    selectedFields: string[];

    
    @IsObject()
    @ValidateNested({ each: true })
    // @Type(() => FieldPositionDTO)
    fieldPositions: Record<any, number>;

    customFieldText: string;

}
