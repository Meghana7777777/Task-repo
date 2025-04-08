import { Column, CreateDateColumn, Entity,  UpdateDateColumn, VersionColumn } from "typeorm";
import { AbstractEntity} from "../../../database/common-entities"
import { LeaveApprovalStatusEnum } from "@hrexpert/shared-models";


@Entity('over_time')
export class ApplyOTEntity  extends AbstractEntity{


    @Column('varchar', {
        nullable: false,
        length: 50,
        name: 'employee_name'
    })
    employeeName: string;

    @Column('varchar', {
        nullable: false,
        length: 50,
        name: 'date'
    })
    date: string;

    @Column({
        name: 'in_time'
    })
    inTime: Date;

    @Column({
        name: 'out_time'
    })
    outTime: Date;

    @Column('varchar', {
        nullable: false,
        name: 'working_hours'
    })
    workingHours: string;

    @Column({
        type: 'enum',
        enum: LeaveApprovalStatusEnum,
        nullable: true,
        default: LeaveApprovalStatusEnum.OPEN,
        name: 'status'
    })
    status: LeaveApprovalStatusEnum;




}

