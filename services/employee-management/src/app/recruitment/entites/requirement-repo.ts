import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../company/company.entity';
import { DesignationsEntity } from '../../designations/entites/designations.entity';
import { RecruitmentEntity } from './requirement.entity';

@Injectable()
export class RecruitmentRepository extends Repository<RecruitmentEntity> {
  constructor(
    @InjectRepository(RecruitmentEntity)
    private requirementRepo: Repository<RecruitmentEntity>
  ) {
    super(
      requirementRepo.target,
      requirementRepo.manager,
      requirementRepo.queryRunner
    );
  }

  async getAllRecruitments(): Promise<any> {
    return await this.createQueryBuilder('r')
      .select([
        'r.id AS id',
        'r.company AS Company',
        'r.job_role AS jobRole',
        'r.job_description AS jobDescription',
        "DATE_FORMAT(r.notification_date, '%Y-%m-%d') AS notificationDate",
        'r.resource_required AS resourceRequired',
        'r.technology AS technology',
        "DATE_FORMAT(r.planning_closing_date, '%Y-%m-%d') AS planningClosingDate",
        'r.billing_rate AS billingRate',
        'r.approx_experience AS approxExperience',
        'r.min_project_duration AS minProjectDuration',
        'r.expenses_paid_by_client AS expensesPaidByClient',
        'r.status AS status',
        'r.remarks AS remarks',
        'r.job_location AS jobLocation',
        'r.created_user AS createdUser',
        'r.updated_user AS updatedUser',
        "DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt",
        "DATE_FORMAT(r.updated_at, '%Y-%m-%d %H:%i:%s') AS updatedAt",
        'r.is_active AS isActive',
        'r.version_flag AS versionFlag',
        'd.id AS designationId',
        'd.name AS name',
        'c.id AS companyId',
        'c.company_name AS CompanyName',
      ])
      .leftJoin(DesignationsEntity, 'd', 'd.id = r.job_role')
      .leftJoin(CompanyEntity, 'c', 'c.id = r.company')

      .getRawMany();
  }

  async getRecruitmentCompanyDropDown(): Promise<any> {
    return await this.createQueryBuilder('r')
        .select([
            'DISTINCT c.id AS companyId',
            'c.company_name AS companyName'
        ])
        .leftJoin(CompanyEntity, 'c', 'c.id = r.company')
        .where('c.is_active = :isActive', { isActive: 1 })  
        .orderBy('c.company_name', 'ASC')  
        .getRawMany();
}

}
