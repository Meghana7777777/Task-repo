import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class PayrollCodeBranchMappingSharedService extends PMSCommonAxiosService {
    private payrollCodeBranchMappingService = "/payroll-code-branch-mapping";

    async createPayrollCodeBranchMapping(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.payrollCodeBranchMappingService + "/createPayrollCodeBranchMapping", req);
    }

    async updatePayrollCodeBranchMapping(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.payrollCodeBranchMappingService + "/updatePayrollCodeBranchMapping", req);
    }

    async getPayrollCodeBranchMapping(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.payrollCodeBranchMappingService + "/getPayrollCodeBranchMapping");
    }

    async getActivePayrollCodeBranchMapping(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.payrollCodeBranchMappingService + "/getActivePayrollCodeBranchMapping");
    }

    async activateOrDeactivatePayrollCodeBranchMapping(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.payrollCodeBranchMappingService + "/activateOrDeactivatePayrollCodeBranchMapping", payload);
    }

}
