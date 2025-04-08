import { ReferenceFeatures } from '@hrexpert/shared-models';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('_common_file_upload_log')
export class FileUploadLogEntity {
    @PrimaryGeneratedColumn('uuid', {
        name: 'file_upload_log_id',
    })
    fileUploadLogId: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'file_upload_id',
    })
    fileUploadId: string;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'file_description',
    })
    fileDescription: string;

    @Column({
        type: 'enum',
        enum: ReferenceFeatures,
        nullable: false,
        name: 'features_ref_name',
    })
    featuresRefName: ReferenceFeatures;

    @Column('int', {
        nullable: false,
        name: 'features_ref_no',
    })
    featuresRefNo: number;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'file_name',
    })
    fileName: string;

    @Column('integer', {
        nullable: false,
        name: 'size',
        default: 1,
    })
    size: string;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'original_name',
    })
    originalName: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
        name: 'type',
    })
    type: string;

    @Column('varchar', {
        nullable: false,
        length: 60,
        name: 'last_modified',
    })
    lastModified: string;

    @Column('varchar', {
        nullable: false,
        length: 60,
        name: 'last_modified_date',
    })
    lastModifiedDate: string;

    @Column('integer', {
        nullable: false,
        name: 'percent',
        default: 1,
    })
    percent: string;

    @Column('varchar', {
        nullable: false,
        length: 300,
        name: 'file_path',
    })
    filePath: string;
}
