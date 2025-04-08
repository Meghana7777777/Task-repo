export class ActiveEmployeesForAttendanceDto {
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    employeeType: string
    departmentId?: number;
    designationId?: number;
    divisionId?:number;
    branchId?:number;
}