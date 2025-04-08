import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { DepartmentsDTO } from './dto/departments-dto';
import { DepartmentIdDto } from './dto/department-id.dto';

@Controller('/departments')
@ApiTags('/departments')
export class DepartmentsController {
    constructor(
        private service: DepartmentsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createDepartments')
    @ApiBody({ type: DepartmentsDTO })
    async createDepartments(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createDepartments(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllDepartments')
    async getAllDepartments(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllDepartments()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateDepartment')
    async updateDepartment(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateDepartment(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
 
    @Post('/activateDeactivateDepartment')
    async activateDeactivateDepartment(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.activateDeactivateDepartment(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllActiveDepartments')
    async getAllActiveDepartments(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveDepartments()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveDepartments')
    async getActiveDepartments(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveDepartments()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getdeparmentName')
    async getdeparmentName(@Body() dto:DepartmentIdDto):Promise<any> {
      try {
        return await this.service.getdeparmentName(dto)
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
  
      }
    }  
}
