import {
  AttenCoOffDto,
  AttendanceDto,
  CommonResponseModel,
  DashboardReq,
  GenderEnum,
  lateMinReq,
  ReportingManagerReq,
} from '@hrexpert/shared-models';
import {
  EmpAttendanceSrcCardReq,
  MonthWIseEmpReportReq,
} from '@hrexpert/shared-services';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';
import { AttendanceAdjustRequest } from './attendance-adjustment.request';
import { AttendanceEntity } from './attendance-entity';
import { MonthReq } from './month-req';
import { OTBulkApprovalDto } from './ot-bulkapproval-dto';
import { Branches } from 'services/employee-management/src/app/branches/branches.entity';
import { DepartmentsEntity } from 'services/employee-management/src/app/departments/entites/departments-entity';
import { DesignationsEntity } from 'services/employee-management/src/app/designations/entites/designations.entity';
import { Division } from 'services/employee-management/src/app/division/division.entity';
import { Employee } from 'services/employee-management/src/app/employee-onboarding/entities/employee-details.entity';

@Injectable()
export class AttendanceRepo extends Repository<AttendanceEntity> {
  private readonly dbNames: any;

  constructor(
    @InjectRepository(AttendanceEntity)
    private attenRepo: Repository<AttendanceEntity>,
    private dataSource: DataSource,
    private readonly configService: ConfigService
  ) {
    super(attenRepo.target, attenRepo.manager, attenRepo.queryRunner);
    this.dbNames = this.configService.get('dbNames');
  }

  async getEmpAttendanceRecordByDate(
    date: string,
    empId: number
  ): Promise<any> {
    const query = this.createQueryBuilder('attendance')
      .select(` emp_id, department_id, shift, attn_status, in_time, out_time`)
      .where(` date = '${date}' AND emp_id = '${empId}' `);
    return await query.getRawOne();
  }

  async getAttendceWithEmpIdAndDate(
    month: number,
    year: number,
    empId: number
  ) {
    const query = await this.createQueryBuilder('attendance')
      .select('*')
      .where(`month(date) = "${month}"`)
      .andWhere(`year(date) = "${year}"`)
      .andWhere(`emp_id = '${empId}'`)
      .getRawMany();
    return query;
  }

