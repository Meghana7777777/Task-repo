
export class UserRoleCreateDto {

    userId: string;
    roleId: string[];
    createdUser: string | null;

    constructor(userId: string, roleId: string[], createdUser: string) {
        this.userId = userId;
        this.roleId = roleId;
        this.createdUser = createdUser;
    }

} 