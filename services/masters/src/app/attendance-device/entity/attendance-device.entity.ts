import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('attendance_device')
export class AttendanceDevEntity extends AbstractEntity {

    @Column('int', {
        nullable: false,
        name: 'branch_id'
    })
    branchId: number;

    @Column('varchar',{
        nullable:false,
        length: 50,
        name: 'device_type'
    })
    deviceType: string;

    @Column('varchar',{
        nullable:false,
        length: 50,
        name: 'is_Active'
    })
    isActive: boolean;
}