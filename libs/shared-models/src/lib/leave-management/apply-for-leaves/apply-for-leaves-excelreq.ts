import { ApplyForLeaveStatusEnum } from "../../enums/apply-for-leave.enum";

export class ApplyForLeavesReqModel {
  applyForLeavesId: number;
  employeeId: number;
  employeeCode?: string;
  employeeName?: string;
  typeOfLeave?: any;
  fromDate?: any;
  toDate?: any;
  leaveFromDay?: string;
  leaveToDay?: string;
  noOfDays?: number;
  leaveReason?: string;
  leaveAddress?: string;
  isActive?: boolean;
  updatedAt?: Date | any;
  updatedUser?: string;
  createdAt?: Date | any;
  createdUser?: string;
  versionFlag?: number;
  status?: ApplyForLeaveStatusEnum
  constructor(
    applyForLeavesId?: number,
    employeeId?: number,
    employeeCode?: string,
    employeeName?: string,
    typeOfLeaveId?: any,
    fromDate?: any,
    toDate?: any,
    leaveFromDay?: string,
    leaveToDay?: string,
    noOfDays?: number,
    leaveReason?: string,
    leaveAddress?: string,
    isActive?: boolean,
    updatedAt?: Date | any,
    updatedUser?: string,
    createdAt?: Date | any,
    createdUser?: string,
    versionFlag?: number,
    status?: ApplyForLeaveStatusEnum

  ) {
    this.applyForLeavesId = applyForLeavesId;
    this.employeeId = employeeId;
    this.employeeCode = employeeCode;
    this.employeeName = employeeName;
    this.typeOfLeave = typeOfLeaveId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.leaveFromDay = leaveFromDay;
    this.leaveToDay = leaveToDay;
    this.noOfDays = noOfDays;
    this.leaveReason = leaveReason;
    this.leaveAddress = leaveAddress;
    this.isActive = isActive;
    this.updatedAt = updatedAt;
    this.updatedUser = updatedUser;
    this.createdAt = createdAt;
    this.createdUser = createdUser;
    this.versionFlag = versionFlag;
    this.status = status
  }
}

export const ApplyForLeavesExcelColumns = [
  // "EmployeeCode",
  // "TypeOfLeave",
  // "Date",
  // "NoOfDays",
  // "LeaveReason",
  // "LeaveAddress",
  "Date",
  "Employee Code",
  "Leave Address",
  "Leave Reason",
  "No Of Days",
  "Type Of Leave",
  "empId",
  "tlId",
]