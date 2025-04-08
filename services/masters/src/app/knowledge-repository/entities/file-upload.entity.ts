// import { ReferenceFeatures } from "@shahi-packing/libs/shared-models";
import { ReferenceFeatures } from "@hrexpert/shared-models";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
// import { ReferenceFeatures } ;


@Entity('_common_file_upload')
@Index('FILES_COMMON_QUERY', ['featuresRefName', 'featuresRefNo'])
export class FileUploadEntity {
    @PrimaryGeneratedColumn('uuid', {
        name: 'file_upload_id'
    })
    fileUploadId: string;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'file_description'
    })
    fileDescription: string;

    @Column({
        type: 'enum',
        enum: ReferenceFeatures,
        nullable: false,
        name: 'features_ref_name'
    })
    featuresRefName: ReferenceFeatures;

    @Column('int', {
        nullable: false,
        name: 'features_ref_no'
    })
    featuresRefNo: number;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'file_name'
    })
    fileName: string;

    @Column('integer', {
        nullable: false,
        name: 'size',
        default: 1
    })
    size: string;

    @Column('varchar', {
        nullable: false,
        length: 250,
        name: 'original_name'
    })
    originalName: string;

    @Column('varchar', {
        nullable: false,
        length: 100,
        name: 'type'
    })
    type: string;

    @Column('varchar', {
        nullable: false,
        length: 60,
        name: 'last_modified'
    })
    lastModified: string;


    @Column('varchar', {
        nullable: false,
        length: 60,
        name: 'last_modified_date'
    })
    lastModifiedDate: string;

    @Column('integer', {
        nullable: false,
        name: 'percent',
        default: 1
    })
    percent: string;

    @Column('varchar', {
        nullable: false,
        length: 300,
        name: 'file_path'
    })
    filePath: string;
}