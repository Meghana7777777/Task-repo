import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class ExpensesAganistService extends MastersCommonAxiosService {
    private ExpensesAgainstController = "/expenses_against";


    async createExpensesAgainst(req: any): Promise<any> {
        return this.axiosPostCall(this.ExpensesAgainstController + "/createExpensesAgainst", req);
    }

    async getExpensesAgainst(): Promise<any> {
        return this.axiosPostCall(this.ExpensesAgainstController + "/getExpensesAgainst");
    }

    async deactivateExpensesAgainst(expenseAgainstId: number): Promise<any> {
        return this.axiosPostCall(this.ExpensesAgainstController + "/deactivateExpensesAgainst", { expenseAgainstId });
    }

    async updateExpensesAgainst(expenseAgainstId: number, req: any): Promise<any> {
        return this.axiosPostCall(this.ExpensesAgainstController + "/update", req);
    }
}