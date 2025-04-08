import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayrollEmployeeComponentAmountsService } from './payroll-emp-comp-amt.service';

@Controller('/payroll_employee_component_amounts')
@ApiTags('/payroll_employee_component_amounts')
export class PayrollEmployeeComponentAmountsController {
    constructor(
        private payrollTypesService: PayrollEmployeeComponentAmountsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

}
