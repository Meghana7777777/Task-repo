import { CandidateNameReq, CommonResponseModel } from '@hrexpert/shared-models';
import { EMSCommonAxiosService } from '../common-axios-service-ems';

export class RecruitmentServiceSharedService extends EMSCommonAxiosService {
  private recruitmentController = '/Recruitment';

  async createRecruitment(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/createRecruitment',
      req
    );
  }

  async getRecruitment(): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.recruitmentController + '/getRecruitment');
  }

  async updateRecruitment(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/updateRecruitment',
      req
    );
  }

  async activateDeactivateRecruitment(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/activateDeactivateRecruitment',
      req
    );
  }

  async createProfile(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/createProfile',
      req
    );
  }

  async updateProfileRecruitment(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/updateProfileRecruitment',
      req
    );
  }
  async createRecImageProfile(req: any): Promise<CommonResponseModel> {
    console.log(req,"ppsjsh")
    return this.axiosPostCall(
      this.recruitmentController + '/createRecImageProfile',
      req
    );
  }

  async getReferenceNamewithCandidateName(
    reqModel: CandidateNameReq
  ): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getReferenceNamewithCandidateName',
      reqModel
    );
  }
  async getRecruitmentProfiles(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getRecruitmentProfiles',
      req
    );
  }
  async getRecruitmentProfilesDropDown(): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getRecruitmentProfilesDropDown'
    );
  }

  async getProfileReportById(): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getProfileReportById'
    );
  }

  async getRecruitmentTrackerReport(req?: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getRecruitmentTrackerReport', req
    );
  }

  async getProfile(req?: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getProfile', req
    );
  }

  async updateIsProfileRegistered(req?: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/updateIsProfileRegistered', req
    );
  }
}
