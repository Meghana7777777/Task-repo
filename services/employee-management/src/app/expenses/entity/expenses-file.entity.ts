import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { ExpensesEntity } from './expenses.entity';
import { ExpensesFeatures, ReferenceFeatures } from '@hrexpert/shared-models';

@Entity('expenses_files')
@Index('FILES_COMMON_QUERY', ['featuresRefName', 'featuresRefNo'])
export class ExpensesFileEntity {
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
    enum: ExpensesFeatures,
    nullable: false,
    name: 'features_ref_name'
  })
  featuresRefName: ExpensesFeatures;

  @Column('int', {
    nullable: false,
    name: 'features_ref_no'
  })
  featuresRefNo: number;

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 255
  })
  fileName: string;

  @Column({
    name: 'size',
    type: 'int'
  })
  size: number;

  @Column({
    name: 'original_name',
    type: 'varchar',
    length: 255
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

  @Column({
    name: 'file_path',
    type: 'varchar',
    length: 500
  })
  filePath: string;

  // @ManyToOne(() => ExpensesEntity, (expense) => expense.files, { onDelete: 'CASCADE' })
  // expense: ExpensesEntity;
}
