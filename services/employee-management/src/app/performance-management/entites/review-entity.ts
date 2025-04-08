import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('performance_review_ratings')
export class ReviewRatingsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { name: 'emp_code' })
    employeeCode: string;

    @Column('text', { name: 'competence' })
    competence: Text;

    @Column('text', { name: 'description' })
    description: Text;

    @Column('varchar', { name: 'rating' })
    rating: string;
   
    @Column('varchar', { name: 'rm_rating' })
    rmRating: string;

    @Column('text', { name: 'remarks' })
    remarks: Text;
    
    @Column('text', { name: 'rm_remarks' })
    rmRemarks: Text;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
