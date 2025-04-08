import { EmpNonRecurringRequest } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";
import { EmpNonRecComponentsEntity } from "../entites/emp-non-rec-components.entity";
import { EmpNonRecTermsEntity } from "../entites/emp-non-rec-terms.entity";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class EmployeeNonRecurringComponentsRepository extends Repository<EmpNonRecComponentsEntity> {
    private readonly dbNames: any

    constructor(
        @InjectRepository(EmpNonRecComponentsEntity)
        private employeeNonRecurringComponentsRepository: Repository<EmpNonRecComponentsEntity>,
        private readonly configService: ConfigService,
    ) {
        super(employeeNonRecurringComponentsRepository.target, employeeNonRecurringComponentsRepository.manager, employeeNonRecurringComponentsRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }

    async getEmpNonRecDataRepo(req: EmpNonRecurringRequest): Promise<any> {
        let query = `SELECT
                pr.id AS id,
                pr.total_amount AS totalAmount,
                pr.emi_count AS emiCount,
                pr.emi_amount AS emiAmount,
                pr.is_permanent AS isPermanent,
                pr.start_date AS startDate,
                pr.end_date AS endDate,
                pe.name AS name,
                pe.employee_id AS employeeId,
                pe.employee_code AS employeeCode,
                pec.component_name AS componentName,
                pec.id AS payRollCompId,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'totalTerms', t.total_terms,
                        'termCount', t.term_count,
                        'emiAmount', t.term_amount,
                        'payMonth', t.pay_month,
                        'isProcessed', t.is_processed
                    )
                ) AS TermDetails,
                CONCAT(e.first_name, " ", e.last_name) AS employeeName,
                e.id AS employeeId,
                e.employee_code AS employeeCode,
                dp.name AS departmentName,
                dp.id AS departmentId,
                dv.id AS divisionId,
                br.id AS branchId,
                dg.id AS designationId,
                dv.division_name AS divisionName,
                br.branch_name AS branchName,
                dg.name AS designationName
            FROM ${this.dbNames.pms}.emp_non_rec_components pr
            LEFT JOIN ${this.dbNames.pms}.emp_non_rec_terms t ON t.non_recurring_id = pr.id
            LEFT JOIN ${this.dbNames.pms}.payroll_components pec ON pec.id = pr.component_id
            LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id = pr.employee_id
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = pr.employee_id
            LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
            WHERE pr.is_active = 1 `;
        if (req.payRollEmployee) {
            query += ` AND pr.employee_id = ${req.payRollEmployee}`;
        }
        if (req.payRollComponent) {
            query += ` AND pr.component_id = ${req.payRollComponent}`;
        }
        if (req.branches) {
            query += ` AND br.id = ${req.branches}`;
        }
        if (req.divisionId) {
            query += ` AND dv.id = ${req.divisionId}`;
        }
        if (req.departmentId) {
            query += ` AND dp.id = ${req.departmentId}`;
        }
        if (req.designationId) {
            query += ` AND dg.id = ${req.designationId}`;
        }
        if (req.startDate) {
            query += ` AND pr.start_date = ${req.startDate}`;
        }
        query += `
        GROUP BY
            pr.id, pr.total_amount, pr.emi_count, pr.emi_amount, pr.start_date, pr.end_date, pe.name,
            pe.employee_id, pe.employee_code, pec.component_name, pec.id, e.first_name,
            e.last_name, e.id, e.employee_code, dp.name, dp.id, dv.id, br.id, dg.id, dv.division_name, br.branch_name, dg.name;`;
        return await this.query(query);
    }

    async getAllDeductionsRecords(req: any): Promise<any> {
        let query = `SELECT 
        pr.id AS id,
        pr.total_amount AS totalAmount,
        pr.emi_count AS emiCount,
        pr.emi_amount AS emiAmount,
        pr.start_date AS startDate,
        pec.component_name AS componentName
        FROM ${this.dbNames.pms}.emp_non_rec_components pr
        LEFT JOIN ${this.dbNames.pms}.payroll_components pec ON pec.id = pr.component_id
        WHERE pr.is_active = 1 AND pr.is_permanent = 1 AND pr.employee_id = ${req.employeeId}`;

        return await this.query(query);
    }

}


