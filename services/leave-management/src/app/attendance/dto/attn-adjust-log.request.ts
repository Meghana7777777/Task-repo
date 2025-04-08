import { ApiProperty } from "@nestjs/swagger";

export class AttnAdjustLogReq {
    @ApiProperty()
    empId: number;

    @ApiProperty()
    date: string;

    @ApiProperty()
    inTime: Date;

    @ApiProperty()
    outTime: Date;


    @ApiProperty()
    presentStatus: string;

    @ApiProperty()
    reason: string;

    @ApiProperty()
    remarks: string;

    @ApiProperty()
    user: string
    @ApiProperty()
    attendaceId?: number
    employeeName?: string;
    employeeCode?: string;
    shift?: any;
    branchId:number
}