import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('payroll_attendance')
export class PayrollAttendanceEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('int', { name: 'employee_id' })
    employeeId: number;

    @Column('varchar', { name: 'employee_code', length: 50 })
    employeeCode: string;

    @Column('decimal', { name: 'present_count', precision: 10, scale: 1 })
    presentCount: number;

    @Column({ name: 'lop_data', type: 'decimal', default: 0, precision: 10, scale: 1 })
    lopData: number;

    @Column('decimal', { name: 'absent_count', precision: 10, scale: 1 })
    absentCount: number;

    @Column('decimal', { name: 'leave_count', precision: 10, scale: 1 })
    leaveCount: number;

    @Column('decimal', { name: 'co_count', precision: 10, scale: 1 })
    coCount: number;

    @Column('decimal', { name: 'od_count', precision: 10, scale: 1 })
    odCount: number;

    @Column('decimal', { name: 'wp_count', precision: 10, scale: 1 })
    wpCount: number;


    //   @Column({
    //     name: 'amount',
    //     type: 'decimal',
    //     precision: 10,
    //     scale: 2
    //   })
    //   amount: number;

    @Column('decimal', {
        name: 'wo_count', precision: 10,
        scale: 1
    })
    woCount: number;

    @Column({ name: 'ot_hours', default: 0 })
    otHours: string;

    @Column('decimal', { name: 'holiday_count', precision: 10, scale: 1 })
    holidayCount: number;

    @Column('decimal', { name: 'hp_count', precision: 10, scale: 1 })
    hpCount: number;

    @Column('decimal', { name: 'pay_days', default: 0, precision: 10, scale: 1 })
    payDays: number;

    @Column('decimal', { name: 'allowance_days', precision: 10, scale: 1 })
    allowanceDays: number;

    @Column('decimal', { name: 'late_minutes', precision: 10, scale: 1 })
    lateMinutes: number;

    @Column({ name: 'late_mins_deduct_days', type: 'decimal', default: 0, precision: 10, scale: 1 })
    lateMinsDeductDays: number;

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

    @Column('varchar', { name: 'bank_name', nullable: false, })
    bankName: string

    @Column('varchar', { name: 'bank_acc_no', nullable: false, })
    bankAccNo: string

    @Column('varchar', { name: 'bank_ifsc_code', nullable: false, })
    bankIfscCode: string

    @Column('varchar', { name: 'pay_mode', nullable: false, })
    payMode: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column('varchar', { name: 'created_user', length: 50 })
    createdUser: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @Column('varchar', { name: 'updated_user', length: 50, nullable: true })
    updatedUser: string;
}
