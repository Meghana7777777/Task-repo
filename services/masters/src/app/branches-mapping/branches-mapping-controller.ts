import { Body, Controller, Get, Post } from '@nestjs/common';
import { BranchesMappingService } from "./branches-mapping-service";
import { ApplicationExceptionHandler ,CommonResponseModel, DashboardReq} from "@hrexpert/shared-models";
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BranchesMappingDto } from './dto/branches-mapping-dto';

@Controller('/branches-mapping')
@ApiTags('/branches-mapping')
export class BranchesMappingController {
    constructor(
        private service: BranchesMappingService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createBranchMapping')
    @ApiBody({ type: BranchesMappingDto })
    async createBranchMapping(@Body() req: BranchesMappingDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createBranchMapping(req);
        } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchMapping')
    async getBranchMapping() :Promise<CommonResponseModel>{
        try {
            return await this.service.getBranchMapping();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel,error);
        }
    }

    
    @Post('/updateBranchMapping')
    @ApiBody({ type: BranchesMappingDto })
    async updateBranchMapping(@Body() req: BranchesMappingDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateBranchMapping(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/activateOrDeactivateBranchMapping')
    @ApiBody({ type: BranchesMappingDto })
    async activateOrDeactivateBranchMapping(@Body() req: BranchesMappingDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateBranchMapping(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getDivisionByBranchId')
    @ApiBody({ type: DashboardReq })
    async getDivisionByBranchId(@Body() req: DashboardReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getDivisionByBranchId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getDepartmentByBranchId')
    @ApiBody({ type: DashboardReq })
    async getDepartmentByBranchId(@Body() req: DashboardReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getDepartmentByBranchId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}