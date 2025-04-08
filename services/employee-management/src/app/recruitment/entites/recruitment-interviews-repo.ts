import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruitmentInterviewsEntity } from './recruitment-interviews.entity';
import { CompanyEntity } from '../../company/company.entity';
import { DesignationsEntity } from '../../designations/entites/designations.entity';
import { Employee } from '../../employee-onboarding/entities/employee-details.entity';
import { CandidateProfileEntity } from './requirement-profile-entity';
import { RecruitmentEntity } from './requirement.entity';

@Injectable()
export class RecruitmentInterviewsRepo extends Repository<RecruitmentInterviewsEntity> {
  constructor(
    @InjectRepository(RecruitmentInterviewsEntity)
    private recruitmentInterviewsRepo: Repository<RecruitmentInterviewsEntity>
  ) {
    super(
      recruitmentInterviewsRepo.target,
      recruitmentInterviewsRepo.manager,
      recruitmentInterviewsRepo.queryRunner
    );
  }

  async getAllInterviews(): Promise<any> {
    return await this.createQueryBuilder('i')
      .select([
        'i.id AS id',
        "DATE_FORMAT(i.interview_date, '%Y-%m-%d') AS interviewDate",
        'i.interview_type AS interviewType',
        'i.inter_viewer AS interviewer',
        'i.interviewer_mob_no AS interviewerMobNo',
        'i.client AS client',
        'i.job_role AS jobRole',
        'i.candidate_name AS candidateName',
        'i.referred_by AS referredBy',
        'i.status AS status',
        'i.remarks AS remarks',
        'i.created_user AS createdUser',
        'i.updated_user AS updatedUser',
        "DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt",
        "DATE_FORMAT(i.updated_at, '%Y-%m-%d %H:%i:%s') AS updatedAt",
        'i.version_flag AS versionFlag',
        'i.is_active AS isActive',
        'd.id AS designationId',
        'd.name AS designationName',
        'e.id AS empId',
        "CONCAT(e.first_name, ' ', e.last_name) AS interviewerName",
        'e.employee_code AS employeeCode',
        'c.id AS companyId',
        'c.company_name AS CompanyName',
        'cp.id AS candidateId',
        'cp.candidate_name AS candName',
        'r.id AS recuirmentId',
        'r.job_role AS recjobRoleId',
        'r.job_description AS jobDescription',
      ])

      .leftJoin(DesignationsEntity, 'd', 'd.id = i.job_role')
      .leftJoin(Employee, 'e', 'e.id = i.inter_viewer')
      .leftJoin(CompanyEntity, 'c', 'c.id = i.client')
      .leftJoin(CandidateProfileEntity, 'cp', 'cp.id = i.candidate_name')
      .leftJoin(RecruitmentEntity, 'r', 'r.id = i.id')

      .getRawMany();
  }
}
