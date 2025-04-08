import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendanceAdjustment } from "./attendance-adjustment.entity";



@Injectable()
export class AttendanceAdjustmentRepo extends Repository<AttendanceAdjustment> {

    constructor(@InjectRepository(AttendanceAdjustment) private attenAdjustmentRepo: Repository<AttendanceAdjustment>
    ) {
        super(attenAdjustmentRepo.target, attenAdjustmentRepo.manager, attenAdjustmentRepo.queryRunner);
    }


}