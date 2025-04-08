import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmpRecComService } from './emp-rec-components-service';
import { EmpRecComponentsDto } from './dto/emp-rec-components.dto';


@Controller('/emp-rec-components')
@ApiTags('/emp-rec-components')
export class EmpRecComController {
    constructor(
        private readonly applicationExceptionHandler: ApplicationExceptionHandler,
        private service: EmpRecComService
    ) { }

    @Post('/createEmpRecComponent')
    @ApiBody({ type: EmpRecComponentsDto })
    async createEmpRecComponent(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createEmpRecComponent(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createEmpNonRecComponent')
    @ApiBody({ type: EmpRecComponentsDto })
    async createEmpNonRecComponent(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createEmpNonRecComponent(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpRecComponent')
    async getEmpRecComponent(): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpRecComponent();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpExtraMessDaysForPayroll')
    async getEmpExtraMessDaysForPayroll(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpExtraMessDaysForPayroll(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/uploadEmpRecComponent')
    async uploadEmpRecComponent(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.uploadEmpRecComponent(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/messExtraDaysExcel')
    async messExtraDaysExcel(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.messExtraDaysExcel(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
