import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { EmailSendingService, EmployeeOnboardingService, HolidayCalanderService, LeavePolicyService, PayrollAttendanceSharedService, ShiftService, WeekOffLeavesService, WhatsUpService } from '@hrexpert/shared-services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance-controller';
import { AttendanceService } from './attendance-service';
import { AttendanceEntity } from './dto/attendance-entity';
import { AttendanceRepo } from './dto/attendance-repo';
import { AttendanceSwipes } from './dto/attendance-swipes-entity';
import { ApplyCoOdUploadEntity } from './entity/apply-co-od-upload.entity';
import { AppyCoOdUploadRepository } from './repo/apply-co-od-upload.repo';
import { AttendanceSwipesRepository } from './repo/attendance-swipes.repository';
import { OTApprovalLogRepo } from './dto/ot-approval-log-repo';
import { OTApprovalLog } from './dto/ot-approval-log';
import { AttendanceAdjustment } from './dto/attendance-adjustment.entity';
import { ConsolidatedAttendanceLogEntity } from './entity/consoladate-attendance-logs.entity';
import { ConsolidatedAttendanceLogRepository } from './repo/consolidated-attendance-log.repository';
import { AttendanceLogRepo } from './dto/attedance-log-repo';
import { AttendanceLog } from './dto/attendance-log-entity';
import { TeamCalenderRepository } from '../team-calender/repository/team-calender.repository';
import { TeamCalender } from '../team-calender/entity/team-calender.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AttendanceAdjustmentRepoRepository } from './repo/attendance-adjustment-repo';
import { ShiftChangeRepository } from '../shift-change/repository/shift-change-repo';
import { ShiftChangeReqEntity } from '../shift-change/entity/shift-change.entity';
import { AttendanceStatusRepository } from '../attendance-status-configuration/repositories/attendance-status-repo';
import { AttendanceStatusEntity } from '../attendance-status-configuration/attendance-status.entity';
import { LeaveAllocationsRepository } from '../leave-allocation/repos/leave-allocation-repository';
import { LeaveAllocations } from '../leave-allocation/entities/leave-allocation-entity';
import { LeaveTypeMasterEntity } from '../leave-type-master/entities/leave-type.entity';
import { NewLeaveAllocationsEntity } from '../leave-type-master/entities/new-leave-allocations-entity';
import { EmployeeOnboardingModule } from 'services/employee-management/src/app/employee-onboarding/employee-onboarding.module';
import { LateMinMomentRecordsRepository } from './repo/late-min-moment-records.repo';
import { lateMinutesRecordsEntity } from './entity/late-minutes-moment-records-entity';
@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([AttendanceEntity, AttendanceSwipes, ApplyCoOdUploadEntity,OTApprovalLog,AttendanceLog,TeamCalender,AttendanceAdjustment,ConsolidatedAttendanceLogEntity,ShiftChangeReqEntity,AttendanceStatusEntity,LeaveAllocations, LeaveTypeMasterEntity, NewLeaveAllocationsEntity, EmployeeOnboardingModule,lateMinutesRecordsEntity])],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepo, AttendanceSwipesRepository, ApplicationExceptionHandler, EmployeeOnboardingService, HolidayCalanderService, AppyCoOdUploadRepository,OTApprovalLogRepo,AttendanceLogRepo,TeamCalenderRepository,ShiftService,ConsolidatedAttendanceLogRepository,WeekOffLeavesService,AttendanceAdjustmentRepoRepository,WhatsUpService,ShiftChangeRepository,PayrollAttendanceSharedService,AttendanceStatusRepository,LeavePolicyService,LeaveAllocationsRepository,EmailSendingService,LateMinMomentRecordsRepository ],
  exports:[AttendanceRepo,LateMinMomentRecordsRepository] 
})
export class AttendanceModule { }
