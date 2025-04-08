import { AdjustEnum } from "@hrexpert/shared-models";
import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('leave_adjustment')
export class LeaveAdjustmentEntity extends AbstractEntity{
    @PrimaryGeneratedColumn({ name: 'id'})
    id: number

    @Column('int',{ name: 'allocation_id', nullable: false })
    allocationId: number

    @Column('decimal',{ name: 'requested_balance', nullable: false, default: 0, precision:10, scale:1 })
    requestedBalance: number

    @Column('decimal',{ name: 'revised_available', nullable: false, default: 0, precision:10, scale:1 })
    revisedAvailable: number

    @Column('enum',{ name: 'adjustment_type', enum: AdjustEnum, nullable: false})
    adjustmentType: AdjustEnum
}