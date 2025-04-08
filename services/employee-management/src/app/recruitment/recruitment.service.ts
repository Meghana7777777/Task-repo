import { CommonResponseModel } from '@hrexpert/backend-utils';
import {
  CandidateNameReq,
  CandidateProfileReq,
  EmailRequest,
  RecruitmentReq,
} from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { CandidateProfileDto } from './entites/profile-dto';
import { RecruitmentInterviewsDto } from './entites/recruitment-interviews-dto';
import { RecruitmentInterviewsRepo } from './entites/recruitment-interviews-repo';
import { RecruitmentInterviewsEntity } from './entites/recruitment-interviews.entity';
import { CandidateProfileEntity } from './entites/requirement-profile-entity';
import { RecruitmentRepository } from './entites/requirement-repo';
import { RecruitmentEntity } from './entites/requirement.entity';
import { RecruitmentDto } from './entites/requrirement-dto';
import { RecruitmentProfileRepository } from './entites/reuirement-profile-repo';
import axios from 'axios';
@Injectable()
export class RecruitmentService {
  private readonly dbNames: any;
  constructor(
    private readonly requirementRepo: RecruitmentRepository,

    private readonly recruitmentProfileRepository: RecruitmentProfileRepository,
    private readonly recruitmentInterviewsRepo: RecruitmentInterviewsRepo,
    private readonly configService: ConfigService
  ) {
    this.dbNames = this.configService.get('dbNames');
  }

