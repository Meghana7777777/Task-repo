// src/entities/master.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('day_wise_pay')
export class DayWisePayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {
        name: 'job_id',
        unique: true
    })
    jobId: number;

    @Column('int', {
        name: 'emp_id',
        nullable: true
    })
    empId: number;

    @Column('varchar', {
        name: 'job_code',
        nullable: true
    })
    jobCode: string;

    @Column('varchar', {
        name: 'emp_code',
        nullable: true
    })
    empCode: string;

    @Column('varchar', {
        name: 'pay_date',
        nullable: true
    })
    payDate: string;

    @Column('varchar', {
        name: 'pay_month',
        nullable: true
    })
    payMonth: string;

    @Column('varchar', {
        name: 'units',
        nullable: true
    })
    units: string;

    @Column('varchar', {
        name: 'add_earn',
        nullable: true
    })
    addEarn: string;

    @Column('varchar', {
        name: 'add_dedu',
        nullable: true
    })
    addDedu: string;

    @Column('varchar', {
        name: 'job_rate',
        nullable: true
    })
    jobRate: string;

    @Column('varchar', {
        name: 'emp_pay',
        nullable: true
    })
    empPay: string;

    @Column('int', {
        name: 'job_status',
        nullable: true
    })
    jobStatus: string;

    @Column({
        name: 'created_user',
        nullable: true
    })
    createdUser: string;

    @Column({
        name: 'updated_user',
        nullable: true
    })
    updatedUser: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp'
    })
    updatedAt: Date;

    @Column({
        name: 'is_active',
        default: true
    })
    isActive: boolean;

    @Column({
        name: 'version_flag',
        default: 1
    })
    versionFlag: number;
}
