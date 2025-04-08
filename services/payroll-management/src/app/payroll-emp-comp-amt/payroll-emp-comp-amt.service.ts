import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PayrollEmployeeComponentAmountsRepository } from './repositories/payroll-emp-comp-amt.repository';

@Injectable()
export class PayrollEmployeeComponentAmountsService {
    constructor(
        private payrollEmployeeComponentAmountsRepository: PayrollEmployeeComponentAmountsRepository,
        private dataSource: DataSource
    ) { }

}
