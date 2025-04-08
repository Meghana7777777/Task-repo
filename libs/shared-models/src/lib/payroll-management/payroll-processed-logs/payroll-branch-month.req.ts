export class BranchMonthReq {
    branchId: number;
    month: string
    divisionId?: [];
    employeeType?: number;
    employeeId?: number

    constructor(branchId: number, month: string, divisionId?: [], employeeType?: number, employeeId?: number
    ) {
        this.branchId = branchId
        this.month = month
        this.divisionId = divisionId
        this.employeeType = employeeType
        this.employeeId = employeeId
    }
}