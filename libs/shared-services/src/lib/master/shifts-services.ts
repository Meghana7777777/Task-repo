import { CommonResponseModel } from "@hrexpert/backend-utils";
import { MastersCommonAxiosService } from "./common-axios-service-ems";
import { ShiftReq } from "@hrexpert/shared-models";

export class ShiftService extends MastersCommonAxiosService {
    private ShiftsController = "/shifts";

    async createShift(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ShiftsController + "/createShift", payload);
    }

    async getAllShifts(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ShiftsController + "/getAllShifts",req);
    }

    async getActiveShifts(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ShiftsController + "/getActiveShifts");
    }

    async updateShifts(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.ShiftsController + '/updateShifts', dto);
    }

    async activateOrDeactivateShifts(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ShiftsController + "/activateOrDeactivateShifts", payload);
    }
    async getAllShidtDetailsAgaisntLogDate(payload: ShiftReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ShiftsController + "/getAllShidtDetailsAgaisntLogDate", payload);
    }
}
