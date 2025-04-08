import { DocumentTypeEnum, DomainEnum } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentDto {

    @ApiProperty()
    company: string;

    @ApiProperty()
    file_id_unq: string;

    @ApiProperty()
    branch: string[];

    @ApiProperty()
    domain: string;

    @ApiProperty()
    document_type: DocumentTypeEnum;

    @ApiProperty()
    created_by: string;

    @ApiProperty()
    created_date: Date;

    @ApiProperty()
    remarks: string;
}
