import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ExpensesEntity } from './expenses.entity';
import { ExpensesFeatures } from '@hrexpert/shared-models';

@Entity('expenses_files_log')
export class ExpensesFileLogEntity {

  @PrimaryGeneratedColumn('uuid', {
    name: 'file_upload_log_id',
  })
  fileUploadLogId: string;

  @Column({
    name: 'file_upload_id'
  })
  fileUploadId: string;

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 255
  })
  fileName: string;

  @Column('int', {
    nullable: false,
    name: 'features_ref_no',
  })
  featuresRefNo: number;

  @Column({
    type: 'enum',
    enum: ExpensesFeatures,
    nullable: false,
    name: 'features_ref_name',
  })
  featuresRefName: ExpensesFeatures;

  @Column({
    name: 'original_name',
    type: 'varchar',
    length: 255
  })
  originalName: string;

  @Column({
    name: 'size',
    type: 'int'
  })
  size: number;

  // @Column('varchar', {
  //   nullable: false,
  //   length: 100,
  //   name: 'type',
  // })
  // type: string;

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

  @Column({
    name: 'file_path',
    type: 'varchar',
    length: 500
  })
  filePath: string;

  // @ManyToOne(() => ExpensesEntity, (expense) => expense.files, { onDelete: 'CASCADE' })
  // expense: ExpensesEntity;
}
