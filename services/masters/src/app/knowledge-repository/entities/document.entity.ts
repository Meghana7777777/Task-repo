import { DocumentTypeEnum, DomainEnum } from '@hrexpert/shared-models';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('documents')
export class DocumentEntity {
    @PrimaryGeneratedColumn({
        name: 'document_id',
    })
    document_id: number;

    @Column({
        name: 'company',
        type: 'varchar',
        length: 255
    })
    company: string;

    @Column({
        name: 'branch',
        type: 'varchar',
        length: 255
    })
    branch: string;

    @Column({
        name: 'file_id_unq',
        type: 'varchar',
        length: 50
    })
    file_id_unq: string;

    @Column({
        name: 'domain',
        type: 'varchar',
        length: 255
    })
    domain: string;

    @Column({
        name: 'document_type',
        type: 'enum',
        nullable: false,
        enum: DocumentTypeEnum
    })
    document_type: DocumentTypeEnum;


    @Column({
        name: 'document_name',
        type: 'varchar',
        length: 100,
    })
    document_name: string;

    @Column({
        name: 'created_by',
        type: 'varchar',
        length: 50,
    })
    created_by: string;

    @Column({
        name: 'created_date',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_date: Date;

    @Column({
        name: 'remarks',
        type: 'text',
    })
    remarks: string;
}
