import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { RoomStatusEnum, ScheduleStatus } from "../../../../../../libs/shared-models/src/lib/enums/meeting-room-enums";
import { MeetingRoomEntity } from "./meeting-room-entity";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";

@Entity("bookings")
export class Bookings extends AbstractEntity {


  @ManyToOne(() => MeetingRoomEntity, (room) => room.bookings)
  @JoinColumn({ name: "room_id" })
  room: MeetingRoomEntity;

  @Column({ type: "timestamp", name: 'start_time' })
  startTime: Date;

  @Column({ type: "timestamp", name: 'end_time' })
  endTime: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  purpose: string;

  @Column({ type: "enum", name: 'room_status', enum: RoomStatusEnum, default: RoomStatusEnum.PENDING })
  roomStatus: RoomStatusEnum;

  @Column({ type: "enum", name: 'approve_status', enum: ScheduleStatus, default: ScheduleStatus.OPEN })
  approveStatus: ScheduleStatus;


}
