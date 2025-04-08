import { Injectable } from '@nestjs/common';
import { PayrollEmployeesRepository } from './repositories/payroll-employees.repository';
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { PayrollRecordsRepository } from '../payroll-records/repositories/payroll-records.repository';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { EmpRecComRepository } from '../emp-rec-components/entities/emp-rec-components.repo';
import { PayrollRecordsEntity } from '../payroll-records/entites/payroll-records.entity';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';

@Injectable()
export class PayrollEmployeesService {
    constructor(
        private payrollEmployeesRepository: PayrollEmployeesRepository,

    ) { }

    async getPayRollEmpDetails(): Promise<CommonResponseModel> {
        try {
            const data = await this.payrollEmployeesRepository.find()
            if (data) {
                return new CommonResponseModel(true, 1, 'Date Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 1, 'Date not Found', data)
            }

        } catch (err) {
            return err
        }
    }


}
