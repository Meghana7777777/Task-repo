
export class EmployeesDto {
   
    // employeeCode: string;
    employeeId:number;
    // employeeName: string
    

    constructor(
        employeeCode: string,
        employeeId:number,
         employeeName: string,
        ) {
       
        // this.employeeCode = employeeCode;
        this.employeeId = employeeId
        // this.employeeName = employeeName
        
    }
}


export class WeekOffLeavesDto {
    id: number;
    weekName: string;
    employee:EmployeesDto[]
   createdUser: string;
    isActive?: boolean
    versionFlag?: number;
    updatedUser?: string;
    updatedAt?: Date;
   

    constructor(id: number, weekName: string,employee:EmployeesDto[],
       createdUser: string, isActive?: boolean, versionFlag?: number, updatedUser?: string,
        updatedAt?: Date,) {
        this.id = id;
        this.weekName = weekName;
        
        this.createdUser = createdUser;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;
        this.employee = employee

    }
}
