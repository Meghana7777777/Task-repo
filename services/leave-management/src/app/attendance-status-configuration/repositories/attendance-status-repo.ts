import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendanceStatusEntity } from "../attendance-status.entity";
import { Branches } from '../../../../../employee-management/src/app/branches/branches.entity'
import { ConfigService } from "@nestjs/config";
import { AttendanceStatusDto } from "../atten.dto";


@Injectable()
export class AttendanceStatusRepository extends Repository<AttendanceStatusEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(AttendanceStatusEntity) private attendanceStatusRepository: Repository<AttendanceStatusEntity>,
    private readonly configService: ConfigService
    ) {
        super(attendanceStatusRepository.target, attendanceStatusRepository.manager, attendanceStatusRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getAllAttendanceStatus(req: AttendanceStatusDto): Promise<any> {
        let query = `SELECT  a.id AS id,
                b.branch_name AS branchName,
                a.attendance_status AS attendanceStatus,
                a.start_time AS startTime,
                a.end_time AS endTime,
                a.is_active AS isActive,
                a.branch_id AS branchId
                FROM ${this.dbNames.lms}.attendance_status a 
               LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id`
        
        
        if (req.branchId != undefined) {
            query = query + ` and a.branch_id = ${req.branchId}`
        }
       
        
        return await this.attendanceStatusRepository.query(query)
    }
        

}