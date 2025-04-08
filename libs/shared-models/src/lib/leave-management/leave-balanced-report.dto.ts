
export class LeaveAllocationReqDto {

    departmentId?: number
    desginationid?: number
    empolyeeId?: number;
    divisionId?: number;
    branchId?: number;
    constructor(

        departmentId?: number,
        desginationid?: number,
        empolyeeId?: number,
        divisionId?: number,
        branchId?: number,
    ) {

        this.departmentId = departmentId
        this.desginationid = desginationid
        this.empolyeeId = empolyeeId
        this.divisionId = divisionId
        this.branchId = branchId
    }
}