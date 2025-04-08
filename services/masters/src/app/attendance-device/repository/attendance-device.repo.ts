import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Branches } from "../../../../../employee-management/src/app/branches/branches.entity";
import { AttendanceDevEntity } from "../entity/attendance-device.entity";



@Injectable()
export class AttendanceDevRepository extends Repository<AttendanceDevEntity> {

    constructor(@InjectRepository(AttendanceDevEntity) private attendanceDevRepo: Repository<AttendanceDevEntity>
    ) {
        super(attendanceDevRepo.target, attendanceDevRepo.manager, attendanceDevRepo.queryRunner);
    }


    async getAttendanceDevice (): Promise<any> {
    let query = this.createQueryBuilder("a")
    .select(`a.device_type as deviceType, b.branch_name as branch ,a.is_active,a.id,b.id as branchId`)
    .leftJoin(Branches, 'b', `b.id = a.branch_id`)
    const result = await query.getRawMany();
  
  return result; 
  }

}