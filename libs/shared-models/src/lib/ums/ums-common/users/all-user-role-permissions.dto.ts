import { AllRolePermissionsDto } from "./all-role-permissions-data.dto";

export class AllUserRolePermissionsResponseDto {

    userId: string;
    userName: string;
    roles: AllRolePermissionsDto[]

    constructor(userId: string, userName: string, roles: AllRolePermissionsDto[]) {
        this.userId = userId;
        this.userName = userName;
        this.roles = roles

    }

}