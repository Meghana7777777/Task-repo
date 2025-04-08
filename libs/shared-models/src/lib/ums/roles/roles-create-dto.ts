export class CreateRolesDto {
    roleName: string;
    unitId: number
    description: string;
    rolesId: number;
    versionFlag: number;
    constructor(
        roleName: string,
        unitId: number,
        description: string,
        rolesId: number,
        versionFlag: number,
    ) {
        this.roleName = roleName;
        this.unitId = unitId;
        this.description = description;
        this.rolesId = rolesId;
        this.versionFlag = versionFlag;
    }
}