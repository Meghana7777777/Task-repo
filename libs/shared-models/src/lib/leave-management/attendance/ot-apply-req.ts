
export class OTBulkApprovalDtoReq {
    departmentId: number
    date: any
    shiftId: number
    employeeId: number
    reason: string
    finalOtHours: any
    editedFinalOtHours: string
    reportType: string
    branchId: number
    divisionId: number;
    attnFromDate: Date;
    attnToDate: Date;
    designationId: number;
    divisionName: string;
    branch_id: number;
    branches: string;
    shiftType: string;
    department: string;
    empCode: string;
    constructor(
        departmentId?: number,
        date?: any,
        shiftId?: number,
        employeeId?: number,
        reason?: string,
        finalOtHours?: any,
        editedFinalOtHours?: string,
        reportType?: string,
        branchId?: number,
        divisionId?: number,
        attnFromDate?: Date,
        attnToDate?: Date,
        designationId?: number,
        divisionName?: string,
        branch_id?: number,
        branches?: string,
        shiftType?: string,
        department?: string,
        empCode?: string,
    ) {
        this.departmentId = departmentId
        this.date = date
        this.shiftId = shiftId
        this.employeeId = employeeId
        this.reason = reason
        this.finalOtHours = finalOtHours
        this.editedFinalOtHours = editedFinalOtHours
        this.reportType = reportType
        this.branchId = branchId
        this.divisionId = divisionId
        this.attnFromDate = attnFromDate
        this.attnToDate = attnToDate
        this.designationId = designationId
        this.divisionName = divisionName
        this.branch_id = branch_id
        this.branches = branches
        this.shiftType = shiftType
        this.department = department
        this.empCode = empCode

    }

}