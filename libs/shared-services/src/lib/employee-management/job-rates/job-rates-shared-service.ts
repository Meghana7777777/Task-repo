import { CommonResponseModel } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class JobRatesSharedService extends EMSCommonAxiosService {
    private JobsRateController = "/jobs-rate";

    async createJobRates(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsRateController + "/createJobRates", req);
    }

    async getJobRates(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsRateController + "/getJobRates");
    }

    async updateJobRates(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsRateController + "/updateJobRates", req);
    }

    async activateDeactivateJobRates(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.JobsRateController + "/activateDeactivateJobRates", req);
    }
}
