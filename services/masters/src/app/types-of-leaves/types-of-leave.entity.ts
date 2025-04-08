
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('types_of_leaves')
export class TypesOfLeaves extends AbstractEntity{
    
   
    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'type_of_leave'
    })
    typeOfLeave: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'leave_code'
    })
    leaveCode: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'default_leaves'
    })
    defaultLeaves: number;

   
}