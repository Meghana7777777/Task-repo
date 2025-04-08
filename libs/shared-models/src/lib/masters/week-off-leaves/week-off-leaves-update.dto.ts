
export class WeekOffLeavesUpDateDto {
    id: number;
    weekName: string;
    // employeeCode: string;
    employeeId:number;
    //  employeeName: string;
   createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;
   

    constructor(id: number, weekName: string,
        // employeeCode: string,
        employeeId:number, 
        // employeeName: string,
       createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date,) {
        this.id = id;
        this.weekName = weekName;
        // this.employeeCode = employeeCode;
        this.employeeId = employeeId
        // this.employeeName = employeeName
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;
        

    }
}
