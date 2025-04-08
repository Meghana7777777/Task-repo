
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('relations')
export class Relations extends AbstractEntity{
    
    @Column('varchar', {
        name: 'relation',
        nullable: false,
    })
    relation: string;

   
}