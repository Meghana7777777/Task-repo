import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LeavePolicyTypeEntity } from "./leave-policy-type-entity";
import { LeaveGroupEntity } from "../../leave-group/dto/leave-group-entity";

@Entity('leave_type_group_mapping')
export class LeaveTypeGroupMapping extends AbstractEntity{

      @ManyToOne(() => LeavePolicyTypeEntity, (leavePolicyType) => leavePolicyType.entitlements, {onDelete: 'CASCADE'})
      @JoinColumn({ name: 'leave_type_id' })
      leavePolicyType: LeavePolicyTypeEntity;

      @ManyToOne((type) => LeaveGroupEntity, (leaveType) => leaveType.leaveTypeGroup)
      @JoinColumn({ name: 'leave_group_id' })
      leaveGroupId: LeaveGroupEntity;
    
}