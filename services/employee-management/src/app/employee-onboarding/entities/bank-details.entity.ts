import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('bank_details')
export class BankDetailsEntity {

    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

    @Column({ name: 'emp_id', nullable: true })
    empId: number;

    @Column({ name: 'employee_code', type: 'varchar', length: 20, nullable: true })
    employeeCode: string;

    @Column({ name: 'bank_name', type: 'varchar', length: 20, nullable: true })
    bankName: string;

    @Column({ name: 'bank_ac_no', type: 'varchar', length: 20, nullable: true })
    bankAcNo: string;

    @Column({ name: 'bank_ifsc_code', type: 'varchar', length: 20, nullable: true })
    bankIfscCode: string;

    @Column({ name: 'bank_eff_date', type: 'varchar', length: 20, nullable: true })
    bankEffDate: string;

    @Column({ name: 'cash_eff_date', type: 'varchar', length: 20, nullable: true })
    cashEffDate: string;


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