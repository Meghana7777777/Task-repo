import { CommonResponseModel } from "@hrexpert/backend-utils";
import { LMSCommonAxiosService } from "./common-axios-service-lms";

export class LeaveTypeService extends LMSCommonAxiosService {
    private LeaveTypeController = "/leave-type";

    async createLeaveType(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/createLeaveType", payload);
    }

    async getAllLeaveType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllLeaveType");
    }

    async activateOrDeactivateLeaveType(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/activateOrDeactivateLeaveType", payload);
    }

    async updateLeaveType(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/createLeaveType", payload);
    }

    async getAllActiveLeaveType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllActiveLeaveType");
    }

    //----------------------Leave Group----------------------

    async createLeaveGroup(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/createLeaveGroup", payload);
    }

    async getAllLeaveGroup(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllLeaveGroup");
    }

    async activateOrDeactivateLeaveGroup(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/activateOrDeactivateLeaveGroup", payload);
    }

    async updateLeaveGroup(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/createLeaveGroup", payload);
    }

    async getAllActiveLeaveGroup(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllActiveLeaveGroup");
    }

    //----------------------Leave Master----------------------

    async createLeave(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/createLeave", payload);
    }

    async getAllLeave(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllLeave");
    }

    async activateOrDeactivateLeave(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/activateOrDeactivateLeave", payload);
    }

    async updateLeave(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/createLeave", payload);
    }

    async getAllActiveLeave(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllActiveLeave");
    }

    //----------------------Leave code define----------------------

    async saveLeaveCodeDefine(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/saveLeaveCodeDefine", payload);
    }

    async saveLeaveGroupCodeMapping(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/saveLeaveGroupCodeMapping", payload);
    }

    async updateLeaveGroupCodeMapping(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/saveLeaveGroupCodeMapping", payload);
    }

    async getAllGroupCodeMapData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllGroupCodeMapData");
    }

    async getAllActiveGeneratedCode(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllActiveGeneratedCode");
    }

    async activateOrDeactivateLeaveGroupCode(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/activateOrDeactivateLeaveGroupCode", payload);
    }

    async codeDefineDataByLeaveGroupCode(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/codeDefineDataByLeaveGroupCode", payload);
    }

    async getAllGeneratedCode(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.LeaveTypeController + "/getAllGeneratedCode");
    }
}