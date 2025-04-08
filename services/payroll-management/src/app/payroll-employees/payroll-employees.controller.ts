import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/shared-models';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayrollEmployeesService } from './payroll-employees.service';

@Controller('/payroll-employees')
@ApiTags('/payroll-employees')
export class PayrollEmployeesController {
    constructor(
        private readonly applicationExceptionHandler: ApplicationExceptionHandler,
        private payrollEmployeesService: PayrollEmployeesService
    ) { }


    @Post('/getPayRollEmpDetails')
    async getPayRollEmpDetails(): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.payrollEmployeesService.getPayRollEmpDetails();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
