import { Body, Controller, Post } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ApplicationExceptionHandler, CommonResponseModel, ShiftReq } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ShiftDto } from './shift.dto';

@Controller('/shifts')
@ApiTags('/shifts')
export class ShiftsController {
    constructor(
        private service: ShiftsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createShift')
    @ApiBody({ type: ShiftDto })
    async createShift(@Body() req: ShiftDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createShift(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllShifts')
    async getAllShifts(@Body() req:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllShifts(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateShifts')
    @ApiBody({ type: ShiftDto })
    async updateShifts(@Body() req: ShiftDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateShifts(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveShifts')
    async getActiveShifts(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveShifts();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateShifts')
    @ApiBody({ type: ShiftDto })
    async activateOrDeactivateShifts(@Body() dto: ShiftDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateShifts(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllShidtDetailsAgaisntLogDate')
    async getAllShidtDetailsAgaisntLogDate(@Body() dto: ShiftReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllShidtDetailsAgaisntLogDate(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
}
