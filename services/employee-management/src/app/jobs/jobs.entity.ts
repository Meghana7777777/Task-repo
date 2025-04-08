// src/entities/master.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('jobs')
export class JobsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {name: 'job_code', unique: true })
    jobCode: string;

    @Column('varchar', {name: 'job_description', nullable: true })
    jobDescription: string;

    @Column({name: 'created_user', nullable: true })
    createdUser: string;

    @Column({name: 'updated_user', nullable: true })
    updatedUser: string;

    @CreateDateColumn({name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({name: 'is_active', default: true })
    isActive: boolean;

    @Column({name: 'version_flag', default: 1 })
    versionFlag: number;
}
