import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecruitmentEntity } from './requirement.entity';
import { CandidateProfileEntity } from './requirement-profile-entity';
import { DesignationsEntity } from '../../designations/entites/designations.entity';
import { Employee } from '../../employee-onboarding/entities/employee-details.entity';
import { RecruitmentInterviewsEntity } from './recruitment-interviews.entity';

@Injectable()
export class RecruitmentProfileRepository extends Repository<CandidateProfileEntity> {
  constructor(private dataSource: DataSource) {
    super(CandidateProfileEntity, dataSource.createEntityManager());
  }

  async getAllCandidates(): Promise<any> {
    return await this.createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.candidate_name AS candidateName',
        'c.job_role AS jobRole',
        "DATE_FORMAT(c.profile_date, '%Y-%m-%d') AS profileDate",
        'c.qualification AS qualification',
        'c.technologies AS technologies',
        'c.stack AS stack',
        'c.candidate_type AS candidateType',
        'c.source_type AS sourceType',
        'c.referred_by AS referredBy',
        'c.expected_ctc AS expectedCTC',
        'c.current_ctc AS currentCTC',
        'c.experience AS experience',
        'c.notice_period AS noticePeriod',
        'c.mobile_number AS mobileNumber',
        'c.alternative_mobile AS alternativeMobile',
        'c.remarks AS remarks',
        'c.resume_path AS resumePath',
        'c.resume_name AS resumeName',
        'c.email AS email',
        'd.id AS designationId',
        'd.name AS name',
        'e.id AS empId',
        "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
        'e.employee_code AS employeeCode',
      ])
      .leftJoin(DesignationsEntity, 'd', 'd.id = c.job_role')
      .leftJoin(Employee, 'e', 'e.id = c.referred_by')
      .getRawMany();
  }

  async getCandidateWithReferrerName(candidateName: string): Promise<any> {
    return await this.createQueryBuilder('c')
      .select([
        'c.candidate_name AS candidateName',
        "CONCAT(e.first_name, ' ', e.last_name) AS referredByName",
      ])
      .leftJoin(Employee, 'e', 'e.id = c.referred_by')
      .where('c.candidate_name = :candidateName', { candidateName })
      .getRawOne();
  }

  async getProfileReportById(): Promise<any> {
    return await this.createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.candidate_name AS candidateName',
        'c.job_role AS jobRole',
        "DATE_FORMAT(c.profile_date, '%Y-%m-%d') AS profileDate",
        'c.qualification AS qualification',
        'c.technologies AS technologies',
        'c.stack AS stack',
        'c.candidate_type AS candidateType',
        'c.source_type AS sourceType',
        'c.referred_by AS referredBy',
        'c.expected_ctc AS expectedCTC',
        'c.current_ctc AS currentCTC',
        'c.experience AS experience',
        'c.notice_period AS noticePeriod',
        'c.mobile_number AS mobileNumber',
        'c.alternative_mobile AS alternativeMobile',
        'c.remarks AS remarks',
        'c.resume_path AS resumePath',
        'c.resume_name AS resumeName',
        'd.id AS designationId',
        'd.name AS name',
        'e.id AS empId',
        "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
        'e.employee_code AS employeeCode',
        'c.interview_status AS status',
      ])
      .leftJoin(DesignationsEntity, 'd', 'd.id = c.job_role')
      .leftJoin(Employee, 'e', 'e.id = c.referred_by')
      //.where('c.id = :id', { id })
      .getRawMany();
  }

  async getAssignedProfiles(): Promise<any> {
    return await this.createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.candidate_name AS candidateName',
        'c.job_role AS jobRole',
        "DATE_FORMAT(c.profile_date, '%Y-%m-%d') AS profileDate",
        'c.qualification AS qualification',
        'c.technologies AS technologies',
        'c.stack AS stack',
        'c.candidate_type AS candidateType',
        'c.source_type AS sourceType',
        'c.referred_by AS referredBy',
        'c.expected_ctc AS expectedCTC',
        'c.current_ctc AS currentCTC',
        'c.experience AS experience',
        'c.notice_period AS noticePeriod',
        'c.mobile_number AS mobileNumber',
        'c.alternative_mobile AS alternativeMobile',
        'c.remarks AS remarks',
        'c.resume_path AS resumePath',
        'c.resume_name AS resumeName',
        'c.email AS email',
        'c.interview_status AS interviewStatus',
        'd.id AS designationId',
        'd.name AS name',
        'e.id AS empId',
        "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
        'e.employee_code AS employeeCode',
      ])
      .leftJoin(DesignationsEntity, 'd', 'd.id = c.job_role')
      .leftJoin(Employee, 'e', 'e.id = c.referred_by')
      .where('c.assigned = :assigned', { assigned: true })
      .getRawMany();
  }
}
