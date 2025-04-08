import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MeetingRoomEntity } from '../entity/meeting-room-entity';
import { Bookings } from '../entity/bookings.entity';

@Injectable()
export class MeetingRoomRepository extends Repository<MeetingRoomEntity> {
  constructor(private dataSource: DataSource) {
    // Correctly initialize the base Repository class
    super(MeetingRoomEntity, dataSource.createEntityManager());
  } 

  async getAllMeetingRooms(): Promise<any> {
    return await this.createQueryBuilder('mr')
      .select([
        'mr.id AS id',
        'mr.meeting_room AS meetingRoom',
        'mr.is_active AS isActive',
        'mr.room_status AS roomStatus',
        'mr.location AS location',
        'mr.room_approver AS roomApprover',
        'mr.room_approver_id AS roomApproverId',
        'mr.capacity AS capacity',
        'mr.file_name AS fileName',
        'mr.file_path AS filePath',
        'mr.original_name AS originalName'
      ])
      .getRawMany();
  }
}
