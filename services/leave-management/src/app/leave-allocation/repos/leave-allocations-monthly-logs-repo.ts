import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LeaveAllocationsMonthlyLogs } from "../entities/leave-allocations-monthly-logs-entity";
import { EmpDataReq, MonthlyAllocationlogEnum } from "@hrexpert/shared-models";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LeaveAllocationsMonthlyLogRepository extends Repository<LeaveAllocationsMonthlyLogs> {
    private readonly dbNames: any

    constructor(@InjectRepository(LeaveAllocationsMonthlyLogs) private leaveAllocationsMonthlyLogRepo: Repository<LeaveAllocationsMonthlyLogs>,
        private dataSource: DataSource,
        private readonly configService: ConfigService
    ) {
        super(leaveAllocationsMonthlyLogRepo.target, leaveAllocationsMonthlyLogRepo.manager, leaveAllocationsMonthlyLogRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    async getEmpAllocationMonthlyLogs(req?: EmpDataReq): Promise<any> {
        let query = `
            SELECT la.id, e.id AS empId, CONCAT(e.first_name, ' ', e.last_name) AS fullName, 
                   d.id AS deptId, d.name AS department, des.id AS designId, des.name AS designation, 
                   di.division_name AS divisionName, di.id AS divisionId, 
                   br.id AS branchId, br.branch_name AS branchName,
                   la.month_year AS monthYear, la.year AS year, la.log_type AS logType
            FROM ${this.dbNames.lms}.leave_allocations_monthly_logs la
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = la.employee_id
            LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.designations des ON des.id = e.designation_id
            LEFT JOIN ${this.dbNames.ems}.division di ON di.id = e.division_id
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            WHERE 1=1`;
    
        if (req.branchId) {
            query += ` AND e.branch_Id = ${req.branchId}`;
        }
        if (req.divisionId) {
            query += ` AND di.id = ${req.divisionId}`;
        }
        if (req.employeeId) {
            query += ` AND e.id = ${req.employeeId}`;
        }
        if (req.departmentId) {
            query += ` AND d.id = ${req.departmentId}`;
        }
        if (req.designationId) {
            query += ` AND des.id = ${req.designationId}`;
        }
        if (req.monthYear) {
            query += ` AND la.month_year = ${req.monthYear}`;
        }
    
        query += ` GROUP BY e.id ORDER BY e.first_name ASC`;
    
        return await this.leaveAllocationsMonthlyLogRepo.query(query);
    }
    

    async getMultipleEmpLeaveAllocationsMonthlyLogs(empIds: number[]): Promise<any> {
        if (empIds.length === 0) return [];

        const query = `
        SELECT la.id as leaveAllocationId, la.employee_id as empId, lt.id as leaveTypeId, lt.leave_name as leaveType, 
               la.leaves_allotted as leavesAllotted, la.leaves_used as leavesUsed, la.available
        FROM  ${this.dbNames.lms}.leave_allocations_monthly_logs la
        LEFT JOIN  ${this.dbNames.lms}.leave_type lt on lt.id = la.leave_type_id
        WHERE la.employee_id IN (${empIds.join(',')})`;

        return await this.leaveAllocationsMonthlyLogRepo.query(query);
    }
}