  async createRecruitment(req: RecruitmentDto): Promise<CommonResponseModel> {
    try {
      const entity = new RecruitmentEntity();
      entity.jobRole = req.jobRole;
      entity.company = req.company;
      entity.jobDescription = req.jobDescription;
      entity.notificationDate = req.notificationDate
        ? new Date(req.notificationDate)
        : null;
      entity.resourceRequired = req.resourceRequired;
      entity.technology = req.technology;
      entity.planningClosingDate = req.planningClosingDate
        ? new Date(req.planningClosingDate)
        : null;
      entity.billingRate = req.billingRate;
      entity.approxExperience = req.approxExperience;
      entity.minProjectDuration = req.minProjectDuration;
      entity.expensesPaidByClient = req.expensesPaidByClient;
      entity.status = req.status;
      entity.jobLocation = req.jobLocation;
      entity.remarks = req.remarks;
      entity.createdUser = req.createdUser;
      entity.isActive = req.isActive ?? true;
      entity.versionFlag = req.versionFlag ?? 1;

      const savedEntity = await this.requirementRepo.save(entity);

      return new CommonResponseModel(
        true,
        1,
        'Recruitment created successfully',
        savedEntity
      );
    } catch (err) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to create recruitment',
        err.message
      );
    }
  }

  async updateRecruitment(req: RecruitmentReq): Promise<CommonResponseModel> {
    console.log(req, '----------fgfgfg-------------');
    try {
      // Check if the recruitment record exists
      const existingRecruitment = await this.requirementRepo.findOne({
        where: { id: req.id },
      });

      if (!existingRecruitment) {
        return new CommonResponseModel(false, 0, 'Recruitment not found', null);
      }

      // Prepare update payload
      const updatePayload: Partial<RecruitmentReq> = {
        company: req.company ?? existingRecruitment.company,
        jobRole: req.jobRole ?? existingRecruitment.jobRole,
        jobDescription:
          req.jobDescription ?? existingRecruitment.jobDescription,
        notificationDate: req.notificationDate
          ? new Date(req.notificationDate)
          : existingRecruitment.notificationDate,
        resourceRequired:
          req.resourceRequired ?? existingRecruitment.resourceRequired,
        technology: req.technology ?? existingRecruitment.technology,
        planningClosingDate: req.planningClosingDate
          ? new Date(req.planningClosingDate)
          : existingRecruitment.planningClosingDate,
        billingRate: req.billingRate ?? existingRecruitment.billingRate,
        approxExperience:
          req.approxExperience ?? existingRecruitment.approxExperience,
        minProjectDuration:
          req.minProjectDuration ?? existingRecruitment.minProjectDuration,
        expensesPaidByClient:
          req.expensesPaidByClient ?? existingRecruitment.expensesPaidByClient,
        status: req.status ?? existingRecruitment.status,
        jobLocation: req.jobLocation ?? existingRecruitment.jobLocation,
        remarks: req.remarks ?? existingRecruitment.remarks,
        updatedUser: req.updatedUser ?? existingRecruitment.updatedUser,
        isActive: req.isActive ?? existingRecruitment.isActive,
        versionFlag: (existingRecruitment.versionFlag ?? 0) + 1, // Increment version
        updatedAt: new Date(),
      };

      // Perform update
      await this.requirementRepo.update({ id: req.id }, updatePayload);

      // Fetch updated entity
      const updatedRecruitment = await this.requirementRepo.findOne({
        where: { id: req.id },
      });

      return new CommonResponseModel(
        true,
        1,
        'Updated successfully',
        updatedRecruitment
      );
    } catch (error) {
      console.error('Error updating recruitment:', error);
      return new CommonResponseModel(false, 0, 'Update failed', error.message);
    }
  }

  async getRecruitment(): Promise<CommonResponseModel> {
    try {
      const data = await this.requirementRepo.getAllRecruitments();
      return new CommonResponseModel(
        true,
        1,
        'Recruitment list fetched successfully',
        data
      );
    } catch (error) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to fetch recruitment list',
        error
      );
    }
  }
  async activateDeactivateRecruitment(
    req: RecruitmentReq
  ): Promise<CommonResponseModel> {
    try {
      const exists = await this.requirementRepo.findOne({
        where: { id: req.id },
      });
      if (!exists) {
        throw new CommonResponseModel(false, 77787, 'No Job Rates Found');
      }
      const update = await this.requirementRepo.update(
        { id: req.id },
        { isActive: req.isActive, updatedUser: req.updatedUser }
      );
      if (exists.isActive && !req.isActive) {
        if (update.affected) {
          return new CommonResponseModel(true, 1, 'Deactivated SuccessFully');
        } else {
          throw new CommonResponseModel(false, 0, 'Already Deactivated');
        }
      } else if (!exists.isActive && req.isActive) {
        if (update.affected) {
          return new CommonResponseModel(true, 1, 'Activated SuccessFully');
        } else {
          throw new CommonResponseModel(false, 0, 'Already Activated');
        }
      } else {
        return new CommonResponseModel(false, 0, 'No changes were Made');
      }
    } catch (err) {
      return err;
    }
  }

  async createProfile(req: CandidateProfileDto): Promise<CommonResponseModel> {
    try {
      const entity = new CandidateProfileEntity();
      entity.candidateName = req.candidateName;
      entity.jobRole = req.jobRole;
      entity.profileDate = req.profileDate;
      entity.qualification = req.qualification;
      entity.technologies = req.technologies;
      entity.stack = req.stack;
      entity.candidateType = req.candidateType;
      entity.sourceType = req.sourceType;
      entity.referredBy = req.referredBy;
      entity.expectedCTC = req.expectedCTC;
      entity.currentCTC = req.currentCTC;
      entity.experience = req.experience;
      entity.remarks = req.remarks;
      entity.noticePeriod = req.noticePeriod;
      entity.mobileNumber = req.mobileNumber;
      entity.alternativeMobile = req.alternativeMobile;
      entity.resumePath = req.resumePath;
      entity.email = req.email;

      const savedEntity = await this.recruitmentProfileRepository.save(entity);

      return new CommonResponseModel(
        true,
        1,
        'Recruitment created successfully',
        savedEntity
      );
    } catch (err) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to create recruitment',
        err.message
      );
    }
  }

  async createRecImageProfile(filePath: string, filename: string, id: number): Promise<CommonResponseModel> {
    console.log(filePath, "fff")
    console.log(filename, "filename")
    console.log(id, "id")
    try {
      const filePathUpdate = await this.recruitmentProfileRepository.update(
        { id: id },
        { resumePath: filePath, resumeName: filename },
      );
      if (filePathUpdate.affected > 0) {
        return new CommonResponseModel(true, 11, 'Uploaded successfully', filePath);
      }
      else {
        return new CommonResponseModel(false, 11, 'Uploaded failed', filePath);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async updateProfileRecruitment(
    req: CandidateProfileReq,
    file?: any
  ): Promise<CommonResponseModel> {
    try {
      console.log(req, '----------fgfgfg-------------');
      const existingProfileRecruitment =
        await this.recruitmentProfileRepository.findOne({
          where: { id: req.id },
        });

      if (!existingProfileRecruitment) {
        return new CommonResponseModel(false, 0, 'Recruitment not found', null);
      }

      const updatePayload = {
        candidateName: req.candidateName,
        jobRole: req.jobRole,
        profileDate: req.profileDate,
        qualification: req.qualification,
        technologies: req.technologies,
        stack: req.stack,
        candidateType: req.candidateType,
        sourceType: req.sourceType,
        expectedCTC: req.expectedCTC,
        currentCTC: req.currentCTC,
        experience: req.experience,
        noticePeriod: req.noticePeriod,
        mobileNumber: req.mobileNumber,
        alternativeMobile: req.alternativeMobile,
        remarks: req.remarks,
        resumePath: req.resumePath,
        email: req.email,
      };

      await this.recruitmentProfileRepository.update(
        { id: req.id },
        updatePayload
      );

      // Fetch updated entity
      const updatedProfileRecruitment =
        await this.recruitmentProfileRepository.findOne({
          where: { id: req.id },
        });

      return new CommonResponseModel(
        true,
        1,
        'Updated successfully',
        updatedProfileRecruitment
      );
    } catch (error) {
      console.error('Error updating recruitment:', error);
      return new CommonResponseModel(false, 0, 'Update failed', error.message);
    }
  }

  async getRecruitmentProfiles(): Promise<CommonResponseModel> {
    try {
      const data = await this.recruitmentProfileRepository.getAllCandidates();
      return new CommonResponseModel(
        true,
        1,
        'Recruitment list fetched successfully',
        data
      );
    } catch (error) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to fetch recruitment list',
        error
      );
    }
  }

  async getRecruitmentProfilesDropDown(): Promise<CommonResponseModel> {
    try {
      const data = await this.recruitmentProfileRepository.getAllCandidates();
      return new CommonResponseModel(
        true,
        1,
        'Recruitment list fetched successfully',
        data
      );
    } catch (error) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to fetch recruitment list',
        error
      );
    }
  }
  async getProfileReportById(): Promise<CommonResponseModel> {
    try {
      const data =
        await this.recruitmentProfileRepository.getProfileReportById();
      return new CommonResponseModel(
        true,
        1,
        'ProfileReport list fetched successfully',
        data
      );
    } catch (error) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to fetch ProfileReport list',
        error
      );
    }
  }

  async createRecruitmentInterviews(
    req: RecruitmentInterviewsDto
  ): Promise<CommonResponseModel> {
    try {
      const entity = new RecruitmentInterviewsEntity();
      entity.interviewDate = req.interviewDate;
      entity.interviewType = req.interviewType;
      entity.interviewer = req.interviewer;
      entity.interviewerMobNo = req.interviewerMobNo;
      entity.client = req.client;
      entity.jobRole = req.jobRole;
      entity.candidateName = req.candidateName;
      entity.referredBy = req.referredBy;
      entity.status = req.status;
      entity.remarks = req.remarks;
      entity.isActive = req.isActive ?? true;
      entity.versionFlag = req.versionFlag ?? 1;

      const savedEntity = await this.recruitmentInterviewsRepo.save(entity);

      if (savedEntity) {
        await this.recruitmentProfileRepository.update({ id: req.candidateName }, { interviewStatus: req.interviewType })
        return new CommonResponseModel(true, 1, 'Recruitment Interview created successfully', savedEntity);
      }
    } catch (err) {
      return new CommonResponseModel(false, 0, 'Failed to create recruitment Interview', err.message);
    }
  }

  async getAllRecruitmentInterviews(): Promise<CommonResponseModel> {
    try {
      const result = await this.recruitmentInterviewsRepo.getAllInterviews();
      if (result) {
        return new CommonResponseModel(
          true,
          1,
          'Data Retrived Succesfully',
          result
        );
      } else {
        return new CommonResponseModel(false, 0, 'Failed to Retrive Data', []);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateRecruitmentInterviews(req: RecruitmentInterviewsDto) {
    try {
      const result = await this.recruitmentInterviewsRepo.update(
        { id: req.id },
        {
          interviewDate: req.interviewDate,
          interviewType: req.interviewType,
          interviewer: req.interviewer,
          client: req.client,
          jobRole: req.jobRole,
          candidateName: req.candidateName,
          referredBy: req.referredBy,
          status: req.status,
          remarks: req.remarks,
        }
      );
      if (result) {
        const findProfile = await this.recruitmentProfileRepository.findOne({ where: { id: req.candidateName } })
        const update = await this.recruitmentProfileRepository.update({ id: req.candidateName }, { interviewStatus: req.status })
        if (update.affected) {
          if (req.status === 'SELECTED') {
            const req2 = new EmailRequest();
            req2.to = [findProfile.email];
            req2.subject = `Congratulations! You've Been Cleared ${req.interviewType}`;
            req2.body = `
          <div style="font-family: Arial, sans-serif;">
          <br/><br/>
          Hi ${findProfile.candidateName},
          <br/><br/>
          We are pleased to inform you that you have been Cleared ${req.interviewType} at our organization. 🎉
          <br/><br/>
          We will share further details about your next step process onboarding process, and required documents soon.
          <br/><br/>
          Feel free to reach out if you have any questions.
          <br/><br/>
          Best regards,<br/>
          SAKKU <br/>
          <img src=" https://sakkugroup.com/wp-content/uploads/2024/12/sakku-logo.png" alt="Company Logo" style="width: 150px; height: auto; margin-left: -30px;"/>
          </div>
           `;
            const response = axios.post("https://alerts.schemaxtech.in/email/send", req2, {
              headers: {
                "Content-Type": "application/json",
              },
            });
          }
        }
        return new CommonResponseModel(true, 1, 'Data Updated Succesfully', result);
      } else {
        return new CommonResponseModel(true, 0, 'Failed to Update Data', result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getReferenceNamewithCandidateName(
    reqModel: CandidateNameReq
  ): Promise<CommonResponseModel> {
    try {
      const data =
        await this.recruitmentProfileRepository.getCandidateWithReferrerName(
          reqModel.candidateName
        );

      return new CommonResponseModel(
        true,
        1,
        data
          ? 'Candidate referrer fetched successfully'
          : 'Candidate not found',
        data || {}
      );
    } catch (error) {
      return new CommonResponseModel(
        false,
        0,
        'Failed to fetch candidate referrer',
        error.message
      );
    }
  }

  async getProfilesToAssign(req: any): Promise<CommonResponseModel> {
    try {
      let query = `SELECT c.id AS candidateId, c.candidate_name AS candidateName, c.qualification AS qualification, c.technologies AS technologies, c.experience AS experience FROM ${this.dbNames.ems}.candidate_profiles c WHERE c.job_role = ${req.jobRole} AND c.assigned = 0`;
      const result = await this.recruitmentProfileRepository.query(query);
      if (result) {
        return new CommonResponseModel(true, 1, 'Data Retrived Succesfully', result);
      } else {
        return new CommonResponseModel(false, 0, 'No profiles found', []);
      }
    } catch (err) {
      console.log(err);
    }
  }


  async assignProfiles(req: any[]): Promise<CommonResponseModel> {
    try {
      const updateResults = [];

      for (let p = 0; p < req.length - 1; p++) {
        const result = await this.recruitmentProfileRepository.update(
          { id: req[p].candidateId },
          { assigned: true, interviewStatus: 'SCREENING', assignedId: req[req.length - 1].requirement }
        );
        updateResults.push(result);
      }

      const allSuccessful = updateResults.every(
        (res) => res.affected && res.affected > 0
      );

      if (allSuccessful) {
        return new CommonResponseModel(true, 1, 'Profiles Assigned', updateResults);
      } else {
        return new CommonResponseModel(false, 0, 'Failed to assign some profiles', updateResults);
      }
    } catch (err) {
      console.error(err);
      return new CommonResponseModel(false, 0, 'An error occurred', []);
    }
  }

  async getAssignedProfiles(req: any): Promise<CommonResponseModel> {
    try {
      const result =
        await this.recruitmentProfileRepository.getAssignedProfiles();
      if (result.length > 0) {
        return new CommonResponseModel(
          true,
          1,
          'Data Retrived Succesfully',
          result
        );
      } else {
        return new CommonResponseModel(false, 0, 'No profiles found', []);
      }
    } catch (err) {
      console.log(err);
    }
  }


  async getRecruitmentTrackerReport(req?: any): Promise<CommonResponseModel> {
    try {
      let query = `
    SELECT r.job_role AS jobRole, r.company AS companyId, d.name AS jobRoleName, c.company_name AS companyName, r.resource_required AS resourceRequired,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'candidateName', x.candidate_name,
                'interviewStatus', x.interview_status
            )
        )
        FROM dev_hrms_ems.candidate_profiles x
        WHERE x.job_role = r.job_role
    ) AS Proflie,
    (
        SELECT COUNT(*) 
        FROM dev_hrms_ems.candidate_profiles cp1 
        WHERE cp1.job_role = r.job_role AND cp1.assigned = 1 AND cp1.assigned_id = r.id
    ) AS totalProfileAssigned,
    (
        SELECT COUNT(*) 
        FROM dev_hrms_ems.candidate_profiles cp2 
        WHERE cp2.job_role = r.job_role AND cp2.assigned = 1 AND cp2.interview_status = 'REJECTED' AND cp2.assigned_id = r.id
    ) AS totalRejected,
    (
        SELECT COUNT(*) 
        FROM dev_hrms_ems.candidate_profiles cp3 
        WHERE cp3.job_role = r.job_role AND cp3.assigned = 1 AND cp3.interview_status = 'SELECTED' AND cp3.assigned_id = r.id
    ) AS totalSelected,
    (
        SELECT COUNT(*) 
        FROM dev_hrms_ems.candidate_profiles cp4 
        WHERE cp4.job_role = r.job_role 
          AND cp4.assigned = 1 
          AND cp4.interview_status NOT IN ('SELECTED', 'REJECTED', 'OPEN') AND cp4.assigned_id = r.id
    ) AS toBeInterviewed
    FROM dev_hrms_ems.recruitment r
    JOIN dev_hrms_ems.designations d ON r.job_role = d.id
    JOIN dev_hrms_ems.company c ON r.company = c.id
    WHERE 1=1
      `
      if (req.company) {
        query += `AND r.company = ${req.company} `
      }
      if (req.jobRole) {
        query += `AND r.job_role = ${req.jobRole} `
      }
      query += `GROUP BY r.job_role, r.company, d.name, c.company_name, r.resource_required`
      const data = await this.recruitmentProfileRepository.query(query);

      return new CommonResponseModel(true, 1, 'Data Retrived Succesfully', data);
    } catch (error) {
      return new CommonResponseModel(false, 0, 'Failed to fetch candidate referrer');
    }
  }

  async getProfile(req: any): Promise<CommonResponseModel> {
    try {
      const query = `SELECT candidate_name AS firstName, job_role AS designationId, mobile_number AS mobileNo, email AS emailId, is_registered AS isRegistered  FROM ${this.dbNames.ems}.candidate_profiles  WHERE uuid = ${req.uuid}`
      const result = await this.recruitmentProfileRepository.query(query)
      if (result.length > 0) {
        return new CommonResponseModel(true, 1, 'Data Retrived Succesfully', result);
      } else {
        return new CommonResponseModel(false, 0, 'No profiles found', []);
      }
    } catch (err) {
      console.log(err);
    }
  }


  async updateIsProfileRegistered(req: any): Promise<CommonResponseModel> {
    try {
      const result = await this.recruitmentProfileRepository.update({ id: req.id }, { isRegistered: true })
      if (result) {
        return new CommonResponseModel(true, 1, 'updated', result);
      } else {
        return new CommonResponseModel(false, 0, 'failed', []);
      }
    } catch (err) {
      console.log(err);
    }
  }

}
