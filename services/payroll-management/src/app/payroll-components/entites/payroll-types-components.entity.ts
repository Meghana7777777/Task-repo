import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollTypesEntity } from "../../payroll-types/entites/payroll-types.entity";
import { PayrollComponentsEntity } from "./payroll-components.entity";

@Entity('payroll_types_components')
export class PayrollTypesComponentsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

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

    @ManyToOne((type) => PayrollTypesEntity, (payRollTypes) => payRollTypes.payRollTypesComponent)
    @JoinColumn({ name: 'payroll_type_id' })
    payRollTypes: PayrollTypesEntity

    @ManyToOne((type) => PayrollComponentsEntity, (payRollComponent) => payRollComponent.payRollTypesComponent)
    @JoinColumn({ name: 'component_id' })
    payRollComponent: PayrollComponentsEntity
}