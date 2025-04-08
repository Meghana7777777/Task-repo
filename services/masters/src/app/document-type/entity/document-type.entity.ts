import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('document_type')
export class DocumentTypeEntity {

    @PrimaryGeneratedColumn('increment', { name: 'document_type_id' })
    documentTypeId: number;

    @Column('varchar', { length: 50, nullable: false, name: 'domain' })
    domain: string;

    @Column('varchar', { length: 100, nullable: false, name: 'document_type' })
    documentType: string;

    @Column('boolean', { nullable: false, name: 'is_active' })
    isActive: boolean;
}
