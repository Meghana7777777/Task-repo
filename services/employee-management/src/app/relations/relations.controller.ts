import { Body, Controller, Post } from '@nestjs/common';

import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RelationDTO } from './dto/relations-dto';
import { RelationsService } from './relations.service';


@Controller('/relations')
@ApiTags('/relations')
export class RelationsController {
    constructor(
        private service: RelationsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createRelations')
    @ApiBody({ type: RelationDTO })
    async createRelations(@Body() req: RelationDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.createRelations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllRelations')
    async getAllRelations(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllRelations();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateRelations')
    @ApiBody({ type: RelationDTO})
    async updateRelations(@Body() req: RelationDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.updateRelations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveRelations')
    async getActiveRelations(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveRelations();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateRelations')
    @ApiBody({ type:RelationDTO})
    async activateOrDeactivateRelations(@Body() dto:RelationDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateRelations(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
