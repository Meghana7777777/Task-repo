import { EmployeeStatus } from "../../enums";

export class EmployeIdReq{
    employeeId:number
    constructor(
        employeeId:number
    ){
        this.employeeId = employeeId
    }

}

export class EmployeeCodeReq{
    employeeCode:string;

    constructor(
        employeeCode:string
    ){
        this.employeeCode = employeeCode
    }

}
export class BranchReq{
    branchId:any;

    constructor(
        branchId:any
    ){
        this.branchId = branchId
    }

}
export class ShiftReq{
    shiftGroup:string
    fromDate:any
    toDate:any
    logDate:any
    constructor(
        shiftGroup?:string,
        fromDate?:any,
        toDate?:any,
        logDate?:any

    ){
        this.shiftGroup = shiftGroup
        this.fromDate = fromDate
        this.toDate = toDate
        this.logDate = logDate
    }

}
export class EmployeeApprovalReq{
    employeeStatus:EmployeeStatus.LessAgeLimit;

    constructor(
        employeeStatus:EmployeeStatus.LessAgeLimit){
        this.employeeStatus = employeeStatus
    }

}

export class EmployeeMobileReq{
    mobileNo:string;

    constructor(
        mobileNo:string
    ){
        this.mobileNo = mobileNo
    }

}