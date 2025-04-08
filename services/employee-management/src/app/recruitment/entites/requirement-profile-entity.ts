import { interviewProfileStatus, interviewStatus, InterViewType } from '@hrexpert/shared-models';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

export enum CandidateType {
  EXPERIENCED = 'Experienced',
  FRESHER = 'Fresher',
}

export enum SourceType {
  INTERNAL = 'Internal',
  CONSULTANCY = 'Consultancy',
  DIRECT = 'Direct',
}

@Entity('candidate_profiles')
export class CandidateProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
    public uuid: string;

  @Column({ length: 255, name: 'candidate_name' })
  candidateName: string;

  @Column("int", {nullable: true, name: 'job_role',})
  jobRole: number

  @Column({ name: 'profile_date' })
  profileDate: string;

  @Column({ length: 255, name: 'qualification' })
  qualification: string;

  @Column({ length: 255, name: 'technologies' })
  technologies: string;

  @Column({ length: 255, name: 'stack' })
  stack: string;

  @Column({ type: 'enum', enum: CandidateType, name: 'candidate_type' })
  candidateType: CandidateType;

  @Column({ type: 'enum', enum: SourceType, name: 'source_type' })
  sourceType: SourceType;

  @Column("int", { name: 'referred_by',})
  referredBy: number

  @Column('decimal', { name: 'expected_ctc' })
  expectedCTC: number;

  @Column('decimal', { name: 'current_ctc' })
  currentCTC: number;

  @Column('int', { name: 'experience' })
  experience: number;

  @Column('int', { name: 'notice_period' })
  noticePeriod: number;

  @Column({ length: 20, name: 'mobile_number' })
  mobileNumber: string;

  @Column({ length: 20, nullable: true, name: 'alternative_mobile' })
  alternativeMobile: string;

  @Column({ length: 500, nullable: true, name: 'remarks' })
  remarks: string;

  @Column({ length: 500, nullable: true, name: 'resume_path' })
  resumePath: string;

  @Column({ length: 500, nullable: true, name: 'resume_name' })
  resumeName: string;

  @Column({ length: 255, name: 'email' })
  email: string;

  @Column({ name: 'assigned', type: 'boolean', default: true })
  assigned: boolean;

  @Column("int", { name: 'assigned_id' })
  assignedId: number

  @Column('varchar', { name: 'interview_status', length: 50, nullable: true })
  interviewStatus: string;

  @Column({ name: 'is_registered', type: 'boolean', default: true })
  isRegistered: boolean;

  @Column('varchar', { name: 'created_user', length: 255, nullable: true })
  createdUser: string;

  @Column('varchar', { name: 'updated_user', length: 255, nullable: true })
  updatedUser: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'version_flag', type: 'int', default: 1 })
  versionFlag: number;
}