import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";

@Entity('attendance_status')
export class AttendanceStatusEntity extends AbstractEntity {

    @Column('int', {
        name: 'branch_id',
        nullable: false,
    })
    branchName: number;
    
    @Column('varchar', {
        name: 'attendance_status',
        nullable: false,
    })
    attendanceStatus: string;

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
