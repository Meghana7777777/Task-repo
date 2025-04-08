import { CommonResponseModel, EmpDataReq, LeaveAdjustmentDto } from '@hrexpert/shared-models';
import { LMSCommonAxiosService } from './common-axios-service-lms';

export class LeaveAllocationService extends LMSCommonAxiosService {
  private url = '/leave-allocations';

    async leaveAllocate(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.url + "/leaveAllocate", payload);
    }
  // async leaveAllocate(payload: any): Promise<CommonResponseModel> {
  //   return this.axiosPostCall(this.url + '/leaveAllocate', payload);
  // }

    async getAllActiveEmpDropDown(req: EmpDataReq): Promise<CommonResponseModel>{
      return this.axiosPostCall(this.url + "/getAllActiveEmpDropDown", req)
    }

  async getLeaveAllocationData(req: EmpDataReq): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/getLeaveAllocationData",req)
  }
  async getAllLeaveAllocations(): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/getAllLeaveAllocations")
  }
  async getAllLeaveAllocationsLeaveTypes(req:any): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/getAllLeaveAllocationsLeaveTypes",req)
  }

  async getAllActiveEmp(req: EmpDataReq): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + '/getAllActiveEmp', req);
  }

    async getAllLeaveBalanceReport(req: any): Promise<CommonResponseModel> {
      return this.axiosPostCall(this.url + "/getAllLeaveBalanceReport", req);
    }

    async getLeaveHistoryReport(req: any) : Promise<CommonResponseModel> {
      return this.axiosPostCall (this.url + "/getLeaveHistoryReport",req);
    }

  async getAllActiveLeaveTypes(): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + '/getAllActiveLeaveTypes');
  }

  // async getLeaveAllocationData(req?: EmpDataReq): Promise<CommonResponseModel> {
  //   return this.axiosPostCall(this.url + '/getLeaveAllocationData', req);
  // }

  async allocateLeave(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + '/allocateLeave', req)
  }

  async updateLeaveAllocations(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/updateLeaveAllocations", req);
  }

  async getLeavesByEmpId(req: EmpDataReq): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/getLeavesByEmpId", req);
  }

  async createLeaveAdjustment(req: LeaveAdjustmentDto): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/createLeaveAdjustment", req);
  }

  async allocateLeaveExcel(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/allocateLeaveExcel", req);
  }

  async getLeaveAllocationMonthlyLogsData(req: EmpDataReq): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/getLeaveAllocationMonthlyLogsData",req)
  }


  async getAllNewLeaveAllocationsLeaveTypes(req:EmpDataReq): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/getAllNewLeaveAllocationsLeaveTypes",req)
  }
  
  async updateNewLeaveAllocations(req: any): Promise<CommonResponseModel> {
    return this.axiosPostCall(this.url + "/updateNewLeaveAllocations", req);
  }
}
