import { CriteriaEnum, TypeOfEntityEnum } from "@hrexpert/shared-models";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('leave_type_applicability')
export class LeaveTypeApplicabilityEntity extends AbstractEntity{
    @Column('enum',{
        name: 'type_of_entity',
        enum: TypeOfEntityEnum,
    })
    typeOfEntity: TypeOfEntityEnum

    @Column('int',{
        name: 'reference_id',
        nullable: false
    })
    referenceId: number

    @Column('enum',{
        name: 'criteria',
        enum: CriteriaEnum
    })
    criteria: CriteriaEnum

    @Column('varchar',{
        name: 'criteria_reference',
        nullable: true,
        length: 50
    })
    criteriaReference: string
}