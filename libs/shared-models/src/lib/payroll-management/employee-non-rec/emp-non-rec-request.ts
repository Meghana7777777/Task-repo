export class EmpNonRecurringRequest {
    payRollEmployee?: number;
    payRollComponent?: number;
    divisionId?: number
    departmentId?: number
    designationId?: number
    branches?: any
    startDate?: string

    constructor(
        payRollEmployee?: number,
        payRollComponent?: number,
        divisionId?: number,
        departmentId?: number,
        designationId?: number,
        branches?: any,
        startDate?: string,

    ) {
        this.payRollEmployee = payRollEmployee
        this.payRollComponent = payRollComponent
        this.divisionId = divisionId
        this.departmentId = departmentId
        this.designationId = designationId
        this.branches = branches
        this.startDate = startDate
    }

}



