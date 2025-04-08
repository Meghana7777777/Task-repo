import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity('ot_approval_log')
export class OTApprovalLog {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {
        name: 'emp_id',
        nullable: false,
    })
    empId: number

    @Column('varchar', {
        name: 'emp_code',
        nullable: false,
    })
    empCode: string

    @Column('text', {
        name: 'reason',
        nullable: false,
    })
    reason: Text

    @Column('varchar', {
        name: 'final_ot_hours',
        nullable: false,
    })
    finalOtHours: string

    @Column('varchar', {
        name: 'in_time',
        nullable: false,
    })
    inTime: string

    @Column('varchar', {
        name: 'out_time',
        nullable: false,
    })
    outTime: string

    @Column('varchar', {
        name: 'date',
        nullable: false,
    })
    date: string
    
    @Column('int', { name: 'department_id', nullable: true })
    departmentId: number;

    @Column('int', { name: 'designation_id', nullable: true })
    designationId: number;

    @Column('int', { name: 'division_id', nullable: true })
    divisionId: number;

    @Column('varchar', { name: 'division_name', nullable: true })
    divisionName: string;

    @Column('int', { name: 'branch_id', nullable: true })
    branch_id: number;

    @Column('varchar', { name: 'branches', nullable: true })
    branches: string;

    @Column('varchar', { name: 'shift_type', nullable: true })
    shiftType: string;

    @Column('varchar', { name: 'department', nullable: true })
    department: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: true })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: true })
    unitCode: string
    
    @Column('varchar', { name: 'status', nullable: true })
    status: string;

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
    ;

}
