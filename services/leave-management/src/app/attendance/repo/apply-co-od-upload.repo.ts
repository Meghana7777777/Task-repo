import { ApplyCoOdReq } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplyCoOdUploadEntity } from "../entity/apply-co-od-upload.entity";
import { ConfigService } from "@nestjs/config";



@Injectable()
export class AppyCoOdUploadRepository extends Repository<ApplyCoOdUploadEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(ApplyCoOdUploadEntity) private applyCoOdRepo: Repository<ApplyCoOdUploadEntity>,
        private readonly configService: ConfigService
    ) {
        super(applyCoOdRepo.target, applyCoOdRepo.manager, applyCoOdRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getApplyCoOdUploadData(req: ApplyCoOdReq): Promise<any> {
        let query = ` 
        SELECT
        apcoodu.apply_co_od_id AS applyOdCoId,
        apcoodu.employee_id AS employeeId,
        apcoodu.employee_code AS employeeCode,
        apcoodu.employee_name AS employeeName,
        apcoodu.type AS type,
        apcoodu.from_date AS fromDate,
        apcoodu.to_date AS toDate,
        apcoodu.no_of_days AS noOfDays,
        apcoodu.leave_reason AS leaveReason,
        apcoodu.is_active AS isActive,
        apcoodu.rejection_reason AS rejectionReason,
        apcoodu.created_at AS createdAt,
        apcoodu.created_user AS createdUser,
        apcoodu.updated_at AS updatedAt,
        apcoodu.updated_user AS updatedUser,
        apcoodu.version_flag AS versionFlag,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        d.division_name AS divisionName,
        b.branch_name AS branchName,
        dp.name AS department,
        ds.name AS designation
        FROM ${this.dbNames.lms}.apply_co_od_upload apcoodu
        LEFT JOIN ${this.dbNames.ems}.employee e ON apcoodu.employee_id = e.id
        LEFT JOIN ${this.dbNames.ems}.designations ds ON ds.id = e.designation_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id = e.department_id 
        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id
        LEFT JOIN ${this.dbNames.ems}.division d ON d.id = e.division_id
    `;

        const conditions = [];

        if (req.departmentId != undefined) {
            conditions.push(`e.department_id = "${req.departmentId}"`);
        }
        if (req.desginationid != undefined) {
            conditions.push(`e.designation_id = "${req.desginationid}"`);
        }
        if (req.branchId != undefined) {
            conditions.push(`e.branch_id = "${req.branchId}"`);
        }
        if (req.divisionId != undefined) {
            conditions.push(`e.division_id = "${req.divisionId}"`);
        }
        if (req.employeeId != undefined) {
            conditions.push(`apcoodu.employee_id = "${req.employeeId}"`);
        }
        if (req.type != undefined) {
            conditions.push(`apcoodu.type = "${req.type}"`);
        }
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        return await this.applyCoOdRepo.query(query)

    }

}