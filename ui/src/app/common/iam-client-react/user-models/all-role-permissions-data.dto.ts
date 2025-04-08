export class AllRolePermissionsDto {
    roleId: string;
    roleName: string;
    permissions: string[];
    constructor(roleId: string, roleName: string, permissions: string[]) {
        this.roleId = roleId
        this.roleName = roleName
        this.permissions = permissions
    }

}