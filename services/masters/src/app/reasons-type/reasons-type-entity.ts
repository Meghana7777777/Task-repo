import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('reasons_type')
export class ReasonsTypeEntity extends AbstractEntity{
    
    @Column('int',{
        name:'id',
    })
    id: number;
    
    @Column('varchar', {
        name: 'name',
        nullable: false,
    })
    name: string;

}