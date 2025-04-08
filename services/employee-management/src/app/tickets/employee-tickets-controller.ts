
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmployeeTicketsService } from './employee-tickets-service';

@Controller('employee-tickets')
@ApiTags('/employee-tickets')

export class EmployeeTicketsController {
    constructor(
        private employeeTicketsService: EmployeeTicketsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }


    @Post('/createTicket')
    @ApiBody({})
    async createTicket(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.employeeTicketsService.createTicket(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/getTickets')
    @ApiBody({})
    async getTickets(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.employeeTicketsService.getTickets(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/getAllTickets')
    @ApiBody({})
    async getAllTickets(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.employeeTicketsService.getAllTickets(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/closeTicket')
    @ApiBody({})
    async closeTicket(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.employeeTicketsService.CloseTicket(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

}
