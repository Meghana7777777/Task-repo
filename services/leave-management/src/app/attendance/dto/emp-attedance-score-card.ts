import { ApiProperty } from "@nestjs/swagger";

export class EmpAttendanceSrcCard {
    @ApiProperty()
    branch?: number

    @ApiProperty()
    attnFromDate?: Date

    @ApiProperty()
    attnToDate?: Date

    @ApiProperty()
    departmentId?: number

    @ApiProperty()
    empName?: string


    constructor(
        branch?: number,
        attnFromDate?: Date,
        attnToDate?: Date,
        departmentId?: number,
        empName?: string,



    ) {
        this.branch = branch
        this.attnFromDate = attnFromDate
        this.attnToDate = attnToDate
        this.departmentId = departmentId
        this.empName = empName

    }
}
