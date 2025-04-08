
export class RolesResponseDto {

    roleId: string;
    roleName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdUser: string;
    updatedUser: string;


    constructor(roleId: string, roleName: string, isActive: boolean, createdAt: Date, updatedAt: Date, createdUser: string, updatedUser: string,
    ) {
        this.roleId = roleId
        this.roleName = roleName
        this.isActive = isActive
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.createdUser = createdUser
        this.updatedUser = updatedUser

    }
}