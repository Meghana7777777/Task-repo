import { GetAllRolesDto } from "../../roles";



export class AllUserRolesResponseDto {

    userId: string;
    userName: string;
    roles: GetAllRolesDto[]


    constructor(userId: string, userName: string, roles: GetAllRolesDto[]) {
        this.userId = userId;
        this.userName = userName;
        this.roles = roles

    }

}