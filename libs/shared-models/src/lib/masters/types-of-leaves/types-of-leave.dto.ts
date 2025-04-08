
export class TypeOfLeavesDto {
    id: number;
    typeOfLeave: string;
    leaveCode: string;
    defaultLeaves:number;
    createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;

    constructor(id: number, typeOfLeave: string,
        leaveCode: string,defaultLeaves:number,
        createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date) {
        this.id = id;
        this.typeOfLeave = typeOfLeave;
        this.leaveCode = leaveCode;
        this.defaultLeaves = defaultLeaves
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}
