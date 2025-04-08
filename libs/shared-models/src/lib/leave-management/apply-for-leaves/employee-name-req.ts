export class EmployeeRequest{
    employeeId:number;
    
    constructor(employeeId:number){
        this.employeeId = employeeId;
    }
}
export class EmployeeNameRequest{
    employeeName:string;
    
    constructor(employeeName:string){
        this.employeeName = employeeName;
    }
}