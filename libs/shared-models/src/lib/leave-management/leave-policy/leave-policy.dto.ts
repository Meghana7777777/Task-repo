import { CreditTypeEnum, LeaveTypeEnum, UOMEnum } from "../../enums/leave-management/leave-type-enum";
import { EntitlementDto } from "./entitlement.dto";

export class LeavePolicyDto {
    id: number;
    leaveCode: string;
    leaveName: string;
    leaveType: LeaveTypeEnum;
    uom: UOMEnum;
    validFrom: Date;
    validTo?: Date;
    minLimit: number;
    maxLimit: number
    cutOffDate: number
    creditType: CreditTypeEnum
    entitlements: EntitlementDto[];
    isActive: boolean;
    createdAt: Date;
    createdUser: string;
    updatedAt: Date;
    updatedUser: string;
    versionFlag: number;

    constructor(
        id?: number,
        leaveCode?: string,
        leaveName?: string,
        leaveType?: LeaveTypeEnum,
        uom?: UOMEnum,
        validFrom?: Date,
        validTo?: Date,
        minLimit?: number,
        maxLimit?: number,
        cutOffDate?: number,
        creditType?: CreditTypeEnum,
        entitlements?: EntitlementDto[],
        isActive?: boolean,
        createdAt?: Date,
        createdUser?: string,
        updatedAt?: Date,
        updatedUser?: string,
        versionFlag?: number,
    ) {
        this.id = id;
        this.leaveCode = leaveCode;
        this.leaveName = leaveName;
        this.leaveType = leaveType;
        this.uom = uom;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.minLimit = minLimit
        this.maxLimit = maxLimit
        this.cutOffDate =cutOffDate
        this.creditType = creditType
        this.entitlements = entitlements;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.createdUser = createdUser;
        this.updatedAt = updatedAt;
        this.updatedUser = updatedUser;
        this.versionFlag = versionFlag;
    }
}
