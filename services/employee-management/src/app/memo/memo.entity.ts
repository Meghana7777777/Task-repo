// src/entities/master.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('memo')
export class MemoEntity {
    @PrimaryGeneratedColumn()
    id: number;  

    @Column('varchar', { name: 'date', nullable: true })
    date: string;

    @Column('varchar', { name: 'type', nullable: true })
    type: string;

    @Column('varchar', { name: 'feedback_on', nullable: true })
    feedBackOn: string;

    @Column('int', { name: 'employee_id', nullable: true })
    employeeId: number;

    @Column('varchar', { name: 'description', nullable: true })
    description: string;

    @Column('varchar', { name: 'impact_on_bussiness', nullable: true })
    impactOnBussiness: string;

    @Column({ name: 'created_user', nullable: true })
    createdUser: string;

    @Column({ name: 'updated_user', nullable: true })
    updatedUser: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'version_flag', default: 1 })
    versionFlag: number;
}
