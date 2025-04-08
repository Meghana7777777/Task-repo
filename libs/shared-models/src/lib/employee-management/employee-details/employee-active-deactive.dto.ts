export class EmployeesActivateDeactivateDto {
    employeeId: number;
    isActive?: boolean
    versionFlag?: number
    updatedUser?: string

    constructor(employeeId?: number,isActive?: boolean,versionFlag?: number,updatedUser?: string) {
        this.employeeId = employeeId;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
        this.updatedUser = updatedUser;
    }

}