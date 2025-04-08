export class GetAllRolesDto {
    roleName: string;
    rolesId: number;
    description: string;
    unitId: number;
    unit: string;
    isActive: boolean;
    versionFlag: number;
    constructor(
        roleName: string,
        rolesId: number,
        description: string,
        unitId: number,
        unit: string,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.roleName = roleName;
        this.unitId = unitId;
        this.rolesId = rolesId;
        this.description = description;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.unit = unit;
    }
}