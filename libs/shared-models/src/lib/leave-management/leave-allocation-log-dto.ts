export class LeaveAllocationLogDto{
    employeeId: number;
    leaveTypeId: number;
    year: string;
    leavesAllotted: number; 
    leavesUsed: number;
    available: number;
    companyCode: string | null;
    unitCode: string | null;
}