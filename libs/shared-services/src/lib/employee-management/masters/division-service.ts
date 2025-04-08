import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class DivisionService extends EMSCommonAxiosService {
    private DivisionController = "/division";

    async createDivision(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DivisionController + "/createDivision", payload);
    }

    async getAllDivision(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DivisionController + "/getAllDivision");
    }

    async getActiveDivision(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DivisionController + "/getActiveDivision");
    }

    async updateDivision(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.DivisionController + '/updateDivision', dto);
    }

    async activateOrDeactivateDivision(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DivisionController + "/activateOrDeactivateDivision", payload);
    }

    async getAllActiveDivisions(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DivisionController + "/getAllActiveDivisions");
    }
    async getDivisionName(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DivisionController + "/getDivisionName",req);
    }
}
