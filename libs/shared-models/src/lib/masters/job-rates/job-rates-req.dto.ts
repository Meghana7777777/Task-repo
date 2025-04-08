
export class JobRatesReq {
    id: number;
    rate:string;
    effFromDate: string;
    createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id?: number, effFromDate?: string,
        createdUser?: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.effFromDate = effFromDate;
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
