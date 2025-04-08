import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('apply_co_od_upload')
export class ApplyCoOdUploadEntity {

    @PrimaryGeneratedColumn('increment', { name: 'apply_co_od_id' })
    applyOdCoId: number;

    @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'employee_id'
    })
    employeeId: number;

    @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'employee_code'
    })
    employeeCode: string;

    @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'employee_name'
    })
    employeeName: string;

    @Column('varchar', {
        length: 40,
        nullable: true,
        name: 'type'
    })
    type: number;

    @Column('date', {
        nullable: true,
        name: 'from_date'
    })
    fromDate: any;

    @Column('date', {
        nullable: true,
        name: 'to_date'
    })
    toDate: any;

    @Column('int', {
        // , precision: 10, scale: 1,
        nullable: true,
        name: 'no_of_days'
    })
    noOfDays: number;

    @Column('varchar', {
        length: 40,
        nullable: true,
        name: 'leave_reason'
    })
    leaveReason: string;

    @Column('boolean', {
        nullable: true,
        default: true,
        name: 'is_active'
    })
    isActive: boolean;

    @Column('varchar', {
        nullable: true,
        length: 150,
        name: 'rejection_reason'
    })
    rejectionReason: string;

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
}