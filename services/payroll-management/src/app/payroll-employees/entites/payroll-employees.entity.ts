import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollEmployeeComponentAmountsEntity } from "../../payroll-emp-comp-amt/entites/payroll-emp-comp-amt.entity";
import { EmpNonRecTermsEntity } from "../../payroll-records/entites/emp-non-rec-terms.entity";
import { EmpRecComponentsEntity } from "../../payroll-records/entites/emp-rec-components.entity";
import { PayrollRecordsEntity } from "../../payroll-records/entites/payroll-records.entity";
import { PayrollTypesEntity } from "../../payroll-types/entites/payroll-types.entity";
import { EmpNonRecComponentsEntity } from "../../payroll-records/entites/emp-non-rec-components.entity";
import { PayrollProcessedLogEntity } from "../../payroll-processed-log/entites/payroll-processed-log.entity";

@Entity('payroll_employees')
export class PayrollEmployeesEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('int', {
        name: "employee_id",
        nullable: true
    })
    employeeId: number

    @Column('int', {
        name: "employee_code",
        nullable: true
    })
    employeeCode: number

    @Column('varchar', {
        name: 'name',
        nullable: false,
    })
    name: string;

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

    @ManyToOne((type) => PayrollTypesEntity, (payRollTypes) => payRollTypes.payRollEmployees)
    @JoinColumn({ name: 'payroll_type_id' })
    payRollTypes: PayrollTypesEntity

    // @OneToMany((type) => PayrollRecordsEntity, (payRollRecords) => payRollRecords.payRollEmployees, { cascade: true })
    // payRollRecords: PayrollRecordsEntity[]

    @OneToMany((type) => PayrollEmployeeComponentAmountsEntity, (payrollEmployeeComponents) => payrollEmployeeComponents.payrollEmployees, { cascade: true })
    payrollEmployeeComponents: PayrollEmployeeComponentAmountsEntity[]

    @OneToMany((type) => EmpNonRecComponentsEntity, (nonRecComponents) => nonRecComponents.payRollEmployee, { cascade: true })
    nonRecComponents: EmpNonRecComponentsEntity[]

    @OneToMany((type) => EmpNonRecTermsEntity, (empNonRecTerms) => empNonRecTerms.payRollEmployee, { cascade: true })
    empNonRecTerms: EmpNonRecTermsEntity[]

    // @OneToMany(() => PayrollProcessedLogEntity, (payRollProcessesLog) => payRollProcessesLog.payRollEmployees, { cascade: ['insert', 'update'] })
    // payRollProcessesLog: PayrollProcessedLogEntity[];

}