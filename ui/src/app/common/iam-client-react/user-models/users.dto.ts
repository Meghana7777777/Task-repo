export class UsersCreateDto {
    fullName: string;
    email: string;
    password: string;
    salt: string;
    confirmPassword?: string;
    createdUser: string;
    filesData?: [];

    /**
     * 
     * @param fullName 
     * @param email 
     * @param password 
     * @param salt 
     * @param confirmPassword 
     * @param createdUser 
     */

    constructor(

        fullName: string,
        email: string,
        password: string,
        salt: string,
        confirmPassword: string,
        createdUser: string,
        filesData?: []
    ) {

        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.confirmPassword = confirmPassword;
        this.createdUser = createdUser;
        this.filesData = filesData
    }

}