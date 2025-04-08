import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class DesignationsService extends EMSCommonAxiosService {
    private DesignationsController = "/designations";

    async createDesignations(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DesignationsController + "/createDesignations", payload);
    }

    async getDesignations(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DesignationsController + "/getDesignations");
    }

    async getActiveDesignations(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DesignationsController + "/getActiveDesignations");
    }

    async updateDesginations(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.DesignationsController + '/updateDesginations', dto);
    }

    async activateOrDeactivateDesignations(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DesignationsController + "/activateOrDeactivateDesignations", payload);
    }
    async getDesignationName(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DesignationsController + "/getDesignationName", payload);
    }

}
