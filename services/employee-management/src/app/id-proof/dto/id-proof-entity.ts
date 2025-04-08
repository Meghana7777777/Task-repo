import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('id_proof')
export class IdProof extends AbstractEntity{
    
    @Column('varchar', {
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column('varchar', {
        name: 'regex',
        nullable: false,
    })
    regex: string;
}