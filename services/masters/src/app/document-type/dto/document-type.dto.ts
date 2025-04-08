import { ApiProperty } from "@nestjs/swagger";

export class DocumentTypeDto {
    @ApiProperty()
    documentTypeId: number;

    @ApiProperty()
    domain: string;

    @ApiProperty()
    documentType: string;

    @ApiProperty()
    isActive: boolean;
}