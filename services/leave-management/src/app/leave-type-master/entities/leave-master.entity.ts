import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('leave_master')
export class LeaveMasterEntity {
  @PrimaryGeneratedColumn("increment", { name: "leave_id", })
  leaveId: number;
  
  @Column({ name: 'leave_group_id', type: 'int', nullable: false })
  leaveGroupId: number;

  @Column({ name: 'leave_type_id', type: 'int', nullable: false })
  leaveTypeId: number;

  @Column({ name: 'accum_qty', type: 'int', nullable: false })
  accumQty: number;

  @Column({ name: 'accum_period', type: 'varchar', nullable: true })
  accumPeriod: string;

  @Column({ name: 'collapse', type: 'varchar', nullable: false })
  collapse: string;

  @Column({ name: 'collapse_month', type: 'varchar', nullable: false })
  collapseMonth: string;

  @Column({ name: 'collapse_count', type: 'int', nullable: false })
  collapseCount: number;

  @Column({ name: 'carry_forward', type: 'int', nullable: false })
  carryForward: number;

  @Column({ name: 'encash_limit', type: 'int', nullable: false })
  encashLimit: number;

  @Column({ name: 'is_active', type: 'boolean', nullable: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'created_user'
  })
  createdUser: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'updated_user'
  })
  updatedUser: string | null;

}