import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attendance_swipes')
export class AttendanceSwipes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_number', type: 'varchar', length: 11, nullable: true })
  employeeNumber: string;

  @Column({ name: 'employee_name', type: 'varchar', length: 100, nullable: true })
  employeeName: string;

  @Column({ name: 'card_number', type: 'varchar', length: 50, nullable: true })
  cardNumber: string;

  @Column({ name: 'swipe_date', type: 'date', nullable: true })
  swipeDate: Date;

  @Column({ name: 'swipe_time', type: 'time', nullable: true })
  swipeTime: string;

  @Column({ name: 'branch', type: 'varchar', length: 100, nullable: true })
  branch: string;

  @Column({ name: 'reader_number', type: 'int', nullable: true })
  readerNumber: number;

  @Column({ name: 'ip', type: 'varchar', length: 45, nullable: true })
  ip: string;

  @Column({ name: 'in_out', type: 'enum', enum: ['IN', 'OUT'], nullable: true })
  inOut: 'IN' | 'OUT';

  @Column({ name: 'downloaded_date_time', type: 'datetime', nullable: true })
  downloadedDateTime: Date;

  @Column({ name: 'status', type: 'tinyint', default: 0 })
  status: number;
  
}
