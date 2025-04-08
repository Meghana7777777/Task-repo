export class AttendanceDevDto {
    branchId: number;
    deviceType: string;
    createdAt: Date;
    createdUser: string | null;
    updatedAt: Date;
    updatedUser: string | null;
    versionFlag: number;
    id?: number

    constructor(
        branchId: number,
        deviceType: string,
        createdAt: Date ,
        createdUser: string | null ,
        updatedAt: Date ,
        updatedUser: string | null ,
        versionFlag: number ,
        id? : number
    ) {
        this.branchId = branchId
        this.deviceType = deviceType
        this.createdAt= createdAt
        this.createdUser= createdUser  
        this.updatedAt= updatedAt
        this.updatedUser= updatedUser 
        this.versionFlag= versionFlag
        this.id=id
    }
}