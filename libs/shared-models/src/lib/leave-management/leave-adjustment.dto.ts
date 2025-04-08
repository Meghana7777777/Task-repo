import { AdjustEnum } from "../enums"

export class LeaveAdjustmentDto{
    allocationId: number
    requestedBalance: number
    revisedAvailable: number
    remarks: string
    adjustmentType: AdjustEnum
    createdUser?: string
    companyCode?: string
    unitCode?: string
    id?: number

    constructor(
        allocationId: number,
        requestedBalance: number,
        revisedAvailable: number,
        remarks: string,
        adjustmentType: AdjustEnum,
        createdUser?: string,
        companyCode?: string,
        unitCode?: string,
        id?: number,
    ){
        this.allocationId = allocationId
        this.requestedBalance = requestedBalance
        this.revisedAvailable = revisedAvailable
        this.remarks = remarks
        this.adjustmentType = adjustmentType
        this.createdUser = createdUser
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.id = id
    }
}