import { ApprovalStatusEnum } from "../../enums";


export class AttnAdjustmentCreateReq {
    attendanceId:number;
    employeeCode: string;
    employeeName: string;
    date: string;
    oldInTime: Date;
    newInTime:Date;
    oldOutTime: Date;
    newOutTime: Date;
    presentStatus: string;
    reason?: string;
    departmentId?:number;
    designationId?:number;
    divisionId?:number;
    branchId?:number;
    user?: string;
    employeeId?:number;
    status?:ApprovalStatusEnum;
    shift?:number;
    constructor(attendanceId:number,employeeCode: string,employeeName: string, date: string, oldInTime: Date, newInTime:Date,oldOutTime: Date,newOutTime: Date, presentStatus: string, reason?: string,departmentId?:number, designationId?:number,divisionId?:number,branchId?:number, user?: string,employeeId?:number,status?:ApprovalStatusEnum,shift?:number) {
        this.attendanceId = attendanceId
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.date = date;
        this.oldInTime = oldInTime;
        this.newInTime = newInTime;
        this.oldOutTime = oldOutTime;
        this.newOutTime = newOutTime;
        this.presentStatus = presentStatus;
        this.reason = reason;
        this.departmentId = departmentId;
        this.designationId = designationId;
        this.divisionId =divisionId;
        this.branchId = branchId;
        this.user = user;
        this.employeeId = employeeId;
        this.status = status;
        this.shift = shift;
    }
}