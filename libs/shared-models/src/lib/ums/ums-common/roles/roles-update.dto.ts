export class RolesUpdateDto {
    roleId: string;
    roleName: string;
    updatedUser: string;
    isActive: boolean;

    /**
     * 
     * @param roleId 
     * @param roleName 
     * @param updatedUser 
     * @param isActive 
     */

    constructor(
        roleId: string,
        roleName: string,
        updatedUser: string,
        isActive: boolean
    ) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.updatedUser = updatedUser;
        this.isActive = isActive;
    }

}