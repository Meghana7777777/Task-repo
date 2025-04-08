import { CommonResponseModel } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class OverTimeService extends MastersCommonAxiosService {
    private ApplyOtController = "/apply-ot";

    async createOt(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyOtController + "/createOt", req);
    }

    async getAllOt(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyOtController + "/getAllOt");
    }

    async updateOt(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyOtController + "/updateOt", req);
    }
  
    async activateDeactivateOt(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyOtController + "/activateDeactivateOt", req);
    }
}
