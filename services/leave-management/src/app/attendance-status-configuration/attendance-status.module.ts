import { Module } from '@nestjs/common';
import { AttendanceStatusController } from './attendance-status.controller';
import { AttendanceStatusService } from './attendance-status.service';
import { AttendanceStatusEntity } from './attendance-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { AttendanceStatusRepository } from './repositories/attendance-status-repo';

@Module({
  imports:[TypeOrmModule.forFeature([AttendanceStatusEntity])],
  controllers: [AttendanceStatusController],
  providers: [AttendanceStatusService,AttendanceStatusRepository, ApplicationExceptionHandler]
})
export class AttendanceStatusModule {}
