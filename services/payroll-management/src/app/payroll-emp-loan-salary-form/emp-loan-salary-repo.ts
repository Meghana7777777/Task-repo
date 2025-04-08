import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { EmployeeLoanEntity } from "./entity/emp-loan-salary-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DesignationsReq } from "@hrexpert/shared-models";
import { Employee } from "services/employee-management/src/app/employee-onboarding/entities/employee-details.entity";
import { DesignationsEntity } from "services/employee-management/src/app/designations/entites/designations.entity";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class EmpLoanSalaryRepo extends Repository<EmployeeLoanEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(EmployeeLoanEntity) private employeeLoanSalaryRepo: Repository<EmployeeLoanEntity>,
        private readonly configService: ConfigService
    ) {
        super(employeeLoanSalaryRepo.target, employeeLoanSalaryRepo.manager, employeeLoanSalaryRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getEmpLoanSalary(req: any): Promise<any> {
        try {
            let query = `SELECT 
                            l.id AS id,
                            l.employee_id AS employeeId,
                            l.employee_code AS employeeCode,
                            l.employee_name AS employeeName,
                            l.designation AS designation,
                            l.date_of_joining AS dateOfJoining,
                            l.TYPE AS type,
                            l.advance_amount AS advanceAmount,
                            l.installments,
                            l.effective_from AS effectiveFrom,
                            l.purpose,
                            l.reason,
                            l.amount_outstanding AS amountOutstanding,
                            l.date_of_applying AS dateOfApplying,
                            l.hod_mail AS hodMail,                            
                            l.STATUS AS status,
                            l.loan_ref_no AS loanRefNo,
                            CONCAT(ee.first_name," ",ee.last_name) AS firstName,
                            ee.salary AS monthlySalary
                            FROM ${this.dbNames.pms}.employee_loans l
                            LEFT JOIN ${this.dbNames.ems}.employee ee ON ee.id= l.employee_id
                            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= ee.branch_id
                            LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= ee.department_id
                            LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= ee.division_id
                            LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= ee.designation_id
                            WHERE 1=1 `
            if (req.id) {
                query += ` AND (l.id) = ${req.id}`
            }
            if (req.employeeId) {
                query += ` AND (l.employee_id) = ${req.employeeId}`
            }
            // if (req.branches) {
            //     query += ` AND (br.id) = ${req.branches}`
            // }
            if (req.branches && req.branches !== 'ALL') {
                query += ` AND br.id = '${req.branches}'`;
              }
            if (req.divisionId) {
                query += ` AND (dv.id) = ${req.divisionId}`
            }
            if (req.departmentId) {
                query += ` AND (dp.id) = ${req.departmentId}`
            }
            if (req.designationId) {
                query += ` AND (dg.id) = ${req.designationId}`
            }
            return await this.employeeLoanSalaryRepo.query(query);
        } catch (err) {
            console.log(err);
        }
    }
}


