import { ApiProperty } from "@nestjs/swagger";

export class AttributeDto {
    @ApiProperty()
    attributeName: string;
    @ApiProperty()
    attributeId: number;
    @ApiProperty()
    versionFlag: number;
}