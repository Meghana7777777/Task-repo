import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class AssignProfileServiceSharedService extends EMSCommonAxiosService {
    private recruitmentController = "/Recruitment";


    async assignProfiles(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.recruitmentController + "/assignProfiles", req);
    }

    async getProfilesToAssign(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.recruitmentController + "/getProfilesToAssign", req);
    }

    async getAssignedProfiles(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.recruitmentController + "/getAssignedProfiles");
    }

}