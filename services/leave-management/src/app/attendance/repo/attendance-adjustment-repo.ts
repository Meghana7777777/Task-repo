import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { AttendanceAdjustment } from "../dto/attendance-adjustment.entity";
import { AttendanceAdjustRequest, EmployeeDetailsDto, UnitIdReq } from "@hrexpert/shared-models";



@Injectable()
export class AttendanceAdjustmentRepoRepository extends Repository<AttendanceAdjustment> {
    private readonly dbNames: any

    constructor(@InjectRepository(AttendanceAdjustment) private attendanceAdjustmentRepo: Repository<AttendanceAdjustment>,
        private readonly configService: ConfigService
    ) {
        super(attendanceAdjustmentRepo.target, attendanceAdjustmentRepo.manager, attendanceAdjustmentRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getAllAttnAdjustmentData(req: UnitIdReq): Promise<any[]> {
        let query = `SELECT e.employee_code AS empCode,s.start_time AS shiftStartTime,s.end_time AS shiftEndTime,dp.name AS departmentName,t.shift_code AS shiftCode,s.shift_type AS shiftType,e.employee_code AS empCode,e.first_name AS empName, a.id AS attnAdjstId,a.attendace_id AS attendanceId,a.employee_id AS employeeId,
                a.date AS attnAdjstDate,a.old_in_time AS oldInTime,a.in_time AS inTime,a.old_out_time AS oldOutTime,
                a.out_time AS outTime,a.present_status AS presentStatus,a.department_id AS departmentId,a.shift_group AS shiftGroup,a.shift,a.reason AS reason,
                a.remarks,a.applied_date AS appliedDate,a.status,e.branch_id AS branchId
                FROM ${this.dbNames.lms}.attendance_adjustment a
                LEFT JOIN ${this.dbNames.ems}.employee e ON a.employee_id=e.id
                LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id=a.shift
                LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=e.department_id 
                LEFT JOIN ${this.dbNames.lms}.team_calender t ON t.id=a.shift_group
                where 1=1 `
        if (req?.unitId) {
            query += `AND e.branch_id = ${req.unitId}`
        }
        if (req?.employeeId) {
            query += `AND a.employee_id = ${req.employeeId}`
        }
        if (req.startDate != undefined && req.endDate != undefined) {
            query =
                query +
                ` AND a.date BETWEEN '${req.startDate}' AND '${req.endDate}'`;
        }
        if (req.departmentId != undefined) {
            query = query + ` AND e.department_id = "${req.departmentId}"`;
        }
        if (req.divisionId != undefined) {
            query = query + ` AND e.division_id = "${req.divisionId}"`;
        }
        if (req?.reportingManager) {
            query += `AND e.reporting_manager = ${req.reportingManager}`
        }
        query += ` ORDER BY a.created_at DESC`;

        /* where a.status='OPEN'`*/
        return await this.attendanceAdjustmentRepo.query(query);
    }

    async getAllAttnAdjustmentId(req: any): Promise<any[]> {
        let query = `SELECT e.employee_code AS empCode,s.start_time AS shiftStartTime,s.end_time AS shiftEndTime,dp.name AS departmentName,t.shift_code AS shiftCode,s.shift_type AS shiftType,e.employee_code AS empCode,e.first_name AS empName, a.id AS attnAdjstId,a.attendace_id AS attendanceId,a.employee_id AS employeeId,
                a.date AS attnAdjstDate,a.old_in_time AS oldInTime,a.in_time AS inTime,a.old_out_time AS oldOutTime,
                a.out_time AS outTime,a.present_status AS presentStatus,a.department_id AS departmentId,a.shift_group AS shiftGroup,a.shift,a.reason AS reason,
                a.remarks,a.applied_date AS appliedDate,a.status,e.branch_id AS branchId
                FROM ${this.dbNames.lms}.attendance_adjustment a
                LEFT JOIN ${this.dbNames.ems}.employee e ON a.employee_id=e.id
                LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id=a.shift
                LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id=e.department_id 
                LEFT JOIN ${this.dbNames.lms}.team_calender t ON t.id=a.shift_group
                where 1=1 `
        // if(req?.unitId){
        //     query += `AND e.branch_id = ${req.unitId}`
        // }
        // if(req?.employeeId){
        //     query += `AND a.employee_id = ${req.employeeId}`
        // }

        /* where a.status='OPEN'`*/
        return await this.attendanceAdjustmentRepo.query(query);
    }

    async employeeNameQuery(data: EmployeeDetailsDto): Promise<any> {
        let query = `
            SELECT emp.first_name, emp.reporting_manager AS reportingManager FROM ${this.dbNames.ems}.employee emp WHERE emp.employee_code = "${data.employeeCode}"`
        return await this.attendanceAdjustmentRepo.query(query);
    }

    async mobileNumberQuery(data: EmployeeDetailsDto): Promise<any> {
        let query = `SELECT emp.mobile_no, emp.email_id, emp.first_name FROM ${this.dbNames.ems}.employee emp
           WHERE emp.id = "${data.reportingManager}" 
           `
        return await this.attendanceAdjustmentRepo.query(query)
    }


}