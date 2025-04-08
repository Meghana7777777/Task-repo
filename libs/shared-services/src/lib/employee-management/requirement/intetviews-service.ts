import { CommonResponseModel } from '@hrexpert/backend-utils';
import { EMSCommonAxiosService } from '../common-axios-service-ems';

export class InterviewServiceSharedService extends EMSCommonAxiosService {
  private recruitmentController = '/Recruitment';

  async createRecruitmentInterviews(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/createRecruitmentInterviews',
      req
    );
  }

  async getAllRecruitmentInterviews(): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/getAllRecruitmentInterviews'
    );
  }

  async updateRecruitmentInterviews(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(
      this.recruitmentController + '/updateRecruitmentInterviews',
      req
    );
  }
}
