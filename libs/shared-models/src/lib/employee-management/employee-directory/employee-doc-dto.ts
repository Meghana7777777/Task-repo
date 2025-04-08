export class EmployeeDocDto {
    departmentId?: number
    desginationid?: number
    divisionId?: number
    employeeId?: number
    branch?:any;
    employeeCode?:string;
    constructor(
        departmentId?: number,
        desginationid?: number,
        divisionId?: number,
        employeeId?: number,
        branch?: any,
        employeeCode?:string,

    ) {
        this.departmentId = departmentId
        this.desginationid = desginationid
        this.divisionId = divisionId
        this.employeeId = employeeId
        this.branch = branch
        this.employeeCode = employeeCode
    
    }
}