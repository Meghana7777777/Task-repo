import {Column,CreateDateColumn,Entity,Generated,JoinColumn,ManyToOne,PrimaryGeneratedColumn,UpdateDateColumn,VersionColumn,} from 'typeorm';
import { LeaveAllocations } from './leave-allocation-entity';
import { TransactionTypeEnum } from '@hrexpert/shared-models';

@Entity('leave_allocation_log')
export class LeaveAllocationsLog {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uuid' })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'employee_id', type: 'int', nullable: false })
  employeeId: number;

  @Column({ name: 'leave_type_id', type: 'int', nullable: false })
  leaveTypeId: number;

  @Column({ name: 'year', type: 'year', nullable: false })
  year: string;

  @Column({
    name: 'leaves_allotted',
    type: 'decimal',
    default: 0,
    precision: 10,
    scale: 1,
  })
  leavesAllotted: number;

  @Column({
    name: 'leaves_used',
    type: 'decimal',
    default: 0,
    precision: 10,
    scale: 1,
  })
  leavesUsed: number;

  @Column({ 
    name: 'available',
    type: 'decimal',
    default: 0,
    precision: 10,
    scale: 1,
  })
  available: number;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: TransactionTypeEnum,
    nullable: false,
  })
  transactionType:  TransactionTypeEnum;

  @Column('varchar', { name: 'transaction_reason', length: 255, nullable: true })
  transactionReason: string;

  @CreateDateColumn({ name: 'transaction_date' })
  transactionDate: Date;

  @Column('varchar', { name: 'company_code', length: 20, nullable: true })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: true })
  unitCode: string;

  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'created_user',
  })
  createdUser: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'updated_user',
  })
  updatedUser: string | null;

  @VersionColumn({
    default: 1,
    name: 'version_flag',
  })
  versionFlag: number;

  @ManyToOne(
    () => LeaveAllocations,
    (leaveAllocation) => leaveAllocation.logs,
    { nullable: false }
  )
  @JoinColumn({ name: 'leave_allocation_id' })
  leaveAllocation: LeaveAllocations;
}
