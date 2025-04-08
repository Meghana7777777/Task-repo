import { ApiProperty } from "@nestjs/swagger"

export class AttendanceDateDto {
    @ApiProperty()
    date: any
    branch?: number

    constructor(
        date: any,
        branch?: number
    ) {
        this.date = date
        this.branch = branch
    }
}