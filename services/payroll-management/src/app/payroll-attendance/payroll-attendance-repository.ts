import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollAttendanceEntity } from "./entites/payroll-attendance-entity";
import { BranchMonthReq, MonthReq } from "@hrexpert/shared-models";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PayrollAttendanceRepository extends Repository<PayrollAttendanceEntity> {
    private readonly dbNames: any
    constructor(@InjectRepository(PayrollAttendanceEntity) private payrollAttendanceRepository: Repository<PayrollAttendanceEntity>,
        private readonly configService: ConfigService
    ) {
        super(payrollAttendanceRepository.target, payrollAttendanceRepository.manager, payrollAttendanceRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }
    async getEmployeePayAttendance(req?: BranchMonthReq): Promise<any> {
        let query = ` SELECT 
                p.id, p.employee_id,et.name AS employeeType, p.employee_code AS empCode,ed.first_name AS empName, p.present_count, p.absent_count,p.lop_data, p.leave_count, p.co_count, p.od_count, p.wp_count, p.wo_count, p.ot_hours, p.holiday_count, p.allowance_days, p.pay_days, p.hp_count, p.branch_id,b.branch_name as branch,di.division_name as division, p.division_id, p.payroll_month FROM ${this.dbNames.pms}.payroll_attendance p
                LEFT JOIN ${this.dbNames.ems}.employee ed ON p.employee_code = ed.employee_code
                LEFT JOIN ${this.dbNames.ems}.branches b ON p.branch_id = b.id
                LEFT JOIN ${this.dbNames.ems}.division di ON di.id = p.division_id
                LEFT JOIN ${this.dbNames.ems}.employee_type et ON ed.employee_type_id = et.id
                where p.employee_id > 0 `;
        if (req.month != undefined) {
            query = query + ` and p.payroll_month = "${req.month}"`
        }
        if (req.branchId != undefined) {
            query = query + ` and p.branch_id = ${req.branchId}`
        }
        if (req.divisionId != undefined) {
            query = query + ` and p.division_id IN (${req.divisionId})`
        }
        if (req.employeeType != undefined) {
            query = query + ` and ed.employee_type_id = "${req.employeeType}"`
        }
        if (req.employeeId != undefined) {
            query = query + ` and p.employee_id = "${req.employeeId}"`
        }
        // if (req.employeeCode != undefined) {
        //     query = query + ` and ed.emp_code = "${req.employeeCode}"`
        // }
        console.log(query, 'query')
        return await this.payrollAttendanceRepository.query(query)
    }
}