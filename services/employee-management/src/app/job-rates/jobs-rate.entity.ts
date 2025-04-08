// src/entities/master.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('jobs_rate')
export class JobsRateEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column('int',name:"job_id", { unique: true })
    // jobId: number;

    // @Column('int', { nullable: true })
    // branchId: number;

    // @Column('varchar', { nullable: true })
    // effFromDate: string;

    // @Column('varchar', { nullable: true })
    // rate: string;
    @Column('int', {
        name: 'job_id',
    })
    jobId: number;

    @Column('int', {
        name: 'branch_id',
    })
    branchId: number;

    @Column('varchar', {
        name: 'eff_from_date',
    })
    effFromDate: string;

    @Column('varchar', {
        name: 'rate',
    })
    rate: string;


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
