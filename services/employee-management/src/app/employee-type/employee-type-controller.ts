import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmployeeTypeService } from './employee-type-service';
import { EmployeeTypeDto } from './dto/employee-type-dto';

@Controller('/employee-type')
@ApiTags('/employee-type')
export class EmployeeTypeController {
    constructor(
        private service: EmployeeTypeService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createEmployeeType')
    @ApiBody({ type: EmployeeTypeDto })
    async createEmployeeType(@Body() req: EmployeeTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createEmployeeType(req,false);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeeTypes')
    async getAllEmployeeTypes(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeeTypes();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateEmplloyeeType')
    @ApiBody({ type: EmployeeTypeDto })
    async updateBranch(@Body() req: EmployeeTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.createEmployeeType(req,true);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveEmployeeType')
    async getActiveEmployeeType(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveEmployeeType();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateEmployeetype')
    @ApiBody({ type: EmployeeTypeDto })
    async activateOrDeactivateEmployeetype(@Body() dto: EmployeeTypeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateEmployeetype(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
