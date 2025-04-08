// holidays.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { AbstractEntity } from '../../../../masters/src/database/common-entities';
import { HolidayType } from '@hrexpert/shared-models';

@Entity('holidays')
export class HolidaysEntity extends AbstractEntity {

    @Column({
        name: 'name',
        nullable: false,
    })
    holidayName: string;

    @Column({
        name: 'date',
        nullable: false,
    })
    holidayDate: string;

    @Column('enum', {
        name: 'type',
        enum: HolidayType
    })
    type: HolidayType

    @Column('int', {
        nullable: false,
        name: 'branch_id'
    })
    branchId: number;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime'
    })
    createdAt: Date;

    @Column('varchar', {
        nullable: true,
        name: 'created_user'
    })
    createdUser: string | null;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime'
    })
    updatedAt: Date;

    @Column('varchar', {
        nullable: true,
        name: 'updated_user'
    })
    updatedUser: string | null;

    @VersionColumn({
        default: 1,
        name: 'version_flag'
    })
    versionFlag: number;
}
