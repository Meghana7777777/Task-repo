import { ApiProperty } from "@nestjs/swagger";

export class DomainDto {
    @ApiProperty()
    domainId: number;

    @ApiProperty()
    domainType: string;

    @ApiProperty()
    isActive: boolean;
}