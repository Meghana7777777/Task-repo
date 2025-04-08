import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { QualificationsDto } from './dto/qualifications.dto';
import { QualificationsEntity } from './entites/qualifications.entity';
import { QualificationsService } from './qualifications.service';
import { SpecializationDto } from './dto/specialization.dto';
import { SpecializationsEntity } from './entites/specializations.entity';

@Controller('/qualifications')
@ApiTags('/qualifications')
export class QualificationsController {
    constructor(
        private service: QualificationsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createQualifications')
    @ApiBody({ type: QualificationsEntity })
    async createQualifications(@Body() req: QualificationsEntity): Promise<CommonResponseModel> {
        try {
            return await this.service.createQualifications(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getQualifications')
    async getQualifications(): Promise<CommonResponseModel> {
        try {
            return await this.service.getQualifications();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getActiveQualifications')
    async getActiveQualifications(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveQualifications();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateQualifications')
    @ApiBody({ type: QualificationsDto })
    async updateQualifications(@Body() req: QualificationsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateQualifications(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateQualifications')
    @ApiBody({ type: QualificationsDto })
    async activateOrDeactivateQualifications(@Body() dto: QualificationsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateQualifications(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createSpecializations')
    @ApiBody({ type: SpecializationsEntity })
    async createSpecializations(@Body() req: SpecializationsEntity): Promise<CommonResponseModel> {
        try {
            return await this.service.createSpecializations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getSpecializations')
    @ApiBody({ })
    async getSpecializations(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getSpecializations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getActiveSpecializations')
    async getActiveSpecializations(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveSpecializations();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateSpecializations')
    @ApiBody({ type: SpecializationDto })
    async updateSpecializations(@Body() req: SpecializationDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateSpecializations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateSpecializations')
    @ApiBody({ type: SpecializationDto })
    async activateOrDeactivateSpecializations(@Body() dto: SpecializationDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateSpecializations(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
