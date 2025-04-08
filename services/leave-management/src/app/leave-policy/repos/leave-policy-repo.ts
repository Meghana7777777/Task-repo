import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { LeavePolicyTypeEntity } from "../entites/leave-policy-type-entity";
import { EntitlementDto, LeavePolicyDto } from "@hrexpert/shared-models";

@Injectable()
export class LeavePolicyRepository extends Repository<LeavePolicyTypeEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(LeavePolicyTypeEntity)
    private leaveRepo: Repository<LeavePolicyTypeEntity>,
        private dataSource: DataSource,
        private readonly configService: ConfigService
    ) {
        super(leaveRepo.target, leaveRepo.manager, leaveRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getLeaveTypeGroupMapping():Promise<any>{
        let query = `
        SELECT ltgm.leave_type_id AS leaveTypeId,lt.leave_name AS leaveName, lt.leave_code as leaveCode, ltgm.leave_group_id AS leaveGroupId, lg.name as leaveGroup,lt.uuid as ltUUID,lg.uuid as lgUUID
        FROM ${this.dbNames.lms}.leave_type_group_mapping ltgm
        LEFT JOIN ${this.dbNames.lms}.leave_type lt ON lt.id = ltgm.leave_type_id
        LEFT JOIN ${this.dbNames.lms}.leave_group lg ON lg.id = ltgm.leave_group_id
        WHERE ltgm.is_active = 1`
        return await this.leaveRepo.query(query)
    }

   
    async getleavePolicyDetailsById(leavePolicyTypeId: number): Promise<LeavePolicyDto | null> {
        const queryBuilder = this.createQueryBuilder('lt')
            .select([
                'lt.id AS id' ,'lt.leave_code AS leaveCode','lt.leave_name AS leaveName','lt.leave_type AS leaveType','lt.uom AS uom','lt.credit_type AS creditType','lt.cut_off_date AS cutOffDate','lt.max_limit AS maxLimit','lt.min_limit AS minLimit','lt.valid_to AS validTo','lt.valid_from AS validFrom',
            ])
            .where('lt.id = :leavePolicyTypeId', {leavePolicyTypeId });

        const employeeData = await queryBuilder.getRawOne();

        if (!employeeData) {
            return null;
        }

        const entitlements = await this.getEntitlementsDetails(leavePolicyTypeId);
         const leavePolicyDetails = new LeavePolicyDto();
        Object.assign(leavePolicyDetails, employeeData);
        leavePolicyDetails.entitlements = entitlements;
        return leavePolicyDetails;
    }

    private async getEntitlementsDetails(leavePolicyTypeId: number): Promise<EntitlementDto[]> {
        const queryBuilder = this.manager.createQueryBuilder()
            .select([
                'et.reset_on_date AS resetOnDate','et.accrual_on_date AS accrualOnDate','et.leave_type_id AS leavePolicyTypeId' ,'et.encashment_limit AS encashmentLimit','et.is_encashment AS isEncashment','et.carry_forward_limit AS carryForwardLimit','et.is_carry_forward AS isCarryForward','et.reset_on AS resetOn','et.reset_period AS resetPeriod','et.accrual_on AS accrualOn','et.accrual_period AS accrualPeriod','et.accrual_leaves AS accrualLeaves','et.is_prorate AS isProrate','et.effective_from AS effectiveFrom ','et.effective_from_uom AS effectiveFromUom','et.effective_from_count AS effectiveFromCount'
            ])
            .from('entitlement', 'et')
            .where('et.leave_type_id = :leavePolicyTypeId', { leavePolicyTypeId });

        const results = await queryBuilder.getRawMany();
        return results.map(result => new EntitlementDto(
            result.effectiveFrom,
            result.effectiveFromUom,
            result.effectiveFromCount,
            result.isProrate,
            result. accrualLeaves,
            result.accrualPeriod,
            result.accrualOn,
            result. accrualOnDate,
            result.resetPeriod,
            result.resetOn,
            result.resetOnDate,
            result.isCarryForward,
            result.carryForwardLimit,
            result.isEncashment,
            result.encashmentLimit,
            result.leavePolicyTypeId
            

        ));
    }

    async getAllLeaveTypeRepo(): Promise<any> {
        return await this.createQueryBuilder('ltd')
            .select([
                'ltd.id AS leaveTypeId',
                'ltd.leave_code AS leaveCode',
                'ltd.leave_name AS leaveName',
                'ltd.leave_type AS leaveType',
            ])
            .getRawMany();
    }


    
}