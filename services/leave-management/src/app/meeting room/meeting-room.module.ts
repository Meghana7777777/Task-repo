import { Module } from '@nestjs/common';
import { MettingRoomService } from './metting-room-service.';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoomEntity } from './entity/meeting-room-entity';
import { MeetingRoomController } from './meeting-room-controller.controller';
import { MeetingRoomRepository } from './repo/meeting-room-repo';
import { Bookings } from './entity/bookings.entity';
import { BookingsRepository } from './repo/bookings.repo';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoomEntity,Bookings])],
  controllers: [MeetingRoomController],
  providers: [MettingRoomService, MeetingRoomRepository,BookingsRepository, ApplicationExceptionHandler],
  exports: [MeetingRoomRepository],
})
export class MeetingRoomModule { }
