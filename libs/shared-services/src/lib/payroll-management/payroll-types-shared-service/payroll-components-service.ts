import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class PayrollComponentsSharedService extends PMSCommonAxiosService {
    private PayrollComponentsController = "/payroll-components";

    async getAllPayrollComponents(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getAllPayrollComponents");
    }

    async getPayrollComponentsByBranch(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getPayrollComponentsByBranch", req);
    }

    async getAllPayrollCodesData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getAllPayrollCodesData");
    }

    async payrollComponentsByCode(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/payrollComponentsByCode", req);
    }
  
    async codeDefinedByPayrollGroup(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/codeDefinedByPayrollGroup", req);
    }

    async getAllPayrollComponentsForHeadCount(): Promise<any> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getAllPayrollComponents");
    }
    async createPayrollTypeComponents(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/createPayrollTypeComponents", req);
    }

    async getAllPayrollNonRecurringComponents(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getAllPayrollNonRecurringComponents");
    }

    async createPayrollComponents(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/createPayrollComponents", req);
    }

    async activateDeactivatePayrollComponents(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/activateDeactivatePayrollComponents", req);
    }

    async updatePayrollComponents(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/updatePayrollComponents", req);
    }

    async getAllEmpTypeFromEmployee(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getAllEmpTypeFromEmployee");
    }

    async getPayrollComponentsByOrder(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getPayrollComponentsByOrder");
    }

    async updateEmployeeTypeInPayrollComponents(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/updateEmployeeTypeInPayrollComponents", req);
    }
    async createPayrollCode(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/createPayrollCode", req);
    }
  
    async getAllPayrollComponentsEmployeeAganist(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollComponentsController + "/getAllPayrollComponentsEmployeeAganist", req);
    }


}
