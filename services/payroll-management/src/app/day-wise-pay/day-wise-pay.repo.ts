import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DayWisePayEntity } from "./day-wise-pay.entity";
import { DayWisePayReq } from "@hrexpert/shared-models";



@Injectable()
export class DayWisePayRepository extends Repository<DayWisePayEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(DayWisePayEntity) private dayWisePayRepo: Repository<DayWisePayEntity>,
        private readonly configService: ConfigService
    ) {
        super(dayWisePayRepo.target, dayWisePayRepo.manager, dayWisePayRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }
    // async getEmpIds(req: any): Promise<any> {
    //     console.log(req, "iiiiiii");
    //     const empCodes = req.empCode.map((e) => `'${e.EmpId}'`).join(',');
    //     const jobCodes = req.empCode.map((e) => `'${e.JobCode}'`).join(',');
    //     const employees = await this.dayWisePayRepo.query(`
    //         SELECT e.employee_code, e.id AS employeeId, e.branch_id AS branchId
    //         FROM ${this.dbNames.ems}.employee e
    //         WHERE e.employee_code IN (${empCodes})
    //     `);
    //     const jobs = await this.dayWisePayRepo.query(`
    //         SELECT j.id AS jobId, j.job_code
    //         FROM ${this.dbNames.ems}.jobs j
    //         WHERE j.job_code IN (${jobCodes})
    //     `);
    //     const jobIds = jobs.map((j) => j.jobId).join(',');
    //     const branchIds = employees.map((e) => e.branchId).join(',');

    //     const rates = await this.dayWisePayRepo.query(`
    //     SELECT jr.rate AS rate, jr.job_id, jr.branch_id
    //     FROM ${this.dbNames.ems}.jobs_rate jr
    //     WHERE jr.job_id IN (${jobIds}) AND jr.branch_id IN (${branchIds})
    // `);
    //     return { employees, jobs, rates };
    // }

    async getEmpIds(req: any): Promise<any> {
        if (!req.empCode || req.empCode.length === 0) {
            return []; // Return early if no employee codes are provided
        }

        const empCodes = req.empCode.map(e => e.EmpId);
        const jobCodes = req.empCode.map(e => e.JobCode);

        // Fetch Employees
        const employees = await this.dayWisePayRepo.query(
            `SELECT e.employee_code, e.id AS employeeId, e.branch_id AS branchId 
             FROM ${this.dbNames.ems}.employee e 
             WHERE e.employee_code IN (${empCodes.map(() => '?').join(',')})`,
            empCodes
        );

        if (employees.length === 0) {
            return []; // No employees found
        }

        // Fetch Jobs
        const jobs = await this.dayWisePayRepo.query(
            `SELECT j.id AS jobId, j.job_code 
             FROM ${this.dbNames.ems}.jobs j 
             WHERE j.job_code IN (${jobCodes.map(() => '?').join(',')})`,
            jobCodes
        );

        // Use Maps for faster lookup
        const jobsMap = new Map(jobs.map(j => [j.job_code, j.jobId]));
        const empMap = new Map(employees.map(e => [e.employee_code, e]));

        // Get job and branch IDs for rates query
        const jobIds = [...jobsMap.values()];
        const branchIds = [...new Set(employees.map(e => e.branchId))];

        if (jobIds.length === 0 || branchIds.length === 0) {
            return employees.map(emp => ({
                employee_code: emp.employee_code,
                employeeId: emp.employeeId,
                branchId: emp.branchId,
                job_id: null,
                rate: 0
            }));
        }

        // Fetch Job Rates
        const rates = await this.dayWisePayRepo.query(
            `SELECT jr.rate AS rate, jr.job_id, jr.branch_id 
             FROM ${this.dbNames.ems}.jobs_rate jr 
             WHERE jr.job_id IN (${jobIds.map(() => '?').join(',')}) 
               AND jr.branch_id IN (${branchIds.map(() => '?').join(',')})`,
            [...jobIds, ...branchIds]
        );

        // Use Map for job rates
        const ratesMap = new Map<string, number>();
        rates.forEach(r => {
            ratesMap.set(`${r.job_id}-${r.branch_id}`, r.rate);
        });

        // Construct result
        return employees.map(emp => {
            const jobId = jobsMap.get(req.empCode.find(e => e.EmpId === emp.employee_code)?.JobCode || '');
            const rate = jobId ? ratesMap.get(`${jobId}-${emp.branchId}`) || 0 : 0;

            return {
                employee_code: emp.employee_code,
                employeeId: emp.employeeId,
                branchId: emp.branchId,
                job_id: jobId || null,
                rate: rate
            };
        });
    }



    async getWorkerEmpBasic(req: any): Promise<any> {
        const queryBuilder = this.createQueryBuilder('dwp')
            .select([
                'dwp.emp_id AS employeeId',
                'dwp.job_id AS jobId',
                'dwp.job_code AS jobCode',
                'dwp.pay_date As payDate',
                'dwp.pay_month AS pyMonth',
                'dwp.units AS units',
                'dwp.add_earn AS addEarn',
                'dwp.add_dedu AS addDedu',
                'dwp.job_rate AS jobRate',
                'SUM(dwp.emp_pay) AS totalEmpPay'
            ])
            .where('dwp.pay_month = :month', { month: Number(req.month) })
            .andWhere('dwp.emp_id = :empId', { empId: req.employeeId })
            .groupBy('dwp.pay_date');

        return queryBuilder.getRawMany();
    }

    async getDayWiseRepo(req: DayWisePayReq): Promise<any> {
        let query = `SELECT
                dayW.id AS id,
                jb.job_code AS jobCode,
                jb.job_description AS jobDescription,
                dayW.pay_date AS payDate,
                dayW.units AS units,
                dayW.add_earn AS addEarn,
                dayW.add_dedu AS addDedu,
                dayW.job_rate AS jobRate,
                dayW.emp_pay AS empPay,
                dayW.job_status AS jobStatus,
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
            FROM ${this.dbNames.pms}.day_wise_pay dayW
            LEFT JOIN ${this.dbNames.ems}.jobs jb ON jb.id = dayW.job_id
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = dayW.emp_id
            LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id`;

        let conditions: string[] = [];

        if (req.employeeId) {
            conditions.push(`dayW.emp_id = ${req.employeeId}`);
        }
        if (req.payDate) {
            conditions.push(`dayW.pay_date = '${req.payDate}'`);
        }
        // if (req.branches) {
        //     conditions.push(`br.id = ${req.branches}`);
        // }
        if (req?.branches && req?.branches != 'All') {
            query += ` AND a.branch_id = ${req.branches}`;
          }
        if (req.divisionId) {
            conditions.push(`dv.id = ${req.divisionId}`);
        }
        if (req.departmentId) {
            conditions.push(`dp.id = ${req.departmentId}`);
        }
        if (req.designationId) {
            conditions.push(`dg.id = ${req.designationId}`);
        }
        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        return await this.query(query);
    }


}