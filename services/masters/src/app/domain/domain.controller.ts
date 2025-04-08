import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { DomainService } from "./domain.service";
import { DomainDto } from "./dto/domain.dto";

@Controller('/domain')
@ApiTags('/domain')
export class DomainController {
    constructor(
        private service: DomainService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createDomainType')
    @ApiBody({ type: DomainDto })
    async createDomainType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.CreateDomainType(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getDomianType')
    async getDomianType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getDomianType()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/deactivateDomainType')
    @ApiBody({ schema: { properties: { domainId: { type: 'number' } } } })
    async deactivateDomainType(@Body() req: { domainId: number }): Promise<CommonResponseModel> {
        try {
            return await this.service.deactivateDomainType(req.domainId);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateDomainType')
    @ApiBody({ type: DomainDto })
    async updateDomainType(@Body() dto: DomainDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateDomainType(dto.domainId, dto);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}