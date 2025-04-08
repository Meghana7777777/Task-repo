export class GetAllRolePermissionDropDownDto {
    permissionId: number;
    permission: string;
    constructor(
        permission: string,
        permissionId: number,
    ) {
        this.permission = permission;
        this.permissionId = permissionId;
    }
}