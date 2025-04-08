import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { PayrollCodeBranchMappingService } from "./code-branch-emptype-mapping.service";


@ApiTags('payroll-code-branch-mapping')
@Controller('payroll-code-branch-mapping')
export class PayrollCodeBranchMappingController {
    constructor(
        private readonly payrollCodeBranchMappingService: PayrollCodeBranchMappingService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler

    ) { }

    @Post('/createPayrollCodeBranchMapping')
    async createPayrollCodeBranchMapping(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollCodeBranchMappingService.createPayrollCodeBranchMapping(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/updatePayrollCodeBranchMapping')
    async updatePayrollCodeBranchMapping(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollCodeBranchMappingService.updatePayrollCodeBranchMapping(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getPayrollCodeBranchMapping')
    async getPayrollCodeBranchMapping(): Promise<CommonResponseModel> {
        try {
            return await this.payrollCodeBranchMappingService.getPayrollCodeBranchMapping();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActivePayrollCodeBranchMapping')
    async getActivePayrollCodeBranchMapping(): Promise<CommonResponseModel> {
        try {
            return await this.payrollCodeBranchMappingService.getActivePayrollCodeBranchMapping();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivatePayrollCodeBranchMapping')
    @ApiBody({})
    async activateOrDeactivatePayrollCodeBranchMapping(@Body() dto: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollCodeBranchMappingService.activateOrDeactivatePayrollCodeBranchMapping(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }



}