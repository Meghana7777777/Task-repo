import { Body, Controller, Post } from '@nestjs/common';

import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiTags } from '@nestjs/swagger';
import { PerformanceManagementService } from './performance-management.service';



@Controller('/performance-management')
@ApiTags('/performance-management')
export class PerformanceManagementController {
    constructor(
        private service: PerformanceManagementService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createPerformanceForm')
    async createPerformanceForm(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createPerformanceForm(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
   
    @Post('/getPerformanceManagement')
    async getPerformanceManagement(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getPerformanceManagement(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getStatusFromPeformance')
    async getStatusFromPeformance(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getStatusFromPeformance();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getAllReportingManager')
    async getAllReportingManager(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllReportingManager();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
