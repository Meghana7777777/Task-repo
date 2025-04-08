import { ApiProperty } from "@nestjs/swagger"

export class AttendanceDto {
    @ApiProperty()
    attnFromDate: Date

    @ApiProperty()
    attnToDate: Date

    @ApiProperty()
    departmentId: number

    @ApiProperty()
    desginationid: number

    @ApiProperty()
    branchId: number

    @ApiProperty()
    divisionId: number

    @ApiProperty()
    attendanceId?: number

    @ApiProperty()
    attendanceStatus?: string

    @ApiProperty()
    leaveStatus?: string

    @ApiProperty()
    inTime?: Date

    @ApiProperty()
    outTime?: Date

    constructor(
        attnFromDate: Date,
        attnToDate: Date,
        departmentId: number,
        desginationid: number,
        branchId: number,
        divisionId: number,
        attendanceId?: number,
        attendanceStatus?:string,
        leaveStatus?: string,
        inTime?:Date,
        outTime?:Date,
    ) {
        this.attnFromDate = attnFromDate
        this.attnToDate = attnToDate
        this.departmentId = departmentId
        this.desginationid = desginationid
        this.branchId = branchId
        this.divisionId = divisionId
        this.attendanceId = attendanceId
        this.attendanceStatus = attendanceStatus
        this.leaveStatus = leaveStatus
        this.inTime = inTime
        this.outTime = outTime
    }
}