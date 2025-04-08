import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendanceSwipes } from "../dto/attendance-swipes-entity";



@Injectable()
export class AttendanceSwipesRepository extends Repository<AttendanceSwipes> {

  constructor(@InjectRepository(AttendanceSwipes) private attendanceSwipesRepo: Repository<AttendanceSwipes>
  ) {
    super(attendanceSwipesRepo.target, attendanceSwipesRepo.manager, attendanceSwipesRepo.queryRunner);
  }

  async getAttendanceNewSwipes(): Promise<Partial<AttendanceSwipes>[]> {
    return await this.attendanceSwipesRepo
      .createQueryBuilder('attendance_swipes')
      .select(['attendance_swipes.id', 'attendance_swipes.employeeNumber', 'attendance_swipes.employeeName', 'attendance_swipes.swipeDate', 'attendance_swipes.swipeTime', 'attendance_swipes.inOut', 'attendance_swipes.branch', 'attendance_swipes.status', 'attendance_swipes.downloadedDateTime', 'attendance_swipes.branch'])
      .where('attendance_swipes.status = :status', { status: 0 })
      .orderBy('attendance_swipes.swipeDate', 'ASC')
      .addOrderBy('attendance_swipes.swipeTime', 'ASC')
      .limit(7000)
      .getMany();
  }




}