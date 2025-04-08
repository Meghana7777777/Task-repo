import { CommonResponseModel } from "@hrexpert/backend-utils";
import { LMSCommonAxiosService } from "./common-axios-service-lms";


export class LeaveGroupsService extends LMSCommonAxiosService {
    private LeaveGroupsController = "/leave_group";

    async createLeaveGroups(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveGroupsController + "/createLeaveGroups", payload);
    }

    async getAllLeaveGroups(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveGroupsController + "/getAllLeaveGroups");
    }

    async getActiveLeaveGroups(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveGroupsController + "/getActiveLeaveGroups");
    }

    async updateLeaveGroups(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.LeaveGroupsController + '/updateLeaveGroups', dto);
    }

    async activateOrDeactivateLeaveGroups(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveGroupsController + "/activateOrDeactivateLeaveGroups", payload);
    }
}
