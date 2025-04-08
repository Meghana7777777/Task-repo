import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { LeaveTypeApplicabilityEntity } from "../entites/leave-type-applicability-entity";
import { CriteriaEnum, GenderEnum, MaritualStatusEnum, TypeOfEntityEnum } from "@hrexpert/shared-models";

@Injectable()
export class LeaveTypeApplicabilityRepository extends Repository<LeaveTypeApplicabilityEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(LeaveTypeApplicabilityEntity)
    private leaveRepo: Repository<LeaveTypeApplicabilityEntity>,
        private dataSource: DataSource,
        private readonly configService: ConfigService
    ) {
        super(leaveRepo.target, leaveRepo.manager, leaveRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getLeaveTypeApplicability():Promise<any>{
        let query = `
        SELECT
            lt.id,
            lt.type_of_entity,
            CASE 
                WHEN lt.type_of_entity = '${TypeOfEntityEnum.LEAVE_TYPE}' THEN l.leave_name
                ELSE lg.name
            END AS leaveName,
            lt.reference_id AS refId,
            lt.criteria,
            lt.criteria_reference AS criteriaRef,
            CASE
                WHEN lt.criteria_reference = 'all' THEN 'All'
                WHEN lt.criteria = '${CriteriaEnum.DEPARTMENTS}' THEN d.name
                WHEN lt.criteria = '${CriteriaEnum.DESIGNATIONS}' THEN des.name
                WHEN lt.criteria = '${CriteriaEnum.BRANCHES}' THEN b.branch_name
                WHEN lt.criteria = '${CriteriaEnum.GENDERS}' THEN
                    CASE
                        WHEN lt.criteria_reference = '${GenderEnum.M}' THEN 'Male'
                        WHEN lt.criteria_reference = '${GenderEnum.F}' THEN 'Female'
                        ELSE 'Others'
                    END
                WHEN lt.criteria = '${CriteriaEnum.MARITAL_STATUS}' THEN
                    CASE
                        WHEN lt.criteria_reference = '${MaritualStatusEnum.M}' THEN 'Married'
                        WHEN lt.criteria_reference = '${MaritualStatusEnum.U}' THEN 'Unmarried'
                        ELSE 'Others'
                    END
                ELSE lt.criteria_reference
            END AS criteriaValue
        FROM ${this.dbNames.lms}.leave_type_applicability lt
        LEFT JOIN ${this.dbNames.lms}.leave_type l ON l.id = lt.reference_id
        LEFT JOIN ${this.dbNames.lms}.leave_group lg ON lt.type_of_entity = 'LEAVE_GROUP' AND lg.id = lt.reference_id
        LEFT JOIN ${this.dbNames.ems}.departments d ON lt.criteria = 'DEPARTMENTS' AND lt.criteria_reference = d.id
        LEFT JOIN ${this.dbNames.ems}.designations des ON lt.criteria = 'DESIGNATIONS' AND lt.criteria_reference = des.id
        LEFT JOIN ${this.dbNames.ems}.branches b ON lt.criteria = 'BRANCHES' AND lt.criteria_reference = b.id`
        const result = await this.query(query);
        return result;
    }
}