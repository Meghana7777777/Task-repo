import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApplyOtDTO } from "./dto/apply-ot-dto";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/shared-models";
import { ApplyOtService } from "./apply-ot-service";

@Controller('/apply-ot')
@ApiTags('/apply-ot')
export class ApplyOtController {
    constructor(
        private service: ApplyOtService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createOt')
    @ApiBody({ type: ApplyOtDTO })
    async createOt(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createOt(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllOt')
    async getAllOt(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllOt()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateOt')
    @ApiBody({ type: ApplyOtDTO })
    async updateOt(@Body() req: ApplyOtDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.updateOt(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
 
    @Post('/activateDeactivateOt')
    @ApiBody({ type: ApplyOtDTO })
    async activateDeactivateOt(@Body() req: ApplyOtDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.activateDeactivateOt(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
