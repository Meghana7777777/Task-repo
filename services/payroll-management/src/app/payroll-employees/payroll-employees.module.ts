import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollEmployeesEntity } from './entites/payroll-employees.entity';
import { PayrollEmployeesController } from './payroll-employees.controller';
import { PayrollEmployeesService } from './payroll-employees.service';
import { PayrollEmployeesRepository } from './repositories/payroll-employees.repository';
import { PayrollRecordsModule } from '../payroll-records/payroll-records.module';
import { PayrollComponentsModule } from '../payroll-components/payroll-components.module';
import { EmpRecComModule } from '../emp-rec-components/emp-rec-components-module';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
@Module({
  imports: [TypeOrmModule.forFeature([PayrollEmployeesEntity])],
  controllers: [PayrollEmployeesController],
  providers: [PayrollEmployeesRepository, PayrollEmployeesService, ApplicationExceptionHandler],
  exports: [PayrollEmployeesRepository, PayrollEmployeesService]  // Added for DI
})
export class PayrollEmployeesModule { }
