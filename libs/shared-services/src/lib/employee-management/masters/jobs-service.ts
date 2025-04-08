import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";
import { JobReq } from "@hrexpert/shared-models";

export class JobsService extends EMSCommonAxiosService {
    private JobsController = "/jobs";

    async createJob(payload: JobReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsController + "/createJob", payload);
    }

    async getAllJobs(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsController + "/getAllJobs");
    }

    async getActiveJobs(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsController + "/getActiveJobs");
    }

    async updateJob(req: JobReq): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.JobsController + '/updateJob', req);
    }

    async activateOrDeactivateJob(req: JobReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsController + "/activateOrDeactivateJob", req);
    }
  
}
