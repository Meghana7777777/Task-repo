
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LeaveBalance } from "../entities/leaves-balance.entity";
import { CommonResponseModel, EmpDataReq } from "@hrexpert/shared-models";



@Injectable()
export class LeaveBalanceRepository extends Repository<LeaveBalance> {
    private readonly dbNames: any

    constructor(@InjectRepository(LeaveBalance)
    private leaveBalanceRepo: Repository<LeaveBalance>,
        private dataSource: DataSource,
        private readonly configService: ConfigService
    ) {
        super(leaveBalanceRepo.target, leaveBalanceRepo.manager, leaveBalanceRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getEmpAllocation(req?: EmpDataReq): Promise<any> {
        let query = `
        SELECT lb.id AS leaveBalanceId, e.id AS empId, CONCAT(e.first_name,'',e.last_name) AS fullName, e.employee_code AS employeeCode, 
        d.id AS deptId, d.name AS department, des.id AS designId, des.name AS designation, di.division_name AS divisionName,
        di.id AS divisionId, br.id AS branchId, br.branch_name AS branchName, et.id AS employeeTypeId, et.name AS employeeTypeName,
        lg.leave_group_id AS leaveGroupId, lg.leave_group_name AS leaveGroupName, lg.leave_group_code AS leaveGroupCode

        FROM  ${this.dbNames.lms}.leave_balance lb
        LEFT JOIN  ${this.dbNames.ems}.employee e ON e.id = lb.employee_id
        LEFT JOIN  ${this.dbNames.ems}.departments d ON d.id = e.department_id
        LEFT JOIN  ${this.dbNames.ems}.designations des ON des.id = e.designation_id
        LEFT JOIN  ${this.dbNames.ems}.division di ON di.id = e.division_id
        LEFT JOIN  ${this.dbNames.ems}.branches br ON br.id = e.branch_id
        LEFT JOIN  ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
        LEFT JOIN  ${this.dbNames.lms}.leave_group_master lg ON lg.leave_group_id = e.leave_group

        WHERE 1=1`
        if (req.branchId) {
            query += ` AND e.branch_Id = ${req.branchId}`
        }
        if (req.leaveGroupId) {
            query += ` AND e.leave_group = ${req.leaveGroupId}`
        }
        if (req.employeeTypeId) {
            query += ` AND et.id = ${req.employeeTypeId}`
        }

        query += ` GROUP BY e.id ORDER BY e.first_name ASC`
        return await this.leaveBalanceRepo.query(query)
    }



    async getMultipleEmpLeaveAllocations(empIds: number[]): Promise<any> {
        if (empIds.length === 0) return [];

        // Safely join employee IDs to avoid SQL injection
        const empIdsList = empIds.map((id) => `${id}`).join(',');

        const query = `
            SELECT  lb.id as leaveAllocationId, lb.employee_id as empId, lb.employee_code as empCode, 
            lt.leave_type_id as leaveTypeId, lt.leave_type_name as leaveTypeName, lt.leave_type_code as leaveTypeCode,        
            lb.carry_forward as carryForward, lb.month_accumulation as monthAccumulation, lb.opening_balance as openingBalance,
            lb.utilized as utilized, lb.utilized_next_month as utilizedNextMonth, lb.balance as balance  
            
            FROM  ${this.dbNames.lms}.leave_balance lb
            LEFT JOIN  ${this.dbNames.lms}.leave_type_master lt on lt.leave_type_id = lb.leave_type_id
            WHERE lb.employee_id IN (${empIdsList})
        `;

        return await this.leaveBalanceRepo.query(query);
    }

    async getLeaveBalanceNotAllocatedEmployees(req?: any): Promise<CommonResponseModel> {
        let query = `
        SELECT e.id AS employeeId, e.employee_code AS employeeCode, e.leave_group AS leaveGroupId,
        e.date_of_joining AS doj, e.branch_id AS branchId, e.designation_id AS desId, e.department_id AS deptId,
        e.gender AS gender, e.maritual_status AS maritalStatus, e.role AS role, e.division_id AS divId
        FROM  ${this.dbNames.ems}.employee e
        WHERE e.is_active = 1 `
        if (req.isAllocated === 0) {
            query += `AND e.leaves_allocated = ${req.isAllocated}`
        }
        const data = await this.leaveBalanceRepo.query(query)
        return new CommonResponseModel(true, 1, 'employees data', data);

    }


    async updatedEmployeesAllocatedtrue(req: any): Promise<any> {
        let query = ` UPDATE ${this.dbNames.ems}.employee e SET leaves_allocated = 1 WHERE id = ${req.employeeId} `
        await this.leaveBalanceRepo.query(query)
    }

    async getAllLeaveBalance(req: EmpDataReq): Promise<any> {
        let query = `SELECT 
    e.id AS employeeId,
    e.first_name AS firstName,
    e.last_name AS lastName,
    e.employee_code AS employeeCode,
    lb.leave_type_id AS leaveTypeId,
    lb.carry_forward AS carryForward,
    lb.month_accumulation AS monthAccumulation,
    lb.opening_balance AS openingBalance,
    lb.utilized AS utilized,
    lb.utilized_next_month AS utilizedNextMonth,
    lb.balance AS balance,
    lb.month_year AS monthYear,
    d.id AS deptId, d.name AS department, des.id AS designId, des.name AS designation, di.division_name AS divisionName,
        di.id AS divisionId, br.id AS branchId, br.branch_name AS branchName, et.id AS employeeTypeId, et.name AS employeeTypeName
FROM ${this.dbNames.ems}.employee e
LEFT JOIN  ${this.dbNames.ems}.departments d ON d.id = e.department_id
        LEFT JOIN  ${this.dbNames.ems}.designations des ON des.id = e.designation_id
        LEFT JOIN  ${this.dbNames.ems}.division di ON di.id = e.division_id
        LEFT JOIN  ${this.dbNames.ems}.branches br ON br.id = e.branch_id
                LEFT JOIN  ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
LEFT JOIN ${this.dbNames.lms}.leave_balance lb ON e.id = lb.employee_id
WHERE e.is_active = 1 `

        if (req.branchId) {
            query += ` AND e.branch_Id = ${req.branchId}`
        }
        if (req.employeeId) {
            query += ` AND e.id = ${req.employeeId}`
        }
        if (req.leaveGroupId) {
            query += ` AND e.leave_group = ${req.leaveGroupId}`
        }
        if (req.employeeTypeId != undefined) {
            if (req.employeeTypeId === 1) {
                query = query + ` and e.employee_type_id = "${req.employeeTypeId}"`;
            } else if (req.employeeTypeId !== 1) {
                query = query + ` and e.employee_type_id != 1`;
            }
        }
        return await this.leaveBalanceRepo.query(query)
    }

    async getAllLeaveBalanceAllocations(req: EmpDataReq): Promise<any> {
        const year = Math.floor(req.monthYear / 100); 
        const month = req.monthYear % 100; 
    
        let accumSum = "0";
        let utilizedSum = "0";
    
        if (month > 1) {
            accumSum = Array.from({ length: month - 1 }, (_, i) => `lb.accum_${i + 1}`).join(" + ");
            utilizedSum = Array.from({ length: month - 1 }, (_, i) => `lb.utilized_${i + 1}`).join(" + ");
        }
    
        let query = `SELECT  
            e.id AS employeeId, e.first_name AS firstName, e.last_name AS lastName, e.employee_code AS employeeCode,
            lb.leave_type_id AS leaveTypeId, lb.leave_group_code_id AS leaveGroupCodeId, lb.year AS year, 
            (${accumSum}) - (${utilizedSum}) AS carried, 
            lb.accum_${month} AS accum, lb.utilized_${month} AS utilized, lb.balance_${month} AS balance,
            lb.prev_year_closing_bal AS prevYearClosingBal,
            d.id AS deptId, d.name AS department, des.id AS designId, des.name AS designation, di.division_name AS divisionName,
            di.id AS divisionId, br.id AS branchId, br.branch_name AS branchName, et.id AS employeeTypeId, et.name AS employeeTypeName
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN  ${this.dbNames.ems}.departments d ON d.id = e.department_id
            LEFT JOIN  ${this.dbNames.ems}.designations des ON des.id = e.designation_id
            LEFT JOIN  ${this.dbNames.ems}.division di ON di.id = e.division_id
            LEFT JOIN  ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN  ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
            LEFT JOIN ${this.dbNames.lms}.new_leave_allocations lb ON e.id = lb.employee_id AND lb.year = '${year}'
            WHERE e.is_active = 1 `;

        if (req.branchId) {
            query += ` AND e.branch_Id = ${req.branchId}`;
        }
        if (req.employeeId) {
            query += ` AND e.id = ${req.employeeId}`;
        }
        if (req.leaveGroupId) {
            query += ` AND e.leave_group = ${req.leaveGroupId}`;
        }
        if (req.employeeTypeId != undefined) {
            if (req.employeeTypeId === 1) {
                query += ` AND e.employee_type_id = "${req.employeeTypeId}"`;
            } else {
                query += ` AND e.employee_type_id != 1`;
            }
        }
        return await this.leaveBalanceRepo.query(query);
    }

    async getAllLeaveBalanceAllocationsAllMonths(req: EmpDataReq): Promise<any> {
        const year = Math.floor(req.monthYear / 100); 
        const month = req.monthYear % 100; 
        let query = `SELECT 
            e.id AS employeeId, e.first_name AS firstName, e.last_name AS lastName, e.employee_code AS employeeCode,
            lb.leave_type_id AS leaveTypeId, lb.leave_group_code_id AS leaveGroupCodeId, lb.year AS year, 
            lb.carried_1 AS carried1, lb.accum_1 AS accum1, lb.utilized_1 AS utilized1, lb.balance_1 AS balance1, 
            lb.carried_2 AS carried2, lb.accum_2 AS accum2, lb.utilized_2 AS utilized2, lb.balance_2 AS balance2, 
            lb.carried_3 AS carried3, lb.accum_3 AS accum3, lb.utilized_3 AS utilized3, lb.balance_3 AS balance3, 
            lb.carried_4 AS carried4, lb.accum_4 AS accum4, lb.utilized_4 AS utilized4, lb.balance_4 AS balance4, 
            lb.carried_5 AS carried5, lb.accum_5 AS accum5, lb.utilized_5 AS utilized5, lb.balance_5 AS balance5, 
            lb.carried_6 AS carried6, lb.accum_6 AS accum6, lb.utilized_6 AS utilized6, lb.balance_6 AS balance6, 
            lb.carried_7 AS carried7, lb.accum_7 AS accum7, lb.utilized_7 AS utilized7, lb.balance_7 AS balance7, 
            lb.carried_8 AS carried8, lb.accum_8 AS accum8, lb.utilized_8 AS utilized8, lb.balance_8 AS balance8, 
            lb.carried_9 AS carried9, lb.accum_9 AS accum9, lb.utilized_9 AS utilized9, lb.balance_9 AS balance9, 
            lb.carried_10 AS carried10, lb.accum_10 AS accum10, lb.utilized_10 AS utilized10, lb.balance_10 AS balance10, 
            lb.carried_11 AS carried11, lb.accum_11 AS accum11, lb.utilized_11 AS utilized10, lb.balance_11 AS balance10, 
            lb.carried_12 AS carried12, lb.accum_12 AS accum12, lb.utilized_12 AS utilized10, lb.balance_12 AS balance10,  
            d.id AS deptId, d.name AS department, des.id AS designId, des.name AS designation, di.division_name AS divisionName,
            di.id AS divisionId, br.id AS branchId, br.branch_name AS branchName, et.id AS employeeTypeId, et.name AS employeeTypeName
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN  ${this.dbNames.ems}.departments d ON d.id = e.department_id
            LEFT JOIN  ${this.dbNames.ems}.designations des ON des.id = e.designation_id
            LEFT JOIN  ${this.dbNames.ems}.division di ON di.id = e.division_id
            LEFT JOIN  ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN  ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
            LEFT JOIN ${this.dbNames.lms}.new_leave_allocations lb ON e.id = lb.employee_id AND lb.year = '${year}'
            WHERE e.is_active = 1 `

        if (req.branchId) {
            query += ` AND e.branch_Id = ${req.branchId}`
        }
        if (req.employeeId) {
            query += ` AND e.id = ${req.employeeId}`
        }
        if (req.leaveGroupId) {
            query += ` AND e.leave_group = ${req.leaveGroupId}`
        }
        if (req.employeeTypeId != undefined) {
            if (req.employeeTypeId === 1) {
                query = query + ` and e.employee_type_id = "${req.employeeTypeId}"`;
            } else if (req.employeeTypeId !== 1) {
                query = query + ` and e.employee_type_id != 1`;
            }
        }
        return await this.leaveBalanceRepo.query(query)
    }



}