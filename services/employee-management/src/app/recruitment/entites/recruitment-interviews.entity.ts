import { interviewStatus, InterViewType } from "@hrexpert/shared-models";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('recruitment_interviews')
export class RecruitmentInterviewsEntity {

    @PrimaryGeneratedColumn('increment', {
        name: 'id'
    })
    id: number;

    @Column({
        nullable: true,
        name: 'interview_date',
    })
    interviewDate: Date

    @Column({ type: 'enum', enum: InterViewType, name: 'interview_type' })
    interviewType: InterViewType;

    @Column("int", {
        nullable: true,
        name: 'inter_viewer',
    })
    interviewer: number

    @Column("varchar", {
        nullable: true,
        name: 'interviewer_mob_no',
    })
    interviewerMobNo: string

    @Column("int", {
        nullable: true,
        name: 'client',
    })
    client: number

    @Column("int", {
        nullable: true,
        name: 'job_role',
    })
    jobRole: number


    @Column("int", {
        nullable: true,
        name: 'candidate_name',
    })
    candidateName: number


    @Column("varchar", {
        nullable: true,
        name: 'referred_by',
    })
    referredBy: string


    @Column({ type: 'enum', enum: interviewStatus, name: 'status' })
    status: interviewStatus;


    @Column("varchar", {
        nullable: true,
        name: 'remarks',
    })
    remarks: string



    @CreateDateColumn({
        name: "created_at",
        nullable: true,
        default: "current_timestamp(6)",
    })
    createdAt: Date;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "created_user",
    })
    createdUser: string;

    @UpdateDateColumn({
        name: "updated_at",
        nullable: true,
        default: "current_timestamp(6)",
    })
    updatedAt: Date;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "updated_user",
    })
    updatedUser: string;

    @VersionColumn({
        default: 1,
        name: "version_flag",
    })
    versionFlag: number;

    @Column("boolean", {
        nullable: false,
        name: "is_active",
        default: true,
    })
    isActive: boolean;


}