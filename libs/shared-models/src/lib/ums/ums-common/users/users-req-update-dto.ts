export class UsersReqUpdateDto {
    usersId: string
    fullName: string;
    email: string;
    updatedUser: string | null;
    versionFlag: number;

    constructor(

        usersId: string,
        fullName: string,
        email: string,
        updatedUser: string | null,
        versionFlag: number,

    ) {

        this.email = email;
        this.fullName = fullName;
        this.updatedUser = updatedUser;
        this.usersId = usersId;
        this.versionFlag = versionFlag;
    }
}