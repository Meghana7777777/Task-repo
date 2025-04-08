import { ApplicationExceptionHandler, CommonResponseModel, SkillsReq } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SkillsDto } from './dto/skills.dto';
import { SkillsEntity } from './entites/skills.entity';
import { SkillsService } from './skills.service';

@Controller('/skills')
@ApiTags('/skills')
export class SkillsController {
    constructor(
        private service: SkillsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createSkills')
    @ApiBody({ type: SkillsEntity })
    async createSkills(@Body() req: SkillsEntity): Promise<CommonResponseModel> {
        try {
            return await this.service.createSkills(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getSkills')
    async getSkills(): Promise<CommonResponseModel> {
        try {
            return await this.service.getSkills();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getActiveSkills')
    async getActiveSkills(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveSkills();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateSkills')
    @ApiBody({ type: SkillsDto })
    async updateSkills(@Body() req: SkillsReq): Promise<CommonResponseModel> {
        try {
            return await this.service.updateSkills(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateSkills')
    @ApiBody({ type: SkillsDto })
    async activateOrDeactivateSkills(@Body() dto: SkillsReq): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateSkills(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
