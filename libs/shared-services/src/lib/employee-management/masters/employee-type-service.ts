import { CommonResponseModel, EmployeeTypeDto } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class EmployeeTypeService extends EMSCommonAxiosService {
    private EmployeeTypeController = "/employee-type";

    async createEmployeeType(payload: EmployeeTypeDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmployeeTypeController + "/createEmployeeType", payload);
    }

    async getAllEmployeeTypes(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmployeeTypeController + "/getAllEmployeeTypes");
    }

    async getActiveEmployeeType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmployeeTypeController + "/getActiveEmployeeType");
    }

    async updateEmplloyeeType(dto: EmployeeTypeDto): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.EmployeeTypeController + '/updateEmplloyeeType', dto);
    }

    async activateOrDeactivateEmployeetype(payload: EmployeeTypeDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmployeeTypeController + "/activateOrDeactivateEmployeetype", payload);
    }
}
