import { CommonResponseModel } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class AttendanceDeviceService extends MastersCommonAxiosService {
    private AttendanceDevController = "/attendance_device";

    async CreateAttendanceDevice(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceDevController + "/CreateAttendanceDevice", req);
    }

    
    async updateAttendanceDevice(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceDevController + "/updateAttendanceDevice", req);
    }
    async getAttendanceDevice(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceDevController + "/getAttendanceDevice");
    }
  
    async activateDeactivateAttandenceDev(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AttendanceDevController + "/activateDeactivateAttandenceDev", req);
    }
}

