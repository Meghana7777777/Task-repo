import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";
import { EmpNonRecComponentsEntity } from "./emp-non-rec-components.entity";

@Entity('emp_non_rec_terms')
export class EmpNonRecTermsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('int', {
        name: 'employee_id',
        nullable: true,
    })
    employeeId: number;

    @Column('int', {
        name: 'component_id',
        nullable: true,
    })
    componentId: number;

    @Column('decimal', {
        name: 'term_amount',
        nullable: true,
    })
    termAmount: number;

    @Column('int', {
        name: 'total_terms',
        nullable: true,
    })
    totalTerms: number;

    @Column('varchar', {
        name: 'term_count',
        nullable: true,
    })
    termCount: string;

    @Column({
        name: 'pay_month',
        nullable: true,
    })
    payMonth: string;

    @Column({
        name: 'is_processed',
        nullable: true,
    })
    isProcessed: boolean;

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


    @ManyToOne((type) => PayrollEmployeesEntity, (payRollEmployee) => payRollEmployee.empNonRecTerms)
    @JoinColumn({ name: 'employee_id' })
    payRollEmployee: PayrollEmployeesEntity

    @ManyToOne((type) => PayrollComponentsEntity, (payRollComponent) => payRollComponent.empNonRecTerms)
    @JoinColumn({ name: 'component_id' })
    payRollComponent: PayrollComponentsEntity

    @ManyToOne((type) => EmpNonRecComponentsEntity, (empNonRecComponent) => empNonRecComponent.empNonRecTerms)
    @JoinColumn({ name: 'non_recurring_id' })
    empNonRecComponent: EmpNonRecComponentsEntity

}