import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceStatusService } from './attendance-status.service';
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AttendanceStatusDto } from './atten.dto';

@Controller('/attendanceStatus')
@ApiTags('/attendanceStatus')
export class AttendanceStatusController {
    constructor(
        private service: AttendanceStatusService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createAttendanceStatus')
    @ApiBody({ type: AttendanceStatusDto })
    async createAttendanceStatus(@Body() req: AttendanceStatusDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createAttendanceStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllAttendanceStatus')
    async getAllAttendanceStatus(@Body() req:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllAttendanceStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateAttendanceStatus')
    @ApiBody({ type: AttendanceStatusDto })
    async updateAttendanceStatus(@Body() req: AttendanceStatusDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateAttendanceStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveAttendanceStatus')
    async getActiveAttendanceStatus(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveAttendanceStatus();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateAttendanceStatus')
    @ApiBody({ type: AttendanceStatusDto })
    async activateOrDeactivateAttendanceStatus(@Body() dto: AttendanceStatusDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateAttendanceStatus(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
}
