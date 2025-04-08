import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class BranchesService extends EMSCommonAxiosService {
    private BranchesController = "/branches";

    async createBranch(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchesController + "/createBranch", payload);
    }

    async getAllBranches(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchesController + "/getAllBranches");
    }

    async getActiveBranches(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchesController + "/getActiveBranches");
    }

    async updateBranch(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.BranchesController + '/updateBranch', dto);
    }

    async activateOrDeactivateBranch(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchesController + "/activateOrDeactivateBranch", payload);
    }
    async getBranchName(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchesController + "/getBranchName", payload);
    }

    async getBranchesByCompany(companyName: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchesController + "/getBranchesByCompany", companyName);
    }

}


