import { ApplyForLeaveStatusEnum } from "../../enums";

export class ApplyLeavesStatusReq {
    applyForLeavesId?: any;
    employeeId?: number;
    typeOfLeave?: number;
    noOfDays?: number;
    status?: ApplyForLeaveStatusEnum;
    attnAdjstId?:any

    constructor(
        applyForLeavesId?: any,
        employeeId?: number,
        typeOfLeave?: number,
        noOfDays?: number,
        status?: ApplyForLeaveStatusEnum,
        attnAdjstId?:any
    ) {
        this.applyForLeavesId = applyForLeavesId
        this.employeeId = employeeId
        this.typeOfLeave = typeOfLeave
        this.noOfDays = noOfDays
        this.status = status
        this.attnAdjstId =attnAdjstId
    }
}

export class ApplyLeaveTabNameReq {
    tabName: string
    status: ApplyForLeaveStatusEnum
    applyForLeavesId: string
    constructor(
        tabName?: string,
        status?: ApplyForLeaveStatusEnum,
        applyForLeavesId?: string,
    ) {
        this.tabName = tabName
        this.status = status
        this.applyForLeavesId = applyForLeavesId
    }
}



export class ApplyLeavesReq {
    employeeId?: number;
    selectedMonth?: string;
    selectedYear?: string;

    constructor(
        employeeId?: number,
        selectedMonth?: string,
        selectedYear?: string,
    ) {
        this.employeeId = employeeId
        this.selectedMonth = selectedMonth
        this.selectedYear = selectedMonth
    }
}


export class ApproveLeaveStatusReq {
    employeeId?: number;
    departmentId?: number
    desginationid?: number
    branchId?: number
    divisionId?: number
    reportingManager?:any
    applyForLeavesId?: number
    constructor(
        employeeId?: number,
        departmentId?: number,
        desginationid?: number,
        branchId?: number,
        divisionId?: number,
        reportingManager?:any,
        applyForLeavesId?: number
    ) {
        this.employeeId = employeeId;
        this.departmentId = departmentId;
        this.desginationid = desginationid
        this.branchId = branchId
        this.divisionId = divisionId
        this.reportingManager =reportingManager
        this.applyForLeavesId = applyForLeavesId
    }

    
}
export class ReportingManagerReq {
    employeeId?: any;
    departmentId?: number
    desginationid?: number
    branchId?: number
    divisionId?: number
    reportingManagerId?:any
    date?:string
    constructor(
        employeeId?: any,
        departmentId?: number,
        desginationid?: number,
        branchId?: number,
        divisionId?: number,
        reportingManagerId?:any,
        date?:string
    ) {
        this.employeeId = employeeId;
        this.departmentId = departmentId;
        this.desginationid = desginationid
        this.branchId = branchId
        this.divisionId = divisionId
        this.reportingManagerId =reportingManagerId
        this.date =date
    }

    
}