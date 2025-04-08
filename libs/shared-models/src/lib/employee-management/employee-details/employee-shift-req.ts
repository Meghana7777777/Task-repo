import { ApprovalStatusEnum, ShiftGroupEnum } from "../../enums";

export class EmployeeShiftReq {
    department: number;
    division: number;
    branch: number;
    shiftGroup: any;
}

export class EmployeeShiftUpdateReq {
    employeeIds:string[];
    shiftGroup: any;
}


export class ShiftStatsUpdateReq {
    id:string[];
    shiftStatus: ApprovalStatusEnum;
}
