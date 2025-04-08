import { ApprovalStatusEnum } from "libs/shared-models/src/lib/enums";
import { Column, Entity, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('attendance_adjustment')
export class AttendanceAdjustment {

    @PrimaryGeneratedColumn('increment', {
        name: 'id'
    })
    id: number;

    @Column('int', {
        name: 'attendace_id'
    })
    attendaceId: number;

    @Column('int', {
        nullable: false,
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
        nullable: false,
        name: 'date'
    })
    date: string;

    @Column({
        name: 'old_in_time'
    })
    oldInTime: Date;

    @Column({
        name: 'in_time'
    })
    inTime: Date;

    @Column({
        name: 'old_out_time'
    })
    oldOutTime: Date;

    @Column({
        name: 'out_time'
    })
    outTime: Date;

    @Column("varchar", {
        name: 'present_status'
    })
    presentStatus: string;

    @Column("int", {
        nullable: false,
        name: "department_id"
    })
    departmentId: number;

    @Column("int", {
        nullable: false,
        name: "shift_group"
    })
    shiftGroup: number;

    @Column("int", {
        name: 'unit_id',
        nullable: true,
    })
    unitId: number;

    @Column('int', {
        nullable: false,
        name: 'shift'
    })
    shift: number;

    @Column('varchar', {
        nullable: true,
        name: 'reason'
    })
    reason: string;

    @Column("varchar", {
        nullable: true,
        name: "remarks"
    })
    remarks: string;

    @Column({
        name: 'applied_date'
    })
    appliedDate: Date;

    @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: true })
    fileName: string;

    @Column({ name: 'original_file_name', type: 'varchar', length: 255, nullable: true })
    originalFileName: string;

    @Column({ name: 'file_path', type: 'varchar', length: 255, nullable: true })
    filePath: string;

    @Column({ name: 'file_type', type: 'varchar', length: 255, nullable: true })
    fileType: string;

    @Column({
        type: 'enum',
        enum: ApprovalStatusEnum,
        nullable: true,
        default: ApprovalStatusEnum.OPEN,
        name: 'status'
    })
    status: ApprovalStatusEnum;

    @Column("varchar", {
        nullable: false,
        length: 40,
        name: 'created_user'
    })
    createdUser: string | null;

    @CreateDateColumn({
        name: "created_at",
        type: 'datetime'
    })
    createdAt: Date;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "updated_user"
    })
    updatedUser: string | null;

    @UpdateDateColumn({
        name: "updated_at",
        type: 'datetime'
    })
    updatedAt: Date;

    @VersionColumn({
        default: 1,
        name: 'version_flag'
    })
    versionFlag: number;

}