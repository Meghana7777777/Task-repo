import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookings } from './entity/bookings.entity';
import { TrainingCenterEntity } from './entity/training-center-entity';
import { BookingsRepository } from './repo/bookings.repo';
import { TrainingCenterRepository } from './repo/training-center-repo';
import { TrainingCenterController } from './training-center-controller.controller';
import { TrainingCenterService } from './training-center-service.';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingCenterEntity, Bookings])],
  controllers: [TrainingCenterController],
  providers: [TrainingCenterService, TrainingCenterRepository, BookingsRepository, ApplicationExceptionHandler],
  exports: [TrainingCenterRepository],
})
export class TrainingCenterModule { }
