
import { LeaveApprovalStatusEnum } from "../../enums";

export class AttendanceUpdateRequest {

    employeeCode: string;
    employeeName?: string;
    date?: string;
    inTime?: string;
    outTime?: string;
    presentStatus?: string;
    status?: LeaveApprovalStatusEnum;
    reason?: string;
    user?: string;
    empId?:number;
    employeeId?:number

    /**
     * 
     * @param employeeCode 
     * @param employeeName 
     * @param date 
     * @param inTime 
     * @param outTime 
     * @param presentStatus 
     * @param status 
     * @param reason 
     */
    constructor(employeeCode: string, employeeName?: string, date?: string, inTime?: string, outTime?: string, presentStatus?: string, status?: LeaveApprovalStatusEnum, reason?: string, user?: string,empId?:number,
        employeeId?:number) {

        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.date = date;
        this.inTime = inTime;
        this.outTime = outTime;
        this.presentStatus = presentStatus;
        this.status = status;
        this.reason = reason;
        this.user = user;
        this.empId = empId
        this.employeeId = employeeId
    }
}