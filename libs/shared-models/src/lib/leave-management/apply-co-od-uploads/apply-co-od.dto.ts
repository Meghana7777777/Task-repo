export const AppyCoODUploadColumns = [
    "employee_code",
    "type",
    "from_date",
    "to_date",
    "no_of_days",
    "leave_reason"
]


export class ExternalReq {
    externalRef?: string;

    constructor(externalRef: string) {
        this.externalRef = externalRef
    }
}


export class ApplyForOdCoDto {
    applyOdCoId?: number;
    employeeId?: number;
    employeeCode?: string;
    type?: any;
    fromDate?: any;
    toDate?: any;
    noOfDays?: number;
    leaveReason?: string;
    isActive?: boolean;
    updatedAt?: Date | any;
    updatedUser?: string;
    rejectionReason?: string;
    createdAt?: Date | any;
    createdUser?: string;
    versionFlag?: number;
    employeeName?: string;


    constructor(
        applyOdCoId?: number,
        employeeId?: number,
        employeeCode?: string,
        type?: any,
        fromDate?: Date,
        toDate?: Date,
        noOfDays?: number,
        leaveReason?: string,
        isActive?: boolean,
        updatedAt?: Date | any,
        updatedUser?: string,
        rejectionReason?: string,
        createdAt?: Date | any,
        createdUser?: string,
        versionFlag?: number,
        employeeName?: string

    ) {
        this.applyOdCoId = applyOdCoId;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.type = type;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.noOfDays = noOfDays;
        this.leaveReason = leaveReason;
        this.isActive = isActive;
        this.updatedAt = updatedAt;
        this.rejectionReason = rejectionReason;
        this.updatedUser = updatedUser;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.versionFlag = versionFlag;
        this.employeeName = employeeName;

    }
}


export class ApplyCoOdReq {
    applyOdCoId?: number;
    employeeId?: number;
    type?: string;
    departmentId: number
    desginationid: number
    branchId: number
    divisionId: number
    constructor(
        applyOdCoId?: number,
        employeeId?: number,
        type?: string,
        departmentId?: number,
        desginationid?: number,
        branchId?: number,
        divisionId?: number,
    ) {
        this.applyOdCoId = applyOdCoId
        this.employeeId = employeeId;
        this.type = type;
        this.departmentId = departmentId;
        this.desginationid = desginationid
        this.branchId = branchId
        this.divisionId = divisionId
    }
}
