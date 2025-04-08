import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { Employee } from "../../employee-onboarding/entities/employee-details.entity";

@Entity('designations')
export class DesignationsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('varchar', {
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column('varchar', {
        name: 'designation_code',
        nullable: false,
    })
    designationCode: string;

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

    @OneToMany((type) => Employee, (employee) => employee.designationId, { cascade: true, onUpdate: 'CASCADE',onDelete:'RESTRICT' })
    employee: Employee[];
}