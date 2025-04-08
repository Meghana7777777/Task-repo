import { AccrualPeriodEnum, EffectiveFromEnum, EffectiveFromUomEnum } from "../../enums/leave-management/leave-type-enum";

export class EntitlementDto {
    effectiveFrom: EffectiveFromEnum;
    effectiveFromUom: EffectiveFromUomEnum;
    effectiveFromCount?: number;
    isProrate: boolean;
    accrualLeaves: number;
    accrualPeriod: AccrualPeriodEnum;
    accrualOn: string;
    accrualOnDate: number;
    resetPeriod: AccrualPeriodEnum;
    resetOn: string;
    resetOnDate: number;
    isCarryForward: boolean;
    carryForwardLimit?: number;
    isEncashment: boolean;
    encashmentLimit?: number;
    leavePolicyTypeId?: number



    constructor(
        effectiveFrom?: EffectiveFromEnum,
        effectiveFromUom?: EffectiveFromUomEnum,
        effectiveFromCount?: number,
        isProrate?: boolean,
        accrualLeaves?: number,
        accrualPeriod?: AccrualPeriodEnum,
        accrualOn?: string,
        accrualOnDate?: number,
        resetPeriod?: AccrualPeriodEnum,
        resetOn?: string,
        resetOnDate?: number,
        isCarryForward?: boolean,
        carryForwardLimit?: number,
        isEncashment?: boolean,
        encashmentLimit?: number,
        leavePolicyTypeId?: number
    ) {
        this.effectiveFrom = effectiveFrom;
        this.effectiveFromUom = effectiveFromUom;
        this.effectiveFromCount = effectiveFromCount;
        this.isProrate = isProrate;
        this.accrualLeaves = accrualLeaves;
        this.accrualPeriod = accrualPeriod;
        this.accrualOn = accrualOn;
        this.accrualOnDate = accrualOnDate;
        this.resetPeriod = resetPeriod;
        this.resetOn = resetOn;
        this.resetOnDate = resetOnDate;
        this.isCarryForward = isCarryForward;
        this.carryForwardLimit = carryForwardLimit;
        this.isEncashment = isEncashment;
        this.encashmentLimit = encashmentLimit;
        this.leavePolicyTypeId = leavePolicyTypeId
    }
}


export class LeavesAccumulationReq { 
    date?: number;
    month?: number;
    employeeId?: number
    departmentId?: number
    designationId?: number
    divisionId?: number
    branchId?: string
    leaveGroupId?:number
    employeeTypeId?:number
    monthYear?: any

    constructor(
        date?: number,
        month?: number,
        employeeId?: number,
        departmentId?: number,
        designationId?: number,
        divisionId?: number,
        branchId?: string,
        leaveGroupId?:number,
        employeeTypeId?:number,
        monthYear?: any

    ) {
        this.date = date;
        this.month = month;
        this.employeeId = employeeId;
        this.departmentId = departmentId;
        this.designationId = designationId;
        this.divisionId = divisionId;
        this.branchId = branchId;
        this.leaveGroupId = leaveGroupId
        this.employeeTypeId = employeeTypeId
        this.monthYear = monthYear
    }




}
