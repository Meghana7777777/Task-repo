import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { DocumentTypeService } from "./document-type.service";
import { DocumentTypeDto } from "./dto/document-type.dto";

@Controller('/document-type')
@ApiTags('/document-type')
export class DocumentTypeController {
    constructor(
        private service: DocumentTypeService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createDocumentType')
    @ApiBody({ type: DocumentTypeDto })
    async createDocumentType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createDocumentType(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getDocumentType')
    async getDocumentType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getDocumentType()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/deactivateDocumentType')
    @ApiBody({ schema: { properties: { documentTypeId: { type: 'number' } } } })
    async deactivateDocumentType(@Body() req: { documentTypeId: number }): Promise<CommonResponseModel> {
        try {
            return await this.service.deactivateDocumentType(req.documentTypeId);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateDocumentType')
    @ApiBody({ type: DocumentTypeDto })
    async updateDomainType(@Body() dto: DocumentTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateDomainType(dto.documentTypeId, dto);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getDocumentTypesByDomain')
    @ApiBody({ schema: { properties: { domain: { type: 'string' } } } })
    async getDocumentTypesByDomain(@Body('domain') domain: string): Promise<CommonResponseModel> {
        return await this.service.getDocumentTypesByDomain(domain);
    }


}