import { Body, Controller, Post } from '@nestjs/common';

import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TypesOfLeavesDTO } from './dto/types-of-leave.dto';
import { TypesOfLeavesService } from './types-of-leave.service';


@Controller('/types-of-leaves')
@ApiTags('/types-of-leaves')
export class TypesOfLeavesController {
    constructor(
        private service: TypesOfLeavesService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createTypesOfLeaves')
    @ApiBody({ type: TypesOfLeavesDTO })
    async createTypesOfLeaves(@Body() req: TypesOfLeavesDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.createTypesOfLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllTypesOfLeaves')
    async getAllTypesOfLeaves(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllTypesOfLeaves();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateTypesOfLeaves')
    @ApiBody({ type: TypesOfLeavesDTO })
    async updateTypesOfLeaves(@Body() req: TypesOfLeavesDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.updateTypesOfLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllActiveTypesOfLeaves')
    async getAllActiveTypesOfLeaves(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveTypesOfLeaves();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateTypesOfLeave')
    @ApiBody({ type: TypesOfLeavesDTO })
    async activateOrDeactivateTypesOfLeave(@Body() dto: TypesOfLeavesDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateTypesOfLeave(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/typesOfLeaves')
    async typesOfLeaves(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.typesOfLeaves();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
