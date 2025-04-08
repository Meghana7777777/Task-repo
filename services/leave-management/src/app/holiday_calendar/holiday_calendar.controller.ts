import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HolidayDto } from './holiday_calendar.dto';
import { HolidayCalanderService } from './holiday_calendar.service';
import { HolidayReqForGenerateSwipe } from '@hrexpert/shared-models';

@Controller('/holidays')
@ApiTags('/holidays')
@Controller('holiday-calendar')
export class HolidayCalendarController {
    constructor(
        private readonly service: HolidayCalanderService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createHoliday')
    @ApiBody({ type: HolidayDto })
    async createHoliday(@Body() req: HolidayDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createHoliday(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllHolidays')
    async getAllHolidays(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllHolidays();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveHolidays')
    async getActiveHolidays(@Body() req:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveHolidays(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getActiveWeekOffAndHolidays')
    async getActiveWeekOffAndHolidays(@Body() req:HolidayReqForGenerateSwipe): Promise<CommonResponseModel> {
        console.log(req,'ccc')
        try {
            return await this.service.getActiveWeekOffAndHolidays(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/updateHoliday')
    @ApiBody({ type: HolidayDto })
    async updateHoliday(@Body() req: HolidayDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateHoliday(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateHoliday')
    @ApiBody({ type: HolidayDto })
    async activateOrDeactivateHoliday(@Body() req: HolidayDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateHoliday(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getHolidaysDateData')
    async getHolidaysDateData(@Body() req?:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getHolidaysDateData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
