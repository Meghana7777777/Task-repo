import { ApplyForLeaveStatusEnum } from "libs/shared-models/src/lib/enums";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('exceeded_leaves')
export class ExceededLeavesEntity {

    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

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
        name: 'leave_name'
    })
    leaveType: string;

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

    @Column({
        type: "decimal", precision: 10, scale: 1,
        nullable: true,
        name: 'no_of_days'
    })
    noOfDays: number;

    @Column({
        type: "int",
        nullable: true,
        name: 'available_leaves'
    })
    availbleLeaves: number;

    @Column({ name: 'leaves_allotted', type: 'decimal', default: 0, precision:10, scale:1 })
    leavesAllotted: number;
  
    @Column({ name: 'leaves_used', type: 'decimal', default: 0, precision:10, scale:1 })
    leavesUsed: number;

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

}