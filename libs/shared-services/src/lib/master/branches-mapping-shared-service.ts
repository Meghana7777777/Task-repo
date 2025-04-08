import { MastersCommonAxiosService } from "./common-axios-service-ems";
import { BranchesMappingSharedDto, CommonResponseModel, DashboardReq } from "@hrexpert/shared-models";

export class BranchesMappingSharedService extends MastersCommonAxiosService {
    private  BranchMappingController = "/branches-mapping";

    async createBranchMapping(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchMappingController + "/createBranchMapping", req);
    }

    async getBranchMapping():Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchMappingController + "/getBranchMapping");
    }

    async updateBranchMapping(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.BranchMappingController + '/updateBranchMapping', dto);
    }

    async activateOrDeactivateBranchMapping(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchMappingController + "/activateOrDeactivateBranchMapping", payload);
    }

    async getDepartmentByBranchId(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchMappingController + "/getDepartmentByBranchId", req);
    }

    async getDivisionByBranchId(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.BranchMappingController + "/getDivisionByBranchId", req);
    }
}