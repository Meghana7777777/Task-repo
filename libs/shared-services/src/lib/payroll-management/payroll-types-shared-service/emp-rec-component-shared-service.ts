import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";
import { EmployeeFilterReq } from "../../employee-management/employee-onboarding/employee-filter-req";
import { EmployeeViewResponseModel } from "libs/shared-models/src/lib/employee-management/employee-details/employee-view-response.model";


export class EmpRecCompSharedService extends PMSCommonAxiosService {
    private EmpRecComController = "/emp-rec-components";

    async createEmpRecComponent(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpRecComController + "/createEmpRecComponent", req)
    }

    async createEmpNonRecComponent(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpRecComController + "/createEmpNonRecComponent", req)
    }

    async getEmpRecComponent(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpRecComController + "/getEmpRecComponent")
    }

    async uploadEmpRecComponent(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpRecComController + "/uploadEmpRecComponent", req);
    }

    async messExtraDaysExcel(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpRecComController + "/messExtraDaysExcel", req);
    }

    async getEmpExtraMessDaysForPayroll(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpRecComController + "/getEmpExtraMessDaysForPayroll", req);
    }
}
