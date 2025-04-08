import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DayWisePayModule } from './day-wise-pay/day-wise-pay.module';
import { GmailModule } from './email-sender/email-sender.module';
import { EmpRecComModule } from './emp-rec-components/emp-rec-components-module';
import { PayrollAttendanceModule } from './payroll-attendance/payroll-attendance-module';
import { PayrollComponentsModule } from './payroll-components/payroll-components.module';
import { PayrollEmployeeComponentAmountsModule } from './payroll-emp-comp-amt/payroll-emp-comp-amt.module';
import { EmpLoanSalaryModule } from './payroll-emp-loan-salary-form/emp-loan-salary-module';
import { PayrollEmployeesModule } from './payroll-employees/payroll-employees.module';
import { PayrollProcessedLogModule } from './payroll-processed-log/payroll-processed-log.module';
import { PayrollRecordsModule } from './payroll-records/payroll-records.module';
import { PayrollTypesModule } from './payroll-types/payroll-types.module';
import { PayrollChecklistModule } from './payroll-checklist/payroll-checklist.module';
import { ComponentNamesModule } from './component-name-master/components-names.module';
import { PayrollCodeBranchMappingModule } from './code-branch-emptype-mapping/code-branch-emptype-mapping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    PayrollTypesModule, PayrollComponentsModule, PayrollEmployeesModule, PayrollRecordsModule, DatabaseModule, PayrollEmployeeComponentAmountsModule, PayrollAttendanceModule, EmpRecComModule, PayrollProcessedLogModule, GmailModule,
    EmpLoanSalaryModule, DayWisePayModule, PayrollChecklistModule,ComponentNamesModule,PayrollCodeBranchMappingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
