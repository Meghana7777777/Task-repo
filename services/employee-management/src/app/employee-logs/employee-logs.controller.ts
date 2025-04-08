
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmployeeLogsDTO } from './dto/employee-logs.dto';
import { EmployeeLogsService } from './employee-logs.service';

@Controller('employee-logs')
@ApiTags('/employee-logs')

export class EmployeeLogsController {
    constructor(
        private employeeLogsService: EmployeeLogsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createEmployeeLogs')
    @ApiBody({ type: EmployeeLogsDTO })
    async createEmployeeLogs(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.employeeLogsService.createEmployeeLogs(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/getAllEmployeeLogs')
    async getAllEmployeeLogs(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.employeeLogsService.getAllEmployeeLogs(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

}
