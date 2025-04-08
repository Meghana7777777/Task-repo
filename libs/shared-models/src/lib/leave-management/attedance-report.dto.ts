
export class AttendanceDto {
    attnFromDate?: Date
    attnToDate?: Date
    departmentId?: number
    desginationid?: number
    divisionId?: number
    branchId?: number
    employeeId?: number
    branch?: number;
    employeeCode?: string;
    attendanceId?: number;
    inTime?: Date;
    outTime?: Date;
    attnStatus?: string
    employeeTypeId?:number
    constructor(
        attnFromDate?: Date,
        attnToDate?: Date,
        departmentId?: number,
        desginationid?: number,
        divisionId?: number,
        branchId?: number,
        employeeId?: number,
        branch?: number,
        employeeCode?: string,
        attendanceId?: number,
        inTime?: Date,
        outTime?: Date,
        attnStatus?: string,
        employeeTypeId?: number
    ) {
        this.attnFromDate = attnFromDate;
        this.attnToDate = attnToDate;
        this.departmentId = departmentId;
        this.desginationid = desginationid;
        this.divisionId = divisionId;
        this.branchId = branchId;
        this.employeeId = employeeId;
        this.branch = branch;
        this.employeeCode = employeeCode;
        this.attendanceId = attendanceId;
        this.inTime = inTime;
        this.outTime = outTime;
        this.attnStatus = attnStatus
        this.employeeTypeId = employeeTypeId
    }
}