import { CommonResponseModel } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class EmployeeTicketsService extends EMSCommonAxiosService {
    private employeeTicketsController = "/employee-tickets";

    async createTicket(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeTicketsController + "/createTicket", req);
    }
    
    async getTickets(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeTicketsController + "/getTickets", req);
    }

    async getAllTickets(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeTicketsController + "/getAllTickets", req);
    }

    async closeTicket(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeTicketsController + "/closeTicket", req);
    }
    
}