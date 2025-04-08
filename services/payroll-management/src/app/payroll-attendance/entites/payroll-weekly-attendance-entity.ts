import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('payroll_weekly_attendance')
export class PayrollWeeklyAttendanceEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('int', { name: 'employee_id' })
    employeeId: number;

    @Column('varchar', { name: 'employee_code', length: 50 })
    employeeCode: string;

    @Column('int', { name: 'present_count', default: 0 })
    presentCount: number;

    @Column('int', { name: 'absent_count', default: 0 })
    absentCount: number;

    @Column('int', { name: 'leave_count', default: 0 })
    leaveCount: number;

    @Column('int', { name: 'co_count', default: 0 })
    coCount: number;

    @Column('int', { name: 'od_count', default: 0 })
    odCount: number;

    @Column('int', { name: 'wp_count', default: 0 })
    wpCount: number;

    @Column('int', { name: 'wo_count', default: 0 })
    woCount: number;

    @Column({ name: 'ot_hours', default: 0 })
    otHours: string;

    @Column('int', { name: 'holiday_count', default: 0 })
    holidayCount: number;

    @Column('int', { name: 'hp_count', default: 0 })
    hpCount: number;

    @Column('int', { name: 'pay_days', default: 0 })
    payDays: number;

    @Column('int', { name: 'allowance_days', default: 0 })
    allowanceDays: number;

    @Column('int', { name: 'late_minutes', default: 0 })
    lateMinutes: number;

    @Column('int', { name: 'branch_id' })
    branchId: number;

    @Column('int', { name: 'division_id' })
    divisionId: number;

    @Column('int', { name: 'designation_id' })
    designationId: number;

    @Column('int', { name: 'department_id' })
    departmentId: number;

    @Column('int', { name: 'employee_type_id' })
    employeeTypeId: number;

    @Column('varchar', { name: 'payroll_month', nullable: false, })
    payrollMonth: string

    @Column('varchar', { name: 'payroll_month_week', nullable: false, })
    payrollMonthWeek: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column('varchar', { name: 'created_user', length: 50 })
    createdUser: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @Column('varchar', { name: 'updated_user', length: 50, nullable: true })
    updatedUser: string;
}
