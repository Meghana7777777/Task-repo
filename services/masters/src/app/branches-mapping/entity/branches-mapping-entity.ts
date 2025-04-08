import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('branches_mapping')
export class BranchesMappingEntity extends AbstractEntity {

    @Column('int', {
        nullable: false,
        name: 'branch_id'
    })
    branchId: number;

    @Column("int", {
        nullable: false,
        name: "department_id"
    })
    departmentId: number;

    @Column('int', {
        name: 'division_id',
        nullable: false,
    })
    divisionId: number
}