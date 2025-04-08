import { CommonResponseModel, EmpDataReq, LeaveAdjustmentDto, LeavesAccumulationReq } from '@hrexpert/shared-models';
import { LMSCommonAxiosService } from './common-axios-service-lms';

export class LeaveBalanceService extends LMSCommonAxiosService {
    private url = '/leave-balance';



    async getAllLeaveBalanceData(req: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllLeaveBalanceData", req)
    }

    async updateLeavesBalance(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/updateLeavesBalance", req)
    }

    async leavesAccumlation(req?: LeavesAccumulationReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/leavesAccumlation", req)
    }

    async getAllLeaveBalance(req: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllLeaveBalance", req)
    }

    async getAllLeaveBalanceAllocations(req: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllLeaveBalanceAllocations", req)
    }

    async getAllLeaveBalanceAllocationsAllMonths(req: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/getAllLeaveBalanceAllocationsAllMonths", req)
    }


}
