import { ApiProperty } from "@nestjs/swagger";

export class OrganizationDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    organizationId: number;
    @ApiProperty()
    versionFlag:number;
}