import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";

@Entity('payroll_employee_component_amounts')
export class PayrollEmployeeComponentAmountsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column({
        type: "decimal", precision: 10, scale: 1,
        nullable: true,
        name: 'amount'
    })
    amount: number;

    @Column('date', {
        name: 'valid_from',
        nullable: false,
    })
    validFrom: Date;

    @Column('date', {
        name: 'valid_to',
        nullable: false,
    })
    validTof: Date;

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

    @ManyToOne((type) => PayrollEmployeesEntity, (payrollEmployees) => payrollEmployees.payrollEmployeeComponents)
    @JoinColumn({ name: 'employee_id' })
    payrollEmployees: PayrollEmployeesEntity

    @ManyToOne((type) => PayrollComponentsEntity, (payrollComponents) => payrollComponents.payrollEmployeeComponents)
    @JoinColumn({ name: 'component_id' })
    payrollComponents: PayrollComponentsEntity
}