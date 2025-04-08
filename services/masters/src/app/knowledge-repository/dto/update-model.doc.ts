import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-model-doc.dto';
import { DocumentTypeEnum, DomainEnum } from '@hrexpert/shared-models';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {

    @ApiProperty()
    company: string;

    @ApiProperty()
    branch: string[];

    @ApiProperty()
    file_id_unq: string;

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
