import { Column, Entity, OneToMany } from "typeorm";
import { RoomStatusEnum } from "../../../../../../libs/shared-models/src/lib/enums/meeting-room-enums";
import { Bookings } from "./bookings.entity";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";

@Entity('training_center')
export class TrainingCenterEntity extends AbstractEntity {

  @Column('varchar', {
    name: 'meeting_room',
    nullable: false,
  })
  meetingRoom: string;

  @Column({ type: "int", nullable: true })
  capacity: number;

  @Column({ type: "varchar", nullable: true, length: 255 })
  location: string;

  @OneToMany(() => Bookings, (booking) => booking.room)
  bookings: Bookings[];

  @Column({ type: "enum", name: 'room_status', enum: RoomStatusEnum, default: RoomStatusEnum.AVAILABLE })
  roomStatus: RoomStatusEnum;

  @Column('varchar', {
    name: 'room_approver',
    nullable: false,
  })
  roomApprover: string;

  @Column('int', {
    name: 'room_approver_id',
    nullable: false,
  })
  roomApproverId: number;

  @Column('varchar', {
    nullable: true,
    length: 300,
    name: 'file_path'
  })
  filePath: string;

  @Column('varchar', {
    nullable: true,
    length: 250,
    name: 'file_name'
  })
  fileName: string;

  @Column('varchar', {
    nullable: true,
    length: 250,
    name: 'original_name'
  })
  originalName: string;
}