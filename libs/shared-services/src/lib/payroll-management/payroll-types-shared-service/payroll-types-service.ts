import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class PayrollTypesSharedService extends PMSCommonAxiosService {
    private PayrollTypesController = "/payroll-types";

    async createPayrollTypes(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollTypesController + "/createPayrollTypes", req);
    }

    async getAllPayrollTypes(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollTypesController + "/getAllPayrollTypes");
    }

    async updatePayrollTypes(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollTypesController + "/updatePayrollTypes", req);
    }
  
    async activateDeactivatePayrollTypes(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollTypesController + "/activateDeactivatePayrollTypes", req);
    }

    async getAllActivePayrollTypes(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollTypesController + "/getAllActivePayrollTypes");
    }

    async getActivePayrollTypes(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollTypesController + "/getActivePayrollTypes");
    }

}
