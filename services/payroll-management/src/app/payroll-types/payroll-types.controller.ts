import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PayrollTypesDto } from './dto/payroll-types.dto';
import { PayrollTypesService } from './payroll-types.service';

@Controller('/payroll-types')
@ApiTags('/payroll-types')
export class PayrollTypesController {
    constructor(
        private payrollTypesService: PayrollTypesService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createPayrollTypes')
    @ApiBody({ type: PayrollTypesDto })
    async createPayrollTypes(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollTypesService.createPayrollTypes(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllPayrollTypes')
    async getAllPayrollTypes(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollTypesService.getAllPayrollTypes()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updatePayrollTypes')
    async updatePayrollTypes(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollTypesService.updatePayrollTypes(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateDeactivatePayrollTypes')
    async activateDeactivatePayrollTypes(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollTypesService.activateDeactivatePayrollTypes(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllActivePayrollTypes')
    async getAllActivePayrollTypes(): Promise<CommonResponseModel> {
        try {
            return await this.payrollTypesService.getAllActivePayrollTypes()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActivePayrollTypes')
    async getActivePayrollTypes(): Promise<CommonResponseModel> {
        try {
            return await this.payrollTypesService.getActivePayrollTypes()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
