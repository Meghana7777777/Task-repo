export class EmpDataReq {
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
        employeeCode?:string

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
    }
}

export class DashboardReq {
    branchId?: any
    date?: any
    divisionId?: number
    departmentId?: number
    empTypeId?: number
    payrollMonth?: any


    constructor(
        branchId?: any,
        date?: any,
        divisionId?: number,
        departmentId?: number,
        empTypeId?: number,
        payrollMonth?: any
    ) {
        this.branchId = branchId
        this.date = date
        this.divisionId = divisionId
        this.departmentId = departmentId
        this.empTypeId = empTypeId
        this.payrollMonth = payrollMonth
    }
}


export class UnitIdReq {
    unitId?: number
    employeeId?: number
    date?: any
    divisionId?: number
    departmentId?: number
    employeeCode?: string
    startDate?: any
    endDate?: any
    reportingManager?:number


    constructor(
        unitId?: number,
        employeeId?: number,
        date?: any,
        divisionId?: number,
        departmentId?: number,
        employeeCode?: string,
        startDate?: any,
        endDate?: any,
        reportingManager?:number

    ) {
        this.unitId = unitId
        this.employeeId = employeeId
        this.date = date
        this.divisionId = divisionId
        this.departmentId = departmentId
        this.employeeCode = employeeCode
        this.startDate =startDate
        this.endDate = endDate
        this.reportingManager = reportingManager

    }



}
export class ApplyLeaveBrachDto {
    branchId?: any
    leaveGroupId?: number
    employeeTypeId?: number


    constructor(
        branchId?: any,
        leaveGroupId?: number,
        employeeTypeId?: number
    ) {
        this.branchId = branchId
        this.leaveGroupId = leaveGroupId
        this.employeeTypeId = employeeTypeId

    }
}



export interface CommonDashboardProps {
    branchId: number;
    divisionId: number;
    departmentId: number;
    empTypeId: number;
}
