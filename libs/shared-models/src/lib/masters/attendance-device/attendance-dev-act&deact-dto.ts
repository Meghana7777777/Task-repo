export class AttendanceDevActiveDeacticveReq {
    id: number;
    isActive?: boolean
    versionFlag?: number
    updatedUser?: string

    constructor(id?: number,isActive?: boolean,versionFlag?: number,updatedUser?: string) {
        this.id = id;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
    }
}