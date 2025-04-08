import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('swipe_process_log')
export class SwipeProcessLogEntity {
  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;
  
  @Column({ name: 'swipe_date', type: 'varchar', nullable: false })
  swipeDate: string;

  @Column({ name: 'time', type: 'decimal', nullable: false })
  time: string;

  @Column({ name: 'reader_download_time', type: 'varchar', nullable: false })
  readerDownloadTime: string;

  @Column({ name: 'pass_records', type: 'int', nullable: false })
  passRecords: number;
  
  @Column({ name: 'fail_records', type: 'int', nullable: false })
  failRecords: number;

  @Column({ name: 'pending_records', type: 'int', nullable: true })
  pendingRecords: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'created_user'
  })
  createdUser: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'updated_user'
  })
  updatedUser: string | null;

}