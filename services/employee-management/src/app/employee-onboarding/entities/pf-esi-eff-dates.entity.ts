import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('pf_esi_eff_dates')
export class PfEsiEffDatesEntity {

    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

    @Column({ name: 'emp_id', nullable: true })
    empId: number;

    @Column({ name: 'employee_code', type: 'varchar', length: 20, nullable: true })
    employeeCode: string;

    @Column({ name: 'is_pf_eligible', nullable: true })
    isPfEligible: string;

    @Column({ name: 'pf_eff_from_date', type: 'varchar', length: 25, nullable: true })
    pfEffFromDate: string;

    @Column({ name: 'is_esic_eligible', nullable: true })
    isEsicEligible: string;

    @Column({ name: 'esic_eff_from_date', type: 'varchar', length: 25, nullable: true })
    esicEffFromDate: string;

    @Column({ name: 'pf_no', type: 'varchar', length: 20, nullable: true })
    pfNo: string;

    @Column({ name: 'esic_no', type: 'varchar', length: 20, nullable: true })
    esicNo: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime'
    })
    createdAt: Date;

    @Column('varchar', {
        nullable: true,
        name: 'created_user'
    })
    createdUser: string | null;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime'
    })
    updatedAt: Date;

    @Column('varchar', {
        nullable: true,
        name: 'updated_user'
    })
    updatedUser: string | null;

    @VersionColumn({
        default: 1,
        name: 'version_flag'
    })
    versionFlag: number;

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;

}