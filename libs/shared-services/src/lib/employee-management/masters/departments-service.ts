import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class DepartmentService extends EMSCommonAxiosService {
    private DepartmentsController = "/departments";

    async createDepartments(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/createDepartments", req);
    }

    async getAllDepartments(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/getAllDepartments");
    }

    async updateDepartment(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/updateDepartment", req);
    }
  
    async activateDeactivateDepartment(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/activateDeactivateDepartment", req);
    }

    async getAllActiveDepartments(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/getAllActiveDepartments");
    }

    async getActiveDepartments(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/getActiveDepartments");
    }
    async getdeparmentName(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DepartmentsController + "/getdeparmentName");
    }
}
