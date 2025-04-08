export class DayWisePayReq {
    departmentId: number
    payDate: any
    shiftId: number
    employeeId: number
    unitCode: string
    companyCode: string
    branchId?: number
    divisionId?: number
    designationId?: number
    divisionName?: string
    branch_id?: number
    branches?: string
    department?: string
    empCode?: string
    constructor(
        departmentId?: number,
        payDate?: any,
        shiftId?: number,
        employeeId?: number,
        unitCode?: string,
        companyCode?: string,
        branchId?: number,
        divisionId?: number,
        designationId?: number,
        divisionName?: string,
        branch_id?: number,
        branches?: string,
        department?: string,
        empCode?: string,
    ) {
        this.departmentId = departmentId
        this.payDate = payDate
        this.shiftId = shiftId
        this.employeeId = employeeId
        this.unitCode = unitCode
        this.companyCode = companyCode
        this.branchId = branchId
        this.divisionId = divisionId
        this.designationId = designationId
        this.divisionName = divisionName
        this.branch_id = branch_id
        this.branches = branches
        this.department = department
        this.empCode = empCode

    }
}