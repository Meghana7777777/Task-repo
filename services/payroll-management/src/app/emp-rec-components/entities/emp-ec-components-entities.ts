import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";

@Entity('emp_rec_components')
export class EmpRecComponentsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('int', {
        name: 'amount',
        nullable: true,
    })
    amount: number;

    @Column('decimal', {
        name: 'employee_id',
        nullable: true,
    })
    employeeId: number;

    @Column('varchar', {
        name: 'pay_month',
        nullable: true,
    })
    payMonth: string;

    @Column('int', {
        name: 'component_id',
        nullable: true,
    })
    componentId: number;

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

}