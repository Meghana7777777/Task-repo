import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('leave_type_master')
export class LeaveTypeMasterEntity {
  @PrimaryGeneratedColumn("increment", { name: "leave_type_id", })
  leaveTypeId: number;
  
  @Column({ name: 'leave_type_name', type: 'varchar', nullable: false })
  leaveTypeName: string;

  @Column({ name: 'leave_type_code', type: 'varchar', nullable: false })
  leaveTypeCode: string;

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