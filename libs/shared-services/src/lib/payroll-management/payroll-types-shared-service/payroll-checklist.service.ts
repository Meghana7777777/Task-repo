import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";

export class PayrollCheklistSharedService extends PMSCommonAxiosService {
    private PayrollAttendanceController = "/payroll-checklist";

    async saveOrUpdateChecklist(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/saveOrUpdateChecklist", req);
    }

    async getChecklist(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/getChecklist", req);
    }
}