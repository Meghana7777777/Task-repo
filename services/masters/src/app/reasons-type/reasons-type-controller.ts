import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationExceptionHandler, CommonResponseModel, ReasonsTypeDto } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ReasonsTypeService } from './reasons-type-service';

@Controller('/reasons-type')
@ApiTags('/reasons-type')
export class ReasonsTypeController {
    constructor(
        private service: ReasonsTypeService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createReasonsType')
    @ApiBody({ type: ReasonsTypeDto })
    async createReasonsType(@Body() req: ReasonsTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createReasonsType(req,true);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllReasonsTypes')
    async getAllReasonsTypes(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllReasonsTypes();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateReasonsType')
    @ApiBody({ type: ReasonsTypeDto })
    async updateReasons(@Body() req: ReasonsTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createReasonsType(req,true);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveReasonsType')
    async getActiveReasonsType(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveReasonsType();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateReasonsType')
    @ApiBody({ type: ReasonsTypeDto })
    async activateOrDeactivateReasonsType(@Body() dto: ReasonsTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateReasonsType(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
