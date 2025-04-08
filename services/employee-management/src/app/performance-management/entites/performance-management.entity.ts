
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('performanace_management')
export class PerformanceManagementEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { name: 'emp_code', unique: true })
    employeeCode: string;

    @Column('varchar', { name: 'emp_name' })
    employeeName: string;
  
    @Column('varchar', { name: 'status' })
    status: string;

    // @Column('varchar', { name: 'department' })
    // department: string;

    // @Column('varchar', { name: 'designation' })
    // designation: string;

    // @Column('varchar', { name: 'reporting_manager', nullable: true })
    // reportingManager: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}