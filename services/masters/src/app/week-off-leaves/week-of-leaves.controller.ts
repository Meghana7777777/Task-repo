import { Body, Controller, Post } from '@nestjs/common';

import { ApplicationExceptionHandler, CommonResponseModel, DashboardReq } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { WeekOffLeavesDTO } from './dtos/week-of-leaves.dto';
import { WeekOffLeavesService } from './week-of-leaves.service';
import { WeekOffLeavesUpDateDTO } from './dtos/week-off-leaves-update.dto';



@Controller('/week-off-leaves')
@ApiTags('/week-off-leaves')
export class WeekOffLeavesController {
    constructor(
        private service: WeekOffLeavesService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createWeekOffLeaves')
    @ApiBody({ type: WeekOffLeavesDTO })
    async createWeekOffLeaves(@Body() req: WeekOffLeavesDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.createWeekOffLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllWeekOffLeaves')
    async getAllWeekOffLeaves(@Body() req: DashboardReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllWeekOffLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateWeekOffLeaves')
    @ApiBody({ type: WeekOffLeavesDTO })
    async updateWeekOffLeaves(@Body() req: WeekOffLeavesUpDateDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.updateWeekOffLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllActiveWeekOffLeaves')
    async getAllActiveWeekOfLeaves(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveWeekOffLeaves();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateWeekOffLeave')
    @ApiBody({ type: WeekOffLeavesDTO })
    async activateOrDeactivateWeekOffLeave(@Body() dto: WeekOffLeavesDTO): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateWeekOffLeave(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getWeekNameFromWeekOffLeaves')
    async getWeekNameFromWeekOffLeaves(@Body() req?:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getWeekNameFromWeekOffLeaves();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
