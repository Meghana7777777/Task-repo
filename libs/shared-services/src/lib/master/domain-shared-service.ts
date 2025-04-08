import { CommonResponseModel } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class DomainSharedService extends MastersCommonAxiosService {
    private ExpensesTypeController = "/domain";

    async createDomainType(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ExpensesTypeController + "/createDomainType", req);
    }

    async getDomianType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ExpensesTypeController + "/getDomianType");
    }

    async deactivateDomainType(domainId: number): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ExpensesTypeController + "/deactivateDomainType", { domainId });
    }

    async updateDomainType(domainId: number, req: any): Promise<any> {
        return this.axiosPostCall(this.ExpensesTypeController + "/updateDomainType", { domainId, ...req });
    }
}
