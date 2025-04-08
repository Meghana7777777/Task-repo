import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollTypesComponentsEntity } from "../../payroll-components/entites/payroll-types-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";

@Entity('payroll_types')
export class PayrollTypesEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('varchar', {
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column('text', {
        name: 'description',
        nullable: false,
    })
    description: Text;

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

    @OneToMany((type) => PayrollTypesComponentsEntity, (payRollTypesComponent) => payRollTypesComponent.payRollTypes, { cascade: true, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    payRollTypesComponent: PayrollTypesComponentsEntity[];

    @OneToMany((type) => PayrollEmployeesEntity, (payRollEmployees) => payRollEmployees.payRollTypes, { cascade: true })
    payRollEmployees: PayrollEmployeesEntity[];

}