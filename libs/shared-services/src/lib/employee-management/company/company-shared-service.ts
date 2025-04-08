import { CommonResponseModel } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class CompanySharedService extends EMSCommonAxiosService {
    private CompanyController = "/company";

    async createCompany(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.CompanyController + "/createCompany", req);
    }

    async getCompany(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.CompanyController + "/getCompany");
    }

    async getActiveCompany(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.CompanyController + "/getActiveCompany");
    }

    async updateCompany(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.CompanyController + "/updateCompany", req);
    }

    async activateDeactivateCompany(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.CompanyController + "/activateDeactivateCompany", req);
    }
}
