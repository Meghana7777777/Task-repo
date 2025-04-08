import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DayWisePayService } from './day-wise-pay.service';
@Controller('day-wise-pay')
@ApiTags('day-wise-pay')
export class DayWisePayController {
    constructor(
        private readonly jobsRateService: DayWisePayService,
        private readonly applicationExceptionhandler: ApplicationExceptionHandler,
    ) { }

    @Post('/saveDayWisePayExcel')
    async saveDayWisePayExcel(@Body() data: any): Promise<CommonResponseModel> {
        try {
            return this.jobsRateService.saveDayWisePayExcel(data);
        } catch (err) {
            return this.applicationExceptionhandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getWorkerEmpBasic')
    async getWorkerEmpBasic(@Body() data: any): Promise<CommonResponseModel> {
        try {
            return this.jobsRateService.getWorkerEmpBasic(data);
        } catch (err) {
            return this.applicationExceptionhandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getDayWiseData')
    async getDayWiseData(@Body() data?: any): Promise<CommonResponseModel> {
        try {
            return this.jobsRateService.getDayWiseData(data);
        } catch (err) {
            return this.applicationExceptionhandler.returnException(CommonResponseModel, err);
        }
    }
}
