import { UsersFileUploadDataDto } from "./users-files-data.dto";

export class UsersResponseDto {

    usersId: string;
    fullName: string;
    email: string;
    status: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdUser: string;
    updatedUser: string;
    filesData: UsersFileUploadDataDto[];
    versionFlag: number;

    constructor(

        usersId: string,
        fullName: string,
        email: string,
        status: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
        createdUser: string,
        updatedUser: string,
        filesData: UsersFileUploadDataDto[],
        versionFlag: number,

    ) {
        this.usersId = usersId;
        this.usersId = usersId;
        this.fullName = fullName;
        this.email = email;
        this.status = status;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdUser = createdUser;
        this.updatedUser = updatedUser;
        this.filesData = filesData;
        this.versionFlag = versionFlag;

    }
}