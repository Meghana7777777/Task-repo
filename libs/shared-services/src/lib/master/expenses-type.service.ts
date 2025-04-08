import { CommonResponseModel } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class ExpensesTypeService extends MastersCommonAxiosService {
    private ExpensesTypeController = "/expenses_type";

    async CreateExpensesType(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ExpensesTypeController + "/CreateExpensesType", req);
    }

    async getExpensesType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ExpensesTypeController + "/getExpensesType");
    }

    async deactivateExpensesType(expenseId: number): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ExpensesTypeController + "/deactivateExpensesType", { expenseId });
    }

    async updateExpensesType(expenseId: number, req: any): Promise<any> {
        return this.axiosPostCall(this.ExpensesTypeController + "/updateExpensesType", { expenseId, ...req });
    }
}
