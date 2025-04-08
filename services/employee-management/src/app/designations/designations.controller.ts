import { ApplicationExceptionHandler, CommonResponseModel, DesignationsReq } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DesignationsService } from './designations.service';
import { DesignationsEntity } from './entites/designations.entity';
import { DesignationsDto } from './dto/designations.dto';
import { DesignationIdDto } from './dto/designation.id.dto';

@Controller('/designations')
@ApiTags('/designations')
export class DesignationsController {
    constructor(
        private service: DesignationsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createDesignations')
    async createDesignations(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createDesignations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getDesignations')
    async getDesignations(): Promise<CommonResponseModel> {
        try {
            return await this.service.getDesignations();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getActiveDesignations')
    async getActiveDesignations(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveDesignations();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateDesginations')
    @ApiBody({ type: DesignationsDto })
    async updateDesginations(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateDesginations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateDesignations')
    @ApiBody({ type: DesignationsDto })
    async activateOrDeactivateDesignations(@Body() dto: any): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateDesignations(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
      @Post('/getDesignationName')
      async getDesignationName(@Body() dto:DesignationIdDto):Promise<any> {
        try {
          return await this.service.getDesignationName(dto)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    
        }
      }  

}
