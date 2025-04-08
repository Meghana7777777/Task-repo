export class RolesCreateDto {
    roleName: string;
    createdUser: string;

    /**
     * 
     * @param roleName 
     * @param createdUser 
     */

    constructor(

        roleName: string,
        createdUser: string,
    ) {

        this.roleName = roleName;
        this.createdUser = createdUser;
    }

}