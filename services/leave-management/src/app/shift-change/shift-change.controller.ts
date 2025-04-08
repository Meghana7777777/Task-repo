import { CommonResponseModel, ShiftChangeRequest, ShiftStatsUpdateReq, TeamCalenderResponse } from '@hrexpert/shared-models';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ShiftChangeService } from './shift-change.service';
import { ShiftChangeReqDto } from './dto/shift-change..dto';

@ApiTags('shiftChange')
@Controller('shiftChange')
export class ShiftChangeController {

    constructor(
        private service: ShiftChangeService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createShiftChangeRequest')
    async createShiftChangeRequest(@Body() req: any): Promise<CommonResponseModel> {
        console.log(req,'conreq')
        try {
            return await this.service.createShiftChangeRequest(req);
            
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllOpenShiftChangeRequest')
    async getAllOpenShiftChangeRequest(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllOpenShiftChangeRequest();
            
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/updateShiftStatusBySelectedEmp')
    async updateShiftStatusBySelectedEmp(@Body() req:ShiftStatsUpdateReq): Promise<CommonResponseModel> {
        console.log(req,'req')
        try {
            return await this.service.updateShiftStatusBySelectedEmp(req);
            
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getShiftByEmpId')
    async getShiftByEmpId(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getShiftByEmpId(req);
            
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
  
}