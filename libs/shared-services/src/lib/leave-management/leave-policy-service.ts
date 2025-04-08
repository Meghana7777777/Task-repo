import { CommonResponseModel, EmpDataReq, LeaveAdjustmentDto, LeavesAccumulationReq } from '@hrexpert/shared-models';
import { LMSCommonAxiosService } from './common-axios-service-lms';

export class LeavePolicyService extends LMSCommonAxiosService {
  private url = '/leave-policy';

    async createLeavePolicy(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/createLeavePolicy", payload);
    }

    async getAllLeavePolicies(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllLeavePolicies");
    }

    async getAllLeavePoliciesWithoutRelation(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllLeavePoliciesWithoutRelation");
    }

    async mapTypeAndGroup(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/mapTypeAndGroup", payload);
    }

    async getLeaveGroupData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getLeaveGroupData");
    }

    async createLeaveApplicability(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/createLeaveApplicability",req);
    }

    async getLeaveApplicabilityData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getLeaveApplicabilityData");
    }

    async getLeaveTypeGroupMapping(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getLeaveTypeGroupMapping");
    }

    async activateOrDeactivateLeavePolicy(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/activateOrDeactivateLeavePolicy",payload);
    }

    async getleavePolicyDetailsById(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getleavePolicyDetailsById",payload);
    }

    async updateLeavePolicy(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/updateLeavePolicy",payload);}
        
    async allocateLeavesToEmp(req?: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/allocateLeavesToEmp", req);
    }
    async getActiveLeaveType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getActiveLeaveType");
    }

    async getLeaveCodeById(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getLeaveCodeById", payload);
    }
    async getAllTypesOfLeavesPolicy(payload?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllTypesOfLeavesPolicy", payload);
    }

    async accumulateLeaves(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/accumulateLeaves", req);
    }

    async resetLeaves(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/resetLeaves", req);
    }

    async leavesAccumlating(req?: LeavesAccumulationReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/leavesAccumlating", req);
    }

    async updateleavesAccumlation(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/updateleavesAccumlation", req);
    }

}