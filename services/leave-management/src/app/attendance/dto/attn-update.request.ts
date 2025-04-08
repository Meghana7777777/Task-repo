import { ApiProperty } from "@nestjs/swagger";
import { ApprovalStatusEnum } from "libs/shared-models/src/lib/enums";

export class AttendanceUpdateRequest {

    @ApiProperty()
    empId: number;
    @ApiProperty()
    employeeName?: string;
    @ApiProperty()
    date?: string;
    @ApiProperty()
    inTime?: string;
    @ApiProperty()
    outTime?: string;
    @ApiProperty()
    presentStatus?: string;
    @ApiProperty()
    status?: ApprovalStatusEnum;
    @ApiProperty()
    reason?: string
    @ApiProperty()
    user: string;

    /**
     * 
     * @param empId 
     * @param employeeName 
     * @param date 
     * @param inTime 
     * @param outTime 
     * @param presentStatus 
     * @param status 
     * @param reason 
     */
    constructor(empId: number, employeeName?: string, date?: string, inTime?: string, outTime?: string, presentStatus?: string, status?: ApprovalStatusEnum, reason?: string, user?: string) {
        this.empId = empId;
        this.employeeName = employeeName
        this.date = date;
        this.inTime = inTime;
        this.outTime = outTime;
        this.presentStatus = presentStatus;
        this.status = status
        this.reason = reason;
        this.user = user;
    }
}