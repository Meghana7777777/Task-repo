import { Body, Controller, Post } from '@nestjs/common';

import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DivisionDTO } from './dto/division.dto';
import { DivisionService } from './division.service';
import { DivisionIdDto } from './dto/division.id.dto';



@Controller('/division')
@ApiTags('/division')
export class DivisionController {
    constructor(
        private service: DivisionService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createDivision')
    @ApiBody({ type: DivisionDTO })
    async createDivision(@Body() req:  DivisionDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.createDivision(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllDivision')
    async getAllDivision(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllDivision();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateDivision')
    @ApiBody({ type:  DivisionDTO})
    async updateDivision(@Body() req:  DivisionDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.updateDivision(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveDivision')
    async getActiveShifts(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveDivision();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateDivision')
    @ApiBody({ type: DivisionDTO})
    async activateOrDeactivateDivision(@Body() dto: DivisionDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateDivision(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getAllActiveDivisions')
    async getAllActiveDivisions(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveDivisions();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

     @Post('/getDivisionName')
      async getDivisionName(@Body() dto:DivisionIdDto):Promise<any> {
        try {
          return await this.service.getDivisionName(dto)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    
        }
      }  
}
