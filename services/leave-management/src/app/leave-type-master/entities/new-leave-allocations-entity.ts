import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('new_leave_allocations')
export class NewLeaveAllocationsEntity extends AbstractEntity {

  @Column({ name: 'employee_id', type: 'int', nullable: false })
  employeeId: number;

  @Column({ name: 'employee_code', type: 'varchar', nullable: false })
  employeeCode: string;

  @Column({ name: 'leave_group_code_id', type: 'int', nullable: false })
  leaveGroupCodeId: number;
  
  @Column({ name: 'leave_type_id', type: 'int', nullable: false })
  leaveTypeId: number;

  @Column({ name: 'year', type: 'varchar', nullable: false })
  year: string;

  @Column({ name: 'prev_year_closing_bal', type: 'decimal', default: 0, precision: 10, scale: 1 })
  prevYearClosingBalance: number;

  // Columns for each month (Explicitly defined)
  @Column({ name: 'carried_1', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried1: number;
  @Column({ name: 'accum_1', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum1: number;
  @Column({ name: 'utilized_1', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized1: number;
  @Column({ name: 'balance_1', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance1: number;

  @Column({ name: 'carried_2', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried2: number;
  @Column({ name: 'accum_2', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum2: number;
  @Column({ name: 'utilized_2', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized2: number;
  @Column({ name: 'balance_2', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance2: number;

  @Column({ name: 'carried_3', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried3: number;
  @Column({ name: 'accum_3', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum3: number;
  @Column({ name: 'utilized_3', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized3: number;
  @Column({ name: 'balance_3', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance3: number;

  @Column({ name: 'carried_4', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried4: number;
  @Column({ name: 'accum_4', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum4: number;
  @Column({ name: 'utilized_4', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized4: number;
  @Column({ name: 'balance_4', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance4: number;

  @Column({ name: 'carried_5', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried5: number;
  @Column({ name: 'accum_5', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum5: number;
  @Column({ name: 'utilized_5', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized5: number;
  @Column({ name: 'balance_5', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance5: number;

  @Column({ name: 'carried_6', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried6: number;
  @Column({ name: 'accum_6', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum6: number;
  @Column({ name: 'utilized_6', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized6: number;
  @Column({ name: 'balance_6', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance6: number;

  @Column({ name: 'carried_7', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried7: number;
  @Column({ name: 'accum_7', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum7: number;
  @Column({ name: 'utilized_7', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized7: number;
  @Column({ name: 'balance_7', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance7: number;

  @Column({ name: 'carried_8', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried8: number;
  @Column({ name: 'accum_8', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum8: number;
  @Column({ name: 'utilized_8', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized8: number;
  @Column({ name: 'balance_8', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance8: number;

  @Column({ name: 'carried_9', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried9: number;
  @Column({ name: 'accum_9', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum9: number;
  @Column({ name: 'utilized_9', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized9: number;
  @Column({ name: 'balance_9', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance9: number;

  @Column({ name: 'carried_10', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried10: number;
  @Column({ name: 'accum_10', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum10: number;
  @Column({ name: 'utilized_10', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized10: number;
  @Column({ name: 'balance_10', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance10: number;

  @Column({ name: 'carried_11', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried11: number;
  @Column({ name: 'accum_11', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum11: number;
  @Column({ name: 'utilized_11', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized11: number;
  @Column({ name: 'balance_11', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance11: number;

  @Column({ name: 'carried_12', type: 'decimal', default: 0, precision: 10, scale: 1 })
  carried12: number;
  @Column({ name: 'accum_12', type: 'decimal', default: 0, precision: 10, scale: 1 })
  accum12: number;
  @Column({ name: 'utilized_12', type: 'decimal', default: 0, precision: 10, scale: 1 })
  utilized12: number;
  @Column({ name: 'balance_12', type: 'decimal', default: 0, precision: 10, scale: 1 })
  balance12: number;
}
