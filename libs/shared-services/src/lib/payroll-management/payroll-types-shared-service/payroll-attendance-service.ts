import { CommonResponseModel } from "@hrexpert/backend-utils";
import { MonthWIseEmpReportReq } from "../../leave-management";
import { PMSCommonAxiosService } from "../common-axios-service-pms";
import { BranchMonthReq, MonthReq } from "@hrexpert/shared-models";

export class PayrollAttendanceSharedService extends PMSCommonAxiosService {
    private PayrollAttendanceController = "/payroll-attendance";

    async createPayrollAttendance(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/createPayrollAttendance", req);
    }

    async generatePayroll(req: BranchMonthReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/generatePayroll", req);
    }

    async getPayRollAttendance(req: BranchMonthReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/getPayRollAttendance", req);
    }

    async updatePayRollFreezeStatus(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/updatePayRollFreezeStatus", req)
    }

    async createPayrollAttendanceForWeekly(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollAttendanceController + "/createPayrollAttendanceForWeekly", req);
    }
}
