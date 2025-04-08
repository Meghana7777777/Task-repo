import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('leave_group_code_mapping')
export class LeaveGroupCodeMappingEntity {
    @PrimaryGeneratedColumn("increment", { name: "id", })
    id: number;

    @Column({ name: 'generated_code_id', type: 'int', nullable: false })
    generatedCodeId: number;

    @Column({ name: 'leave_group_id', type: 'int', nullable: false })
    leaveGroupId: number;

    @Column({ name: 'employee_type_id', type: 'int', nullable: false })
    employeeTypeId: number;

    @Column({ name: 'branch_id', type: 'int', nullable: false })
    branchId: number;

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