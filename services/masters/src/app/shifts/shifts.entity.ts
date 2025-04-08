import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('shifts')
export class ShiftsEntity extends AbstractEntity {

    @Column('int', {
        name: 'branch_id',
        nullable: false,
    })
    branchName: number;
    
    @Column('varchar', {
        name: 'shift_type',
        nullable: false,
    })
    shiftType: string;

    @Column('varchar', {
        name: 'start_time',
        nullable: false,
    })
    startTime: string;

    @Column('varchar', {
        name: 'end_time',
        nullable: false,
    })
    endTime: string;
}
