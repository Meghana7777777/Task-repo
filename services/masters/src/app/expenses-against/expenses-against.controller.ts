import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { ExpensesAgainstService } from "./expenses-against.service";
import { ExpensesAgainstDto } from "./dto/expenses-against.dto";

@Controller('/expenses_against')
@ApiTags('expenses_against')
export class ExpensesAgainstController {
    constructor(
        private service: ExpensesAgainstService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createExpensesAgainst')
    @ApiBody({ type: ExpensesAgainstDto })
    async createExpensesAgainst(@Body() dto: ExpensesAgainstDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createExpensesAgainst(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getExpensesAgainst')
    async getExpensesAgainst(): Promise<CommonResponseModel> {
        try {
            return await this.service.getExpensesAgainst();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/deactivateExpensesAgainst')
    @ApiBody({ schema: { properties: { expenseAgainstId: { type: 'number' } } } })
    async deactivateExpensesAgainst(@Body() req: { expenseAgainstId: number }): Promise<CommonResponseModel> {
        try {
            return await this.service.deactivateExpensesAgainst(req.expenseAgainstId);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/update')
    @ApiBody({ type: ExpensesAgainstDto })
    async updateExpensesAgainst(@Body() dto: ExpensesAgainstDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateExpensesAgainst(dto.expenseAgainstId, dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
