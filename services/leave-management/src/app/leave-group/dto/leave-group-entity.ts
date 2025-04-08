import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity, OneToMany } from "typeorm";
import { LeaveTypeGroupMapping } from "../../leave-policy/entites/leave-type-group-mapping.entity";

@Entity('leave_group')
export class LeaveGroupEntity extends AbstractEntity{
    @Column('varchar',{
        name: 'code',
        length: 20,
        nullable: false
    })
    code: string

    @Column('varchar',{
        name: 'name',
        nullable: false,
        length: 60,
    })
    name: string

    @OneToMany((type) => LeaveTypeGroupMapping, (leaveTypeGroup) => leaveTypeGroup, { cascade: true, onUpdate: 'CASCADE',onDelete:'RESTRICT' })
    leaveTypeGroup: LeaveTypeGroupMapping[];
}