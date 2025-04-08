import { DocumentTypeEnum, DomainEnum } from "../../enums";

export class DocumentModelDto {
    document_id?: number;
    company: string;
    branch: string[];
    domain: DomainEnum;
    document_type: DocumentTypeEnum;
    document_name: string;
    created_by: string;
    created_date: Date;
    file_id_unq: string;
    remarks: string;

    constructor(
        document_id: number,
        company: string,
        branch: string[],
        domain: DomainEnum,
        document_type: DocumentTypeEnum,
        document_name: string,
        created_by: string,
        created_date: Date,
        file_id_unq: string,
        remarks: string,
    ) {
        this.document_id = document_id;
        this.company = company;
        this.branch = branch;
        this.domain = domain;
        this.document_type = document_type;
        this.document_name = document_name;
        this.created_by = created_by;
        this.created_date = created_date;
        this.file_id_unq = file_id_unq;
        this.remarks = remarks;
    }
}
