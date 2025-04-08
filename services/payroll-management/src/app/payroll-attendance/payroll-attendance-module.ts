import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollAttendanceEntity } from './entites/payroll-attendance-entity';
import { PayrollAttendanceService } from './payroll-attendance-service';
import { PayrollAttendanceController } from './payroll-attendance-controller';
import { PayrollAttendanceRepository } from './payroll-attendance-repository';
import { AttendanceServices, EmployeeOnboardingService, EmpRecCompSharedService } from '@hrexpert/shared-services';
import { PayrollRecordsModule } from '../payroll-records/payroll-records.module';
import { PayrollProcessedLogModule } from '../payroll-processed-log/payroll-processed-log.module';
import { PayrollEmployeesModule } from '../payroll-employees/payroll-employees.module';
import { PayrollComponentsModule } from '../payroll-components/payroll-components.module';
import { EmpRecComModule } from '../emp-rec-components/emp-rec-components-module';
import { PayrollWeeklyAttendanceRepository } from './payroll-weekly-attendance-repo';
import { PayrollWeeklyAttendanceEntity } from './entites/payroll-weekly-attendance-entity';
import { DayWisePayService } from '../day-wise-pay/day-wise-pay.service';
import { DayWisePayModule } from '../day-wise-pay/day-wise-pay.module';
import { DayWisePayRepository } from '../day-wise-pay/day-wise-pay.repo';
@Module({
  imports: [TypeOrmModule.forFeature([PayrollAttendanceEntity, PayrollWeeklyAttendanceEntity]), PayrollRecordsModule, PayrollProcessedLogModule, PayrollEmployeesModule, PayrollComponentsModule, EmpRecComModule, DayWisePayModule],
  controllers: [PayrollAttendanceController],
  providers: [PayrollAttendanceRepository, PayrollAttendanceService, ApplicationExceptionHandler, AttendanceServices, EmployeeOnboardingService, PayrollWeeklyAttendanceRepository, EmpRecCompSharedService]
})
export class PayrollAttendanceModule { }
