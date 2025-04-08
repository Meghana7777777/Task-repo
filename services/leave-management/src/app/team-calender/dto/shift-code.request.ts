import { ApiProperty } from "@nestjs/swagger";

export class ShiftCodeReq {

    @ApiProperty()
    shiftCode: string;
}