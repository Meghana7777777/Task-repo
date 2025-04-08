export class UserRolesDto {

    userId: string;
    userName: string;
    roleId: string[];
    roleName: string[];


    constructor(userId: string, userName: string, roleId: string[], roleName: string[]) {
        this.userId = userId;
        this.userName = userName;
        this.roleId = roleId
        this.roleName = roleName

    }

}