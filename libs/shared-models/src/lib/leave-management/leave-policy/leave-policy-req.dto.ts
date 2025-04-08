export class LeavePolicyReq{
    leavePolicyTypeId:number;

    constructor(
        leavePolicyTypeId:number
    ){
        this.leavePolicyTypeId = leavePolicyTypeId
    }

}

export class lateMinReq{
    branchId?: any
    departmentId?: number
    employeeId?: number
    date? : string
    designationId? : number
    divisionId?: number
    employeeCode?:string

    constructor(
        branchId?: any,
        departmentId?: number,
        employeeId?: number,
        date? : string,
        designationId? : number,
        divisionId?: number,
        employeeCode?:string

    ){
        this.branchId = branchId
        this.departmentId = departmentId
        this.employeeId = employeeId
        this.date = date
        this.designationId = designationId
        this.divisionId = divisionId
        this.employeeCode = employeeCode
    }

}