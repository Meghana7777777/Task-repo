import { LeaveAllocationLogDto } from "./leave-allocation-log-dto";

export class LeaveAllocationDto{
    employeeId: number;
    leaveTypeId: number;
    year: string;
    leavesAllotted: number;
    leavesUsed: number;
    available: number;
    logs: LeaveAllocationLogDto[]
    createdUser?: string;
    updatedUser?: string;
    companyCode?: string;
    unitCode?: string;

    constructor(
        employeeId: number,
        leaveTypeId: number,
        year: string,
        leavesAllotted: number,
        leavesUsed: number,
        available: number,
        logs: LeaveAllocationLogDto[],
        createdUser?: string,
        updatedUser?: string,
        companyCode?: string,
        unitCode?: string,

    ){
        this.employeeId = employeeId
        this.leaveTypeId = leaveTypeId
        this.year = year
        this.leavesAllotted = leavesAllotted
        this.leavesUsed = leavesUsed
        this.available = available
        this.logs = logs
        this.createdUser = createdUser
        this.updatedUser = updatedUser
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}