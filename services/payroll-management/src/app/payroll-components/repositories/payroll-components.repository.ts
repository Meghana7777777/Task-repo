import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollComponentsEntity } from "../entites/payroll-components.entity";

@Injectable()
export class PayrollComponentsRepository extends Repository<PayrollComponentsEntity> {
    private readonly dbNames: any
    constructor(@InjectRepository(PayrollComponentsEntity) private payrollComponentsRepository: Repository<PayrollComponentsEntity>,
        private readonly configService: ConfigService
    ) {
        super(payrollComponentsRepository.target, payrollComponentsRepository.manager, payrollComponentsRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames')
    }

    async getAllPayrollComponentsRepo(): Promise<any> {
        let query = `
            SELECT 
                pc.id,
                pc.component_name AS componentName,
                pc.column_name AS columnName,
                pc.column_order AS columnOrder,
                pc.is_derived AS isDerived,
                pc.derived_rule AS derivedRule,
                pc.cutoff_amount AS cutoffAmount,
                pc.round_strg AS roundStrg,
                pc.calculated_rule AS amount,
                pc.eff_date AS effDate,
                pc.type AS type,
                pc.component_type AS componentType,
                pc.is_pf_earning AS isPfEarning,
                pc.is_esi_earning AS isEsiEarning,
                pc.is_active AS isActive,
                pc.employee_type_id AS employeeTypeId,
                pc.is_gross_derived AS isGrossDerived,
                pc.payroll_code AS payrollCode,
                pc.payroll_type AS payrollType,
                pc.state AS state,
                pc.branch_id AS branchId,
                b.branch_name AS branchName,
                et.name AS employeeType
            FROM ${this.dbNames.pms}.payroll_components pc
            LEFT JOIN ${this.dbNames.ems}.employee_type et ON pc.employee_type_id = et.id
            LEFT JOIN ${this.dbNames.ems}.branches b ON pc.branch_id = b.id
            WHERE 
                (pc.employee_type_id IS NOT NULL AND pc.employee_type_id != '') 
                AND 
                (pc.branch_id IS NOT NULL AND pc.branch_id != '')
        `;

        console.log(query, 'query');
        return await this.payrollComponentsRepository.query(query);
    }

    async getAllPayrollComponentsEmployeeAganistRepo(req:any):Promise<any> {
        let query = `
            SELECT 
                pc.id,
                pc.component_name AS componentName,
                pc.column_name AS columnName,
                pc.column_order AS columnOrder,
                pc.is_derived AS isDerived,
                pc.derived_rule AS derivedRule,
                pc.cutoff_amount AS cutoffAmount,
                pc.round_strg AS roundStrg,
                pc.calculated_rule AS amount,
                pc.eff_date AS effDate,
                pc.type AS type,
                pc.component_type AS componentType,
                pc.is_pf_earning AS isPfEarning,
                pc.is_esi_earning AS isEsiEarning,
                pc.is_active AS isActive,
                pc.employee_type_id AS employeeTypeId,
                pc.is_gross_derived AS isGrossDerived,
                pc.payroll_code AS payrollCode,
                pc.payroll_type AS payrollType,
                pc.state AS state,
                pc.branch_id AS branchId,
                b.branch_name AS branchName,
                et.name AS employeeType
            FROM ${this.dbNames.pms}.payroll_components pc
            LEFT JOIN ${this.dbNames.ems}.employee_type et ON pc.employee_type_id = et.id
            LEFT JOIN ${this.dbNames.ems}.branches b ON pc.branch_id = b.id
            WHERE 
                (pc.employee_type_id IS NOT NULL AND pc.employee_type_id != '')
                AND 
                (pc.branch_id IS NOT NULL AND pc.branch_id != '')
                ${req.employeeTypeId ? `AND pc.employee_type_id = ${req.employeeTypeId}` : ''}  
        `;
    
        return await this.payrollComponentsRepository.query(query);
    }
    

    async getAllPayrollComponentsByBranch(req: any): Promise<any> {
        let query = `
            SELECT 
                pc.id,
                pc.component_name AS componentName,
                pc.column_name AS columnName,
                pc.column_order AS columnOrder,
                pc.is_derived AS isDerived,
                pc.derived_rule AS derivedRule,
                pc.cutoff_amount AS cutoffAmount,
                pc.round_strg AS roundStrg,
                pc.calculated_rule AS amount,
                pc.eff_date AS effDate,
                pc.type AS type,
                pc.component_type AS componentType,
                pc.is_pf_earning AS isPfEarning,
                pc.is_esi_earning AS isEsiEarning,
                pc.is_active AS isActive,
                pc.employee_type_id AS employeeTypeId,
                pc.is_gross_derived AS isGrossDerived,
                pc.payroll_code AS payrollCode,
                pc.payroll_type AS payrollType,
                pc.state AS state,
                pc.branch_id AS branchId,
                b.branch_name AS branchName,
                et.name AS employeeType
            FROM ${this.dbNames.pms}.payroll_components pc
            LEFT JOIN ${this.dbNames.ems}.employee_type et ON pc.employee_type_id = et.id
            LEFT JOIN ${this.dbNames.ems}.branches b ON pc.branch_id = b.id
            WHERE 
                (pc.employee_type_id IS NOT NULL AND pc.employee_type_id != '') 
                AND 
                (pc.branch_id = ${req.branchId})
        `;

        console.log(query, 'query');
        return await this.payrollComponentsRepository.query(query);
    }


    async getAllPayrollCodesDataRepo(): Promise<any> {
        let query = `SELECT DISTINCT 
                        pcode.payroll_code AS payrollCode,
                        pcode.payroll_type AS payrollType,
                        pcode.state AS state,
                        pcode.is_active AS isActive
                     FROM ${this.dbNames.pms}.payroll_code pcode
                     WHERE pcode.payroll_code IS NOT NULL`;

        console.log(query, 'query');
        return await this.payrollComponentsRepository.query(query);
    }


}