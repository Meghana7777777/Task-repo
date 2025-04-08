import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { IdProofService } from './id-proof-services';
import { IdProofDto } from './dto/id-proof-dto';

@Controller('/id-proof')
@ApiTags('/id-proof')
export class IdProofController {
    constructor(
        private service: IdProofService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createIdProof')
    @ApiBody({ type: IdProofDto })
    async createIdProof(@Body() req: IdProofDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createIdProof(req,false);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllIdProofs')
    async getAllIdProofs(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllIdProofs();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateIdProof')
    @ApiBody({ type: IdProofDto })
    async updateBranch(@Body() req: IdProofDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createIdProof(req,true);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveIdProofs')
    async getActiveIdProofs(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveIdProofs();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateIdProof')
    @ApiBody({ type: IdProofDto })
    async activateOrDeactivateIdProof(@Body() dto: IdProofDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateIdProof(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
