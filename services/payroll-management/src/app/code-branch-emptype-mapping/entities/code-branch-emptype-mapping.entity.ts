import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('payroll_code_branch_mapping')
export class PayrollCodeBranchMappingEntity {

  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;
  
  @Column({ name: 'payroll_code', type: 'varchar', nullable: false })
  payrollCode: string;

  @Column({ name: 'branch_id', type: 'int', nullable: true })
  branchId: number;

  @Column({ name: 'employee_type_id', type: 'int', nullable: true })
  employeeTypeId: number;

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