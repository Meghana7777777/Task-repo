import { CommonResponseModel } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class EmployeeLogsService extends EMSCommonAxiosService {
    private employeeLogsController = "/employee-logs";

    async createEmployeeLogs(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeLogsController + "/createEmployeeLogs", req);
    }
 
    async getAllEmployeeLogs(req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeLogsController + "/getAllEmployeeLogs",req);
    }

}