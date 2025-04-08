import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('leave_group_master')
export class LeaveGroupMasterEntity {
  @PrimaryGeneratedColumn("increment", { name: "leave_group_id", })
  leaveGroupId: number;
  
  @Column({ name: 'leave_group_name', type: 'varchar', nullable: false })
  leaveGroupName: string;

  @Column({ name: 'leave_group_code', type: 'varchar', nullable: true })
  leaveGroupCode: string;

  @Column({ name: 'leave_group_desc', type: 'text', nullable: true })
  leaveGroupDesc: string;

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