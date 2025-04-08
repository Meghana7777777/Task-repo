import { PayRollComparisontReq } from "@hrexpert/shared-models";
import { PayrollComponentsSharedService, PayrollReq } from "@hrexpert/shared-services";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";
import { PayrollProcessedLogDto } from "../../payroll-processed-log/dto/payroll-processed-log.dto";
import { PayrollRecordsEntity } from "../entites/payroll-records.entity";


@Injectable()
export class PayrollRecordsRepository extends Repository<PayrollRecordsEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(PayrollRecordsEntity) private payrollRecordsRepository: Repository<PayrollRecordsEntity>,
        private readonly configService: ConfigService,
        private payrollTypeComponentsRepository: PayrollComponentsSharedService

    ) {
        super(payrollRecordsRepository.target, payrollRecordsRepository.manager, payrollRecordsRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }
    async getPayrollComparisonRepo(req: PayRollComparisontReq): Promise<any[]> {
        try {
            const response = await this.payrollTypeComponentsRepository.getAllPayrollComponentsForHeadCount();
            const payrollComponents = Array.isArray(response) ? response : response.data || [];
            let selectQueryParts = [
                'p.id',
                'p.payroll_month as payrollMonth',
                'p.employee_id as employeeId',
                'pe.name'
            ];
            payrollComponents.forEach(component => {
                selectQueryParts.push(`JSON_EXTRACT(component_records, '$.${component.columnName}') AS "${component.columnName}"`);
            });
            const selectQuery = selectQueryParts.join(', ');
            let query = `
                SELECT 
                    ${selectQuery}
                FROM ${this.dbNames.pms}.payroll_records p
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.id = p.employee_id
                WHERE 1=1
            `;
            if (req.payrollMonth) {
                query += ` AND (p.payroll_month) = ${req.payrollMonth}`
            }
            if (req.employeeId) {
                query += ` AND (p.employee_id) = ${req.employeeId}`
            }
            return await this.payrollRecordsRepository.query(query);
        } catch (err) {
            console.error('Error in getPayrollHeadCountRepo:', err);
        }
    }

    // async getAllPayrollRecords(req: PayrollReq): Promise<any> {
    //     const queryBuilder = this.createQueryBuilder('pr')
    //         .select([
    //             'pr.id AS id',
    //             'pr.payroll_month AS payrollMonth',
    //             'pr.payroll_week AS payrollWeek',
    //             'pe.name AS employeeName',
    //             'pe.employee_code AS employeeCode',
    //             `JSON_UNQUOTE(JSON_EXTRACT(pr.component_records, '$.${req.componentName}')) AS componentValue`,
    //             `'${req.componentName}' AS componentKey`
    //         ])
    //         .leftJoin(PayrollEmployeesEntity, 'pe', 'pe.id = pr.employee_id')
    //         .leftJoin(PayrollComponentsEntity, 'pc', 'pc.id = pr.component_id')
    //         .where('pr.payroll_month = :yearMonth', { yearMonth: req.yearMonth });

    //     if (req.componentName) {
    //         queryBuilder.andWhere(`JSON_EXTRACT(pr.component_records, '$.${req.componentName}') IS NOT NULL`);
    //         queryBuilder.andWhere(`JSON_UNQUOTE(JSON_EXTRACT(pr.component_records, '$.${req.componentName}')) != '0'`);
    //     }

    //     return queryBuilder.getRawMany();
    // }
    async getAllPayrollRecords(req: PayrollReq): Promise<any> {
        let query = `
            SELECT 
                pr.id AS id,
                pr.payroll_month AS payrollMonth,
                pr.payroll_week AS payrollWeek,
                e.employee_type_id AS employeeTypeId,
                b.branch_name AS BranchName, -- Branch name from the branches table
                et.name AS employeeTypeName,
                pe.name AS employeeName,
                pe.employee_code AS employeeCode,
                JSON_UNQUOTE(JSON_EXTRACT(pr.component_records, '$.${req.componentName}')) AS componentValue,
                '${req.componentName}' AS componentKey
            FROM ${this.dbNames.pms}.payroll_records pr
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = pr.employee_id
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id  -- Joining with branches table
            LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id
            LEFT JOIN ${this.dbNames.pms}.payroll_components pc ON pc.id = pr.component_id
            LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.id = pr.employee_id
            WHERE pr.payroll_month = '${req.yearMonth}'
        `;
        if (req.componentName) {
            query += `
                AND JSON_EXTRACT(pr.component_records, '$.${req.componentName}') IS NOT NULL
                AND JSON_UNQUOTE(JSON_EXTRACT(pr.component_records, '$.${req.componentName}')) != '0'
            `;
        }
        if (req.employeeType) {
            query += `
                AND e.employee_type_id = '${req.employeeType}'
            `;
        }
        if (req.branch && req.branch != 'All') {
            query += `
                AND e.branch_id = '${req.branch}'
            `;
        }
        return this.payrollRecordsRepository.query(query);
    }
    async getPayrollRecordsRepo(req: PayrollProcessedLogDto): Promise<any> {
        let query = `
                     SELECT
                   pr.id,
                   pr.component_records AS componentRecords,
                   pr.payroll_week AS payrollWeek,
                   pr.payroll_month AS payrollMonth,
                   pr.created_at,
                   pr.created_user,
                   pr.updated_at,
                   pr.updated_user,
                   pr.version_flag,
                   pr.is_active asisActive,
                   pr.employee_id AS employeeId,
                   pr.status AS status,
                   pr.is_attn_ince AS attIncentive,
                   pr.component_id,
                   CONCAT(e.first_name," ",e.last_name) AS employeeName,
                   e.id,
                   e.employee_code AS employeeCode,
                   e.employee_type_id AS employeeTypeId,
                   et.name AS employeeTypeName,
                   e.date_of_joining AS dateOfJoining,
                   dp.name AS departmentName,
                   dp.id AS departmentId,
                   dv.id AS divisionId,
                   br.id AS branchId,
                   dg.id AS designationId,
                   dv.division_name AS divisionName,
                   br.branch_name AS branchName,
                   dg.name AS designationName
                   FROM ${this.dbNames.pms}.payroll_records pr
                   LEFT JOIN ${this.dbNames.ems}.employee e ON e.id= pr.employee_id
                   LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
                   LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
                   LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
                   LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
                   LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id= e.employee_type_id
                   WHERE (pr.is_active) = 1
                   `
        if (req.employeeId) {
            query += ` AND (e.id) = ${req.employeeId}`
        }
        if (req.branchId) {
            query += ` AND (br.id) = ${req.branchId}`
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
        if (req.employeeTypeId) {
            query += ` AND (et.id) = ${req.employeeTypeId}`
        }
        if (req.status) {
            query += ` AND (pr.status) = '${req.status}'`
        }
        // const page = req.page || 1;
        // const pageSize = req.pageSize || 10;
        // const offset = (page - 1) * pageSize;

        // query += ` LIMIT ${pageSize} OFFSET ${offset}`;
        return await this.query(query);
    }

    async getWithoutReqRecordDataRepo(req?: any): Promise<any> {
        let query = `
                     SELECT
                   pr.id,
                   pr.component_records AS componentRecords,
                   pr.payroll_week AS payrollWeek,
                   pr.payroll_month AS payrollMonth,
                   pr.is_derived AS isDerived,
                   pr.created_at,
                   pr.created_user,
                   pr.status AS status,
                   pr.is_attn_ince AS attIncentive,
                   pr.updated_at,
                   pr.updated_user,
                   pr.version_flag,
                   pr.is_active asisActive,
                   pr.employee_id AS employeeId,
                   pr.component_id,
                   CONCAT(e.first_name," ",e.last_name) AS employeeName,
                   e.id,
                   e.employee_code AS employeeCode,
                   dp.name AS departmentName,
                   dp.id AS departmentId,
                   dv.id AS divisionId,
                   br.id AS branchId,
                   dg.id AS designationId,
                   dv.division_name AS divisionName,
                   br.branch_name AS branchName,
                   dg.name AS designationName,
                   et.id AS employeeTypeId,
                   et.name AS employeeTypeName
                   FROM ${this.dbNames.pms}.payroll_records pr
                   LEFT JOIN ${this.dbNames.ems}.employee e ON e.id= pr.employee_id
                   LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
                   LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
                   LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
                   LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
                   LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id= e.employee_type_id
                   WHERE 1=1 
                 `
                 if (req?.employeeId) {
                    query += ` AND pr.employee_id = '${req?.employeeId}'`
                }
                if (req?.employee_ids && Array.isArray(req.employee_ids) && req.employee_ids.length > 0) {
                    const idsString = req.employee_ids.map(id => `'${id}'`).join(", "); // Ensure IDs are in quotes for SQL
                    query += ` AND pr.employee_id IN (${idsString})`;
                }
                if (req?.status) {
                    query += ` AND pr.status = '${req.status}'`;
                }
        return await this.query(query);
    }

    async getRequestedPayrollRecordsData(req?: any): Promise<any> {
        let query = `
                     SELECT
                   pr.id,
                   pr.component_records AS componentRecords,
                   pr.payroll_week AS payrollWeek,
                   pr.payroll_month AS payrollMonth,
                   pr.is_derived AS isDerived,
                   pr.created_at,
                   pr.created_user,
                   pr.status AS status,
                   pr.is_attn_ince AS attIncentive,
                   pr.updated_at,
                   pr.updated_user,
                   pr.version_flag,
                   pr.is_active asisActive,
                   pr.employee_id AS employeeId,
                   pr.component_id,
                   CONCAT(e.first_name," ",e.last_name) AS employeeName,
                   e.id,
                   e.employee_code AS employeeCode,
                   dp.name AS departmentName,
                   dp.id AS departmentId,
                   dv.id AS divisionId,
                   br.id AS branchId,
                   dg.id AS designationId,
                   dv.division_name AS divisionName,
                   br.branch_name AS branchName,
                   dg.name AS designationName,
                   et.id AS employeeTypeId,
                   et.name AS employeeTypeName
                   FROM ${this.dbNames.pms}.payroll_records pr
                   LEFT JOIN ${this.dbNames.ems}.employee e ON e.id= pr.employee_id
                   LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
                   LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
                   LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
                   LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
                   LEFT JOIN ${this.dbNames.ems}.employee_type et ON et.id= e.employee_type_id
                   WHERE 1=1 
                 `
                 if (req?.employeeId) {
                    query += ` AND pr.employee_id = '${req?.employeeId}'`
                }
                if (req?.employee_ids && Array.isArray(req.employee_ids) && req.employee_ids.length > 0) {
                    const idsString = req.employee_ids.map(id => `'${id}'`).join(", ")
                    query += ` AND pr.employee_id IN (${idsString})`;
                }
                if (req?.status) {
                    query += ` AND pr.status = '${req.status}'`;
                }
        return await this.query(query);
    }


}