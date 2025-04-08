import { OTBulkApprovalReq } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OTApprovalLog } from "./ot-approval-log";



@Injectable()
export class OTApprovalLogRepo extends Repository<OTApprovalLog> {
    private readonly dbNames: any

    constructor(@InjectRepository(OTApprovalLog) private otApprovalLogRepo: Repository<OTApprovalLog>,
        private readonly configService: ConfigService
    ) {
        super(otApprovalLogRepo.target, otApprovalLogRepo.manager, otApprovalLogRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }

    async getOTApprovedRepo(req: OTBulkApprovalReq): Promise<any> {
        let query = `
            SELECT
                ot.id as id,
                ot.emp_id AS empId,
                ot.emp_code AS empCode,
                ot.reason AS reason,
                ot.final_ot_hours AS finalOtHours,
                ot.date AS date,
                ot.department_id AS departmentId,
                ot.designation_id AS designationId,
                ot.division_id AS divisionId,
                ot.division_name AS divisionName,
                ot.branch_id AS branch_id,
                ot.branches AS branches,
                ot.shift_type AS shiftType,
                ot.department AS department,
                ot.company_code AS companyCode,
                ot.unit_code AS unitCode,
                ot.status as status,
                ot.in_time as inTime,
                ot.out_time as outTime,
                CONCAT(e.first_name, ' ', e.last_name) AS empName
            FROM
                ot_approval_log ot
            LEFT JOIN 
                ${this.dbNames.ems}.employee e ON e.id = ot.emp_id
                WHERE 1=1
        `
        if (req.departmentId) {
            query += ` AND ot.department_id = ${req.departmentId}`
        }
        if (req.branchId != undefined) {
            query = query + ` AND ot.branch_id = ${req.branchId}`
        }
        // if (req.date) {
        //     query += ` AND ot.date = "${req.date}"`;
        // }
        if (req.date) {
            const year = req.date.substring(0, 4);
            const month = req.date.substring(4, 6);
            query += ` AND EXTRACT(YEAR FROM ot.date) = ${year} AND EXTRACT(MONTH FROM ot.date) = ${month}`;
        }
    
        if (req.divisionId) {
            query += ` AND ot.division_id = ${req.divisionId}`
        }
        return await this.otApprovalLogRepo.query(query);
    }






}