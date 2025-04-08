import { Body, Controller, Post } from '@nestjs/common';

import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LeaveGroupsService } from './leave-group-service';
import { LeaveGroupsDto } from './dto/leave-group-dto';


@Controller('/leave_group')
@ApiTags('/leave_group')
export class LeaveGroupsController {
    constructor(
        private service: LeaveGroupsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createLeaveGroups')
    @ApiBody({ type: LeaveGroupsDto })
    async createLeaveGroups(@Body() req: LeaveGroupsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createLeaveGroups(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllLeaveGroups')
    async getAllLeaveGroupses(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveGroups();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLeaveGroups')
    @ApiBody({ type: LeaveGroupsDto })
    async updateLeaveGroups(@Body() req: LeaveGroupsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLeaveGroups(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveLeaveGroups')
    async getActiveLeaveGroups(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveLeaveGroups();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateLeaveGroups')
    @ApiBody({ type: LeaveGroupsDto })
    async activateOrDeactivateLeaveGroups(@Body() dto: LeaveGroupsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateLeaveGroups(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

   
}
