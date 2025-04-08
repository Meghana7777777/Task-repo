import { CommonResponseModel } from '@hrexpert/backend-utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntitlementEntity } from '../entites/entitlement-entity';

@Injectable()
export class EntitlementRepository extends Repository<EntitlementEntity> {
  private readonly dbNames: any;

  constructor(
    @InjectRepository(EntitlementEntity)
    private entitlementRepo: Repository<EntitlementEntity>,
    private readonly configService: ConfigService
  ) {
    super(
      entitlementRepo.target,
      entitlementRepo.manager,
      entitlementRepo.queryRunner
    );
    this.dbNames = this.configService.get('dbNames');
  }

  async getResetData(currentDay: number): Promise<any> {
    let query = `
    SELECT e.id as entitlementId,
        e.reset_on_date AS resetOnDate,
        e.reset_on AS resetOn,
        e.reset_period AS resetPeriod,
        lt.id AS leaveTypeId,
        lt.leave_name AS leaveType,
        e.accrual_leaves AS accrualLeaves
    FROM ${this.dbNames.lms}.entitlement e
    LEFT JOIN ${this.dbNames.lms}.leave_type lt ON lt.id = e.leave_type_id
    WHERE e.reset_on_date = ${currentDay}`
    return await this.entitlementRepo.query(query);
  }

  async getAccrualData(currentDay: number): Promise<any> {
    let query = `
    SELECT e.id as entitlementId,
        e.accrual_on_date AS accrualOnDate,
        e.accrual_on AS accrualOn,
        e.accrual_period AS accrualPeriod,
        lt.id AS leaveTypeId,
        lt.leave_name AS leaveType,
        e.accrual_leaves AS accrualLeaves
    FROM ${this.dbNames.lms}.entitlement e
    LEFT JOIN ${this.dbNames.lms}.leave_type lt ON lt.id = e.leave_type_id
    WHERE e.accrual_on_date = ${currentDay}`
    return await this.entitlementRepo.query(query);
  }
}
