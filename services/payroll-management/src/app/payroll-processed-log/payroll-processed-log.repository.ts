import { CommonResponseModel, PayRollMisReportReq, PayrollProcessedLogReq } from "@hrexpert/shared-models";
import { MonthWIseEmpReportReq } from "@hrexpert/shared-services";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollProcessedLogEntity } from "./entites/payroll-processed-log.entity";


@Injectable()
export class PayrollProcessedLogRepository extends Repository<PayrollProcessedLogEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(PayrollProcessedLogEntity) private payrollProcessedLogRepository: Repository<PayrollProcessedLogEntity>,
        private readonly configService: ConfigService

    ) {
        super(payrollProcessedLogRepository.target, payrollProcessedLogRepository.manager, payrollProcessedLogRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getPayrollProcessedLogRepo(req: PayrollProcessedLogReq): Promise<any> {
        let query = `
                SELECT
                ppl.id,
                ppl.pay_period AS payPeriod,
                ppl.pay_days AS payDays,
                ppl.payroll_week AS payrollWeek,
                ppl.payroll_month AS payrollMonth,
                ppl.present_count AS presentCount,
                ppl.absent_count AS absentCount,
                ppl.leave_count AS leaveCount,
                ppl.component_records AS componentRecords, 
                ppl.created_at AS createdAt,
                ppl.created_user AS createdUser,
                ppl.updated_at AS updatedAt,
                ppl.updated_user AS updatedUser,
                ppl.version_flag AS versionFlag,
                ppl.is_active AS isActive,
                ppl.employee_id AS employeeId,
                ppl.component_id AS componentId,
                ppl.net_pay AS netPayable,
                e.id,
                CONCAT(e.first_name, " ", e.last_name) AS employeeName,
                e.employee_code AS employeeCode,
                e.bank_name AS bankName,
                e.bank_ac_no AS bankAcNo,
                e.bank_ifsc_code AS bankIfscCode, 
                dp.name AS departmentName,
                dp.id AS departmentId,
                dv.id AS divisionId,
                br.id AS branchId,
                dg.id AS designationId,
                dv.division_name AS divisionName,
                br.branch_name AS branchName,
                dg.name AS designationName,
                ppl.pay_mode AS payMode,
                ppl.hold_status AS holdStatus
                
                FROM ${this.dbNames.pms}.payroll_processed_logs ppl
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id= ppl.employee_id  
                LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
                LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
                LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
                LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
                LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
                WHERE 1=1
                `
        if (req.branchId) {
            query += `
                   AND ppl.branch_id = ${req.branchId}`;
        }
        if (req.payrollMonth) {
            query += `
                   AND ppl.payroll_month = ${req.payrollMonth}`;
        }
        if (req.divisionId) {
            query += `
                   AND dv.id IN (${req.divisionId})`;
        }
        if (req.employeeTypeId) {
            query += `
                   AND ppl.employee_type_id = ${req.employeeTypeId}`;
        }
        if (req.employeeId) {
            query += ` AND ppl.employee_id = ${req.employeeId}`
        }

        return await this.query(query)
    }

    async getPayrollMonth(req: PayrollProcessedLogReq): Promise<any> {
        let query = `
            SELECT ppl.id as pplId,ppl.payroll_month AS payrollMonth, DATE_FORMAT(STR_TO_DATE(ppl.payroll_month, '%Y%m'), '%M %Y') AS monthYear,ppl.pay_days AS payDays, e.id AS empId,CONCAT(e.first_name,'',e.last_name) AS empName,e.employee_code AS empCode,b.id AS branchId,b.branch_name AS branchName,d.id AS deptId,d.name AS department,des.id AS desId,des.name AS designation,e.email_id as emailId
            FROM ${this.dbNames.pms}.payroll_processed_logs ppl
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.designations des ON des.id = e.designation_id
            WHERE 1=1 
            ${req.employeeId ? `AND employee_id = ${req.employeeId}` : ''} ${req.payrollMonth ? `AND payroll_month LIKE '${req.payrollMonth}%'` : ''}
            ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.employeeCode ? `AND employee_code = ${req.employeeCode}` : ''}`;
        return await this.query(query);
    }

    async getPayrollDataById(req: PayrollProcessedLogReq): Promise<any> {
        let query = `
            SELECT DATE_FORMAT(STR_TO_DATE(ppl.payroll_month, '%Y%m'), '%M %Y') AS monthYear,ppl.pay_days AS payDays,ppl.payroll_month as payrollMonth,ppl.component_records as componentRecords,e.email_id as emailId,
            e.id AS empId,CONCAT(e.first_name,'',e.last_name) AS empName,e.employee_code AS empCode,e.date_of_joining AS doj,e.pf_no AS pfNo,e.esic_no AS esicNo, e.bank_name AS bankName,e.bank_ac_no AS bankAccNo,
            b.id AS branchId,b.branch_name AS branchName,
            d.id AS deptId,d.name AS department,
            des.id AS desId,des.name AS designation
            FROM ${this.dbNames.pms}.payroll_processed_logs ppl
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.designations des ON des.id = e.designation_id
            WHERE 1=1
            ${req.employeeId ? `AND e.id IN(${req.employeeId})` : ''} ${req.payrollMonth ? `AND ppl.payroll_month LIKE '${req.payrollMonth}%'` : ''}`;
        return await this.query(query);
    }

    async getPayrollProcessedLogRepoData(): Promise<any> {
        let query = `
                SELECT
                ppl.id,
                ppl.pay_period AS payPeriod,
                ppl.pay_days AS payDays,
                ppl.payroll_week AS payrollWeek,
                ppl.payroll_month AS payrollMonth,
                ppl.present_count AS presentCount,
                ppl.absent_count AS absentCount,
                ppl.leave_count AS leaveCount,
                ppl.component_records AS componentRecords,
                ppl.created_at AS createdAt,
                ppl.created_user AS createdUser,
                ppl.updated_at AS updatedAt,
                ppl.updated_user AS updatedUser,
                ppl.version_flag AS versionFlag,
                ppl.is_active AS isActive,
                ppl.employee_id AS employeeId,
                ppl.component_id AS componentId,
                pe.name AS employeeName
                FROM ${this.dbNames.pms}.payroll_processed_logs ppl
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id= ppl.employee_id
                LIMIT 3
                `
        return await this.query(query)
    }

    async getBranchWiseEmpData(req?: any): Promise<any> {
        let query = `
            SELECT
                emp.id AS empId,
                emp.employee_code AS empCode,
                br.id AS branchId,
                br.branch_name AS branchName
            FROM ${this.dbNames.ems}.employee emp
            LEFT JOIN ${this.dbNames.ems}.branches br
            ON emp.branch_id = br.id
            LIMIT 3
        `;
        return await this.query(query);
    }


    async getPayrollHeadCountReportDataRepo(req?: any): Promise<any> {
        let query = `
                SELECT
                ppl.id,
                ppl.pay_period AS payPeriod,
                ppl.pay_days AS payDays,
                ppl.payroll_week AS payrollWeek,
                ppl.payroll_month AS payrollMonth,
                ppl.present_count AS presentCount,
                ppl.absent_count AS absentCount,
                ppl.leave_count AS leaveCount,
                ppl.component_records AS componentRecords,
                ppl.created_at AS createdAt,
                ppl.created_user AS createdUser,
                ppl.updated_at AS updatedAt,
                ppl.updated_user AS updatedUser,
                ppl.version_flag AS versionFlag,
                ppl.is_active AS isActive,
                ppl.employee_id AS employeeId,
                ppl.component_id AS componentId,
                pe.name AS employeeName,
                br.branch_name as branchName,
                br.id as branchId
                FROM ${this.dbNames.pms}.payroll_processed_logs ppl
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id= ppl.employee_id
                LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= ppl.branch_id
                WHERE 1=1
                       `
        if (req.branchId) {
            query += `
                   AND ppl.branch_id = ${req.branchId}`;
        }
        if (req.payrollMonth) {
            query += `
                   AND ppl.payroll_month = ${req.payrollMonth}`;
        }
        if (req.employeeTypeId) {
            query += `
                   AND ppl.employee_type_id = ${req.employeeTypeId}`;
        }
        return await this.query(query)
    }

    async getEmpDOBandDORDataRepo(req?: any): Promise<any> {
        let query = `
            SELECT
                emp.id,
                emp.employee_code AS employeeCode,
                DATE_FORMAT(emp.date_of_joining, '%Y%m') AS dateOfJoining,
                DATE_FORMAT(emp.date_of_reliving, '%Y%m') AS dateOfReliving,
                emp.branch_id AS branchId
            FROM ${this.dbNames.ems}.employee emp
            LEFT JOIN ${this.dbNames.pms}.payroll_processed_logs ppl ON ppl.employee_id = emp.id`;

        if (req.branchId) {
            query += `
                AND ppl.branch_id = ${req.branchId}`;
        }

        if (req.payrollMonth) {
            query += `
                AND ppl.payroll_month = ${req.payrollMonth}`;
        }

        return await this.query(query);
    }
    async getBankReconciliationReportRepo(req: MonthWIseEmpReportReq): Promise<any> {
        try {
            let query = `
            SELECT 
                p.bank_name AS bankName ,
                SUM(p.net_pay) AS netAmount ,
                COUNT(p.employee_id) AS headCount,
                GROUP_CONCAT(p.employee_id) AS employeeIds,
                p.branch_id as branch
                FROM ${this.dbNames.pms}.payroll_processed_logs p
                LEFT JOIN 
                    ${this.dbNames.ems}.departments d ON p.department_id = d.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee e ON p.employee_id = e.employee_code
                LEFT JOIN 
                    ${this.dbNames.ems}.division di ON p.division_id = di.id
                LEFT JOIN 
                    ${this.dbNames.ems}.branches br ON p.branch_id = br.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id 
                    WHERE 1=1 AND p.employee_id > 0 `

            if (req.month) {
                query += ` AND p.payroll_month  = ${req.month}`;
            }
            if (req.branch && req.branch !== 'ALL') {
                query += ` AND p.branch_id = '${req.branch}'`;
            }
            if (req.department) {
                query += ` AND p.department_id = '${req.department}'`;
            }
            if (req.division) {
                query += ` AND p.division_id = '${req.division}'`;
            }
            query += ` GROUP BY p.bank_name `
            return await this.query(query)
        } catch (err) {
            throw err
        }
    }


    async getCashReconciliationReportRepo(req: MonthWIseEmpReportReq): Promise<any> {
        try {
            let query = `
            SELECT 
                p.bank_name AS bankName ,
                SUM(p.net_pay) AS netAmount ,
                COUNT(p.employee_id) AS headCount,
                GROUP_CONCAT(p.employee_id) AS employeeIds,
                p.branch_id as branch,
                p.pay_mode as payMode
                FROM ${this.dbNames.pms}.payroll_processed_logs p
                LEFT JOIN 
                    ${this.dbNames.ems}.departments d ON p.department_id = d.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee e ON p.employee_id = e.employee_code
                LEFT JOIN 
                    ${this.dbNames.ems}.division di ON p.division_id = di.id
                LEFT JOIN 
                    ${this.dbNames.ems}.branches br ON p.branch_id = br.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id 
                    WHERE 1=1 AND p.employee_id > 0 AND p.pay_mode = 'Cash'`

            if (req.month) {
                query += ` AND p.payroll_month  = ${req.month}`;
            }
            if (req.branch && req.branch !== 'ALL') {
                query += ` AND p.branch_id = '${req.branch}'`;
            }
            if (req.department) {
                query += ` AND p.department_id = '${req.department}'`;
            }
            if (req.division) {
                query += ` AND p.division_id = '${req.division}'`;
            }
            query += ` GROUP BY p.pay_mode `
            return await this.query(query)
        } catch (err) {
            throw err
        }
    }


    async getEmployeesDataByBank(req: { employeeId: [number], month: string }): Promise<CommonResponseModel> {
        const data = [];
        let query = ` SELECT e.first_name AS employeeName,
                       p.employee_id AS employeeId,
                       p.bank_name AS bankName ,
                       e.employee_code AS employeeCode,
                       e.bank_ac_no AS bankAccountNumber,
                       e.bank_ifsc_code AS ifscCode,
                       br.branch_name AS branch,
                       di.division_name AS divisionName,
                       d.name AS departmentName,
                       ds.name AS designationName,
                       p.net_pay as netSalary,
                       SUM(p.net_pay) AS total
                FROM ${this.dbNames.pms}.payroll_processed_logs p
                LEFT JOIN 
                    ${this.dbNames.ems}.departments d ON p.department_id = d.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee e ON p.employee_id = e.id
                LEFT JOIN 
                    ${this.dbNames.ems}.division di ON p.division_id = di.id
                LEFT JOIN 
                    ${this.dbNames.ems}.branches br ON p.branch_id = br.id
                    LEFT JOIN 
                    ${this.dbNames.ems}.designations ds ON p.designation_id = ds.id
                LEFT JOIN 
                    ${this.dbNames.ems}.employee_type et ON et.id = e.employee_type_id 
                    WHERE 1=1 AND p.employee_id > 0 AND p.net_pay> 0  
                     AND p.employee_id IN(${req.employeeId}) and p.payroll_month = ${req.month}`
        query += ` GROUP BY p.employee_id `;
        const result = await this.query(query);
        if (result) {
            for (const rec of result) {
                data.push({
                    employeeId: rec.employeeId,
                    employeeCode: rec.employeeCode,
                    employeeName: rec.employeeName,
                    bankName: rec.bankName,
                    bankAccountNumber: rec.bankAccountNumber,
                    ifscCode: rec.ifscCode,
                    branch: rec.branch,
                    divisionName: rec.divisionName,
                    departmentName: rec.departmentName,
                    designationName: rec.designationName,
                    month: rec.month,
                    netSalary: rec.total,
                });
            }
        }

        if (!data.length) {
            return new CommonResponseModel(false, 10101, "No Data Found");
        } else {
            return new CommonResponseModel(true, 33333, "Data Retrieved Successfully", data);
        }
    }

    async getPayrollProcessedLogForHodApproval(req: PayrollProcessedLogReq): Promise<any> {
        let query = `
                SELECT
                ppl.id,
                ppl.pay_period AS payPeriod,
                ppl.pay_days AS payDays,
                ppl.payroll_week AS payrollWeek,
                ppl.payroll_month AS payrollMonth,
                ppl.present_count AS presentCount,
                ppl.absent_count AS absentCount,
                ppl.leave_count AS leaveCount,
                ppl.component_records AS componentRecords, 
                ppl.created_at AS createdAt,
                ppl.created_user AS createdUser,
                ppl.updated_at AS updatedAt,
                ppl.updated_user AS updatedUser,
                ppl.version_flag AS versionFlag,
                ppl.is_active AS isActive,
                ppl.employee_id AS employeeId,
                ppl.component_id AS componentId,
                ppl.net_pay AS netPayable,
                e.id,
                CONCAT(e.first_name, " ", e.last_name) AS employeeName,
                e.employee_code AS employeeCode,
                e.bank_name AS bankName,
                e.bank_ac_no AS bankAcNo,
                e.bank_ifsc_code AS bankIfscCode, 
                dp.name AS departmentName,
                dp.id AS departmentId,
                dv.id AS divisionId,
                br.id AS branchId,
                dg.id AS designationId,
                dv.division_name AS divisionName,
                br.branch_name AS branchName,
                dg.name AS designationName
                FROM ${this.dbNames.pms}.payroll_processed_logs ppl
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id= ppl.employee_id  
                LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
                LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
                LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
                LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
                LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
                WHERE 1=1 AND ppl.carry_forward = 1
                `
        if (req.branchId) {
            query += `
                   AND ppl.branch_id = ${req.branchId}`;
        }
        if (req.payrollMonth) {
            query += `
                   AND ppl.payroll_month = ${req.payrollMonth}`;
        }
        if (req.divisionId) {
            query += `
                   AND dv.id = ${req.divisionId}`;
        }
        if (req.employeeId) {
            query += ` AND ppl.employee_id = ${req.employeeId}`
        }
        if (req.employeeTypeId) {
            query += `
                   AND ppl.employee_type_id = ${req.employeeTypeId}`;
        }
        return await this.query(query)
    }

    async getPayrollHeadWiseRepo(req: PayrollProcessedLogReq): Promise<any> {
        let query = `
            SELECT
            ppl.id,
            ppl.payroll_month AS payrollMonth,
            ppl.component_records AS componentRecords, 
            ppl.employee_id AS employeeId,
            ppl.component_id AS componentId,
            ppl.net_pay AS netPayable,
            e.id,
            CONCAT(e.first_name, " ", e.last_name) AS employeeName,
            e.employee_code AS employeeCode,
            e.bank_name AS bankName,
            e.bank_ac_no AS bankAcNo,
            e.bank_ifsc_code AS bankIfscCode, 
            dp.name AS departmentName,
            dp.id AS departmentId,
            dv.id AS divisionId,
            br.id AS branchId,
            dg.id AS designationId,
            dv.division_name AS divisionName,
            br.branch_name AS branchName,
            dg.name AS designationName
            FROM ${this.dbNames.pms}.payroll_processed_logs ppl
            LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id = ppl.employee_id  
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
            LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
            WHERE 1=1`;
        if (req.branchId) {
            query += ` AND ppl.branch_id = ${req.branchId}`;
        }
        if (req.payrollMonth) {
            query += ` AND ppl.payroll_month = '${req.payrollMonth}'`;
        }
        if (req.employeeTypeId) {
            query += ` AND ppl.employee_type_id = ${req.employeeTypeId}`;
        }
        if (req.employeeId) {
            query += ` AND ppl.employee_id = ${req.employeeId}`;
        }
        if (req.departmentId) {
            query += ` AND ppl.department_id = ${req.departmentId}`;
        }
        const result = await this.query(query);
        const groupedByDepartment: any = {};
        result.forEach(record => {
            const { departmentName, componentRecords } = record;
            const componentData = JSON.parse(componentRecords);
            if (!groupedByDepartment[departmentName]) {
                groupedByDepartment[departmentName] = {};
            }
            Object.keys(componentData).forEach(key => {
                const value = parseFloat(componentData[key]) || 0;
                if (!groupedByDepartment[departmentName][key]) {
                    groupedByDepartment[departmentName][key] = value;
                } else {
                    groupedByDepartment[departmentName][key] += value;
                }
            })
        })
        const finalResult = Object.keys(groupedByDepartment).map(departmentName => {
            const summedComponentRecords = groupedByDepartment[departmentName];
            return {
                departmentName,
                componentRecords: JSON.stringify(summedComponentRecords),
            }
        })
        return finalResult;
    }

    async getPayrollMisReportEmployeeRepo(req: PayRollMisReportReq): Promise<any> {
        console.log(req, "fkfjbdhbv")
        let query = `
                SELECT
                ppl.id,
                ppl.pay_period AS payPeriod,
                ppl.pay_days AS payDays,
                ppl.payroll_week AS payrollWeek,
                ppl.payroll_month AS payrollMonth,
                ppl.present_count AS presentCount,
                ppl.absent_count AS absentCount,
                ppl.leave_count AS leaveCount,
                ppl.component_records AS componentRecords, 
                ppl.created_at AS createdAt,
                ppl.created_user AS createdUser,
                ppl.updated_at AS updatedAt,
                ppl.updated_user AS updatedUser,
                ppl.version_flag AS versionFlag,
                ppl.is_active AS isActive,
                ppl.employee_id AS employeeId,
                ppl.component_id AS componentId,
                ppl.net_pay AS netPayable,
                e.id,
                CONCAT(e.first_name, " ", e.last_name) AS employeeName,
                e.employee_code AS employeeCode,
                e.bank_name AS bankName,
                e.bank_ac_no AS bankAcNo,
                e.bank_ifsc_code AS bankIfscCode, 
                dp.name AS departmentName,
                dp.id AS departmentId,
                dv.id AS divisionId,
                br.id AS branchId,
                dg.id AS designationId,
                dv.division_name AS divisionName,
                br.branch_name AS branchName,
                dg.name AS designationName,
                ppl.pay_mode AS payMode,
                ppl.hold_status AS holdStatus
                
                FROM ${this.dbNames.pms}.payroll_processed_logs ppl
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id= ppl.employee_id  
                LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
                LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
                LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
                LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
                LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
                WHERE ppl.employee_type_id = 1
                `
        if (req?.branchId) {
            query += `
                   AND ppl.branch_id = ${req.branchId}`;
        }
        if (req?.payrollYear) {
            query += `
                   AND ppl.payroll_month = ${req.payrollYear}`;
        }
        if (req?.payMode) {
            query += `
                   AND ppl.pay_mode = '${req.payMode}'`;
        }
        return await this.query(query)
    }

    async getPayrollMisReportWorkerRepo(req: PayRollMisReportReq): Promise<any> {
        console.log(req, "fkfjbdhbv")
        let query = `
                SELECT
                ppl.id,
                ppl.pay_period AS payPeriod,
                ppl.pay_days AS payDays,
                ppl.payroll_week AS payrollWeek,
                ppl.payroll_month AS payrollMonth,
                ppl.present_count AS presentCount,
                ppl.absent_count AS absentCount,
                ppl.leave_count AS leaveCount,
                ppl.component_records AS componentRecords, 
                ppl.created_at AS createdAt,
                ppl.created_user AS createdUser,
                ppl.updated_at AS updatedAt,
                ppl.updated_user AS updatedUser,
                ppl.version_flag AS versionFlag,
                ppl.is_active AS isActive,
                ppl.employee_id AS employeeId,
                ppl.component_id AS componentId,
                ppl.net_pay AS netPayable,
                e.id,
                CONCAT(e.first_name, " ", e.last_name) AS employeeName,
                e.employee_code AS employeeCode,
                e.bank_name AS bankName,
                e.bank_ac_no AS bankAcNo,
                e.bank_ifsc_code AS bankIfscCode, 
                dp.name AS departmentName,
                dp.id AS departmentId,
                dv.id AS divisionId,
                br.id AS branchId,
                dg.id AS designationId,
                dv.division_name AS divisionName,
                br.branch_name AS branchName,
                dg.name AS designationName,
                ppl.pay_mode AS payMode,
                ppl.hold_status AS holdStatus
                
                FROM ${this.dbNames.pms}.payroll_processed_logs ppl
                LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id= ppl.employee_id  
                LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
                LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
                LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
                LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
                LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
                WHERE ppl.employee_type_id = 0
                `
        if (req?.branchId) {
            query += `
                   AND ppl.branch_id = ${req.branchId}`;
        }
        if (req?.payrollYear) {
            query += `
                   AND ppl.payroll_month = ${req.payrollYear}`;
        }
        if (req?.payMode) {
            query += `
                   AND ppl.pay_mode = '${req.payMode}'`;
        }
        return await this.query(query)
    }

    async getPayrollEsiReportRepo(req: PayrollProcessedLogReq): Promise<any> {
        let query = `
            SELECT
            ppl.id,
            ppl.payroll_month AS payrollMonth,
            ppl.component_records AS componentRecords, 
            ppl.employee_id AS employeeId,
            ppl.component_id AS componentId,
            ppl.net_pay AS netPayable,
            ppl.pay_days AS payDays,
            e.id,
            CONCAT(e.first_name, " ", e.last_name) AS employeeName,
            e.employee_code AS employeeCode,
            e.esic_no AS esicNo,
            e.uan AS uan,
            e.bank_name AS bankName,
            e.bank_ac_no AS bankAcNo,
            e.bank_ifsc_code AS bankIfscCode, 
            dp.name AS departmentName,
            dp.id AS departmentId,
            dv.id AS divisionId,
            br.id AS branchId,
            dg.id AS designationId,
            dv.division_name AS divisionName,
            br.branch_name AS branchName,
            dg.name AS designationName
            FROM ${this.dbNames.pms}.payroll_processed_logs ppl
            LEFT JOIN ${this.dbNames.pms}.payroll_employees pe ON pe.employee_id = ppl.employee_id  
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = ppl.employee_id
            LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id = e.designation_id
            WHERE 1=1`;
        if (req.branchId) {
            query += ` AND ppl.branch_id = ${req.branchId}`;
        }
        if (req.payrollMonth) {
            query += ` AND ppl.payroll_month = '${req.payrollMonth}'`;
        }
        if (req.employeeTypeId) {
            query += ` AND ppl.employee_type_id = ${req.employeeTypeId}`;
        }
        if (req.employeeId) {
            query += ` AND ppl.employee_id = ${req.employeeId}`;
        }
        if (req.departmentId) {
            query += ` AND ppl.department_id = ${req.departmentId}`;
        }
        return await this.query(query);
    }

}