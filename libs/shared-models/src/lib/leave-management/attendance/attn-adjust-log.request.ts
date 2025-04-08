import { ApprovalStatusEnum } from "../../enums";

export class AttnAdjustLogReq {

    employeeCode?: string;
    date?: string;
    inTime?: Date;
    outTime?: Date;
    presentStatus?: string;
    reason?: string;
    remarks?: string;
    user?: string;
    empId?:number
    employeeId?:number
    attendaceId?: number
    id?:number
    status? : ApprovalStatusEnum
    branchId?:number
    shift?: any

    constructor(employeeCode?: string, date?: string, inTime?: Date, outTime?: Date, presentStatus?: string, reason?: string, remarks?: string, user?: string,empId?:number,employeeId?:number, attendaceId?: number, id?:number,  status? : ApprovalStatusEnum,branchId?:number,     shift?: any
    ) {
        this.employeeCode = employeeCode;
        this.date = date;
        this.inTime = inTime;
        this.outTime = outTime;
        this.presentStatus = presentStatus;
        this.reason = reason;
        this.remarks = remarks;
        this.user = user;
        this.empId =empId
        this.employeeId = employeeId
        this.attendaceId =attendaceId
        this.id = id
        this.status = status
        this.branchId = branchId
        this.shift = shift
    }
}