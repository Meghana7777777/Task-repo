import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TrainingCenterEntity } from '../entity/training-center-entity';

@Injectable()
export class TrainingCenterRepository extends Repository<TrainingCenterEntity> {
  constructor(private dataSource: DataSource) {
    // Correctly initialize the base Repository class
    super(TrainingCenterEntity, dataSource.createEntityManager());
  }

  async getAllTrainingCenterRepo(): Promise<any> {
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
