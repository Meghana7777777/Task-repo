import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveBalance } from './entities/leaves-balance.entity';
import { MonthlyLeaveBalanceLogs } from './entities/monthly-leave-balance.entity';
import { LeaveBalanceController } from './leave-balance.controller';
import { LeaveBalanceService } from './leave-balance.service';
import { LeaveBalanceRepository } from './repos/leave-balance-repo';
import { MonthlyLeaveBalanceRepository } from './repos/monthly-leave-balance.repo';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { LeaveGroupMasterEntity } from '../leave-type-master/entities/leave-group-master.entity';
import { LeaveMasterEntity } from '../leave-type-master/entities/leave-master.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LeaveBalance,MonthlyLeaveBalanceLogs, LeaveGroupMasterEntity, LeaveMasterEntity])],
  controllers: [LeaveBalanceController],
  providers: [LeaveBalanceService,LeaveBalanceRepository, MonthlyLeaveBalanceRepository, ApplicationExceptionHandler, EmployeeOnboardingService],
  exports: [LeaveBalanceRepository, MonthlyLeaveBalanceRepository],
})
export class LeaveBalanceModule {}
