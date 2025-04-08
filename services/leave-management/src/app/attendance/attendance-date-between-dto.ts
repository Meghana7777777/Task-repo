import { ApiProperty } from "@nestjs/swagger"

export class AttendanceDateBetweenDto {
    @ApiProperty()
    fromDate: Date;

    @ApiProperty()
    toDate:Date;

    constructor(
        fromDate: Date,

        toDate:Date
    ) {
        this.fromDate = fromDate
        this.toDate = toDate
    }
}