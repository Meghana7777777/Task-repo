import { AdjustEnum } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";

export class LeaveAdjustmentDto{
    @ApiProperty()
    id: number
    @ApiProperty()
    allocationId: number
    @ApiProperty()
    requestedBalance: number
    @ApiProperty()
    revisedAvailable: number
    @ApiProperty()
    remarks: string
    @ApiProperty()
    createdUser: string
    @ApiProperty()
    companyCode: string
    @ApiProperty()
    unitCode: string
    @ApiProperty()
    adjustmentType: AdjustEnum
}