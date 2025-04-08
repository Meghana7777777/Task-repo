import { CommonResponseModel } from "@hrexpert/backend-utils";
import { LMSCommonAxiosService } from "./common-axios-service-lms";
import { ShiftReq } from "@hrexpert/shared-models";

export class AttendanceStatusService extends LMSCommonAxiosService {
    private AttendanceStatusController = "/attendanceStatus";

    async createAttendanceStatus(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceStatusController + "/createAttendanceStatus", payload);
    }

    async getAllAttendanceStatus(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceStatusController + "/getAllAttendanceStatus",req);
    }

    async getActiveAttendanceStatus(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceStatusController + "/getActiveAttendanceStatus");
    }

    async updateAttendanceStatus(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.AttendanceStatusController + '/updateAttendanceStatus', dto);
    }

    async activateOrDeactivateAttendanceStatus(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceStatusController + "/activateOrDeactivateAttendanceStatus", payload);
    }
}
