
import { CartonShortageStatus } from "@hrexpert/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('consolidated_attendance_log')
export class ConsolidatedAttendanceLogEntity {

    @PrimaryGeneratedColumn('increment', {
        name: 'consolidated_log_id'
    })
    consolidatedLogId: number;

    @Column('varchar', {
        nullable: false,
        length: 60,
        name: 'employee_name'
    })
    employeeName: string;

    @Column('varchar', {
        nullable: false,
        length: 60,
        name: 'employee_code'
    })
    employeeCode: string;

    @Column('date', {
        nullable: false,
        name: 'log_date'
    })
    logDate: Date;

    @Column('varchar', {
        nullable: true,
        name: 'in_time_1'
    })
    inTime1: string;

    @Column('varchar', {
        nullable: true,
        name: 'out_time_1'
    })
    outTime1: string;

    @Column('varchar', {
        nullable: true,
        name: 'in_time_2'
    })
    inTime2: string;

    @Column('varchar', {
        nullable: true,
        name: 'out_time_2'
    })
    outTime2: string;

    @Column('varchar', {
        nullable: true,
        name: 'in_time_3'
    })
    inTime3: string;

    @Column('varchar', {
        nullable: true,
        name: 'out_time_3'
    })
    outTime3: string;

    @Column('varchar', {
        nullable: true,
        name: 'in_time_4'
    })
    inTime4: string;

    @Column('varchar', {
        nullable: true,
        name: 'out_time_4'
    })
    outTime4: string;

    @Column('varchar', {
        nullable: true,
        name: 'in_time_5'
    })
    inTime5: string;

    @Column('varchar', {
        nullable: true,
        name: 'out_time_5'
    })
    outTime5: string;
    @Column('varchar', {
        nullable: true,
        name: 'in_time_6'
    })
    inTime6: string;

    @Column('varchar', {
        nullable: true,
        name: 'out_time_6'
    })
    outTime6: string;

    @Column('varchar', {
        nullable: false,
        length: 6,
        name: 'shift'
    })
    shift: string;

    @Column('varchar', {
        nullable: false,
        name: 'total_hours'
    })
    totalHours: string;

    // @Column('varchar', {
    //     nullable: true,
    //     name: 'shift_start_time'
    // })
    // shiftStartTime: Date;

    // @Column('datetime', {
    //     nullable: true,
    //     name: 'shift_end_time'
    // })
    // shiftEndTime: Date;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date

    @Column('enum',{
        name: 'manual',
        enum: CartonShortageStatus
    })
    manual: CartonShortageStatus
}