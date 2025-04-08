import { ApplyForLeaveStatusEnum } from "libs/shared-models/src/lib/enums";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('apply_for_leaves')
export class ApplyForLeavesEntity {

    @PrimaryGeneratedColumn('increment', { name: 'apply_for_leaves_id' })
    applyForLeavesId: number;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'employee_id'
    })
    employeeId: number;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'employee_code'
    })
    employeeCode: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'employee_name'
    })
    employeeName: string;

    @Column('varchar', {
        nullable: false,
        name: 'type_of_leave'
    })
    typeOfLeave: number;

    @Column('varchar',{
        nullable: true,
        name: 'from_date'
    })
    fromDate: string;
    
    @Column('varchar',{
        nullable: false,
        name: 'to_date'
    })
    toDate: string;

    @Column('varchar', {
        nullable: true,
        name: 'leave_from_day'
    })
    leaveFromDay: string;

    @Column('varchar', {
        nullable: true,
        name: 'leave_to_day'
    })
    leaveToDay: string;

    @Column({
        type: "decimal", precision: 10, scale: 1,
        nullable: true,
        name: 'no_of_days'
    })
    noOfDays: number;

    @Column('varchar', {
        nullable: true,
        name: 'leave_reason'
    })
    leaveReason: string;

    @Column('varchar', {
        nullable: true,
        name: 'leave_address'
    })
    leaveAddress: string;

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

    
    @Column({
        type: 'enum',
        enum: ApplyForLeaveStatusEnum,
        nullable: true,
        name: 'status'
    })
    status: ApplyForLeaveStatusEnum;

    @Column('varchar', {
        nullable: true,
        name: 'remarks'
    })
    remarks: Text;

}