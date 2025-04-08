import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ExpensesFileEntity } from './expenses-file.entity';
import { PaymentStatusEnum, PaymentTypeEnum } from '@hrexpert/shared-models';

@Entity('expenses')
export class ExpensesEntity {
  @PrimaryGeneratedColumn({
    name: 'expenses_id'
  })
  expenses_id: number;

  @Column({
    name: 'expenses_code',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  expensesCode: string;

  @Column({
    name: 'date_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  date_time: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @Column({
    name: 'created_user',
    type: 'varchar',
    length: 50,
  })
  createdUser: string;

  @Column({
    name: 'updated_user',
    type: 'varchar',
    length: 50
  })
  updatedUser: string;

  @Column({
    name: 'version_flag',
    type: 'int'
  })
  versionFlag: number;

  @Column({
    name: 'expenses_against',
    type: 'varchar',
    length: 100
  })
  expensesAgainst: string;

  @Column({
    name: 'employee_name',
    type: 'varchar',
    length: 100,
    nullable: true
  })
  employeeName: string;

  @Column({
    name: 'branch',
    type: 'varchar',
    length: 100
  })
  branch: string;

  @Column({
    name: 'branch_manager',
    type: 'varchar',
    length: 100
  })
  branchManager: string;

  @Column({
    name: 'expenses_type',
    type: 'varchar',
    length: 50
  })
  expensesType: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  amount: number;

  @Column({
    name: 'payment_mode',
    type: 'enum',
    nullable: false,
    enum: PaymentTypeEnum
  })
  paymentMode: PaymentTypeEnum;

  @Column({
    name: 'reference_no',
    type: 'varchar',
    length: 50
  })
  referenceNo: string;

  @Column({
    name: 'payment_status',
    type: 'enum',
    nullable: false,
    enum: PaymentStatusEnum
  })
  paymentStatus: PaymentStatusEnum;

  @Column({
    name: 'tax_applicable',
    type: 'varchar',
    length: 50
  })
  taxApplicable: string;

  @Column({
    name: 'approved_by',
    type: 'varchar',
    length: 50
  })
  approvedBy: string;

  // @Column({
  //   name: 'upload_file',
  //   type: 'varchar',
  //   length: 255,
  //   nullable: true
  // })
  // uploadFile: string; // Stores the uploaded file name

  @Column({
    name: 'remarks',
    type: 'text',
  })
  remarks: string;

  // @OneToMany(() => ExpensesFileEntity, (expenseFile) => expenseFile.expense, { cascade: true })
  // files: ExpensesFileEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp'
  })
  updatedAt: Date;
}
