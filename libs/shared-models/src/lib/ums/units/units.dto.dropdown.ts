export class GetAllUnitDropDownDto {
    unitId: number;
    name: string;
    constructor(
        name: string,
        unitId: number
    ) {
        this.name = name;
        this.unitId = unitId;
    }
}