import { DashboardReq } from "@hrexpert/shared-models";
import { CommonResponseModel } from "../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class WeekOffLeavesService extends MastersCommonAxiosService {

    private WeekOffLeavesController = "/week-off-leaves";

    async createWeekOffLeaves(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.WeekOffLeavesController + "/createWeekOffLeaves", payload);
    }

    async getAllWeekOffLeaves(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.WeekOffLeavesController + "/getAllWeekOffLeaves",req);
    }

    async getAllActiveWeekOffLeaves(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.WeekOffLeavesController + "/getAllActiveWeekOffLeaves");
    }

    async updateWeekOffLeaves(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.WeekOffLeavesController + '/updateWeekOffLeaves', dto);
    }

    async activateOrDeactivateWeekOffLeave(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.WeekOffLeavesController + "/activateOrDeactivateWeekOffLeave", payload);
    }

    async getWeekNameFromWeekOffLeaves(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.WeekOffLeavesController + "/getWeekNameFromWeekOffLeaves");
    }
}
