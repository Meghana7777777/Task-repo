import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplyForLeavesModule } from './apply-for-leaves/apply-for-leaves.module';
import { AttendanceModule } from './attendance/attendance-module';
import { LeaveAllocationsModule } from './leave-allocation/leave-allocation-module';
import { TeamCalenderModule } from './team-calender/team-calender.module';
import { ShiftChangeModule } from './shift-change/shift-change.module';
// import { EmployeeOnboardingModule } from './../../../employee-management/src/app/employee-onboarding/employee-onboarding.module';
import { DepartmentsModule } from './../../../employee-management/src/app/departments/departments.module';
import { DesignationsModule } from './../../../employee-management/src/app/designations/designations.module'
import { BranchesModule } from './../../../employee-management/src/app/branches/branches.module' 
import { DivisionModule } from './../../../employee-management/src/app/division/division.module'
import { TypesOfLeavesModule } from 'services/masters/src/app/types-of-leaves/types-of-leave.module';
import { EmployeeOnboardingModule } from 'services/employee-management/src/app/employee-onboarding/employee-onboarding.module';
import { LeavePolicyModule } from './leave-policy/leave-policy.module';
import { HolidayCalendarModule } from './holiday_calendar/holiday_calendar.module';
import { AttendanceStatusModule } from './attendance-status-configuration/attendance-status.module';
import { LeaveGroupModule } from './leave-group/leave-group-module';
import { LeaveTypeModule } from './leave-type-master/leave-type-master.module';
import { LeaveBalanceModule } from './leave-balance-new/leave-balance.module';
import { MeetingRoomModule } from './meeting room/meeting-room.module';
import { TrainingCenterModule } from './training center/training-center.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'employee-directory/meeting-room-uploads'),
      serveRoot: '/meetingRoom',
      serveStaticOptions: {
        redirect: false, 
        index: false
      }
    }),
    DatabaseModule,
    AttendanceModule,
    LeaveAllocationsModule,
    TeamCalenderModule,
    ApplyForLeavesModule,
    ShiftChangeModule,
    EmployeeOnboardingModule,
    DepartmentsModule,
    DesignationsModule,
    BranchesModule,
    DivisionModule,
    TypesOfLeavesModule,
    LeavePolicyModule,
    HolidayCalendarModule,
    AttendanceStatusModule,
    LeaveGroupModule,
    LeaveTypeModule,
    LeaveBalanceModule,
    MeetingRoomModule,
    TrainingCenterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
