import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('domain')
export class DomainEntity {

    @PrimaryGeneratedColumn('increment', { name: 'domain_id' })
    domainId: number;

    @Column('varchar', { length: 50, nullable: false, name: 'domain_type' })
    domainType: string;

    @Column('boolean', { nullable: false, name: 'is_active' })
    isActive: boolean;
}
