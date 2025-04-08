import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";

@Entity('emp_rec_components')
export class EmpRecComponentsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('decimal', {
        name: 'amount',
        nullable: true,
    })
    amount: number;

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



}