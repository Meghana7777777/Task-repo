import { PermissionsDto } from "@hrexpert/shared-models";


export class SubMenuPermissionDto {
    menuId: number;
    menuName: string;
    permissions: PermissionsDto[];
    constructor(menuId: number, menuName: string, permissions: PermissionsDto[]) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.permissions = permissions;
    }
}