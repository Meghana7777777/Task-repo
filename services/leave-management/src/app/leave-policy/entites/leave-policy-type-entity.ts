import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { CreditTypeEnum, LeaveTypeEnum, UOMEnum, YesNoEnum } from "@hrexpert/shared-models";
import { LeaveTypeGroupMapping } from "./leave-type-group-mapping.entity";
import { EntitlementEntity } from "./entitlement-entity";

@Entity('leave_type')
export class LeavePolicyTypeEntity extends AbstractEntity{
    @Column('varchar',{
        name: 'leave_code',
        length: 10,
        nullable: false
    })
    leaveCode: string

    @Column('varchar',{
        name: 'leave_name',
        length: 50,
        nullable: false
    })
    leaveName: string

    @Column('enum',{
        name: 'leave_type',
        enum: LeaveTypeEnum
    })
    leaveType: LeaveTypeEnum

    @Column('enum',{
        name: 'uom',
        enum: UOMEnum
    })
    uom: UOMEnum

    @Column('date',{
        name: 'valid_from'
    })
    validFrom: Date

    @Column('date',{
        name: 'valid_to',
    })
    validTo: Date
    
    @Column('decimal',{
        name: 'min_limit',
        precision: 10,
        scale: 1,
    })
    minLimit: number
    
    @Column('decimal',{
        name: 'max_limit',
        precision: 10,
        scale: 1,
    })
    maxLimit: number
    
    @Column('int',{
        name: 'cut_off_date',
        nullable: false
    })
    cutOffDate: number
    
    @Column('enum',{
        name: 'over_time',
        nullable: false,
        enum: YesNoEnum
    })
    overTime: YesNoEnum

    @Column('enum',{
        name: 'credit_type',
        nullable: false,
        enum: CreditTypeEnum
    })
    creditType: CreditTypeEnum

    @OneToMany(() => LeaveTypeGroupMapping, (leaveTypeGroup) => leaveTypeGroup.leavePolicyType, {
        cascade: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    leaveTypeGroup: LeaveTypeGroupMapping[];

    @OneToMany(() => EntitlementEntity, (entitlement) => entitlement.leavePolicyType, {
        cascade: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    })
    entitlements: EntitlementEntity[];
}