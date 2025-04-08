import { Entity, Unique } from "typeorm";
import { Column, CreateDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
@Entity('attendance')
// @Unique(['date', 'emp_id'])
export class AttendanceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('date', {
        name: 'date',
        nullable: false,
        
    })
    date: string

    @Column('int', {
        name: 'emp_id',
        nullable: false,
    })
    empId: number

    @Column('varchar', {
        name: 'emp_code',
        nullable: false,
        length: 50
    })
    empCode: string

    @Column('varchar', {
        name: 'emp_name',
        nullable: false,
        length: 50
    })
    empName: string


    @Column('datetime', {
        name: 'in_time',
        nullable: true,
    })
    inTime: Date

    @Column('datetime', {
        name: 'out_time',
        nullable: true,
    })
    outTime: Date

    /**
     * Status of the employee for the day (e.g., Present, Absent, WeekOff, etc.).
     * Status of attendance for that day.
     */
    @Column('varchar', {
        name: 'attn_status',
        nullable: false,
        comment: "P-Present A-Absent L-Leave H-Holiday S-Sunday HD-Half Day"
    })
    attnStatus: string

    @Column('varchar', {
        name: 'in_reader',
        nullable: true,
    })
    inreader: string

    @Column('varchar', {
        name: 'out_reader',
        nullable: true,
    })
    outReader: string

    @Column('time', {
        name: 'ot_hours',
        nullable: true,
    })
    otHours: string

    @Column('time', {
        name: 'spl_ot_hours',
        nullable: true,
    })
    spclOThrs: string

    @Column('time', {
        name: 'tr_hours',
        nullable: true,
    })
    trHrs: string

    @Column('time', {
        name: 'wk_hours',
        nullable: true,
    })
    wkHrs: string

    @Column('varchar', {
        name: 'leave_status',
        nullable: true,
    })
    leaveStatus: string


    @Column('varchar', {
        name: 'shift',
        nullable: true,
    })
    shift: string

    /**
     * team - Shift team of that employee
     */
    @Column('varchar', {
        name: 'team',
        nullable: true,
    })
    team: string

    @Column('varchar', {
        name: 'attendance_month',
        nullable: true,
    })
    attendanceMonth: string

    @Column('date', {
        name: 'log_lastup',
        nullable: true,
    })
    logLastup: Date

    @Column('int', {
        name: 'branch_id',
        nullable: true,
    })
    branch: number
    /**
     * freeze_status - Y - Yes, N - No
     * 
     */

    @Column('varchar', {
        name: 'freeze_status',
        nullable: false,
        default:"Y",
        comment: "Y - Yes, N - No",
    })
    freezeStatus: string

    @Column('int', {
        name: 'department_id',
        nullable: false,
    })
    departmentId: number

    @Column('int', {

        name: 'designation_id',
        nullable: false,
    })
    designationId: number

    @Column('int', {
        name: 'division_id',
        nullable: false,
    })
    divisionId: number
    
    @Column('int', {
        name: 'ot_status',
        nullable: false,
    })
    otStatus: number

    @Column('varchar', {
        name: 'manual_entry',
        nullable: false,
        default:"NO",
    })
    manualEntry: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;


    @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'created_user'
    })
    createdUser: string | null;

    @Column('int', {
        name: 'late_min',
        nullable: true,
    })
    lateMin: Number


    @Column('int', {
        name: 'cum_late_min',
        nullable: true,
    })
    cumLateMin: Number

}