  async getAttendanceWeekWiseWithEmpIdAndDate(
    month: number,
    year: number,
    empId: number,
    fromDate?: string,
    toDate?: string
  ) {
    let query = `
        SELECT *
        FROM ${this.dbNames.lms}.attendance a
        LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
        LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
        WHERE
          a.emp_id = ${empId}
        AND et.name = 'WEEKLY WORKER'`;

    if (fromDate && toDate) {
      query += ` AND date BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    const results = await this.query(query);
    return results;
  }

  // async countAllEmployees(req: EmployeeFilterReq): Promise<number> {
  //     let query = `
  //         SELECT COUNT(*) AS total
  //         FROM
  //             dev_hrms_ems.employee e
  //         LEFT JOIN
  //             dev_hrms_masters.branches b ON b.id = e.branch
  //         LEFT JOIN
  //             dev_hrms_masters.departments dep ON dep.id = e.department_id
  //         LEFT JOIN
  //             dev_hrms_masters.designations des ON des.id = e.designation_id
  //         LEFT JOIN
  //             dev_hrms_masters.division divi ON divi.id = e.division
  //         WHERE 1=1`;

  //     // Apply filters
  //     if (req.department) {
  //         query += ` AND dep.name = '${req.department}'`;
  //     }
  //     if (req.designation) {
  //         query += ` AND des.name = '${req.designation}'`;
  //     }

  //     const result = await this.query(query);
  //     return result[0]?.total || 0;
  // }

  async getAllAttendance(req: AttendanceDto): Promise<any> {
    let query = `SELECT 
                     a.designation_id AS desginationid,
                     a.department_id AS departmentId,
                     a.division_id AS divisionId,
                     d.division_name AS divisionName,
                     dp.name AS department,
                     ds.name AS designation,
                     e.first_name AS empName,
                     a.emp_id AS employeeId,
                     a.emp_code AS empCode, 
                     a.id AS attendanceId, 
                     a.branch_id AS branchesId,
                     b.branch_name as branches,
                     a.date AS attendanceDate,
                     a.freeze_status AS freezeStatus,
                     a.in_time AS inTime,
                     a.out_time AS outTime,
                     CASE 
                        WHEN a.in_time IS NOT NULL AND a.out_time IS NOT NULL AND TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) >= 0 
                            THEN TIMEDIFF(a.out_time, a.in_time)
                        ELSE '00:00:00' 
                     END AS workingHours,
                     a.leave_status AS leaveStatus,
                     a.attn_status AS attnStatus,
                     a.shift AS shift,
                     (SELECT SUM(la.final_late_min) FROM ${this.dbNames.lms}.late_minutes_records la WHERE la.employee_code = a.emp_code AND la.date = a.date) AS lateMin,
                     (SELECT SUM(la.final_late_min) FROM ${this.dbNames.lms}.late_minutes_records la WHERE la.employee_code = a.emp_code AND la.date = a.date AND (la.swipes_enum != 'FIRSTIN' AND la.swipes_enum != 'LASTOUT')) AS momentsLateMin,
                     a.cum_late_min AS cumLateMin
                     FROM ${this.dbNames.lms}.attendance a
                     INNER JOIN ${this.dbNames.ems}.employee e ON e.employee_code=a.emp_code
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=a.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=a.department_id 
                     LEFT JOIN ${this.dbNames.ems}.division d ON d.id=a.division_id
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id
                     WHERE 1=1
                       `;
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    if (req.departmentId != undefined) {
      query = query + ` and a.department_id = "${req.departmentId}"`;
    }
    if (req.desginationid != undefined) {
      query = query + ` and a.designation_id = "${req.desginationid}"`;
    }
    if (req.branch != undefined) {
      query = query + ` and a.branch_id = ${req.branch}`;
    }
    if (req.divisionId != undefined) {
      query = query + ` and a.division_id = "${req.divisionId}"`;
    }
    if (req.employeeId != undefined) {
      query = query + ` and a.emp_id = "${req.employeeId}"`;
    }
    if (req.employeeCode != undefined) {
      query = query + ` and a.emp_code = "${req.employeeCode}"`;
    }
    if (req.attnStatus != undefined) {
      query = query + ` and a.attn_status = "${req.attnStatus}"`;
    }
    if (req.employeeTypeId != undefined) {
      if (req.employeeTypeId === 1) {
        query = query + ` and e.employee_type_id = "${req.employeeTypeId}"`;
      } else if (req.employeeTypeId !== 1) {
        query = query + ` and e.employee_type_id != 1`;
      }
    }
    query += ` ORDER BY a.date ASC`;
    // query = query + ` GROUP BY e.employee_code`
    return await this.attenRepo.query(query);
  }

  async getAllAbsentsReport(req: AttendanceDto): Promise<any> {
    let query = `SELECT 
                     e.designation_id as desginationid,
                     e.department_id as departmentId,
                     dp.name AS department,
                     ds.name AS designation,
                     a.branch_id AS branchesId,
                     b.branch_name as branches,
                     e.employee_code AS empCode,
                     e.salutation,
                     e.first_name AS empName,
                     a.emp_id AS employeeId,
                     e.gender,
                     a.division_id AS divisionId,
                     d.division_name AS divisionName,
                     DATE_FORMAT(a.date, '%d-%m-%Y') AS attendanceDate, 
                     SUM(IF(attn_status="P",1,0)) AS presentCount,
                     SUM(IF(attn_status="A",1,0))AS absentCount 
                     FROM ${this.dbNames.lms}.attendance a
                     LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_id=e.id
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=e.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=e.department_id 
                      LEFT JOIN ${this.dbNames.ems}.division d ON d.id=a.division_id
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id

                     WHERE a.emp_id >0
                       `;

    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    if (req.departmentId != undefined) {
      query = query + ` and e.department_id = ${req.departmentId}`;
    }
    if (req.desginationid != undefined) {
      query = query + ` and e.designation_id = ${req.desginationid}`;
    }
    if (req.branch != undefined) {
      query = query + ` and a.branch_id = ${req.branch}`;
    }
    if (req.divisionId != undefined) {
      query = query + ` and a.division_id = "${req.divisionId}"`;
    }
    if (req.employeeId != undefined) {
      query = query + ` and a.emp_id = "${req.employeeId}"`;
    }
    if (req.employeeCode != undefined) {
      query = query + ` and a.emp_code = "${req.employeeCode}"`;
    }
    query = query + ` GROUP BY a.emp_id`;
    return await this.attenRepo.query(query);
  }

  async getAllForBulkOTApproval(req: OTBulkApprovalDto): Promise<any> {
    // console.log(req,'#################')
    let query = `SELECT  a.created_user as createdUser,
                     a.manual_entry as manualEntry,
                     a.created_at as createdAt,s.start_time as shiftIn,s.end_time as shiftOut,TIMEDIFF((TIMEDIFF(a.out_time, a.in_time)),(TIMEDIFF(s.end_time,s.start_time))) AS otHours,TIMEDIFF((TIMEDIFF(a.out_time, a.in_time)),(TIMEDIFF(s.end_time,s.start_time))) AS finalOtHours,a.id AS attendanceId,a.date AS attendanceDate,a.emp_id AS employeeId,TIME(a.in_time) AS inTime,TIME(a.out_time) AS outTime,TIMEDIFF(a.out_time, a.in_time) AS workingHrs,TIMEDIFF(s.end_time,s.start_time) AS shiftDuration,
                    a.shift AS shiftId,a.department_id AS departmentId,a.designation_id AS designationId ,
                    s.shift_type AS shiftType,d.name AS department,e.employee_code AS empCode,e.salutation,e.first_name AS employee,
                    (s.start_time-s.end_time) AS diff,a.ot_status as otStatus,
                CASE 
        WHEN ABS(TIMESTAMPDIFF(HOUR, s.start_time, TIME(a.in_time))) > 5 THEN 'Shift Change'
        WHEN TIMEDIFF(TIME(a.in_time),s.start_time) >1 THEN 'Late In'
        WHEN TIMEDIFF(TIME(a.out_time),s.end_time) < 1 THEN 'Early Out'
	    WHEN TIMEDIFF(TIME(a.out_time),s.end_time) > 1 THEN 'Late Out'
        ELSE 'No Remarks'
        END AS remarks
        
                FROM ${this.dbNames.lms}.attendance a
                LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id=a.shift
                LEFT JOIN ${this.dbNames.masters}.departments d ON d.id=a.department_id
                LEFT JOIN ${this.dbNames.ems}.employee e ON e.id=a.emp_id
                where a.id>0 
                      `;
    if (req.reportType === undefined) {
      query =
        query +
        `  and (TIMEDIFF((TIMEDIFF(a.out_time, a.in_time)),(TIMEDIFF(s.end_time,s.start_time)))) >= 1`;
    }
    if (req.departmentId != undefined) {
      query = query + ` and a.department_id=${req.departmentId}`;
    }
    if (req.date != undefined) {
      query = query + ` and a.date="${req.date}"`;
    }
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    if (req.shiftId != undefined) {
      query = query + ` and a.shift=${req.shiftId}`;
    }
    if (req.reportType === 'AUDIT LOGS') {
      query = query + ` and a.manual_entry='YES'`;
    }
    if (req.reportType === 'MISLENIOUS') {
      // query=query+` and attn_status='P' and (TIMEDIFF(a.out_time, a.in_time)) < (TIMEDIFF(s.end_time,s.start_time))`
      query = query + ` and attn_status='P' and a.shift is not null`;
    }
    return await this.attenRepo.query(query);
  }

  async getLateAndEarlyEntryEmployees(req: AttendanceDto): Promise<any> {
    // console.log(req, "req")
    try {
      let query = `SELECT  a.emp_code AS empCode,a.emp_name AS empName,a.date AS attendanceDate,
            a.in_time AS inTime, a.out_time AS outTime, a.wk_hours AS totalWorkingHours,
                 a.emp_id AS employeeId,
                     a.emp_code AS empCode, 
                     a.id AS attendanceId, 
                     a.branch_id AS branchesId,
                     b.branch_name as branches,
                     a.designation_id AS desginationid,
                     a.department_id AS departmentId,
                     a.division_id AS divisionId,
                     d.division_name AS divisionName,
                     dp.name AS department,
                     ds.name AS designation,
                     a.attn_status AS attnStatus,
                     e.employee_type_id AS employeeTypeId,
                et.name AS employeeType,
                CASE 
                    WHEN TIME_TO_SEC(TIMEDIFF(a.out_time, a.in_time)) < 25200 THEN 'Yes' -- 25200 seconds = 7 hours
                    ELSE 'No' 
                END AS lessWorkingHours,
                CASE 
                    WHEN TIME(a.in_time) > '09:45:00' THEN 'Yes' 
                    ELSE 'No' 
                END AS lateEntry,
                CASE 
                    WHEN TIME(a.out_time) < '18:45:00' THEN 'Yes' 
                    ELSE 'No' 
                END AS earlyExit 

            FROM ${this.dbNames.lms}.attendance a
                     LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_code=e.employee_code
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=a.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=a.department_id 
                     LEFT JOIN ${this.dbNames.ems}.division d ON d.id=a.division_id
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id
                     LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
            WHERE 1 = 1`;
      if (req.attnFromDate != undefined && req.attnToDate != undefined) {
        query =
          query +
          ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
      }
      if (req.departmentId != undefined) {
        query = query + ` and a.department_id = "${req.departmentId}"`;
      }
      if (req.desginationid != undefined) {
        query = query + ` and a.designation_id = "${req.desginationid}"`;
      }
      if (req.branch != undefined) {
        query = query + ` and a.branch_id = ${req.branch}`;
      }
      if (req.divisionId != undefined) {
        query = query + ` and a.division_id = "${req.divisionId}"`;
      }
      if (req.employeeId != undefined) {
        query = query + ` and a.emp_id = "${req.employeeId}"`;
      }
      if (req.employeeCode != undefined) {
        query = query + ` and a.emp_code = "${req.employeeCode}"`;
      }
      if (req.employeeTypeId != undefined) {
        query = query + ` and e.employee_type_id = "${req.employeeTypeId}"`;
      }
      // query = query + ` GROUP BY e.employee_code`
      return await this.attenRepo.query(query);
    } catch (err) {
      throw err;
    }
  }

  async getAllForBulkOTApplyApprove(req: OTBulkApprovalDto): Promise<any> {
    // console.log(req,'#################')
    let query = `SELECT a.emp_id AS employeeId, e.employee_code AS empCode,e.salutation,e.first_name AS employee,a.date,
	                    TIME(a.in_time) AS inTime, 
	                    TIME(a.out_time) AS outTime,
                        et.name AS employeeType,
	                    TIMEDIFF(a.out_time, a.in_time) AS workingHrs,
                                a.shift AS shiftId,a.department_id AS departmentId,a.designation_id AS designationId ,a.division_id as divisionId,dv.division_name as divisionName,
                                a.branch_id,b.branch_name AS branches,
                                s.shift_type AS shiftType,d.name AS department,
                            CASE 
                            WHEN TIMEDIFF(a.out_time, a.in_time) > '08:00:00' THEN 
                                TIMEDIFF(TIMEDIFF(a.out_time, a.in_time), '08:00:00')
                            ELSE '00:00:00'
                        END AS otHours
                FROM ${this.dbNames.lms}.attendance a
                LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id=a.shift
                LEFT JOIN ${this.dbNames.ems}.departments d ON d.id=a.department_id
                LEFT JOIN ${this.dbNames.ems}.designations de ON de.id=a.designation_id
                LEFT JOIN ${this.dbNames.ems}.employee e ON e.id=a.emp_id
                LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
                LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id
                LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id=a.division_id
                where a.id>0 AND TIMEDIFF(a.out_time, a.in_time) > '08:00:00' AND et.name != "EMPLOYEE" 
                AND (a.ot_status IS NULL OR a.ot_status = '')`;
    if (req.departmentId != undefined) {
      query = query + ` and a.department_id = ${req.departmentId}`;
    }
    if (req.date != undefined) {
      query = query + ` and a.date="${req.date}"`;
    }
    if (req.branchId != undefined) {
      query = query + ` and a.branch_id = ${req.branchId}`;
    }
    if (req.employeeId != undefined) {
      query = query + ` and e.id = ${req.employeeId}`;
    }
    if (req.divisionId != undefined) {
      query = query + ` and e.division_id = ${req.divisionId}`;
    }
    if (req.shiftId != undefined) {
      query = query + ` and a.shift=${req.shiftId}`;
    }
    if (req.reportType === 'AUDIT LOGS') {
      query = query + ` and a.manual_entry='YES'`;
    }
    if (req.reportType === 'MISLENIOUS') {
      // query=query+` and attn_status='P' and (TIMEDIFF(a.out_time, a.in_time)) < (TIMEDIFF(s.end_time,s.start_time))`
      query = query + ` and attn_status='P' and a.shift is not null`;
    }
    return await this.attenRepo.query(query);
  }

  async getAttStatusDataRepo(req: any): Promise<any> {
    let query = `
            SELECT emp_id AS empId, emp_Code AS empCode, emp_name AS empName, date AS date,attn_status AS attendanceStatus
            FROM ${this.dbNames.lms}.attendance
        `;
    if (req.employeeId != undefined) {
      query = query + ` and a.emp_id=${req.employeeId}`;
    }
    if (req.reportType != undefined && req.reportType === 'OT') {
      query = query + ` and a.ot_status =0`;
    }
    return await this.attenRepo.query(query);
  }

  async getWorkingHoursReport(req: OTBulkApprovalDto): Promise<any> {
    let query = `
            SELECT
                a.date AS date,
                a.emp_id AS empId,
                a.in_time AS inTime,
                a.out_time AS outTime,
                a.wk_hours AS workingHrs,
                e.emp_code AS empCode,
                CONCAT(e.first_name, ' ', e.last_name) AS empName
            FROM
                ${this.dbNames.lms}.attendance a
            LEFT JOIN 
                ${this.dbNames.ems}.employee e ON e.id = a.emp_id
                ${this.dbNames.ems}.branches br ON e.id = a.emp_id
        `;

    // if(req.date!=undefined){
    //     query=query+` and a.date="${req.date}"`
    // }
    // query = query + ` GROUP BY a.id`
    return await this.attenRepo.query(query);
  }

  async getWorkingHoursReportWithDetails(req: AttendanceDto): Promise<any> {
    let query = `
                SELECT 
                     e.designation_id AS desginationid,
                     e.department_id AS departmentId,
                     e.branch_id AS branchId,
                     e.division_id AS divisionId,
                     d.division_name AS divisionName,
                     b.branch_name AS branchName,
                     dp.name AS department,
                     ds.name AS designation,
                     e.employee_code AS empCode,
                     e.salutation,
                     e.first_name AS empName,
                     a.emp_id AS employeeId,
                     e.gender,
                     a.id,
                     a.branch AS branches,
                     a.date AS attendanceDate,
                     a.in_time AS inTime,
                     a.out_time AS outTime,
                     a.shift,
                     a.leave_status AS leaveStatus,
                     a.attn_status AS attnStatus,
                     s.shift_type AS shiftType,
                    CONCAT(s.start_time, ' - ', s.end_time) AS shiftTime,
                    TIMEDIFF(a.out_time, a.in_time) AS totalHours
                     FROM ${this.dbNames.lms}.attendance a
                     LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_id=e.id
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=e.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=e.department_id 
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=e.branch_id
                     LEFT JOIN ${this.dbNames.ems}.division d ON d.id=e.division_id
                     LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id=a.shift
        `;
    const conditions = [];
    if (req.departmentId != undefined) {
      conditions.push(`e.department_id = "${req.departmentId}"`);
    }
    if (req.desginationid != undefined) {
      conditions.push(`e.designation_id = "${req.desginationid}"`);
    }
    if (req.branchId != undefined) {
      conditions.push(`e.branch_id = "${req.branchId}"`);
    }
    if (req.divisionId != undefined) {
      conditions.push(`e.division_id = "${req.divisionId}"`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    return await this.attenRepo.query(query);
  }

  async getAttenceAdjustment(req: AttendanceAdjustRequest): Promise<any> {
    console.log(req, '1111111111111111111111111');
    let query = `
            SELECT 
                a.id,
                a.date,
                a.emp_id AS empId,
                a.attn_status AS attnStatus,
                a.in_reader AS inReader,
                a.out_reader AS outReader,
                a.ot_hours AS otHours,
                a.spl_ot_hours AS splOtHours,
                a.tr_hours AS trHours,
                a.wk_hours AS wkHours,
                a.in_time AS intTime,
                a.out_time  AS outTime,
                a.freeze_status AS freezeStatus,
                a.ot_status AS otStatus,
                a.leave_status AS leaveStatus,
                a.shift,
                e.employee_code AS employeeCode,
                e.first_name AS empName,
                s.shift_type AS shiftType
            FROM ${this.dbNames.lms}.attendance a
            LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_id = e.id
            LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id = a.shift
            WHERE a.id > 0
        `;

    if (req.empId != undefined) {
      query = query + ` and a.emp_id = ${req.empId}`;
    }
    if (req.date != undefined) {
      query = query + ` and a.date = '${req.date}'`;
    }
    query = query + ` GROUP BY a.emp_id`;
    return await this.attenRepo.query(query);
  }

  async getEmpAttendenceScoreData(
    req: EmpAttendanceSrcCardReq
  ): Promise<CommonResponseModel> {
    console.log(req, 'reqqqqq');

    let query = `
          SELECT 
            b.branch_name AS branch, 
            b.id,
            CONCAT(e.first_name, ' ', e.last_name) AS empName, 
            e.employee_code AS empCode, 
            a.date AS attendanceDate, 
            a.attn_status AS attnStatus, 
            d.name AS department, 
            des.name AS designation, 
            CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManager, 
            s.shift_type AS shift, 
            a.in_time AS inTime, 
            a.out_time AS outTime, 
            a.wk_hours AS workingHours
          FROM 
            ${this.dbNames.lms}.attendance a
          LEFT JOIN 
            ${this.dbNames.ems}.employee e ON a.emp_id = e.id
          LEFT JOIN 
            ${this.dbNames.masters}.branches b ON e.branch_id = b.id
          LEFT JOIN 
            ${this.dbNames.masters}.departments d ON e.department_id = d.id
          LEFT JOIN 
            ${this.dbNames.masters}.designations des ON e.designation_id = des.id
          LEFT JOIN 
            ${this.dbNames.ems}.employee rm ON e.reporting_manager = rm.id
          LEFT JOIN 
            ${this.dbNames.masters}.shifts s ON a.shift = s.id
          WHERE 1=1
        `;

    if (req.branch) {
      query += ` AND b.branch_name = '${req.branch}'`;
    }
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query += ` AND a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    if (req.departmentId != undefined) {
      query += ` AND e.department_id = ${req.departmentId}`;
    }
    if (req.empName != undefined) {
      query += ` AND CONCAT(e.first_name, ' ', e.last_name) = '${req.empName}'`;
    }

    // console.log(req, "req");

    return await this.attenRepo.query(query);
  }

  async getAllEmpMonthWiseData(req: MonthWIseEmpReportReq, isExcel = false): Promise<[any[], number]> {
    const startDate = dayjs(req.attendanceMonth).format('YYYY-MM-01')
    const endDate = dayjs(req.attendanceMonth).endOf('M').format('YYYY-MM-DD')

    const m = dayjs(req.attendanceMonth).format('M')

    let accumSum = ""
    for (let i = 1; i <= Number(m); i++) {
        accumSum += `nla.accum_${i} + `
    }
    accumSum = accumSum.slice(0, -3)
    
    let utilizedSum = ""
    for (let i = 1; i <= 12; i++) {
        utilizedSum += `nla.utilized_${i} + `
    }
    utilizedSum = utilizedSum.slice(0, -3)


    let query = `
            SELECT 
                a.id, 
                a.emp_id ,
                a.emp_code AS empCode, 
                a.date, 
                e.first_name AS empName, 
                a.attn_status AS attnStatus,
                d.name AS department,
                di.division_name AS divisionName,
                br.branch_name AS branchName,
                a.branch AS branches,
                a.attendance_month,
                et.name AS employeeType,
                a.leave_status,
                (SELECT SUM(la.final_late_min) FROM ${this.dbNames.lms}.late_minutes_records la WHERE la.employee_code = a.emp_code AND la.date BETWEEN '${startDate}' AND '${endDate}') AS totalLateMins,
                (SELECT (${accumSum}) - (${utilizedSum}) FROM ${this.dbNames.lms}.new_leave_allocations nla WHERE nla.employee_code = a.emp_code AND nla.leave_type_id = 1) AS available

            FROM 
                ${this.dbNames.lms}.attendance a 
            LEFT JOIN 
                ${this.dbNames.ems}.departments d ON a.department_id = d.id
            LEFT JOIN 
                ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
            LEFT JOIN 
                ${this.dbNames.ems}.division di ON e.division_id = di.id
            LEFT JOIN
                ${this.dbNames.ems}.employee_type et ON e.employee_type_id = et.id
            LEFT JOIN 
                ${this.dbNames.ems}.branches br ON a.branch_id = br.id
            WHERE a.id IS NOT NULL`;

    if (req.year) {
      query += ` AND YEAR(a.date) = ${req.year}`;
    }
    if (req.month) {
      query += ` AND MONTH(a.date) = ${req.month}`;
    }
    if (req.department) {
      query += ` AND d.name = '${req.department}'`;
    }
    if (req.division) {
      query += ` AND di.division_name = '${req.division}'`;
    }
    if (req.branch && req.branch != 'All') {
      query += ` AND a.branch_id = ${req.branch}`;
    }
    if (req.employeeId) {
      query += ` AND a.emp_id = '${req.employeeId}'`;
    }

    let empCodesString = '';
    if (req.empCodes && req.empCodes.length > 0) {
      empCodesString = req.empCodes.map((code) => `"${code}"`).join(',');
      query += ` AND a.emp_code IN (${empCodesString})`;
    }
    query += ` GROUP BY a.emp_id`;

    if (isExcel) {
      const excelData = await this.attenRepo.query(query);
      const totalCount = excelData.length;
      return [excelData, totalCount];
    }
    const offset = (req.page - 1) * req.pageSize;
    query += ` LIMIT ${req.pageSize} OFFSET ${offset}`;

    const result = await this.attenRepo.query(query);

    const countQuery = `
            SELECT COUNT(DISTINCT a.emp_id) AS totalCount
            FROM ${this.dbNames.lms}.attendance a 
            LEFT JOIN 
                ${this.dbNames.ems}.departments d ON a.department_id = d.id
            LEFT JOIN 
                ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
            LEFT JOIN 
                ${this.dbNames.ems}.division di ON e.division_id = di.id
            LEFT JOIN
                ${this.dbNames.ems
      }.employee_type et ON e.employee_type_id = et.id
            LEFT JOIN 
                ${this.dbNames.ems}.branches br ON a.branch_id = br.id
            WHERE 1=1
            ${req.year ? ` AND YEAR(a.date) = ${req.year}` : ''}
            ${req.month ? ` AND MONTH(a.date) = ${req.month}` : ''}
            ${req.department ? ` AND d.name = '${req.department}'` : ''}
            ${req.division ? ` AND di.division_name = '${req.division}'` : ''}
            ${req.branch && req.branch != 'All'
        ? ` AND a.branch_id = ${req.branch}`
        : ''
      }
            ${req.empCodes && req.empCodes.length > 0
        ? ` AND a.emp_code IN (${empCodesString})`
        : ''
      }`;

    const countResult = await this.attenRepo.query(countQuery);
    const totalCount = countResult[0]?.totalCount || 0;

    return [result, totalCount];
  }

  async getAllEmpWeekWiseData(
    req: MonthWIseEmpReportReq,
    isExcel = false
  ): Promise<[any[], number]> {
    let query = `
            SELECT 
                a.id, 
                a.emp_id ,
                a.emp_code AS empCode, 
                a.date, 
                e.first_name AS empName, 
                a.attn_status AS attnStatus,
                d.name AS department,
                di.division_name AS divisionName,
                br.branch_name AS branchName,
                a.branch AS branches,
                a.attendance_month,
                et.name AS employeeType
            FROM 
                ${this.dbNames.lms}.attendance a 
            LEFT JOIN 
                ${this.dbNames.ems}.departments d ON a.department_id = d.id
            LEFT JOIN 
                ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
            LEFT JOIN 
                ${this.dbNames.ems}.division di ON e.division_id = di.id
            LEFT JOIN
                ${this.dbNames.ems}.employee_type et ON e.employee_type_id = et.id
            LEFT JOIN 
                ${this.dbNames.ems}.branches br ON a.branch_id = br.id
            WHERE a.id IS NOT NULL AND et.name = 'WEEKLY WORKER' `;

    if (req.year) {
      query += ` AND YEAR(a.date) = ${req.year}`;
    }
    if (req.month) {
      query += ` AND MONTH(a.date) = ${req.month}`;
    }
    if (req.department) {
      query += ` AND d.name = '${req.department}'`;
    }
    if (req.division) {
      query += ` AND di.division_name = '${req.division}'`;
    }
    if (req.branch && req.branch != 'All') {
      query += ` AND a.branch_id = ${req.branch}`;
    }
    if (req.employeeId) {
      query += ` AND a.emp_id = '${req.employeeId}'`;
    }

    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }

    let empCodesString = '';
    if (req.empCodes && req.empCodes.length > 0) {
      empCodesString = req.empCodes.map((code) => `"${code}"`).join(',');
      query += ` AND a.emp_code IN (${empCodesString})`;
    }
    query += ` GROUP BY a.emp_id`;

    if (isExcel) {
      const excelData = await this.attenRepo.query(query);
      const totalCount = excelData.length;
      return [excelData, totalCount];
    }
    const offset = (req.page - 1) * req.pageSize;
    query += ` LIMIT ${req.pageSize} OFFSET ${offset}`;

    const result = await this.attenRepo.query(query);

    const countQuery = `
            SELECT COUNT(DISTINCT a.emp_id) AS totalCount
            FROM ${this.dbNames.lms}.attendance a 
            LEFT JOIN 
                ${this.dbNames.ems}.departments d ON a.department_id = d.id
            LEFT JOIN 
                ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
            LEFT JOIN 
                ${this.dbNames.ems}.division di ON e.division_id = di.id
            LEFT JOIN
                ${this.dbNames.ems
      }.employee_type et ON e.employee_type_id = et.id
            LEFT JOIN 
                ${this.dbNames.ems}.branches br ON a.branch_id = br.id
            WHERE 1=1
            ${req.year ? ` AND YEAR(a.date) = ${req.year}` : ''}
            ${req.month ? ` AND MONTH(a.date) = ${req.month}` : ''}
            ${req.department ? ` AND d.name = '${req.department}'` : ''}
            ${req.division ? ` AND di.division_name = '${req.division}'` : ''}
            ${req.branch && req.branch != 'All'
        ? ` AND a.branch_id = ${req.branch}`
        : ''
      }
            ${req.empCodes && req.empCodes.length > 0
        ? ` AND a.emp_code IN (${empCodesString})`
        : ''
      }`;

    const countResult = await this.attenRepo.query(countQuery);
    const totalCount = countResult[0]?.totalCount || 0;

    return [result, totalCount];
  }

  async weeklyAttendance(req: DashboardReq): Promise<any> {
    let query = `
        WITH date_range AS (
            SELECT CURDATE() - INTERVAL seq DAY AS DATE
            FROM (
                SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
                UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
            ) seq_table
        )
        SELECT
            dr.date,
            DATE_FORMAT(dr.date, '%e %b') AS formattedDate,
            COALESCE(SUM(CASE WHEN a.attn_status = 'A' THEN 1 END), 0) AS absentCount,
            COALESCE(SUM(CASE WHEN a.attn_status NOT IN ('A', 'L') THEN 1 END), 0) AS presentCount,
            COALESCE(SUM(CASE WHEN a.attn_status = 'L' THEN 1 END), 0) AS leaveCount
        FROM date_range dr
        LEFT JOIN ${this.dbNames.lms}.attendance a ON a.date = dr.date
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        AND e.is_active = 1
        WHERE (a.emp_code IS NOT NULL OR a.emp_code IS NULL) ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''
      } ${req.empTypeId ? `AND e.employee_type_id = ${req.empTypeId}` : ''}
        GROUP BY dr.date
        ORDER BY dr.date ASC`;

    return await this.attenRepo.query(query);
  }

  async getCheckedInCount(req: DashboardReq): Promise<any> {
    let query = `
        SELECT COUNT(CASE WHEN a.attn_status not in ('A','L') THEN 1 END) AS checkedInCount,
        COUNT(CASE WHEN a.attn_status not in ('A','L') AND e.gender = '${GenderEnum.M
      }' THEN 1 END) AS maleCount,
        COUNT(CASE WHEN a.attn_status not in ('A','L') AND e.gender = '${GenderEnum.F
      }' THEN 1 END) AS femaleCount
        FROM ${this.dbNames.lms}.attendance a
        INNER JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        WHERE e.is_active = 1 AND a.emp_code IS NOT NULL ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.date ? `AND a.date = '${req.date}'` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''
      } ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND e.employee_type_id = ${req.empTypeId}` : ''
      }`;

    return await this.attenRepo.query(query);
  }

  async getCheckedOutCount(req: DashboardReq): Promise<any> {
    let query = `
        SELECT COUNT(CASE WHEN a.attn_status not in ('A','L') AND out_time IS NOT NULL THEN 1 END) AS checkedOutCount,
        COUNT(CASE WHEN a.attn_status not in ('A','L') AND e.gender = '${GenderEnum.M
      }' AND out_time IS NOT NULL THEN 1 END) AS maleCount,
        COUNT(CASE WHEN a.attn_status not in ('A','L') AND e.gender = '${GenderEnum.F
      }' AND out_time IS NOT NULL THEN 1 END) AS femaleCount
        FROM ${this.dbNames.lms}.attendance a
        INNER JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        WHERE e.is_active = 1 AND a.emp_code IS NOT NULL ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.date ? `AND a.date = '${req.date}'` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''
      } ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND e.employee_type_id = ${req.empTypeId}` : ''
      }`;

    return await this.attenRepo.query(query);
  }

  async getLeaveCount(req: DashboardReq): Promise<any> {
    let query = `
        SELECT COUNT(CASE WHEN a.attn_status = 'L' THEN 1 END) AS onLeaveCount,
        COUNT(CASE WHEN a.attn_status = 'L' AND e.gender = '${GenderEnum.M
      }' THEN 1 END) AS maleCount,
        COUNT(CASE WHEN a.attn_status = 'L' AND e.gender = '${GenderEnum.F
      }' THEN 1 END) AS femaleCount
        FROM ${this.dbNames.lms}.attendance a
        INNER JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        WHERE e.is_active = 1 AND (a.emp_id AND a.emp_code) IS NOT NULL ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.date ? `AND a.date = '${req.date}'` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''
      } ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND e.employee_type_id = ${req.empTypeId}` : ''
      }`;

    return await this.attenRepo.query(query);
  }

