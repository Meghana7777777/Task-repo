import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class QualificationsSharedService extends EMSCommonAxiosService {
    private QualificationsController = "/qualifications";

    async createQualifications(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/createQualifications", payload);
    }

    async getQualifications(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/getQualifications");
    }

    async getActiveQualifications(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/getActiveQualifications");
    }

    async updateQualifications(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.QualificationsController + '/updateQualifications', dto);
    }

    async activateOrDeactivateQualifications(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/activateOrDeactivateQualifications", payload);
    }

    async createSpecializations(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/createSpecializations", payload);
    }

    async getSpecializations(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/getSpecializations", req);
    }

    async getActiveSpecializations(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/getActiveSpecializations");
    }

    async updateSpecializations(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.QualificationsController + '/updateSpecializations', dto);
    }

    async activateOrDeactivateSpecializations(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.QualificationsController + "/activateOrDeactivateSpecializations", payload);
    }

}
