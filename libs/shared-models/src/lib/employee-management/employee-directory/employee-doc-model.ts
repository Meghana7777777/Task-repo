export class EmployeeDocModel {
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    fileData: any
    employeeType?:any
    isActive?:any
    constructor(
        employeeId: number,
        employeeCode: string,
        employeeName: string,
        fileData: any,
        employeeType?:any,
        isActive?:any

    ) {
        this.employeeId = employeeId
        this.employeeCode = employeeCode
        this.employeeName = employeeName
        this.fileData = fileData
        this.employeeType =employeeType
        this.isActive =isActive
    }
}