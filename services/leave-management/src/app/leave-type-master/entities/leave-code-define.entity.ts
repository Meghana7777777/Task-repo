import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('leave_code_define')
export class LeaveCodeDefineEntity {
    @PrimaryGeneratedColumn("increment", { name: "id", })
    id: number;

    @Column({ name: 'leave_group_code_id', type: 'int', nullable: false })
    leaveGroupCodeId: number;

    @Column({ name: 'leave_group_id', type: 'int', nullable: false })
    leaveGroupId: number;

    @Column({ name: 'leave_type_id', type: 'int', nullable: false })
    leaveTypeId: number;

    @Column({ name: 'accum_qty', type: 'decimal',default: 0, precision: 10, scale: 1, nullable: false })
    accumQty: number; 

    @Column({ name: 'count_per_month_year', type: 'varchar', nullable: false })
    countPerMonthYear: string;

    @Column({ name: 'calculation', type: 'varchar', nullable: false })
    calculation: string;

    @Column({ name: 'special_instructions', type: 'varchar', nullable: false })
    specialInstructions: string;

    @Column({ name: 'accum_period', type: 'varchar', nullable: true })
    accumPeriod: string;
  
    @Column({ name: 'collapse', type: 'varchar', nullable: false })
    collapse: string;
  
    @Column({ name: 'collapse_month', type: 'varchar', nullable: false })
    collapseMonth: string;
  
    @Column({ name: 'encash_limit', type: 'int', nullable: false })
    encashLimit: number;

    @Column({ name: 'collapse_count', type: 'int', nullable: false })
    collapseCount: number;
  
    @Column({ name: 'carry_forward', type: 'int', nullable: false })
    carryForward: number;

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