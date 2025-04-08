export class LateMinMomentRecordsReq {
    employeeId?: number
    departmentId?: number
    designationId?: number
    monthYear?: any
    divisionId?: number
    branchId?: any
    leaveGroupId?:number
    employeeTypeId?:number
    isAllocated?:number
    employeeCode?:string
    date?:string
    month?:string
    status?:string
    constructor(
        employeeId?: number,
        departmentId?: number,
        designationId?: number,
        monthYear?: any,
        divisionId?: number,
        branchId?: any,
        leaveGroupId?:number,
        employeeTypeId?:number,
        isAllocated?:number,
        employeeCode?:string,
        date?:string,
        month?:string,
        status?:string

    ) {
        this.employeeId = employeeId
        this.departmentId = departmentId
        this.designationId = designationId
        this.monthYear = monthYear
        this.divisionId = divisionId
        this.branchId = branchId
        this.leaveGroupId = leaveGroupId
        this.employeeTypeId = employeeTypeId
        this.isAllocated = isAllocated
        this.employeeCode = employeeCode
        this.date = date
        this.month = month
        this.status = status
    }
}
