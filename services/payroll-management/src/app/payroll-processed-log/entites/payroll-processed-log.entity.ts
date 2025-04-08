import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";

@Entity('payroll_processed_logs')
export class PayrollProcessedLogEntity {

    @PrimaryGeneratedColumn("increment", { name: "id", })
    id: number;

    @Column({ name: 'pay_period', nullable: true, type: 'datetime' })
    payPeriod: Date;

    @Column({ name: 'pay_days', type: 'decimal', default: 0, precision: 10, scale: 1 })
    payDays: number;

    @Column('int', { name: 'employee_type_id', nullable: true })
    employeeTypeId: number;

    @Column({ name: 'payroll_week', nullable: true, type: 'varchar' })
    payrollWeek: string;

    @Column({ name: 'payroll_month', nullable: true })
    payrollMonth: number;

    @Column({ name: 'present_count', type: 'decimal', default: 0, precision: 10, scale: 1 })
    presentCount: number;
    
    @Column({ name: 'absent_count', type: 'decimal', default: 0, precision: 10, scale: 1 })
    absentCount: number;

    @Column({ name: 'leave_count', type: 'decimal', default: 0, precision: 10, scale: 1 })
    leaveCount: number;

    @Column('json', { name: 'component_records', nullable: true })
    componentRecords: object;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: string;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "created_user",
    })
    createdUser: string | null;

    @UpdateDateColumn({
        name: "updated_at",
    })
    updatedAt: string;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "updated_user",
    })
    updatedUser: string | null;

    @VersionColumn({
        default: 1,
        name: "version_flag",
    })
    versionFlag: number;

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;

    @Column('int', { name: 'employee_id', nullable: true })
    employeeId: number;

    @Column('int', { name: 'branch_id', nullable: true })
    branchId: number;

    @Column('int', { name: 'department_id', nullable: true })
    departmentId: number;

    @Column('int', { name: 'designation_id', nullable: true })
    designationId: number;

    @Column('int', { name: 'division_id', nullable: true })
    divisionId: number;

    @Column('int', { name: 'freeze_status', nullable: true })
    freezeStatus: number;

    @Column('varchar', { name: 'net_pay', nullable: true })
    netPay: string;

    @Column('boolean', { name: 'carry_forward', nullable: true, default: false })
    carryForward: boolean;

    @Column('boolean', { name: 'hod_approval', nullable: true, default: false })
    hodApproval: boolean;

    @Column('boolean', { name: 'hold_status', nullable: true, default: false })
    holdStatus: boolean;

    @Column('varchar', { name: 'pay_mode', nullable: true })
    payMode: string;

    @Column('varchar', { name: 'bank_ifsc_code', nullable: true })
    bankIfscCode: string;

    @Column('varchar', { name: 'bank_acc_no', nullable: true })
    bankAccNo: string;

    @Column('varchar', { name: 'bank_name', nullable: true })
    bankName: string;
}
