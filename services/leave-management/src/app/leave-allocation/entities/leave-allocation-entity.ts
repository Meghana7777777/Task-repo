import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity, OneToMany } from "typeorm";
import { LeaveAllocationsLog } from "./leave-allocation-log.entity";

@Entity('leave_allocations')
export class LeaveAllocations extends AbstractEntity {

  @Column({ name: 'employee_id', type: 'int', nullable: false })
  employeeId: number;
  
  @Column({ name: 'leave_type_id', type: 'int', nullable: false })
  leaveTypeId: number;
  
  @Column({ name: 'year', type: 'year', nullable: false })
  year: string;

  @Column({ name: 'leaves_allotted', type: 'decimal', default: 0, precision:10, scale:1 })
  leavesAllotted: number;

  @Column({ name: 'leaves_used', type: 'decimal', default: 0, precision:10, scale:1 })
  leavesUsed: number;

  @Column({ name: 'available', type: 'decimal', default: 0, precision:10, scale:1 })
  available: number;

  @OneToMany(() => LeaveAllocationsLog, (log) => log.leaveAllocation)
  logs: LeaveAllocationsLog[];
}
