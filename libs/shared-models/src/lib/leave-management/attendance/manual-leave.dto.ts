import { LeaveApprovalStatusEnum } from "../../enums";


export class ApplyForLeavesDtos {
    applyForLeavesId: number;
    employeeId: number;
    employeeCode: string;
    typeOfLeave: any;
    fromDate: any;
    toDate: any;
    leaveToDay: string;
    noOfDays: number;
    leaveReason: string;
    leaveAddress: string;
    isActive: boolean;
    updatedAt: Date | any;
    updatedUser: string;
    rejectionReason: string;
    createdAt: Date | any;
    createdUser: string;
    versionFlag: number;
    status?: LeaveApprovalStatusEnum;
    employeeName?: string;
    typeOfLeaveDesc: string;
    reportingManager?: number;

    constructor(
        applyForLeavesId: number,
        employeeId: number,
        employeeCode: string,
        typeOfLeaveId: any,
        typeOfLeaveDesc: string,
        fromDate: Date,
        toDate: Date,
        leaveToDay: string,
        noOfDays: number,
        leaveReason: string,
        leaveAddress: string,
        isActive: boolean,
        updatedAt: Date | any,
        updatedUser: string,
        rejectionReason: string,
        createdAt: Date | any,
        createdUser: string,
        versionFlag: number,
        status?: LeaveApprovalStatusEnum,
        employeeName?: string,
        reportingManager?: number,
    ) {
        this.applyForLeavesId = applyForLeavesId;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.typeOfLeaveDesc = typeOfLeaveDesc;
        this.typeOfLeave = typeOfLeaveId;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.leaveToDay = leaveToDay;
        this.noOfDays = noOfDays;
        this.leaveReason = leaveReason;
        this.leaveAddress = leaveAddress;
        this.isActive = isActive;
        this.updatedAt = updatedAt;
        this.rejectionReason = rejectionReason;
        this.updatedUser = updatedUser;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.versionFlag = versionFlag;
        this.status = status;
        this.employeeName = employeeName;
        this.reportingManager = reportingManager;
    }
}