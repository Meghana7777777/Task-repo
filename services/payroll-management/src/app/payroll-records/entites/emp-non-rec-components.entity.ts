import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";
import { EmpNonRecTermsEntity } from "./emp-non-rec-terms.entity";

@Entity('emp_non_rec_components')
export class EmpNonRecComponentsEntity {

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

    @Column('int', {
        name: 'is_permanent',
        nullable: true,
    })
    isPermanent: number;

    @Column('decimal', {
        name: 'total_amount',
        nullable: true,
    })
    totalAmount: number;

    @Column({
        name: 'emi_count',
        nullable: true,
    })
    emiCount: number;

    @Column('decimal', {
        name: 'emi_amount',
        nullable: true,
    })
    emiAmount: number;

    @Column({
        name: 'start_date',
        nullable: true,
    })
    startDate: string;

    @Column({
        name: 'end_date',
        nullable: true,
    })
    endDate: string;

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

    @ManyToOne((type) => PayrollEmployeesEntity, (payRollEmployee) => payRollEmployee.nonRecComponents)
    @JoinColumn({ name: 'employee_id' })
    payRollEmployee: PayrollEmployeesEntity

    @ManyToOne((type) => PayrollComponentsEntity, (payRollComponent) => payRollComponent.empRecComponents)
    @JoinColumn({ name: 'component_id' })
    payRollComponent: PayrollComponentsEntity

    @OneToMany((type) => EmpNonRecTermsEntity, (empNonRecTerms) => empNonRecTerms.empNonRecComponent, { cascade: true })
    empNonRecTerms: EmpNonRecTermsEntity[]



}