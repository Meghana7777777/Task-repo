import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { ExpensesTypeService } from "./expenses-type.service";
import { ExpensesTypeDto } from "./dto/expenses-type.dto";

@Controller('/expenses_type')
@ApiTags('/expenses_type')
export class ExpensesTypeController {
    constructor(
        private service: ExpensesTypeService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/CreateExpensesType')
    @ApiBody({ type: ExpensesTypeDto })
    async CreateExpensesType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.CreateExpensesType(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getExpensesType')
    async getExpensesType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getexpensesType()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/deactivateExpensesType')
    @ApiBody({ schema: { properties: { expenseId: { type: 'number' } } } })
    async deactivateExpensesType(@Body() req: { expenseId: number }): Promise<CommonResponseModel> {
        try {
            return await this.service.deactivateExpensesType(req.expenseId);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateExpensesType')
    @ApiBody({ type: ExpensesTypeDto })
    async updateExpensesType(@Body() dto: ExpensesTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateExpensesType(dto.expenseId, dto);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}