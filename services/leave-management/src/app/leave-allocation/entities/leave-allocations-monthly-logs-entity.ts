import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { LeaveAllocationsLog } from "./leave-allocation-log.entity";
import { LeaveAllocations } from "./leave-allocation-entity";
import { MonthlyAllocationlogEnum } from "@hrexpert/shared-models";

@Entity('leave_allocations_monthly_logs')
export class LeaveAllocationsMonthlyLogs extends AbstractEntity {

    @Column({ name: 'employee_id', type: 'int', nullable: false })
    employeeId: number;

    @Column({ name: 'leave_type_id', type: 'int', nullable: false })
    leaveTypeId: number;

    @Column({ name: 'year', type: 'year', nullable: false })
    year: string;

    @Column({ name: 'month_year', type: 'varchar', nullable: false })
    monthYear: string;

    @Column({ name: 'leaves_allotted', type: 'decimal', default: 0, precision: 10, scale: 1 })
    leavesAllotted: number;

    @Column({ name: 'leaves_used', type: 'decimal', default: 0, precision: 10, scale: 1 })
    leavesUsed: number;

    @Column({ name: 'available', type: 'decimal', default: 0, precision: 10, scale: 1 })
    available: number;

    @Column({name: 'log_type', type: 'enum', enum: MonthlyAllocationlogEnum, nullable: false}) 
    logType: MonthlyAllocationlogEnum;

    @ManyToOne(() => LeaveAllocations, (leaveAllocation) => leaveAllocation.logs, { nullable: false })
    @JoinColumn({ name: 'leave_allocation_id' })
    leaveAllocation: LeaveAllocations;
}
