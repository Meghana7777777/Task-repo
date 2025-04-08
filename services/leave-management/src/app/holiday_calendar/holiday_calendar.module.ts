import { Module } from '@nestjs/common';
import { HolidayCalendarController } from './holiday_calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidaysEntity } from './holiday_calendar.entity';
import { HolidayCalanderService } from './holiday_calendar.service';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { HolidaysRepository } from './repositories/holiday_cal.repo';
import { AttendanceRepo } from '../attendance/dto/attendance-repo';
import { AttendanceEntity } from '../attendance/dto/attendance-entity';

@Module({
  imports:[TypeOrmModule.forFeature([HolidaysEntity,AttendanceEntity])],
  controllers: [HolidayCalendarController],
  providers: [HolidayCalanderService, ApplicationExceptionHandler, HolidaysRepository,AttendanceRepo]
})
export class HolidayCalendarModule {}
