// src/controllers/master.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';


@Controller('/jobs')
@ApiTags('/jobs') 
export class JobsController {
    constructor(
        private readonly jobsService: JobsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler,
    ) { }


     @Post('/createJob')
        @ApiBody({ })
        async createJob(@Body() req: any): Promise<CommonResponseModel> {
            try {
                return await this.jobsService.createJob(req);
            } catch (error) {
                return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
            }
        }
    
        @Post('/getAllJobs')
        async getAllJobs(): Promise<CommonResponseModel> {
            try {
                return await this.jobsService.getAllJobs();
            } catch (error) {
                return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
            }
        }
    
        @Post('/updateJob')
        @ApiBody({})
        async updateJob(@Body() req: any): Promise<CommonResponseModel> {
            try {
                return await this.jobsService.updateJob(req);
            } catch (error) {
                return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
            }
        }
    
        @Post('/getActiveJobs')
        async getActiveJobs(): Promise<CommonResponseModel> {
            try {
                return await this.jobsService.getActiveJobs();
            } catch (error) {
                return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
            }
        }
    
        @Post('/activateOrDeactivateJob')
        @ApiBody({})
        async activateOrDeactivateJob(@Body() dto: any): Promise<CommonResponseModel> {
            try {
                return await this.jobsService.activateOrDeactivateJob(dto);
            } catch (error) {
                return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
            }
        }

}
