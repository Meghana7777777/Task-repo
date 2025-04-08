import { LateMinRecordsEnum, LateMinRecStatusEnum } from '@hrexpert/shared-models';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('late_minutes_records')
export class lateMinutesRecordsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_code', type: 'varchar', length: 11, nullable: true })
  employeeCode: string;

  @Column({ name: 'date', type: 'varchar', length: 15, nullable: true })
  date: string;

  @Column({ name: 'swipe_in_time', type: 'time', nullable: true })
  swipeInTime: string;

  @Column({ name: 'swipe_out_time', type: 'time',  nullable: true })
  swipeOutTime: string;
 
  @Column('enum', {
    name: 'swipes_enum',
    enum: LateMinRecordsEnum
  })
  swipesEnum: LateMinRecordsEnum

  @Column({ name: 'actual_late_min', type: 'int', nullable: true })
  actualLateMin: number;

  @Column({ name: 'final_late_min', type: 'int', nullable: true })
  finalLateMin: number;

  @Column({ name: 'remarks', type: 'varchar', length: 100 })
  remarks: string;

  @Column('enum', {
    name: 'status',
    enum: LateMinRecStatusEnum
  })
  status: LateMinRecStatusEnum

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: string;

  @Column("varchar", {
    nullable: true,
    length: 40,
    name: "created_user",
  })
  createdUser: string | null;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: string;

  @Column("varchar", {
    nullable: true,
    length: 40,
    name: "updated_user",
  })
  updatedUser: string | null;

  @VersionColumn({
    default: 1,
    name: "version_flag",
  })
  versionFlag: number;

  @Column({
    nullable: false,
    name: "is_active",
    default: 1
  })
  isActive: boolean;

}
