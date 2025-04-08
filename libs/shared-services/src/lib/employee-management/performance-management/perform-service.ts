import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class PerformanceManagementShareService extends EMSCommonAxiosService {
    private PerformanceManagementController = "/performance-management";

    async createPerformanceForm(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PerformanceManagementController + "/createPerformanceForm", req);
    }

    async getPerformanceManagement(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PerformanceManagementController + "/getPerformanceManagement", req);
    }
    async getStatusFromPeformance(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PerformanceManagementController + "/getStatusFromPeformance");
    }
    async getAllReportingManager(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PerformanceManagementController + "/getAllReportingManager");
    }

}
