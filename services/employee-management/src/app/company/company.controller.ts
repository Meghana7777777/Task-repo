// src/controllers/master.controller.ts
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CompanyDto } from './company-dto';
import { CompanyService } from './company.service';


@Controller('/company')
@ApiTags('/company')
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler

    ) { }

    @Post('/createCompany')
    @ApiBody({ type: CompanyDto })
    async createCompany(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.companyService.createCompany(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateCompany')
    async updateCompany(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.companyService.updateCompany(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getCompany')
    async getCompany(): Promise<CommonResponseModel> {
        try {
            return await this.companyService.getCompany();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
   
    @Post('/getActiveCompany')
    async getActiveCompany(): Promise<CommonResponseModel> {
        try {
            return await this.companyService.getActiveCompany();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateDeactivateCompany')
    async activateDeactivateCompany(@Body() dto: any): Promise<CommonResponseModel> {
        try {
            return await this.companyService.activateDeactivateCompany(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
