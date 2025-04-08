export class UnitCreateDto {
    unitId: number;
    name: string;
    description: string;
    organizationId: number;
    versionFlag: number;
    constructor(
        unitId: number,
        name: string,
        description: string,
        organizationId: number,
        versionFlag: number,
    ) {
        this.unitId = unitId
        this.name = name;
        this.description = description;
        this.organizationId = organizationId;
        this.versionFlag = versionFlag;
    }
}