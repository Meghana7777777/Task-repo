// src/controllers/master.controller.ts
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JobsRateService } from './jobs-rate.service';
import { JobRatesDto } from './job-rate-dto';


@Controller('/jobs-rate')
@ApiTags('/jobs-rate')
export class JobsRateController {
    constructor(
        private readonly jobsRateService: JobsRateService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler

    ) { }

    @Post('/createJobRates')
    @ApiBody({ type: JobRatesDto })
    async createJobRates(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.jobsRateService.createJobRates(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateJobRates')
    async updateJobRates(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.jobsRateService.updateJobRates(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getJobRates')
    async getJobRates(): Promise<CommonResponseModel> {
        try {
            return await this.jobsRateService.getJobRates();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateDeactivateJobRates')
    async activateDeactivateJobRates(@Body() dto: any): Promise<CommonResponseModel> {
        try {
            return await this.jobsRateService.activateDeactivateJobRates(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
