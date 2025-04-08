import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class PayrollEmployeeSharedService extends PMSCommonAxiosService {
    private PayrollEmployeesController = "/payroll-employees";

    async getPayRollEmpDetails(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollEmployeesController + "/getPayRollEmpDetails");
    }
   
}
