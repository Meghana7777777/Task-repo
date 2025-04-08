import { CommonRequestAttrs } from "../ums-common";

export class RolePermissionIdReqDto extends CommonRequestAttrs {
    rolePermissionId: number
    constructor(username: string, userId: number, rolePermissionId: number) {
        super(username, userId);
        this.rolePermissionId = rolePermissionId;
    }
}