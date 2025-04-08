import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";

@Entity('payroll_records')
export class PayrollRecordsEntity {

    @PrimaryGeneratedColumn("increment", { name: "id", }) id: number;

    // @Column({ name: 'pay_period', nullable: true, type: 'datetime' }) payPeriod: Date;

    @Column('json', { name: 'component_records', nullable: true }) componentRecords: object;

    @Column({ name: 'payroll_week', nullable: true, type: 'varchar' }) payrollWeek: string;

    @Column({ name: 'payroll_month', nullable: true }) payrollMonth: number;

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

    @Column('varchar', {
        nullable: false,
        name: "is_derived",
        default: 'No'
    })
    isDerived: string;

    @Column('varchar', {
        nullable: true,
        name: "is_pf",
    })
    isPf: string;

    @Column('varchar', {
        nullable: true,
        name: "is_esi"
    })
    isEsi: string;

    @Column('varchar', {
        nullable: true,
        name: "is_attn_ince"
    })
    isAttnIncentive: string;

    @Column('int', {
        name: 'max_absent_days',
        nullable: true
    })
    maxAbDays: number;

    @Column('int', {
        name: 'incentive_days',
        nullable: true
    })
    incentiveDays: number;

    @Column('int', {
        name: 'employee_type_id',
        nullable: true
    })
    employeeTypeId: number;

    @Column('varchar', {
        nullable: true,
        name: 'pay_mode'
    })
    payMode: string;
    
    @Column('varchar', {
        nullable: true,
        name: 'status'
    })
    status: string;

    // @ManyToOne((type) => PayrollEmployeesEntity, (payRollEmployees) => payRollEmployees.payRollRecords)
    // @JoinColumn({ name: 'employee_id' })
    // payRollEmployees: PayrollEmployeesEntity

    @Column('int', { name: 'employee_id', nullable: true }) employeeId: number;

    @ManyToOne((type) => PayrollComponentsEntity, (payRollComponents) => payRollComponents.payRollRecordsEntity)
    @JoinColumn({ name: 'component_id' })
    payRollComponents: PayrollComponentsEntity


}