import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AttendanceLog{
    @PrimaryGeneratedColumn({
        name:'attendace_log_id'
    })
    attendanceLogId: number;

    @Column('varchar',{
        name:'log_date',
        nullable: true,
    })
    logDate:string

    @Column('int',{
        name:'employee_id',
        nullable: true,
    })
    employeeId:number
    
    @Column('varchar',{
        name:'employee_code',
        nullable: true,
    })
    employeeCode:string

    @Column('varchar',{
        name:'employee_name',
        nullable: true,
    })
    employeeName:string

    @Column('varchar',{
        name:'device_code',
        nullable: true,
    })
    deviceCode:string

    @Column('date',{
        name:'download_date',
        nullable: true,
    })
    downloadDate:Date

    @Column('varchar',{
        name:'verify_mode',
        nullable: true,
    })
    verifyMode:string

    @Column('varchar',{
        name:'direction',
        nullable: true,
    })
    direction:string

    @Column('boolean', {
        nullable: false,
        default: true,
        name: 'status',
    })
    status: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

}