  async getAbsentCount(req: DashboardReq): Promise<any> {
    let query = `
        SELECT COUNT(CASE WHEN a.attn_status = 'A' THEN 1 END) AS absentCount,
        COUNT(CASE WHEN a.attn_status = 'A' AND e.gender = '${GenderEnum.M
      }' THEN 1 END) AS maleCount,
        COUNT(CASE WHEN a.attn_status = 'A' AND e.gender = '${GenderEnum.F
      }' THEN 1 END) AS femaleCount
        FROM ${this.dbNames.lms}.attendance a
        INNER JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        WHERE e.is_active = 1 AND a.emp_code IS NOT NULL ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.date ? `AND a.date = '${req.date}'` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''
      } ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND e.employee_type_id = ${req.empTypeId}` : ''
      }`;

    return await this.attenRepo.query(query);
  }

  async getAllAttnAdjustment(req: AttendanceAdjustRequest): Promise<any> {
    const formattedDate = req.date
      ? new Date(req.date).toISOString().split('T')[0]
      : null;
    let query = `
            SELECT 
                DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
                a.id,
                a.emp_id AS empId,
                a.emp_code AS empCode,
                a.emp_name AS empName,
                a.attn_status AS attnStatus,
                a.leave_status AS leaveStatus,
                a.freeze_status AS freezeStatus,
                DATE_FORMAT(a.in_time, '%Y-%m-%d %H:%i:%s') AS inTime,  
                DATE_FORMAT(a.out_time, '%Y-%m-%d %H:%i:%s') AS outTime, 
                a.shift AS shiftType,
                a.attendance_month AS attendanceMonth,
                a.manual_entry AS manualEntry,
                s.shift_type AS shift
             FROM ${this.dbNames.lms}.attendance a
            LEFT JOIN  ${this.dbNames.masters}.shifts s ON s.id = a.shift
        `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (formattedDate) {
      conditions.push('DATE_FORMAT(a.date, "%Y-%m-%d") = ?');
      params.push(formattedDate);
    }

    if (req.empCode) {
      conditions.push('a.emp_code = ?');
      params.push(req.empCode);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const results = await this.query(query, params);

    if (results.length === 0) {
      return {
        status: false,
        message: 'No data found for the selected employee and date.',
      };
    }

    return results[0];
  }

  async absentStatusWhatsApi(): Promise<any[]> {
    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');

    const query = this.createQueryBuilder('attendance')
      .select('attendance.emp_name', 'empName')
      .addSelect('attendance.attendance_month', 'attendanceMonths')
      .addSelect(
        'COUNT(CASE WHEN attendance.leave_status = "A" THEN 1 END)',
        'totalAbsent'
      )
      .where('MONTH(attendance.date) = :currentMonth', { currentMonth })
      .andWhere('YEAR(attendance.date) = :currentYear', { currentYear })
      .groupBy('attendance.emp_id')
      .orderBy('totalAbsent', 'DESC')
      .having('totalAbsent > 0')
      .limit(5);
    return await query.getRawMany();
  }

  async leaveStatusWhatsApiRepo(): Promise<any[]> {
    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');

    const query = this.createQueryBuilder('attendance')
      .select('attendance.emp_name', 'empName')
      .addSelect('attendance.attendance_month', 'attendanceMonths')
      .addSelect(
        'COUNT(CASE WHEN attendance.leave_status = "L" THEN 1 END)',
        'totalLeave'
      )
      .where('MONTH(attendance.date) = :currentMonth', { currentMonth })
      .andWhere('YEAR(attendance.date) = :currentYear', { currentYear })
      .groupBy('attendance.emp_id')
      .orderBy('totalLeave', 'DESC')
      .having('totalLeave > 0')
      .limit(10);
    return await query.getRawMany();
  }

  async attedanceStatusWhatsappAlertRepo(): Promise<any[]> {
    try {
      // let query = `
      //       SELECT
      //       s.shift_type AS shiftType,
      //       COUNT(DISTINCT a.emp_name) AS countEmpName,
      //       COUNT(CASE WHEN a.attn_status = 'P' THEN 1 END) AS attnStatus,
      //       COUNT(CASE WHEN a.attn_status = 'A' THEN 1 END) AS absentStatus,
      //       COUNT(CASE WHEN a.attn_status = 'W' THEN 1 END) AS wfhStatus,
      //       COUNT(CASE WHEN a.leave_status = 'L' THEN 1 END) AS leaveStatus,
      //       COUNT(CASE WHEN a.in_reader  IS NULL THEN 1 END) AS inPunching,
      //       COUNT(CASE WHEN a.out_reader IS NULL THEN 1 END) AS outPunching,
      //       COUNT(*) AS countShiftType
      //   FROM
      //       ${this.dbNames.lms}.attendance a
      //   LEFT JOIN
      //       ${this.dbNames.masters}.shifts s ON s.id = a.shift
      //   WHERE
      //       (s.shift_type LIKE 'G%' OR s.shift_type LIKE 'A%' OR s.shift_type LIKE 'B%' OR s.shift_type LIKE 'C%')
      //       AND a.date = CURDATE()
      //   GROUP BY
      //       s.shift_type
      //   ORDER BY
      //       s.shift_type
      //     `
      let query = `
                SELECT
                 CASE 
                     WHEN s.shift_type IS NOT NULL THEN s.shift_type
                     ELSE 'Others'
                 END AS shiftType,
                 COUNT( a.emp_name) AS countEmpName,
                 COUNT(CASE WHEN a.attn_status = 'P' THEN 1 END) AS attnStatus,
                 COUNT(CASE WHEN a.attn_status = 'A' THEN 1 END) AS absentStatus,
                 COUNT(CASE WHEN a.attn_status = 'W' THEN 1 END) AS wfhStatus,
                 COUNT(CASE WHEN a.leave_status = 'L' THEN 1 END) AS leaveStatus,
                 COUNT(CASE WHEN a.attn_status = 'P' AND a.in_time IS NULL THEN 1 END) AS inPunching,
                 COUNT(CASE WHEN a.attn_status = 'P' AND a.out_time IS NULL THEN 1 END) AS outPunching,
                 COUNT(*) AS countShiftType,
                 CASE 
                     WHEN br.branch_name IS NOT NULL THEN br.branch_name
                     ELSE 'Others'
                 END AS branchName
                 FROM 
                     ${this.dbNames.lms}.attendance a
                 LEFT JOIN 
                     ${this.dbNames.masters}.shifts s ON s.id = a.shift
                 LEFT JOIN 
                     ${this.dbNames.masters}.branches br ON br.id = a.branch_id
                 WHERE 
                    a.date = CURDATE()  AND a.emp_id IS NOT NULL AND (br.branch_name LIKE 'VRPL%')
                 GROUP BY 
                     CASE 
                         WHEN br.branch_name IS NOT NULL THEN br.branch_name
                         ELSE 'Others'
                     END, 
                     CASE 
                         WHEN s.shift_type IS NOT NULL THEN s.shift_type
                         ELSE 'Others'
                     END
                 ORDER BY 
                     branchName, shiftType
            `;
      return await this.attenRepo.query(query);
    } catch (err) {
      console.log(err);
    }
  }

  async attendanceStatusWhatsappAlertTop5LessWorkingHours(): Promise<any[]> {
    try {
      // let query = `
      //     SELECT
      //      a.emp_name AS employeeName,
      //      COUNT(CASE WHEN a.attn_status = 'P' THEN 1 END) AS attnStatus,
      //      COUNT(CASE WHEN a.attn_status = 'A' THEN 1 END) AS absentStatus,
      //      COUNT(CASE WHEN a.leave_status = 'L' THEN 1 END) AS leaveStatus,
      //      s.shift_type AS shiftType,
      //      a.in_time, a.out_time,
      //      SEC_TO_TIME(TIMESTAMPDIFF(SECOND, a.in_time, a.out_time)) AS totalDuration,
      //      COUNT(*) AS recordsWithLessThan8Hours
      //  FROM
      //       ${this.dbNames.lms}.attendance a
      //  LEFT JOIN
      //       ${this.dbNames.masters}.shifts s ON s.id = a.shift
      //  WHERE
      //      TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) < 8 * 3600
      //      AND (s.shift_type LIKE 'G%' OR s.shift_type LIKE 'A%' OR s.shift_type LIKE 'B%'OR s.shift_type LIKE 'C%')
      //      AND a.date = CURDATE()
      //  GROUP BY
      //      a.emp_name, s.shift_type
      //  ORDER BY
      //  shiftType,
      //      recordsWithLessThan8Hours DESC
      //  LIMIT 10;
      // `
      let query = ` 
            SELECT 
                a.emp_name AS employeeName,
                COUNT(CASE WHEN a.attn_status = 'P' THEN 1 END) AS attnStatus,
                COUNT(CASE WHEN a.leave_status = 'A' THEN 1 END) AS absentStatus,
                COUNT(CASE WHEN a.leave_status = 'L' THEN 1 END) AS leaveStatus,
                CASE 
                    WHEN s.shift_type IS NOT NULL THEN s.shift_type
                    ELSE 'Others'
                END AS shiftType,
                a.in_time, 
                a.out_time,
                SEC_TO_TIME(TIMESTAMPDIFF(SECOND, a.in_time, a.out_time)) AS totalDuration,
                COUNT(*) AS recordsWithLessThan8Hours
            FROM 
                ${this.dbNames.lms}.attendance a
            LEFT JOIN 
                 ${this.dbNames.masters}.shifts s ON s.id = a.shift
            WHERE 
                TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) < 8 * 3600
                AND a.date = CURDATE() AND a.emp_id IS NOT NULL
            GROUP BY 
                a.emp_name, 
                CASE 
                    WHEN s.shift_type IS NOT NULL THEN s.shift_type
                    ELSE 'Others'
                END
            ORDER BY 
                shiftType,
                recordsWithLessThan8Hours DESC
            LIMIT 10;
   `;
      return await this.attenRepo.query(query);
    } catch (err) {
      console.log(err);
    }
  }

  async attendnaceStatusWhatsappAlertLessWrokingHours(): Promise<any[]> {
    try {
      // let query = `
      //        SELECT
      //        COUNT(*) AS totalRecordsWithLessThan8Hours,
      //        s.shift_type AS shiftType
      //        FROM
      //        ${this.dbNames.lms}.attendance a
      //        LEFT JOIN
      //         ${this.dbNames.masters}.shifts s ON s.id = a.shift
      //        WHERE
      //         TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) < 8 * 3600
      //        AND a.date = CURDATE()
      //        AND (s.shift_type LIKE 'G%'
      //            OR s.shift_type LIKE 'A%'
      //            OR s.shift_type LIKE 'B%'
      //            OR s.shift_type LIKE 'C%')
      //        GROUP BY
      //            s.shift_type
      //        ORDER BY
      //        shiftType `
      let query = `
                SELECT 
                COUNT(*) AS totalRecordsWithLessThan8Hours,
                CASE 
                    WHEN UPPER(s.shift_type) LIKE 'A%' THEN 'A'
                    WHEN UPPER(s.shift_type) LIKE 'B%' THEN 'B'
                    WHEN UPPER(s.shift_type) LIKE 'C%' THEN 'C'
                    WHEN UPPER(s.shift_type) LIKE 'G%' THEN 'G'
                    ELSE 'Others'
                END AS shiftType
                FROM 
                   ${this.dbNames.lms}.attendance a
                LEFT JOIN 
                    ${this.dbNames.masters}.shifts s ON s.id = a.shift
                WHERE 
                    TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) < 8 * 3600 
                    AND a.date = CURDATE() AND a.emp_id IS NOT NULL
                GROUP BY 
                CASE 
                    WHEN UPPER(s.shift_type) LIKE 'A%' THEN 'A'
                    WHEN UPPER(s.shift_type) LIKE 'B%' THEN 'B'
                    WHEN UPPER(s.shift_type) LIKE 'C%' THEN 'C'
                    WHEN UPPER(s.shift_type) LIKE 'G%' THEN 'G'
                    ELSE 'Others'
                END
                ORDER BY 
                     shiftType
             `;
      return await this.attenRepo.query(query);
    } catch (err) {
      console.log(err);
    }
  }

  async getEmpAttendanceRecordByCodeAndDate(date: string, empCode: string): Promise<any> {
    const query = this.createQueryBuilder('attendance')
      .select(` emp_id,emp_code, department_id, shift, attn_status, in_time, out_time`)
      .where(` date = '${date}' AND emp_code = '${empCode}' `);
    return await query.getRawOne();
  }

  async leaveStatusWhatsApiwithBranchWise(): Promise<any[]> {
    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');

    const query = this.createQueryBuilder('attendance')
      .select('attendance.emp_name', 'empName')
      .addSelect('attendance.attendance_month', 'attendanceMonths')
      .addSelect(
        'COUNT(CASE WHEN attendance.leave_status = "L" THEN 1 END)',
        'totalLeave'
      )
      .addSelect('attendance.branch', 'branch')
      .where(`MONTH(attendance.date) = ${currentMonth}`)
      .andWhere(
        `YEAR(attendance.date) = ${currentYear} AND branch IS NOT NULL `
      )
      .groupBy('attendance.emp_id,branch')
      .orderBy('totalLeave', 'DESC')
      .having('totalLeave > 0');
    return await query.getRawMany();
  }

  async absentStatusWhatsApiwithBranchWise(): Promise<any[]> {
    const currentMonth = dayjs().format('MM');
    const currentYear = dayjs().format('YYYY');

    const query = this.createQueryBuilder('attendance')
      .select('attendance.emp_name', 'empName')
      .addSelect('attendance.attendance_month', 'attendanceMonths')
      .addSelect(
        'COUNT(CASE WHEN attendance.leave_status = "A" THEN 1 END)',
        'totalAbsent'
      )
      .addSelect('attendance.branch', 'branchName')
      .where(`MONTH(attendance.date) = ${currentMonth}`)
      .andWhere(`YEAR(attendance.date) = ${currentYear} AND branch IS NOT NULL`)
      .groupBy('attendance.emp_id,branch')
      .orderBy('totalAbsent', 'DESC')
      .having('totalAbsent > 0 ');

    return await query.getRawMany();
  }

  async getDataByMonth(
    req: MonthReq,
    page: number = 1,
    limit: number = 1000
  ): Promise<any[]> {
    const offset = (page - 1) * limit;

    const query = `
            SELECT
                a.emp_id AS empId,
                a.emp_code AS empCode,
                a.branch_id AS branchId,
                a.division_id AS divisionId,
                a.attendance_month as attendanceMonth,
                SUM(CASE WHEN a.attn_status = 'P' THEN 1 ELSE 0 END) AS presentCount,
                SUM(CASE WHEN a.attn_status = 'A' THEN 1 ELSE 0 END) AS absentCount,
                SUM(CASE WHEN a.attn_status = 'L' THEN 1 ELSE 0 END) AS leaveCount,
                SUM(CASE WHEN a.attn_status = 'CO' THEN 1 ELSE 0 END) AS coCount,
                SUM(CASE WHEN a.attn_status = 'OD' THEN 1 ELSE 0 END) AS odCount,
                SUM(CASE WHEN a.attn_status = 'WP' THEN 1 ELSE 0 END) AS wpCount,
                SUM(CASE WHEN a.attn_status = 'WO' THEN 1 ELSE 0 END) AS woCount,
                SUM(CASE WHEN a.attn_status = 'H' THEN 1 ELSE 0 END) AS holidayCount,
                SUM(CASE WHEN a.attn_status = 'HP' THEN 1 ELSE 0 END) AS hpCount,
                SUM(CASE WHEN a.attn_status IN ('P', 'H') THEN a.spl_ot_hours ELSE 0 END) AS totalOtHours
            FROM ${this.dbNames.lms}.attendance a
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
            WHERE a.attendance_month = '${req.month}' AND a.emp_id IS NOT NULL AND e.is_active = 1
            GROUP BY a.emp_id, a.emp_code
            ORDER BY a.emp_code ASC
            LIMIT ${limit} OFFSET ${offset};
        `;

    return await this.attenRepo.query(query);
  }

  async getBranchWiseAttendance(req: DashboardReq): Promise<any> {
    let query = `
        SELECT 
            b.branch_name AS branches,
            b.id AS branch_id,
            COUNT(a.attn_status) AS totalCount,
            SUM(CASE WHEN a.attn_status NOT IN ('A','L') THEN 1 ELSE 0 END) AS presentCount,
            SUM(CASE WHEN a.attn_status = 'A' THEN 1 ELSE 0 END) AS absentCount,
            SUM(CASE WHEN a.attn_status = 'L' THEN 1 ELSE 0 END) AS leaveCount,
            ROUND(SUM(CASE WHEN a.attn_status NOT IN ('A','L') THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attn_status)) AS presentPercentage,
            ROUND(SUM(CASE WHEN a.attn_status = 'A' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attn_status)) AS absentPercentage,
            ROUND(SUM(CASE WHEN a.attn_status = 'L' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attn_status)) AS leavePercentage
        FROM ${this.dbNames.lms}.attendance a
        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = a.branch_id
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        WHERE a.date = '${req.date}' AND b.id IS NOT NULL ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.date ? `AND a.date = '${req.date}'` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''
      } ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''
      }
        GROUP BY b.branch_name, b.id
        ORDER BY b.branch_name`;
    return await this.attenRepo.query(query);
  }

  async getEmpTypeByBranch(req: DashboardReq): Promise<any> {
    let query = `
        SELECT e.employee_type_id AS employeeTypeId,et.name as empTypeName,
            COUNT(a.attn_status) AS totalCount,
            SUM(CASE WHEN a.attn_status NOT IN ('A','L') THEN 1 ELSE 0 END) AS presentCount,
            SUM(CASE WHEN a.attn_status = 'A' THEN 1 ELSE 0 END) AS absentCount,
            SUM(CASE WHEN a.attn_status = 'L' THEN 1 ELSE 0 END) AS leaveCount,
            ROUND(SUM(CASE WHEN a.attn_status NOT IN ('A','L') THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attn_status)) AS presentPercentage,
            ROUND(SUM(CASE WHEN a.attn_status = 'A' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attn_status)) AS absentPercentage,
            ROUND(SUM(CASE WHEN a.attn_status = 'L' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.attn_status)) AS leavePercentage
        FROM ${this.dbNames.lms}.attendance a
        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = a.branch_id
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = a.emp_id
        LEFT JOIN ${this.dbNames.ems
      }.employee_type et on et.id = e.employee_type_id
        WHERE a.date = '${req.date}' AND b.id IS NOT NULL ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''
      } ${req.date ? `AND a.date = '${req.date}'` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''
      } ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''
      }
        GROUP BY et.id
        ORDER BY et.name`;
    return await this.attenRepo.query(query);
  }

  async getAllEmpMonthWiseDataWithoutPaginationRepo(req: MonthWIseEmpReportReq): Promise<any[]> {
    const startDate = dayjs(req.date).format('YYYY-MM-01')
    const endDate = dayjs(req.date).endOf('M').format('YYYY-MM-DD')

    const m = dayjs(req.date).format('M')

    let accumSum = ""
    for (let i = 1; i <= Number(m); i++) {
        accumSum += `nla.accum_${i} + `
    }
    accumSum = accumSum.slice(0, -3)
    
    let utilizedSum = ""
    for (let i = 1; i <= 12; i++) {
        utilizedSum += `nla.utilized_${i} + `
    }
    utilizedSum = utilizedSum.slice(0, -3)

    let query = `
                SELECT 
                    a.id, 
                    a.emp_id,
                    a.emp_code AS empCode, 
                    a.date, 
                    e.first_name AS empName, 
                    e.employee_type_id as employeeTypeId, 
                    et.name as employeeType,
                    a.attn_status AS attnStatus,
                    a.leave_status AS leaveStatus,
                    d.name AS department,
                    di.division_name AS divisionName,
                    br.branch_name AS branchName,
                    a.branch AS branches,
                    a.attendance_month,
                    a.branch_id AS branchId,
                    a.department_id AS departmentId,
                    a.designation_id AS designationId,
                    a.division_id AS divisionId,
                    a.attendance_month AS attendanceMonth,
                    a.spl_ot_hours AS splOtHours,
                    e.bank_name AS bankName,
                    e.bank_ac_no AS bankAccNo,
                    e.bank_ifsc_code AS bankIfscCode,
                    e.pay_mode as payMode,
                    (SELECT SUM(la.final_late_min) FROM ${this.dbNames.lms}.late_minutes_records la WHERE la.employee_code = a.emp_code AND la.date BETWEEN '${startDate}' AND '${endDate}') AS totalLateMins,
                    (SELECT (${accumSum}) - (${utilizedSum}) FROM ${this.dbNames.lms}.new_leave_allocations nla WHERE nla.employee_code = a.emp_code AND nla.leave_type_id = 1) AS available

                FROM 
                    ${this.dbNames.lms}.attendance a 
                LEFT JOIN 
                    ${this.dbNames.ems}.departments d ON a.department_id = d.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
                LEFT JOIN 
                    ${this.dbNames.ems}.division di ON e.division_id = di.id
                LEFT JOIN 
                    ${this.dbNames.ems}.branches br ON a.branch_id = br.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
                WHERE a.emp_id > 0 AND e.is_active = 1`;

    if (req.year) {
      query += ` AND YEAR(a.date) = ${req.year}`;
    }
    if (req.month) {
      query += ` AND MONTH(a.date) = ${req.month}`;
    }
    if (req.department) {
      query += ` AND d.name = '${req.department}'`;
    }
    if (req.division) {
      query += ` AND di.division_name = '${req.division}'`;
    }
    if (req.branch && req.branch !== 'ALL') {
      query += ` AND e.branch_id = '${req.branch}'`;
    }
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    let empCodesString = '';
    if (req.empCodes && req.empCodes.length > 0) {
      empCodesString = req.empCodes.map((code) => `"${code}"`).join(',');
      query += ` AND a.emp_code IN (${empCodesString})`;
    }

    const result = await this.attenRepo.query(query);
    return result;
  }

  async getAllEmpWeeklyWiseDataWithoutPaginationRepo(req: MonthWIseEmpReportReq): Promise<any[]> {
    let query = `
                SELECT 
                    a.id, 
                    a.emp_id,
                    a.emp_code AS empCode, 
                    a.date, 
                    e.first_name AS empName, 
                    e.employee_type_id as employeeTypeId,
                    et.name as employeeType,
                    a.attn_status AS attnStatus,
                    d.name AS department,
                    di.division_name AS divisionName,
                    br.branch_name AS branchName,
                    a.branch AS branches,
                    a.attendance_month,
                    a.branch_id AS branchId,
                    a.department_id AS departmentId,
                    a.designation_id AS designationId,
                    a.division_id AS divisionId,
                    a.attendance_month AS attendanceMonth,
                    a.spl_ot_hours AS splOtHours
                FROM 
                    ${this.dbNames.lms}.attendance a 
                LEFT JOIN 
                    ${this.dbNames.ems}.departments d ON a.department_id = d.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee e ON a.emp_code = e.employee_code
                LEFT JOIN 
                    ${this.dbNames.ems}.division di ON e.division_id = di.id
                LEFT JOIN 
                    ${this.dbNames.ems}.branches br ON a.branch_id = br.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
                WHERE a.emp_id > 0 AND et.name = 'WEEKLY WORKER' AND e.is_active = 1`;

    if (req.year) {
      query += ` AND YEAR(a.date) = ${req.year}`;
    }
    if (req.month) {
      query += ` AND MONTH(a.date) = ${req.month}`;
    }
    if (req.department) {
      query += ` AND d.name = '${req.department}'`;
    }
    if (req.division) {
      query += ` AND di.division_name = '${req.division}'`;
    }
    if (req.employeeId) {
      query += ` AND a.emp_id = '${req.employeeId}'`;
    }
    if (req.branch && req.branch !== 'ALL') {
      query += ` AND e.branch_id = '${req.branch}'`;
    }
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    let empCodesString = '';
    if (req.empCodes && req.empCodes.length > 0) {
      empCodesString = req.empCodes.map((code) => `"${code}"`).join(',');
      query += ` AND a.emp_code IN (${empCodesString})`;
    }

    const result = await this.attenRepo.query(query);
    return result;
  }

  // async getAttendceWithEmpIdAndDateWithoutPagination(month: number, year: number, empId: number) {
  //     const query = await this.createQueryBuilder('attendance')
  //         .select('*')
  //         .where(`month(date) = "${month}"`)
  //         .andWhere(`year(date) = "${year}"`)
  //         .andWhere(`emp_id = '${empId}'`)
  //         .getRawMany()
  //     return query
  // }

  async attendanceCOOD(req: any): Promise<any> {
    try {
      let updateQuery = `
            UPDATE ${this.dbNames.lms}.attendance
            SET attn_status = '${req.type}'
            WHERE emp_id = '${req.employeeCode}' 
            AND date = '${req.fromDate}';
        `;
      return await this.attenRepo.query(updateQuery);
    } catch (err) {
      console.log(err);
    }
  }
  async getAllEmpLateMinutes(req: AttendanceDto): Promise<any> {
    let query = `SELECT 
                     a.designation_id AS desginationid,
                     a.department_id AS departmentId,
                     a.division_id AS divisionId,
                     d.division_name AS divisionName,
                     dp.name AS department,
                     ds.name AS designation,
                     e.first_name AS empName,
                     a.emp_id AS employeeId,
                     a.emp_code AS empCode, 
                     a.id AS attendanceId, 
                     a.branch_id AS branchesId,
                     b.branch_name as branches,
                     a.date AS attendanceDate,
                     a.freeze_status AS freezeStatus,
                     a.in_time AS inTime,
                     a.out_time AS outTime,
                     a.wk_hours AS workingHours,
                     CASE 
                        WHEN TIME(in_time) >= '06:30:00' 
                             AND TIME(out_time) <= '18:45:00' 
                             AND TIME_TO_SEC(wk_hours) <= TIME_TO_SEC('08:00:00') THEN 
                             SEC_TO_TIME(TIME_TO_SEC('08:00:00') - TIME_TO_SEC(wk_hours))
                        ELSE 
                             '00:00:00'
                    END AS late_hours,
                     a.leave_status AS leaveStatus,
                     a.attn_status AS attnStatus
                     FROM ${this.dbNames.lms}.attendance a
                     LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_code=e.employee_code
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=a.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=a.department_id 
                     LEFT JOIN ${this.dbNames.ems}.division d ON d.id=a.division_id
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id
                     WHERE e.employee_code >0 AND attn_status = 'P' 
                        AND TIME(in_time) >= '06:30:00' 
                        AND TIME(out_time) <= '18:45:00' 
                        AND TIME_TO_SEC(wk_hours) <= TIME_TO_SEC('08:00:00')
                       `;
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}'`;
    }
    if (req.departmentId != undefined) {
      query = query + ` and a.department_id = "${req.departmentId}"`;
    }
    if (req.desginationid != undefined) {
      query = query + ` and a.designation_id = "${req.desginationid}"`;
    }
    if (req.branch != undefined) {
      query = query + ` and a.branch_id = ${req.branch}`;
    }
    if (req.divisionId != undefined) {
      query = query + ` and a.division_id = "${req.divisionId}"`;
    }
    if (req.employeeId != undefined) {
      query = query + ` and a.emp_id = "${req.employeeId}"`;
    }
    if (req.employeeCode != undefined) {
      query = query + ` and a.emp_code = "${req.employeeCode}"`;
    }
    // query = query + ` GROUP BY e.employee_code`
    return await this.attenRepo.query(query);
  }

  async getLateMinuteByEmployee(): Promise<any> {
    let query = `SELECT  
                            emp_id,
                            emp_code,
                            emp_name,
                            SEC_TO_TIME(SUM(TIME_TO_SEC(
                                CASE 
                                    WHEN TIME(in_time) >= '06:30:00' 
                                         AND TIME(out_time) <= '18:45:00' 
                                         AND TIME_TO_SEC(wk_hours) <= TIME_TO_SEC('08:00:00') THEN 
                                         SEC_TO_TIME(TIME_TO_SEC('08:00:00') - TIME_TO_SEC(wk_hours))
                                    ELSE 
                                         '00:00:00'
                                END
                            ))) AS total_late_hours
                        FROM 
                            attendance
                        WHERE 
                            attn_status = 'P' 
                            AND attendance_month = '202412'
                            AND TIME(in_time) >= '06:30:00' 
                            AND TIME(out_time) <= '18:45:00' 
                            AND TIME_TO_SEC(wk_hours) <= TIME_TO_SEC('08:00:00')
                        GROUP BY 
                            emp_code `;
    return await this.attenRepo.query(query);
  }

  async getEmpByWeekOffForToday(req: AttenCoOffDto): Promise<any> {
    const query = `
            SELECT a.emp_id AS employeeId, a.date AS attnDate, a.branch_id AS branchId, e.employee_code AS employeeCode, e.employee_type_id AS employeeTypeId,
                et.name AS employeeTypeName, b.branch_name AS branchName, a.attn_status AS attnStatus
            FROM ${this.dbNames.lms}.attendance a
            LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_id = e.id
            LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = a.branch_id
            WHERE e.id > 0 
                AND a.attn_status IN ('WP', 'WP/2', 'HP', 'HP/2')
                AND a.date = ?
                AND e.employee_type_id = 1
        `;

    return await this.attenRepo.query(query, [req.date]);
  }

  async calcuLateMinRepo(req: lateMinReq): Promise<any> {
    const currentDate = req.date ? `'${req.date}'` : 'CURDATE()';
    const firstDateOfMonth = req.date
      ? `DATE_FORMAT('${req.date}', '%Y-%m-01')`
      : `DATE_FORMAT(NOW(), '%Y-%m-01')`;

    let query = `SELECT a.emp_id AS employeeId, a.emp_code AS employeeCode, a.emp_name AS employeeName, 
                    a.date AS attDate, a.in_time AS inTime, a.out_time AS outTime, a.attn_status AS attnStatus, 
                    a.date AS date, a.late_min AS lateMin, a.cum_late_min AS cumLateMin 
                    FROM ${this.dbNames.lms}.attendance a
                    WHERE a.emp_id = '${req.employeeId}'
                    AND a.date BETWEEN ${firstDateOfMonth} AND ${currentDate}
                    ORDER BY a.date ASC`;

    return await this.attenRepo.query(query);
  }

  async getSwipesForDateAndEmployee(req: lateMinReq): Promise<any> {

    let query = ` SELECT employee_number, swipe_date, swipe_time,
        CASE 
            WHEN reader_number LIKE '%IN%' THEN 'IN'
            WHEN reader_number LIKE '%OUT%' THEN 'OUT'
            ELSE 'UNKNOWN'
        END AS swipe_type
    FROM ${this.dbNames.lms}.attendance_swipes
    WHERE swipe_date = '${req.date}'
      AND employee_number = '${req.employeeCode}'`;

    return await this.attenRepo.query(query);
  }


  async getAllSinglePunchAttendance(req: AttendanceDto): Promise<any> {
    let query = `SELECT 
                     a.designation_id AS desginationid,
                     a.department_id AS departmentId,
                     a.division_id AS divisionId,
                     d.division_name AS divisionName,
                     dp.name AS department,
                     ds.name AS designation,
                     e.first_name AS empName,
                     a.emp_id AS employeeId,
                     a.emp_code AS empCode, 
                     a.id AS attendanceId, 
                     a.branch_id AS branchesId,
                     b.branch_name as branches,
                     a.date AS attendanceDate,
                     a.freeze_status AS freezeStatus,
                     a.in_time AS inTime,
                     a.out_time AS outTime,
                     CASE 
                        WHEN a.in_time IS NOT NULL AND a.out_time IS NOT NULL AND TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) >= 0 
                            THEN TIMEDIFF(a.out_time, a.in_time)
                        ELSE '00:00:00' 
                     END AS workingHours,
                     a.leave_status AS leaveStatus,
                     a.attn_status AS attnStatus
                     FROM ${this.dbNames.lms}.attendance a
                     LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_code=e.employee_code
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=a.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=a.department_id 
                     LEFT JOIN ${this.dbNames.ems}.division d ON d.id=a.division_id
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id
                     WHERE e.employee_code >0
                      AND (
      (a.in_time IS NOT NULL AND a.out_time IS NULL) 
      OR (a.in_time IS NULL AND a.out_time IS NOT NULL) )
                       `;
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}' `;
    }
    if (req.departmentId != undefined) {
      query = query + ` and a.department_id = "${req.departmentId}"`;
    }
    if (req.desginationid != undefined) {
      query = query + ` and a.designation_id = "${req.desginationid}"`;
    }
    if (req.branch != undefined) {
      query = query + ` and a.branch_id = ${req.branch}`;
    }
    if (req.divisionId != undefined) {
      query = query + ` and a.division_id = "${req.divisionId}"`;
    }
    if (req.employeeId != undefined) {
      query = query + ` and a.emp_id = "${req.employeeId}"`;
    }
    if (req.employeeCode != undefined) {
      query = query + ` and a.emp_id = "${req.employeeCode}"`;
    }
    // query = query + ` GROUP BY e.employee_code`
    return await this.attenRepo.query(query);
  }

  async getAllLeaveCollisionEmp(req: AttendanceDto): Promise<any> {
    let query = `SELECT 
                     a.designation_id AS desginationid,
                     a.department_id AS departmentId,
                     a.division_id AS divisionId,
                     d.division_name AS divisionName,
                     dp.name AS department,
                     ds.name AS designation,
                     e.first_name AS empName,
                     a.emp_id AS employeeId,
                     a.emp_code AS empCode, 
                     a.id AS attendanceId, 
                     a.branch_id AS branchesId,
                     b.branch_name as branches,
                     a.date AS attendanceDate,
                     a.freeze_status AS freezeStatus,
                     a.in_time AS inTime,
                     a.out_time AS outTime,
                     CASE 
                        WHEN a.in_time IS NOT NULL AND a.out_time IS NOT NULL AND TIMESTAMPDIFF(SECOND, a.in_time, a.out_time) >= 0 
                            THEN TIMEDIFF(a.out_time, a.in_time)
                        ELSE '00:00:00' 
                     END AS workingHours,
                     a.leave_status AS leaveStatus,
                     a.attn_status AS attnStatus
                     FROM ${this.dbNames.lms}.attendance a
                     LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_code=e.employee_code
                     LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id=a.designation_id
                     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=a.department_id 
                     LEFT JOIN ${this.dbNames.ems}.division d ON d.id=a.division_id
                     LEFT JOIN ${this.dbNames.ems}.branches b ON b.id=a.branch_id
                     WHERE e.employee_code >0 
                      AND a.attn_status = 'P' 
                      AND a.leave_status != 'A' `;
    if (req.attnFromDate != undefined && req.attnToDate != undefined) {
      query =
        query +
        ` and a.date BETWEEN '${req.attnFromDate}' AND '${req.attnToDate}' `;
    }
    if (req.departmentId != undefined) {
      query = query + ` and a.department_id = "${req.departmentId}"`;
    }
    if (req.desginationid != undefined) {
      query = query + ` and a.designation_id = "${req.desginationid}"`;
    }
    if (req.branch != undefined) {
      query = query + ` and a.branch_id = ${req.branch}`;
    }
    if (req.divisionId != undefined) {
      query = query + ` and a.division_id = "${req.divisionId}"`;
    }
    if (req.employeeId != undefined) {
      query = query + ` and a.emp_id = "${req.employeeId}"`;
    }
    if (req.employeeCode != undefined) {
      query = query + ` and a.emp_id = "${req.employeeCode}"`;
    }
    // query = query + ` GROUP BY e.employee_code`
    return await this.attenRepo.query(query);
  }

  async getAllReportingManagerWiseAttnReport(req: ReportingManagerReq): Promise<any> {
    console.log(req, "repo")
    let query = `
        SELECT 
            e.reporting_manager AS reportingManagerId,
            CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName,
            b.branch_name AS branch,
            e.id AS employeeId,
            rm.email_id AS emailId,
            CONCAT(e.first_name, ' ', e.last_name) AS employeeName,
            DATE_FORMAT(a.date, '%d-%m-%Y') AS attendanceDate,
            a.attn_status AS attendanceStatus,
            a.leave_status AS leaveStatus,
            dp.name AS department,
            ds.name AS designation,
            d.division_name AS division,
            SUM(IF(a.attn_status = "P", 1, 0)) OVER (PARTITION BY e.reporting_manager) AS presentCount,
            SUM(IF(a.attn_status = "A", 1, 0)) OVER (PARTITION BY e.reporting_manager) AS absentCount,
            SUM(IF(a.leave_status != "A", 1, 0)) OVER (PARTITION BY e.reporting_manager) AS leaveCount
        FROM ${this.dbNames.lms}.attendance a
        LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_id = e.id
        LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id = e.designation_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
        LEFT JOIN ${this.dbNames.ems}.division d ON d.id = a.division_id
        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = a.branch_id
        LEFT JOIN ${this.dbNames.ems}.employee rm ON rm.id = e.reporting_manager
        WHERE e.reporting_manager > 0
    `;

    // Apply filters
    if (req.departmentId !== undefined) {
      query += ` AND e.department_id = ${req.departmentId}`;
    }
    if (req.desginationid !== undefined) {
      query += ` AND e.designation_id = ${req.desginationid}`;
    }
    if (req.branchId !== undefined) {
      query += ` AND a.branch_id = ${req.branchId}`;
    }
    if (req.divisionId !== undefined) {
      query += ` AND a.division_id = "${req.divisionId}"`;
    }
    if (req.employeeId !== undefined) {
      query += ` AND a.emp_id = "${req.employeeId}"`;
    }
    if (req.date !== undefined) {
      query += ` AND a.date = "${req.date}"`;
    }
    if (req.reportingManagerId !== undefined) {
      query += ` AND e.reporting_manager = "${req.reportingManagerId}"`;
    }

    query += ` ORDER BY e.reporting_manager, e.id, a.date`;

    // Execute query
    const rawData = await this.attenRepo.query(query);

    // Group data by reporting manager
    const result = rawData.reduce((acc, item) => {
      const {
        reportingManagerId,
        reportingManagerName,
        branch,
        employeeId,
        employeeName,
        attendanceDate,
        attendanceStatus,
        leaveStatus,
        department,
        designation,
        emailId,
        division,
        presentCount,
        absentCount,
        leaveCount
      } = item;

      // Find the manager entry
      let managerEntry = acc.find((entry) => entry.reportingManagerId === reportingManagerId);

      if (!managerEntry) {
        managerEntry = {
          reportingManagerId,
          reportingManagerName,
          branch,
          department,
          designation,
          division,
          presentCount,
          absentCount,
          leaveCount,
          emailId,
          employees: [],
        };
        acc.push(managerEntry);
      }

      // Add employee details to the manager's employee list
      managerEntry.employees.push({
        employeeId,
        employeeName,
        attendanceDate,
        attendanceStatus,
        leaveStatus,
      });

      return acc;
    }, []);

    return result;
  }

}
