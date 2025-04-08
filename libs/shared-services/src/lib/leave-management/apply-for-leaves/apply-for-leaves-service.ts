import { CommonResponseModel } from "@hrexpert/shared-models";
import { LMSCommonAxiosService } from "../common-axios-service-lms";

export class ApplForLeavesSharedService extends LMSCommonAxiosService {
    private ApplyForLeavesController = "/apply-for-leaves";

    async saveBulkLeaveExcel(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/saveBulkLeaveExcel", req);
    }

    async saveExceededLeaveExcelData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/saveExceededLeaveExcelData", req);
    }
    
    async getExceededData(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getExceededData", req);
    }

    async getAppliedForLeaves(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAppliedForLeaves", req);
    }

    async getAppliedForLeavesOpen(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAppliedForLeavesOpen", req);
    }

    async getAppliedForLeavesApproved(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAppliedForLeavesApproved", req);
    }

    async getAppliedForLeavesRejected(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAppliedForLeavesRejected", req);
    }

    async getAppliedForLeavesCancel(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAppliedForLeavesCancel", req);
    }

    async createManualLeave(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/createManualLeave", req);
    }

    async getActiveEmployeesById(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getActiveEmployeesById", req);
    }
    async getActiveEmployeesByIds(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getActiveEmployeesByIds", req);
    }

    async getHolidaysDateFromHolidayMaster(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getHolidaysDateFromHolidayMaster");
    }

    async getWeekOfDataFromWeekOfTable(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getWeekOfDataFromWeekOfTable");
    }

    async getAttStatusData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAttStatusData");
    }

    async getAllTypesOfLeavesData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAllTypesOfLeavesData");
    }

    async getAllLeaveAllocationsData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAllLeaveAllocationsData");
    }

    async getLeaveHistory(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getLeaveHistory", req);
    }

    async updateApplyLeaveStatusApproved(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/updateApplyLeaveStatusApproved", req);
    }

    async updateApplyLeaveStatusApprovedBulk(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/updateApplyLeaveStatusApprovedBulk", req);
    }

    async updateApplyLeaveStatusRejected(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/updateApplyLeaveStatusRejected", req);
    }

    async updateApplyLeaveStatusCanceled(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/updateApplyLeaveStatusCanceled", req);
    }

    async attendanceWiseSelectedEmployee(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/attendanceWiseSelectedEmployee", req);
    }

    async updateManualLeave(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/updateManualLeave", req);
    }

    async CancleManualLeave(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/CancleManualLeave", req);
    }
    async getAppliedForLeavesIdById(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAppliedForLeavesIdById", req);
    }

    async getAllRMLeaves(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAllRMLeaves", req);
    }
    async getAllRMData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getAllRMData");
    }
    async getReportingManagerData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getReportingManagerData", req);
    }

    async applyLeaveStatusApprovedByRmWhatsapp(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/applyLeaveStatusApprovedByRmWhatsapp", req);
    }

    async applyLeaveStatusRejectedByRmWhatsapp(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/applyLeaveStatusRejectedByRmWhatsapp", req);
    }

    async getMobileNoByEmpCode(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ApplyForLeavesController + "/getMobileNoByEmpCode", req);
    }

    
}
