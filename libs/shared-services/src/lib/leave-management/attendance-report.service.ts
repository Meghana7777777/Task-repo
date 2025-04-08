import { AttendanceAdjustRequest, AttendanceDto, AttendanceUpdateRequest, AttnAdjustLogReq, AttnAdjustmentCreateReq, BulkAttendanceApproval, DashboardReq, EmployeeViewResponseModel, lateMinReq, MonthReq, OTBulkApprovalReq, ReportingManagerReq, UnitIdReq } from "@hrexpert/shared-models";
import { CommonResponseModel } from "../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { LMSCommonAxiosService } from "./common-axios-service-lms";
import { MonthWIseEmpReportReq } from "./month-wise-emp-report";
export class AttendanceServices extends LMSCommonAxiosService {
    private AttendanceController = "/attendance";

    async getAllAttendance(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllAttendance", req);
    }

    async getAllAbsentsReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllAbsentsReport", req);
    }

    async createOdCo(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/createOdCo", req);
    }

    async getApplyCoOdUploadData(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getApplyCoOdUploadData",req);
    }

    async updateApplyCoOdUpload(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/updateApplyCoOdUpload", req);
    }

    async getAllForBulkOTApproval(req: OTBulkApprovalReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllForBulkOTApproval", req)
    }

    async updateBulkOTApproval(req?: OTBulkApprovalReq[]): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/updateBulkOTApproval", req)
    }

    async getAttStatusByEmpIdCodeName(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAttStatusByEmpIdCodeName", req)
    }


    async getAdjustmentData( req: AttendanceAdjustRequest): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getAdjustmentData",req)
    }
    async getAllForBulkOTApplyApprove(req: OTBulkApprovalReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllForBulkOTApplyApprove", req)
    }

    

    async getAttnAdjustTableData(req:UnitIdReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getAttnAdjustTableData",req)
    }

    async updateAttendance( req: AttendanceUpdateRequest): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/updateAttendance",req)
    }




    async attendanceAdjustment( req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/attendanceAdjustment",req)
    }

    async attendanceUpload( req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/attendanceUpload",req)
    }


  
    async getEmployeeNameByCode( req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getEmployeeNameByCode",req)
    }


    async getWorkingHoursReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getWorkingHoursReport", req);
    }

    async getWorkingHoursReportWithDetails(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getWorkingHoursReportWithDetails", req);
    }

    async getEmpAttendenceScoreData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getEmpAttendenceScoreData", req);
    }

    async getAllEmpMonthWiseData(req: any, isExcel?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllEmpMonthWiseData", req, isExcel);
    }

    async getAllEmpWeekWiseData(req: any, isExcel?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllEmpWeekWiseData", req, isExcel);
    }
    
    async getAllAttnAdjustmentData(req:UnitIdReq ): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllAttnAdjustmentData",req);
    }
    
    async updatBulkAttendanceApproval( req: BulkAttendanceApproval): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/updatBulkAttendanceApproval",req)
    }


    async updateFreezeStatus(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/updateFreezeStatus", req);
    }

    async updateFreezeStatusForWeeklyWorker(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/updateFreezeStatusForWeeklyWorker", req);
    }

    async getAllAdjustments( req: AttendanceAdjustRequest): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getAllAdjustments",req)
    }

    async weeklyAttendance(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/weeklyAttendance",req);
    }

    async dailyAttendance(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/dailyAttendance",req);
    }
    async attnAdjustmentBulkCreation(req:AttnAdjustmentCreateReq[]): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/attnAdjustmentBulkCreation",req)
    }
    async getDataByMonth(req:MonthReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getDataByMonth",req)
    }

    async getBranchWiseAttendance(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getBranchWiseAttendance",req)
    }
    
    async getAllEmpMonthWiseDataWithoutPagination(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getAllEmpMonthWiseDataWithoutPagination",req)
    }
    async getAllEmployeeWorking(req: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllEmployeeWorking", req);
    }
    async getLateAndEarlyEntryEmployees(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getLateAndEarlyEntryEmployees", req);
    }
    async getAllEmpLateMinutesData(req: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllEmpLateMinutesData", req);
    }
    async getAllEmpWeeklyWiseDataWithoutPagination(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getAllEmpWeeklyWiseDataWithoutPagination",req)
    }
    async CancleSelfAttendanceAdjust( req: AttnAdjustLogReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/CancleSelfAttendanceAdjust",req)
    }
    async getAllForOTApproved( req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getAllForOTApproved",req)
    }
    async updateApprovedOTStatus( req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/updateApprovedOTStatus",req)
    }
    async updateRevertOTStatus( req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/updateRevertOTStatus",req)
    }
    async updateRejectedOTStatus( req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/updateRejectedOTStatus",req)
    }
    async getEmpByWeekOffForToday( req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController+ "/getEmpByWeekOffForToday",req)
    }
    async getAllSinglePunchAttendance(req: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllSinglePunchAttendance", req);
    }
    async getAllLeaveCOllision(req: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllLeaveCOllision", req);
    }
    async updateAttendanceWhileCollision(req: AttendanceDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/updateAttendanceWhileCollision", req);
    }

    async deleteLeaveInAttendanceWhileCollision(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/deleteLeaveInAttendanceWhileCollision", req);
    }

    async calculateLateMin(req: lateMinReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/calculateLateMin", req);
    }
    async getAllReportingManagerWiseAttnReport(req:ReportingManagerReq ): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getAllReportingManagerWiseAttnReport", req);
    }
    async getLateMinMomentRecordsData(req:any ): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/getLateMinMomentRecordsData", req);
    }
    async approveLateMin(req:any ): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/approveLateMin", req);
    }
    async rejectLateMin(req:any ): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceController + "/rejectLateMin", req);
    }
}
