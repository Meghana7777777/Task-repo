import { CommonRequestAttrs } from "../ums-common";

export class RolePermissionDto extends CommonRequestAttrs {

    rolePermissionId: number;
    permissionId: number;
    permission: string
    roleId: number;
    role: string
    isActive: boolean;
    versionFlag: number;
    subMenuId: number;
    subMenu: string;
    scopeId: number;
    scope: string;
    constructor(
        username: string,
        userId: number,
        rolePermissionId: number,
        permissionId: number,
        permission: string,
        subMenuId: number,
        subMenu: string,
        scopeId: number,
        scope: string,
        roleId: number,
        role: string,
        isActive: boolean,
        versionFlag: number
    ) {
        super(username, userId);
        this.scopeId = scopeId;
        this.scope = scope;
        this.subMenuId = subMenuId;
        this.subMenu = subMenu;
        this.rolePermissionId = rolePermissionId
        this.permissionId = permissionId;
        this.roleId = roleId;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.permission = permission;
        this.role = role;
    }
}
