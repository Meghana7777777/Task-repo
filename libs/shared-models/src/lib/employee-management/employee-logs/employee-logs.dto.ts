export class EmployeeLogsDto {
    id?: number;
    employeeId?: number;
    employeeName?: string;
    role?: string;
    branch?: string;
    department?: string;
    remarks?: Text;
    dateTime?: any;
    constructor(
        id?: number,
        employeeId?: number,
        employeeName?: string,
        role?: string,
        branch?: string,
        department?: string,
        remarks?: Text,
        dateTime?: any
    ) {

        this.id = id
        this.employeeId = employeeId
        this.employeeName = employeeName
        this.role = role
        this.branch = branch
        this.department = department
        this.remarks = remarks
        this.dateTime = dateTime
    }

}