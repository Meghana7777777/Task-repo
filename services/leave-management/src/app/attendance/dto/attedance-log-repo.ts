import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendanceLog } from "./attendance-log-entity";



@Injectable()
export class AttendanceLogRepo extends Repository<AttendanceLog> {

    constructor(@InjectRepository(AttendanceLog) private attenLogRepo: Repository<AttendanceLog>
    ) {
        super(attenLogRepo.target, attenLogRepo.manager, attenLogRepo.queryRunner);
    }


}