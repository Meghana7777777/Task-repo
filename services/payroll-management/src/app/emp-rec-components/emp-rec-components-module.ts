import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollComponentsEntity } from '../payroll-components/entites/payroll-components.entity';
import { PayrollComponentsService } from '../payroll-components/payroll-components.service';
import { PayrollEmployeesEntity } from '../payroll-employees/entites/payroll-employees.entity';
import { PayrollEmployeesModule } from '../payroll-employees/payroll-employees.module';
import { EmpRecComController } from './emp-rec-components-controller';
import { EmpRecComService } from './emp-rec-components-service';
import { EmpRecComponentsEntity } from './entities/emp-ec-components-entities';
import { EmpRecComRepository } from './entities/emp-rec-components.repo';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { PayrollRecordsModule } from '../payroll-records/payroll-records.module';
import { EmployeeOnboardingService, PayrollRecordsSharedService } from '@hrexpert/shared-services';

@Module({
  imports: [TypeOrmModule.forFeature([EmpRecComponentsEntity, PayrollEmployeesEntity, PayrollComponentsEntity]), forwardRef(() => PayrollRecordsModule)
  ],
  controllers: [EmpRecComController],
  providers: [EmpRecComRepository, EmpRecComService, ApplicationExceptionHandler, PayrollComponentsRepository, PayrollRecordsSharedService, EmployeeOnboardingService],
  exports: [EmpRecComRepository]
})
export class EmpRecComModule { }
