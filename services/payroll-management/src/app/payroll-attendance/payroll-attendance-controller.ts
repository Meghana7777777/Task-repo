import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PayrollAttendanceService } from './payroll-attendance-service';
import { MonthReq } from './dto/payroll-attendance-dto';


@Controller('/payroll-attendance')
@ApiTags('/payroll-attendance')
export class PayrollAttendanceController {
    constructor(
        private service: PayrollAttendanceService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createPayrollAttendance')
    // @ApiBody({ description: 'Request body for creating payroll attendance', type: MonthReq })
    async createPayrollAttendance(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createPayrollAttendance(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/generatePayroll')
    async generatePayroll(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.generatePayroll(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/getPayRollAttendance')
    async getPayRollAttendance(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getPayRollAttendance(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }
    @Post('/updatePayRollFreezeStatus')
    async updatePayRollFreezeStatus(@Body() req: MonthReq): Promise<CommonResponseModel> {
        try {
            return await this.service.updatePayRollFreezeStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createPayrollAttendanceForWeekly')
    // @ApiBody({ description: 'Request body for creating payroll attendance', type: MonthReq })
    async createPayrollAttendanceForWeekly(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createPayrollAttendanceForWeekly(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

}