import { ApiProperty } from "@nestjs/swagger";

export class ActivateDto {
    @ApiProperty()
    id: number;
}
