import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { EmployeeOnboardingService, PayrollComponentsSharedService, WhatsUpService } from '@hrexpert/shared-services';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpNonRecComponentsEntity } from './entites/emp-non-rec-components.entity';
import { EmpNonRecTermsEntity } from './entites/emp-non-rec-terms.entity';
import { EmpRecComponentsEntity } from './entites/emp-rec-components.entity';
import { PayrollRecordsEntity } from './entites/payroll-records.entity';
import { PayrollRecordsController } from './payroll-records.controller';
import { PayrollRecordsService } from './payroll-records.service';
import { EmployeeNonRecurringComponentsRepository } from './repositories/emp-non-rec-components.repo';
import { EmployeeNonRecurringTermsRepository } from './repositories/emp-non-rec-terms.repo';
import { PayrollRecordsRepository } from './repositories/payroll-records.repository';
import { PayrollComponentsModule } from '../payroll-components/payroll-components.module';
import { EmpRecComModule } from '../emp-rec-components/emp-rec-components-module';
import { EmployeeNonRecurringLogsRepository } from './repositories/emp-non-rec-terms-logs.repo';
import { NonRecTermsLogsEntity } from './entites/emp-non-rec-terms-logs.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([PayrollRecordsEntity, EmpNonRecComponentsEntity, EmpNonRecTermsEntity, EmpRecComponentsEntity, NonRecTermsLogsEntity]), forwardRef(() => EmpRecComModule), forwardRef(() => PayrollComponentsModule)
  ],
  controllers: [PayrollRecordsController],
  providers: [PayrollRecordsRepository, EmployeeNonRecurringComponentsRepository, EmployeeNonRecurringTermsRepository, PayrollRecordsService, ApplicationExceptionHandler, PayrollComponentsSharedService, WhatsUpService, EmployeeOnboardingService, EmployeeNonRecurringLogsRepository],
  exports: [PayrollRecordsRepository, EmployeeNonRecurringTermsRepository, PayrollRecordsService, EmployeeNonRecurringComponentsRepository, EmployeeNonRecurringLogsRepository],
})
export class PayrollRecordsModule { }
