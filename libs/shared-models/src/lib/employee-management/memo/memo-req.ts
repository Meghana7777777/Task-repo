export class MemoReq {
    id?: number;
    date?: string;
    type?: string;
    feedBackOn?: string;
    description?: string;
    impactOnBussiness?: string;
    employeeId?: number;
    createdUser?: string;
    updatedUser?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    versionFlag?: number;
    constructor(
        id?: number,
        date?: string,
        type?: string,
        feedBackOn?: string,
        description?: string,
        impactOnBussiness?: string,
        createdUser?: string,
        updatedUser?: string,
        createdAt?: Date,
        updatedAt?: Date,
        isActive?: boolean,
        versionFlag?: number,
    ) {
        this.id = id
        this.date = date
        this.type = type
        this.feedBackOn = feedBackOn
        this.description = description
        this.impactOnBussiness = impactOnBussiness
        this.isActive = isActive
        this.createdUser = createdUser
        this.updatedUser = updatedUser
        this.versionFlag = versionFlag
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

