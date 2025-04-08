
export class QualificationsReq {
    id: number;
    name: string;
    createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id: number, name: string,
        createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.name = name;
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
