import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('performance_achievements')
export class AchievementsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { name: 'emp_code'})
    employeeCode: string;

    @Column('varchar', { name: 'impact_areas'})
    impactAreas: string;

    @Column('text', { name: 'key_achievements' })
    keyAchievements: Text;

    @Column('text', { name: 'manager_assessments' })
    managerAssessments: Text;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
