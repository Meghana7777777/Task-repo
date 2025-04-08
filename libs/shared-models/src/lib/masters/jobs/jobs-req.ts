export class JobReq {
    id?: number;
    jobCode?: string;
    jobDescription?: string;
    createdUser?: string;
    updatedUser?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    versionFlag?: number;
    constructor(
        id?: number,
        jobCode?: string,
        jobDescription?: string,
        createdUser?: string,
        updatedUser?: string,
        createdAt?: Date,
        updatedAt?: Date,
        isActive?: boolean,
        versionFlag?: number,
    ) {
        this.id = id
        this.jobCode = jobCode
        this.jobDescription = jobDescription
        this.isActive = isActive
        this.createdUser = createdUser
        this.updatedUser = updatedUser
        this.versionFlag = versionFlag
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

