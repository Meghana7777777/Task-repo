
class FieldPositionDto {
    field: string;
    position: number;
}

export class PrefixConfigurationDto {
    employeeTypeId : number
    selectedFields: string[];
    fieldPositions: { [field: string]:number};
    customFieldText: string;
}
