import { Body, Controller, Post } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BranchDto } from './branch.dto';
import { BranchIdDto } from './branch-req.dto';

@Controller('/branches')
@ApiTags('/branches')
export class BranchesController {
    constructor(
        private service: BranchesService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createBranch')
    @ApiBody({ type: BranchDto })
    async createBranch(@Body() req: BranchDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createBranch(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllBranches')
    async getAllBranches(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllBranches();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateBranch')
    @ApiBody({ type: BranchDto })
    async updateBranch(@Body() req: BranchDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateBranch(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveBranches')
    async getActiveBranches(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveBranches();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateBranch')
    @ApiBody({ type: BranchDto })
    async activateOrDeactivateBranch(@Body() dto: BranchDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateBranch(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchName')
    async getBranchName(@Body() dto: BranchIdDto): Promise<any> {
        try {
            return await this.service.getBranchName(dto)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);

        }
    }

    @Post('/getBranchesByCompany')
    async getBranchesByCompany(@Body() companyName: any): Promise<CommonResponseModel> {
        if (!companyName) {
            return new CommonResponseModel(false, 0, 'Company name is required', []);
        }
        try {
            return await this.service.getBranchesByCompany(companyName);
        } catch (error) {
            console.error('Error in getBranchesByCompany controller:', error);
            return new CommonResponseModel(false, 0, 'Failed to retrieve branches', []);
        }
    }
}
