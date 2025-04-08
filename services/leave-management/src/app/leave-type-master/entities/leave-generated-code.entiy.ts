import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('leave_generated_code')
export class LeaveGeneratedCodeEntity {
    @PrimaryGeneratedColumn("increment", { name: "id", })
    id: number;

    @Column({ name: 'generated_code', type: 'varchar', nullable: false })
    generatedCode: string;

    @Column({ name: 'state', type: 'varchar', nullable: false })
    state: string;

    @Column({ name: 'is_active', type: 'boolean', nullable: true })
    isActive: boolean;

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