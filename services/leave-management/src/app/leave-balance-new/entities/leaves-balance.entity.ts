import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('leave_balance')
export class LeaveBalance extends AbstractEntity {

  @Column({ name: 'employee_id', type: 'int', nullable: false })
  employeeId: number;

  @Column({ name: 'employee_code', type: 'varchar', nullable: false })
  employeeCode: string;

  @Column({ name: 'leave_group_code', type: 'varchar', nullable: false })
  leaveGroupCode: string;
  
  @Column({ name: 'leave_type_id', type: 'int', nullable: false })
  leaveTypeId: number;
  
  @Column({ name: 'carry_forward', type: 'decimal', default: 0, precision:10, scale:1 })
  carryForward: number;

  @Column({ name: 'month_accumulation', type: 'decimal', default: 0, precision:10, scale:1 })
  monthAccumulation: number;

  @Column({ name: 'opening_balance', type: 'decimal', default: 0, precision:10, scale:1 })
  openingBalance: number;

  @Column({ name: 'utilized', type: 'decimal', default: 0, precision:10, scale:1 })
  utilized: number;

  @Column({ name: 'utilized_next_month', type: 'decimal', default: 0, precision:10, scale:1 })
  utilizedNextMonth: number;

  @Column({ name: 'balance', type: 'decimal', default: 0, precision:10, scale:1 })
  balance: number;

  @Column({ name: 'month_year', type: 'varchar', nullable: false })
  monthYear: string;

}
