import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConsolidatedAttendanceLogEntity } from "../entity/consoladate-attendance-logs.entity";
import { AttendanceDto } from "@hrexpert/shared-models";
import { ConfigService } from "@nestjs/config";



@Injectable()
export class ConsolidatedAttendanceLogRepository extends Repository<ConsolidatedAttendanceLogEntity> {
    dbNames: any;

    constructor(@InjectRepository(ConsolidatedAttendanceLogEntity) private consolidatedAttendanceLogRepository: Repository<ConsolidatedAttendanceLogEntity>,
    private readonly configService: ConfigService
    ) {
        super(consolidatedAttendanceLogRepository.target, consolidatedAttendanceLogRepository.manager, consolidatedAttendanceLogRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getEmployeeWorkingHrs(req?: AttendanceDto): Promise<any> {
        console.log(req, 'qqqqreq')
        let query = `
            SELECT 
                ed.first_name AS empName,
                cal.employee_code AS empCode,
                cal.log_date AS attendanceDate,
                ed.department_id,
                ed.id,
                 ed.employee_type_id AS employeeTypeId,
                et.name AS employeeType,
                d.name AS department,
                b.branch_name AS branches,
                de.name AS designation,
                di.division_name AS divisionName,
                DATE_FORMAT(cal.in_time_1, '%H:%i') AS inTime1,
                DATE_FORMAT(cal.out_time_1, '%H:%i') AS outTime1,
                CASE
                    WHEN cal.in_time_1 IS NULL OR cal.out_time_1 IS NULL THEN '00:00'
                    WHEN cal.out_time_1 = '00:00' OR cal.out_time_1 < cal.in_time_1 THEN '00:00'
                    ELSE DATE_FORMAT(TIMEDIFF(cal.out_time_1, cal.in_time_1), '%H:%i')
                END AS duration1,
                DATE_FORMAT(cal.in_time_2, '%H:%i') AS inTime2,
                DATE_FORMAT(cal.out_time_2, '%H:%i') AS outTime2,
                CASE
                    WHEN cal.in_time_2 IS NULL OR cal.out_time_2 IS NULL THEN '00:00'
                    WHEN cal.out_time_2 = '00:00' OR cal.out_time_2 < cal.in_time_2 THEN '00:00'
                    ELSE DATE_FORMAT(TIMEDIFF(cal.out_time_2, cal.in_time_2), '%H:%i')
                END AS duration2,
                DATE_FORMAT(cal.in_time_3, '%H:%i') AS inTime3,
                DATE_FORMAT(cal.out_time_3, '%H:%i') AS outTime3,
                CASE
                    WHEN cal.in_time_3 IS NULL OR cal.out_time_3 IS NULL THEN '00:00'
                    WHEN cal.out_time_3 = '00:00' OR cal.out_time_3 < cal.in_time_3 THEN '00:00'
                    ELSE DATE_FORMAT(TIMEDIFF(cal.out_time_3, cal.in_time_3), '%H:%i')
                END AS duration3,
                DATE_FORMAT(cal.in_time_4, '%H:%i') AS inTime4,
                DATE_FORMAT(cal.out_time_4, '%H:%i') AS outTime4,
                CASE
                    WHEN cal.in_time_4 IS NULL OR cal.out_time_4 IS NULL THEN '00:00'
                    WHEN cal.out_time_4 = '00:00' OR cal.out_time_4 < cal.in_time_4 THEN '00:00'
                    ELSE DATE_FORMAT(TIMEDIFF(cal.out_time_4, cal.in_time_4), '%H:%i')
                END AS duration4,
                DATE_FORMAT(cal.in_time_5, '%H:%i') AS inTime5,
                DATE_FORMAT(cal.out_time_5, '%H:%i') AS outTime5,
                CASE
                    WHEN cal.in_time_5 IS NULL OR cal.out_time_5 IS NULL THEN '00:00'
                    WHEN cal.out_time_5 = '00:00' OR cal.out_time_5 < cal.in_time_5 THEN '00:00'
                    ELSE DATE_FORMAT(TIMEDIFF(cal.out_time_5, cal.in_time_5), '%H:%i')
                END AS duration5,
                DATE_FORMAT(cal.in_time_6, '%H:%i') AS inTime6,
                DATE_FORMAT(cal.out_time_6, '%H:%i') AS outTime6,
                CASE
                    WHEN cal.in_time_6 IS NULL OR cal.out_time_6 IS NULL THEN '00:00'
                    WHEN cal.out_time_6 = '00:00' OR cal.out_time_6 < cal.in_time_6 THEN '00:00'
                    ELSE DATE_FORMAT(TIMEDIFF(cal.out_time_6, cal.in_time_6), '%H:%i')
                END AS duration6,
                cal.total_hours AS totalHours
            FROM ${this.dbNames.lms}.consolidated_attendance_log cal
                LEFT JOIN ${this.dbNames.ems}.employee ed ON cal.employee_code = ed.employee_code
                LEFT JOIN ${this.dbNames.ems}.departments d ON ed.department_id = d.id
                LEFT JOIN ${this.dbNames.ems}.branches b ON ed.branch_id = b.id
                LEFT JOIN ${this.dbNames.ems}.division di ON ed.division_id = di.id
                LEFT JOIN ${this.dbNames.ems}.designations de ON ed.designation_id = de.id
                 LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id = ed.employee_type_id
                where 1=1 `;

        if (req.attnFromDate != undefined && req.attnToDate != undefined) {
            query = query + ` and cal.log_date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`
        }
        if (req.departmentId != undefined) {
            query = query + ` and ed.department_id = "${req.departmentId}"`
        }
        if (req.desginationid != undefined) {
            query = query + ` and ed.designation_id = "${req.desginationid}"`
        }
        if (req.branch != undefined) {
            query = query + ` and ed.branch_id = ${req.branch}`
        }
        if (req.divisionId != undefined) {
            query = query + ` and ed.division_id = "${req.divisionId}"`
        }
        if (req.employeeId != undefined) {
            query = query + ` and ed.emp_id = "${req.employeeId}"`
        }
        if (req.employeeCode != undefined) {
            query = query + ` and cal.employee_code = "${req.employeeCode}"`
        }
        if (req.employeeTypeId != undefined) {
            query = query + ` and ed.employee_type_id = "${req.employeeTypeId}"`
        }
        console.log(query, 'query')
        return await this.consolidatedAttendanceLogRepository.query(query)
    }

}











