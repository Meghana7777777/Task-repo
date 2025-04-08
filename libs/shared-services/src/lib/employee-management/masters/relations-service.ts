import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class RelationsService extends EMSCommonAxiosService {
    private RelationsController = "/relations";

    async createRelations(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.RelationsController + "/createRelations", payload);
    }

    async getAllRelations(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.RelationsController + "/getAllRelations");
    }

    async getActiveRelations(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.RelationsController + "/getActiveRelations");
    }

    async updateRelations(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.RelationsController + '/updateRelations', dto);
    }

    async activateOrDeactivateRelations(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.RelationsController + "/activateOrDeactivateRelations", payload);
    }
}
