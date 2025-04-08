import { ApiProperty } from "@nestjs/swagger";

export class MonthReq{
    @ApiProperty()
    month: string
}