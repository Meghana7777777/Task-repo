import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { LeaveAllocationsController } from './leave-allocation-controller';
import { LeaveAllocationsService } from './leave-allocation-service';
import { LeaveAllocationsRepository } from './repos/leave-allocation-repository';
import { LeaveAllocationsLogRepository } from './repos/leave-allocation-log-repo';
import { LeaveAllocations } from './entities/leave-allocation-entity';
import { LeaveAllocationsLog } from './entities/leave-allocation-log.entity';
import { LeaveAdjustmentEntity } from './entities/leave-adjustment-entity';
import { LeaveAdjustmentRepository } from './repos/leave-adjustment.repo';
import { LeaveAllocationsMonthlyLogs } from './entities/leave-allocations-monthly-logs-entity';
import { LeaveAllocationsMonthlyLogRepository } from './repos/leave-allocations-monthly-logs-repo';
import { IsLeaveAllocatedLogRepository } from './repos/is-leave-allocated-logs-repo';
import { IsLeaveAllocatedLogs } from './entities/is-leaves-allocated-logs-entity';

@Module({
  imports:[TypeOrmModule.forFeature([LeaveAllocations,LeaveAllocationsLog, LeaveAdjustmentEntity, LeaveAllocationsMonthlyLogs, IsLeaveAllocatedLogs])],
  controllers: [LeaveAllocationsController],
  providers: [LeaveAllocationsService,LeaveAllocationsRepository, LeaveAllocationsLogRepository, ApplicationExceptionHandler, LeaveAdjustmentRepository, LeaveAllocationsMonthlyLogRepository, IsLeaveAllocatedLogRepository],
  exports: [LeaveAllocationsRepository, LeaveAllocationsLogRepository, LeaveAllocationsMonthlyLogRepository, IsLeaveAllocatedLogRepository],
})
export class LeaveAllocationsModule {}
