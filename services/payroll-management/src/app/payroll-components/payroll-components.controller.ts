import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayrollComponentsService } from './payroll-components.service';

@Controller('/payroll-components')
@ApiTags('/payroll-components')
export class PayrollComponentsController {
    constructor(
        private payrollComponentsService: PayrollComponentsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/getAllPayrollComponents')
    async getAllPayrollComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getAllPayrollComponents()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
   
    @Post('/getAllPayrollComponentsEmployeeAganist')
    async getAllPayrollComponentsEmployeeAganist(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getAllPayrollComponentsEmployeeAganist(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getPayrollComponentsByBranch')
    async getPayrollComponentsByBranch(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getPayrollComponentsByBranch(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllPayrollCodesData')
    async getAllPayrollCodesData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getAllPayrollCodesData()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/payrollComponentsByCode')
    async payrollComponentsByCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.payrollComponentsByCode(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createPayrollTypeComponents')
    async createPayrollTypeComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.createPayrollTypeComponents(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllPayrollNonRecurringComponents')
    async getAllPayrollNonRecurringComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getAllPayrollNonRecurringComponents()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createPayrollComponents')
    async createPayrollComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.createPayrollComponents(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateDeactivatePayrollComponents')
    async activateDeactivatePayrollComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.activateDeactivatePayrollComponents(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updatePayrollComponents')
    async updatePayrollComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.updatePayrollComponents(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllEmpTypeFromEmployee')
    async getAllEmpTypeFromEmployee(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getAllEmpTypeFromEmployee()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getPayrollComponentsByOrder')
    async getPayrollComponentsByOrder(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.getPayrollComponentsByOrder()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateEmployeeTypeInPayrollComponents')
    async updateEmployeeTypeInPayrollComponents(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.updateEmployeeTypeInPayrollComponents(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createPayrollCode')
    async createPayrollCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.createPayrollCode(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/codeDefinedByPayrollGroup')
    async codeDefinedByPayrollGroup(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollComponentsService.codeDefinedByPayrollGroup(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
