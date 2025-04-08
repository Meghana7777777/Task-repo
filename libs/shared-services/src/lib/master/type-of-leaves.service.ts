import { CommonResponseModel } from "../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class TypesOfLeavesService extends MastersCommonAxiosService {
    private TypesOfLeavesController = "/types-of-leaves";

    async createTypesOfLeaves(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TypesOfLeavesController + "/createTypesOfLeaves", payload);
    }

    async getAllTypesOfLeaves(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TypesOfLeavesController + "/getAllTypesOfLeaves");
    }

    async getAllActiveTypesOfLeaves(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TypesOfLeavesController + "/getAllActiveTypesOfLeaves");
    }

    async updateTypesOfLeaves(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.TypesOfLeavesController + '/updateTypesOfLeaves', dto);
    }

    async activateOrDeactivateTypesOfLeave(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TypesOfLeavesController + "/activateOrDeactivateTypesOfLeave", payload);
    }

    async typesOfLeaves(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TypesOfLeavesController + "/typesOfLeaves");
    }
}
