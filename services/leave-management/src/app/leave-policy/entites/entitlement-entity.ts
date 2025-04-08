import { AccrualOnEnum, AccrualPeriodEnum, EffectiveFromEnum, EffectiveFromUomEnum } from "@hrexpert/shared-models";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LeavePolicyTypeEntity } from "./leave-policy-type-entity";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";

@Entity('entitlement')
export class EntitlementEntity extends AbstractEntity{
    @Column('enum',{
        name: 'effective_from',
        enum: EffectiveFromEnum
    })
    effectiveFrom: EffectiveFromEnum

    @Column('enum',{
        name: 'effective_from_uom',
        enum: EffectiveFromUomEnum
    })
    effectiveFromUom: EffectiveFromUomEnum

    @Column('int',{
        name: 'effective_from_count',
        nullable: true,
    })
    effectiveFromCount: number

    @Column('boolean',{
        name: 'is_prorate'
    })
    isProrate: boolean

    @Column('decimal',{
        name: 'accrual_leaves',
        precision: 10,
        scale: 1,
    })
    accrualLeaves: number

    @Column('enum',{
        name: 'accrual_period',
        enum: AccrualPeriodEnum,
    })
    accrualPeriod: AccrualPeriodEnum

    @Column('int',{
        name: 'accrual_on_date',
    })
    accrualOnDate: number

    @Column('varchar',{
        name: 'accrual_on',
    })
    accrualOn: string

    @Column('enum',{
        name: 'reset_period',
        enum: AccrualPeriodEnum
    })
    resetPeriod: AccrualPeriodEnum;
    
    @Column('int',{
        name: 'reset_on_date',
    })
    resetOnDate: number

    @Column('varchar',{
        name: 'reset_on',
    })
    resetOn: string

    @Column('boolean',{ 
        default: false,
        name: 'is_carry_forward'
    })
    isCarryForward: boolean;

    @Column('decimal',{ 
        nullable: true,
        name: 'carry_forward_limit',
        precision: 10,
        scale: 1,
    })
    carryForwardLimit: number;

    @Column('boolean',{
        default: false,
        name: 'is_encashment',
    })
    isEncashment: boolean;

    @Column('decimal',{
        nullable: true,
        name: 'encashment_limit',
        precision: 10,
        scale: 1
    })
    encashmentLimit: number;

    @ManyToOne(() => LeavePolicyTypeEntity, (leavePolicyType) => leavePolicyType.entitlements, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'leave_type_id'})
    leavePolicyType: LeavePolicyTypeEntity;

}