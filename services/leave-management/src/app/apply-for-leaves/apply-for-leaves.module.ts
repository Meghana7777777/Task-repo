import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { AttendanceServices, EmployeeOnboardingService, HolidayCalanderService, LeaveAllocationService, LeavePolicyService, TypesOfLeavesService, WeekOffLeavesService } from '@hrexpert/shared-services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyForLeavesAdapter } from './adapter/apply-for-leaves.adapter';
import { ApplyForLeavesController } from './apply-for-leaves.controller';
import { ApplyForLeaveService } from './apply-for-leaves.service';
import { ApplyForLeavesEntity } from './entities/apply-for-leaves.entity';
import { ApplyForLeavesRepository } from './repositories/apply-for-leaves.repository';
import { WhatsUpService } from '@hrexpert/shared-services';
import { LeaveAllocationsRepository } from '../leave-allocation/repos/leave-allocation-repository';
import { LeaveAllocationsModule } from '../leave-allocation/leave-allocation-module';
import {EmployeeOnboardingModule} from '../../../../employee-management/src/app/employee-onboarding/employee-onboarding.module';
import {TypesOfLeavesModule} from '../../../../masters/src/app/types-of-leaves/types-of-leave.module'
import { AttendanceModule } from '../attendance/attendance-module';
import { ExceededLeavesRepository } from './repositories/exceeded-leaves.repository';
import { ExceededLeavesEntity } from './entities/exceeded-leaves.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ApplyForLeavesEntity,ExceededLeavesEntity]),LeaveAllocationsModule,EmployeeOnboardingModule,TypesOfLeavesModule, AttendanceModule],
  controllers: [ApplyForLeavesController],
  providers: [ApplyForLeavesRepository, ApplyForLeaveService, ApplicationExceptionHandler, ApplyForLeavesAdapter, EmployeeOnboardingService, HolidayCalanderService, WeekOffLeavesService, AttendanceServices, TypesOfLeavesService, LeaveAllocationService, WhatsUpService,LeavePolicyService,ExceededLeavesRepository]
})
export class ApplyForLeavesModule { }
