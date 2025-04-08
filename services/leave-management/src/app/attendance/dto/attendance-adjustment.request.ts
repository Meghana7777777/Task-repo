import { ApiProperty } from "@nestjs/swagger";

export class AttendanceAdjustRequest {
    @ApiProperty()
    empId: number;

    @ApiProperty()
    empCode: number;

    @ApiProperty()
    date: string;
}