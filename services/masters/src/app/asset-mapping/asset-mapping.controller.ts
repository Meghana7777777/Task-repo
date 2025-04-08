import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { AssetService } from "./asset-mapping.service";
import { AssetMappingDto } from "./dto/asset-mapping.dto";

@Controller('/asset')
@ApiTags('/asset')
export class AssetController {
    constructor(
        private service: AssetService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createAsset')
    @ApiBody({ type: AssetMappingDto })
    async createAsset(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createAsset(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAssets')
    async getAssets(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAssets()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/deactivateAsset')
    @ApiBody({ schema: { properties: { assetId: { type: 'number' } } } })
    async deactivateAsset(@Body() req: { assetId: number }): Promise<CommonResponseModel> {
        try {
            return await this.service.deactivateAsset(req.assetId);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateAsset')
    @ApiBody({ type: AssetMappingDto })
    async updateAsset(@Body() dto: AssetMappingDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateAsset(dto.assetId, dto);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}