import { CommonResponseModel, ShiftChangeRequest, ShiftStatsUpdateReq, TeamCalenderResponse } from "@hrexpert/shared-models";
import { LMSCommonAxiosService } from "./common-axios-service-lms";

export class ShiftChangeService extends LMSCommonAxiosService {


    private url = '/shiftChange';

    async createShiftChangeRequest(req: any): Promise<CommonResponseModel> {
        console.log(req,'change req')
        return this.axiosPostCall(this.url + '/createShiftChangeRequest', req)
           
    }

    async getAllOpenShiftChangeRequest(): Promise<TeamCalenderResponse> {

        return this.axiosPostCall(this.url + '/getAllOpenShiftChangeRequest')
    }  

    async updateShiftStatusBySelectedEmp(req:ShiftStatsUpdateReq): Promise<TeamCalenderResponse> {
        console.log(req,'reqreq')
        return this.axiosPostCall(this.url + '/updateShiftStatusBySelectedEmp',req)
    }   
    
    async getShiftByEmpId(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + '/getShiftByEmpId',req)
    }

}