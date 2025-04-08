import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AttendanceDevService } from "./attendance-device.service";
import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { AttendanceDeviceDto } from "./dto/attendance-device.dto";

@Controller('/attendance_device')
@ApiTags('/attendance_device')
export class AttendanceDevController {
    constructor(
        private service: AttendanceDevService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/CreateAttendanceDevice')
    @ApiBody({ type: AttendanceDeviceDto })
    async CreateAttendanceDevice(@Body() req:any): Promise<CommonResponseModel> {
        try {
            return await this.service.CreateAttendanceDevice(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    
    @Post('/getAttendanceDevice')
    async getAttendanceDevice(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAttendanceDevice()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
   

    @Post('/activateDeactivateAttandenceDev')
    @ApiBody({ type: AttendanceDeviceDto })
    async activateDeactivateAttandenceDev(@Body() req: AttendanceDeviceDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateDeactivateAttandenceDev(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}