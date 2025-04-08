export class GetAllUnitDto {
    unitId: number;
    name: string;
    description: string;
    organizationId: number;
    organization: string;
    isActive: boolean;
    versionFlag: number;
    constructor(
        unitId: number,
        name: string,
        description: string,
        organizationId: number,
        organization: string,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.unitId = unitId
        this.name = name;
        this.description = description;
        this.organizationId = organizationId;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.organization = organization;
    }
}