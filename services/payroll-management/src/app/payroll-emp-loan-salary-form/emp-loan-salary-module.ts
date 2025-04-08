import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeLoanEntity } from './entity/emp-loan-salary-entity';
import { Employee } from 'services/employee-management/src/app/employee-onboarding/entities/employee-details.entity';
import { DesignationsEntity } from 'services/employee-management/src/app/designations/entites/designations.entity';
import { EmpLoanSalaryService } from './emp-loan-salary-service';
import { EmpLoanSalaryRepo } from './emp-loan-salary-repo';
import { EmpLoanSalaryController } from './emp-loan-salary-controller';
import { EmpNonRecTermsEntity } from '../payroll-records/entites/emp-non-rec-terms.entity';
import { EmployeeNonRecurringTermsRepository } from '../payroll-records/repositories/emp-non-rec-terms.repo';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeLoanEntity,EmpNonRecTermsEntity,])],
  controllers: [EmpLoanSalaryController],
  providers: [ ApplicationExceptionHandler,EmpLoanSalaryRepo,EmpLoanSalaryService,Employee,EmployeeNonRecurringTermsRepository],
  exports: [EmpLoanSalaryService]
})
export class EmpLoanSalaryModule { }
