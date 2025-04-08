import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payroll_checklist')
export class PayrollChecklist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'branch_id', type: 'int', nullable: true })
    branchId: number;

    @Column({ name: 'payroll_month', type: 'varchar', length: 10, nullable: true })
    payrollMonth: string;

    @Column({ name: 'employee_check', type: 'varchar', length: 10, nullable: true })
    employeeCheck: string;

    @Column({ name: 'leaves_check', type: 'varchar', length: 10, nullable: true })
    leavesCheck: string;

    @Column({ name: 'attendace_check', type: 'varchar', length: 10, nullable: true })
    attendanceCheck: string;

    @Column({ name: 'salary_check', type: 'varchar', length: 10, nullable: true })
    salaryCheck: string;

    @Column({ name: 'payroll_check', type: 'varchar', length: 10, nullable: true })
    payrollCheck: string;

    @Column({ name: 'created_user', type: 'varchar', length: 40, nullable: true })
    createdUser: string;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;

    @Column({ name: 'updated_user', type: 'varchar', length: 40, nullable: true })
    updatedUser: string;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;

    @Column({ name: 'is_active', type: 'tinyint', nullable: true })
    isActive: number;

    @Column({ name: 'version_flag', type: 'int', nullable: true })
    versionFlag: number;
}
